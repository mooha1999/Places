import { useCallback, useReducer } from "react";

export interface PlaceState {
  title: {
    value: string;
    isValid: boolean;
  };
  description: {
    value: string;
    isValid: boolean;
  };
  address?: {
    value: string;
    isValid: boolean;
  };
  placeImage?: {
    value: File | null;
    isValid: boolean;
  }
}

export interface UserState {
  email: {
    value: string;
    isValid: boolean;
  };
  password: {
    value: string;
    isValid: boolean;
  };
  name?: {
    value: string;
    isValid: boolean;
  };
  image?: {
    value: File | null;
    isValid: boolean;
  }
}

export interface FormState {
  inputs: PlaceState | UserState;
  isValid: boolean;
}

interface Action {
  value?: string | File;
  type: "INPUT_CHANGE" | "SET_DATA";
  inputId?: string;
  isValid?: boolean;
  state?: FormState;
}

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      let formIsVaild = true;
      for (const inputId in state.inputs) {
        if(!state.inputs[inputId as keyof typeof state.inputs])
          continue;
        if (inputId === action.inputId)
          formIsVaild = (formIsVaild && action.isValid) || false;
        else {
          formIsVaild =
            (formIsVaild &&
              state.inputs[inputId as keyof typeof state.inputs]["isValid"]) ||
            false;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId as keyof typeof state.inputs]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsVaild,
      };
    }
    case "SET_DATA": {
      if (!action.state) throw new Error("Must provide inputs");
      return {
        inputs: action.state.inputs,
        isValid: action.state.isValid,
      };
    }
    default:
      return state;
  }
};

export const useForm = (initialState: FormState) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  const inputHandler = useCallback(
    (id: string, value: string | File, isValid: boolean) => {
      dispatch({
        inputId: id,
        isValid,
        type: "INPUT_CHANGE",
        value,
      });
    },
    []
  );

  const setFormData = useCallback((state: FormState) => {
    dispatch({
      type: "SET_DATA",
      state,
    });
  }, []);

  return { formState, inputHandler, setFormData };
};
