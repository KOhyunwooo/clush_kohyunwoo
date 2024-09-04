import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
export default function MainComponent() {
  return (

    <App />

  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainComponent />);


