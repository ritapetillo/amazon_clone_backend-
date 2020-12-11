const { writeJSON, readJSON } = require("fs-extra");
const { join } = require("path");

const readFileJSON = async (filePath) => {
  try {
    let file = await readJSON(filePath);
    return file;
  } catch (err) {
    throw new Error("There was a problem reading the file");
  }
};

const writeFileJSON = async (filePath, content) => {
  try {
    await writeJSON(filePath, content);
  } catch (err) {
    throw new Error("There was a problem writing the file");
  }
};

module.exports = {writeFileJSON,readFileJSON}