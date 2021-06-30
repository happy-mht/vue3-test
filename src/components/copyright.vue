<!--
  @doc: 页脚，版权说明
-->
<template>
  <el-footer height="40px">
    <span style="display:inline-block;">Copyright © 2021-2022 Leqee Corporation. All rights reserved.  本系统推荐使用Chrome浏览器，请勿开启页面翻译 |  </span>
    <el-popover
      placement="top"
      width="268"
      ref="popper"
      trigger="hover"
      popper-class="qq-popper-bottom">
      <div style="display: flex; font-size: 12px">
        <img src="@/assets/images/QQ.png" width="71px"/>
        <div style="padding: 16px 0 24px 16px">
          <div style="color: #354360;margin-bottom: 12px">欢迎提出您宝贵的意见和建议！</div>
          <div style="color: #9DA4B2;line-height: 20px;">乐其CDL种子用户沟通Q群：</div>
          <div style="color: #FD4378;font-size: 16px;">721851621</div>
        </div>
      </div>
      <template #reference><a class="contact-ref">联系我们</a></template>
    </el-popover>
  </el-footer>
</template>
<script>
export default {
  name: 'copyright'
}
</script>
<style scoped lang="scss">
:deep(.contact-card) {
  padding: 0;
}
.el-footer {
  height: 40px;
  line-height: 40px;
  color: #D8D8D8;
  font-size: 12px;
  text-align: center;
}
.pop-content {
  height: 116px;
  width: 268px;
  display: flex;
  align-items: center;
  .image {
    width: 71px;
    height: 116px;
  }
  .contact-content {
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 16px;
  }
  .concact-qq {
    color: $primaryRed;
    font-size: 14px;
  }
}
.contact-ref {
  text-decoration: underline;
  color: $auxiliary;
  &:hover {
    color: $primaryRed;
  }
}
</style>