import ReactDOM from "react-dom";

import "./Backdrop.css";

export const Backdrop = (props: {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById("backdrop-hook") as Element
  );
};
