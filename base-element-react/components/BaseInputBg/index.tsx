import { CloseCircleFilled, UploadOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber } from 'antd';
import BaseInputColor from '../BaseInputColor';
import BaseUpload from '../BaseUpload';
import BaseCascader from '../BaseCascader';
import { BG_SIZE } from './lib';
import { DEF_BG_ALIGN, DEF_BG_REPEAT, DEF_BG_SIZE } from './def';
import type { BaseBg, BaseInputBgProps } from './typing';

const BaseInputBg = (props: BaseInputBgProps) => {
  const {
    value,
    onChange,
    defaultRepeat = DEF_BG_REPEAT,
    defaultSize = DEF_BG_SIZE,
    defaultAlign = DEF_BG_ALIGN,
    style,
    className,
    colors,
  } = props;

  const bg = parseBg(value);

  // 解析背景值
  function parseBg(value?: string): BaseBg {
    const url = parseUrl(value);
    const size = parseBgSize(value);
    const align = parseBgAlign(value);
    const repeat = parseRepeat(value);
    const { color1, color2, deg } = parseGradient(value);
    return { color1, color2, deg, url, size, align, repeat };
  }

  // 解析渐变
  function parseGradient(value?: string) {
    if (!value) return {};
    if (value.includes('transparent')) value = value.replace('transparent', '');
    if (value.includes('no-repeat,')) value = value.split('no-repeat,')[1];
    if (value.includes('repeat,')) value = value.split('repeat,')[1];
    if (value.includes('linear-gradient')) {
      const arr =
        value.replace('linear-gradient(', '').replace('deg', '').replace(')', '').split(',') || [];
      return { color1: arr[1], color2: arr[2], deg: arr[0] };
    } else {
      return { color1: value };
    }
  }

  // 解析背景图片
  function parseUrl(value?: string) {
    if (!value) return undefined;
    const str = value.split(')').find((s) => s.includes('url'));
    return str?.split('url(')[1];
  }

  // 解析背景尺寸
  function parseBgSize(value?: string) {
    if (!value) return defaultSize;
    if (value.includes('contain')) return 'contain';
    if (value.includes('cover')) return 'cover';
    return defaultSize;
  }

  // 解析背景重复
  function parseRepeat(value?: string) {
    if (!value) return defaultRepeat;
    if (value.includes(' repeat')) return 'repeat';
    if (value.includes('no-repeat')) return 'no-repeat';
    return defaultRepeat;
  }

  // 解析背景对齐
  function parseBgAlign(value?: string) {
    if (!value) return defaultAlign;
    if (value.includes('center center')) {
      return 'center';
    } else if (value.includes('center bottom')) {
      return 'bottom';
    } else if (value.includes('center top')) {
      return 'top';
    }
    return defaultAlign;
  }

  // 触发背景值改变事件
  function emitChange(newBg: BaseBg) {
    if (!onChange) return;

    const all = { ...bg, ...newBg };
    const { color1, color2, deg, url, align, size, repeat = defaultRepeat } = all;
    const bgImg = url ? `url(${url}) center ${align} / ${size} ${repeat},` : '';
    const bgColor = color2
      ? `linear-gradient(${deg ?? 180}deg,${color1 || 'transparent'},${color2})`
      : color1;
    onChange(bgImg ? `${bgImg}${bgColor || 'transparent'}` : bgColor);
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'start', ...style }}
      className={`base-input-bg ${className || ''}`.trim()}
    >
      <Input
        style={{ flex: 1 }}
        value={value}
        allowClear
        onChange={(e) => {
          if (!onChange) return;
          // 直接拷贝设计稿代码的情况: background: linear-gradient(180deg, #C8EFB0 0%, #FFFFFF 86.36%);
          const val = e.target.value.replace('background:', '').replace(';', '').trim();
          onChange(val);
        }}
      />

      <BaseInputColor
        colors={colors}
        isShowInput={false}
        value={bg.color1}
        onChange={(color1) => emitChange({ color1 })}
      />

      <BaseInputColor
        colors={colors}
        isShowInput={false}
        value={bg.color2}
        onChange={(color2) => emitChange({ color2 })}
      />

      {bg.color2 && (
        <div style={{ position: 'relative' }}>
          <InputNumber
            style={{ width: 54, padding: 0 }}
            value={bg.deg}
            onChange={(deg) => emitChange({ deg })}
            controls={false}
          />

          <div
            style={{ position: 'absolute', top: 0, right: 4, fontSize: 11, pointerEvents: 'none' }}
          >
            度
          </div>
        </div>
      )}

      <BaseUpload
        style={{ maxWidth: 80 }}
        value={bg.url}
        onChange={(url) => emitChange({ url })}
        accept="image/*"
        hasHost
      >
        <div style={{ position: 'relative' }}>
          <Button style={{ paddingLeft: 10, paddingRight: 10, lineHeight: 1 }}>
            {bg.url ? <img src={bg.url} style={{ width: 44, height: 20 }} /> : <UploadOutlined />}
          </Button>

          {bg.url && (
            <CloseCircleFilled
              style={{ position: 'absolute', top: 0, right: 0, color: 'red', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                emitChange({ url: '' });
              }}
            />
          )}
        </div>
      </BaseUpload>

      {bg.url && (
        <BaseCascader
          value={bg.size == 'cover' ? [bg.size, bg.align] : [bg.size, bg.align, bg.repeat]}
          style={{ width: 136 }}
          lib={BG_SIZE}
          onChange={(arr) => emitChange({ size: arr[0], align: arr[1], repeat: arr[2] })}
        />
      )}
    </div>
  );
};

export default BaseInputBg;
