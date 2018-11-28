import { Router } from "express";
import passport from "passport";
import Post from "../controllers/postsController";
import user from "../controllers/userController";
const router = Router();

router
  .get("/api/v1/posts", Post.getAllPosts)
  .get("/api/v1/posts/:id", Post.findById)
  .post("/api/v1/posts", Post.createPost)
  .put("/api/v1/posts/:id", Post.updatePost);

router
  .post("/api/v1/users/register", user.signUp)
  .get(
    "/api/v1/users/:id/posts",
    passport.authenticate("jwt", {
      session: false
    }),
    user.userPosts
  )
  .post("/api/v1/users/login", user.logIn)
  .get(
    "/api/v1/user",
    passport.authenticate("jwt", { session: false }),
    user.profile
  );
export default router;
