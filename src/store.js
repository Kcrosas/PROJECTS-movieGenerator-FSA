import { createStore } from "redux";

const initialState = {
  movies: [],
};

//have thunk here take id to delete using axios.delete

const store = createStore((state = initialState, action) => {
  if (action.type === "FIRST_LOAD") {
    state = { ...state, movies: action.movies };
  }
  if (action.type === "PLUS") {
    state = {
      ...state,
      movies: state.movies.map((movie) => {
        if (movie.id === action.updated.id) {
          return action.updated;
        }
        return movie;
      }),
    };
  }
  if (action.type === "SUB") {
    state = {
      ...state,
      movies: state.movies.map((movie) => {
        if (movie.id === action.updated.id) {
          return action.updated;
        }
        return movie;
      }),
    };
  }
  if (action.type === "DELETE") {
    //filters the array of movies and only returns movies that do not have an id equal to the id of the movie that was just deleted
    state = {
      ...state,
      movies: state.movies.filter((e) => e.id !== action.id),
    };
  }
  if (action.type === "NEW") {
    state = { ...state, movies: [...state.movies, action.movie] };
  }

  return state;
});

export default store; //
