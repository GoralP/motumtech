import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_GENERAL_SETTINGS_PENDING,
  GET_DEVICE_NAME_PENDING,
  ADD_GENERAL_SETTINGS_PENDING,
} from "./../../../src/constants/ActionTypes";
import {
  getGeneralSettingsSuccess,
  getGeneralSettingsFail,
  getDeviceNameSuccess,
  getDeviceNameFail,
  createGeneralSettingSuccess,
  createGeneralSettingsFail,
} from "./../actions/GeneralSettingsAction";
import { message } from "antd";

export const token = (state) => state.token;
let licenseId = "";
let langName = "";
let identityId = "";
let generalSettingsList = "";
let userName = "";
let password = "";
let urlType = "";
let deviceId = "";

// let userAuth = JSON.parse(localStorage.getItem("userAuth"));

// let userdata = localStorage.getItem(branchName + "_data");
// if (userdata != "" && userdata != null) {
//   let userData = JSON.parse(userdata);
//   if (userData != "" && userData != null && userData["id"] != undefined) {
//     licenseId = userData["id"];
//   }
// }

// let authToken = window.btoa(
//   userAuth.Username + "-" + licenseId + ":" + userAuth.Password
// );

// let authToken = "";
// let userAuth = JSON.parse(localStorage.getItem("userAuth"));
// if (userAuth != "" && userAuth != null) {
//   authToken = window.btoa(
//     userAuth.Username + "-" + licenseId + ":" + userAuth.Password
//   );
// }

let authBasic = "";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Basic " + authBasic,
};

//get general settings data start------------------------------------------->

const getGeneralSettingsRequest = async () =>
  await axios
    .get(
      baseURL +
        "GetMotumConfiguration?licenseId=" +
        licenseId +
        "&deviceId=" +
        deviceId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* getGeneralSettingsById() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  console.log("language--->", langName);

  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    console.log("userdata---->", userData);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
      deviceId = userData["deviceId"];
    }
  }
  try {
    const response = yield call(getGeneralSettingsRequest);
    if (response.status == true) {
      yield put(getGeneralSettingsSuccess(response.data));
      generalSettingsList = JSON.stringify(response.data);
    }
  } catch (error) {
    yield put(getGeneralSettingsFail(error.response));
    message.error(error);
  }
}

export function* getGeneralSettingsByIdAccount() {
  yield takeEvery(GET_GENERAL_SETTINGS_PENDING, getGeneralSettingsById);
}

//get general settings data end------------------------------------------->

//get device name data start------------------------------------------->

const getDeviceNameRequest = async () =>
  await axios
    .get(
      baseURL +
        "GetDeviceInfoByVidsignerCredential?Username=" +
        userName +
        "&Password=" +
        password +
        "&UrlType=" +
        urlType,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* getDeviceNameById() {
  authBasic = localStorage.getItem("setAuthToken");
  if (generalSettingsList != "" && generalSettingsList != null) {
    let generalList = JSON.parse(generalSettingsList);
    if (
      generalList != "" &&
      generalList != null &&
      generalList["Id"] != undefined
    ) {
      userName = generalList["Username"];
      password = generalList["Password"];
      urlType = generalList["API"];
    }
  }

  try {
    const response = yield call(getDeviceNameRequest);
    if (response.status == true) {
      yield put(getDeviceNameSuccess(response.data));
    }
  } catch (error) {
    yield put(getDeviceNameFail(error.response));
    message.error(error);
  }
}

export function* getDevicenameByIdAccount() {
  yield takeEvery(GET_DEVICE_NAME_PENDING, getDeviceNameById);
}

//get device name data end------------------------------------------->

//Add general settings data start------------------------------------------->

const generalSettingsRequest = async (payloadData) =>
  await axios
    .post(
      baseURL + "PostMotumConfiguration?lang=" + langName,
      payloadData,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* createGeneralSettings({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");

  try {
    const response = yield call(generalSettingsRequest, payload);
    if (response.status == true) {
      message.success(response.message);
      yield put(createGeneralSettingSuccess(response.data));
    }
  } catch (error) {
    message.error(error);
  }
}

export function* generalSettingsAccount() {
  yield takeEvery(ADD_GENERAL_SETTINGS_PENDING, createGeneralSettings);
}

//Add general settings data end------------------------------------------->

export default function* rootSaga() {
  yield all([fork(getGeneralSettingsByIdAccount)]);
  yield all([fork(getDevicenameByIdAccount)]);
  yield all([fork(generalSettingsAccount)]);
}
