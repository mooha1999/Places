import { InputProps } from "./Input";

interface Props
  extends Pick<
    InputProps,
    "element" | "id" | "type" | "placeholder" | "value" | "rows"
  > {
  blurHandler?: React.FocusEventHandler;
  changeHandler?: React.ChangeEventHandler;
}

const Element = (props: Props) => {
  return props.element === "input" ? (
    <input
      id={props.id}
      type={props.type}
      placeholder={props.placeholder}
      onBlur={props.blurHandler}
      onChange={props.changeHandler}
      value={props.value}
    />
  ) : (
    <textarea
      id={props.id}
      rows={props.rows || 3}
      onBlur={props.blurHandler}
      onChange={props.changeHandler}
      value={props.value}
    />
  );
};
export default Element;