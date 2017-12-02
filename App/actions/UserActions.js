import _ from 'lodash'
import Proxy from '../proxy/Proxy'
import PreferenceStore from '../utils/PreferenceStore';
import Config from '../../config';
import {
    UPDATE_PERSON_INFO,
    ACCESS_TOKEN_ACK,
    UPDATE_CERTIFICATE,
    SET_AUTH_TRUE
} from '../constants/UserConstants';
import {
    ON_GET_COURSE_ACHIEVEMENT
} from '../constants/CourseAchievementConstants';

import {
    updatePersonCourses,
    getAccBySectionId
} from '../actions/CourseActions';

import {
    GET_COURSES_INFO
}
    from '../constants/CourseConstants';


//tomcat端的登录
let doTomcatLogin=(username,password)=>{


    return new Promise((resolve, reject) => {

        Proxy.postes({
            url: Config.server + '/func/auth/webLogin',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            body: {
                loginName:username,
                password:password,
                loginType:1
            }
        }).then((json)=>{
            resolve({re:1})
        }).catch((e)=>{
            reject(e)
        })

    })

}


//nodejs端的登录
let doNodejsLogin=(username,password)=>{


    return new Promise((resolve, reject) => {

        Proxy.postes({
            url: Config.server + '/login',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "grant_type=password&password=" + password + "&username=" + username
        }).then((json)=>{
            var accessToken = json.access_token;
            resolve({re:1,data:{accessToken:accessToken}})
        }).catch((e)=>{
            reject(e)
        })

    })

}



//登录
export let doLogin = (username, password) => {

    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {


            var accessToken = null;

            doTomcatLogin(username,password).then((json)=>{

                //accessToken=json.data.accessToken


                //存储关于用户的帐号和密码信息
                dispatch(updateCertificate({ username: username, password: password }));

                PreferenceStore.put('username', username);
                PreferenceStore.put('password', password);

                //获取课程
                return Proxy.postes({
                    url: Config.server + '/func/courseBean/getCourseListMobile',
                    headers: {
                        'Authorization': "Bearer " + accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: {

                    }
                });
            }).then((json) => {

                //更新个人课程到redux
                if (json.re == 1) {
                    dispatch(updatePersonCourses(json.data ));
                }

                resolve({ re: 1 })

            }).catch((err) => {
                console.error(err)
                reject(err)
            });
        });
    }
}

//获取课程详细信息
export let getCourseInfo = (courseId) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            Proxy.postes({
                url: Config.server + '/func/courseBean/getCourseInfoMobile',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    courseId: courseId
                }
            }).then((json) => {
                resolve(json.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}



//获取课程节次
export let getCourseSection = (courseId) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            Proxy.postes({
                url: Config.server + '/func/courseBean/getCourseSectionMobile',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    courseId: 41028
                }
            }).then((json) => {


                if(json.data!=null&&json.data!=undefined&&json.data.length>0)
                {
                    var statistics={
                        sections:[],
                        target:json.data.length
                    }
                    for(let i=0;i<json.data.length;i++)
                    {
                        let section=json.data[i]
                        dispatch(getAccBySectionId(section.sectionId)).then((acc)=>{
                            if(Object.prototype.toString.call(acc)=='[object String]') {
                            }else{
                                section.accs=acc
                            }
                            statistics.sections.push(section);
                            if(statistics.sections.length==statistics.target)
                            {
                                resolve(statistics.sections)
                            }
                        })
                    }

                }else{
                    resolve(json.data)
                }

            }).catch((e) => {
                reject(e)
            })
        })
    }
}
//获取课程章节内容
export let getCourseChapter=(courseId)=>{
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            Proxy.postes({
                url: Config.server + '/func/courseBean/getCourseChapterInfoMobile',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    courseId: 41028
                }
            }).then((json) => {
                resolve(json.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}





//验证通过
export let setAuthTrue = () => {
    return {
        type: SET_AUTH_TRUE
    };
}

//更新凭证
export let updateCertificate = (payload) => {
    return {
        type: UPDATE_CERTIFICATE,
        payload: payload
    }
}

//更新个人信息
export let updatePersonInfo = (payload) => {
    return {
        type: UPDATE_PERSON_INFO,
        payload: payload
    }
}

//获取口令
let getAccessToken = (accessToken) => {
    if (accessToken !== null)
        return {
            type: ACCESS_TOKEN_ACK,
            accessToken: accessToken,
            validate: true
        };
    else
        return {
            type: ACCESS_TOKEN_ACK,
            accessToken: accessToken,
        }
}

//拉取个人培养课程成绩
export let acquirePlanCourseScores = () => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            Proxy.postes({
                url: Config.server + '/gradms/user',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'getNewCultivatePlanCourse',
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                reject(e)
            })
        })
    }
}

let _onGetCourseAchievement=(payload)=>{
    return {
        type:ON_GET_COURSE_ACHIEVEMENT,
        payload
    }
}

//获取成绩
export let onGetCourseAchievement=(payload)=>{
    return (dispatch, getState) => {
        dispatch(_onGetCourseAchievement(payload))
    }
}
