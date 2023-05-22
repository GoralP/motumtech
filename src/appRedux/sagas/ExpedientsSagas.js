import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_EXPEDIENTS,
  GET_EXPEDIENTS_REPORT,
  GET_EXPEDIENT_FORM,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getExpedientsSuccess,
  getExpedientreportSuccess,
  getExpedientFormSuccess,
} from "./../actions/ExpedientsActions";

export const token = (state) => state.token;

let licenseId = "";

// let userdata = localStorage.getItem(branchName + "_data");
// if (userdata != "" && userdata != null) {
//   let userData = JSON.parse(userdata);
//   if (userData != "" && userData != null && userData["id"] != undefined) {
//     licenseId = userData["id"];
//   }
// }

let userId = "";

// let userAuth = JSON.parse(localStorage.getItem("userAuth"));

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

/*expedient Module Start Add, Get*/

//get expedient
const getExpedientsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "CustomExpedientList?licenseId=" +
        userId +
        "&deviceId=&filter=" +
        payloadData.status +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&Sort=" +
        payloadData.sortBy +
        "&PerPage=" +
        payloadData.perPage,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getExpedientsRes) => getExpedientsRes.data)
    .catch((error) => error);

//get expedient reports
const getExpedientReports = async (
  dniNumber,
  currentReport,
  startingDate,
  endingDate
) =>
  await axios
    .get(
      baseURL +
        "GetExpedientReport?licenseId=" +
        userId +
        "&Startdate=" +
        startingDate +
        "&Enddate=" +
        endingDate +
        "&DNI=" +
        dniNumber +
        "&PageNumber=1&Sort=-ExpedientName",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getExpedientsRes) => getExpedientsRes.data)
    .catch((error) => error);

//get expedient form fields
const getExpedientFormDataApi = async (payloadData) =>
  await axios
    .get(baseURL + "ExpedientListWithFileds?licenceId=" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getExpedientsRes) => getExpedientsRes.data)
    .catch((error) => error);

//expedient Module start functions
function* getExpedientsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getExpedientsRes = yield call(getExpedientsByGroupId, payload);
    if (getExpedientsRes.status) {
      yield put(getExpedientsSuccess(getExpedientsRes.data));
    } else {
      yield put(showErrorMessage(getExpedientsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* getExpedientreportById({ payload }) {
  const { dniNumber, currentReport, startingDate, endingDate } = payload;
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getExpedientsRes = yield call(
      getExpedientReports,
      dniNumber,
      currentReport,
      startingDate,
      endingDate
    );
    if (getExpedientsRes.status) {
      yield put(getExpedientreportSuccess(getExpedientsRes.data));
    } else {
      yield put(showErrorMessage(getExpedientsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* getExpedientForm({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getExpedientFormRes = yield call(getExpedientFormDataApi, payload);
    if (getExpedientFormRes.status) {
      yield put(getExpedientFormSuccess(getExpedientFormRes.data));
    } else {
      yield put(showErrorMessage(getExpedientFormRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//take Every function call
export function* getexpedients() {
  yield takeEvery(GET_EXPEDIENTS, getExpedientsById);
}
export function* getExpedientreport() {
  yield takeEvery(GET_EXPEDIENTS_REPORT, getExpedientreportById);
}
export function* getexpedientform() {
  yield takeEvery(GET_EXPEDIENT_FORM, getExpedientForm);
}
export default function* rootSaga() {
  yield all([
    fork(getexpedients),
    fork(getExpedientreport),
    fork(getexpedientform),
  ]);
}
