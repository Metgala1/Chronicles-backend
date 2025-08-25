const {Router} = require("express");
const router = Router();
const commentController = require("../controllers/commentController");
const {verifyToken} = require("../middleware/authMiddleware")

router.get("/post/:postId", verifyToken, commentController.getCommentsByPost)

router.post("/post/:postId", verifyToken, commentController.createComment);
router.delete("/:id", verifyToken, commentController.deleteComment)

module.exports = router