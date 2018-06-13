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
}

// Worker saga to start the update process (Triggers on UPDATE_FOUND action)
function* processUpdateWorker(action: {
  type: string,
  payload: UpdateEntry[]
}) {
  try {
    yield all([...action.payload.map(entry => call(processFile, entry))]);
    // yield all([...action.payload.slice(0, 1).map(entry => call(processFile, entry))]); // Testing
    yield put(actions.updatesDone());
  } catch (err) {
    console.log("PROCESS_UPDATE_WORKER ERR", err);
  }
}

function* processFile(entry: UpdateEntry) {
  yield put(yield doSomething(entry));
}

function doSomething(entry) {
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
      // hash.update(`${data}1`); // Test: Corrupt the md5
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
        // TODO: Add the file to queue again
        reject();
      }
    });
  });
}

export default processUpdateWatcher;
