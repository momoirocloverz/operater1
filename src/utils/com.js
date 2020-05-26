export function priceFor(row,col,data,type) {
    let content = '';
    if (data) {
        let price;
        if(type === 1){
            price = JSON.parse(data);
        }else{
            price = JSON.parse(data)[0].price[0];
        }
        if (price.valuationType == 1) { //计时
            content = `${price.countTime}元/小时`
        } else if (price.valuationType == 2) {//固定计量
            content += `${price.countFixed}元/${price.pieceUnit.dicName}`
        } else if (price.valuationType == 3) {//阶梯计量
            let dicName = price.pieceUnit.dicName;
            let len = price.ladderObj.length - 1;
            price.ladderObj.forEach((item,index) =>{
                if(index === 0){
                    content += `${item.count}${dicName}(含)以下${item.unit}元/件,`
                }else if(index === len){
                    content += `${price.ladderObj[index-1].count}${dicName}以上${item.overUnit}元/件,`
                }else{
                    content += `${price.ladderObj[index-1].count}${dicName}(不含)-${item.count}${dicName}(含)以下${item.unit}元/件,`
                }
            })
        } else if (price.valuationType == 4) {//组合计量
            for(let item of price.unitPrice){
                content += `${item.count}元/${item.unit.dicName},`
            }
        } else if (price.valuationType == 5) {//计时+固定计量
            content += `${price.countTime}元/小时,${price.countFixed}元/${price.pieceUnit.dicName}`
        } else if (price.valuationType == 6) {//计时+阶梯计量
            content += `${price.countTime}元/小时,`
            let dicName = price.pieceUnit.dicName;
            let len = price.ladderObj.length - 1;
            price.ladderObj.forEach((item,index) =>{
                if(index === 0){
                    content += `${item.count}${dicName}(含)以下${item.unit}元/件,`
                }else if(index === len){
                    content += `${price.ladderObj[index-1].count}${dicName}以上${item.overUnit}元/件,`
                }else{
                    content += `${price.ladderObj[index-1].count}${dicName}(不含)-${item.count}${dicName}(含)以下${item.unit}元/件,`
                }
            })
        } else if (price.valuationType == 7){//计时+组合计量
            content += `${price.countTime}元/小时,`
            for(let item of price.unitPrice){
                content += `${item.count}元/${item.unit.dicName},`
            }
        }else if (price.valuationType == 8) {//固定计价
            content += `${price.countFixed}元/天`
        }
        return content
    } else {
        return '-'
    }
}
export function pieceSizeFor(row,col,val) {
    let text = '';
    if (val) {
        let data = JSON.parse(val)
        if(data.unitObjList.length > 0){
            for (let item of data.unitObjList) {
                if (item.count && item.count > 0) {
                    text += `${item.count}${item.unit.dicName}/`
                } else {
                    text += `0${item.unit.dicName}/`
                }
            }
            text = text.substring(0, text.length - 1)
        }else{
            text = '-'
        }
    } else {
        text = '-'
    }
    return text
}
export const dictionary = {
    taskType:{
        1:'自有任务',
        2:'指派任务'
    },
    settlementType:{
        1:'日结',
        2:'月结',
        4:'周结',
    },
    processStatus:{
        1:'待执行',2:'执行中',3:'已完成',4:'已关闭'
    },
    valuationType :{
        1:'计时',2:'固定计量',3:'阶梯计量',4:'组合计量', 5:'计时+固定计量',6:'计时+阶梯计量',7:'计时+组合计量',8:'日固定'
    },
    endWorkType:{
        1:'当日',
        2:'次日'
    },
    sexLimt:{
        1:'男',
        2:'女',
        3:'不限'
    },
    needPriceCheck:{//是否需要普工单价审核（0.不需要审核1.需要审核）
        0:'不启用',
        1:'启用'
    },
    isFacePunch:{//人脸打卡（0不需要1需要）
        0:'不启用',
        1:'启用'
    },
    punchWay:{
        1:'扫码打卡',
        2:'自主打卡'
    },
    needConfirm:{
        0:'不启用',
        1:'启用'
    },
    rewardLimit:{//排班内奖惩限制
        0:'不启用',
        1:'启用'
    },
    isModifyPunch:{//是否开启修改考勤
        0:'不启用',
        1:'启用'
    },
    autoScheduling:{//是否开启自动排班
        0:'不启用',
        1:'启用'
    },
    confirmStatus:{
        1:'待发送',
        2:'待确认',
        3:'已第三方结算确认'
    }
};
export function sexFor(row,col,val) {
    if(val === 1){
        return '男'
    }else if(val === 2){
        return '女'
    }else{
        return '不限'
    }
}
export function settleFor(row,col,val) {
    if(val === 1){
        return '日结'
    }else if(val === 2){
        return '月结'
    }else if(val === 4){
        return '周结'
    }else{
        return '-'
    }
}
export function isContent(row,col,val) {
    if(val){
        return val
    }else{
        return '-'
    }
}
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, '$priceFor' , { value: priceFor });
        Object.defineProperty(Vue.prototype, '$pieceSizeFor' , { value: pieceSizeFor});
        Object.defineProperty(Vue.prototype, '$dictionary' , { value: dictionary });
        Object.defineProperty(Vue.prototype, '$sexFor' , { value: sexFor });
        Object.defineProperty(Vue.prototype, '$settleFor' , { value: settleFor });
        Object.defineProperty(Vue.prototype, '$isContent' , { value: isContent });
    }
};