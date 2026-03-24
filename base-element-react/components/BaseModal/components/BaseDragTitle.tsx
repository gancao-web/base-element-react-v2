/**
 * 弹窗标题组件 (主要作用是实现弹窗拖拽)
 */
const BaseDragTitle = (props: {
  onDragChange: (draggable: boolean) => void;
  children: React.ReactNode;
}) => {
  const { onDragChange, children } = props;

  return (
    <div
      style={{ cursor: 'move', margin: '-16px -24px', padding: '12px 20px' }}
      onMouseOver={() => onDragChange(true)}
      onMouseOut={() => onDragChange(false)}
    >
      <div
        style={{ display: 'inline-block', padding: 4, cursor: 'auto' }}
        onMouseOver={(e) => e.stopPropagation()}
        onMouseOut={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseDragTitle;
