// @flow
import React, { Component } from "react";
import { remote } from "electron";
import Update from "../components/Update";
import logo from "../assets/images/logo.png";

type Props = {};

export default class Header extends Component<Props> {
  props: Props;

  exitApplication = () => {
    const currentWindow = remote.getCurrentWindow();
    const choice = remote.dialog.showMessageBox(currentWindow,
      {
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message: "Are you sure you want to quit?"
      });

    if (choice === 0) {
      currentWindow.close();
    }
  };

  minimizeApplication = () => {
    remote.getCurrentWindow().minimize();
  };

  render() {
    return (
      <header className="login-header">

        <img className="logo" src={logo}/>
        <Update/>
        <div className="window-actions">
          <button onClick={this.minimizeApplication}>_</button>
          <button onClick={this.exitApplication}>X</button>
        </div>
      </header>
    );
  }
}
