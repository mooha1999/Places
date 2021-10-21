import React, { useState } from "react";

import Card from "shared/components/UIElements/Card";
import Button from "shared/components/FormElements/Button";
import Modal from "shared/components/UIElements/Modal";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal,setConfirmModal] = useState(false); 
  
  const openMapHanlder = () => setShowMap(true);
  const closeMapHanlder = () => setShowMap(false);
  const showConfirmModalHandler = () => setConfirmModal(true);
  const cancelConfirmModalHandler = () => setConfirmModal(false);
  const confirmDeleteHandler = () => {
    cancelConfirmModalHandler();
    console.log('Deleting');}

  const warningModalFooter = <React.Fragment>
    <Button inverse onClick={cancelConfirmModalHandler}>Cancel</Button>
    <Button danger onClick={confirmDeleteHandler}>Delete</Button>
  </React.Fragment>
  return (
    <React.Fragment>
      <Modal 
        show = {showMap}
        onCancel = {closeMapHanlder}
        header = {props.address}
        contentClass = "place-item__modal-content"
        footerClass = "place-item__modal-actions"
        footer = {<Button onClick = {closeMapHanlder}>Close</Button>}
      >
          <div className = "map-container">
              <h2>The Map</h2>
          </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelConfirmModalHandler} 
        header = "Are you sure?"
        footerClass = "place-item__modal-actions"
        footer={warningModalFooter}
        >
        <p>Once you delete this place, it cannot be undone!</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHanlder}>VIEW ON MAP</Button>
            <Button to={`/places/${props.id}`}>EDIT</Button>
            <Button danger onClick={showConfirmModalHandler}>DELETE</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};
export default PlaceItem;
