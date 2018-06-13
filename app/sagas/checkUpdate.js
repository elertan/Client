import { call, put, takeLeading } from 'redux-saga/effects';
import * as fs from 'fs';
import differenceBy from 'lodash/differenceBy';
import unionBy from 'lodash/unionBy';
import type { UpdateEntry } from '../actions/update';
import * as actions from '../actions/update';
import config from '../config';

// Watcher saga to watch for CHECK_UPDATE actions, runs checkUpdateWorker()
function* checkUpdateWatcher() {
  // Start updating process with CHECK_UPDATE
  yield takeLeading(actions.CHECK_UPDATE, checkUpdateWorker);
}

// Worker saga to start the update process (Triggers on CHECK_UPDATE action)
function* checkUpdateWorker() {
  try {
    const externalUpdateFile = yield call(fetchNewFileList);
    const updateInfo = yield call(checkForUpdates, externalUpdateFile);

    if (updateInfo.filesToUpdate.length > 0) {
      yield put(
        actions.updateFound(updateInfo.filesToUpdate, updateInfo.completedFiles)
      );
      return true; // indicates that the generator has completed
    }

    yield put(actions.updatesDone()); // No updates found, user can login now
  } catch (err) {
    yield put(actions.updateError(err.toString()));
  }
}

// Start the process for checking updates
function* checkForUpdates(
  externalUpdateFile: UpdateEntry[]
): { completedFiles: UpdateEntry[], filesToUpdate: UpdateEntry[] } {
  const localUpdateFile = yield call(checkForLocalUpdateFile);
  const filesToUpdate = yield call(
    compareUpdateFiles,
    localUpdateFile,
    externalUpdateFile
  );
  return {
    filesToUpdate,
    completedFiles: localUpdateFile.filter(x => x.done)
  };
}

// Gets the local update file, if none is present return an empty array (also creates parent directory if needed)
function* checkForLocalUpdateFile(): UpdateEntry[] {
  try {
    const directory = process.cwd();
    const localUpdateFileExists = yield call(
      fs.existsSync,
      `${directory}/${config.LOCAL_UPDATE_FILE_PATH}`
    );

    if (!localUpdateFileExists) {
      // Check if parent directory exists and create it if necessary
      if (!fs.existsSync(`${directory}/${config.GAME_FOLDER}`)) {
        fs.mkdirSync(`${directory}/${config.GAME_FOLDER}`);
      }

      // If no local update file exists, return an empty array for the comparing function
      return [];
    }
    // We're sure localUpdateFile exists now
    let localUpdateContents = yield fs.readFileSync(
      `${directory}/${config.LOCAL_UPDATE_FILE_PATH}`,
      'utf-8'
    );

    if (!localUpdateContents) {
      return [];
    }

    // If the file ends with "}" it means that the update was closed during updating since we write each completed update separately
    // Add "]", this will complete the array and be able to be JSON.Parsed
    const lastCharacter = localUpdateContents.slice(-1);
    if (lastCharacter === '}') {
      localUpdateContents = `${localUpdateContents}]`;
    } else if (lastCharacter === ',') {
      // Ending with ',' is a super rare occurrence but it could happened in theory...
      localUpdateContents = `${localUpdateContents.slice(0, -1)}]`;
    }

    return JSON.parse(localUpdateContents);
  } catch (err) {
    // Error most likely thrown due to faulty JSON, log the error and return an empty array so we can continue...
    yield put(actions.updateError(err.toString()));
    return [];
  }
}

// Compare the 2 update files and return an array of files that need updating
function compareUpdateFiles(
  localUpdateFile: UpdateEntry[],
  externalUpdateFile: UpdateEntry[]
): UpdateEntry[] {
  // Get all files whose MD5 is not in the local update file
  const filesToUpdateMD5 = differenceBy(
    externalUpdateFile,
    localUpdateFile,
    'md5'
  );
  // Get all files from the local Update File that haven't completed yet
  const incompletedFiles = localUpdateFile.filter(x => !x.done);

  // Merge both arrays, giving priority to MD5 array, use "path" as unique key
  /* eslint no-param-reassign: ["error", { "props": false }] */
  return unionBy(
    filesToUpdateMD5.map(x => {
      x.done = false;
      return x;
    }),
    incompletedFiles,
    'path'
  );
}

// Get the external Update file
function fetchNewFileList() {
  return fetch(`${config.API_URL}/files.json`)
    .then(response => response.json())
    .then((data: UpdateEntry[]) => data);
}

export default checkUpdateWatcher;
