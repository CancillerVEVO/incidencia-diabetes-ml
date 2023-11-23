const fs = require("fs");

let data = null;

function getData() {
  if (data) return data;

  let exists = false;

  fs.existsSync("./data.json", (result) => {
    exists = result;
  });

  if (!exists) {
    // calculate data
    return null;
  }

  fs.readFileSync("./data.json", "utf8", (err, jsonString) => {
    if (err) {
      process.exit(1);
      return;
    }

    try {
      data = JSON.parse(jsonString);
    } catch (err) {
      process.exit(1);
      return;
    }
  });

  return data;
}

module.exports = {
  getData,
};
