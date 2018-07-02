import * as React from 'react';

const styles = require('./Button.scss');

export interface IProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement> {}

class Button extends React.Component<IProps> {
  public render() {
    return (
      <div className={styles.container} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export default Button;
