import { Avatar, Box, Flex, Button, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

export default function UserCard({ user }) {
  const navigate = useNavigate();
  const { user: curr_user } = useLoggedInUser();
  const [following, setFollowing] = useState(false);
  const { setFollowUnfollow, updating } = useFollowUnfollow(
    user,
    following,
    setFollowing
  );

  useEffect(() => {
    if (curr_user?.following?.includes(user._id)) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [curr_user, user._id]);

  const handleClick = (e) => {
    e.preventDefault();
    setFollowUnfollow();
  };

  return (
    <Flex
      gap={2}
      justifyContent={"space-between"}
      alignItems={"center"}
      border={"1px"}
      borderColor={"gray.900"}
      borderRadius={5}
      p={2}
    >
      {/* left side */}
      <Flex gap={4} onClick={() => navigate(`/${user.username}`)}>
        <Avatar name={user.name} src={user.profilePhoto} />
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
      </Flex>
      {/* right side */}
      <Button
        onClick={handleClick}
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        _hover={{
          color: following ? "black" : "white",
          opacity: ".8",
        }}
        isLoading={updating}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
}
