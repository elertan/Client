export const CHECK_UPDATE = "CHECK_UPDATE";
export const UPDATE_FOUND = "UPDATE_FOUND";
export const UPDATES_DONE = "UPDATES_DONE";
export const UPDATE_ERROR = "UPDATE_ERROR";
export const FILE_COMPLETE = "FILE_COMPLETE";

export interface UpdateEntry {
  path: string,
  md5: string,
  version: number,
  done?: boolean
}

export function checkUpdate() {
  return {
    type: CHECK_UPDATE
  };
}

export function updateFound(filesToUpdate: UpdateEntry[], completedFiles: UpdateEntry[]) {
  return {
    type: UPDATE_FOUND,
    payload: filesToUpdate,
    completed: completedFiles
  };
}

export function updatesDone() {
  return {
    type: UPDATES_DONE
  };
}

export function updateError(err: string) {
  return {
    type: UPDATE_ERROR,
    payload: err
  };
}

export function fileComplete(entry: UpdateEntry) {
  return {
    type: FILE_COMPLETE,
    payload: entry
  };
}
