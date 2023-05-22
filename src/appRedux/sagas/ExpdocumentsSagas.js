import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import { GET_EXPDOCUMENTS } from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getExpdocumentsSuccess,
} from "./../actions/ExpdocumentsActions";

export const token = (state) => state.token;

let userId = "";

// let userAuth = JSON.parse(localStorage.getItem("userAuth"));

let licenseId = "";

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

/*Identities Module Start Add, Get*/

//get identities
const getExpdocumentsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "ExpedientDocument?licenseId=" +
        userId +
        "&VisitId=" +
        payloadData.visit_id +
        "&PageNumber=" +
        payloadData.pageNumber,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getExpdocumentsRes) => getExpdocumentsRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getExpdocumentsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getExpdocumentsRes = yield call(getExpdocumentsByGroupId, payload);
    if (getExpdocumentsRes.status) {
      yield put(getExpdocumentsSuccess(getExpdocumentsRes.data));
    } else {
      yield put(showErrorMessage(getExpdocumentsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getexpdocuments() {
  yield takeEvery(GET_EXPDOCUMENTS, getExpdocumentsById);
}
export default function* rootSaga() {
  yield all([fork(getexpdocuments)]);
}
