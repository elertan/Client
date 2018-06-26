import * as React from 'react';
import Titlebar from './Window/Titlebar';

let styles = require('./Window.scss');

class Window extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={styles.container}>
        <Titlebar />
        <div className={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Window;
