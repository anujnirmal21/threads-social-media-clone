import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { Spinner, Flex } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import CreatePostButton from "../components/CreatePostButton";

export default function UserPage() {
  const [userPosts, setUserPosts] = useRecoilState(postAtom);
  const { username } = useParams();
  const [loadingPost, setLoadingPost] = useState(false);
  const { loading, user } = useGetUserProfile();

  const showToast = useShowToast();
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoadingPost(true);
      try {
        const res = await axios.get(`/api/v1/post/user/${username}`);
        const result = res.data;
        setUserPosts(result.data);
      } catch (error) {
        const result = error.response;
        showToast(
          "Error",
          result.data.message || "Something went Wrong.",
          "error"
        );
      } finally {
        setLoadingPost(false);
      }
    };

    fetchUserPosts();
  }, [setUserPosts, username]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!user && !loading) {
    return <h1>User not found!</h1>;
  }

  if (userPosts === null) return null;

  return (
    <>
      <UserHeader user={user} />
      {!loadingPost && userPosts.length === 0 && (
        <h1>you have no posts to show.</h1>
      )}
      {loadingPost && (
        <Flex justifyContent={"center"} mt={5}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {userPosts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
      {user && <CreatePostButton />}
    </>
  );
}
