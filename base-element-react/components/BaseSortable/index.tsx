import { createContext, useContext, useMemo, useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cls } from '../../util';
import type { required } from '../../typing';
import type {
  BaseSortableProps,
  BaseSortableItemProps,
  UseDragItem,
  UseDropCollect,
  UseDragCollect,
} from './typing';

import './index.less';

const CLS_ITEM = 'base-sortable-item';

type BaseSortableContext = { dndKey?: symbol; inline?: boolean };

const SortableContext = createContext<BaseSortableContext>({});

/**
 * 拖拽排序组件
 */
const BaseSortable = (props: BaseSortableProps) => {
  const { children, disabled } = props;

  return disabled ? children : <BaseSortableProvider {...props} />;
};

// 采用provider传递内部变量
const BaseSortableProvider = (props: BaseSortableProps) => {
  const { children, inline } = props;

  // 采用Symbol创建唯一标识符,确保每个拖拽组件相互独立
  const dndKey = useMemo(() => Symbol('dnd_key'), []);

  return (
    <DndProvider backend={HTML5Backend}>
      <SortableContext.Provider value={{ dndKey, inline }}>{children}</SortableContext.Provider>
    </DndProvider>
  );
};

/**
 * 组件内可拖拽的元素
 */
const Item = (props: BaseSortableItemProps) => {
  const { children } = props;

  const { dndKey, ...otherCtx } = useContext(SortableContext);

  // 没有key,说明不需要拖拽
  return dndKey ? (
    <BaseSortableItem dndKey={dndKey} {...otherCtx} {...props}>
      {children}
    </BaseSortableItem>
  ) : (
    children
  );
};

const BaseSortableItem = (
  props: required<BaseSortableContext, 'dndKey'> & BaseSortableItemProps,
) => {
  const { dndKey, inline, index, children, disabled, style, onSort } = props;
  const ref = useRef<HTMLDivElement>(null);

  // 禁用样式
  const disabledClassName = disabled && `${CLS_ITEM}-disabled`;

  // 行内样式
  const inlineClassName = inline && `${CLS_ITEM}-inline`;

  // 拖拽
  const [{ dragClassName }, drag] = useDrag<UseDragItem, unknown, UseDragCollect>({
    type: dndKey,
    item: { index },
    canDrag: () => !disabled,
    collect(monitor) {
      return { dragClassName: monitor.isDragging() ? `${CLS_ITEM}-dragging` : '' };
    },
  });

  // 放置
  const [{ dropClassName }, drop] = useDrop<UseDragItem, unknown, UseDropCollect>({
    accept: dndKey,
    drop: (item) => {
      if (item.index === index) return;
      onSort(item.index, index);
    },
    collect: (monitor) => {
      const item = monitor.getItem();
      if (!item || item.index === index || !monitor.isOver()) {
        return { dropClassName: '' };
      }
      return {
        dropClassName: item.index > index ? `${CLS_ITEM}-forward` : `${CLS_ITEM}-backward`,
      };
    },
  });

  // 无需写在useEffect中, 内部hooks会自动处理
  drop(drag(ref));

  return (
    <div
      ref={ref}
      style={style}
      className={cls(CLS_ITEM, inlineClassName, disabledClassName, dragClassName, dropClassName)}
    >
      {children}
    </div>
  );
};

// 将 Item 挂载到 BaseSortable 上, 实现<BaseSortable.Item>的写法
BaseSortable.Item = Item;

export default BaseSortable;
