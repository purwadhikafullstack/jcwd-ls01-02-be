const fs = require("fs");

const dateGenerator = (full) => {
  const current = new Date();
  const date = ("0" + current.getDate()).slice(-2);
  const month = ("0" + (current.getMonth() + 1)).slice(-2);
  const year = current.getFullYear().toString().substring(2);
  const hours = ("0" + current.getHours()).slice(-2);
  const minutes = ("0" + current.getMinutes()).slice(-2);
  if (full) {
    const seconds = ("0" + current.getSeconds()).slice(-2);
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  }
  return `${year}-${month}-${date} ${hours}:${minutes}`;
};

userIdCodeGenerator = (id) => {
  const idCode = [0, 0, 0];
  let code = "";
  for (let i = id; i > 0; i -= 99) {
    if (i <= 99) {
      idCode[0] = alphabetList[idCode[0]];
      idCode[1] = alphabetList[idCode[1]];
      idCode[2] = i > 9 ? i : "0" + i;
      idCode.forEach((val) => (code = code + `${val}`));
    }
    idCode[1]++;
    if (idCode[1] > 25) {
      idCode[0]++;
      idCode[1] = 0;
    }
  }
  return code;
};

const codeGenerator = (type, date, id) => {
  const suffix = type === "RESEP" ? "TR" : "TL";
  let dateCode;
  date = date.split(" ");
  date[0] = date[0].split("-").join("");
  date[1] = date[1].split(":").join("");
  dateCode = date[0] + date[1];
  let idCode = userIdCodeGenerator(id);
  return `${suffix}${dateCode}${idCode}`;
};

const photoNameGenerator = (file, dir, suffix) => {
  const defaultPath = "./public";
  console.log(file);
  fs.access(defaultPath + dir, (error) => {
    if (error) fs.mkdirSync(defaultPath + dir);
  });

  let originalName = file.originalname;
  let extention = originalName.split(".");
  let currentDate = dateGenerator(1).split(" ");
  currentDate[0] = currentDate[0].split("-").join("");
  currentDate[1] = currentDate[1].split(":").join("");
  let date = currentDate[0] + currentDate[1];
  let fileName = `${suffix}${date}.${extention[extention.length - 1]}`;
  let path = `${defaultPath + dir}/${fileName}`;
  let photo = `${dir}/${fileName}`;
  return { path, photo };
};

const productCodeGenerator = (category, golongan, id) => {
  console.log({ category, golongan, id });
  const code = [];
  if (category == 1) {
    code[0] = "O";
  } else if (category == 2) {
    code[0] = "N";
  } else if (category == 3) {
    code[0] = "H";
  } else if (category == 4) {
    code[0] = "V";
  } else if (category == 5) {
    code[0] = "A";
  } else if (category == 6) {
    code[0] = "P";
  } else if (category == 7) {
    code[0] = "I";
  }
  if (golongan == 1) {
    code[1] = "OB";
  } else if (golongan == 2) {
    code[1] = "OK";
  } else if (golongan == 3) {
    code[1] = "OT";
  } else if (golongan == 4) {
    code[1] = "MD";
  } else if (golongan == 5) {
    code[1] = "LL";
  }

  code[0] = code[0] + code[1];
  code[1] = userIdCodeGenerator(id);
  return code.join("-");
};

const alphabetList = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

module.exports = {
  dateGenerator,
  codeGenerator,
  productCodeGenerator,
  photoNameGenerator,
};
