const { readFile } = require('fs').promises;

const readFIle = async () => {
  const talkers = await readFile('./talker.json', 'utf8');
  return JSON.parse(talkers);
};

module.exports = readFIle;