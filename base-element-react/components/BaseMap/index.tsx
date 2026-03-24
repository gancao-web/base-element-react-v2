import { useEffect, useRef, useState } from 'react';
import { AutoComplete, Input, message } from 'antd';
import { loadJs } from '../../util';
import { getBaseConfig } from '../../config';
import type { BaseMapMarker, BaseMapProps, GeocoderResult, LngLatResult } from './typing';
import type { BaseObj } from '../../typing';
import './index.less';

const JS_URL = 'https://webapi.amap.com/maps?v=2.0';
const ICON_RED = 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png';
const ICON_BLUE = 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png';

/**
 * 高德地图组件
 * https://developer.amap.com/api/jsapi-v2/update
 */
const BaseMap = (props: BaseMapProps) => {
  const [completeItems, setCompleteItems] = useState<BaseMapMarker[]>([]);
  const refDom = useRef<HTMLDivElement>(null);
  const refData = useRef<any>({
    map: null,
    infoWindow: null,
    autocomplete: null,
    markerAll: [],
    markerGeolocation: null,
    markerComplete: null,
  }).current;

  const width = props.width || '100%';
  const height = props.height || 400;

  // 初始化
  function init() {
    const baseConfig = getBaseConfig();
    if (!baseConfig.gaodeKey) {
      message.error('加载地图失败,请在main.tsx配置BaseElement的gaodeKey');
      return;
    }
    // 加载地图js
    const url = `${JS_URL}&key=${baseConfig.gaodeKey}`;
    // jsapi的安全秘钥配置,本地临时调试用
    if (baseConfig.gaodeSecret) {
      window['_AMapSecurityConfig'] = { securityJsCode: baseConfig.gaodeSecret };
    }
    loadJs(url, () => {
      // 初始化地图
      initMapObj();
      // 定位
      initGeolocation();
      // 卫星地图和路况
      initMapType();
      // 浮窗信息
      initInfoWindow();
      // 绘制覆盖物
      resetMarkerAll();
      // 搜索提示
      initAutocomplete();
      // 经纬度反解析
      initGeocoder();
      // 初始化完毕的事件
      props.onInited?.(refData.map);
    });
  }

  // 地图对象
  function initMapObj() {
    const option: BaseObj = { zoom: props.zoom || 16 };
    if (props.markerGeolocation) {
      option.center = [props.markerGeolocation.longitude, props.markerGeolocation.latitude];
    }
    const AMap = window['AMap'];
    refData.map = new AMap.Map(refDom.current, option);
    refData.map.on('click', (e: any) => {
      console.log('map.onClick:', e);
      props.onClick?.({ longitude: e.lnglat.lng, latitude: e.lnglat.lat });
    });
  }

  // 定位
  function initGeolocation() {
    if (!props.plugin?.includes('Geolocation')) return;
    const AMap = window['AMap'];
    AMap.plugin('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({
        buttonPosition: 'RB',
        buttonOffset: new AMap.Pixel(28, 10),
      });
      refData.map.addControl(geolocation);
      geolocation.getCurrentPosition((status: any, result: any) => {
        if (status == 'complete') {
          console.log('定位成功:', result);
          props.onGeolocation?.(result);
        } else {
          console.error(`定位失败,${status}:${JSON.stringify(result)}`);
        }
      });
    });
  }

  // 卫星地图,路况
  function initMapType() {
    if (!props.plugin?.includes('MapType')) return;
    const AMap = window['AMap'];
    AMap.plugin('AMap.MapType', () => {
      const toolbar = new AMap.MapType();
      refData.map.addControl(toolbar);
    });
  }

  // 浮窗信息
  function initInfoWindow() {
    if (!props.plugin?.includes('InfoWindow')) return;
    const AMap = window['AMap'];
    AMap.plugin('AMap.InfoWindow', () => {
      refData.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -36) });
    });
  }

  // 经纬度反解析
  function initGeocoder() {
    const AMap = window['AMap'];
    AMap.plugin('AMap.Geocoder', () => {
      refData.geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all',
      });
    });
  }

  // 显示浮窗信息
  function showInfoWindow(content: string, longitude: number, latitude: number) {
    if (!refData.infoWindow || !content) return;
    refData.infoWindow.setContent(content);
    refData.infoWindow.open(refData.map, [longitude, latitude]);
  }

  // 搜索提示
  function initAutocomplete() {
    if (!props.plugin?.includes('AutoComplete')) return;
    const AMap = window['AMap'];
    AMap.plugin('AMap.AutoComplete', () => {
      refData.autocomplete = new AMap.AutoComplete({
        city: props.city || '',
        citylimit: true,
      });
      console.log(props.city, 'props.city');
    });
  }

  // 搜索地址
  function autoComplete(word: string, success: (markers: BaseMapMarker[]) => void) {
    if (!refData.autocomplete) return;
    if (!word) {
      success([]);
      return;
    }
    refData.autocomplete.search(word, (status: any, result: any) => {
      console.log(`autocomplete,${status}: `, result);
      if (!result?.tips) return;
      const markers: BaseMapMarker[] = [];
      for (const item of result.tips) {
        markers.push({
          longitude: item.location.lng,
          latitude: item.location.lat,
          label: item.name,
          address: item.district + item.address,
        });
      }
      success(markers);
    });
  }

  // 显示搜索结果
  function completeSearch(word: string) {
    autoComplete(word, (markers) => {
      const items: BaseMapMarker[] = [];
      for (const m of markers) {
        const isAdd = items.find((item) => item.value === m.label); // 地名可能会相同,需要排重
        !isAdd && items.push({ label: m.label, value: m.label, ...m }); // value取label,因为输入框最终显示的是文本
      }
      setCompleteItems(items);
    });
  }

  // 选择搜索结果
  function completeSelect(value: number, item: BaseMapMarker) {
    const data = { ...item };
    const lnglat = new window['AMap'].LngLat(item.longitude, item.latitude);
    if (lnglat) {
      const AMap = window['AMap'];
      const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all',
      });
      geocoder.getAddress(lnglat, (status: string, result: GeocoderResult) => {
        if (status === 'complete' && result.info === 'OK') {
          data.address = result.regeocode?.formattedAddress;
          data.province = result.regeocode?.addressComponent?.province;
          data.city = result.regeocode?.addressComponent?.city;
          data.district = result.regeocode?.addressComponent?.district;
        }
      });
    }
    props.onComplete?.(data);
  }

  // 绘制覆盖物 - 数组
  function resetMarkerAll() {
    if (!refData.map) return;
    // 先移除覆盖物
    clearMarkerAll();
    // 绘制当前位置
    resetMarkerGeolocation();
    // 绘制搜索地址
    resetMarkerComplete();
    // 覆盖物 - 自定义
    if (props.markers?.length) {
      for (const m of props.markers) {
        addMarker(m);
      }
    }
    // 总覆盖物数量
    const marketCount = refData.markerAll.length;
    if (marketCount === 1) {
      // 移动到中间 (不改变zoom)
      const position = refData.markerAll[0].getPosition();
      setCenter(position.lng, position.lat);
    } else if (marketCount > 1) {
      // 自适应显示所有覆盖物 (会使zoom设置失效)
      refData.map.setFitView();
    }
  }

  // 绘制覆盖物 - 当前定位的地址
  function resetMarkerGeolocation() {
    if (!refData.map) return;
    refData.markerGeolocation && refData.map.remove(refData.markerGeolocation);
    if (props.markerGeolocation) {
      refData.markerGeolocation = addMarker({ icon: ICON_BLUE, ...props.markerGeolocation });
    } else {
      refData.markerGeolocation = null;
    }
  }

  // 绘制覆盖物 - 当前搜索的地址
  function resetMarkerComplete() {
    if (!refData.map) return;
    refData.markerComplete && refData.map.remove(refData.markerComplete);
    if (props.markerComplete) {
      refData.markerComplete = addMarker(props.markerComplete);
    } else {
      refData.markerComplete = null;
    }
  }

  // 绘制覆盖物 - 单个
  function addMarker(m: BaseMapMarker) {
    const AMap = window['AMap'];

    const iconSize = m.iconSize || [25, 34];
    const iconSizeObj = new AMap.Size(iconSize[0], iconSize[1]);
    const icon = new AMap.Icon({
      size: iconSizeObj,
      imageSize: iconSizeObj,
      image: m.icon || ICON_RED,
    });

    const marker = new AMap.Marker({
      position: new AMap.LngLat(m.longitude, m.latitude),
      draggable: true, // 可拖拽
      icon,
      extData: m,
    });

    if (m.label) {
      marker.setLabel({ content: m.label, offset: new AMap.Pixel(0, -5), direction: 'top' });
    }
    marker.on('click', () => {
      const newContent = props.onMarkerClick?.(marker);
      if (newContent === false) return; // 返回false,则不显示浮窗
      showInfoWindow(newContent || marker.content, marker.longitude, marker.latitude);
    });

    // 拖拽结束逆解析地址
    marker.on('dragend', (e: { lnglat: LngLatResult }) => {
      // 解析经纬度
      const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all',
      });
      geocoder.getAddress(e.lnglat, (status: string, result: GeocoderResult) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log('dragend:', result.regeocode);
          const shortAdd = result.regeocode?.pois[0]?.name; // 短地址
          const formatAdd = result.regeocode?.formattedAddress; // 详细地址
          marker.setLabel({ content: shortAdd, offset: new AMap.Pixel(0, -5), direction: 'top' }); // 拖拽后修改标签上面的地址
          const item = {
            address: formatAdd,
            label: shortAdd,
            value: shortAdd,
            latitude: e.lnglat.lat,
            longitude: e.lnglat.lng,
            province: result.regeocode?.addressComponent?.province,
            city: result.regeocode?.addressComponent?.city,
            district: result.regeocode?.addressComponent?.district,
          };
          props.onComplete?.(item);
        }
      });
    });
    refData.markerAll.push(marker);
    refData.map.add(marker);
    return marker;
  }

  // 移除所有覆盖物
  function clearMarkerAll() {
    for (const m of refData.markerAll) {
      refData.map.remove(m);
    }
    refData.infoWindow?.close();
  }

  // 设置中心点 - 覆盖物
  function setMarkerCenter(marker?: BaseMapMarker) {
    if (!marker) return;
    setCenter(marker.longitude, marker.latitude);
  }

  // 设置中心点 - 经纬度
  function setCenter(longitude: number, latitude: number) {
    refData.map?.setCenter([longitude, latitude]);
  }

  useEffect(() => {
    resetMarkerAll();
  }, [props.markers]);

  useEffect(() => {
    resetMarkerGeolocation();
    setMarkerCenter(props.markerGeolocation);
  }, [props.markerGeolocation]);

  useEffect(() => {
    resetMarkerComplete();
    setMarkerCenter(props.markerComplete);
  }, [props.markerComplete]);

  useEffect(() => {
    init();
    return () => {
      refData.map?.destroy();
    };
  }, []);

  return (
    <div className={`base-map ${props.className || ''}`}>
      {/* 地图 */}
      <div ref={refDom} className="map-obj" style={{ width, height, ...props.style }} />
      {/* 搜索地址 */}
      {props.plugin?.includes('AutoComplete') && (
        <AutoComplete
          className="map-search"
          options={completeItems}
          onSearch={completeSearch}
          onSelect={completeSelect}
        >
          <Input.Search size="large" placeholder="搜索地址" enterButton />
        </AutoComplete>
      )}
    </div>
  );
};

export default BaseMap;
