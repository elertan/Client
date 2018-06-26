import * as React from 'react';

let styles = require('./Header.scss');

class Header extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.headerImage} />
        <div className={styles.statusContainer} />
        <div className={styles.playButton}>
          PLAY
        </div>
        <div className={styles.userContainer} />
        <div className={styles.leftSpace} />
      </div>
    );
  }
}

export default Header;
