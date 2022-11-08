import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { PlaceProps } from "../interfaces/PlaceProps";
import { PlaceItem } from "./PlaceItem";

import "./PlaceList.css";

const PlaceList = (props: {
  items: PlaceProps[];
  deletePlaceHandler: (placeId: string) => void;
}) => {
  if (props.items.length === 0) {
    return (
      <div className="center place-list">
        <Card>
          <h2>No places found, Maybe create one</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          {...place}
          onDelete={props.deletePlaceHandler}
        />
      ))}
    </ul>
  );
};
export default PlaceList;