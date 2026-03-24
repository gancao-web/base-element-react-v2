import { useState, useRef } from 'react';
import { Cascader } from 'antd';
import { getBaseLibApiItems, getItemsDefault } from '../../util/lib';
import BaseTextLib from '../BaseTextLib';
import type { DefaultOptionType, FieldNamesType } from 'antd/es/cascader';
import type { BaseLibItem, BaseObj } from '../../typing';
import type { BaseCascaderProps } from './typing';

/**
 * 级联选择
 */
const BaseCascader = (props: BaseCascaderProps) => {
  const { showSearch, placeholder = '请选择' } = props;

  // 配置选项
  const lib = props.lib; // 配置化lib
  const isLibArr = Array.isArray(lib); // 是否为静态枚举选项
  const itemsDefault = getItemsDefault(lib); // 默认值
  const [items, setItems] = useState<BaseLibItem[]>(itemsDefault); // 选项
  const [loading, setLoading] = useState(false); // 加载中
  const ref = useRef({
    isLibInit: false, // 避免重绘导致多次请求lib配置
    isLibChildInit: false, // 避免重复回显子项
  }).current;

  // 动态加载数据
  let fieldNames: FieldNamesType | undefined = undefined;
  let loadData;
  if (!isLibArr) {
    if (typeof lib == 'function') {
      // BaseLibApiFn类型: 逐级加载,不是一次请求返回所有层级
      // 加载子项
      const loadDataApi = (targetOption: BaseObj, success?: (arr: BaseLibItem[]) => void) => {
        const libApi = typeof lib == 'function' ? lib(targetOption) : lib;
        if (Array.isArray(libApi)) {
          // 静态配置
          loadDataSuccess(targetOption, libApi);
          // 回调
          success && success(libApi);
        } else {
          // 异步配置
          targetOption.loading = true;
          getBaseLibApiItems(libApi, targetOption).then((arr) => {
            targetOption.loading = false;
            loadDataSuccess(targetOption, arr);
            // 回调
            success && success(arr);
          });
        }
      };

      // 设置子项
      const loadDataSuccess = (targetOption: any, arr: BaseLibItem[]) => {
        if (items.length == 0) {
          // 父级
          setItems(arr);
        } else {
          // 子项
          targetOption.children = arr;
          setItems([...items]);
        }
      };

      // 手动触发的加载子项
      loadData = (selectedItemArr: any) => {
        const targetOption = selectedItemArr[selectedItemArr.length - 1];
        targetOption.level = selectedItemArr.length; // 加入当前选中的层级
        loadDataApi(targetOption);
      };

      // 加载一级菜单 (回调lib初始化成功的事件)
      if (!ref.isLibInit) {
        ref.isLibInit = true;
        loadDataApi({}, props.onLibInit);
      }

      // 数据回显
      const len = props.value?.length;
      if (!ref.isLibChildInit && len > 1 && items.length > 0) {
        ref.isLibChildInit = true;
        // 正在加载的value下标
        const i = 0;
        // 递归初始化子项
        const initChildItem = (arr: BaseLibItem[], i: number): any => {
          if (i >= len - 1) return;
          const val = props.value[i];
          const targetOption = arr.find((item) => item.value == val);
          if (targetOption) {
            targetOption.level = i + 1; // 加入当前加载的层级
            loadDataApi(targetOption, (arr) => {
              i++;
              initChildItem(arr, i);
            });
          }
        };
        initChildItem(items, i);
      }
    } else {
      // BaseLibApi类型: 一次请求返回所有层级
      fieldNames = {
        label: lib.label,
        value: lib.value,
        children: lib.children,
      };
      if (!ref.isLibInit) {
        ref.isLibInit = true;
        setLoading(true);
        getBaseLibApiItems(lib).then((arr: BaseLibItem[]) => {
          setLoading(false);
          setItems(arr);
          props.onLibInit && props.onLibInit(arr);
        });
      }
    }
  }

  // 手动选中的事件
  function onChange(valueArr: any[], selectItems: any[]) {
    ref.isLibChildInit = true; // 避免手动选择,重复回显子项
    if (props.firstLevelSingle) {
      // 一级保持单选
      const singleArr: any[] = [];
      valueArr.forEach((item) => {
        if (singleArr[0] && singleArr[0][0] != item[0]) {
          singleArr.length = 0; // 清除前面不一样的一级
        }
        singleArr.push(item);
      });
      props.onChange && props.onChange(singleArr, selectItems); // 回调选中的value数组
    } else {
      // 一级默认多选
      props.onChange && props.onChange(valueArr, selectItems); // 回调选中的value数组
    }
  }

  // 多选
  const multiple = props.mode == 'multiple';
  // 选中的回填方式
  const showCheckedStrategy =
    props.showCheckedStrategy === 'SHOW_CHILD' ? Cascader.SHOW_CHILD : undefined;

  // 级联搜索
  function getShowSearch() {
    if (!showSearch) return undefined;

    const labelKey = fieldNames?.label || 'label';
    return {
      filter(kw: string, path: DefaultOptionType[]) {
        return path.some((item) => String(item[labelKey]).toLowerCase().includes(kw.toLowerCase()));
      },
    };
  }

  return props.readonly ? (
    <BaseTextLib lib={items} value={props.value} split=" / " />
  ) : (
    <Cascader
      style={props.style}
      className={props.className}
      value={props.value}
      onChange={onChange}
      options={items}
      fieldNames={fieldNames}
      placeholder={placeholder}
      showSearch={getShowSearch()}
      showCheckedStrategy={showCheckedStrategy}
      changeOnSelect={props.changeOnSelect}
      multiple={multiple}
      loadData={loadData}
      loading={loading}
      disabled={props.disabled}
      maxTagCount={props.maxTagCount}
      allowClear={props.clearable != false}
    />
  );
};

export default BaseCascader;
