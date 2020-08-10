import {
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
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
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false,
            }

        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }

        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                profile: null // Add this
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }

        default:
            return state;
    }
}