var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth")();
const PostsController=require("../controllers/Posts");

router.post('/posts/create',auth.authenticate(),PostsController.createPost);
router.get('/posts/location_coords',auth.authenticate(),PostsController.getPostsLocCoords);
router.get('/posts/:id',auth.authenticate(),PostsController.getSinglePost);
router.put('/posts/:id',auth.authenticate(),PostsController.updatePost);
router.delete('/posts/:id',auth.authenticate(),PostsController.deletePost); 
router.get('/showCount',auth.authenticate(),PostsController.showCount);

module.exports = router;
