const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { bookingQueue } = require("../queues");

exports.bookTickets = async (req, res) => {
  const { eventId, tickets } = req.body;

  const event = await Event.findById(eventId);
  if (!event || event.availableTickets < tickets) {
    return res.status(400).json({ message: "Not enough tickets" });
  }

  event.availableTickets -= tickets;
  await event.save();

  const booking = await Booking.create({
    customer: req.user.id,
    event: eventId,
    tickets
  });

  await bookingQueue.add("booking-confirmation", {
    bookingId: booking._id
  });
  

  res.json(booking);
};
