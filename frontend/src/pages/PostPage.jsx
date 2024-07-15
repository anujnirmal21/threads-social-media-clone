import { useState, useEffect } from "react";
import {
  Avatar,
  Flex,
  Text,
  Box,
  Image,
  Divider,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { userAtom } from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilValue } from "recoil";

export default function PostPage() {
  const [post, setPost] = useState(null);
  const { pid } = useParams();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const curr_user = useRecoilValue(userAtom);
  const { user, loading } = useGetUserProfile();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/v1/post/${pid}`);
        const result = res.data;
        setPost(result.data);
      } catch (error) {
        const result = error.response;
        showToast(
          "Error",
          result.data.message || "Something went Wrong.",
          "error"
        );
      }
    };
    fetchPost();
  }, [pid]);

  if (!post) {
    return null;
  }
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await axios.delete(`/api/v1/post/${pid}`);
      const result = res.data;
      showToast(result.message, "", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      const result = error.response;
      showToast(
        "Error",
        result.data.message || "Something went Wrong.",
        "error"
      );
    }
  };

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePhoto} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"sm"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          {curr_user._id === post.postedBy && (
            <Box onClick={(e) => e.preventDefault()}>
              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={handleDelete}>
                      <DeleteIcon />
                      <Text ml={2}>Delete</Text>
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          )}
        </Flex>
      </Flex>
      <Text my={3}>{post.postText}</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        {post.postImage ? <Image src={post.postImage} w={"full"} /> : <></>}
      </Box>

      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {post.replies.map((reply) => (
        <Comment
          key={reply.userId}
          text={reply.text[0]}
          username={reply.username}
          userProfilePhoto={reply.userProfilePhoto}
        />
      ))}
    </>
  );
}
