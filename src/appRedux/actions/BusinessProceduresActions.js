import {
  GET_PROCEDURE,
  GET_PROCEDURE_SUCCESS_DATA,
  DELETE_PROCEDURE_DATA,
  GET_MOREAPPFORMDATA_DATA,
  GET_MOREAPPFORMDATA_SUCCESS_DATA,
  GET_MOREAPPFORMDATA_FAIL_DATA,
  GET_DEVICE_DATA,
  GET_DEVICE_SUCCESS_DATA,
  SAVE_PROCEDURE_DATA,
  UPDATE_PROCEDURE_DATA,
  GET_DETAIL_PROCEDURE,
  GET_DETAIL_PROCEDURE_SUCCESS_DATA,
  GET_STATUS_INITIAL,
  SHOW_MESSAGE11,
  GET_STATUS_STARTING,
  RESUBMIT_TO_GIA_PENDING,
  RESUBMIT_TO_GIA_SUCCESS,
  RESUBMIT_TO_GIA_FAILURE,
  GET_COUNTER_PENDING,
  GET_COUNTER_SUCCESS,
  GET_COUNTER_FAILURE,
  RELAUNCH_DATA_PENDING,
  RELAUNCH_DATA_SUCCESS,
  RELAUNCH_DATA_FAILURE,
  GET_EXPORT_PENDING,
  GET_EXPORT_SUCCESS,
  GET_EXPORT_FAILURE,
} from "constants/ActionTypes";

export const getCountData = (data) => {
  return {
    type: GET_COUNTER_PENDING,
    payload: data,
  };
};

export const getCountDataSuccess = (countData) => {
  return {
    type: GET_COUNTER_SUCCESS,
    payload: countData,
  };
};

export const getCountDataFail = (error) => {
  return {
    type: GET_COUNTER_FAILURE,
    payload: error,
  };
};

export const getExportData = (data) => {
  return {
    type: GET_EXPORT_PENDING,
    payload: data,
  };
};

export const getExportDataSuccess = (exportData) => {
  return {
    type: GET_EXPORT_SUCCESS,
    payload: exportData,
  };
};

export const getExportDataFail = (error) => {
  return {
    type: GET_EXPORT_FAILURE,
    payload: error,
  };
};

export const getProcedures = (procedure) => {
  return {
    type: GET_PROCEDURE,
    payload: procedure,
  };
};

export const getProceduresDataSuccess = (data) => {
  return {
    type: GET_PROCEDURE_SUCCESS_DATA,
    payload: data,
  };
};

export const getDetailProcedure = (detail) => {
  return {
    type: GET_DETAIL_PROCEDURE,
    payload: detail,
  };
};

export const getDetailProcedureDataSuccess = (data) => {
  return {
    type: GET_DETAIL_PROCEDURE_SUCCESS_DATA,
    payload: data,
  };
};

export const deleteProcedureData = (data) => {
  return {
    type: DELETE_PROCEDURE_DATA,
    payload: data,
  };
};

export const getMoreAppFormData = (data) => {
  return {
    type: GET_MOREAPPFORMDATA_DATA,
    payload: data,
  };
};

export const getMoreAppFormDataSuccess = (data) => {
  return {
    type: GET_MOREAPPFORMDATA_SUCCESS_DATA,
    payload: data,
  };
};

export const getMoreAppFormDataFail = (status) => {
  return {
    type: GET_MOREAPPFORMDATA_FAIL_DATA,
    payload: status,
  };
};

export const getDeviceData = (data) => {
  return {
    type: GET_DEVICE_DATA,
    payload: data,
  };
};

export const getDeviceDataSuccess = (data) => {
  return {
    type: GET_DEVICE_SUCCESS_DATA,
    payload: data,
  };
};

export const saveProcedureData = (Data) => {
  return {
    type: SAVE_PROCEDURE_DATA,
    payload: Data,
  };
};

export const updateProcedureData = (Data) => {
  return {
    type: UPDATE_PROCEDURE_DATA,
    payload: Data,
  };
};

export const setStatusToInitial = () => {
  return {
    type: GET_STATUS_INITIAL,
  };
};

export const setStatusToStarting = () => {
  return {
    type: GET_STATUS_STARTING,
  };
};

export const showErrorMessage = (message) => {
  return {
    type: SHOW_MESSAGE11,
    payload: message,
  };
};

export const submitGiaLink = (data) => {
  return {
    type: RESUBMIT_TO_GIA_PENDING,
    payload: data,
  };
};

export const submitGiaLinkSuccess = (submitData) => {
  return {
    type: RESUBMIT_TO_GIA_SUCCESS,
    payload: submitData,
  };
};

export const submitGiaLinkFail = (error) => {
  return {
    type: RESUBMIT_TO_GIA_FAILURE,
    payload: error,
  };
};

export const relaunchData = (reData) => {
  return {
    type: RELAUNCH_DATA_PENDING,
    payload: reData,
  };
};

export const relaunchDataSuccess = (redatas) => {
  return {
    type: RELAUNCH_DATA_SUCCESS,
    payload: redatas,
  };
};

export const relaunchDataFail = (error) => {
  return {
    type: RELAUNCH_DATA_FAILURE,
    payload: error,
  };
};
