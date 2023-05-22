import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_REPORTS,
  GET_TRAINING_REPORTS,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getReportsSuccess,
  getTrainingReportsSuccess,
} from "./../actions/ReportsActions";

export const token = (state) => state.token;

let userId = "";
let licenseId = "";

// let userdata = localStorage.getItem(branchName + "_data");
// if (userdata != "" && userdata != null) {
//   let userData = JSON.parse(userdata);
//   if (userData != "" && userData != null && userData["id"] != undefined) {
//     licenseId = userData["id"];
//   }
// }

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

/*Identities Module Start Add, Get*/

//get identities
const getReportsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        payloadData.reportBy +
        "?licenseId=" +
        licenseId +
        "&Startdate=" +
        payloadData.startValue +
        "&Enddate=" +
        payloadData.endValue +
        "&DNI=" +
        payloadData.dni +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&Sort=" +
        payloadData.sortBy +
        "&perPage=" +
        payloadData.perPage,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getReportsRes) => getReportsRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

const getTrainingReportsByGroupId = async (year) =>
  await axios
    .get(baseURL + "TrainingHoursReport?UserId=" + userId + "&Year=" + year, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getTrainingReportsRes) => getTrainingReportsRes.data)
    .catch((error) => error);

//Identities Module start ADD, GET
function* getReportsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getReportsRes = yield call(getReportsByGroupId, payload);
    if (getReportsRes.status) {
      yield put(getReportsSuccess(getReportsRes.data));
    } else {
      yield put(showErrorMessage(getReportsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* getTrainingReportsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (
      userData !== "" &&
      userData !== null &&
      userData["IdentityId"] !== undefined
    ) {
      userId = userData["IdentityId"];
    }
  }
  try {
    const getTrainingReportsRes = yield call(
      getTrainingReportsByGroupId,
      payload
    );
    if (getTrainingReportsRes.status) {
      yield put(getTrainingReportsSuccess(getTrainingReportsRes.data));
    } else {
      yield put(showErrorMessage(getTrainingReportsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getreports() {
  yield takeEvery(GET_REPORTS, getReportsById);
}
export function* gettrainingreports() {
  yield takeEvery(GET_TRAINING_REPORTS, getTrainingReportsById);
}

export default function* rootSaga() {
  yield all([fork(getreports), fork(gettrainingreports)]);
}
