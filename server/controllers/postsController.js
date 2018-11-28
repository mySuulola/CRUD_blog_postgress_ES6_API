import moment from "moment";
import db from "../database";

export default class Post {
  static getAllPosts(req, res) {
    const queryPosts = `SELECT * FROM posts`;
    db.query(queryPosts)
      .then(posts => {
        res.status(200).json({
          message: "all posts",
          posts
        });
      })
      .catch(err => {
        res.status(401).json({
          message: err
        });
      });
  }

  static findById(req, res) {
    db.findById("posts", parseInt(req.params.id, 10))
      .then(post => {
        if (!post) {
          return res.status(401).json({
            message: "post not found"
          });
        }
        if (req.user.id === parcel.user_id) {
          return res.status(200).json({
            message: "user posts",
            post
          });
        }
        return res.status(400).json({
          message: "not authorized"
        });
      })
      .catch(err => {
        res.json({
          err
        });
      });
  }

  static createPost(req, res) {
    const queryPosts = `
    INSERT INTO posts(  
        title, 
        description,
        user_id,
        created_at)
    VALUES($1, $2, $3, $4)
    returning *
    `;
    const { title, description } = req.body;
    let post = {
      title,
      description
    };
    const userId = req.user.id;
    const newPost = [post, userId, moment(new Date())];
    db.query(queryPosts, newPost)
      .then(allposts => {
        res.status(201).json({
          post: allposts[0]
        });
      })
      .catch(err => {
        res.status(401).json({
          message: "failed to create a new post"
        });
      });
  }

  static updatePost(req, res) {
    const onePost = "SELECT * FROM posts WHERE id = $1 AND user_id = $2";
    db.query(onePost, [parseInt(req.params.id), parseInt(req.user.id)])
      .then(aPost => {
        const post = aPost[0];
        if (!post) {
          return res.status(401).json({
            message: "post not found"
          });
        }

        const updateQuery = `UPDATE posts SET 
        title=$1, 
        description=$2 
        WHERE id=$3 AND user_id=$4
        returning *
       `;
        let description = { ...post.description };
        if (req.body.destinationdescription)
          description["description"] = req.body.description;

        const newpost = [
          req.body.description || post["description"],
          parseFloat(req.params.id),
          parseFloat(req.user.id)
        ];
        db.query(updateQuery, newpost)
          .then(result => {
            const updatedPost = result[0];
            res.status(201).json({
              message: "post successfully updated",
              updatedPost
            });
          })
          .catch(err => {
            res.json({
              err
            });
          });
      })
      .catch(err => {
        res.json({
          err
        });
      });
  }
}
