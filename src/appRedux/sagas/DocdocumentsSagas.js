import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import { GET_DOCDOCUMENTS } from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getDocdocumentsSuccess,
} from "./../actions/DocdocumentsActions";

export const token = (state) => state.token;

let licenseId = "";

// let userId = '';
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
const getDocdocumentsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL + "GetParticipantDetail?documentId=" + payloadData.document_id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDocdocumentsRes) => getDocdocumentsRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getDocdocumentsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      // userId = userData['id'];
    }
  }

  try {
    const getDocdocumentsRes = yield call(getDocdocumentsByGroupId, payload);
    if (getDocdocumentsRes.status) {
      yield put(getDocdocumentsSuccess(getDocdocumentsRes.data));
    } else {
      yield put(showErrorMessage(getDocdocumentsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getdocdocuments() {
  yield takeEvery(GET_DOCDOCUMENTS, getDocdocumentsById);
}
export default function* rootSaga() {
  yield all([fork(getdocdocuments)]);
}
