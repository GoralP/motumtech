import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    REPORTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_REPORTS,
    GET_REPORTS_SUCCESS_DATA,
    GET_TRAINING_REPORTS_SUCCESS_DATA,	
    GET_STATUS_INITIAL
} from "constants/ActionTypes";

// import States from "../states/states";

const INIT_STATE = {
    loader: false,
    alertMessage: '',
    successMessage: '', 
    showMessage: false,
    showSuccessMessage: false,
    initURL: '',
    get_reports_res: '',
    get_training_reports_res: '',
    status : 'Initial',
};

export default(state = INIT_STATE, action) => {

    // if(States ===undefined){     return new States(); }
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

        case REPORTS_STATUS_SHOW_SUCCESS_MESSAGE:
            {
                return {
                    ...state,
                    // authUser: null,
                    successMessage: action.payload,
                    showSuccessMessage: true,
                    loader: true,
                    status : 'Initial',
                }
            }
        case GET_REPORTS:
            {
                return {
                    ...state,
                    loader: true,
                }
            }
        case GET_REPORTS_SUCCESS_DATA:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_reports_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_TRAINING_REPORTS_SUCCESS_DATA:
            {
                // console.log("payload",action.payload)
                return {
                    ...state,
                    // authUser: null,
                    get_training_reports_res: action.payload,
                    reportLoader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_STATUS_INITIAL:	
            {	
                return{	
                    ...state,	
                    get_reports_res: '',	
                }	
            }
        default:
            return state;
    }
}
// export default INIT_STATE;