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

const expireDateGenerator = (time) => {
  let timer = time ? time : 1;
  const date = new Date();
  date.setDate(date.getDate() + timer);
  return date;
};

// status sebelumnya dari order, id dari order
const dropEventGenerator = (status, id, carts) => {
  let result;
  switch (status) {
    case 1:
      return [`DROP EVENT IF EXISTS deadline_proses_resep_${id};`];
    case 2:
      result = [`DROP EVENT IF EXISTS deadline_pesanan_resep_${id};`];
      for (let i = 0; i < carts.length; i++) {
        result = [
          ...result,
          `DROP EVENT IF EXISTS deadline_pesanan_resep_${id}_${i};`,
        ];
      }
      return result;
    case 3:
      result = [`DROP EVENT IF EXISTS deadline_pembayaran_${id};`];
      for (let i = 0; i < carts.length; i++) {
        result = [
          ...result,
          `DROP EVENT IF EXISTS deadline_pembayaran_${id}_${i};`,
        ];
      }
      return result;
    case 4:
      result = [`DROP EVENT IF EXISTS deadline_proses_pesanan_${id};`];
      for (let i = 0; i < carts.length; i++) {
        result = [
          ...result,
          `DROP EVENT IF EXISTS deadline_proses_pesanan_${id}_${i};`,
        ];
      }
      return result;
    default:
      return null;
  }
};

// status order terbaru, id dari order, carts isi order di checkout_cart
const expireEventGenerator = (status, id, carts) => {
  let result;
  carts = carts ? carts : [];
  switch (status) {
    case 1:
      return [
        `CREATE EVENT IF NOT EXISTS deadline_proses_resep_${id} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY COMMENT 'deadline proses resep dari admin, maksimal 1 hari dari request order' DO UPDATE orders SET status = 7, pesan = "Admin tidak dapat memproses pesanan kamu" WHERE id = ${id};`,
      ];
    case 2:
      result = [
        `CREATE EVENT IF NOT EXISTS deadline_pesanan_resep_${id} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY DO UPDATE orders SET status = 7, pesan = "Kamu tidak melanjutkan transaksi sebelum batas waktu yang telah ditentukan" WHERE id = ${id};`,
      ];
      for (let i = 0; i < carts.length; i++) {
        result = [
          ...result,
          `CREATE EVENT IF NOT EXISTS deadline_pesanan_resep_${id}_${i} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY DO UPDATE product_stock SET stock = stock + ${carts[i].qty} WHERE id = ${carts[i].stock_id};`,
        ];
      }
      return result;
    case 3:
      result = [
        `CREATE EVENT IF NOT EXISTS deadline_pembayaran_${id} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY DO UPDATE orders SET status = 7, pesan = "Kamu tidak membayar transaksi sebelum batas waktu yang telah ditentukan" WHERE id = ${id};`,
      ];
      for (let i = 0; i < carts.length; i++) {
        result = [
          ...result,
          `CREATE EVENT IF NOT EXISTS deadline_pembayaran_${id}_${i} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY DO UPDATE product_stock SET stock = stock + ${carts[i].qty} WHERE id = ${carts[i].stock_id};`,
        ];
      }
      return result;
    case 4:
      result = [
        `CREATE EVENT IF NOT EXISTS deadline_proses_pesanan_${id} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY DO UPDATE orders SET status = 7, pesan = "Admin tidak dapat memproses pesanan kamu" WHERE id = ${id};`,
      ];
      for (let i = 0; i < carts.length; i++) {
        result = [
          ...result,
          `CREATE EVENT IF NOT EXISTS deadline_proses_pesanan_${id}_${i} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY DO UPDATE product_stock SET stock = stock + ${carts[i].qty} WHERE id = ${carts[i].stock_id};`,
        ];
      }
      return result;
    default:
      return null;
  }
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
  expireDateGenerator,
  expireEventGenerator,
  dropEventGenerator,
};
