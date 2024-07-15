import { useState } from "react";
import useShowToast from "./useShowToast";

export default function useImgPreview() {
  const showToast = useShowToast();
  const [imgUrl, setImgUrl] = useState(null);
  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const read = new FileReader();
      read.onloadend = () => {
        setImgUrl(read.result);
      };

      read.readAsDataURL(file);
    } else {
      showToast("Error", "Invalid file type ", "error");
      setImgUrl(null);
    }
  };

  return { imgUrl, handleImg, setImgUrl };
}
