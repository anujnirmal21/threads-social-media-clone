import axios from "axios";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";

export default function HomePage() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/v1/post/feed");
        const result = res.data;
        setPosts(result.data);
      } catch (error) {
        const result = error.response;
        showToast(
          "Error",
          result.data.message || "Something went Wrong.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (!posts && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <Text mt={"10vh"} fontSize={"medium"}>
        Please follow some users to get the feed.
      </Text>
    );
  }
  return (
    <>
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
}
