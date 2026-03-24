import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Modal, version } from 'antd';
import BaseModalContent from './components/BaseModalContent';
import BaseDragTitle from './components/BaseDragTitle';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import type { BaseModalProps } from './typing';

const BaseModal = (props: BaseModalProps) => {
  const { draggable = true, children, title, open } = props;
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const openProp = { [version >= '4.23.0' ? 'open' : 'visible']: open };

  function createTitle() {
    return draggable ? <BaseDragTitle onDragChange={setDragging}>{title}</BaseDragTitle> : title;
  }

  function createModalRender() {
    return draggable
      ? (modal: React.ReactNode) => (
          <Draggable
            disabled={!dragging}
            bounds={bounds}
            onStart={(event: any, uiData: any) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )
      : undefined;
  }

  function onStart(e: DraggableEvent, uiData: DraggableData) {
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) return;

    setBounds({
      left: -targetRect.left + uiData.x,
      right: window.document.documentElement.clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: window.document.documentElement.clientHeight - (targetRect.bottom - uiData.y),
    });
  }

  return (
    <Modal
      destroyOnClose
      centered
      {...props}
      {...openProp}
      title={createTitle()}
      modalRender={createModalRender()}
    >
      <BaseModalContent afterOpen={props.afterOpen}>{children}</BaseModalContent>
    </Modal>
  );
};

export default BaseModal;
