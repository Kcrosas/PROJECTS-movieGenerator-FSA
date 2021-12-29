const express = require("express");
const app = express();
const path = require("path");
//For use with generator random movie name
const faker = require("faker");

//Express routes

app.use("/dist", express.static(path.join(__dirname, "dist")));

//Route to grab all movies
app.get("/api/movies", async (req, res, next) => {
  try {
    res.send(await Movie.findAll());
  } catch (error) {
    next(error);
  }
});

//Route that generates a new movie
app.post("/api/movies", async (req, res, next) => {
  try {
    res.send(await Movie.newMovie());
  } catch (error) {
    next(error);
  }
});

//Route deletes movie
app.delete("/api/movies/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    await Movie.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, msg: "Product Deleted" });
  } catch (err) {
    console.error(err);
  }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

//DATABASE AND PORT CONFIGS BELOW

//For use with interacting with the db
const Sequelize = require("sequelize");
const { STRING, INTEGER } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/movies"
);

const Movie = conn.define("movie", {
  name: STRING,
  rating: {
    type: INTEGER,
    defaultValue: 3,
  },
});

Movie.newMovie = function () {
  return this.create({ name: faker.lorem.word().toUpperCase() });
};

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  await Promise.all([
    Movie.create({ name: "Fullstack vs FlatIron", rating: 5 }),
    Movie.create({ name: "Prof Returns", rating: 5 }),
    Movie.create({ name: "2110: The A Team", rating: 5 }),
  ]);
};

const init = async () => {
  try {
    //seed the db
    await syncAndSeed();
    //Port configurations
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`ACTIVE on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

init();
