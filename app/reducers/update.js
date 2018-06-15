import type { UpdateEntry } from "../actions/update";
// @flow
import { CHECK_UPDATE, FILE_COMPLETE, UPDATE_ERROR, UPDATE_FOUND, UPDATES_DONE } from "../actions/update";

export type updateStateType = {
  +isCheckingForUpdates: boolean,
  +isUpdating: boolean,
  +canLogin: boolean, // Either done updating or didn't find any updates... User can login now
  +error: string,
  +progress: number,
  +totalUpdateFiles: number,
  +completedUpdateFiles: UpdateEntry[],
  +updateText: string
};

const defaultState: updateStateType = {
  isCheckingForUpdates: false,
  isUpdating: false,
  canLogin: false,
  error: "",
  progress: 0,
  totalUpdateFiles: 0,
  completedUpdateFiles: [],
  updateText: ""
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
        isCheckingForUpdates: true,
        updateText: "UPDATE.CHECK_UPDATE"
      };
    case UPDATE_FOUND:
      return {
        ...defaultState,
        isUpdating: true,
        totalUpdateFiles: action.payload.length + action.completed.length,
        completedUpdateFiles: action.completed,
        progress: Math.round((action.completed.length / (action.payload.length + action.completed.length)) * 100),
        updateText: `Updating 0% (0 / ${state.totalUpdateFiles})`
      };
    case FILE_COMPLETE:
      return {
        ...state,
        completedUpdateFiles: [...state.completedUpdateFiles, action.payload],
        progress: Math.round((state.completedUpdateFiles.length / state.totalUpdateFiles) * 100),
        updateText: `Updating ${state.progress}% (${state.completedUpdateFiles.length} / ${state.totalUpdateFiles})`
      };
    case UPDATES_DONE:
      return {
        ...defaultState,
        canLogin: true,
        updateText: "Ready"
      };
    case UPDATE_ERROR:
      return {
        ...defaultState,
        error: action.payload,
        updateText: "Something went wrong... Contact an admin"
      };
    default:
      return state;
  }
}
