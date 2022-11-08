import { useEffect, useReducer } from "react";
import { validate } from "../../util/validators";

import Element from "./Element";
import "./Input.css";

//This component is hard to read I know so here are some comments to help
//This component is used as a flexible input
//The InputProps interface is exported because it is also used in the Element component
//The function inputReducer is called when dispatch is called with the action passed to dispatch

export interface InputProps {
  rows?: number;
  element: "input" | "textarea";
  id: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  label?: React.ReactNode;
  errorText?: string;
  validators?: { type: string; val?: number }[];
  onInput?: (id: string, value: string, isValid: boolean) => void;
  valid?: boolean
}

interface Action {
  type: string;
  val?: string;
  validators?: {
    type: string;
    val?: number;
  }[];
}

interface State {
  value?: string;
  isTouched?: boolean;
  isValid?: boolean;
}

const inputReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CHANGE":
      if (!action.validators) throw new Error();
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val || "", action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props: InputProps) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isTouched: false,
    isValid: props.valid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(
    () => (onInput ? onInput(id, value || "", isValid || false) : undefined),
    [id, value, isValid, onInput]
  );

  const changeHandler = (event: React.ChangeEvent) => {
    dispatch({
      type: "CHANGE",
      val: (event.target as HTMLTextAreaElement | HTMLInputElement).value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const isWrongInput = !inputState.isValid && inputState.isTouched;

  return (
    <div className={`form-control ${isWrongInput && "form-control--invalid"}`}>
      <label htmlFor={props.id}>{props.label}</label>
      <Element
        blurHandler={touchHandler}
        changeHandler={changeHandler}
        element={props.element}
        id={props.id}
        value={value}
        placeholder={props.placeholder}
        type={props.type}
      />
      {isWrongInput && <p>{props.errorText}</p>}
    </div>
  );
};
export default Input