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
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";

//Material Icons
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

//Firebase
import firebase, { auth, firestore } from "../services/firebase";

const Post = ({ post }) => {
  const history = useHistory();
  const user = auth.currentUser;
  const likePost = () => {
    if (post.likes.includes(user.uid)) {
      firestore
        .collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(user.uid),
        });
    } else {
      firestore
        .collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(user.uid),
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
          {/* <CardMedia
            image="/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          /> */}
          <CardContent>
            <Typography variant="h5" color="textSecondary" component="p">
              {post.message}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton size="small" color="primary" onClick={likePost}>
            {post.likes.includes(user.uid) ? (
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
