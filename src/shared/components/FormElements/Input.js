import React, { useEffect, useReducer } from "react";
import "./Input.css";
import { validate } from "shared/util/validators";
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
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

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });
  /* 
    useReducer returns -> [The_new_state, setState(function)]
    useReducer takes -> (reducer function which contains all the logic and how to change the state depending on specific inputs
      , initial State)
  */
  const { id, onInput } = props;
  const { value, isValid } = inputState;
  const callBack = () => onInput(id, value, isValid);
  useEffect(callBack, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => dispatch({ type: "TOUCH" });

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler /*When focus is lost*/}
        value={value}
      />
    ) : (
      <textarea
        placeholder={props.placeholder}
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
