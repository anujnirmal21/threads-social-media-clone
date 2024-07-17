import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import useShowToast from "./useShowToast";
import { useState } from "react";
import axios from "axios";

export default function useFollowUnfollow(user, isFollowing, setIsFollowing) {
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

  const setFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to continue", "error");
      return;
    }
    if (!updating) {
      setUpdating(true);
    }
    try {
      const res = await axios.post(`/api/v1/user/follow/${user._id}`);
      const result = res.data;
      setIsFollowing(!isFollowing);
      if (isFollowing) {
        user.followers = user.followers.filter(
          (followerId) => followerId !== currentUser._id
        );
      } else {
        user.followers.push(currentUser._id);
      }
      showToast(result.message, "", "success");
    } catch (error) {
      const result = error.response;
      showToast(
        "Error",
        result?.data.message || "Something went wrong.",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  return { setFollowUnfollow, updating };
}
