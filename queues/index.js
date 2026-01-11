const { Queue } = require("bullmq");
const { connection } = require("../config/redis");

const bookingQueue = new Queue("bookingQueue", { connection });
const eventQueue = new Queue("eventQueue", { connection });

module.exports = {
  bookingQueue,
  eventQueue
};
