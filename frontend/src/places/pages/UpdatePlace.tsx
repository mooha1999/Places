import { useNavigate, useParams } from "react-router-dom";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./NewPlace.css";
import { PlaceProps } from "../interfaces/PlaceProps";
import Input  from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { PlaceState, useForm } from "../../shared/hooks/form-hook";
import { Fragment, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  
  const [currentPlace, setCurrentPlace] = useState<PlaceProps>();

  const auth = useContext(AuthContext);

  const { placeId } = useParams(); //.placeId;

  const { clearError, error, isLoading, sendRequest } = useHttpClient();

  const { formState, inputHandler, setFormData } = useForm({
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlace = async () => {
      const place = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
      );
      setCurrentPlace(place);
      setFormData({
        inputs: {
          title: {
            value: currentPlace?.title || "",
            isValid: true,
          },
          description: {
            value: currentPlace?.description || "",
            isValid: true,
          },
        },
        isValid: true,
      });
    };
    fetchPlace();
  },[]);

  if (!currentPlace)
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );

  const onClickHandler = async () => {
    const { title, description } = formState.inputs as PlaceState;
    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/places/${currentPlace.id}`,
      "PATCH",
      JSON.stringify({
        title: title.value,
        description: description.value,
      }),
      {
        "Content-Type": "application/json",
        authorization: 'Bearer ' + auth.token,
      }
    );
    navigate(`/${currentPlace.creator}/places`);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form">
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Plese enter a valid title."
          onInput={inputHandler}
          value={currentPlace.title}
          valid={true}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText="Plese enter a valid description."
          onInput={inputHandler}
          value={currentPlace.description}
          valid={true}
        />
        <Button
          type="button"
          disabled={!formState.isValid}
          onClick={onClickHandler}
        >
          Update Place
        </Button>
      </form>
    </Fragment>
  );
};

export default UpdatePlace;