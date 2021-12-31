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

  increase(id) {
    console.log("increase" + id);
  }
  decrease(id) {
    console.log("decrease" + id);
  }
  async delete(id) {
    try {
      await axios.delete(`/api/movies/${id}`);
      store.dispatch({
        type: "DELETE",
        id,
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { movies } = this.state;
    console.log(movies);
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
                  <button onClick={() => this.increase(e.id)}>
                    Increase Rating
                  </button>
                  <button onClick={() => this.decrease(e.id)}>
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
