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

  render() {
    const { movies } = this.state;
    return (
      <div>
        <button onClick={this.newMovie}>Press for new movie</button>
        <ul>
          {movies.map((e) => (
            <li key={e.id}>
              {e.name} Rating: {e.rating}
              <div className="dropdown">
                <button className="dropbtn">Select Option</button>
                <div className="dropdown-content">
                  <button onClick={() => this.increase(e)}>
                    Increase Rating
                  </button>
                  <button onClick={() => this.decrease(e)}>
                    Decrease Rating
                  </button>
                  <button onClick={() => this.delete(e.id)}>
                    Delete the film
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

render(<App />, document.querySelector("#root"));
