const express = require("express");
const engines = require("consolidate");
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://chuhieu:hieu12345678@cluster0.fyat7.mongodb.net/test";

app.get("/", async function (req, res) {
  let client = await MongoClient.connect(url);
  let dbo = client.db("ToyDB");
  let results = await dbo.collection("Toy").find({}).toArray();
  res.render("index1", { model: results });
});

app.get("/toy", async function (req, res) {
  let client = await MongoClient.connect(url);
  let dbo = client.db("ToyDB");
  let results = await dbo.collection("Toy").find({}).toArray();
  res.render("index1", { model: results });
});

//user submit form
app.post("/doSearch", async (req, res) => {
  let inputName = req.body.txtName;
  let client = await MongoClient.connect(url);
  let dbo = client.db("ToyDB");
  let results = await dbo
    .collection("Toy")
    .find({
      $or: [{ name: new RegExp(search, "i") }, { price: { $lt: 5000 } }],
    })
    .toArray();
  res.render("index1", { model: results });
});

app.get("/insert", (req, res) => {
  res.render("insert");
});
app.post("/doInsert", async (req, res) => {
  let inputName = req.body.txtName;
  let inputPrice = req.body.txtPrice;
  let inputImage = req.body.Image;
  let newToy = { name: inputName, price: inputPrice, image: inputImage };

  let client = await MongoClient.connect(url);
  let dbo = client.db("ToyDB");
  if (isNaN(inputPrice)) {
    let errorModel = {
      priceError: "Must be a number",
    };
    res.render("insert", { model: errorModel });
  } else {
    await dbo.collection("Toy").insertOne(newToy);
    res.redirect("/toy");
  }
});
app.get("/delete", async (req, res) => {
  let inputId = req.query.id;
  let client = await MongoClient.connect(url);
  let dbo = client.db("ToyDB");
  var ObjectID = require("mongodb").ObjectID;
  let condition = { _id: ObjectID(inputId) };
  await dbo.collection("Toy").deleteOne(condition);
  res.redirect("/toy");
});
const PORT = process.env.PORT || 1209;
var server = app.listen(PORT, function () {});
