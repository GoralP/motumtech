import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_SERVICE,
  SAVE_SERVICE_DATA,
  DELETE_SERVICE_DATA,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getServicesSuccess,
} from "./../actions/ServiceActions";
import { message } from "antd";

export const token = (state) => state.token;
let licenseId = "";
let langName = "";

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

/*service api call section start*/
const getServiceByLicenseId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "ServiceList?LicenseId=" +
        licenseId +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&PerPage=" +
        payloadData.perPage +
        "&Sort=" +
        payloadData.sortBy,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getServiceRes) => getServiceRes.data)
    .catch((error) => error);

const saveServiceAPIcall = async (payloadData) =>
  await axios
    .post(baseURL + "UpsertService", payloadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getSaveRes) => getSaveRes.data)
    .catch((error) => error);

const deleteServiceAPIcall = async (payloadData) =>
  await axios
    .delete(
      baseURL +
        "DeleteService?LicenseId=" +
        licenseId +
        "&Id=" +
        payloadData.deleteId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDeleteRes) => getDeleteRes.data)
    .catch((error) => error);

/*service api call section end*/

//service api call function start
function* getServiceById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  // langName = localStorage.getItem(branchName+'_language');
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getServiceRes = yield call(getServiceByLicenseId, payload);
    if (getServiceRes.status) {
      yield put(getServicesSuccess(getServiceRes.data));
    } else {
      // yield put(showErrorMessage(getServiceRes.message));
      message.error(getServiceRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* saveService({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    var serviceObject = Object.assign({}, payload);
    const getSaveResult = yield call(saveServiceAPIcall, serviceObject);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-Id",
        perPage: 10,
        searchServiceTerm: "",
      };
      const getServiceRes = yield call(getServiceByLicenseId, payloadData);
      if (getServiceRes.status) {
        yield put(getServicesSuccess(getServiceRes.data));
      } else {
        // yield put(showErrorMessage(getServiceRes.message));
        message.error(getServiceRes.message);
      }
    } else {
      // yield put(showErrorMessage(getSaveResult.message));
      message.error(getSaveResult.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* deleteService({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  // langName = localStorage.getItem(branchName+'_language');
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getDeleteResult = yield call(deleteServiceAPIcall, payload);
    if (getDeleteResult.status) {
      message.success(getDeleteResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-Id",
        perPage: 10,
        searchServiceTerm: "",
      };
      const getServiceRes = yield call(getServiceByLicenseId, payloadData);
      if (getServiceRes.status) {
        yield put(getServicesSuccess(getServiceRes.data));
      } else {
        // yield put(showErrorMessage(getServiceRes.message));
        message.error(getServiceRes.message);
      }
    } else {
      // yield put(showErrorMessage(getDeleteResult.message));
      message.error(getDeleteResult.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
//service api call function end

//take every function call
export function* getServices() {
  yield takeEvery(GET_SERVICE, getServiceById);
}
export function* addService() {
  yield takeEvery(SAVE_SERVICE_DATA, saveService);
}
export function* removeService() {
  yield takeEvery(DELETE_SERVICE_DATA, deleteService);
}
export default function* rootSaga() {
  yield all([fork(getServices), fork(addService), fork(removeService)]);
}
