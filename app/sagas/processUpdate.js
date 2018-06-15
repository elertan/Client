import { all, call, put, take } from "redux-saga/effects";
import * as fs from "fs";
import request from "request";
import crypto from "crypto";
import type { UpdateEntry } from "../actions/update";
import * as actions from "../actions/update";
import config from "../config";

// Watcher saga to watch for UPDATE_FOUND actions, runs processUpdateWorker()
function* processUpdateWatcher() {
  const action = yield take(actions.UPDATE_FOUND);
  yield call(processUpdateWorker, action);
  yield put(actions.updatesDone());
}

// Worker saga to start the update process (Triggers on UPDATE_FOUND action)
function* processUpdateWorker(action: { type: string, payload: UpdateEntry[] }) {
  try {
    yield all([...action.payload.map(entry => call(processFile, entry))]);
    // yield all([...action.payload.slice(0, 10).map(entry => call(processFile, entry))]); // Testing
  } catch (err) {
    yield put(actions.updateError(err.toString()));
  }
}

function* processFile(entry: UpdateEntry, maxDepth = 5) {
  try {
    yield put(yield downloadAndWriteFile(entry));
  } catch (err) {
    // Promise was rejected, file is corrupt. Try again
    if (maxDepth === 0) {
      // If the file is still corrupt after 5 tries cancel the update.
      // Indication of something wrong
      // TODO: Create a logger to generate a log file
      throw Error(`FILE_CORRUPTION: MD5: ${entry.md5}`);
    }
    yield call(processFile, entry, maxDepth - 1);
  }
}

function downloadAndWriteFile(entry) {
  return new Promise((resolve, reject) => {
    const fileName = entry.path.split("\\").slice(-1).pop();
    const saveDirectory = `${process.cwd()}/${config.GAME_FOLDER}/${fileName}`;
    const writer = fs.createWriteStream(saveDirectory);
    const hash = crypto.createHash("md5");
    const req = request({
      method: "GET",
      uri: `${config.API_URL}/${entry.path}`
    });
    // Pipe the request to the writer
    req.pipe(writer);

    // Update the hash (digest hash on end and check if file isn't corrupted)
    req.on("data", data => {
      // hash.update(`${data}`); // Test: Corrupt the md5
      hash.update(data);
    });

    writer.on("finish", () => {
      if (hash.digest("hex") === entry.md5) {
        resolve(
          actions.fileComplete({
            ...entry,
            done: true
          })
        );
      } else {
        // If hashes aren't equal the file is corrupt, reject the promise
        reject();
      }
    });
  });
}

export default processUpdateWatcher;
