export interface PlaceProps {
  id: string,
  image: string,
  title: string,
  description: string,
  address: string,
  creator: string,
  location: {
    lat: number,
    lng: number
  },
}