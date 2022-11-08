import { Fragment } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import { Backdrop } from "./Backdrop";

import "./Modal.css";

interface ModalOverLayProps {
  className?: string;
  style?: React.CSSProperties;
  headerClass?: string;
  header?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  contentClass?: string;
  children?: React.ReactNode;
  footerClass?: string;
  footer?: React.ReactNode;
}

const ModalOverlay = (props: ModalOverLayProps) => {
  //What is actually displayed over the screen

  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
      </form>
      <footer className={`modal__footer ${props.footerClass}`}>
        {props.footer}
      </footer>
    </div>
  );

  return createPortal(
    content,
    document.getElementById("modal-hook") as Element
  );
};

interface Props {
  show: boolean;
  onCancel: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: React.ReactNode;
  rest?: ModalOverLayProps;
}

export const Modal = (props: Props) => (
  <Fragment>
    {props.show && <Backdrop onClick={props.onCancel} />}
    <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={200}
      classNames="modal"
      addEndListener={undefined}
    >
      <ModalOverlay {...props.rest}>{props.children}</ModalOverlay>
    </CSSTransition>
  </Fragment>
);
