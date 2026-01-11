const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  createEvent,
  updateEvent,
  getEvents
} = require("../controllers/event.controller");

router.get("/", getEvents);
router.post("/", auth, role("ORGANIZER"), createEvent);
router.put("/:id", auth, role("ORGANIZER"), updateEvent);

module.exports = router;
