import { useState } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { copyText } from '../../util';
import type { BaseCopyProps } from './typing';
import './index.less';

const BaseCopy = (props: BaseCopyProps) => {
  const { text, disabled, empty } = props;
  const isEmpty = !text && text !== 0;
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <>
      {isEmpty ? empty : text}

      {!disabled && !isEmpty && (
        <>
          {isSuccess ? (
            <CheckOutlined className="base-copy" />
          ) : (
            <CopyOutlined
              className="base-copy"
              onClick={(e) => {
                e.stopPropagation();
                copyText(text);
                setIsSuccess(true);
                setTimeout(() => {
                  setIsSuccess(false);
                }, 600);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default BaseCopy;
