import type { UpdateEntry } from "../actions/update";
// @flow
import { CHECK_UPDATE, FILE_COMPLETE, UPDATE_FOUND, UPDATES_DONE } from "../actions/update";

export type updateStateType = {
  +isCheckingForUpdates: boolean,
  +isUpdating: boolean,
  +canLogin: boolean, // Either done updating or didn't find any updates... User can login now
  +progress: number,
  +totalUpdateFiles: number,
  +completedUpdateFiles: UpdateEntry[]
};

const defaultState: updateStateType = {
  isCheckingForUpdates: false,
  isUpdating: false,
  canLogin: false,
  progress: 0,
  totalUpdateFiles: 0,
  completedUpdateFiles: []
};

type actionType = {
  +type: string,
  +payload?: any,
  +completed?: UpdateEntry[]
};

export default function counter(state: updateStateType = defaultState, action: actionType) {
  switch (action.type) {
    case CHECK_UPDATE:
      return {
        ...defaultState,
        isCheckingForUpdates: true
      };
    case UPDATE_FOUND:
      return {
        ...defaultState,
        isUpdating: true,
        totalUpdateFiles: action.payload.length + action.completed.length,
        completedUpdateFiles: action.completed,
        progress: Math.round((action.completed.length / (action.payload.length + action.completed.length)) * 100)
      };
    case FILE_COMPLETE:
      return {
        ...state,
        completedUpdateFiles: [...state.completedUpdateFiles, action.payload],
        progress: Math.round((state.completedUpdateFiles.length / state.totalUpdateFiles) * 100)
      };
    case UPDATES_DONE:
      return {
        ...state,
        isCheckingForUpdates: false,
        isUpdating: false,
        canLogin: true
      };
    default:
      return state;
  }
}
