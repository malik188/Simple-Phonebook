const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json()); // Middleware to parse JSON bodies (required for POST requests)
// app.use(morgan("tiny"));

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons/", (req, res) => {
  res.json(persons);
});

app.get("/api/info", (req, res) => {
  const date = new Date();
  const info = `<p>Phonebook has info for ${persons.length} people</p>
                <p>${date}</p>`;
  res.send(info);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: "Note not found" });
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 10000).toString();
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  // Check for duplicate names
  const existingPerson = persons.find((person) => person.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
