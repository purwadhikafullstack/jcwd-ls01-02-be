const dateGenerator = () => {
  const current = new Date();
  const date = ("0" + current.getDate()).slice(-2);
  const month = ("0" + (current.getMonth() + 1)).slice(-2);
  const year = current.getFullYear().toString().substring(2);
  const hours = ("0" + current.getHours()).slice(-2);
  const minutes = ("0" + current.getMinutes()).slice(-2);
  return `${year}-${month}-${date} ${hours}:${minutes}`;
};

userIdCodeGenerator = (id) => {
  const idCode = [0, 0, 0];
  let total = 0;
  let code = "";
  for (let i = 1; idCode[0] <= 25 && idCode[1] <= 25; i += 100) {
    // if (i <= 99) {
    //   idCode[0] = alphabetList[idCode[0]];
    //   idCode[1] = alphabetList[idCode[1]];
    //   idCode[2] = i > 9 ? i : "0" + i;
    //   idCode.forEach((val) => (code = code + `${val}`));
    // }

    i -= 99;
    total += 99;

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
  return `${suffix}-${dateCode}-${idCode}`;
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

module.exports = { dateGenerator, codeGenerator };
