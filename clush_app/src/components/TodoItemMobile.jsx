import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

const ItemType = 'TODO_ITEM';

function TodoItemMobile({ todo, index, moveTodo, toggleTodo, deleteTodo }) {

  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveTodo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging: dragging }, drag, preview] = useDrag({
    type: ItemType,
    item: () => {
      return { id: todo.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  drag(drop(ref));

  const opacity = dragging ? 0.4 : 1;

  const handleTouchStart = (e) => {
    // e.preventDefault();
  };

  const handleDoubleClick = () => {
    deleteTodo(index);
  };

  return (
    <li
      ref={ref}
      style={{
        opacity,
        textDecoration: todo.completed ? 'line-through' : 'none',
        cursor: 'move',
        padding: '8px',
        border: '1px solid #ccc',
        marginBottom: '4px',
        backgroundColor: '#fff',
        touchAction: 'none',
      }}
      onClick={() => toggleTodo(index)}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
      data-handler-id={handlerId}
    >
      {todo.text}
    </li>
  );
}

export default TodoItemMobile;