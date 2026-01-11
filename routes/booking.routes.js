const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { bookTickets } = require("../controllers/booking.controller");

router.post("/", auth, role("CUSTOMER"), bookTickets);

module.exports = router;
