<template>
  <div class="role-permission bg-fff">
    <div class="flex-box flex-center">
      <div>
        <el-tree :data="data" default-expand-all show-checkbox check-on-click-node node-key="permCode" :check-strictly="checkShow" ref="tree" highlight-current :props="defaultProps">
        </el-tree>
        <!--@check="clickDeal"-->
        <div class="buttons tc pt20 pb20">
          <el-button type="primary" class="el-input-width" @click="saveCheck">保存</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'permission',
  props: {
    id: {
      default: 1
    }
  },
  data() {
    return {
      data: [],
      permCodeList: [],
      checkShow:false,
      defaultProps: {
        children: 'sonList',
        label: 'name'
      }
    }
  },
  created(){
    this.getTree();
  },
   mounted() {
     this.getDetail()
  },
  methods: {
    getDetail() {
      let _this = this;
      this.ApiLists.roleDetail({ roleId: this.$route.query.id }).then(res => {
        if (res.respCode === 0) {
          let result = res.data.rolePermissionList || [];
          this.permCodeList = [...result.map(i => i.permCode)];
          // this.$refs.tree.setCheckedNodes(this.permCodeList);
          console.log(this.permCodeList)
          _this.checkShow = true;
          this.$refs.tree.setCheckedKeys(this.permCodeList);
          setTimeout(()=>{
            _this.checkShow = false;
            console.log(this.checkShow)
          },200)
        }
      }).catch(err => {

      })
    },
    getTree() {
      //（1.运营后台  2.企业app ）(Integer)
      this.ApiLists.permissionTree({ source: 2 }).then(res => {
        if (res.respCode === 0) {
          this.data = res.data.length > 0 ? res.data : [];
        }
      }).catch(err => {

      }).finally(() => {

      })
    },
    clickDeal(currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.permCode) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj && currentObj.sonList && currentObj.sonList.length !== 0) {
          this.uniteChildSame(currentObj, false)
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      let len = treeList && treeList.sonList && treeList.sonList.length > 0;
      console.log(len)
      this.$refs.tree.setChecked(treeList.permCode, isSelected)
      for (let i = 0; i < len; i++) {
        this.uniteChildSame(treeList.sonList[i], isSelected)
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    saveCheck() {
      // let list = this.$refs.tree.getCheckedNodes()
      let list = this.$refs.tree.getCheckedNodes()
      let parentList = this.$refs.tree.getHalfCheckedNodes()
      list = [...list,...parentList];
      if (list.length === 0) {
        return this.$message.error('请为该角色设置权限');
      }
      let permCodeList = list.map(i => i.id);
      console.log(permCodeList)
      // let CodeList = permCodeList.concat(parentCodeList);
      this.ApiLists.roleAssignPermission({
        roleId: this.$route.query.id,
        permIdList: permCodeList
      }).then(res => {
        if (res.respCode === 0) {
          this.$message.success('权限设置成功!')
          sessionStorage.setItem('cropSwitchItem','third');
          let obj = JSON.parse(localStorage.getItem('tempStoreQuery') );
          this.$router.push({
              path:obj.path,
              query:obj.query
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.role-permission {
  padding: 30px;
  height: 100%;
  overflow-y: auto;

  .topCon {
    .lockWidth {
      width: 120px;
      margin-right: 10px;
    }

    .topFirst {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }

    .topSec {
      margin-top: 15px;
    }
  }

  .bottomCon {
  }
}
</style>
