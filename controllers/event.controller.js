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
