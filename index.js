const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const {
  productRoutes,
  authRoutes,
  adminRoutes,
  profileRoutes,
  rajaOngkirRoutes,
  transactionRoutes,
} = require("./src/routes");
const PORT = process.env.PORT;

morgan.token("date", () => {
  new Date().toString();
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

app.use(express.json());

app.use(cors({ exposedHeaders: ["x-token-access", "x-total-count"] }));

app.get("/", (req, res) => {
  res.status(200).send("<h1>API Server JCWDLS001-02</h1>");
});
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/product", productRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);
app.use("/transaction", transactionRoutes);
app.use("/raja-ongkir", rajaOngkirRoutes);
app.listen(PORT, () =>
  console.log(`API Server JCWDLS001-02 Running on Port ${PORT}`)
);
