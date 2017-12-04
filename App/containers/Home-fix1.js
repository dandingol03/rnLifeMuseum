
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextInputWrapper from '../plugins/TextInputWrapper'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from '../plugins/ToolbarWrapper'
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import DateFilter from '../utils/DateFilter';
import {
    downloadAccResource
} from '../actions/ResourceActions'
import VideoT from '../components/VideoT'
import VideoViewT from '../components/VideoViewT'
import Bridge from '../native/Bridge'
import CourseInfo from './CourseInfo'

import {
    getCourseInfo
} from '../actions/UserActions';

var {height, width} = Dimensions.get('window');


class Home extends Component {


    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1)
        }
    }


    //导航至视频
    navigate2Video() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'VideoT',
                component: VideoT,
                params: {

                }
            })
        }
    }

    //导航至原生视频组件
    navigate2VideoViewT() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'VideoViewT',
                component: VideoViewT,
                params: {

                }
            })
        }
    }

    //跳转至课程详情
    ToCourseInfo(payload) {

        var {courseId,taskId}=payload
        var info = null;
        if (courseId !== undefined && courseId !== null) {
            this.props.dispatch(getCourseInfo(courseId)).then((json) => {
                info = json;
                this.props.navigator.push({
                    name: 'CourseInfo',
                    component: CourseInfo,
                    params: {
                        info: info,
                        courseId:courseId,
                        taskId:taskId
                    }
                })
            });
        }
    }



    //todo:完成课程的重新拉取
    _onRefresh() {
        this.setState({ isRefreshing: true, fadeAnim: new Animated.Value(0) });
        setTimeout(function () {
            this.setState({
                isRefreshing: false,
            });
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bounce
                },           // Configuration
            ).start();
        }.bind(this), 1000);
    }


    renderCourses(rowData, sectionId, rowId) {

        var lineStyle = {
            flex: 1, flexDirection: 'row', padding: 2,
            justifyContent: 'flex-start', backgroundColor: 'transparent',  borderBottomColor: '#aaa', borderBottomWidth: 1
        };

        var row = (
            <TouchableOpacity style={lineStyle} onPress={() => {

                //this.navigate2VideoViewT()
                //Bridge.invokeBufferingActivity()
                 this.ToCourseInfo({courseId:rowData.courseId,taskId:rowData.taskId})

            }}>

                <View style={{
                    flex: 1, flexDirection: 'column', alignItems: 'flex-start', padding: 2, paddingLeft: 0
                }}>

                    <View style={{marginLeft:4}}>
                        <Text style={{ color: '#444', fontSize: 17, padding: 2, fontWeight: 'bold' }}>
                            {rowData.courseName}
                        </Text>
                    </View>

                    <View style={{marginLeft:4}}>
                        <Text style={{ color: '#666', fontSize: 15, padding: 2, fontWeight: 'bold' }}>
                            {rowData.termId.termName}
                        </Text>
                    </View>

                </View>

                <View style={{ width: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name={'angle-right'} size={34} color="#444" style={{ backgroundColor: 'transparent', marginTop: -10 }} />
                </View>


            </TouchableOpacity>
        );

        return row;
    }

    render() {

        var coursesList = null
        var { courses } = this.props;

        if (courses && courses.length > 0) {
            var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            coursesList = (
                <ScrollView

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(courses)}
                        renderRow={this.renderCourses.bind(this)}
                    />
                </ScrollView>)
        }



        var actions=[]
        actions.push({value:'课程定制',show:OPTION_NEVER})


        return(
            <View style={styles.container}>

                <Toolbar width={width} title="课程计划" navigator={this.props.navigator}
                         actions={actions}
                         onPress={(i)=>{
                             if(this.props.userType==1){
                                 if(i==0)
                                 {

                                 }
                                 if(i==1)
                                {

                                }

                             }else{

                             }

                         }}
                >

                    <View style={{ width: width, backgroundColor: '#66CDAA' }}>
                        {/*搜索框*/}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
                            <View style={{ flexDirection: 'row', width: width * 7 / 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 8 }}>

                                <TextInputWrapper
                                    search={true}
                                    textInputStyle={{ marginLeft: 15, fontSize: 14, color: '#222', }}
                                    iconStyle={{ size: 22 }}
                                    placeholder="按课程名进行搜索"
                                    val={this.state.coachName}
                                    onChangeText={(coachName) => {
                                    this.setState({ coachName: coachName })
                                }}
                                    onConfirm={() => {
                                    alert('dw')
                                }}
                                />

                            </View>

                        </View>
                    </View>





                    <View style={{flex:1,marginTop:10}}>
                        <Animated.View style={{ opacity: this.state.fadeAnim ,padding:4}}>
                            {coursesList}
                        </Animated.View>

                    </View>

                </Toolbar>
            </View>
        )
    }

    componentDidMount(){

    }
}

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#eee',
        height: 56,
    }

});

const mapStateToProps = (state, ownProps) => {

    const props = {
        courses:state.user.courses,
    }

    return props
}

export default connect(mapStateToProps)(Home);
