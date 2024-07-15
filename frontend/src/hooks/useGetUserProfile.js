import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";
import axios from "axios";

export default function useGetUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
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
  }, [username]);

  return { loading, user };
}
