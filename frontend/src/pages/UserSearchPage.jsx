import {
  FormControl,
  Input,
  IconButton,
  Flex,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import UserCard from "../components/UserCard";
import { useState, useCallback } from "react";

import _ from "lodash";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

const UserSearchPage = () => {
  const [searchedProfiles, setSearchedProfiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();

  const handleSearch = async (value) => {
    setLoading(true);
    if (!value) {
      setSearchedProfiles(null);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`/api/v1/user/search/${value}`);
      const result = res.data;
      setSearchedProfiles(result.data);
    } catch (error) {
      const result = error.response;
      showToast("", result.data.message || "Something went Wrong.", "info");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(_.debounce(handleSearch, 300), []);

  const handleChange = (e) => {
    const { value } = e.target;
    debouncedSearch(value);
  };

  // if (searchedProfiles) {
  //   console.log(searchedProfiles);
  // }

  return (
    <Flex flexDir={"column"} gap={"50px"}>
      <Flex className="flex items-center max-w-lg mx-auto" alignItems="center">
        <FormControl id="search" className="flex items-center">
          <Box position="relative" w="full">
            <Input
              type="text"
              placeholder=" Search by Username..."
              pl="12"
              bg="gray.100"
              borderColor="gray.300"
              textColor="gray.900"
              _placeholder={{ color: "gray.700" }}
              _focus={{ ring: "blue.500", borderColor: "blue.500" }}
              className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleChange}
            />
            <IconButton
              aria-label=" search button"
              icon={<SearchIcon />}
              position="absolute"
              left="2"
              top="50%"
              transform="translateY(-50%)"
              bg="transparent"
              color={"black"}
              border="none"
              zIndex={1}
            />
          </Box>
        </FormControl>
      </Flex>
      {loading && (
        <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
          <Spinner size="xl" />
        </Flex>
      )}
      {searchedProfiles &&
        searchedProfiles.map((user) => {
          return <UserCard key={user._id} user={user} />;
        })}
    </Flex>
  );
};

export default UserSearchPage;
