const express = require("express");
const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/auth", require("./routes/auth.routes"));

app.use("/events", require("./routes/event.routes"));

app.use("/bookings", require("./routes/booking.routes"));

module.exports = app;
