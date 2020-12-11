const { writeJSON, readJSON,writeFile } = require("fs-extra");
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
const writeFileImage = async (filePath, content) => {
  try {
    await writeFile(filePath, content);
  } catch (err) {
    throw new Error("There was a problem writing the file");
  }
};
module.exports = { writeFileJSON, readFileJSON, writeFileImage };