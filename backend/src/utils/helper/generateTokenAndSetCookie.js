import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_Secret, {
    expiresIn: "100d",
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  return token;
};

export default generateTokenAndSetCookie;
