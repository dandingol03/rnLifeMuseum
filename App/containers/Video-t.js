
import React, {Component} from 'react';

import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    Alert,
    InteractionManager
} from 'react-native';


import {connect} from 'react-redux';
import Video from 'react-native-video'
var {height, width} = Dimensions.get('window');


class VideoT extends Component {

    render(){
        return (
            <View style={{flex:1}}>
                <Video source={{uri: "http://flashmedia.eastday.com/newdate/news/2016-11/shznews1125-19.mp4", mainVer: 1, patchVer: 0}} // Looks for .mp4 file (background.mp4) in the given expansion version.
                       rate={1.0}                   // 0 is paused, 1 is normal.
                       volume={1.0}                 // 0 is muted, 1 is normal.
                       muted={false}                // Mutes the audio entirely.
                       paused={false}               // Pauses playback entirely.
                       resizeMode="cover"           // Fill the whole screen at aspect ratio.
                       repeat={true}                // Repeat forever.
                       onLoadStart={()=>{
                          console.log("begin to load")
                       }} // Callback when video starts to load
                       onLoad={(data)=>{
                           console.log(data)
                       }}    // Callback when video loads
                       onProgress={(data)=>{
                           console.log(data)
                       }}    // Callback every ~250ms with currentTime
                       onError={(e)=>{
                           console.error(e)
                       }}    // Callback when video cannot be loaded
                       style={styles.backgroundVideo} />
            </View>)
    }

}


// Later on in your styles..
var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});



export default connect()(VideoT);
