import { Modal } from "./Modal";
import Button from "../FormElements/Button";
import { MouseEventHandler } from "react";

interface Props {
  onClear: MouseEventHandler;
  error: any;
}

const ErrorModal = (props: Props) => {
  return (
    <Modal
      onCancel={props.onClear}
      show={!!props.error}
      rest={{
        header: "An Error Occurred!",
        footer: <Button onClick={props.onClear}>Okay</Button>,
      }}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
