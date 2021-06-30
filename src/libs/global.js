import { ElMessageBox } from 'element-plus'

function handleConfirm (options) {
  return ElMessageBox.confirm(options.message || '提示', options.title || '提示', {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    dangerouslyUseHTMLString: true,
    closeOnClickModal: false,
    customClass: 'cdl-confirm',
    cancelButtonClass: 'btn-sub',
    confirmButtonClass: 'btn-primary',
    ...options
  })
}
function handleNotice ({ title = '提示', message }) {
  return ElMessageBox.alert(message, title, {
    confirmButtonText: "关闭",
    showCancelButton: false,
    dangerouslyUseHTMLString: true,
    // closeOnClickModal: false,
    message,
    customClass: 'cdl-notice',
    cancelButtonClass: 'btn-sub',
    confirmButtonClass: 'btn-primary'
  })
}

export default {
  handleConfirm,
  handleNotice
}
