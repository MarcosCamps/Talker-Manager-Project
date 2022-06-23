const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const readFIle = require('./helpers/readFile');
const loginMiddleware = require('./middlewares/loginMiddleware');
const authorizationMiddleware = require('./middlewares/authozirationMiddleware');
const nameMiddleware = require('./middlewares/nameMiddleware');
const ageMiddleware = require('./middlewares/ageMiddleware');
const talkerMiddleware = require('./middlewares/talkerMiddleware');
const watchedAtMiddleware = require('./middlewares/watchedAtMiddleware');
const rateMiddleware = require('./middlewares/rateMiddleware');
const writeFIle = require('./helpers/writeFile');

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

app.post('/login', loginMiddleware, (_req, res) => {
  const token = randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

app.post('/talker',
  authorizationMiddleware,
  nameMiddleware,
  ageMiddleware,
  talkerMiddleware,
  watchedAtMiddleware,
  rateMiddleware,
  async (req, res) => {
    const { name, age, talk } = req.body;
    try {
      const talker = await readFIle();
      const talkerPerson = { id: talker.length + 1, name, age, talk };
      talker.push(talkerPerson);
      writeFIle(talker);
      res.status(201).json(talkerPerson);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  });

  app.put('/talker/:id',
  authorizationMiddleware,
  nameMiddleware,
  ageMiddleware,
  talkerMiddleware,
  watchedAtMiddleware,
  rateMiddleware,
  async (req, res) => {
    const { id } = req.params;
    try {
      const talkers = await readFIle();
      const newTalkers = talkers.map((talker) => {
        if (talker.id === +id) return { id: +id, ...req.body };
        return talker;
      });
      writeFIle(newTalkers);
      res.status(200).json({ id: +id, ...req.body });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  });

app.listen(PORT, () => {
  console.log('Online');
});
