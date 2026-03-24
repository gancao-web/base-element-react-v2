import { useEffect, useRef, useState } from 'react';
import { CloseOutlined, DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload, Image, Button, message } from 'antd';
import { getBaseConfig } from '../../config';
import { download, arrayMove } from '../../util';

import BaseSortable from '../BaseSortable';
import BaseModal from '../BaseModal';
import type { BaseUploadProps } from './typing';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import './index.less';

type PasteState = {
  pastable: boolean;
  isHovered: boolean;
  disabled?: boolean;
  fileAccept: string;
  maxCount: number;
  fileListLen: number;
};

/**
 * 上传组件
 * value支持逗号隔开字符串 和 [{url,uid?,name?,size?}]的格式
 */
const BaseUpload = (props: BaseUploadProps) => {
  const { pastable = true } = props;

  const baseConfig = getBaseConfig();
  const [fileList, setFileList] = useState<UploadFile[]>([]); // 文件列表 (需单独维护状态,避免上传状态丢失)
  const [previewVisible, setPreviewVisible] = useState(false); // 是否显示预览弹层
  const [previewIndex, setPreviewIndex] = useState(0); // 当前预览图片组的下标
  const [isShowTempModal, setIsShowTempModal] = useState(false); // 是否显示下载模板的弹窗
  const [isHovered, setIsHovered] = useState(false); // 粘贴上传: hover 态
  const uploadRef = useRef<any>(null); // 上传组件的ref
  const isValueArray = Array.isArray(props.value); // 是否返回数组, 默认返回逗号隔开字符串的url

  // 已上传成功的url数组
  const successUrls: string[] = props.value
    ? isValueArray
      ? props.value.map((item: UploadFile) => item.url)
      : props.value.toString().split(',')
    : [];

  // action配置
  const actionConfig = baseConfig.uploadAction?.(props.data);

  // 文件类型
  const accept = props.accept || 'img';
  const fileAccept = getAccepts(accept);

  // 禁用
  const disabled = props.readonly || props.disabled;
  // 是否为图片类型
  const isImg = accept === 'img';
  // 最大上传数量
  const maxCount = props.max || 1;
  // 是否多选
  const multiple = maxCount > 1;
  // 拖拽排序
  const draggable = props.draggable ?? multiple;
  // 列表类型
  const listType = props.listType || (isImg ? 'picture-card' : 'text');
  const isCard = listType === 'picture-card';
  // 模版文件
  const tempList = typeof props.temp === 'string' ? [props.temp] : props.temp;

  useEffect(() => {
    // 文件回显
    const successFullUrls = successUrls.map((url) => getFullUrl(url));
    // 新追加进来的 (主要是接口异步回显的情况)
    const addFiles: UploadFile[] = [];
    for (const url of successFullUrls) {
      const isAdd = fileList.find((file) => file.url == url);
      if (!isAdd) {
        if (isValueArray) {
          const file = props.value.find((item: UploadFile) => getFullUrl(item.url) == url);
          addFiles.push({ uid: url, status: 'done', ...file, url: getFullUrl(file.url) });
        } else {
          const name = url.split('/').pop() || url;
          addFiles.push({ uid: url, url, name, status: 'done' });
        }
      }
    }
    // 删除多余的文件 (主动设置表单,强制覆盖的情况)
    const unDelFiles = fileList.filter((file) => {
      return (
        file.status !== 'done' ||
        (file.status === 'done' && file.url && successFullUrls.includes(file.url))
      );
    });
    setFileList([...addFiles, ...unDelFiles]);
  }, [props.value]);

  // 拼接完整地址
  function getFullUrl(url?: string) {
    if (!url) return '';
    return url.indexOf('http') != 0 ? baseConfig.imgHost + url : url;
  }

  // 文件变化 (选择文件/删除文件/文件上传中/上传成功失败都会触发)
  // 拖拽排序也会触发, 只是file是空的, 确保内部不会触发onFileChange
  const fileChange = (e: { fileList: any; file?: any }) => {
    // 先派发事件,更新value
    const emitUrls: string[] = [];
    const emitFiles: UploadFile[] = [];
    for (const file of e.fileList) {
      // 上传成功,设置网络地址
      if (!file.url && file.status == 'done') {
        file.url = actionConfig?.success(file.response, file);
      }
      // 已上传的 + 刚上传的
      if (file.url) {
        const url = props.hasHost ? file.url : file.url.replace(baseConfig.imgHost, '');
        if (isValueArray) {
          emitFiles.push({ ...file, url });
        }
        emitUrls.push(url);
      }
    }
    const value = emitUrls.toString();
    // 触发onFileChange,选中文件,文件上传中,文件删除等都会触发
    e.file && props.onFileChange && props.onFileChange(value, e.file, e.fileList);
    // 上传中会一直触发,此处只处理终态
    if (successUrls.toString() != value) {
      props.onChange && props.onChange(isValueArray ? emitFiles : value);
    }
    // 更新state
    setFileList(e.fileList);
  };

  // 预览 (默认打开新页面预览)
  const onPreview = isImg
    ? (e: any) => {
        if (e.url) {
          setPreviewVisible(true);
          const index = fileList.findIndex((file: any) => file.url == e.url);
          setPreviewIndex(index);
          // 预览遮罩层会拦截 onMouseLeave，在打开时重置 hover 状态 (避免: 关闭预览后,其他组件粘贴上传时,上次预览的组件依然响应粘贴)
          // 提示: 关闭预览后，若鼠标仍在组件上会自然触发 onMouseEnter 恢复 hover 状态
          setIsHovered(false);
        }
      }
    : undefined;

  // 取消预览
  const cancelPreview = () => {
    setPreviewVisible(false);
    setPreviewIndex(0);
  };

  // 进度条
  const progress = {
    strokeWidth: 3,
    format: (percent: any) => percent && `${percent.toFixed(2)}%`,
  };

  const onBeforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    const { maxSize, beforeUpload } = props;

    if (!baseConfig.uploadAction) {
      console.error('上传组件无法使用,请在main.tsx配置BaseElement的uploadAction选项');
    }

    // 如果设置了 maxSize 参数
    if (maxSize) {
      const isLimt = file.size / 1024 / 1024 < maxSize;

      // 超过文件大小限制
      if (isLimt === false) {
        message.warning(`文件必须小于${maxSize}MB`);

        return Promise.reject();
      }
    }

    return beforeUpload?.(file, fileList);
  };

  // 获取多个文件类型
  function getAccepts(accept: string | string[]) {
    if (Array.isArray(accept)) {
      return accept.map((item) => getAccept(item)).join(',');
    }

    return getAccept(accept);
  }

  // 获取文件类型
  function getAccept(accept: string) {
    switch (accept) {
      case 'img':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      case 'xls':
        return '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
      case 'pdf':
        return 'application/pdf';
      case 'txt':
        return 'text/plain';
      default:
        return accept;
    }
  }

  // 粘贴上传所需的最新状态，通过 ref 传递给事件处理函数，避免频繁重新注册监听器
  const pasteStateRef = useRef<PasteState>();

  pasteStateRef.current = {
    pastable,
    isHovered,
    disabled,
    fileAccept,
    maxCount,
    fileListLen: fileList.length,
  };

  // 粘贴上传: 仅鼠标hover时生效, 避免多个上传组件同时响应粘贴; focus时也不生效,因为有可能响应的是上次操作的上传组件
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!pasteStateRef.current) return;

      const { pastable, isHovered, disabled, fileAccept, maxCount, fileListLen } =
        pasteStateRef.current;

      if (!pastable || !isHovered || disabled) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            if (fileAccept && fileAccept !== '*') {
              const acceptTypes = fileAccept.split(',').map((t) => t.trim());
              const isAccepted = acceptTypes.some((type) => {
                if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', '/'));
                if (type.startsWith('.')) {
                  return file.name.toLowerCase().endsWith(type.toLowerCase());
                }
                return file.type === type;
              });
              if (!isAccepted) continue;
            }
            files.push(file);
          }
        }
      }

      if (files.length === 0) return;
      e.preventDefault();

      const remaining = maxCount - fileListLen;
      if (remaining <= 0) {
        message.warning(`最多上传${maxCount}个文件`);
        return;
      }
      const filesToUpload = files.slice(0, remaining);

      uploadRef.current?.upload?.uploader?.uploadFiles(filesToUpload);
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  // 拖拽排序
  function onSort(oldIndex: number, newIndex: number) {
    const newList = arrayMove(fileList, oldIndex, newIndex);

    fileChange({ fileList: newList });
  }

  // 下载模板
  function downloadTemp(url: string) {
    if (url.indexOf('/public/') === 0) {
      download(`${window.location.origin}${url.substring(7)}`); // 以'/public/'开头,则为下载本地文件
    } else {
      download(url); // 下载网络文件
    }
  }

  return (
    <div
      style={props.style}
      className={`base-upload ${props.className || ''}`}
      onMouseEnter={pastable ? () => setIsHovered(true) : undefined}
      onMouseLeave={pastable ? () => setIsHovered(false) : undefined}
    >
      {/* 此处不可加上判断disabled=fileList.length < 2,否则批量上传渲染失败 */}
      <BaseSortable disabled={!draggable || disabled} inline={isCard}>
        <Upload
          ref={uploadRef}
          {...actionConfig}
          listType={listType}
          fileList={fileList}
          multiple={multiple}
          accept={fileAccept}
          maxCount={maxCount}
          disabled={disabled}
          beforeUpload={onBeforeUpload}
          onPreview={onPreview}
          onChange={fileChange}
          progress={progress}
          itemRender={(originNode, file, currFileList) => {
            const index = currFileList.indexOf(file);
            return (
              <BaseSortable.Item
                index={index}
                onSort={onSort}
                disabled={fileList.length < 2}
                style={{ width: '100%', height: '100%' }}
              >
                {originNode}
              </BaseSortable.Item>
            );
          }}
          showUploadList={{
            removeIcon: isCard ? <CloseOutlined className="base-upload-remove-rt" /> : undefined,
            previewIcon: isCard ? <div className="base-upload-preview-full" /> : undefined,
          }}
        >
          {props.children
            ? props.children
            : !disabled &&
              (isCard ? (
                fileList.length >= maxCount ? null : (
                  <div>
                    <PlusOutlined />
                    <div>点击上传</div>
                    <div className="base-upload-trigger-hint">
                      {pastable ? '拖拽/粘贴至此' : '拖拽至此'}
                    </div>
                  </div>
                )
              ) : (
                <>
                  <Button icon={<UploadOutlined />}>
                    <span>点击上传</span>
                    <span className="base-upload-trigger-hint">
                      {pastable ? '（拖拽/粘贴至此）' : '（拖拽至此）'}
                    </span>
                  </Button>

                  {tempList && (
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (tempList.length === 1) {
                          downloadTemp(tempList[0]); // 只有一个模板,则直接下载
                        } else {
                          setIsShowTempModal(true); // 多个模板,则弹窗选择
                        }
                      }}
                    >
                      下载模板
                    </Button>
                  )}
                </>
              ))}
        </Upload>
      </BaseSortable>

      {isImg && previewVisible && (
        <Image.PreviewGroup
          preview={{
            visible: true,
            current: previewIndex,
            onVisibleChange: cancelPreview,
          }}
        >
          {fileList.map((file) => {
            return <Image style={{ display: 'none' }} src={file.url} key={file.url} />;
          })}
        </Image.PreviewGroup>
      )}

      {tempList && tempList.length > 1 && (
        <BaseModal
          title="下载模板"
          open={isShowTempModal}
          onCancel={() => setIsShowTempModal(false)}
          footer={null}
        >
          {tempList.map((url, i) => (
            <div key={i}>
              <Button icon={<DownloadOutlined />} type="link" onClick={() => downloadTemp(url)}>
                {url.split('/').pop()}
              </Button>
            </div>
          ))}
        </BaseModal>
      )}
    </div>
  );
};

export default BaseUpload;
