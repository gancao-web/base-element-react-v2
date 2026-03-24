import { Fragment, useEffect, useState } from 'react';
import {
  FormOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CopyOutlined,
  TagOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { Table, Tooltip, Tag, Popover } from 'antd';
import { getBaseConfig } from '../../config';
import BaseImg from '../BaseImg';
import BaseVideo from '../BaseVideo';
import BasePopconfirm from '../BasePopconfirm';
import BaseText from '../BaseText';
import { dateFormat, getObjValue } from '../../util';
import BaseSwitch from '../BaseSwitch';
import BaseButton from '../BaseButton';
import BaseCopy from '../BaseCopy';
import type { BaseObj } from '../../typing';
import type { BaseTableBtn, BaseTableBtnIcon, BaseTableProps, LastTdBtnIndex } from './typing';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

/**
 * 配置化表格
 */
const BaseTable = (props: BaseTableProps) => {
  // Table配置
  const tableConfig = props.config;
  // Table配置
  const columns: ColumnsType<BaseObj> = [];
  // Table的子table
  const expandColumns: ColumnsType<BaseObj> = [];
  // Table的rowKey
  const rowKey = tableConfig.rowKey || getBaseConfig().rowKey;
  // Table的选择类型 (多选'checkbox'|单选'radio')
  let selectionType = undefined;
  // 页码
  const pageNoDef = tableConfig.pageNo || 1;
  const [pageNo, setPageNo] = useState(pageNoDef);
  // 页长
  const pageSizeDef = tableConfig.pageSize || 10;
  const [pageSize, setPageSize] = useState(pageSizeDef);
  // 正在switch中的rowKey
  const [switchingKeys, setSwitchingKeys] = useState<React.Key[]>([]);
  // 当前需要高亮的操作按钮
  const [lastTdBtnIndex, setLastTdBtnIndex] = useState<LastTdBtnIndex | undefined>(
    tableConfig.lastTdBtnIndex,
  );

  // 列分组递归
  function filterColumn(table: BaseTableProps['config']['table'], cols: ColumnsType<BaseObj>) {
    // 分页表格
    for (let colIndex = 0; colIndex < table.length; colIndex++) {
      const item = table[colIndex];

      // 是否显示
      if (item.vif === false) continue;
      // type: 多选'checkbox'|单选'radio'
      if (item.type == 'checkbox' || item.type == 'radio') {
        selectionType = item.type;
        continue;
      }
      // 对齐属性
      const col: BaseObj = { ...item };

      col.title = item.label;
      col.dataIndex = item.prop;

      if (item.type == 'index') {
        // 序号
        col.render = (text: string, row: BaseObj, rowIndex: number) => {
          return <span>{(pageNo - 1) * pageSize + rowIndex + 1}</span>;
        };
      } else if (item.render) {
        // 自定义
        col.dataIndex = undefined;
        col.render = (text: string, row: BaseObj, rowIndex: number) => item.render?.(row, rowIndex);
      } else if (item.btns) {
        // 按钮组
        col.valueType = 'option';
        col.fixed = col.fixed ?? 'right';
        col.className = item.btns[0].icon ? 'base-col-icons' : 'base-col-btns';
        if (!col.align) col.align = 'right';
        col.render = (text: string, row: BaseObj, rowIndex: number) =>
          getItemBtns(item.btns!, row, rowIndex, colIndex);
      } else if (item.type === 'switch') {
        // 开关
        col.render = (text: string, row: BaseObj) => {
          const key = item.prop;
          if (!key) return undefined;
          const curRowKey = row[rowKey];
          const curValue = row[key];
          return (
            <BaseSwitch
              lib={item.lib}
              value={curValue}
              loading={switchingKeys.includes(curRowKey)}
              onChange={() => {
                const firstValue = item.lib?.[0].value;
                const twoValue = item.lib?.[1].value;
                const param = {
                  [rowKey]: curRowKey,
                  [key]: curValue == firstValue ? twoValue : firstValue,
                };
                setSwitchingKeys([...switchingKeys, curRowKey]);
                item.api?.(param, row).finally(() => {
                  const index = switchingKeys.indexOf(curRowKey);
                  switchingKeys.splice(index, 1);
                  setSwitchingKeys([...switchingKeys]);
                });
              }}
            />
          );
        };
      } else if (item.lib && item.prop) {
        // 枚举解析
        col.render = (text: string, row: BaseObj) => {
          const value = row[item.prop!];
          return <BaseText value={value} lib={item.lib} empty={item.empty} />;
        };
      } else if (item.type === 'tags') {
        // 标签
        col.render = (text: string, row: BaseObj) => {
          const key = item.prop;
          if (key && row[key]) {
            const tagRes = row[key];
            if (!tagRes || !tagRes.length) return;
            const tagArr = typeof tagRes === 'string' ? tagRes.split(',') : tagRes;
            return tagArr.map((tag: string, i: number) => {
              return (
                !['', undefined, null].includes(tag) && (
                  <Tag className="base-table-tag" color={item.color || 'green'} key={i}>
                    {tag}
                  </Tag>
                )
              );
            });
          }
        };
      } else if (item.type === 'img') {
        // 图片
        col.render = (text: string, row: BaseObj) => {
          const key = item.prop;
          if (key && row[key]) {
            return <BaseImg height={item.height || 50} src={row[key]} />;
          }
        };
      } else if (item.type === 'video') {
        // 视频
        col.render = (text: string, row: BaseObj) => {
          const key = item.prop;
          if (key && row[key]) {
            const poster = item.poster ? row[item.poster] : undefined;
            return <BaseVideo height={item.height || 50} src={row[key]} poster={poster} />;
          }
        };
      } else {
        // 不显示默认的缩略提示
        if (item.ellipsis) col.ellipsis = { showTitle: false };

        col.render = (text: any) => {
          // 兼容数组的情况
          if (Array.isArray(text)) {
            text = text.join('、');
          }

          // 格式化时间
          if (item.format) {
            const fmt = item.format === 'date' ? 'yyyy-MM-dd' : undefined;
            text = dateFormat(text, fmt);
          }

          // 自定义省略提示
          if (text && item.ellipsis) {
            const str =
              typeof item.ellipsis === 'number' && text.toString().length > item.ellipsis
                ? `${text.toString().substring(0, item.ellipsis)}...`
                : text;
            return (
              <Tooltip
                placement="topLeft"
                overlayClassName="base-ellipsis-tooltip"
                title={<BaseCopy text={text} disabled={!item.copyable} />}
              >
                <span style={{ color: item.color }}>{str}</span>
              </Tooltip>
            );
          }

          // 颜色, 兜底值
          return (
            <div
              style={{
                color: item.color,
                whiteSpace: item.isNowrap ? 'nowrap' : 'inherit',
                wordBreak: item.isBreakAll ? 'break-all' : 'inherit',
              }}
            >
              <BaseCopy text={text} empty={item.empty} disabled={!item.copyable} />
            </div>
          );
        };
      }
      // 排序需添加key
      if (item.sorter) {
        col.key = item.prop;
      }
      // 子项
      if (item.children?.length) {
        col.children = [];
        filterColumn(item.children, col.children);
      }
      // 添加
      cols.push(col);
    }
  }

  filterColumn(tableConfig.table, columns);
  tableConfig.expandTable && filterColumn(tableConfig.expandTable, expandColumns);

  // 复选框配置
  const rowSelection = selectionType
    ? {
        type: selectionType,
        selectedRowKeys: tableConfig.selectedRowKeys,
        onChange: tableConfig.onRowSelectionChange,
        getCheckboxProps(row: BaseObj) {
          return { disabled: tableConfig.disableSelection?.(row) };
        },
      }
    : undefined;

  // 分页总数
  const showTotal = (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条 / 总共 ${total} 条`;

  // 'max-content'缩放窗口直到没有多余的空间时,则不再压缩换行表格内容,再超出则显示水平滚动条
  const scrollMaxContent = tableConfig.scrollMaxContent ? 'max-content' : undefined;

  // 设置当前需要高亮的操作按钮下标
  function toSetLastTdBtnIndex(lastTdBtnIndex?: LastTdBtnIndex) {
    setLastTdBtnIndex(lastTdBtnIndex);
    tableConfig.onLastTdBtnIndexChange?.(lastTdBtnIndex);
  }

  // 获取btns
  function getItemBtns(btns: BaseTableBtn[], row: BaseObj, rowIndex: number, colIndex: number) {
    return btns.map((btn, btnIndex) => {
      return (
        <Fragment key={btnIndex}>
          {getItemBtn(btn, row, { rowKey: row[rowKey], rowIndex, colIndex, btnIndex })}
        </Fragment>
      );
    });
  }

  // 获取btn
  function getItemBtn(btn: BaseTableBtn, row: BaseObj, tdBtnIndex: LastTdBtnIndex) {
    // vif的逻辑
    if (btn.vif && !btn.vif(row, tdBtnIndex.rowIndex)) {
      return;
    }

    const tip = typeof btn.tip == 'function' ? btn.tip(row) : btn.tip;
    const label = typeof btn.label == 'function' ? btn.label(row) : btn.label;
    const icon = typeof btn.icon == 'function' ? btn.icon(row) : btn.icon;

    // 文本按钮或图标按钮(未加Tooltip)
    const baseBtn = getBaseButton(btn, row, tdBtnIndex);
    // 图标按钮需包裹在Tooltip中
    const finalBtn = icon ? (
      <Tooltip
        title={label}
        placement="bottom"
        overlayStyle={{ pointerEvents: 'none' }}
        overlayInnerStyle={{ maxHeight: '40vh', overflowY: 'auto' }}
        {...btn.tooltip}
      >
        {baseBtn}
      </Tooltip>
    ) : (
      baseBtn
    );

    // 更多按钮 (Popover的zIndex小一点,确保能够被dialog遮住,从而失焦隐藏)
    if (btn.more) {
      const moreBtns = btn.more.filter((m) => !m.vif || (m.vif && m.vif(row, tdBtnIndex.rowIndex)));
      return moreBtns.length ? (
        <Popover
          trigger={['focus', 'hover']}
          zIndex={99}
          placement="bottomRight"
          overlayClassName="base-table-popover-more"
          content={getItemBtns(moreBtns, row, tdBtnIndex.rowIndex, tdBtnIndex.colIndex)}
        >
          {finalBtn}
        </Popover>
      ) : null;
    }

    // 确认按钮
    if (tip) {
      return (
        <BasePopconfirm
          btn={finalBtn}
          title={tip}
          onConfirm={() => {
            btn.click && btn.click(row, tdBtnIndex.rowIndex);
          }}
        />
      );
    }

    // 普通按钮 (文本或图标)
    return finalBtn;
  }

  // 获取btn (文本按钮或图表按钮)
  function getBaseButton(btn: BaseTableBtn, row: BaseObj, tdBtnIndex: LastTdBtnIndex) {
    const tip = typeof btn.tip == 'function' ? btn.tip(row) : btn.tip;
    const label = typeof btn.label == 'function' ? btn.label(row) : btn.label;
    const icon = typeof btn.icon == 'function' ? btn.icon(row) : btn.icon;
    const color = typeof btn.color == 'function' ? btn.color(row) : btn.color;
    const bg = typeof btn.bg == 'function' ? btn.bg(row) : btn.bg;

    const clsIcon = icon ? ' td-icon-btn' : '';
    const clsAct =
      lastTdBtnIndex &&
      lastTdBtnIndex.rowKey === tdBtnIndex.rowKey &&
      lastTdBtnIndex.colIndex === tdBtnIndex.colIndex &&
      lastTdBtnIndex.btnIndex === tdBtnIndex.btnIndex
        ? ' btn-last-click'
        : '';

    return (
      <BaseButton
        className={`base-td-btn${clsIcon}${clsAct}`}
        type={icon ? 'default' : 'link'}
        style={{ background: bg, borderColor: bg, color: bg && !color ? '#fff' : color }}
        onClick={() => {
          // 标记最近点击的按钮
          tableConfig.isActLastTdBtn && toSetLastTdBtnIndex(tdBtnIndex);
          // tip在onConfirm触发
          if (!tip && btn.click) {
            return btn.click(row, tdBtnIndex.rowIndex);
          }
        }}
      >
        {getBtnIcon(icon) || label}
      </BaseButton>
    );
  }

  // 使用外部lastTdBtnIndex生效
  useEffect(() => {
    setLastTdBtnIndex(tableConfig.lastTdBtnIndex);
  }, [tableConfig.lastTdBtnIndex]);

  return (
    <div
      style={tableConfig.style}
      className={`base-table row-cell-${tableConfig.rowCellAlign || 'center'} ${
        tableConfig.stripe != false ? 'stripe-table' : ''
      }`}
      onClick={(e) => {
        // 点击操作按钮的空白处,取消标记
        if (tableConfig.isActLastTdBtn) {
          const target = (e.target as Element).closest('.base-td-btn');
          !target && toSetLastTdBtnIndex(undefined);
        }
      }}
    >
      <Table
        columns={columns}
        size={tableConfig.size || 'middle'}
        dataSource={tableConfig.list}
        loading={tableConfig.loading}
        rowSelection={rowSelection}
        bordered={tableConfig.bordered}
        rowClassName={tableConfig.rowClassName}
        scroll={{ x: scrollMaxContent, y: tableConfig.scrollHeight }}
        sticky={tableConfig.sticky}
        onChange={(pagination, filters, sorter) => {
          // 分页、排序、筛选变化时触发
          const pageNo = pagination.current || pageNoDef;
          const pageSize = pagination.pageSize || pageSizeDef;
          setPageNo(pageNo);
          setPageSize(pageSize);
          const sorterObj = {};
          if (Array.isArray(sorter)) {
            // 多列排序 (配置BaseTableItem的sorter:{multiple:1})
            for (const s of sorter) {
              if (typeof s.columnKey == 'string') sorterObj[s.columnKey] = s.order;
            }
          } else if (typeof sorter.columnKey == 'string') {
            // 单列排序 (配置BaseTableItem的sorter:true)
            sorterObj[sorter.columnKey] = sorter.order;
          }
          tableConfig.onChange?.({ pageNo, pageSize, filters, sorter: sorterObj });
        }}
        pagination={
          tableConfig.showPagination == false
            ? false
            : {
                pageSize: tableConfig.pageSize,
                current: tableConfig.pageNo,
                total: tableConfig.total,
                showTotal,
                hideOnSinglePage: tableConfig.hideOnSinglePage,
                showSizeChanger: tableConfig.showSizeChanger ?? true,
                showQuickJumper: true,
                size: 'small',
                pageSizeOptions: ['5', '10', '20', '50', '100'],
              }
        }
        rowKey={(row) => row[rowKey]}
        components={tableConfig.components}
        onRow={tableConfig.onRow}
        expandable={{
          expandedRowRender: tableConfig.expandTable
            ? (record) => {
                return (
                  <Table
                    columns={expandColumns}
                    bordered={tableConfig.bordered}
                    dataSource={getObjValue(record, tableConfig.expandListKey)}
                    pagination={false}
                  />
                );
              }
            : undefined,
        }}
      />
    </div>
  );
};

/** 获取按钮的图标 */
function getBtnIcon(icon?: BaseTableBtnIcon) {
  return icon === 'edit' ? (
    <FormOutlined />
  ) : icon === 'del' ? (
    <DeleteOutlined />
  ) : icon === 'detail' ? (
    <FileTextOutlined />
  ) : icon === 'copy' ? (
    <CopyOutlined />
  ) : icon === 'tags' ? (
    <TagOutlined />
  ) : icon === 'more' ? (
    <EllipsisOutlined />
  ) : (
    icon
  );
}

export default BaseTable;
