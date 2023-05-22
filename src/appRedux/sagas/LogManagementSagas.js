import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName, webURL } from "./../../util/config";
import { GET_LOG_MANAGEMENT_DATA_PENDING } from "./../../../src/constants/ActionTypes";
import {
  getLogManagementSuccess,
  getLogManagementFail,
} from "./../actions/LogManagementActions";
import { message } from "antd";
import { push } from "react-router-redux";

export const token = (state) => state.token;
let licenseId = "";
let langName = "";
let identityId = "";
let generalSettingsList = "";
let userName = "";
let password = "";
let urlType = "";
let deviceId = "";

const headersWithFormData = {
  "Content-Type": "multipart/form-data",
};

let authBasic = "";

//get all procedure list start------------------------------------------->

const getLogmanagementRequest = async (payloadData) =>
  // console.log("payload", payloadData);
  await axios
    .post(
      baseURL +
        "GetAllLogs?PageNumber=" +
        payloadData.pageNumber +
        "&PerPage=" +
        payloadData.perPage +
        "&Sort=" +
        payloadData.sortBy +
        "&SearchTerm=" +
        payloadData.searchProcedureTerm,
      payloadData.data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* getLogManagementList({ payload }) {
  // console.log("payload", payload);
  let userdata = localStorage.getItem(branchName + "_data");
  langName = localStorage.getItem(branchName + "_language");

  let userAuth = JSON.parse(localStorage.getItem("userAuth"));
  if (userAuth != "" && userAuth != null) {
    authBasic = window.btoa(
      userAuth.Username + "-" + payload.licenseId + ":" + userAuth.Password
    );
  }

  try {
    const response = yield call(getLogmanagementRequest, payload);
    if (response.status == true) {
      yield put(getLogManagementSuccess(response.data));
    }
  } catch (error) {
    yield put(getLogManagementFail(error.response));
    message.error(error);
  }
}

export function* getLogManagementAccount() {
  yield takeEvery(GET_LOG_MANAGEMENT_DATA_PENDING, getLogManagementList);
}

//get all procedure list end------------------------------------------->

export default function* rootSaga() {
  yield all([fork(getLogManagementAccount)]);
}
