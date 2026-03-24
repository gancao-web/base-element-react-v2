import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal } from 'antd';
import BaseTable from '../BaseTable';
import BaseInput from '../BaseInput';
import { deepClone } from '../../util';
import type { BaseTableBtn } from '../BaseTable/typing';
import type { BaseObj } from '../../typing';
import type { BaseTableDragConfig, BaseTableDragProps } from './typing';
import './index.less';

interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}

const BaseTableDrag = (props: BaseTableDragProps) => {
  // Table配置
  const tableConfig: BaseTableDragConfig = deepClone(props.config);
  // Table的数据
  const list = tableConfig.list;

  // 拖动事件
  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const dragRow = list[dragIndex];
    const hoverRow = list[hoverIndex];
    const newList: BaseObj[] = [];
    const isUp = dragIndex > hoverIndex;
    list.forEach((item, i) => {
      if (isUp && i == hoverIndex) {
        newList.push(dragRow);
      }
      if (i != dragIndex) {
        newList.push(item);
      }
      if (!isUp && i == hoverIndex) {
        newList.push(dragRow);
      }
    });
    // 派发拖动事件
    tableConfig.onDrag({
      dragIndex,
      hoverIndex,
      dragRow,
      hoverRow,
      newList,
      oldList: list,
    });
  };

  // 上移,下移按钮
  const btns: BaseTableBtn[] = [
    {
      vif: (row, i) => i > 0,
      label: '上移',
      click(row, i) {
        moveRow(i, i - 1);
      },
    },
    {
      vif: (row, i) => i < list.length - 1,
      label: '下移',
      click(row, i) {
        moveRow(i, i + 1);
      },
    },
    {
      vif: () => list.length > 10,
      label: '排序',
      click(row, i) {
        setCurSortRow(row);
        setCurSortIndex(i);
        setIsShowSortDialog(true);
      },
    },
  ];
  // 上移,下移按钮添加至操作栏
  const btnItem = tableConfig.table.find((e) => e.btns);
  if (btnItem && btnItem.btns) {
    btnItem.btns = [...btns, ...btnItem.btns];
  } else {
    tableConfig.table.push({
      label: '操作',
      btns,
      ...btnItem,
    });
  }

  // 拖动行组件
  const type = 'DraggableBodyRow';
  const DraggableBodyRow = ({
    index,
    moveRow,
    className,
    style,
    ...restProps
  }: DraggableBodyRowProps) => {
    const ref = useRef<HTMLTableRowElement>(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: (monitor: any) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' base-drop-downward' : ' base-drop-upward',
        };
      },
      drop: (item: { index: number }) => {
        if (item.index != index) moveRow(item.index, index);
      },
    });
    const [, drag] = useDrag({
      type,
      item: { index },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));

    return (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move', ...style }}
        {...restProps}
      />
    );
  };

  // 拖动组件配置相关
  tableConfig.components = {
    body: {
      row: DraggableBodyRow,
    },
  };
  tableConfig.onRow = (e: any, index: number) => {
    const attr = {
      index,
      moveRow,
    };
    return attr as React.HTMLAttributes<any>;
  };

  // 排序弹窗
  const [isShowSortDialog, setIsShowSortDialog] = useState(false);
  const [curSortRow, setCurSortRow] = useState<BaseObj>();
  const [curSortIndex, setCurSortIndex] = useState<number>();
  const [curSortInput, setCurSortInput] = useState<number>();
  const sortDialogTitle =
    tableConfig.sortDialogTitle && curSortRow
      ? tableConfig.sortDialogTitle(curSortRow)
      : '将序号调整为：';
  const sortDialogSubmit = () => {
    curSortIndex != null && curSortInput && moveRow(curSortIndex, curSortInput - 1);
    sortDialogClose();
  };
  const sortDialogClose = () => {
    setCurSortRow(undefined);
    setCurSortIndex(undefined);
    setCurSortInput(undefined);
    setIsShowSortDialog(false);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <BaseTable config={tableConfig} />
      <Modal
        open={isShowSortDialog}
        title={sortDialogTitle}
        centered
        onOk={sortDialogSubmit}
        onCancel={sortDialogClose}
      >
        <BaseInput
          placeholder={`请输入序号，范围：1~${list.length}`}
          max={list.length}
          type="num"
          value={curSortInput}
          onChange={setCurSortInput}
        />
      </Modal>
    </DndProvider>
  );
};

export default BaseTableDrag;
