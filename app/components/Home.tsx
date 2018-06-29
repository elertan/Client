import * as React from "react";
import Header from "./Home/Header";
import { Link } from "react-router-dom";

const styles = require("./Home.scss");

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Header/>
          <Link to="/login">go to login</Link>
          {/* <div className={styles.tempBackground}></div> */}
        </div>
      </div>
    );
  }
}
