const { Worker } = require("bullmq");
const { connection } = require("../config/redis");
const Booking = require("../models/Booking");

new Worker(
  "eventQueue",
  async job => {
    const bookings = await Booking
      .find({ event: job.data.eventId })
      .populate("customer");

    bookings.forEach(b => {
      console.log(`🔔 Notifying ${b.customer.email} about event update`);
    });
  },
  { connection } 
);
