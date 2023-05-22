import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    GETREPORTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_GETREPORTS,
    GET_GETREPORTS_SUCCESS_DATA,
    GET_STATUS_INITIAL
  } from "constants/ActionTypes";
  
  export const getGetreportsSuccess = (data) => {
    return {
      type: GET_GETREPORTS_SUCCESS_DATA,
      payload: data
    };
  };
  
  export const get_getreports = (getreport) => {
    return {
      type: GET_GETREPORTS,
      payload: getreport
    };
  };
  
  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };

  export const showGetreportsLoader = () => {
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
      type: GETREPORTS_STATUS_SHOW_SUCCESS_MESSAGE,
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