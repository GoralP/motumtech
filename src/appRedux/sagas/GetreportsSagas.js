import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";

import { GET_GETREPORTS } from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getGetreportsSuccess,
} from "./../actions/GetreportsActions";
import { LineChart } from "recharts";

export const token = (state) => state.token;

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
const getGetreportsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetVisitReport?licenseId=2&Startdate=4/1/2020&Enddate=4/16/2020&DNI=&PageNumber=1&Sort=+Name&perPage=10",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getGetreportsRes) => getGetreportsRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getGetreportsById({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const getGetreportsRes = yield call(getGetreportsByGroupId, payload);
    if (getGetreportsRes.status) {
      yield put(getGetreportsSuccess(getGetreportsRes.data));
    } else {
      yield put(showErrorMessage(getGetreportsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getgetreports() {
  yield takeEvery(GET_GETREPORTS, getGetreportsById);
}
export default function* rootSaga() {
  yield all([fork(getgetreports)]);
}
