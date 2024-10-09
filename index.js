const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.json());

// Função para gerar IDs aleatórios
const nanoid = () => Math.ceil(Math.random() * 1000000);

// Lista de notas
let notes = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
];

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :status - :response-time ms :body')) //Doesnt work ;-;

app.get('/api/persons', (req, res) => {
  res.json(notes);
});

app.get('/api/info', (req, res) => {
  const dataAtual = new Date();
  const html = `<p>Phonebook has info for ${notes.length} ${notes.length ? 'people' : 'person'}</p>${String(dataAtual)}`;
  res.send(html);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.statusMessage = 'Id note not found!';
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    notes = notes.filter((note) => note.id !== id);
    res.json(note);
  } else {
    res.statusMessage = 'Id note not found!';
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.statusMessage = 'Name or number missing';
    res.status(400).end();
  } else if (notes.find((note) => note.name === body.name)) {
    res.statusMessage = 'Name must be unique';
    res.status(409).end();
  } else {
    const person = {
      id: String(nanoid()),
      name: body.name,
      number: body.number,
    };
    notes = notes.concat(person);
    res.json(person);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
