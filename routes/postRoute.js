const {Router} = require("express")
const router =  Router()
const {verifyToken, isAuthor} = require("../middleware/authMiddleware")
const postController = require("../controllers/postController")
const upload = require("../middleware/upload")

router.get("/" , postController.getAllPosts);
router.get("/:id", postController.getPostById)

router.post("/", verifyToken, upload.single("image"), postController.createPost);
router.put("/:id", verifyToken, upload.single("image"), postController.updatePost);
router.delete("/:id", verifyToken, postController.deletePost)
router.patch("/:id/publish", verifyToken, isAuthor, postController.togglePublish)

module.exports = router;