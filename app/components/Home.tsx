import * as React from 'react';
import Header from './Home/Header';
import Button from './UI/Button';
import { Link } from "react-router-dom";

const styles = require("./Home.scss");

export default class Home extends React.Component {
  render() {
    return (
      <div>
          <div className={styles.container} data-tid="container">
          <Header />
          <Button>
            Button
          </Button>
          <Link to="/login">go to login</Link>
          {/* <div className={styles.tempBackground}></div> */}
        </div>
      </div>
    );
  }
}
