import { createStore } from "redux";

const initialState = {
  movies: [],
};

const store = createStore((state = initialState, action) => {
  if (action.type === "FIRST_LOAD") {
    state = { ...state, movies: action.movies };
  }
  if (action.type === "PLUS") {
    state = state;
  }
  if (action.type === "SUB") {
    state = state;
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
