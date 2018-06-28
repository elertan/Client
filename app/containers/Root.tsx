import * as React from 'react';
import * as Redux from 'react-redux';
import { History } from 'history';

// tslint:disable-next-line:no-duplicate-imports
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
// tslint:disable-next-line:import-name
import Routes from '../routes';
import Window from './Window';

interface IRootType {
  store: Redux.Store<any>;
  history: History;
}

// tslint:disable-next-line:function-name
export default function Root({ store, history }: IRootType) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Window>
          <Routes />
        </Window>
      </ConnectedRouter>
    </Provider>
  );
}
