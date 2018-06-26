import * as React from 'react';

const styles = require('./Titlebar.scss');

const Titlebar: React.SFC<{}> = (props: {}) => {
  return (
    <div className={styles.container}>
      League of Memories - v0.1.0
    </div>
  );
};

export default Titlebar;
