import { useRef, useState } from "react";
import { Button, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Textarea,
  Text,
  Input,
  Image,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import useImgPreview from "../hooks/useImgPreview";
import useShowToast from "../hooks/useShowToast";
import { userAtom } from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";
import { useParams } from "react-router-dom";
export default function CreatePostButton() {
  const MAX_CHAR = 300;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [post, setPost] = useRecoilState(postAtom);
  const [updating, setUpdating] = useState(false);
  const { imgUrl, handleImg, setImgUrl } = useImgPreview();
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const { username } = useParams();

  const imgRef = useRef(null);
  const showToast = useShowToast();
  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length > MAX_CHAR) {
      const truncatedText = text.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(text);
      setRemainingChar(MAX_CHAR - text.length);
    }
  };
  const handleCreatePost = async () => {
    if (!updating) {
      setUpdating(true);
    }
    try {
      const res = await axios.post("/api/v1/post/create", {
        postedBy: user._id,
        postText: postText,
        postImage: imgUrl,
      });
      const result = res.data;
      const data = result.data;

      showToast(result.message, "", "success");
      onClose();
      if (username === user.username) setPost([data, ...post]);
      setImgUrl("");
      setPostText("");
      setRemainingChar(MAX_CHAR);
    } catch (error) {
      const result = error.response;
      showToast(
        "Error",
        result?.data.message || "Something went Wrong.",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="type text here..."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="small"
                fontWeight="bold"
                textAlign="right"
                m={1}
                color={"gray.800"}
              >
                {remainingChar}/300
              </Text>
              <Input type="file" hidden ref={imgRef} onChange={handleImg} />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imgRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected Image" />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={updating}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
