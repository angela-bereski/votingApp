const express = require("express");
const cors = require("cors");
const PORT = 8000;
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// middleware sends post data by adding it in

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://35.153.98.64");
  res.header(
    "Access-Control-Allow-Headers", *
  );
  next();
});

app.use(express.json()); /*  allows JSON Objects to be posted */
app.use(
  express.urlencoded({ extended: true })
); /* allows JSON Objects with strings and arrays*/

// middleware that adds cookies to the request
app.use(cookieParser());

require("./config/mongoose.config");

const CandidateRoutes = require("./routes/candidate.route");
CandidateRoutes(app);

const VoterRoutes = require("./routes/voter.route");
VoterRoutes(app);

const AdminRoutes = require("./routes/admin.route");
AdminRoutes(app);

app.listen(PORT, () => {
  console.log("Listening at Port 8000");
});
