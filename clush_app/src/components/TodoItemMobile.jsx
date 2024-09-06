import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useTodo } from "./TodoContext";

const ItemType = "TODO_ITEM";

function TodoItemMobile({ todo, index }) {
  // 컨텍스트 사용
  const { toggleTodo, deleteTodo, moveTodo } = useTodo();

  const ref = useRef(null);
  const [touchStartTime, setTouchStartTime] = useState(0);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // 현재 드래그 중인 항목이 자신과 동일할 경우 아무 작업도 하지 않음
      if (dragIndex === hoverIndex) {
        return;
      }

      // 현재 항목의 위치와 크기 계산
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 드래그 항목이 호버 항목의 상단 또는 하단을 지나면 항목을 이동
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
    // 빈 이미지로 드래그 상태 유지
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // 드래그 및 드롭 참조 설정
  drag(drop(ref));

  const opacity = dragging ? 0.4 : 1;

  // 터치 시작 시 두 번 탭을 감지하여 삭제 처리
  const handleTouchStart = (e) => {
    const currentTime = new Date().getTime();
    if (currentTime - touchStartTime < 300) {
      // 300ms 내에 두 번 탭 감지 시 삭제 처리
      deleteTodo(index);
    }
    setTouchStartTime(currentTime);
  };

  return (
    <li
      ref={ref}
      style={{
        opacity,
        textDecoration: todo.completed ? "line-through" : "none",
        cursor: "move",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "4px",
        backgroundColor: "#fff",
        touchAction: "none", // 기본 터치 동작 방지
      }}
      onClick={() => toggleTodo(index)} // 클릭 시 todo 상태 토글
      onTouchStart={handleTouchStart} // 터치 시작 시 두 번 탭 감지
      data-handler-id={handlerId} // 드래그 핸들러 ID 설정
    >
      {todo.text}
    </li>
  );
}

export default TodoItemMobile;
