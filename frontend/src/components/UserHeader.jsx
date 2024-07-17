import { useState } from "react";
import { VStack, Box, Flex, Avatar, Text, Link } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Button,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { Link as RouteLink } from "react-router-dom";
import axios from "axios";

export default function UserHeader({ user }) {
  const currentUser = useRecoilValue(userAtom); //logged user
  const [isFollowing, setIsFollowing] = useState(
    currentUser !== null ? user.followers.includes(currentUser._id) : false
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
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
        user.followers.pop();
      } else {
        user.followers.push(currentUser._id);
      }
      showToast(result.message, "", "success");
    } catch (error) {
      const result = error.response;
      showToast("Error", result.data.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const getCopyLink = () => {
    const link = window.location.href;
    // console.log(link);
    navigator.clipboard
      .writeText(link)
      .then(() => showToast(`Profile link copied.`, "", "success"));
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex alignItems={"center"} gap={2}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xm"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={2}
              borderRadius={"full"}
            >
              thread.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePhoto ? (
            <Avatar
              name={user.name}
              src={user.profilePhoto}
              size={{
                base: "lg",
                md: "xl",
              }}
            />
          ) : (
            <Avatar
              name={user.name}
              src="/default-avatar.jpg"
              size={{
                base: "lg",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser?._id === user._id ? (
        <RouteLink to="/update">
          <Button isLoading={updating}>Update Profile</Button>
        </RouteLink>
      ) : (
        <Button onClick={handleFollowUnfollow} isLoading={updating}>
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container ">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container ">
            <Menu>
              <MenuButton>
                {" "}
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={getCopyLink}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}
