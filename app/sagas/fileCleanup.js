import { select, take, takeEvery } from 'redux-saga/effects';
import fs from 'fs';
import * as actions from '../actions/update';
import config from '../config';

let first = true;
const getCompleted = state => state.update.completedUpdateFiles;

// Watcher saga to watch for FILE_COMPLETE actions, runs cleanFileWorker()
function* fileCompleteWatcher() {
  // Wait until an update has been found to start a fileStream (clears the file)
  yield take(actions.UPDATE_FOUND);
  // Use one WritableStream for performance
  const fileStream = fs.createWriteStream(
    `${process.cwd()}/${config.LOCAL_UPDATE_FILE_PATH}`,
    {
      flags: 'w',
      spaces: 2,
      EOL: '\r\n'
    }
  );
  yield takeEvery(actions.FILE_COMPLETE, cleanFileWorker, fileStream);
  yield take(actions.UPDATES_DONE); // Only continue (end process) when updates are done
  fileStream.write(']'); // Write the closing brace for the array
  fileStream.end();
  first = true;
}

// Worker saga to write the file update to the local update file
function* cleanFileWorker(
  fileStream: WritableStreamDefaultWriter,
  { payload }
) {
  if (first) {
    const alreadyCompleted = yield select(getCompleted); // When we first start the completedArray will contain all updates that have been done before
    yield fileStream.write(JSON.stringify(alreadyCompleted).slice(0, -1)); // Adding a comma for future additions
    first = false;
  } else {
    yield fileStream.write(`,${JSON.stringify(payload)}`); // Write a comma in front for valid JSON
  }
}

export default fileCompleteWatcher;
