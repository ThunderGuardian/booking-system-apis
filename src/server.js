// src/server.js
require("dotenv").config();
require("../config/db");
require("../jobs/bookingConfirmation.job");

require("../jobs/eventUpdateNotification.job");
require("../jobs/ticketLockRelease.job");

const app = require("../app");
app.listen(3000, () => console.log("Server running on port 3000"));
