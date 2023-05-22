import {
  SELECT_PROCEDURE_PENDING,
  SELECT_PROCEDURE_SUCCESS,
  SELECT_PROCEDURE_FAILURE,
  GET_PROCEDURE_CONFIG_PENDING,
  GET_PROCEDURE_CONFIG_SUCCESS,
  GET_PROCEDURE_CONFIG_FAILURE,
  GET_PROCEDURE_BY_ID_PENDING,
  GET_PROCEDURE_BY_ID_SUCCESS,
  GET_PROCEDURE_BY_ID_FAILURE,
  ADD_PROCEDURE_CONFIG_PENDING,
  ADD_PROCEDURE_CONFIG_SUCCESS,
  ADD_PROCEDURE_CONFIG_FAILURE,
  CLEAR_DATA,
  UPDATE_PROCEDURE_PENDING,
  UPDATE_PROCEDURE_SUCCESS,
  UPDATE_PROCEDURE_FAILURE,
  GET_STATUS_INITIAL,
  GET_STATUS_STARTING,
  DELETE_PROCEDURE_PENDING,
  DELETE_PROCEDURE_SUCCESS,
  DELETE_PROCEDURE_FAILURE,
} from "constants/ActionTypes";

export const getVisitProcedure = (procedure) => {
  return {
    type: SELECT_PROCEDURE_PENDING,
    payload: procedure,
  };
};

export const getProcedureSuccess = (procedureData) => {
  return {
    type: SELECT_PROCEDURE_SUCCESS,
    payload: procedureData,
  };
};

export const getProcedureFail = (error) => {
  return {
    type: SELECT_PROCEDURE_FAILURE,
    payload: error,
  };
};

export const getProcedureConfig = (procedureconfig) => {
  return {
    type: GET_PROCEDURE_CONFIG_PENDING,
    payload: procedureconfig,
  };
};

export const getProcedureConfigSuccess = (procedureDatas) => {
  return {
    type: GET_PROCEDURE_CONFIG_SUCCESS,
    payload: procedureDatas,
  };
};

export const getProcedureConfigFail = (error) => {
  return {
    type: GET_PROCEDURE_CONFIG_FAILURE,
    payload: error,
  };
};

export const getProcedureConfigById = (procedureById) => {
  return {
    type: GET_PROCEDURE_BY_ID_PENDING,
    payload: procedureById,
  };
};

export const getProcedureConfigByIdSuccess = (procedureDataById) => {
  return {
    type: GET_PROCEDURE_BY_ID_SUCCESS,
    payload: procedureDataById,
  };
};

export const getProcedureConfigByIdFail = (error) => {
  return {
    type: GET_PROCEDURE_BY_ID_FAILURE,
    payload: error,
  };
};

export const clearData = () => {
  return {
    type: CLEAR_DATA,
  };
};

export const addProcessData = (configData) => {
  return {
    type: ADD_PROCEDURE_CONFIG_PENDING,
    payload: configData,
  };
};

export const addProcessDataSuccess = (addData) => {
  return {
    type: ADD_PROCEDURE_CONFIG_SUCCESS,
    payload: addData,
  };
};

export const addProcessDataFail = (error) => {
  return {
    type: ADD_PROCEDURE_CONFIG_FAILURE,
    payload: error,
  };
};

export const updateProcessData = (data) => {
  return {
    type: UPDATE_PROCEDURE_PENDING,
    payload: data,
  };
};

export const updateProcessDataSuccess = (updateData) => {
  return {
    type: UPDATE_PROCEDURE_SUCCESS,
    payload: updateData,
  };
};

export const updateProcessDataFail = (error) => {
  return {
    type: UPDATE_PROCEDURE_FAILURE,
    payload: error,
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

//DELETE PROCEDURE API CALL ----------------------------------------------------------->START

export const deleteProcedure = (prId) => {
  return {
    type: DELETE_PROCEDURE_PENDING,
    payload: prId,
  };
};

export const deleteProcedureSuccess = (deleteId) => {
  return {
    type: DELETE_PROCEDURE_SUCCESS,
    payload: deleteId,
  };
};

export const deleteProcedureFail = (error) => {
  return {
    type: DELETE_PROCEDURE_FAILURE,
    payload: error,
  };
};

// DELETE PROCEDURE API CALL----------------------------------------------------------------------------> END
