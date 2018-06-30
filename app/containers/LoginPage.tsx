import * as React from "react";
import Login, { IProps } from "../components/Login";
import { AuthState } from "../reducers/auth";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as AuthActions from "../actions/auth";

function mapStateToProps(state: AuthState): Partial<IProps> {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch<AuthState>): Partial<IProps> {
  return bindActionCreators(AuthActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Login) as any as React.StatelessComponent<IProps>);
