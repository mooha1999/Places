import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "shared/components/FormElements/Button";
import Input from "shared/components/FormElements/Input";
import Card from "shared/components/UIElements/Card";
import { useForm } from "shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "shared/util/validators";

import "./PlaceForm.css";
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world man!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const [isLoading, setLoading] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeIdentifier = DUMMY_PLACES.find((p) => p.id === placeId);
  useEffect(() => {
    if (!placeIdentifier) return;
    setFormData(
      {
        title: {
          value: placeIdentifier.title,
          isValid: true,
        },
        description: {
          value: placeIdentifier.description,
          isValid: true,
        },
      },
      true
    );
    setLoading(false);
  }, [setFormData, placeIdentifier]);
  if (!placeIdentifier)
    return (
      <div className="center">
        <Card>
          <h2>could not find place</h2>
        </Card>
      </div>
    );

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };
  return isLoading ? (
    <div className="center">
      <h2>Loading...</h2>
    </div>
  ) : (
    <form className="place-form" onSubmit={submitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please provide a valid title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="field"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please provide a valid description (minimum 5 letters)"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Update Place
      </Button>
    </form>
  );
};

export default UpdatePlace;
