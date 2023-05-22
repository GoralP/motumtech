import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_AREA,
  SAVE_AREA_DATA,
  DELETE_AREA_DATA,
} from "./../../../src/constants/ActionTypes";
import { showErrorMessage, getAreasSuccess } from "./../actions/AreaActions";
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

/*area api call section start*/
const getAreaByLicenseId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "AreaList?licenseId=" +
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
    .then((getAreaRes) => getAreaRes.data)
    .catch((error) => error);

const saveAreaAPIcall = async (payloadData) =>
  await axios
    .post(baseURL + "UpsertArea?lang=" + langName, payloadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getSaveRes) => getSaveRes.data)
    .catch((error) => error);

const deleteAreaAPIcall = async (payloadData) =>
  await axios
    .delete(
      baseURL +
        "DeleteArea?lang=" +
        langName +
        "&LicenseId=" +
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

/*area api call section end*/

//area api call function start
function* getAreaById({ payload }) {
  if (payload === "" || payload === undefined) {
    payload = { pageNumber: "", sortBy: "", perPage: "", searchAreaTerm: "" };
  }
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getAreaRes = yield call(getAreaByLicenseId, payload);
    if (getAreaRes.status) {
      yield put(getAreasSuccess(getAreaRes.data));
    } else {
      yield put(showErrorMessage(getAreaRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* saveArea({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    var areaObject = Object.assign({}, payload);
    langName = localStorage.getItem(branchName + "_language");
    const getSaveResult = yield call(saveAreaAPIcall, areaObject);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-Id",
        perPage: 10,
        searchAreaTerm: "",
      };
      const getAreaRes = yield call(getAreaByLicenseId, payloadData);
      if (getAreaRes.status) {
        yield put(getAreasSuccess(getAreaRes.data));
      } else {
        yield put(showErrorMessage(getAreaRes.message));
      }
    } else {
      yield put(showErrorMessage(getSaveResult.message));
      message.error(getSaveResult.message);
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* deleteArea({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  let userdata = localStorage.getItem(branchName + "_data");
  langName = localStorage.getItem(branchName + "_language");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getDeleteResult = yield call(deleteAreaAPIcall, payload);
    if (getDeleteResult.status) {
      message.success(getDeleteResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-Id",
        perPage: 10,
        searchAreaTerm: "",
      };
      const getAreaRes = yield call(getAreaByLicenseId, payloadData);
      if (getAreaRes.status) {
        yield put(getAreasSuccess(getAreaRes.data));
      } else {
        yield put(showErrorMessage(getAreaRes.message));
      }
    } else {
      yield put(showErrorMessage(getDeleteResult.message));
      message.error(getDeleteResult.message);
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//area api call function end

//take every function call
export function* getAreas() {
  yield takeEvery(GET_AREA, getAreaById);
}
export function* addArea() {
  yield takeEvery(SAVE_AREA_DATA, saveArea);
}
export function* removeArea() {
  yield takeEvery(DELETE_AREA_DATA, deleteArea);
}
export default function* rootSaga() {
  yield all([fork(getAreas), fork(addArea), fork(removeArea)]);
}
