import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Login from '../components/Login';

export class LoginPage extends React.Component<RouteComponentProps<any>, void> {
  render() {
    return (
      <Login />
    );
  }
}

export default (LoginPage as any as React.StatelessComponent<RouteComponentProps<any>>);
