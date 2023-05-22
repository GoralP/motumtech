import {
    SHOW_MESSAGE,
    REPORTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_REPORTS,
    GET_REPORTS_SUCCESS_DATA,
    GET_TRAINING_REPORTS,
    GET_TRAINING_REPORTS_SUCCESS_DATA,	
    GET_STATUS_INITIAL
  } from "constants/ActionTypes";
  
  export const getReportsSuccess = (data) => {
    return {
      type: GET_REPORTS_SUCCESS_DATA,
      payload: data
    };
  };
  
  export const get_reports = (report) => {
    return {
      type: GET_REPORTS,
      payload: report
    };
  };

  export const getTrainingReportsSuccess = (data) => {
    return {
      type: GET_TRAINING_REPORTS_SUCCESS_DATA,
      payload: data
    };
  };

  export const get_training_reports = (year) => {
    return {
      type: GET_TRAINING_REPORTS,
      payload: year
    };
  };
  
  export const showErrorMessage = (message) => {
    return {
      type: SHOW_MESSAGE,
      payload: message
    };
  };
  
  export const showSuccessMessage = (message) => {
    return {
      type: REPORTS_STATUS_SHOW_SUCCESS_MESSAGE,
      payload: message
    };
  };

  export const setstatustoinitial = () => {	
    return {	
      type: GET_STATUS_INITIAL,	
    };	
  };