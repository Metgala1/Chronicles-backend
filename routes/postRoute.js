const {Router} = require("express")
const router =  Router()
const {verifyToken, isAuthor} = require("../middleware/authMiddleware")
const postController = require("../controllers/postController")

router.get("/" , postController.getAllPosts);
router.get("/:id", postController.getPostById)

router.post("/", verifyToken, postController.createPost);
router.put("/:id", verifyToken, isAuthor, postController.updatePost);
router.delete("/:id", verifyToken, isAuthor, postController.deletePost)
router.patch("/:id/publish", verifyToken, isAuthor, postController.togglePublish)

module.exports = router;