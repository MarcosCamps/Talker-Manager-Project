const { writeFile } = require('fs').promises;

const writeFIle = async (data) => {
  await writeFile('./talker.json', JSON.stringify(data));
};

module.exports = writeFIle;