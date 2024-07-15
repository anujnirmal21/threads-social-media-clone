import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flex,
  Avatar,
  Box,
  Text,
  Image,
  Menu,
  MenuButton,
  Portal,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { GoCopy } from "react-icons/go";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";

export default function Post({ post, postedBy }) {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const curr_user = useRecoilValue(userAtom);
  const [newPost, setnewPost] = useRecoilState(postAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/v1/user/profile/${postedBy}`);
        const result = res.data;
        setUser(result.data);
      } catch (error) {
        const result = error.response;
        showToast(
          "Error",
          result?.data.message || "Something went Wrong.",
          "error"
        );
      }
    };
    fetchUser();
  }, [postedBy]);

  const getCopyLink = (e) => {
    e.preventDefault();
    const link = `${window.location.href}${user.username}/post/${post._id}`;
    console.log(link);
    navigator.clipboard
      .writeText(link)
      .then(() => showToast(`Post link copied.`, "", "success"));
  };

  const handleDelete = async (e) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    e.preventDefault();
    try {
      const res = await axios.delete(`/api/v1/post/${post._id}`);
      const result = res.data;
      showToast(result.message, "", "success");
      setnewPost(newPost.filter((p) => p._id !== post._id));
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
    <Link to={`/${user.username}/post/${post._id}`}>
      {/* column 1 */}

      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user.name}
            src={user.profilePhoto}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <></>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                name={post.replies[0].username}
                src={post.replies[0].userProfilePhoto}
                position={"absolute"}
                top={"0px"}
                left={"25px"}
                p={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                name={user.name}
                src={post.replies[1].userProfilePhoto}
                position={"absolute"}
                top={"0px"}
                left={"-1px"}
                p={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size={"xs"}
                name={user.name}
                src={post.replies[2].userProfilePhoto}
                position={"absolute"}
                top={"-15px"}
                left={"10px"}
                p={"2px"}
              />
            )}
          </Box>
        </Flex>

        {/* column 2 */}
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex
              w={"full"}
              alignItems={"center"}
              onClick={(e) => {
                e.preventDefault();

                navigate(`/${user?.username}`);
              }}
            >
              <Text fontSize={"small"} fontWeight={"bold"}>
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
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
              <Box onClick={(e) => e.preventDefault()}>
                <Menu>
                  <MenuButton>
                    <BsThreeDots />
                  </MenuButton>
                  <Portal>
                    <MenuList bg={"gray.dark"}>
                      <MenuItem bg={"gray.dark"} onClick={getCopyLink}>
                        <GoCopy />
                        <Text ml={2}>Copy link</Text>
                      </MenuItem>
                      {curr_user._id === post.postedBy && (
                        <MenuItem bg={"gray.dark"} onClick={handleDelete}>
                          <DeleteIcon />
                          <Text ml={2}>Delete</Text>
                        </MenuItem>
                      )}
                    </MenuList>
                  </Portal>
                </Menu>
              </Box>
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.postText}</Text>
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid gray.light"}
          >
            <Image src={post.postImage} width={"full"} />
          </Box>
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}
