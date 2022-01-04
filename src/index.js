import { render } from "react-dom";
import React, { Component } from "react";
//for use with post route
import axios from "axios";
import store from "./store";

class App extends Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  //When the component first mounts
  async componentDidMount() {
    //Ties this component to the store
    store.subscribe(() => {
      this.setState(store.getState());
    });
    //Grabs data from express route for movies
    const movies = (await axios.get("/api/movies")).data;
    store.dispatch({
      type: "FIRST_LOAD",
      movies,
    });
  }
  //Function that initiates a new movie
  async newMovie() {
    const movie = (await axios.post("/api/movies")).data;
    store.dispatch({
      type: "NEW",
      movie,
    });
  }

  async increase(movie) {
    try {
      console.log(`line 37 ${JSON.stringify(movie)}`);
      movie = { ...movie, rating: movie.rating + 1 };
      const updated = (await axios.put(`/api/movies/${movie.id}`, movie)).data;
      console.log(updated);
      store.dispatch({
        type: "PLUS",
        updated,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async decrease(movie) {
    try {
      movie = { ...movie, rating: movie.rating - 1 };
      const updated = (await axios.put(`/api/movies/${movie.id}`, movie)).data;
      console.log(updated);
      store.dispatch({
        type: "SUB",
        updated,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //if using thunks, send id to thunk in store
  async delete(id) {
    try {
      await axios.delete(`/api/movies/${id}`);
      store.dispatch({
        type: "DELETE",
        id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  sortByName(a, b) {
    return a.name.localeCompare(b.name);
  }
  sortByRating(a, b) {
    return b.rating - a.rating;
  }

  render() {
    const { movies } = this.state;
    movies.sort(this.sortByName).sort(this.sortByRating);
    const averageMap = movies.map((e) => e.rating);
    const average = (
      averageMap.reduce((a, b) => a + b, 0) / movies.length
    ).toFixed(2);
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td colSpan="100%">
                <h2>Movie List</h2>
              </td>
            </tr>
            <tr>
              <td>Average Rating: </td>
              <td className="spec">{average}</td>
            </tr>
            <tr>
              <td>Number of Films: </td>
              <td className="spec">{movies.length}</td>
            </tr>
            <tr>
              <td>Press for new movie</td>
              <td className="spec">
                <button onClick={this.newMovie}>New movie</button>
              </td>
            </tr>
            <tr>
              <td colSpan="100%">
                <hr />
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr id="headerName">
              <td>Movie</td>
              <td>Rating</td>
              <td style={{ textAlign: "right" }}>Settings</td>
            </tr>
            <tr>
              <td colSpan="100%">
                <hr />
              </td>
            </tr>
            {movies.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td id="tdRating">{e.rating}</td>
                <td style={{ textAlign: "right" }}>
                  <div className="dropdown">
                    <button className="dropbtn">Select Option</button>
                    <div className="dropdown-content">
                      <button
                        disabled={e.rating === 5}
                        onClick={() => this.increase(e)}
                      >
                        Increase Rating
                      </button>
                      <button
                        disabled={e.rating === 1}
                        onClick={() => this.decrease(e)}
                      >
                        Decrease Rating
                      </button>
                      <button onClick={() => this.delete(e.id)}>
                        Delete the film
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

render(<App />, document.querySelector("#root"));
