import { all, call, put, take } from 'redux-saga/effects';
import * as fs from 'fs';
import request from 'request';
import type { UpdateEntry } from '../actions/update';
import * as actions from '../actions/update';
import config from '../config';

// Watcher saga to watch for UPDATE_FOUND actions, runs processUpdateWorker()
function* processUpdateWatcher() {
  const action = yield take(actions.UPDATE_FOUND);
  yield call(processUpdateWorker, action);
}

// Worker saga to start the update process (Triggers on UPDATE_FOUND action)
function* processUpdateWorker(action: {
  type: string,
  payload: UpdateEntry[]
}) {
  try {
    yield all([...action.payload.map(entry => call(processFile, entry))]);
    yield put(actions.updatesDone());
  } catch (err) {
    console.log('PROCESS_UPDATE_WORKER ERR', err);
  }
}

function* processFile(entry: UpdateEntry) {
  yield put(yield doSomething(entry));
}

function doSomething(entry) {
  return new Promise(resolve => {
    const fileName = entry.path
      .split('\\')
      .slice(-1)
      .pop();
    const saveDirectory = `${process.cwd()}/${config.GAME_FOLDER}/${fileName}`;
    const writer = fs.createWriteStream(saveDirectory);
    const req = request({
      method: 'GET',
      uri: `${config.API_URL}/${entry.path}`
    });
    req.pipe(writer);
    writer.on('finish', () => {
      resolve(
        actions.fileComplete({
          ...entry,
          done: true
        })
      );
    });
  });
}

export default processUpdateWatcher;
