import React, { Component } from "react";
import Header from "../containers/Header";

export default class LoginPage extends Component {
  render() {
    return (
      <div className="login-page-wrapper">
        <Header/>
        <div className="content">
          <p>Login form, login button becomes clickable after update has finished</p>
        </div>
      </div>
    );
  }
}
