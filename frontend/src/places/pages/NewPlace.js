import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value); // Assuming image is a file input

      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/places`, "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      navigate("/"); // Redirect to the home page after successful submission
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={formSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)"
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid description (at least 5 characters)"
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
          center
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
