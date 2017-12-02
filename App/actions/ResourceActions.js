import Config from '../../config';
import RNFetchBlob from 'react-native-fetch-blob'

export let downloadAccResource = (accId) => {

    return new Promise((resolve, reject) => {

        if(accId==undefined||accId==null)
            reject("undefined")
        try{
            accId=parseInt(accId)
            var url =  Config.server+ '/accDownload?accId='+accId
            var dirs = RNFetchBlob.fs.dirs
            RNFetchBlob.fs.exists(dirs.DocumentDir + '/MHK课程分析表.doc')
                .then((exist) => {
                    console.log(`file ${exist ? '' : 'not'} exists`);
                    if(exist==true){
                        RNFetchBlob.fs.unlink(dirs.DocumentDir + '/MHK课程分析表.doc').then(() => {
                            RNFetchBlob
                                .config({
                                    fileCache : true,
                                    appendExt : 'doc',
                                    path : dirs.DocumentDir + '/MHK课程分析表.doc'
                                })
                                .fetch('POST',url, {
                                        "Content-Type":"application/json"
                                    },

                                ).then((res)=>{
                                //alert('portrait filePath='+res.path());
                                resolve({re:1,data:'file://' + res.path()});
                            });
                        })

                    }else{

                        RNFetchBlob
                            .config({
                                fileCache : true,
                                appendExt : 'doc',
                                path : dirs.DocumentDir + '/MHK课程分析表.doc'
                            })
                            .fetch('POST',url, {
                                    "Content-Type":"application/json"
                                },
                            ).then((res)=>{

                            resolve({re:1,data:'file://' + res.path()});
                        });
                    }


                })
                .catch(() => {reject('判断文件是否存在出错');})
        }catch(e)
        {
            reject(e)
        }

    })
}
