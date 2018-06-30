import loginWatcher from "./auth";
import { all } from "redux-saga/effects";

export default function* startSagas() {
  yield all([
    loginWatcher()
  ]);
}
