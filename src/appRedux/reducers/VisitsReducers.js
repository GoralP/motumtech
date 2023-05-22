import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    VISITS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_VISITS_SUCCESS_DATA,
    GET_VISITS_REPORT_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    SET_GLOBALDATA,
    GET_PROCEDURE_TYPE_SUCCESS,
    GET_SCHEDULE_STATUS_CHANGE,
    GET_DESKO_SERVICE_DATA_SUCCESS,
    SAVE_VISIT_DATA,
    SAVE_VISIT_DATA_SUCCESS,
    SAVE_VISIT_DATA_UNSUCCESS,
    GET_IDENTITY_DETAIL,
    GET_IDENTITY_DETAIL_SUCCESS_DATA,
    GET_SCHEDULE_VISIT_SUCCESS_DATA,
    ADD_VISIT_STATUS_CHANGE,
    ADD_IDENTITY_STATUS_CHANGE,
    GET_SCHEDULED_VISIT_STATUS_CHANGE,
    SAVE_TYPE_STATUS_CHANGE,
    CLOSE_MODAL_AFTER_SUCCESS,
    SAVING_TYPE_STATUS_CHANGE,
    GET_SCHEDULE_VISIT_LIST_SUCCESS_DATA,
    GET_SCHEDULE_STATUS_SUCCESS,
    CLEAR_DESKO_DATA
} from "constants/ActionTypes";

const INIT_STATE = {
    loader: false,
    alertMessage: '',
    successMessage: '', 
    showMessage: false,
    showSuccessMessage: false,
    initURL: '',
    get_visits_res: '',
    status: 'Initial',
    globaldata: [],
    get_procedure_type_res: [],
    get_desko_service_res: '',
    get_identity_details: '',
    get_schedule_status: '',
    get_scheduled_visit: '',
    save_visit_success: '',
    save_visit_unsuccess: '',
    addVisit: false,
    addIdentity : false,
    getScheduledVisit: false,
    saveTypeStatus: false,
    savingTypeStatus: false,
    closeModal: false
};

export default(state = INIT_STATE, action) => {

    switch (action.type) {

        case SHOW_MESSAGE:
            {
                return {
                    ...state,
                    alertMessage: action.payload,
                    showMessage: true,
                    loader: true,
                    status : 'Initial',
                }
            }
        case SET_GLOBALDATA:
            {
                return {
                    ...state,
                    globaldata: action.payload,
                }
            }
        case VISITS_STATUS_SHOW_SUCCESS_MESSAGE:
            {
                return {
                    ...state,
                    successMessage: action.payload,
                    showSuccessMessage: true,
                    loader: true,
                    status : 'Initial',
                }
            }
        case GET_STATUS_INITIAL:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }    
        case GET_VISITS_SUCCESS_DATA:
            {
                return {
                    ...state,
                    get_visits_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_SCHEDULE_STATUS_CHANGE:
            {
                return {
                    ...state,
                    get_schedule_status: false,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_PROCEDURE_TYPE_SUCCESS:
            {
                return {
                    ...state,
                    get_procedure_type_res: action.payload,
                    status : 'Dataloaded',
                }
            }
        case GET_DESKO_SERVICE_DATA_SUCCESS:
            {
                if (action.payload) {
                    return {
                        ...state,
                        get_desko_service_res: action.payload,
                        status : 'Dataloaded',
                        addVisit : true
                    }
                } else {
                    return {
                        ...state,
                        addVisit : false
                    }
                }
            }
        case CLEAR_DESKO_DATA:
            {
                return {
                    ...state,
                    get_desko_service_res : ''
                }
            }
        case ADD_VISIT_STATUS_CHANGE:
            {
                return {
                    ...state,
                    addVisit : action.payload
                }
            }
        case GET_IDENTITY_DETAIL:
            {
                return {
                    ...state,
                    loader : true
                }
            }
        case GET_IDENTITY_DETAIL_SUCCESS_DATA:
            {
                if (action.payload.status) {
                    return {
                        ...state,
                        get_identity_details: action.payload,
                        status : 'Dataloaded',
                        addIdentity : false,
                        getScheduledVisit : true,
                        loader: false
                    }
                } else {
                    return {
                        ...state,
                        get_identity_details: action.payload,
                        status : 'Dataloaded',
                        addIdentity : true,
                        loader: false
                    }
                }
            }
        case GET_SCHEDULE_VISIT_LIST_SUCCESS_DATA:
            {
                return {
                    ...state,
                    get_schedule_list: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_SCHEDULE_STATUS_SUCCESS:
            {
                return {
                    ...state,
                    get_schedule_status: true,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case ADD_IDENTITY_STATUS_CHANGE:
            {
                return {
                    ...state,
                    addIdentity : action.payload
                }
            }
        case GET_SCHEDULED_VISIT_STATUS_CHANGE:
            {
                return {
                    ...state,
                    getScheduledVisit : action.payload
                }
            }
        case GET_SCHEDULE_VISIT_SUCCESS_DATA:
            {
                if (action.payload.data.length > 0) {
                    return {
                        ...state,
                        get_scheduled_visit: action.payload,
                        status : 'Dataloaded',
                        saveTypeStatus: true
                    }
                } else if (action.payload.data.length === 0){
                    return {
                        ...state,
                        get_scheduled_visit: action.payload,
                        status : 'Dataloaded',
                        savingTypeStatus: true
                    }
                } else {
                    return {
                        ...state,
                        get_scheduled_visit: '',
                    }
                }
            }
        case SAVE_TYPE_STATUS_CHANGE:
            {
                return {
                    ...state,
                    saveTypeStatus : action.payload
                }
            }
        case SAVING_TYPE_STATUS_CHANGE:
            {
                return {
                    ...state,
                    savingTypeStatus : action.payload
                }
            }
        case SAVE_VISIT_DATA:
            {
                return {
                    ...state,
                    loader: true
                }
            }
        case SAVE_VISIT_DATA_SUCCESS:
            {
                return {
                    ...state,
                    save_visit_success: action.payload,
                    status : 'Dataloaded',
                    closeModal: true,
                    loader: false
                }
            }
        case CLOSE_MODAL_AFTER_SUCCESS:
            {
                return {
                    ...state,
                    closeModal : action.payload
                }
            }
        case SAVE_VISIT_DATA_UNSUCCESS:
            {
                return {
                    ...state,
                    save_visit_unsuccess: action.payload,
                    status : 'Dataloaded',
                    loader: false
                }
            }
        case GET_VISITS_REPORT_SUCCESS_DATA:
            {
                return {
                    ...state,
                    get_visits_res: action.payload,
                    loader: false,
                    status : 'Datareortloaded',
                }
            }
            
        case HIDE_MESSAGE:
            {
                return {
                    ...state,
                    alertMessage: '',
                    successMessage: '',
                    showMessage: false,
                    showSuccessMessage: false,
                    loader: false
                }
            }

        case ON_SHOW_LOADER:
            {
                return {
                    ...state,
                    loader: true
                }
            }
        case ON_HIDE_LOADER:
            {
                return {
                    ...state,
                    loader: false
                }
            }
        default:
            return state;
    }
}