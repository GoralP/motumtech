import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    EMPLOYEES_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_EMPLOYEES,
    GET_EMPLOYEES_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    GET_EMPLOYEES_REPORT,
    GET_EMPLOYEES_REPORT_SUCCESS_DATA
  } from "constants/ActionTypes";
  
  export const getEmployeesSuccess = (data) => {
    return {
      type: GET_EMPLOYEES_SUCCESS_DATA,
      payload: data
    };
  };
  
  export const get_employees = (employee) => {
    return {
      type: GET_EMPLOYEES,
      payload: employee
    };
  };

  export const getEmployeereportSuccess = (report) => {
    return {
      type: GET_EMPLOYEES_REPORT_SUCCESS_DATA,
      payload: report
    };
  };

  export const get_reportemployee = (condition) => {
    return {
      type: GET_EMPLOYEES_REPORT,
      payload: condition
    };
  };
  
  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };

  export const showEmployersLoader = () => {
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
      type: EMPLOYEES_STATUS_SHOW_SUCCESS_MESSAGE,
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