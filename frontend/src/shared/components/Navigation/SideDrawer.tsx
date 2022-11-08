import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

export const SideDrawer = (props: {
  onClick: React.MouseEventHandler<HTMLElement>;
  children: JSX.Element | JSX.Element[];
  show: boolean;
  
}) => {
  const content = (
    <CSSTransition
      in={props.show}
      addEndListener={()=>{}}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("drawer-hook") as Element
  );
};
