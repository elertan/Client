// @flow
import { combineReducers } from "redux";
import { routerReducer as router } from "react-router-redux";
import update from "./update";

const rootReducer = combineReducers({
  update,
  router
});

export default rootReducer;
