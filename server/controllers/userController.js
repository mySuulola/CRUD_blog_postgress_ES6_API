import bcrypt from "bcrypt";
import momemt from "moment";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../database/index";

dotenv.config();

export default class User {
  static userPosts(req, res) {
    const queryString = `SELECT * FROM posts WHERE user_id = $1`;
    const values = [Number(req.params.id)];
    db.findById("users", req.params.id)
      .then(user => {
        if (!user) {
          res.json({
            message: "user not found"
          });
        }
        db.query(queryString, values).then(response => {
          res.status(200).json({
            response
          });
        });
      })
      .catch(err => {
        res.json({
          err
        });
      });
  }

  static signUp(req, res) {
    const queryText = `
    INSERT INTO users(first_name, last_name, email, password, created_at)
    VALUES($1, $2, $3, $4, $5)
    returning *
    `;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (error, hash) => {
        if (error) {
          res.json({
            error
          });
        }
        const newUser = [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          hash,
          momemt(new Date())
        ];
        db.query(queryText, newUser)
          .then(userRes => {
            const user = { ...userRes[0] };
            delete user.password;
            res.json({
              user
            });
          })
          .catch(err => {
            if (err.routine === "_bt_check_unique") {
              return res.json({
                message: "User already exist"
              });
            }
          });
      });
    });
  }

  static logIn(req, res) {
    const { email, password } = req.body;
    const queryText = `
      SELECT *  FROM users WHERE email = $1 LIMIT 1
    `;
    const value = [email];
    db.query(queryText, value)
      .then(response => {
        if (!response[0]) {
          return res.json({
            message: "user not found"
          });
        }
        bcrypt.compare(password, response[0].password).then(isMatch => {
          if (isMatch) {
            let payload = { ...response[0] };
            delete payload.password;
            jwt.sign(
              payload,
              process.env.SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                return res.json({
                  token
                });
              }
            );
          } else {
            res.json({
              message: "invalid email and password"
            });
          }
        });
      })
      .catch(err => {
        return res.json({
          message: err
        });
      });
  }

  static profile(req, res) {
    db.findById("users", req.user.id)
      .then(response => {
        const user = { ...response, password: null };
        delete user.password;
        return res.json({
          user
        });
      })
      .catch(err => {
        return res.json({
          err
        });
      });
  }
}
