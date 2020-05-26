<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<style lang="scss">
    * {
        margin: 0;
        padding: 0;
    }
    html,body {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    ::-webkit-scrollbar-track-piece {
	   background-color: rgba(1,1,1,0); 
    }
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: rgba(1,1,1,0); 
    }
    ::-webkit-scrollbar-thumb { 
        border-radius: 5px;
        background-color: rgba(233,72,28,0.2);
    }
</style>