import { Flex, Image, useColorMode, Link, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { HiOutlineLogout } from "react-icons/hi";
import useLogout from "../hooks/useLogout";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const { logout, updating } = useLogout();

  return (
    <Flex justifyContent={user ? "space-between" : "center"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        w={6}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Button size={"xs"} onClick={logout} isLoading={updating}>
            <HiOutlineLogout size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
