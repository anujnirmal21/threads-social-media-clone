import { useEffect } from "react";
import { useState } from "react";
import useShowToast from "./useShowToast";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";

export default function useLoggedInUser() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const { username } = useRecoilValue(userAtom);
  const showToast = useShowToast();

  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/v1/user/profile/${username}`);
        const result = res.data;
        setUser(result.data);
      } catch (error) {
        const result = error.response;
        showToast(
          "Error",
          result?.data.message || "Something went Wrong.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { loading, user };
}
