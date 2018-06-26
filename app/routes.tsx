import * as React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';

export default () => (
  <App>
    <Switch>
      <Route path="/home" component={HomePage} />
      <Route path="/" component={LoginPage} />
    </Switch>
  </App>
);
