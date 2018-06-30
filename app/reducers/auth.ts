import { IActionWithPayload } from "../actions/helpers";
import { AuthAction } from "../actions/auth";

export type AuthState = {
  error: string,
  loading: boolean,
  token: string
}

const defaultState: AuthState = {
  error: "",
  loading: false,
  token: ""
};

export default function auth(state = defaultState, action: IActionWithPayload<string>) {
  switch (action.type) {
    case AuthAction.LOGIN:
      return {
        ...defaultState,
        loading: true
      };

    case AuthAction.LOGIN_SUCCESS:
      return {
        ...defaultState,
        token: action.payload
      };

    case AuthAction.LOGIN_ERROR:
      return {
        ...defaultState,
        error: action.payload
      };

    case AuthAction.LOGOUT:
      return {
        ...defaultState
      };

    default:
      return state;
  }
}
