const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json()); // application/json

app.use('/api/places', placesRoutes); /// this enables placeRoutes to be used as middleware
app.use('/api/users', usersRoutes); /// this enables userRoutes to be used as middleware

app.use((req, res, next) => { /// this is a middleware that will be executed for every request
    res.status(404).json({message: "Could not find this route."});
});

app.use((error, req, res, next) => { /// special error handling middleware
  if (res.headerSent) {
    return next(error);
  }
  return res.status(error.code || 500).json({message: error.message || "An unknown error occurred!"});
});

app.listen(5000);
 