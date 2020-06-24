import {
    GET_PROFILE,
    PROFILE_ERROR
} from '../actions/types';

const initialState = {
    //Individual profile
    profile: null,
    //All profile listings
    profiles: [],
    //Github repositories
    repos: [],
    //For profile requests
    loading: true,
    //Errors for the requests
    error: {}
}

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false,
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }

        default:
            return state;
    }
}