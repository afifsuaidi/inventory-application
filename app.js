require("dotenv").config();

const express = require("express");
const path = require("path");

const indexRoutes = require("./routes/indexRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/categories", categoryRoutes);
app.use("/items", itemRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "Halaman yang kamu cari tidak ditemukan.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).render("error", {
    title: "Server Error",
    message: "Terjadi kesalahan pada server.",
  });
});

app.listen(PORT, () => {
  console.log(`Inventory App running at http://localhost:${PORT}`);
});
