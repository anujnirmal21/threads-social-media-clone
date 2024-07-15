import { useState } from "react";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";

export default function useLogout() {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

  const logout = async () => {
    if (!updating) {
      setUpdating(true);
    }
    try {
      const res = await axios.post("/api/v1/user/logout");
      const result = res.data;
      showToast(result.message, "", "success");
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      const result = error.response;
      showToast(
        "Error",
        result.data.message || "Something went Wrong.",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };
  return { logout, updating };
}
