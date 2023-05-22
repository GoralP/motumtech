import {
    GET_SERVICE,
    GET_SERVICE_SUCCESS_DATA,
    SAVE_SERVICE_DATA,
    DELETE_SERVICE_DATA,
    GET_STATUS_INITIAL,
    SHOW_MESSAGE
  } from "constants/ActionTypes";
  
  export const getServices = (area) => {
    return {
      type: GET_SERVICE,
      payload: area
    };
  };

  export const getServicesSuccess = (data) => {
    return {
      type: GET_SERVICE_SUCCESS_DATA,
      payload: data
    };
  };

  export const saveServiceData = (Data) => {
    return {
      type: SAVE_SERVICE_DATA,
      payload: Data
    };
  };

  export const deleteServiceData = (Data) => {
    return {
      type: DELETE_SERVICE_DATA,
      payload: Data
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
      payload: message
    };
  };