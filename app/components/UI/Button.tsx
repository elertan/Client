import * as React from 'react';

const styles = require('./Button.scss');

class Button extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={styles.container}>
        {this.props.children}
      </div>
    );
  }
}

export default Button;
