import { FocusScope, useFocusManager } from "./FocusScope/FocusScope.jsx";
import "./styles.css";

function Toolbar(props) {
  return (
    <div role="toolbar">
      <FocusScope>{props.children}</FocusScope>
    </div>
  );
}

function ToolbarButton(props) {
  let focusManager = useFocusManager();
  let onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowRight":
        focusManager.focusNext({ wrap: true });
        break;
      case "ArrowLeft":
        focusManager.focusPrevious({ wrap: true });
        break;
      default:
        break;
    }
  };

  return <button onKeyDown={onKeyDown}>{props.children}</button>;
}

export default function App() {
  return (
    <Toolbar>
      <ToolbarButton>Cut</ToolbarButton>
      <ToolbarButton>Copy</ToolbarButton>
      <ToolbarButton>Paste</ToolbarButton>
    </Toolbar>
  );
}
