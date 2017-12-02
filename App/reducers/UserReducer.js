import {
    UPDATE_PERSON_INFO,
    ACCESS_TOKEN_ACK,
    UPDATE_CERTIFICATE,
    SET_AUTH_TRUE
} from '../constants/UserConstants';

import {
    UPDATE_PERSON_COURSES
} from '../constants/CourseConstants';



const initialState = {
    accessToken: null,
    auth: false,
    personInfo: null,
    portrait: null,
    courses:null
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case ACCESS_TOKEN_ACK:

            return Object.assign({}, state, {
                accessToken: action.accessToken,
                validate: action.validate,
                auth: action.auth
            })
        case UPDATE_PERSON_INFO:
            var { data } = action.payload;
            return Object.assign({}, state, {
                personInfo: data
            })
        case UPDATE_CERTIFICATE:
            var { username, password } = action.payload;
            return Object.assign({}, state, {
                username: username,
                password: password,
                auth:true
            })

        case SET_AUTH_TRUE:
            return Object.assign({}, state, {
                auth: true,

            })
        case UPDATE_PERSON_COURSES:
            var {courses}=action.payload
            return Object.assign({},state,{
                courses
            })


        default:
            return state;
    }
}

export default user;
