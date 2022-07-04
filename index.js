const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const {
  productRoutes,
  authRoutes,
  adminRoutes,
  profileRoutes,
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
  res.status(200).send("<h1>API Backend for Bootcamp Project</h1>");
});
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/product", productRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);

app.listen(PORT, () => console.log(`API running on Port ${PORT}`));
