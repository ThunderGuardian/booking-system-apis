const { redis } = require("../config/redis");
const { Queue } = require("bullmq");
const { connection } = require("../config/redis");

// Dedicated queue for ticket lock release
const ticketLockQueue = new Queue("ticketLockQueue", { connection });

// Lock tickets for an event
exports.lockTickets = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { tickets } = req.body;
    if (!tickets || tickets <= 0) {
      return res.status(400).json({ message: "Invalid ticket amount" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.availableTickets < tickets) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }
    // Check if already locked for this user (optional: can be extended for user-specific lock)
    const redisKey = `lock:${eventId}`;
    const existingLock = await redis.get(redisKey);
    if (existingLock) {
      return res.status(409).json({ message: "Tickets already locked for this event" });
    }
    // Subtract tickets and save
    event.availableTickets -= tickets;
    await event.save();
    // Store lock in Redis for 6 hours (21600 seconds)
    await redis.set(redisKey, tickets, "EX", 21600);
    // Queue job to release after 15s
    await ticketLockQueue.add("release-lock", { eventId, tickets }, { delay: 15000 });
    return res.json({ message: "Tickets locked", eventId, tickets });
  } catch (err) {
    console.error("Lock tickets error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const Event = require("../models/Event");
const { eventQueue } = require("../queues");

exports.createEvent = async (req, res) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user.id
  });
  res.json(event);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  await eventQueue.add("event-update", {
    eventId: event._id
  });

  res.json(event);
};

exports.getEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};
