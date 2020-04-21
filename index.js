const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const logger = morgan("tiny");
app.use(cors());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
    {
      stream: logger.successLogStream,
      skip: function (req, res) {
        return res.statusCode >= 400;
      },
    }
  )
);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
    {
      stream: logger.errorLogStream,
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    }
  )
);

app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(204).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = Math.floor(Math.random() * 1000);
  return maxId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  person = persons.find((person) => person.name === body.name);

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  if (person) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  persons = persons.concat(newPerson);
  response.json(newPerson);
});

app.get("/api/info", (req, res) => {
  res.json(`Phonebook has info for ${persons.length} people ${new Date()}`);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
