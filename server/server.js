import dotenv from "dotenv";
import express from "express";
import passport from "passport";

import passportConfig from "./config/passport";

import routes from "./routes/routes";
dotenv.config();
const app = express();

app.use(passport.initialize());
passportConfig(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "welcome to the blog api" });
});

app.use(routes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on ${port}`);
});

export default app;
