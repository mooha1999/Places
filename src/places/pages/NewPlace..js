import React, { useCallback, useReducer } from "react";
import Button from "shared/components/FormElements/Button";
import Input from "shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "shared/util/validators";
import "./NewPlace.css";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in action.inputs) {
        if (inputId === action.inputId)
          formIsValid = formIsValid && action.isValid;
        else formIsValid = formIsValid && state.inputs[inputId].isValid;
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    default:
      return state;
  }
};

const NewPlace = () => {
  const [formSate, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    isValid: false,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  return (
    <form className="place-form">
      <Input
        id="Title"
        onInput={inputHandler}
        element="input"
        type="text"
        placeholder="Title"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
      />
      <Input
        id="description"
        onInput={inputHandler}
        element="textarea"
        type="text"
        placeholder="Description"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (Minimum 5 characters)."
      />
      <Button type="submit" disabled={!formSate.isValid}>
        Add Place
      </Button>
    </form>
  );
};

export default NewPlace;
