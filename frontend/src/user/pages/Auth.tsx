import { Fragment, useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { FormState, useForm, UserState } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { formState, inputHandler, setFormData } = useForm({
    inputs: {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    isValid: false,
  });

  const toggleLoggingIn = () => {
    const state: FormState = !isLoggingIn
      ? {
          inputs: {
            ...formState.inputs,
            name: undefined,
            image: undefined,
          },
          isValid:
            (formState.inputs as UserState).email.isValid &&
            (formState.inputs as UserState).password.isValid,
        }
      : {
          inputs: {
            ...formState.inputs,
            name: {
              value: "",
              isValid: false,
            },
            image: {
              value: null,
              isValid: false,
            },
          },
          isValid: false,
        };
    setFormData(state);
    setIsLoggingIn(!isLoggingIn);
  };

  const authSubmitHandler = async () => {
    const { email, password, name, image } = formState.inputs as UserState;

    const path = isLoggingIn ? "login" : "signup";
    try {
      const formData = new FormData();
      formData.append("email", email.value);
      formData.append("password", password.value);
      if (!isLoggingIn) {
        formData.append("name", name?.value as string);
        formData.append("image", image?.value as File);
      }
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${path}`,
        "POST",
        formData
      );

      auth.login(responseData.userId, responseData.token);
    } catch (err: any) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="place-form" style={{ textAlign: "center" }}>
        {isLoading && <LoadingSpinner asOverlay />}
        <form style={{ margin: "10px 0px" }}>
          <h2>Login required</h2>
          <hr />
          {!isLoggingIn && (
            <Fragment>
              <Input
                id="name"
                element="input"
                label="Name"
                validators={[VALIDATOR_REQUIRE()]}
                placeholder="name"
                type="text"
                errorText="Please enter a valid name"
                onInput={inputHandler}
              />
              <ImageUpload id="image" center onInput={inputHandler} />
            </Fragment>
          )}
          <Input
            id="email"
            element="input"
            label="Email"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            placeholder="email"
            type="email"
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            label="password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            placeholder="password"
            type="password"
            errorText="Please enter a valid password (6 characters minimum)"
            onInput={inputHandler}
          />
          <Button
            onClick={authSubmitHandler}
            type="button"
            disabled={!formState.isValid}
          >
            {isLoggingIn ? "Login" : "Signup"}
          </Button>
        </form>
        <Button inverse onClick={toggleLoggingIn}>
          Switch to {!isLoggingIn ? "Login" : "Signup"}
        </Button>
      </div>
    </Fragment>
  );
};
export default Auth;
