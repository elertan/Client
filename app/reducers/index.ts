import { combineReducers, Reducer } from "redux";
import { routerReducer as routing } from "react-router-redux";
import auth, { AuthState } from "./auth";

const rootReducer = combineReducers({
  auth,
  routing: routing as Reducer<any>
});

export interface IState {
  auth: AuthState
}

export default rootReducer;
