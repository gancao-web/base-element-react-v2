import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
// @ts-ignore 忽略类型检查 (避免通过手动在src创建.d.ts来解决对象未定义的问题,因发布到npm后tsconfig.json不包含node_modules的.d.ts)
import BraftEditor from 'braft-editor';
// @ts-ignore
import { ContentUtils } from 'braft-utils';
// @ts-ignore
import ColorPicker from 'braft-extensions/dist/color-picker';
// @ts-ignore
import Table from 'braft-extensions/dist/table';
import { Input, message } from 'antd';
import { getBaseConfig } from '../../config';
// @ts-ignore
import type { ExtendControlType } from 'braft-editor';
import type { BaseEditorProps, BaseEditorRef } from './typing';
// @ts-ignore
import type EditorState from 'braft-editor';

import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';
import 'braft-editor/dist/index.css';
import './index.less';

const tableOption = {
  defaultRows: 2, // 默认行数
  defaultColumns: 4, // 默认列数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽， 默认false
  exportAttrString: 'border="1" style="border-collapse: collapse", ', // 指定输出HTML时附加到table标签上的属性字符串
};

BraftEditor.use(Table(tableOption)); // 启用表格插件
BraftEditor.use(ColorPicker()); // 启用颜色选择器插件

const { TextArea } = Input;

/**
 * 基于braft-editor的富文本
 * 文档: https://www.yuque.com/braft-editor/be/lzwpnr
 * 插件: https://gitcode.com/margox/braft-extensions/overview
 */
const BaseEditor = forwardRef<BaseEditorRef, BaseEditorProps>((props, ref) => {
  const defaultState = BraftEditor.createEditorState(props.value);
  const editorHeight = props.height || 400; // 默认高度
  const [editorState, setEditorState] = useState<EditorState>(defaultState); // 设置EditorState
  const [htmlContent, setHtmlContent] = useState(''); // 设置html内容
  const [isShowHtml, setIsShowHtml] = useState(false); // 是否显示html源代码

  // 编辑器内容区样式
  const contentStyle = isShowHtml ? { height: 0, paddingBottom: 0 } : { height: editorHeight };

  const extendControls: ExtendControlType[] = [
    'separator', // 分隔线
    {
      key: 'show-html', // 控件唯一标识
      type: 'button', // 控件类型
      text: 'html', // 按钮文字
      title: '显示HTML代码', // 鼠标悬停提示
      onClick: () => {
        isShowHtml && htmlToEditorState(htmlContent); // 从html转回富文本时,需更新一下html对应的editorState
        setIsShowHtml(!isShowHtml);
      },
    },
  ];
  if (props.extendControls) {
    extendControls.push(...props.extendControls);
  }

  // 图片上传接口
  const uploadFn = async (e: any) => {
    const baseConfig = getBaseConfig();

    if (!baseConfig.uploadApi) {
      message.error('富文本上传文件失败,请在main.tsx配置BaseElement的uploadApi');
      return;
    }
    const url = await baseConfig.uploadApi(e.file);
    e.success({ url });
  };

  // 编辑器内容变化的监听
  const onEditorChange = (editorState: any) => {
    const htmlContent = editorState.toHTML();
    setEditorState(editorState);
    setHtmlContent(htmlContent);
    props.onChange?.(htmlContent);
  };

  // 源代码文本框内容变化的监听 (此时不更新editorState,避免输入状态丢失,在onBlur中更新即可)
  const onTextAreaChange = (e: any) => {
    const htmlContent = e.target.value;
    setHtmlContent(htmlContent);
    props.onChange?.(htmlContent);
  };

  // 更新html对应的状态
  const htmlToEditorState = (html: string) => {
    setEditorState(BraftEditor.createEditorState(html));
  };

  // 只读回显 ( 不使用output.css输出内容,差距还是很大 https://www.yuque.com/braft-editor/be/lzwpnr#b79b9e83 )
  const readOnly = props.readonly || props.disabled;

  // 是否显示边框, 默认true
  const hasBorder = props.hasBorder != false;

  // 对外通过ref暴露的方法
  useImperativeHandle(ref, () => ({
    // 在光标处插入文本
    insertText(text: string) {
      setEditorState(ContentUtils.insertText(editorState, text));
    },
  }));

  // 异步请求的数据回显 ( 富文本非响应式: https://www.yuque.com/braft-editor/be/lzwpnr#1bbbb204 )
  useEffect(() => {
    const newValue = props.value || '';
    newValue !== htmlContent && htmlToEditorState(newValue);
  }, [props.value]);

  return (
    <>
      <BraftEditor
        style={props.style}
        className={`base-editor ${hasBorder ? 'has-border' : ''} ${props.className || ''}`}
        value={editorState}
        onChange={onEditorChange}
        media={{ uploadFn }}
        contentStyle={contentStyle}
        excludeControls={readOnly ? [] : props.excludeControls}
        extendControls={readOnly ? [] : extendControls}
        readOnly={readOnly}
        controls={readOnly ? [] : undefined}
      />
      {isShowHtml ? (
        <TextArea
          className="base-editor-html"
          style={{ height: editorHeight }}
          value={htmlContent}
          autoSize={false}
          bordered={false}
          onChange={onTextAreaChange}
          onBlur={() => htmlToEditorState(htmlContent)}
        />
      ) : (
        ''
      )}
    </>
  );
});

export default BaseEditor;
