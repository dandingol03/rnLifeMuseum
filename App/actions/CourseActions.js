
import _ from 'lodash'
import Proxy from '../proxy/Proxy'
import Config from '../../config';
import {
    UPDATE_PERSON_COURSES
} from '../constants/CourseConstants';

//更新个人课程信息
export let updatePersonCourses = (courses) => {
    return {
        type: UPDATE_PERSON_COURSES,
        payload:{courses}
    }
}

//获取课程节次的相关资源
export let getAccBySectionId = (sectionId) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            Proxy.postes({
                url: Config.server + '/func/courseBean/getAccBySectionId',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    sectionId: sectionId
                }
            }).then((json) => {
                resolve(json.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}
