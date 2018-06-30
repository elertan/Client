import { call, cancel, cancelled, fork, put, take } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { AuthAction, loginError, loginSuccess } from "../actions/auth";
import Axios from "axios";

const { history } = require("../store/configureStore");

function* loginWatcher(): SagaIterator {
  while (true) {
    // Get the email and password of the LOGIN action
    const action = yield take(AuthAction.LOGIN);
    const { email, password } = action.payload;

    // Hand it over to the loginFlow generator
    const task = yield fork(loginFlow, email, password);

    // If for some reason user is bashing the logout button or receiving an error, move on.
    yield take([AuthAction.LOGIN_ERROR, AuthAction.LOGOUT]);

    // Cancel the login task
    yield cancel(task);

    // Logout
    yield call(logout);
  }
}

function* loginFlow(email: string, password: string): SagaIterator {
  try {
    const token = yield call(login, email, password);

    yield put(loginSuccess(token));

    console.log("TOKEN", token);
    localStorage.setItem("token", JSON.stringify(token));

    history.push("/home");
  } catch (err) {
    yield put(loginError(err));
  } finally {
    if (yield cancelled()) {
      // history.push("/login");
    }
  }
}

function* login(email: string, password: string) {
  const result = yield Axios.post(`${process.env.API_URL}/auth/login`, {
    email,
    password
  }).then(res => console.log("RES", res));

  return result;
}

function logout() {
  localStorage.removeItem("token");

  // history.push("/login");
}

export default loginWatcher;
