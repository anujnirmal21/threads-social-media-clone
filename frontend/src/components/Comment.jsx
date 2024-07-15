import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

export default function Comment({ text, username, userProfilePhoto }) {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={userProfilePhoto} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {username}
            </Text>
          </Flex>
          <Text>{text}</Text>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
}
