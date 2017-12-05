
import _ from 'lodash'
import Proxy from '../proxy/Proxy'
import PreferenceStore from '../utils/PreferenceStore';
import Config from '../../config';
import {
    RTMP_UPDATE_URL
} from '../constants/LiveConstants';



let updateRtmpUrl = (payload) => {
    return {
        type: RTMP_UPDATE_URL,
        payload
    }
}

//获取直播推流
export let getRTMPPushUrl = (payload) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

            var {time,loginName,title,brief,longbrief}=payload
            Proxy.postes({
                url: Config.server + '/func/courseBean/getRtmpPushUrl',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    time,
                    type:"RTMP",
                    hubType:1,
                    streamName:loginName,
                    title,
                    brief,
                    longbrief,

                }
            }).then((json) => {
                dispatch(updateRtmpUrl({ url:json.data }));
                resolve(json.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}
