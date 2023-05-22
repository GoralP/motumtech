import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    SELIDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_SELIDENTITIES_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    CLOSE_MODAL,
    OPEN_MODAL,
    CLOSE_SELIDENTITY_MODAL,
    OPEN_SELIDENTITY_MODAL
} from "constants/ActionTypes";

// import States from "../states/states";

const INIT_STATE = {
    loader: false,
    alertMessage: '',
    successMessage: '', 
    showMessage: false,
    showSuccessMessage: false,
    initURL: '',
    get_selidentities_res: '',
    status : 'Initial',
    modalclosecall: false,
    selidentitymodalclosecall: false
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

        case SELIDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE:
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
        case CLOSE_MODAL:
        {
            return {
                ...state,
                modalclosecall : true
            }
        }
        case OPEN_MODAL:
        {
            return {
                ...state,
                modalclosecall : false
            }
        }
        case CLOSE_SELIDENTITY_MODAL:
        {
            return {
                ...state,
                selidentitymodalclosecall : true
            }
        }
        case OPEN_SELIDENTITY_MODAL:
        {
            return {
                ...state,
                selidentitymodalclosecall : false
            }
        }
        case GET_SELIDENTITIES_SUCCESS_DATA:
            {
                // console.log("payload",action.payload)
                return {
                    ...state,
                    // authUser: null,
                    get_selidentities_res: action.payload,
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