import { PlaceState, useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./NewPlace.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Fragment, useContext } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const { error, isLoading, clearError, sendRequest } = useHttpClient();

  const auth = useContext(AuthContext);

  const { formState, inputHandler } = useForm({
    inputs: {
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
      placeImage: {
        value: null,
        isValid: false
      }
    },
    isValid: false,
  });

  const navigate = useNavigate();

  const placeSubmitHandler = async () => {
    const { title, description, address, placeImage } = formState.inputs as PlaceState;
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('address', address?.value as string);
    formData.append('image', placeImage?.value as File);
    formData.append('creator', auth.userId as string);
    
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          authorization: 'Beare '+ auth.token
        }
      );
      navigate("/");
    } catch (err: any) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          element="input"
          id="title"
          label="Title"
          errorText="Please enter a valid title"
          validators={[VALIDATOR_REQUIRE()]}
          placeholder="Title"
          onInput={inputHandler}
        />
        <Input
          element="textarea"
          id="description"
          label="Description"
          placeholder="Description"
          errorText="Please enter a valid description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="address"
          label="Address"
          errorText="Please enter a valid address"
          validators={[VALIDATOR_REQUIRE()]}
          placeholder="Address"
          onInput={inputHandler}
        />
        <ImageUpload
          id="placeImage"
          onInput={inputHandler}
          center
          errorText="Please provide an image"
        />
        <Button type="button" disabled={!formState.isValid} onClick={placeSubmitHandler}>
          Add Place
        </Button>
      </form>
    </Fragment>
  );
};

export default NewPlace;
