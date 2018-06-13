import { all, fork } from 'redux-saga/effects';
import checkUpdateSaga from './checkUpdate';
import processUpdateSaga from './processUpdate';
import fileCleanupSaga from './fileCleanup';

function startSagas(...sagas) {
  return function* rootSaga() {
    yield all([...sagas.map(saga => fork(saga))]);
  };
}

export default startSagas(checkUpdateSaga, processUpdateSaga, fileCleanupSaga);
