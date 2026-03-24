import type { BaseObj, BaseUnit } from '../../typing';

/**
 * 钩子
 */
export type BaseMapProps = {
  /** 宽度, 默认100% */
  width?: BaseUnit;
  /** 高度, 默认400px */
  height?: BaseUnit;
  /** 缩放级别, 默认 16 (值越小,显示的范围越大) */
  zoom?: number;
  /** 限定搜索城市范围 */
  city?: string;
  /** 覆盖物 - 当前定位的地址 (与onGeolocation实现受控显示) */
  markerGeolocation?: BaseMapMarker;
  /** 覆盖物 - 当前搜索的地址 (与onComplete实现受控显示) */
  markerComplete?: BaseMapMarker;
  /** 覆盖物 - 自定义 */
  markers?: BaseMapMarker[];
  /** 插件 [定位, 卫星地图和路况, 浮窗信息, 搜索提示] */
  plugin?: ('Geolocation' | 'MapType' | 'InfoWindow' | 'AutoComplete')[];
  /** 表单项的样式 */
  style?: React.CSSProperties;
  /** 表单项的样式 */
  className?: string;
  /** 定位成功的监听 */
  onGeolocation?: (e: { longitude: number; latitude: number }) => void;
  /** 地图点击事件 */
  onClick?: (e: { longitude: number; latitude: number }) => void;
  /** 覆盖物点击事件 (若content有值,则显示浮窗; 可通过返回string来覆盖浮窗的内容,当返回false则不显示浮窗) */
  onMarkerClick?: (marker: BaseMapMarker) => void | string | false;
  /** 选中搜索的提示地址 */
  onComplete?: (marker: BaseMapMarker) => void;
  /** 地图初始化完毕的事件 */
  onInited?: (mapObj: any) => void;
};

/** 覆盖物 */
export type BaseMapMarker = {
  /** 经度 */
  longitude: number;
  /** 纬度 */
  latitude: number;
  /** 图标 (默认红色, 而当前定位点默认蓝色)*/
  icon?: string;
  /** 图标尺寸, 默认[25, 34]*/
  iconSize?: [number, number];
  /** 名称 (显示在图标下面) */
  label?: string;
  /** 地址 */
  address?: string;
  /** 省市区 */
  province?: string;
  city?: string;
  district?: string;
  /** 浮窗,支持html字符串 */
  content?: string;
} & BaseObj;

/** 通过经纬度反解析地址 */
export type GeocoderResult = {
  info: string;
  regeocode: {
    addressComponent: {
      province: string;
      city: string;
      district: string;
      township: string;
      streetNumber: string;
      street: string;
    };
    formattedAddress: string;
    pois: {
      name: string;
    }[];
  };
};

export type LngLatResult = {
  KL: number;
  className: string;
  kT: number;
  lat: number;
  lng: number;
  pos: number[];
};
