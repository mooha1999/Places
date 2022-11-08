import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "./ImageUpload.css";

interface Props {
  center?: boolean;
  id: string;
  onInput: (id: string, pickedFile: File, isValid: boolean) => void;
  errorText?: string;
}

const ImageUpload = (props: Props) => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickHandler = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    let pickedFile;
    let fileisValid = false;
    if (target.files?.length === 1) {
      pickedFile = target.files?.item(0);
      setFile(pickedFile as File);
      setIsValid(true);
      fileisValid = true;
    } else {
      setIsValid(false);
    }
    
    props.onInput(props.id, pickedFile as File, fileisValid);
  };

  const pickImageHandler = () => {
    (filePickerRef.current as HTMLInputElement).click();
  };

  return (
    <div className="form-control">
      <input
        type="file"
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <p>Please pick an image</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
