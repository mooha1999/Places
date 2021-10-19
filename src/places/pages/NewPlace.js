import React from "react";
import Button from "shared/components/FormElements/Button";
import Input from "shared/components/FormElements/Input";
import { useForm } from "shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "shared/util/validators";
import "./PlaceForm.css";

const NewPlace = () => {

  const [formSate,inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formSate.inputs); //send this to backend
  };

  return (
    <form className="place-form" onSubmit={submitHandler}>
      <Input
        id="title"
        onInput={inputHandler}
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
      />
      <Input
        id="description"
        onInput={inputHandler}
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (Minimum 5 characters)."
      />
      <Input
        id="address"
        onInput={inputHandler}
        element="input"
        type="text"
        label="Address"
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
