import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useBaseLib } from '../../hooks/useBaseLib';
import BaseSortable from '../BaseSortable';
import { arrayMove } from '../../util';
import type { BaseTabsProps } from './typing';

/**
 * tab选项卡切换
 * @example <BaseTabs lib={items} value={activeKey} onChange={(activeKey)=>{setActiveKey(activeKey)}} />
 */
const BaseTabs = (props: BaseTabsProps) => {
  const { draggable = false, onSort, value, readonly, lib, ...antdProps } = props; // 移除非antd官方属性,避免ts提示添加了多余属性的警告

  const { tabPosition = 'top', type = 'card' } = antdProps; // antd官方属性

  const { items } = useBaseLib(props); // lib -> items

  // lib的items -> tab官方的items
  const tabItems = items.map((item) => {
    return {
      ...item,
      key: item.value,
      children: React.isValidElement(item.children) ? item.children : undefined,
    };
  });

  // key的顺序 - 外部
  const tabKeys = tabItems.map((item) => item.key);

  // key的顺序 - 内部 (外部有时不必同步更新item的顺序,所以内部需单独维护顺序状态)
  const [orderKeys, setOrderKeys] = useState<string[]>([]);

  // 排序 (orderKeys的更新慢于tabItems,所以需要过滤未找到的item; 比如删除item时,tabItems已经更新,但是orderKeys还存在)
  const orderItems = orderKeys
    .map((key) => tabItems.find((item) => item.key === key)!)
    .filter(Boolean);

  // 同步外部key的顺序
  useEffect(() => {
    setOrderKeys(tabKeys);
  }, [tabKeys.toString()]);

  return (
    <BaseSortable inline={['top', 'bottom'].includes(tabPosition)} disabled={!draggable}>
      <Tabs
        renderTabBar={(tabBarProps, DefaultTabBar) => (
          <DefaultTabBar {...tabBarProps}>
            {(node) => {
              const index = orderItems.findIndex((item) => String(item.key) === String(node.key));

              const sortItemStyle =
                type === 'line'
                  ? { paddingRight: 12, paddingLeft: index === 0 ? 0 : 12 }
                  : undefined;

              return (
                <BaseSortable.Item
                  key={node.key}
                  index={index}
                  style={sortItemStyle}
                  onSort={(oldIndex, newIndex) => {
                    setOrderKeys((pre) => arrayMove(pre, oldIndex, newIndex)); // 更新内部key的顺序
                    onSort?.(oldIndex, newIndex); // 对外派发排序事件 (外部可选择是否更新items)
                  }}
                >
                  {node}
                </BaseSortable.Item>
              );
            }}
          </DefaultTabBar>
        )}
        items={orderItems}
        activeKey={value}
        type={type}
        {...antdProps}
      />
    </BaseSortable>
  );
};

export default BaseTabs;
