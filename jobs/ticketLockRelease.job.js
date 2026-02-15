const { Worker } = require("bullmq");
const { connection } = require("../config/redis");
const Event = require("../models/Event");
const { redis } = require("../config/redis");

console.log("[ticketLockRelease.job.js] Worker file loaded");

new Worker(
  "ticketLockQueue",
  async job => {
    console.log(`[ticketLockRelease.job.js] Processing job:`, job);
    const { eventId, tickets } = job.data;
    const redisKey = `lock:${eventId}`;
    const locked = await redis.get(redisKey);
    console.log(`[ticketLockRelease.job.js] Redis key: ${redisKey}, locked: ${locked}`);
    if (locked) {
      // Release tickets back to DB
      const event = await Event.findById(eventId);
      if (event) {
        event.availableTickets += parseInt(locked, 10);
        await event.save();
        console.log(`[ticketLockRelease.job.js] Tickets restored to event ${eventId}`);
      } else {
        console.log(`[ticketLockRelease.job.js] Event not found: ${eventId}`);
      }
      await redis.del(redisKey);
      // Simulate sending message to FE
      console.log(
        `🔔 [TokenWatcher] Booking session for event ${eventId} suspended. Tickets released back to pool.`
      );
    } else {
      console.log(`[ticketLockRelease.job.js] No lock found for event ${eventId}`);
    }
  },
  { connection }
);
