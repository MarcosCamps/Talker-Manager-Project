const express = require('express');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
const readFIle = require('./helpers/readFile');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  try {
    const talker = await readFIle();
    res.status(200).json(talker);
  } catch (error) {
   res.status(400).json({ message: error });
  }
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const talker = await readFIle();
    const talkerId = talker.find((person) => person.id === +id);
    if (talkerId) return res.status(200).json(talkerId);
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.post('/login', (_req, res) => {
  const token = randomUUID().split('-').join('').substring(0, 16);
  res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
