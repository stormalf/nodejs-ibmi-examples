const express = require("express");
const bodyParser = require("body-parser");
const { hostname } = require("os");

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
};
const pool = require("node-jt400").pool(config);
const library = process.env.LIBRARY;

const app = express();
const port = process.env.PORT || 8001;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
// directory to serve static files
app.use("/public", express.static(`${__dirname}/public`));
// required to parse json encoded bodies
app.use(bodyParser.json());

// FRONTEND HTML ROUTES
app.get("/", async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT COUNID, COUNDE FROM " + library + ".COUNTRY order by COUNID ASC"
    );
    res.render("countries/index", { title: "Countries", results });
  } catch (error) {
    console.error(error);
    res.status(500).send("error processing your request");
  }
});

app.get("/countries/new", (req, res) => {
  res.render("countries/new", { result: {}, formMethod: "POST" });
});

app.get("/countries/:id", async (req, res) => {
  const sql =
    "SELECT COUNID, COUNDE FROM " + library + ".COUNTRY WHERE COUNID = ?";
  try {
    const data = await pool.query(sql, [req.params.id]);
    res.render("countries/show", {
      title: "Countries",
      result: data[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error processing your request");
  }
});

app.get("/countries/:id/edit", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT COUNID, COUNDE FROM " + library + ".COUNTRY WHERE COUNID = ?",
      [req.params.id]
    );
    res.render("countries/edit", {
      title: "Countries",
      result: data[0],
      formMethod: "PUT",
      disable: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error processing your request");
  }
});

// BACKEND API ROUTES
app.get("/api/countries", async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT COUNID, COUNDE FROM " + library + ".COUNTRY order by COUNID ASC"
    );
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: "failed to get countries" });
  }
});

app.get("/api/countries/:id", async (req, res) => {
  const sql =
    "SELECT COUNID, COUNDE FROM " + library + ".COUNTRY WHERE COUNID = ?";
  try {
    const data = await pool.query(sql, [req.params.id]);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: "failed to get country" });
  }
});

app.post("/api/countries/create", async (req, res) => {
  // TODO validate params
  const sql =
    "INSERT INTO " +
    library +
    ".COUNTRY (COUNID,COUNDE) VALUES (?, ?) with NONE";
  const params = [req.body.COUNID, req.body.COUNDE];

  console.log(params);

  try {
    await pool.execute(sql, params);
    res.send({ message: "added country" });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: "failed to add country" });
  }
});

app.put("/api/countries/update", async (req, res) => {
  const sql =
    "UPDATE " + library + ".COUNTRY SET COUNDE = ? WHERE COUNID = ? with NONE";
  const params = [req.body.COUNDE, req.body.COUNID];

  console.log(req.body);
  try {
    await pool.update(sql, params);
    res.send({ message: "updated country" });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: "failed to update country" });
  }
});

app.delete("/api/countries/:id/delete", async (req, res) => {
  try {
    await pool.update(
      "DELETE FROM " + library + ".COUNTRY WHERE COUNID = ? with NONE",
      [req.params.id]
    );
    console.log("delete was ok");
    res.send({ message: "deleted country" });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: "failed to delete country" });
  }
});

app.listen(port, () => {
  console.log(`Server running at:\nhttp://${hostname()}:${port}`);
});
