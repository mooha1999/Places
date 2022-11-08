import './Avatar.css';
interface Props {
  className?: any;
  style?: any;
  image: string | undefined;
  alt: string | undefined;
  width: any;

}
const Avatar = (props: Props) => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
