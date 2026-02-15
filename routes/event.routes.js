const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  createEvent,
  updateEvent,
  getEvents
} = require("../controllers/event.controller");


// Lock tickets for an event
const { lockTickets } = require("../controllers/event.controller");
router.post("/:id/lock-tickets", auth, role("CUSTOMER"), lockTickets);

router.get("/", getEvents);
router.post("/", auth, role("ORGANIZER"), createEvent);
router.put("/:id", auth, role("ORGANIZER"), updateEvent);

module.exports = router;
