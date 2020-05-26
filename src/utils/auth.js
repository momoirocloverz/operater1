import Store from '@/store/index.js';
export default {
    bind:function(el,binding){
    let sourceData = Store.getters.getAuthBtnData;
        let income = binding.value;
        let exists = sourceData.includes(income);
        if(exists){
        }else{
            el.style.display = 'none';
        }
    }
}