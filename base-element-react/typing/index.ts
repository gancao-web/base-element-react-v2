/**
 * 将指定属性改为必填
 * type newStudent = required<Student, 'age' | 'name'>
 * 将所有属性改为必填
 * type newStudent = Required<Student>
 */
export type required<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & Omit<T, K>;

/**
 * 将指定属性改为选填
 * type newStudent = partial<Student, 'age' | 'name'>
 * 将所有属性改为选填
 * type newStudent = Partial<Student>
 */
export type partial<T, K extends keyof T> = {
  [P in K]+?: T[P];
} & Omit<T, K>;

/**
 * 对象,等同Record<string, any>
 */
export type BaseObj = {
  [key: string]: any;
};

/**
 * 元素对象(不为空)
 */
export type BaseNode = Exclude<React.ReactNode, null | undefined>;

/**
 * 样式对象
 */
export type BaseStyle = {
  [key: string]: React.CSSProperties;
};

/**
 * BaseElement的配置类型 (对外)
 */
export type BaseConfigProp = {
  /** 通用接口请求 (使用在接口枚举。若没有使用接口枚举,则不用配置) */
  http?: (url: string, param: BaseObj, config?: BaseObj) => Promise<any>;
  /** 单文件上传接口 (使用在富文本。若没有用富文本则不必配置) */
  uploadApi?: (file: File) => Promise<string>;
  /** 上传组件的action配置 (使用在上传组件。若没有使用上传组件, 则不用配置) */
  uploadAction?: (param?: any) => {
    /** 上传接口 */
    action: string;
    /** 上传成功获取完整地址 (response接口返回 => 完整的网络地址) */
    success: (response: any, file: File) => string;
    /** File对象的参数名,默认"file" */
    name?: string;
    /** 请求头 */
    headers?: any;
    /** 额外参数 */
    data?: any;
  };
  /** 云存储域名 (图片和视频组件自动拼接域名) */
  imgHost?: string;
  /** 云存储类型 (阿里云"OSS"|七牛云"QiNiu") */
  imgType?: 'OSS' | 'QiNiu';
  /** table的唯一标识 (默认"id") */
  rowKey?: string;
  /** 分页页码的key (默认"pageNum") */
  pageKey?: string;
  /** 分页页长的key (默认"pageSize") */
  sizeKey?: string;
  /** 列表数据的key (默认"list") */
  listKey?: string;
  /** 列表总数的key (默认"total") */
  totalKey?: string;
  /** 高德地图jsapi的key */
  gaodeKey?: string;
  /** 高德地图jsapi的秘钥 ( 生产环境推荐使用Nginx反向代理: https://lbs.amap.com/api/javascript-api-v2/guide/abc/jscode ) */
  gaodeSecret?: string;
  /** 表头吸顶悬浮, 默认false */
  sticky?: boolean | { offsetHeader?: number; btnsSticky?: boolean; tableSticky?: boolean };
};

/**
 * 基础校验规则
 */
export type BaseRule = {
  /** 是否必填 */
  required?: boolean;
  /** 数字最小值或最少输入字符数 (支持传入字段) */
  min?: number | string;
  /** 数字最大值或最大输入字符数 (支持传入字段) */
  max?: number | string;
  /** 校验不通过的提示消息 */
  message?: string;
  /** 校验规则触发的时机 */
  validateTrigger?: 'onChange' | 'onBlur';
  /** 输入框的校验类型 */
  type?: BaseInputType;
  /** 自定义校验方法
   * @name form 表单
   * @name value 当前字段值
   * @return 成功返回Promise.resolve(); 失败返回Promise.reject('错误信息');
   */
  validator?: (form: BaseObj, value: any) => Promise<any>;
};

/**
 * 配置化lib枚举项
 */
export type BaseLibItem = {
  /** 文本 */
  label: BaseNode;
  /** 值 */
  value: any;
  /** 文本样式: 仅设置颜色 (常用于BaseTable中) */
  color?: BaseColor;
  /** 文本样式: 小圆点文本 (常用于BaseTable中显示状态) */
  dot?: BaseColor;
  /** 文本样式: 标签文本 (常用于BaseTable中显示状态) */
  tag?: BaseColor;
  /** BaseLibItems为级联组件的子项数组, ReactNode为BaseTabs的子页 */
  children?: BaseLibItems | React.ReactNode;
  /** 选项的禁用状态 */
  disabled?: boolean;
  /** 级联组件当前点击第几层级, 从1开始 */
  level?: number;
} & BaseObj;

/**
 * 配置化lib枚举
 */
export type BaseLibItems = BaseLibItem[];

/**
 * 配置化lib接口
 */
export type BaseLibApi = {
  /** 取label的字段, 默认"label" */
  label?: string;
  /** 取value的字段, 默认"id" */
  value?: string;
  /** 接口地址 */
  api?: string | ((param: any) => Promise<BaseLibItem[]>);
  /** 接口参数 (返回false,将不请求; 'target'参数在下拉组件中可解构出value和keyword; 在级联中则为选中项; 在radio,checkbox则无值) */
  param?: BaseObj | ((target: BaseObj) => BaseObj | false);
  /** 接口配置 */
  requestConfig?: BaseObj;
  /** 结果过滤器返回枚举列表 */
  filterResult?: (res: any) => BaseLibItem[];
  /** 级联组件取children的字段, 默认"children" */
  children?: string;
  /** 级联组件判断是否为子叶(true为子叶,没有下一级; false为父级,有下一级) */
  isLeaf?: boolean | string | ((item: BaseLibItem) => boolean);
};

/**
 * 配置化lib接口-动态
 * @param item 点击的item数据 (在级联组件中, item.level代表当前点击第几层级, 从1开始)
 */
export type BaseLibApiFn = (item: BaseLibItem | BaseObj) => BaseLibApi;

/**
 * 配置化lib
 */
export type BaseLib = BaseLibItems | BaseLibApi | BaseLibApiFn | string[] | number[];

/**
 * prop配置 - 数组对象类型,应用在BaseSelectInput组件
 */
export type BasePropItems = {
  label: string;
  value: string | string[];
  type?: BaseInputType;
}[];

/**
 * prop配置 (string[]应用在时间范围,级联组件)
 */
export type BaseProp = BasePropItems | string[] | string;

/**
 * 单位 (支持数字或者数字带单位的格式, 数字默认单位px)
 */
export type BaseUnit = string | number;

/**
 * BaseForm表单项的公共配置
 */
export type BaseItem = {
  /** 标签 (支持配置空串占位) */
  label?: React.ReactNode | ((form: BaseObj) => React.ReactNode);
  /** 字段 (当组件返回数组时,prop支持多字段映射) */
  prop?: string | string[];
  /** 校验规则 ( { rules: [{required: true}] } 可简写为 { required: true } ) */
  rules?: BaseRule[];
  /** 是否必填 ( { required: true } 是 { rules: [{required: true}] } 的简写 ) */
  required?: boolean | ((form: BaseObj) => boolean);
  /** 默认值 */
  value?: any;
  /** item的style. 占满一行:{display:"flex"}; 相邻item一行定宽展示:{display:'inline-block'}或{width:"?px"},注意加前后缀可能会换行; 相邻item一行自适应展示:{width:"auto"} */
  sty?: React.CSSProperties;
  /** item的表单项style */
  style?: React.CSSProperties;
  /**
   * @name 是否显示 当为false时,元素不渲染,提交时不校验表单,也取不到该字段 (若想触发校验和取到字段可使用vshow)
   * @param form 函数所用到的表单字段值,没有使用到的则不会返回
   */
  vif?: boolean | ((form: BaseObj) => boolean);
  /**
   * @name 是否显示 当为false时,元素不显示,但会渲染,提交时会校验表单,能取到该字段
   * @param form 函数所用到的表单字段值,没有使用到的则不会返回
   */
  vshow?: boolean | ((form: BaseObj) => boolean);
  /** 后缀 - 不占位 ( 如位置太过右边,则建议改成after字段 或 设置sty:{display:'inline-block'} ) */
  tip?: React.ReactNode | ((form: BaseObj) => React.ReactNode);
  /** 后缀 - 占位, 可通过设置item的宽度来控制是否换行, 如sty:{display:'flex'}或style:{width:'auto'}或style:{width:'?px'} */
  after?: React.ReactNode | ((form: BaseObj) => React.ReactNode);
  /** 前缀 - 占位, 可通过设置item的宽度来控制是否换行, 如sty:{display:'flex'}或style:{width:'auto'}或style:{width:'?px'} */
  before?: React.ReactNode | ((form: BaseObj) => React.ReactNode);
  /** 是否只读,优先级高于disabled,以文本的样式渲染 */
  readonly?: boolean | ((form: BaseObj) => boolean);
  /** 是否禁用 */
  disabled?: boolean | ((form: BaseObj) => boolean);
  /** 是否显示冒号 */
  colon?: boolean;
  /** 接口枚举的参数, 返回false则不发请求 (此处支持监听form) */
  libParam?: BaseObj | ((form: BaseObj) => BaseObj | false);
  /** 表单变化时,是否自动搜索 (选择类的组件默认开始, 输入类的组件默认不开启) */
  autoSearch?: boolean;
  /**
   * @name 自定义组件 (组件钩子必须定义value, onChange; 并且无法通过value设置默认值,可另外定义属性defaultValue传入)
   * @param form render中所用到的表单字段值
   */
  render?: (form: BaseObj) => React.ReactNode;
  /**
   * @name 表单值变化的监听
   * @param form 表单所有的字段值
   * @param selectItems 单选,复选框,下拉选择,级联所选中的项 (单选是对象, 多选是数组)
   */
  onChange?: (form: BaseObj, selectItems?: any) => any;
};

/**
 * BaseForm每个表单项必须定义value, onChange
 */
export type BaseFormItemField = {
  /** 受控内容 */
  value?: any;
  /** 默认值 (当无法通过value设置默认值时,可用initialValues) */
  initialValues?: any;
  /**
   * @name 表单值变化的监听
   * @param form 表单所有的字段值
   * @param selectItems 单选,复选框,下拉选择,级联所选中的项 (单选是对象, 多选是数组)
   */
  onChange?: (value: any, selectItems?: any) => void;
};

/**
 * BaseForm每个表单项的公共配置
 */
export type BaseItemField = BaseFormItemField & {
  /** 是否只读,优先级高于disabled,以文本的样式渲染 */
  readonly?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 表单项的样式 */
  style?: React.CSSProperties;
  /** 表单项的样式 */
  className?: string;
};

/** 表单域标签的宽度 (默认120) */
export type BaseLabelWidth = 'auto' | 40 | 80 | 100 | 120 | 140 | 160 | 180 | 200;

/** 表单域的宽度 (默认240) */
export type BaseValueWidth = 240 | 330 | 420;

/** 表单域标签的对齐方式 (默认居中) */
export type BaseLabelAlign = 'middle' | 'top' | 'baseline' | 'bottom';

/**
 * 颜色
 */
export type BaseColor = 'primary' | 'red' | 'green' | 'blue' | 'yellow' | 'gray' | (string & {});

/**
 * 时间
 */
export type BaseTime = number | string | Date;

/**
 * 输入类型
 * @example 整数"num" | 两位小数"digit" | 手机号"phone" | 座机"tel" | 身份证"idcard" | 银行卡"bank_card" | 中文"zh" | 英文"en" | 英文+数字"en_num" | 链接"http" | 税号"tax"
 */
export type BaseInputType =
  | 'num'
  | 'digit'
  | 'tel'
  | 'phone'
  | 'idcard'
  | 'bank_card'
  | 'zh'
  | 'en'
  | 'en_num'
  | 'zh_en_num'
  | 'http'
  | 'tax'
  | 'textarea'
  | 'text'
  | 'password';
