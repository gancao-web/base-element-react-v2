import { useState } from 'react';
import { CaretDownOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Input, Popover } from 'antd';
import { DEF_COLORS } from './def';
import type { BaseInputColorProps } from './typing';

const BaseInputColor = (prop: BaseInputColorProps) => {
  const {
    isShowInput = true,
    style,
    placeholder,
    value,
    onChange,
    className,
    colors = DEF_COLORS,
  } = prop;

  const [isShowPop, setShowPop] = useState(false);

  return (
    <div
      style={{ display: 'flex', ...style }}
      className={`base-input-color ${className || ''}`.trim()}
    >
      {isShowInput && (
        <Input
          style={{ flex: 1 }}
          value={value}
          allowClear
          placeholder={placeholder}
          onChange={(e) => {
            // 直接拷贝设计稿代码的情况: background: linear-gradient(180deg, #C8EFB0 0%, #FFFFFF 86.36%);
            const val = e.target.value.replace('background:', '').replace(';', '').trim();
            onChange?.(val);
          }}
        />
      )}

      <div style={{ position: 'relative' }}>
        <Input
          value={value || '#000000'}
          onChange={(e) => onChange?.(e.target.value)}
          style={{ width: 60 }}
          type="color"
        />

        <Popover
          open={isShowPop}
          onOpenChange={setShowPop}
          trigger="click"
          content={
            <div style={{ width: 150 }}>
              <div>
                {colors.map((color) => (
                  <div
                    key={color}
                    style={{
                      display: 'inline-block',
                      margin: 4,
                      width: 28,
                      height: 28,
                      background: color,
                    }}
                    onClick={() => {
                      onChange?.(color);
                      setShowPop(false);
                    }}
                  />
                ))}
              </div>
              <Input
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                allowClear={{ clearIcon: <CloseCircleFilled onClick={() => setShowPop(false)} /> }}
                placeholder="输入颜色"
              />
            </div>
          }
        >
          <div
            style={{
              zIndex: 9,
              position: 'absolute',
              top: 0,
              right: 0,
              fontSize: 10,
              padding: '12px 1px 10px 5px',
              lineHeight: 1,
              cursor: 'pointer',
            }}
            onClick={() => setShowPop(!isShowPop)}
          >
            <CaretDownOutlined />
          </div>
        </Popover>

        {!value && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '50%',
              width: '80%',
              height: 1,
              background: '#000',
              transform: 'translate(50%, -50%) rotate(26deg)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BaseInputColor;
