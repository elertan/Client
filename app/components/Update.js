// @flow
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UpdateActions from "../actions/update";
import { updateStateType } from "../reducers/update";

const classNames = require("classnames");

type Props = {
  checkUpdate: () => void,
  update: updateStateType
};

class Update extends Component<Props> {
  props: Props;

  componentDidMount() {
    const {
      checkUpdate
    } = this.props;

    checkUpdate();
  }

  render() {
    const {
      update
    } = this.props;
    const classes = classNames(
      "utility",
      "noselect",
      {
        "load": update.isCheckingForUpdates,
        "progress": update.isUpdating
      }
    );
    const progressStyle = {
      strokeDashoffset: `${80 - (update.progress * 0.8)}px`
    };
    let updateText = "";
    if (update.isCheckingForUpdates) {
      updateText = "Checking for updates...";
    }
    if (update.isUpdating) {
      updateText = `Updating ${update.progress}% (${update.completedUpdateFiles.length} / ${update.totalUpdateFiles})`;
    }
    if (update.canLogin) {
      updateText = "Ready...";
    }
    return (
      <div>
        <p>{updateText}</p>
        <svg className={classes} viewBox="0 0 80 3">
          <path className="track" d="M0,0 h80"/>
          <path className="fill" d="M0,0 h80" style={progressStyle}/>
        </svg>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UpdateActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Update);
