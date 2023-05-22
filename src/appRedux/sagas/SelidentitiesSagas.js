import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import { GET_SELIDENTITIES } from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getSelidentitiesSuccess,
} from "./../actions/SelidentitiesActions";

export const token = (state) => state.token;

let licenseId = "";
let identityId = "";

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
const getSelidentitiesByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetIdentites?licenseId=" +
        licenseId +
        "&IdentityId=" +
        identityId +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&Sort=" +
        payloadData.sortBy +
        "&PerPage=" +
        payloadData.perPage +
        "&FilterTag=" +
        payloadData.filterTag +
        "&searchTerm=" +
        payloadData.searchTerm,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getSelidentitiesRes) => getSelidentitiesRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getSelidentitiesById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (
      userData !== "" &&
      userData !== null &&
      userData["id"] !== undefined &&
      userData["IdentityId"] !== undefined
    ) {
      licenseId = userData["id"];
      identityId = userData["IdentityId"];
    }
  }

  try {
    const getSelidentitiesRes = yield call(getSelidentitiesByGroupId, payload);
    if (getSelidentitiesRes.status) {
      yield put(getSelidentitiesSuccess(getSelidentitiesRes.data));
    } else {
      yield put(showErrorMessage(getSelidentitiesRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getselidentities() {
  yield takeEvery(GET_SELIDENTITIES, getSelidentitiesById);
}
export default function* rootSaga() {
  yield all([fork(getselidentities)]);
}
