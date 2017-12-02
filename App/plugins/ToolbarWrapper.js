

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Platform,
} from 'react-native';

import  Popover from  'react-native-popover'
import Ionicons from 'react-native-vector-icons/Ionicons'


const ACTION_ADD='md-add'
const ACTION_REFRESH='md-refresh'
const OPTION_SHOW='OPTION_SHOW'
const OPTION_NEVER='OPTION_NEVER'

class Toolbar extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    closePopover(){
        this.setState({menuVisible: false});
    }

    showPopover(ref){
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            this.setState({
                menuVisible: true,
                buttonRect: {x: px+20, y: py+0, width: 200, height: height}
            });
        });
    }

    constructor(props) {
        super(props);
        this.state={
            menuVisible:false
        }
    }

    render()
    {



        var {width,backgroundColor,title,cancelIcon,onCancel,action,onOptionsItemSelected,actions}=this.props

        var defaultStyle1={
            height:70,
            paddingTop:30,
            flexDirection:'row',
            justifyContent:'center',
            backgroundColor:'#66CDAA'
        }

        if(backgroundColor&&backgroundColor!='')
            defaultStyle1.backgroundColor=backgroundColor
        if(width)
            defaultStyle1.width=width

        var items=[];
        var optionShows=[]

        actions.map((action,i)=>{

            if(action.show==OPTION_SHOW)
            {
                optionShows.push(
                    <TouchableOpacity key={i}
                                      style={{flexDirection:'row',justifyContent:'center',alignItems: 'center',width:40}}
                                      onPress={()=>{
                              if(this.props.onPress)
                                  this.props.onPress(i)
                          }}
                    >
                        <Ionicons name={action.icon} size={25} color="#fff"/>
                    </TouchableOpacity>

                )
            }
            else if(action.show==OPTION_NEVER){
                items.push(
                    <TouchableOpacity style={[styles.popoverContent]} key={i}
                                      onPress={()=>{

                                          this.closePopover();
                                          if(this.props.onPress)
                                              this.props.onPress(i)
                                      }}>
                        <Text style={[styles.popoverText,{color:'#444'}]}>{action.value}</Text>
                    </TouchableOpacity>
                )
            }
        })

        return(
            <View style={styles.container}>

                <View style={defaultStyle1}>
                    <TouchableOpacity style={{width:60,justifyContent:'center',alignItems: 'center',}}
                                      onPress={()=>{
                            if(cancelIcon&&cancelIcon!='')
                            {
                                if(onCancel)
                                    onCancel()
                            }else{
                                this.goBack();
                            }
                        }}>
                        {
                            cancelIcon&&cancelIcon!=''?
                                <Ionicons name={cancelIcon} size={35} color="#fff"/>:
                                <Ionicons name={'md-arrow-back'} size={35} color="#fff"/>
                        }

                    </TouchableOpacity>
                    <View style={{flex:3,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                        <Text style={{color:'#fff',fontSize:18}}>
                            {title}
                        </Text>
                    </View>

                    <View style={{flex:1}}>

                    </View>

                    {optionShows}
                    {
                        items.length>0?
                            <TouchableOpacity ref="menu"
                                              style={{flexDirection:'row',justifyContent:'center',alignItems: 'center',width:40}}
                                              onPress={()=>{
                                                  this.showPopover('menu')
                                              }}
                            >
                                <Ionicons name={'md-more'} size={25} color="#fff"/>
                            </TouchableOpacity>:null
                    }

                </View>

                {this.props.children}

                <Popover
                    isVisible={this.state.menuVisible}
                    fromRect={this.state.buttonRect}
                    onClose={()=>{this.closePopover()
                }}>

                    {items}

                </Popover>
            </View>

        )
    }
}

var styles = StyleSheet.create({
    container:{
        flex:1,
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize:14
    }
})

const toolbar ={
    get Toolbar() {return Toolbar},
    get ACTION_ADD() {return ACTION_ADD},
    get ACTION_REFRESH(){return ACTION_REFRESH},
    get OPTION_SHOW(){return OPTION_SHOW },
    get OPTION_NEVER(){return OPTION_NEVER}
}

module.exports=toolbar

