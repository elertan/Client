import * as React from 'react';
import Header from './Home/Header';

const styles = require('./Home.scss');

export default class Home extends React.Component {
  render() {
    return (
      <div>
          <div className={styles.container} data-tid="container">
          <Header />
          <div className={styles.tempBackground}></div>
        </div>
      </div>
    );
  }
}
