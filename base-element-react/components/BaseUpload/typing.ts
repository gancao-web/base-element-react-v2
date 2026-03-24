import type { UploadListType } from 'antd/es/upload/interface';
import type { UploadFile } from 'antd/es/upload';
import type { BaseItem, BaseItemField, BaseObj } from '../../typing';

/**
 * 文件类型: 图片"img" | 视频"video" | 音频"audio" | 表格"xls" | 文本'txt' | pdf | 其他string类型
 */
export type AcceptType = 'img' | 'video' | 'audio' | 'xls' | 'txt' | 'pdf' | (string & {});

/**
 * 上传组件的钩子
 */
type BaseUploadField = {
  /** 文件类型 (默认"img") */
  accept?: AcceptType | AcceptType[];
  /** 最多上传数量 (默认1) */
  max?: number;
  /**文件大小 单位兆 */
  maxSize?: number;
  /** 上传成功的文件地址是否为完整url,默认false,相对地址 */
  hasHost?: boolean;
  /** 模板文件url (支持相对url和完整url; 如果是以'/public/'开头,则为下载本地文件; 因为url可能包含逗号,所以多个模板不采用逗号隔开,而是数组) */
  temp?: string | string[];
  /** 上传所需的额外参数 */
  data?: BaseObj | ((file: File) => BaseObj | Promise<BaseObj>);
  /** 自定义插槽 */
  children?: React.ReactNode;
  /** 上传列表的内建样式 */
  listType?: UploadListType;
  /**
   * @name 文件状态改变的回调 (上传中、完成、失败、删除都会触发)
   * @param value 字段值
   * @param file 当前变化的文件 (上传成功可取到文件下载,大小,id等信息, 可根据status判断上传还是删除等状态)
   * @param fileList 当前所有文件的数据
   */
  onFileChange?: (value: any, file: UploadFile, fileList: UploadFile[]) => void;
  /** 上传文件之前的钩子, 返回false则停止上传 (可通过beforeUpload:()=>false 和 onFileChange取到fileList来自定义上传) */
  beforeUpload?: (file: UploadFile, fileList: UploadFile[]) => boolean | Promise<File>;
  /** 是否开启拖拽排序, 默认true */
  draggable?: boolean;
  /** 是否支持粘贴上传, 默认true (仅鼠标hover时生效, 避免多个上传组件同时响应粘贴; focus时也不生效,因为有可能响应的是上次操作的上传组件) */
  pastable?: boolean;
};

export type BaseUploadProps = BaseItemField & BaseUploadField;

/**
 * 上传组件的item配置
 */
export type BaseUploadItem = {
  /** 组件名称 */
  comp: 'upload';
} & BaseUploadField &
  BaseItem;

/**
 * 可拖拽的子项
 */
export type DragUploadItemProps = {
  dragType: symbol;
  originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  file: UploadFile;
  fileList: UploadFile[];
  moveRow: (dragIndex: any, hoverIndex: any) => void;
};
