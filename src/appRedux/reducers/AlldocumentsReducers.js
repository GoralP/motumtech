import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    ALLDOCUMENTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_ALLDOCUMENTS_SUCCESS_DATA,
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
    get_alldocuments_res: '',
    status : 'Initial'
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

        case ALLDOCUMENTS_STATUS_SHOW_SUCCESS_MESSAGE:
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
        case GET_STATUS_INITIAL:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }    
        case GET_ALLDOCUMENTS_SUCCESS_DATA:
            {
                // console.log("payload",action.payload)
                return {
                    ...state,
                    // authUser: null,
                    get_alldocuments_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
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
// export default INIT_STATE;