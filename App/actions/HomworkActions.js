
import _ from 'lodash'
import Proxy from '../proxy/Proxy'
import PreferenceStore from '../utils/PreferenceStore';
import Config from '../../config';




//todo:make taskId variable
//获取课程相关作业
export let getHomeworkByTaskId = (taskId) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;
            Proxy.postes({
                url: Config.server + '/func/homeworkBean/getHomeworkMobileByTaskId',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    taskId: 4783
                }
            }).then((json) => {
                resolve(json.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}
