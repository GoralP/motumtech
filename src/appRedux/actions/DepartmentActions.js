import {
    GET_DEPARTMENT,
    GET_DROPDOWN,
    GET_DEPARTMENT_SUCCESS_DATA,
    GET_DROPDOWN_SUCCESS_DATA,
    SAVE_DEPARTMENT_DATA,
    DELETE_DEPARTMENT_DATA,
    GET_STATUS_INITIAL,
    SHOW_MESSAGE
  } from "constants/ActionTypes";
  
  export const getDepartments = (department) => {
    return {
      type: GET_DEPARTMENT,
      payload: department
    };
  };

  export const getDepartmentsSuccess = (data) => {
    return {
      type: GET_DEPARTMENT_SUCCESS_DATA,
      payload: data
    };
  };

  export const getDropDownData = () => {
    return {
      type: GET_DROPDOWN
    };
  };

  export const getDropDownSuccess = (data) => {
    return {
      type: GET_DROPDOWN_SUCCESS_DATA,
      payload: data
    };
  };

  export const saveDepartmentData = (Data) => {
    return {
      type: SAVE_DEPARTMENT_DATA,
      payload: Data
    };
  };

  export const deleteDepartmentData = (Data) => {
    return {
      type: DELETE_DEPARTMENT_DATA,
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