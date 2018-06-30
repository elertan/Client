import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { AuthState } from "../reducers/auth";

const styles = require("./Login.scss");

export interface IProps extends RouteComponentProps<any>, AuthState {
  login({}): void
}

export default class Home extends React.Component<IProps> {
  render() {
    const { login } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Login</h2>
          <button onClick={() => login({ email: "something@something.ddd", password: "vis123" })}>Login</button>
          <Link to="/home">go to home</Link>
        </div>
      </div>
    );
  }
}
