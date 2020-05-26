import Store from '@/store/index.js';
const handler = (income)=>{
    let sourceData = Store.getters.getAuthBtnData;
    let typeRes = typeof (income); 
    if( typeRes == 'undefined' ){
        return false;
    }
    if( typeRes == 'string' ){
        let exists = sourceData.includes(income);
        if(exists){
            return true;
        }else{
            return false;
        }
    }
    if( typeRes == 'object' ){        
        let IsArray = income instanceof Array;
        if(IsArray){
            let empty = [];
            sourceData.forEach(subEle=>{
                let trackIndex = income.findIndex(ele=>{
                    return ele == subEle;
                });
                if( trackIndex > -1 ){
                    empty.push( trackIndex );
                }
            });  
            if( empty.length ){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }        
    }
}
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, 'AuthBoolean' , { 
            value: handler
        });
    }	
};