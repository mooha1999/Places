import { Fragment, useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { Map } from "../../shared/components/UIElements/Map";
import { Modal } from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { PlaceProps } from "../interfaces/PlaceProps";

import "./PlaceItem.css";

interface Props extends PlaceProps{
  onDelete: (placeId: string) => void;
}

export const PlaceItem = (props: Props) => {
  
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const {clearError, error, isLoading, sendRequest} = useHttpClient();

  const auth = useContext(AuthContext);

  const toggleMap = () => setShowMap(!showMap);

  const toggleDelete = () => setShowDelete(!showDelete);


  const deletePlace = async () => {
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,'DELETE', undefined,
      {
        authorization: 'Bearer ' + auth.token
      }
    );
    props.onDelete(props.id);
  }
  
  return (
    <Fragment>
      <Modal
        show={showMap}
        onCancel={toggleMap}
        rest={{
          header: props.address,
          contentClass: "place-item__content",
          footerClass: "place-item__actions",
          footer: <Button onClick={toggleMap}>Close</Button>,
        }}
      >
        <div className="map-container">
          <Map zoom={8} center={props.location} />
        </div>
      </Modal>
      <Modal
        show={showDelete}
        onCancel={toggleDelete}
        rest={{
          header: "Are you sure?",
          footer: (
            <Fragment>
              <Button inverse onClick={toggleDelete}>
                Cancel
              </Button>
              <Button danger onClick={deletePlace}>
                Delete
              </Button>
            </Fragment>
          ),
        }}
      >
        <Fragment>
          <ErrorModal error={error} onClear={clearError} />
          {isLoading && <LoadingSpinner asOverlay/>} 
          <p>Do you want to proceed? Once deleted it cannot be undone</p>
        </Fragment>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_BACKEND_ASSET}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={toggleMap}>
              View on Map
            </Button>
            {auth.isLoggedIn && auth.userId === props.creator && (
              <Fragment>
                <Button to={`/places/${props.id}`}>Edit</Button>
                <Button danger onClick={toggleDelete}>
                  Delete
                </Button>
              </Fragment>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};
