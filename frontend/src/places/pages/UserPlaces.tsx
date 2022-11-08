import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList  from "../components/PlaceList";
import { PlaceProps } from "../interfaces/PlaceProps";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState<PlaceProps[]>([]);
  const { clearError, sendRequest, error, isLoading } = useHttpClient();

  const userId = useParams().userId; //useParams gets dynamic parameters from the url

  useEffect(() => {
    const fetchPlaces = async () => {
      const places = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
      );
      
      setLoadedPlaces(places.places);
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (placeId: string) => {
    setLoadedPlaces(loadedPlaces.filter(place => place.id !== placeId));
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading ? (
        <PlaceList items={loadedPlaces} deletePlaceHandler={deletePlaceHandler} />
      ) : (
        <LoadingSpinner asOverlay />
      )}
    </Fragment>
  );
};

export default UserPlaces;