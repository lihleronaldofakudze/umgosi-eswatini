import React from "react";

//React Router
import { useHistory } from "react-router-dom";

//Material UI
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";

const Post = ({ post }) => {
  const history = useHistory();
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
          subheader={post.postedAt.seconds}
        />
        <CardActionArea onClick={() => changePage(`/comments/${post.id}`)}>
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
          <Button size="small" color="primary">
            Like
          </Button>
          <Button size="small" color="primary">
            Comment
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Post;
