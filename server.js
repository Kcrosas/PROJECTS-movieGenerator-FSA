const express = require("express");
const app = express();
const path = require("path");
//For use with generator random movie name
const faker = require("faker");

//Express routes

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/media", express.static(path.join(__dirname, "media")));

// Body parsing middleware (only needed for POST & PUT requests)
app.use(express.json());
//app.use(express.urlencoded({ extended: true })); // This line is only needed for older dependencies

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

//Updates the movie
app.put("/api/movies/:id", async (req, res, next) => {
  try {
    //finds the movie based on the id of the url

    const movie = await Movie.findByPk(req.params.id);
    await movie.update(req.body);
    //Not needed because movie variable is updated automatically variable const updatedMovie = await Movie.findByPk(req.params.id);
    console.log(JSON.stringify(movie));
    res.send(movie);
  } catch (err) {
    next(err);
  }
});

//Route deletes movie
app.delete("/api/movies/:id", async (req, res) => {
  try {
    const movieDelete = await Movie.findByPk(req.params.id);
    movieDelete.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

//DATABASE AND PORT CONFIGS BELOW

//For use with interacting with the db
const Sequelize = require("sequelize");
const { applyMiddleware } = require("redux");
const { STRING, INTEGER } = Sequelize;
let conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/movies"
);

const Movie = conn.define("movie", {
  name: STRING,
  rating: {
    type: INTEGER,
    defaultValue: 3,
    validate: {
      max: 5,
      min: 1,
    },
  },
});

Movie.newMovie = function () {
  const name = faker.lorem.word();
  const nameMod = name.charAt(0).toUpperCase() + name.slice(1);
  return this.create({ name: nameMod });
};

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  await Promise.all([
    Movie.create({ name: "Fullstack vs FlatIron", rating: 3 }),
    Movie.create({ name: "Prof Returns", rating: 3 }),
    Movie.create({ name: "2110: The A Team", rating: 3 }),
  ]);
};
let PORT = process.env.PORT || 8080;
const init = async () => {
  try {
    //seed the db
    await syncAndSeed();
    //Port configurations

    app.listen(PORT, () => console.log(`ACTIVE on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

init();
