import { PlaceProps } from "../../places/interfaces/PlaceProps";

export default interface UserProps{
    id: string,
    image: string,
    name: string,
    places: PlaceProps[],
}