(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3b7a92e6"],{1293:function(t,a,e){"use strict";e("f2d1")},"17ba":function(t,a,e){},"1c04":function(t,a,e){},3292:function(t,a,e){"use strict";e("1c04")},"75ba":function(t,a,e){"use strict";var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"pageBox"},[e("el-header",{staticStyle:{height:"25px","line-height":"25px"}},[e("i",{class:"iconfont icon-"+t.icon}),e("span",{staticClass:"title"},[t._v(t._s(t.title))]),e("div",{staticClass:"headBtn"},[t._t("headBtn")],2)]),e("el-divider"),e("el-container",[t.aside?e("el-aside",{staticStyle:{"border-right":"0.5px solid #d9d9d9"},attrs:{width:t.asideWidth||"185px"}},[t._t("aside")],2):t._e(),e("el-main",[t._t("default")],2)],1)],1)},i=[],l={name:"pageFrame",props:["aside","title","icon","asideWidth"],data:function(){return{}},created:function(){},methods:{}},o=l,n=(e("1293"),e("2877")),r=Object(n["a"])(o,s,i,!1,null,"4bf95040",null);a["a"]=r.exports},7726:function(t,a,e){"use strict";e("17ba")},a0e7:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"box"},[e("page-frame",{attrs:{title:"审批详情",icon:"approval"},scopedSlots:t._u([{key:"headBtn",fn:function(){return[e("div",{staticClass:"goBack",on:{click:t.goBack}},[e("i",{staticClass:"el-icon-back"}),e("span",[t._v("返回上一级")])])]},proxy:!0}])},[e("div",{staticClass:"content"},[e("div",{staticClass:"approvalStepBox"},[e("article-steps",{attrs:{approvalState:t.approvalState}})],1),e("div",{staticClass:"approvalInfo"},[e("div",{staticClass:"approvalState"},[t._v(" "+t._s(t.applyStatus[t.approvalState])+" ")]),e("div",{staticClass:"timelineWrap"},[e("timeline",{attrs:{data:t.detailData,approvalState:t.approvalState}})],1)]),e("el-divider"),e("div",{staticClass:"attachmentBox"},[e("div",{staticClass:"title"},[t._v("附件：")]),e("div",{staticClass:"fileWrap"},[t._l(t.detailData.fileList,(function(a,s){return[e("el-tooltip",{key:s,attrs:{effect:"dark",placement:"top",content:"文件路径："+a.filePath}},[e("div",{staticClass:"fileBox"},[e("div",{staticClass:"icon"}),e("div",{staticClass:"fileInfo"},[e("div",{staticClass:"fileName"},[t._v(t._s(a.fileName))]),e("div",{staticClass:"fileSize"},[t._v(t._s(a.fileSize))])])])])]}))],2),e("div",{staticClass:"fileFromInfo"},[t._v("来自："+t._s(t.userName)+"的个人网盘")])]),e("el-divider")],1),t.detailData.canApproval?e("div",{staticClass:"btnWrap"},[e("el-button",{attrs:{type:"primary",size:"small",plain:""},on:{click:function(a){return t.agree(t.detailData)}}},[t._v(" 同意 ")]),e("el-button",{attrs:{type:"warning",size:"small",plain:""},on:{click:function(a){return t.refuse(t.detailData)}}},[t._v(" 拒绝 ")])],1):t._e()]),e("el-dialog",{attrs:{visible:t.agreeOrRefuseDialog,width:"500px"},on:{"update:visible":function(a){t.agreeOrRefuseDialog=a}}},[e("template",{slot:"title"},[e("div",{staticStyle:{height:"20px","line-height":"20px","border-left":"4px solid #1890ff","padding-left":"10px"}},[t._v(" 提示 ")])]),e("el-form",{attrs:{size:"small"}},[t.canEdit?e("el-form-item",{attrs:{label:"下载次数"}},[e("el-input-number",{attrs:{"controls-position":"right",min:0},model:{value:t.editForm.downloadCount,callback:function(a){t.$set(t.editForm,"downloadCount",a)},expression:"editForm.downloadCount"}}),e("span",{staticClass:"unit"},[t._v("单位：天")]),e("el-divider",{attrs:{direction:"vertical"}}),e("span",{staticClass:"tips"},[t._v("注：0表示长期有效")])],1):t._e(),t.canEdit?e("el-form-item",{attrs:{label:"申请有效期"}},[e("el-input-number",{attrs:{"controls-position":"right",min:0},model:{value:t.editForm.downloadExpiredDay,callback:function(a){t.$set(t.editForm,"downloadExpiredDay",a)},expression:"editForm.downloadExpiredDay"}}),e("span",{staticClass:"unit"},[t._v("单位：天")]),e("el-divider",{attrs:{direction:"vertical"}}),e("span",{staticClass:"tips"},[t._v("注：0表示长期有效")])],1):t._e(),e("el-form-item",{attrs:{label:"理由*"}},[e("el-input",{model:{value:t.editForm.comment,callback:function(a){t.$set(t.editForm,"comment",a)},expression:"editForm.comment"}})],1)],1),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{attrs:{size:"small"},on:{click:function(a){t.agreeOrRefuseDialog=!1}}},[t._v(" 取 消 ")]),e("el-button",{attrs:{size:"small",type:"primary"},on:{click:t.confirmEdit}},[t._v(" 确 定 ")])],1)],2)],1)},i=[],l=(e("b64b"),e("d81d"),e("75ba")),o=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"stepBox"},t._l(t.tempSteps,(function(a,s){return e("div",{key:a.value},[e("div",{staticClass:"stepItem"},[e("div",{directives:[{name:"show",rawName:"v-show",value:0!=s,expression:"index != 0"}],staticClass:"dottedLine"}),e("div",{staticClass:"infoWrap",style:{color:4!=a.value&&5!=a.value&&1!=a.value?"#228be6":4==a.value?"#37b24d":1==a.value?"#f59f00":"#f03e3e"}},[e("div",{staticClass:"iconBox"},[e("i",{class:"iconfont icon-"+a.icon})]),e("div",{staticClass:"labelBox"},[t._v(t._s(a.label))])])])])})),0)},n=[],r={name:"articleSteps",props:["approvalState"],data:function(){return{stepList:[{value:"0",icon:"myApplication",label:"用户申请"},{value:"1",icon:"withdraw",label:"已撤回"},{value:"2",icon:"myApproval",label:"待处理"},{value:"3",icon:"daishenpi",label:"审批中"},{value:"4",icon:"shenpitongguo",label:"审批通过"},{value:"5",icon:"shenhebutongguo",label:"审批不通过"}],tempSteps:[]}},created:function(){this.initSteps(),console.log(this.approvalState)},methods:{initSteps:function(){for(var t=0;t<=this.approvalState;t++)1!=this.approvalState&&1==t||2!=this.approvalState&&2==t||4!=this.approvalState&&4==t||this.tempSteps.push(this.stepList[t])}}},p=r,c=(e("7726"),e("2877")),d=Object(c["a"])(p,o,n,!1,null,"500ba7d0",null),u=d.exports,v=e("d1c6"),m=e("b8f0"),f={name:"approval",components:{pageFrame:l["a"],articleSteps:u,timeline:v["a"]},data:function(){return{userName:"",canEdit:!1,agreeOrRefuseDialog:!1,accountType:"2",approvalState:0,editForm:{applyId:"",applyStatus:1,downloadCount:1,downloadExpiredDay:1,comment:""},applyStatus:{1:"已撤回",2:"待处理",3:"审批中",4:"审批通过",5:"审批不通过",6:"传输异常"},detailData:{fileList:[],applyTime:"",applyId:"",applyUser:"",userDept:"",applyDesc:"",downloadCount:"1",downloadDay:"1",state:"1",canApproval:!1,canEdit:!1,processList:[]},tempData:{}}},created:function(){this.userName=localStorage.getItem("username")||"";var t=Object.keys(this.$route.query),a=Object.keys(this.$route.params);t.length>0?this.tempData=this.$route.query:a.length>0&&(this.tempData=this.$route.params),this.getData(this.tempData),this.accountType=this.tempData.accountType,this.approvalState=this.tempData.approvalState},mounted:function(){},methods:{goBack:function(){this.$router.go(-1)},getData:function(t){var a=this;this.$http("getApplyDetail",{applyId:t.applyId,type:t.accountType}).then((function(t){t.data&&(a.approvalState=t.data.state,t.data.fileList.map((function(t){t["fileSize"]=Object(m["d"])(t.fileSize)}))),a.detailData=t.data}))},agree:function(t){this.editForm.applyId=t.applyId,this.editForm.applyStatus=1,this.editForm.downloadCount=t.downloadCount,this.editForm.downloadExpiredDay=t.downloadDay,this.canEdit=t.canEdit,this.agreeOrRefuseDialog=!0},refuse:function(t){this.editForm.applyId=t.applyId,this.editForm.approvalState=2,this.editForm.downloadCount=t.downloadCount,this.editForm.downloadExpiredDay=t.downloadDay,this.canEdit=!1,this.agreeOrRefuseDialog=!0},confirmEdit:function(){var t=this,a=1==this.editForm.applyStatus?"agree":"refuse";this.$http(a,this.editForm).then((function(a){t.$message.success(a.errMsg),t.agreeOrRefuseDialog=!1,t.getData(t.tempData)}))}}},h=f,_=(e("aea0"),Object(c["a"])(h,s,i,!1,null,"04d2d088",null));a["default"]=_.exports},aea0:function(t,a,e){"use strict";e("eb71")},d1c6:function(t,a,e){"use strict";var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("el-timeline",[e("el-timeline-item",{attrs:{type:"success"}},[e("span",{staticClass:"labelBox"},[t._v("申请成功")]),e("div",{staticClass:"infoWrap"},[e("div",{staticClass:"timeBox"},[t._v(t._s(t.data.applyTime))]),e("div",{staticClass:"infoBox"},[e("div",{staticClass:"applyId apply"},[e("span",{staticClass:"label"},[t._v("工单号：")]),t._v(" "+t._s(t.data.applyId)+" ")]),e("div",{staticClass:"applyUser apply"},[e("span",{staticClass:"label"},[t._v("申请人：")]),t._v(" "+t._s(t.data.applyUser)+" "),e("el-divider",{attrs:{direction:"vertical"}}),e("span",{staticStyle:{"font-weight":"bolder"}},[t._v(t._s(t.data.userDept))])],1),e("div",{staticClass:"applyDesc apply"},[e("span",{staticClass:"label"},[t._v("描述：")]),t._v(" "+t._s(t.data.applyDesc)+" ")]),e("div",{staticClass:"downloadCount apply"},[e("span",{staticClass:"label"},[t._v("下载次数：")]),t.data.canEdit?e("span",{staticClass:"canBeModifi"},[e("el-input-number",{staticStyle:{"margin-left":"12px"},attrs:{"controls-position":"right",size:"small",min:0},model:{value:t.data.downloadCount,callback:function(a){t.$set(t.data,"downloadCount",a)},expression:"data.downloadCount"}}),e("span",{staticClass:"unit"},[t._v("单位：次")]),e("el-divider",{attrs:{direction:"vertical"}}),e("span",{staticClass:"tips"},[t._v("注：0表示没有限制")])],1):e("span",{staticClass:"noModifi"},[t._v(t._s(t.data.downloadCount)+" 次")])]),e("div",{staticClass:"expiredDay apply"},[e("span",{staticClass:"label"},[t._v("申请有效期：")]),t.data.canEdit?e("span",{staticClass:"canBeModifi"},[e("el-input-number",{attrs:{"controls-position":"right",size:"small",min:0},model:{value:t.data.downloadDay,callback:function(a){t.$set(t.data,"downloadDay",a)},expression:"data.downloadDay"}}),e("span",{staticClass:"unit"},[t._v("单位：天")]),e("el-divider",{attrs:{direction:"vertical"}}),e("span",{staticClass:"tips"},[t._v("注：0表示长期有效")])],1):e("span",{staticClass:"noModifi"},[t._v(t._s(t.data.downloadDay)+" 天")])])])])]),t._l(t.data.processList,(function(a,s){return e("el-timeline-item",{key:s,attrs:{type:3==a.state?"primary":4==a.state?"success":"danger"}},[0==s?e("span",{staticClass:"labelBox"},[t._v("审批中")]):t._e(),e("span",{staticClass:"timeBox"},[t._v(t._s(a.approvalTime))]),e("span",{staticClass:"approvaler"},[e("span",{staticClass:"label"},[t._v("审批人：")]),t._v(" "+t._s(a.user)+" ")]),e("span",{staticClass:"state",style:{color:3==a.state||2==a.state?"#228be6":4==a.state?"#40c057":5==a.state||6==a.state?"#f03e3e":"#868e96"}},[t._v(" "+t._s(t.state[a.state])+" ")]),a.reason?e("span",{staticClass:"reason"},[e("span",{staticClass:"label"},[t._v("理由：")]),t._v(" "+t._s(a.reason)+" ")]):t._e()])})),4==t.approvalState||5==t.approvalState?e("el-timeline-item",{attrs:{type:4==t.approvalState?"success":"danger"}},[e("span",{staticClass:"labelBox"},[t._v(t._s(t.state[t.approvalState]))]),e("div",{staticClass:"timeBox"},[t._v(t._s(t.data.approvalTime))])]):t._e()],2)},i=[],l={name:"timeline",props:["data","approvalState"],data:function(){return{state:{1:"已撤回",2:"待处理",3:"审批中",4:"审批通过",5:"审批不通过"}}},created:function(){},methods:{}},o=l,n=(e("3292"),e("2877")),r=Object(n["a"])(o,s,i,!1,null,"7e7c0e81",null);a["a"]=r.exports},eb71:function(t,a,e){},f2d1:function(t,a,e){}}]);