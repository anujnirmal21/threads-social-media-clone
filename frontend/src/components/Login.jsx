import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";

export default function Login({ setAuthToggle, authToggle }) {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const [updating, setUpdating] = useState(false);

  const handleLogin = async () => {
    if (!updating) {
      setUpdating(true);
    }
    try {
      const res = await axios.post("/api/v1/user/login", data);
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
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                onChange={(e) => {
                  setData({ ...data, username: e.target.value });
                }}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Login"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleLogin}
                isLoading={updating}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Link
                  onClick={() => setAuthToggle(!authToggle)}
                  color={"blue.400"}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
        <Stack pt={6} align={"center"} fontSize={"2xl"}>
          <Text>Demo Credentials</Text>
          <Text>Username: anuj</Text>
          <Text>Password: 123456</Text>
        </Stack>
      </Stack>
    </Flex>
  );
}
