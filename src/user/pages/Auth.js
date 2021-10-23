import React, { useContext, useState } from "react";
import Button from "shared/components/FormElements/Button";
import Input from "shared/components/FormElements/Input";
import Card from "shared/components/UIElements/Card";
import { AuthContext } from "shared/context/auth-context";
import { useForm } from "shared/hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "shared/util/validators";

import "./Auth.css";

const Auth = () => {
  //States
  const [isLogin, setLogin] = useState(true);
  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false);

  //context
  const auth = useContext(AuthContext);

  //Handlers
  const authSubmitHandler = e => {
    e.preventDefault();
    console.log(formState.inputs);
    auth.login();
  }
  const switchHandler = () => {
    if (!isLogin) {
      setFormData({
        ...formState.inputs,
        name: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false);
    }
    setLogin(prevState => !prevState);
  }
  return (
    <Card className="authentication">
      <h2>{isLogin ? 'Login' : 'Sign up'}</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLogin &&
          <Input
            element="input"
            id="name"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please provid a name."
            onInput={inputHandler}
          />
        }
        <Input
          element="input"
          id="email"
          type="email"
          label="E-mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address"
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(8)]}
          errorText="Password should be at least 8 characters"
          onInput={inputHandler}
        />
        <Button
          type="submit"
          disabled={!formState.isValid}
        >
          Login
        </Button>
      </form>
      <Button
        inverse
        onClick={switchHandler}
      >
        {`Switch to ${isLogin ? 'Sign up' : 'Login'}`}
      </Button>
    </Card>
  );
};

export default Auth;
