import Toast from "react-native-toast-message";

export const toastSuccess = (title, msg = "") => {
  Toast.show({
    type: "success",
    text1: title,
    text2: msg,
    position: "top",
  });
};

export const toastError = (title, msg = "") => {
  Toast.show({
    type: "error",
    text1: title,
    text2: msg,
    position: "top",
  
  });
};

export const toastInfo = (title, msg = "") => {
  Toast.show({
    type: "info",
    text1: title,
    text2: msg,
    position: "top",
  });
};
