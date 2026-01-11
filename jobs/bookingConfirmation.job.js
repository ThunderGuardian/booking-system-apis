const { Worker } = require("bullmq");
const { connection } = require("../config/redis");
const Booking = require("../models/Booking");

new Worker(
  "bookingQueue",
  async job => {
    const booking = await Booking
      .findById(job.data.bookingId)
      .populate("customer event");

    console.log(`
📧 Email Sent
To: ${booking.customer.email}
Event: ${booking.event.title}
Tickets: ${booking.tickets}
`);
  },
  { connection }
);
