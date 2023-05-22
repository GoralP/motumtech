import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import { GET_ALLDOCUMENTS } from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getAlldocumentsSuccess,
} from "./../actions/AlldocumentsActions";

export const token = (state) => state.token;

let licenseId = "";
// let authToken = "";

// let userdata = localStorage.getItem(branchName + "_data");
// if (userdata != "" && userdata != null) {
//   let userData = JSON.parse(userdata);
//   if (userData != "" && userData != null && userData["id"] != undefined) {
//     licenseId = userData["id"];
//   }
// }

let userId = "";
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
const getAlldocumentsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "DocumentList?licenseId=" +
        userId +
        "&documentType=&PageNumber=1&Sort=+OwnerName&VisitId=" +
        payloadData.visit_id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getAlldocumentsRes) => getAlldocumentsRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getAlldocumentsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getAlldocumentsRes = yield call(getAlldocumentsByGroupId, payload);
    if (getAlldocumentsRes.status) {
      yield put(getAlldocumentsSuccess(getAlldocumentsRes.data));
    } else {
      yield put(showErrorMessage(getAlldocumentsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getalldocuments() {
  yield takeEvery(GET_ALLDOCUMENTS, getAlldocumentsById);
}
export default function* rootSaga() {
  yield all([fork(getalldocuments)]);
}
