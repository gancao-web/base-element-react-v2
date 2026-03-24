import { message } from 'antd';

/**
 * 复制文本
 */
export function copyText(text: any, tip = '复制成功') {
  if (navigator.clipboard && window.isSecureContext) {
    // 现代路径
    navigator.clipboard
      .writeText(text)
      .then(() => {
        tip && message.success(tip);
      })
      .catch(() => {
        message.error('复制失败');
      });
  } else {
    // 降级：execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) {
      tip && message.success(tip);
    } else {
      message.error('复制失败');
    }
  }
}
