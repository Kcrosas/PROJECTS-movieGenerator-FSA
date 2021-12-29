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
    state = state;
  }
  if (action.type === "NEW") {
    state = { ...state, movies: [...state.movies, action.movie] };
  }

  return state;
});

export default store; //
