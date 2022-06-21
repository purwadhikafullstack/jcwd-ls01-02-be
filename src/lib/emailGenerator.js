const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jcwdls01.bootcamp02@gmail.com",
    pass: "virgoobfkpgxohkw",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* 
  emailGenerator function : function untuk membuat dan mengirim kan email, menerima 3 argumen:
  1. (data) yang akan dimasukkan ke dalam parameter (data), digunakan untuk membuat email dan data pengiriman email
  2. (link) yang akan dimasukkan ke dalam parameter (link), digunakan untuk disematkan di dalam email
  3. (true/false) yang akan dimasukkan ke dalam parameter (type), digunakan untuk menentukan template email yang digunakan (true == email verifikasi || false == email reset)
*/
const emailGenerator = async (data, link, type) => {
  try {
    const { username, email } = data;
    let emailType = type ? "verificationEmail.html" : "resetPasswordEmail.html";
    let filepath = path.resolve(__dirname, `../template/${emailType}`);
    let htmlString = fs.readFileSync(filepath, "utf-8");
    // (err, data) => {
    //   if (err) throw err;
    //   return data;
    // });

    const template = handlebars.compile(htmlString);
    const htmlToEmail = template({ username, link });

    await transporter.sendMail({
      from: "HealthMed <lbrqspurs@gmail.com>",
      to: email,
      subject: "HealthMed Account Verification E-mail",
      html: htmlToEmail,
    });
  } catch (error) {
    throw new Error((error.message = "Email failed"));
  }
};

module.exports = { emailGenerator };
