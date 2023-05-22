import {
  GET_PROCESS_DATA,
  GET_PROCESS_WORK_INSTRUCTION_DATA,
  GET_PROCESS_SUCCESS_DATA,
  GET_PROCESS_WORK_ISTRUCTION_SUCCESS_DATA,
  SAVE_PROCESS_DATA,
  SAVE_PROCEDURE_LAUNCH_DATA,
  DELETE_PROCESS_DATA,
  GET_STATUS_INITIAL,
  SHOW_MESSAGE,
  GET_PROCESS_DROPDOWN,
  GET_PROCESS_DROPDOWN_SUCCESS,
  GET_SYNCHRONIZE_PENDING,
  GET_SYNCHRONIZE_SUCCESS,
  GET_SYNCHRONIZE_FAILURE,
} from "constants/ActionTypes";

export const getProcessData = (process) => {
  return {
    type: GET_PROCESS_DATA,
    payload: process,
  };
};

export const getProcessSuccess = (data) => {
  return {
    type: GET_PROCESS_SUCCESS_DATA,
    payload: data,
  };
};

export const getProcessWorkInstructionData = (process) => {
  return {
    type: GET_PROCESS_WORK_INSTRUCTION_DATA,
    payload: process,
  };
};

export const getProcessWorkInstructionSuccess = (data) => {
  return {
    type: GET_PROCESS_WORK_ISTRUCTION_SUCCESS_DATA,
    payload: data,
  };
};

export const processNamesForDropDownList = () => {
  return {
    type: GET_PROCESS_DROPDOWN,
  };
};

export const getProcessDropDownSuccess = (data) => {
  return {
    type: GET_PROCESS_DROPDOWN_SUCCESS,
    payload: data,
  };
};

export const saveProcessData = (Data) => {
  return {
    type: SAVE_PROCESS_DATA,
    payload: Data,
  };
};

export const saveProcedureLaunchData = (Data) => {
  return {
    type: SAVE_PROCEDURE_LAUNCH_DATA,
    payload: Data,
  };
};

export const deleteProcessData = (Data) => {
  return {
    type: DELETE_PROCESS_DATA,
    payload: Data,
  };
};

export const setStatusToInitial = () => {
  return {
    type: GET_STATUS_INITIAL,
  };
};

export const showErrorMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};

export const getSynchronize = (data) => {
  return {
    type: GET_SYNCHRONIZE_PENDING,
    payload: data,
  };
};

export const getSynchronizeSuccess = (syncData) => {
  return {
    type: GET_SYNCHRONIZE_SUCCESS,
    payload: syncData,
  };
};

export const getSynchronizeFail = (error) => {
  return {
    type: GET_SYNCHRONIZE_FAILURE,
    payload: error,
  };
};
