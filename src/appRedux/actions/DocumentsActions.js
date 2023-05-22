import {
    HIDE_DOCUMENT_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    DOCUMENTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_DOCUMENTS,
    GET_DOCUMENTS_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    GET_DOCUMENTS_REPORT,
    GET_DOCUMENTS_REPORT_SUCCESS_DATA
  } from "constants/ActionTypes";
  
  export const getDocumentsSuccess = (data) => {
    return {
      type: GET_DOCUMENTS_SUCCESS_DATA,
      payload: data
    };
  };
  
  export const get_documents = (document) => {
    return {
      type: GET_DOCUMENTS,
      payload: document
    };
  };

  export const getDocumentreportSuccess = (report) => {
    return {
      type: GET_DOCUMENTS_REPORT_SUCCESS_DATA,
      payload: report
    };
  };

  export const get_reportdocument = (condition) => {
    return {
      type: GET_DOCUMENTS_REPORT,
      payload: condition
    };
  };
  
  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };

  export const showDocumentalLoader = () => {
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
      type: DOCUMENTS_STATUS_SHOW_SUCCESS_MESSAGE,
      payload: message
    };
  };
  
  export const showAuthLoader = () => {
    return {
      type: ON_SHOW_LOADER,
    };
  };
  
  export const hideDocumentMessage = () => {
    return {
      type: HIDE_DOCUMENT_MESSAGE,
    };
  };
  
  export const hideAuthLoader = () => {
    return {
      type: ON_HIDE_LOADER,
    };
  };