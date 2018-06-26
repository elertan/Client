import * as React from 'react';
import { Link } from 'react-router-dom';

let styles = require('./Login.scss');

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Login</h2>
          <Link to="/home">go to home</Link>
        </div>
      </div>
    );
  }
}
