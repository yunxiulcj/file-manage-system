<template>
  <div class="box">
    <page-frame title="审批策略" icon="approvalStrategy" :aside="true">
      <template #headBtn>
        <el-button type="primary" size="small">
          <i class="el-icon-plus" style="font-size: 16px; font-weigth: 600"></i>
          新建策略
        </el-button>
      </template>
      <template #aside>
        <mini-menu :options="menuList" v-model="menu"></mini-menu>
      </template>
      <el-button @click="dialogVisible = true">tset</el-button>
    </page-frame>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog> -->
    <new-approval-cc v-model="dialogVisible"></new-approval-cc>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import miniMenu from '../../components/miniMenu.vue'
import newApprovalCc from './components/newApprovalCc.vue'
export default {
  name: 'approvalStrategy',
  components: { pageFrame, miniMenu, newApprovalCc },
  data() {
    return {
      dialogVisible: false,
      menu: 'fileShare',
      menuList: [
        {
          label: '文件分享策略',
          value: 'fileShare',
          // children: [
          //   {
          //     label: '1测试啊测试1',
          //     value: 'test1',
          //   },
          //   {
          //     label: '2测试啊测试2',
          //     value: 'test2',
          //   },
          //   {
          //     label: '3测试啊测试3',
          //     value: 'test3',
          //   },
          // ],
        },
        {
          label: '文件下载策略',
          value: 'fileDownload',
        },
        {
          label: '文件收集策略',
          value: 'fileCollect',
        },
      ],
    }
  },
  created() {},
}
</script>

<style scoped></style>
