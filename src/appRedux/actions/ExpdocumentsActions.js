import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    EXPDOCUMENTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_EXPDOCUMENTS,
    GET_EXPDOCUMENTS_SUCCESS_DATA,
    GET_STATUS_INITIAL
  } from "constants/ActionTypes";
  
  export const getExpdocumentsSuccess = (data) => {
    return {
      type: GET_EXPDOCUMENTS_SUCCESS_DATA,
      payload: data
    };
  };
  
  export const get_expdocuments = (expdocument) => {
    return {
      type: GET_EXPDOCUMENTS,
      payload: expdocument
    };
  };
  
  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };

  export const showExpdocumentorsLoader = () => {
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
      type: EXPDOCUMENTS_STATUS_SHOW_SUCCESS_MESSAGE,
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