import { Link } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import UserProps from "../interfaces/UserProps";
import "./UserItem.css";
const UserItem = (props: UserProps) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={`${process.env.REACT_APP_BACKEND_ASSET}/${props.image}`} alt={props.name} width={""} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.places.length} Place{props.places.length === 1 ? "" : "s"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;