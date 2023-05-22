import {
  HIDE_MESSAGE,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  PROCEDURES_STATUS_SHOW_SUCCESS_MESSAGE,
  GET_PROCEDURES,
  GET_PROCEDURES_SUCCESS_DATA,
  GET_STATUS_INITIAL,
  GET_PROCEDURES_REPORT,
  GET_PROCEDURES_REPORT_SUCCESS_DATA,
  GET_PROCEDURE_FORM,
  GET_PROCEDURE_FORM_SUCCESS_DATA,
  CLOSE_PROCEDURE_MODAL,
  OPEN_PROCEDURE_MODAL,
  VIEW_PROCEDURE_DETAIL_PENDING,
  VIEW_PROCEDURE_DETAIL_SUCCESS,
  VIEW_PROCEDURE_DETAIL_FAILURE,
} from "constants/ActionTypes";

export const getProceduresSuccess = (data) => {
  return {
    type: GET_PROCEDURES_SUCCESS_DATA,
    payload: data,
  };
};

export const get_procedures = (procedure) => {
  return {
    type: GET_PROCEDURES,
    payload: procedure,
  };
};

export const getProcedurereportSuccess = (report) => {
  return {
    type: GET_PROCEDURES_REPORT_SUCCESS_DATA,
    payload: report,
  };
};

export const get_reportprocedure = (condition) => {
  return {
    type: GET_PROCEDURES_REPORT,
    payload: condition,
  };
};

export const get_procedure_form = (procedure) => {
  return {
    type: GET_PROCEDURE_FORM,
    payload: procedure,
  };
};

export const getProcedureFormSuccess = (data) => {
  return {
    type: GET_PROCEDURE_FORM_SUCCESS_DATA,
    payload: data,
  };
};

export const close_procedure_modal = (data) => {
  console.log("close_procedure_modal =>", data);
  return {
    type: CLOSE_PROCEDURE_MODAL,
    payload: data,
  };
};

export const open_procedure_modal = () => {
  return {
    type: OPEN_PROCEDURE_MODAL,
    payload: 0,
  };
};

export const setstatustoinitial = () => {
  return {
    type: GET_STATUS_INITIAL,
  };
};

export const showProceduralLoader = () => {
  return {
    type: ON_SHOW_LOADER,
  };
};

export const showErrorMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};

export const showSuccessMessage = (message) => {
  return {
    type: PROCEDURES_STATUS_SHOW_SUCCESS_MESSAGE,
    payload: message,
  };
};

export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER,
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};

export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER,
  };
};

export const getProcedureDetails = (procedure) => {
  return {
    type: VIEW_PROCEDURE_DETAIL_PENDING,
    payload: procedure,
  };
};

export const getProcedureDetailsSuccess = (procedureDatas) => {
  return {
    type: VIEW_PROCEDURE_DETAIL_SUCCESS,
    payload: procedureDatas,
  };
};

export const getProcedureDetailsFail = (error) => {
  return {
    type: VIEW_PROCEDURE_DETAIL_FAILURE,
    payload: error,
  };
};
