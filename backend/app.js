const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use('/api/places', placesRoutes); /// this enables placeRoutes to be used as middleware

app.use((error, req, res, next) => { /// special error handling middleware
  if (res.headerSent) {
    return next(error);
  }
  return res.status(error.code || 500).json({message: error.message || "An unknown error occurred!"});
});

app.listen(5000);
 