"use client";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import useImgPreview from "../hooks/useImgPreview";

export default function ProfileUpdatePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const { imgUrl, handleImg } = useImgPreview();
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState({
    profilePhoto: user.profilePhoto,
    username: user.username,
    name: user.name,
    email: user.email,
    bio: user.bio,
    password: "",
  });

  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updating) {
      setUpdating(true);
    }
    try {
      const res = await axios.put("/api/v1/user/update", {
        ...data,
        profilePhoto: imgUrl,
      });
      const result = res.data;
      localStorage.setItem("user", JSON.stringify(result.data));
      setUser(result.data);
      showToast(result.message, "", "success");
    } catch (error) {
      const result = error.response;
      showToast(
        "Error",
        result.data.message || "Something went Wrong.",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl ? imgUrl : data.profilePhoto}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input type="file" hidden ref={fileRef} onChange={handleImg} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>username</FormLabel>
            <Input
              placeholder="username"
              value={data.username}
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => {
                setData({ ...data, username: e.target.value });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="FullName"
              value={data.name}
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={data.email}
              _placeholder={{ color: "gray.500" }}
              type="email"
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="your bio."
              value={data.bio}
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => {
                setData({ ...data, bio: e.target.value });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={() => setData(user)}
            >
              Reset
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
