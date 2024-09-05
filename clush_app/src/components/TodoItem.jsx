import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "TODO_ITEM";

function TodoItem({ todo, index, moveTodo, toggleTodo, updateTodoText, deleteTodo }) {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [text, setText] = useState(todo.text); // 입력 텍스트 상태
  const inputRef = useRef(null); // 입력 필드 참조

  // Drag and Drop 설정
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  // 수정 모드 종료 및 입력값 저장
  const handleBlur = () => {
    if (text.trim() !== '') {
      // 수정 내용 반영
      updateTodoText(index, text);
    } else {
      // 텍스트가 없으면 삭제
      deleteTodo(index);
    }
    setIsEditing(false);
  };

  // Enter 키를 눌렀을 때 수정 모드 종료 및 입력값 저장
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  // 마우스 우클릭 시 수정 모드로 전환
  const handleContextMenu = (e) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지
    setIsEditing(true); // 수정 모드로 전환
    inputRef.current?.focus(); // 입력 필드 포커스
  };

  // 클릭 시 completed 상태 변경
  const handleClick = () => {
    if (!isEditing) {
      toggleTodo(index); // completed 상태 토글
    }
  };

  return (
    <li
      className="no-swiping"
      ref={(node) => drag(drop(node))}
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.preventDefault();
        deleteTodo(index);
      }}
      onContextMenu={handleContextMenu}
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
        cursor: isDragging ? "grabbing" : "pointer",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "4px",
        backgroundColor: "#fff",
        opacity: isDragging ? 0.3 : 1,
        transform: isDragging ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.5s ease, opacity 0.5s ease",
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        todo.text
      )}
    </li>
  );
}

export default TodoItem;
