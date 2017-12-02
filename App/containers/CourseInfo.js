
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
import {Navigator} from 'react-native-deprecated-custom-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import  CardView from '../native/CardView'
var {height, width} = Dimensions.get('window');
import {connect} from 'react-redux';
import {
    getCourseInfo,
    getCourseChapter,
    getCourseSection
} from '../actions/UserActions';


import {
    getHomeworkByTaskId
} from '../actions/HomworkActions'

class CourseInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            info: this.props.info,
            isRefreshing: false,
            courseId: this.props.courseId,
            taskId:this.props.taskId,
            fadeAnim: new Animated.Value(1),
            courseChapter: [],
            courseSection: null,
        }
    }


    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
            if (this.props.reset)
                this.props.reset();
        }
    }

    //todo:完成课程的重新拉取
    _onRefresh() {
        this.setState({isRefreshing: true, fadeAnim: new Animated.Value(0)});
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

    getchild(rowData) {
        var childList = [];
        if (rowData.isLeaf === 0) {
            rowData.childList.map((item, i) => {
                var it = item;
                childList.push(item.folderName)
            });
        }
        return childList;
    }

    renderSection(rowData) {

        var accs=null
        if(rowData.accs!==undefined&&rowData.accs!==null&&rowData.accs.length>0)
        {
            accs=[]
            for(var i=0;i<rowData.accs.length;i++)
            {
                var acc=(
                    <View style={{flexDirection:'row',marginLeft:10,alignItems:'center'}} key={i}>
                        <EvilIcons name="play" color="#444" size={26}></EvilIcons>
                        <View>
                            <Text style={{color:'#888',fontSize:13}}>{rowData.accs[i].accName}</Text>
                        </View>
                    </View>)
                accs.push(acc)
            }
        }

        var row =(
            <View>
                <View style={{padding: 10}}>
                    <Text style={{fontSize: 15}}>
                        {rowData.sectionName}
                    </Text>
                </View>

                <View style={{padding:10,paddingVertical:6}}>
                    {accs}
                </View>

            </View>)

        return row;
    }

    renderChapter(rowData)
    {

    }

    render() {

        return this.render_courseintro();

    }

    render_courseintro() {
        //var info=this.state.info;


        var listView = null;
        var {courseId,taskId,courseSection} = this.state;


        if (courseSection !== undefined && courseSection !== null  && courseSection.length > 0) {
            var data = courseSection;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ScrollView>
                    <ListView
                        showsHorizontalScrollIndicator={true}
                        padingEnable={true}
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderSection.bind(this)}
                    />
                </ScrollView>;
        } else {
            this.props.dispatch(getCourseSection(courseId)).then((json) => {
                //this.state.courseChapter = json;
                this.setState({courseSection: json});
                return this.props.dispatch(getHomeworkByTaskId(taskId));
            }).then((json)=>{
                console.log()
            })
        }


        return (
            <View style={styles.container}>

                {/*Toolbar part*/}
                <View style={{ width:width,height:60,paddingVertical:10,flexDirection:'row',alignItems:'center'}}>

                    <TouchableOpacity style={{paddingHorizontal:20}}  onPress={() => {
                        this.goBack()
                    }}>
                        <Ionicons name="md-arrow-back" color="#444" size={35}></Ionicons>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row',flexDirection:'row',alignItems:'center'}}>
                        <Text style={{color:'#333',fontSize:20,fontWeight:'bold'}}>
                            {this.state.info.courseName}
                        </Text>
                    </View>

                    <View style={{width:75}}>
                    </View>

                </View>



                <View style={{flex:1}}>

                    <View style={{flexDirection:'row',padding:11,alignItems:'center'}}>
                        <View style={{backgroundColor:'#FF9800',borderRadius:2,padding:2,paddingHorizontal:6}}>
                            <Text style={{color:'#fff',fontWeight:'bold',fontSize:13}}>
                                {this.state.info.classHour}学时
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text style={{ fontSize: 16,paddingHorizontal: 10,color:'black'}}>课程简介</Text>
                        <Text style={{ fontSize: 16,padding:10,paddingHorizontal:20,color:'#333'}}>{this.state.info.briefIntroduction}</Text>
                    </View>

                    {/*seperator part*/}
                    <View style={{width:width,backgroundColor:'#ddd',height:1}}></View>

                    <View>
                        <Text style={{ fontSize: 16,paddingHorizontal: 10,color:'black'}}>课程英文名称</Text>
                        <Text style={{ fontSize: 16,padding:5,paddingHorizontal:20,color:'#333'}}>{this.state.info.courseEngName}</Text>
                    </View>

                    {/*seperator part*/}
                    <View style={{width:width,backgroundColor:'#ddd',height:1}}></View>

                    <View>
                        <Text style={{ fontSize: 16,paddingHorizontal: 10,color:'black'}}>课程教师</Text>
                        <Text style={{ fontSize: 16,padding:5,paddingHorizontal:20,color:'#333'}}>{this.state.info.teachGroup}</Text>
                    </View>

                    <View style={{width:width,backgroundColor:'#ddd',height:1}}></View>

                    {/*scroll-tab part*/}


                    <ScrollableTabView
                        tabBarUnderlineStyle={{ backgroundColor: '#e74040' }}
                        tabBarActiveTextColor="#e74040"
                        style={{ backgroundColor: '#fff', borderWidth: 0 }}
                        renderTabBar={() => <DefaultTabBar />}
                    >
                        <View tabLabel='课程节次'>
                            <Animated.View style={{ opacity: this.state.fadeAnim }}>
                                <ScrollView horizontal={false}>
                                    {listView}
                                </ScrollView>
                            </Animated.View>

                        </View>
                        <View tabLabel='课程大纲'>
                            <Animated.View style={{ opacity: this.state.fadeAnim }}>
                                {}
                            </Animated.View>

                        </View>
                        <Text tabLabel='问答'>project</Text>
                        <View tabLabel='作业'>
                            <Animated.View style={{ opacity: this.state.fadeAnim }}>

                                <View style={{flexDirection:'column',width:width,padding:4}}>
                                    <CardView
                                        cardElevation={2}
                                        style={{padding:14,marginLeft:20,marginRight:20,marginTop:10}}
                                        cornerRadius={5}>
                                        <Text>
                                            Elevation 0
                                        </Text>
                                    </CardView>

                                </View>

                            </Animated.View>

                        </View>
                    </ScrollableTabView>

                </View>

            </View>
        )
    }



}

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#ddd',
        height: 56,
    },
    topbar: {
        height: 50,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchstyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseintrotext: {
        fontSize: 16,
        padding: 10,
    }


});

module.exports = connect(state => ({})
)(CourseInfo);
