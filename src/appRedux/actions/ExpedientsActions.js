import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    EXPEDIENTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_EXPEDIENTS,
    GET_EXPEDIENTS_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    GET_EXPEDIENTS_REPORT,
    GET_EXPEDIENTS_REPORT_SUCCESS_DATA,
    GET_EXPEDIENT_FORM,
    GET_EXPEDIENT_FORM_SUCCESS_DATA,
    CLOSE_EXPEDIENT_MODAL,
    OPEN_EXPEDIENT_MODAL
  } from "constants/ActionTypes";
  
  export const getExpedientsSuccess = (data) => {
    return {
      type: GET_EXPEDIENTS_SUCCESS_DATA,
      payload: data
    };
  };

  export const close_expedient_modal = (data) => {
    return {
      type: CLOSE_EXPEDIENT_MODAL,
      payload:data
    };
  };

  export const open_expedient_modal = () => {
    return {
      type: OPEN_EXPEDIENT_MODAL,
      payload:0
    };
  };
  
  export const get_expedients = (expedient) => {
    return {
      type: GET_EXPEDIENTS,
      payload: expedient
    };
  };

  export const getExpedientreportSuccess = (report) => {
    return {
      type: GET_EXPEDIENTS_REPORT_SUCCESS_DATA,
      payload: report
    };
  };

  export const get_reportexpedient = (condition) => {
    return {
      type: GET_EXPEDIENTS_REPORT,
      payload: condition
    };
  };

  export const get_expedient_form = (expedient) => {
    return {
      type: GET_EXPEDIENT_FORM,
      payload: expedient
    };
  };

  export const getExpedientFormSuccess = (data) => {
    return {
      type: GET_EXPEDIENT_FORM_SUCCESS_DATA,
      payload: data
    };
  };
  
  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };
  
  export const showExpedientorsLoader = () => {
    return {
      type: ON_SHOW_LOADER,
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
      type: EXPEDIENTS_STATUS_SHOW_SUCCESS_MESSAGE,
      payload: message
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