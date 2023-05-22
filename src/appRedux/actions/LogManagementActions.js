import {
  GET_LOG_MANAGEMENT_DATA_PENDING,
  GET_LOG_MANAGEMENT_DATA_SUCCESS,
  GET_LOG_MANAGEMENT_DATA_FAILURE,
} from "constants/ActionTypes";

export const getLogManagement = (logData) => {
  return {
    type: GET_LOG_MANAGEMENT_DATA_PENDING,
    payload: logData,
  };
};

export const getLogManagementSuccess = (logDatas) => {
  return {
    type: GET_LOG_MANAGEMENT_DATA_SUCCESS,
    payload: logDatas,
  };
};

export const getLogManagementFail = (error) => {
  return {
    type: GET_LOG_MANAGEMENT_DATA_FAILURE,
    payload: error,
  };
};
