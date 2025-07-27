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
import UserSearchPage from "./pages/UserSearchPage";
import ProtectedRoute from "./components/ProtectRoute";

const App = () => {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={
            <ProtectedRoute>
              <ProfileUpdatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <UserSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:username/post/:pid"
          element={
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
