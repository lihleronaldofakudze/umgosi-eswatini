import React from "react";

import moment from "moment";

//React Router
import { useHistory } from "react-router-dom";

//Material UI
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";

//Material Icons
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

//Firebase
import { useFirebase, useFirestore } from "react-redux-firebase";

const Post = ({ post }) => {
  const history = useHistory();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const { uid } = firebase.auth().currentUser;
  const likePost = () => {
    if (post.likes.includes(uid)) {
      firestore
        .collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(uid),
        });
    } else {
      firestore
        .collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(uid),
        });
    }
  };
  const changePage = (link) => {
    history.push(link);
  };
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe">
              <img src={post.photoURL} alt={post.displayName} width="100%" />
            </Avatar>
          }
          title={post.displayName}
          subheader={`${moment(post.postedAt.toDate()).fromNow()}`}
        />
        <CardActionArea
          onClick={() => changePage(`/comments/${post.message}/${post.id}`)}
        >
          {post.image ? (
            <CardMedia
              image={post.image}
              title={post.message}
              style={{
                width: 100,
                margin: "auto", // 16:9
              }}
              component="img"
            />
          ) : null}
          <CardContent>
            <Typography variant="h5" color="textSecondary" component="p">
              {post.message}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton size="small" color="primary" onClick={likePost}>
            {post.likes.includes(uid) ? (
              <FavoriteIcon style={{ color: "#FF0000" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Button size="small" color="primary" disabled>
            {`${post.likes.length} likes`}
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => changePage(`/comments/${post.message}/${post.id}`)}
          >
            Comment
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Post;
