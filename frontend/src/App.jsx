import { Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms/userAtom";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";

const App = () => {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        ></Route>
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/update"
          element={user ? <ProfileUpdatePage /> : <Navigate to="/auth" />}
        ></Route>
        <Route path="/:username" element={<UserPage />}></Route>
        <Route path="/:username/post/:pid" element={<PostPage />}></Route>
      </Routes>
    </Container>
  );
};
export default App;
