import {
    GET_AREA,
    GET_AREA_SUCCESS_DATA,
    SAVE_AREA_DATA,
    DELETE_AREA_DATA,
    GET_STATUS_INITIAL,
    SHOW_MESSAGE
  } from "./../../constants/ActionTypes";
  
  export const getAreas = (area) => {
    return {
      type: GET_AREA,
      payload: area
    };
  };

  export const getAreasSuccess = (data) => {
    return {
      type: GET_AREA_SUCCESS_DATA,
      payload: data
    };
  };

  export const saveAreaData = (Data) => {
    return {
      type: SAVE_AREA_DATA,
      payload: Data
    };
  };

  export const deleteAreaData = (Data) => {
    return {
      type: DELETE_AREA_DATA,
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