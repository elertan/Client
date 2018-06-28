import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import reducers from '../reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(reduxThunk, router);

export = {
  history,
  configureStore(initialState: Object | void) {
    return createStore(reducers, initialState, enhancer);
  },
};
