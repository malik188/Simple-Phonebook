require("dotenv").config();
const express = require("express");
const Person = require("./models/person");

const app = express();
const morgan = require("morgan");
const person = require("./models/person");

app.use(express.json()); // Middleware to parse JSON bodies (required for POST requests)
app.use(express.static("dist"));

// Defining a custom token for morgan to log the request body for POST requests
morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/info", (req, res) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date();
      const info = `<p>Phonebook has info for ${count} people</p>
                    <p>${date}</p>`;
      res.send(info);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error retrieving person count");
    });
});

// Endpoint to get all data
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// Endpoint to get a specific data
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    // Handle promise rejection (e.g., invalid ID format)
    .catch((error) => next(error));
});

// Endpoint to create a new data
app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "content missing" });
  }
  // Check if name already exists, if so, update the number
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        // Update the number if name exists
        return Person.findByIdAndUpdate(
          existingPerson._id,
          { number: body.number },
          { new: true }
        );
      } else {
        // Create new person if name does not exist
        const person = new Person({
          name: body.name,
          number: body.number,
        });
        return person.save();
      }
    })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

// Endpoint to delete a data
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Endpoint to update a data
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Middleware for handling errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
