import { Strategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import db from "../database";

dotenv.config();
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
export default passport => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      db.findById("users", jwt_payload.id)
        .then(user => {
          if (user) {
            let userPayload = { ...user };
            delete userPayload.password;
            return done(null, user);
          }
          return done(null, false, "not authorized");
        })
        .catch(err => console.log(err));
    })
  );
};
