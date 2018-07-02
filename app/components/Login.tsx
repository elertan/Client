import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthState } from '../reducers/auth';
import Button from './UI/Button';

const styles = require('./Login.scss');

export interface IProps extends RouteComponentProps<any>, AuthState {
  login({}): void;
}

export default class Home extends React.Component<IProps> {
  render() {
    return (
      <div className={styles.container}>
        <video autoPlay muted loop className={styles.video}>
          <source src="./assets/video/login.mp4" type="video/mp4" />
        </video>
        <div className={styles.topContainer}>
          <div className={styles.topContentContainer}>
            <img
              className={styles.logo}
              src="./assets/img/logo.png"
            />
            <div className={styles.loginContainer}>
              <p style={{padding: 3}}>Account Login</p>
              <hr />
              <div className={styles.loginContainerContent}>
                <p>Username</p>
                <input type="text" />
                <p>Password</p>
                <input type="text" />
                <div className={styles.loginContainerAction}>
                  <input type="checkbox" />
                  <p>Remember Username</p>
                  <div style={{flex: 1}} />
                  <div>
                    <Button onClick={() => alert('log in')}>Log In</Button>
                  </div>
                </div>
                <hr />
                <div className={styles.bottomActions}>
                  <p>Don't have an account? Sign up now!</p>
                  <p>Forgot your username?</p>
                  <p>Forgot your password?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottomContainer}></div>
      </div>
    );
  }
}
