import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_IDENTITIES,
  GET_SINGLEIDENTITY,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getIdentitiesSuccess,
  getSingleIdentitySuccess,
} from "./../actions/IdentitiesActions";

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
// let userAuth = JSON.parse(localStorage.getItem("user"));
// let userAuth = JSON.parse(localStorage.getItem("userAuth"));
// let tokentest = userAuth.Username + "-" + licenseId + ":" + userAuth.Password;

// let authToken = window.btoa(tokentest);

let authBasic = "";
console.log("testtoken-->", authBasic);

const headers = {
  "Content-Type": "application/json",
  Authorization: "Basic " + authBasic,
  //   Authorization: "Basic NDY2Nzg4NTVYLTQ6NDY2Nzg4NTVY",
};

/*Identities Module Start Add, Get*/

//get identities
const getIdentitiesByGroupId = async (payloadData) =>
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
          //   Authorization: "Basic NDY2Nzg4NTVYLTQ6NDY2Nzg4NTVY",
        },
      }
    )
    .then((getIdentitiesRes) => getIdentitiesRes.data)
    .catch((error) => error);

const getSingleIdentityByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "VeoliaIdentityDetail?licenseId=" +
        licenseId +
        "&IdentityId=" +
        payloadData.IdentityID,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
          //   Authorization: "Basic NDY2Nzg4NTVYLTQ6NDY2Nzg4NTVY",
        },
      }
    )
    .then((getSignleIdentityRes) => getSignleIdentityRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getIdentitiesById({ payload }) {
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

  console.log("license id--->", licenseId);
  try {
    const getIdentitiesRes = yield call(getIdentitiesByGroupId, payload);
    if (getIdentitiesRes.status) {
      yield put(getIdentitiesSuccess(getIdentitiesRes.data));
    } else {
      yield put(showErrorMessage(getIdentitiesRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* getSingleIdentityById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");

  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getSignleIdentityRes = yield call(
      getSingleIdentityByGroupId,
      payload
    );
    if (getSignleIdentityRes.status) {
      yield put(getSingleIdentitySuccess(getSignleIdentityRes.data));
    } else {
      yield put(showErrorMessage(getSignleIdentityRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getidentities() {
  yield takeEvery(GET_IDENTITIES, getIdentitiesById);
}
export function* getsingleidentity() {
  yield takeEvery(GET_SINGLEIDENTITY, getSingleIdentityById);
}
export default function* rootSaga() {
  yield all([fork(getidentities), fork(getsingleidentity)]);
}
