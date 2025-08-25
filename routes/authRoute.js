const {Router} = require("express");
const router = Router()
const authController = require("../controllers/authController")
const {verifyToken} = require("../middleware/authMiddleware")

router.post("/register", authController.register)
router.post("/login",authController.login)
router.get("/profile", verifyToken, authController.profile)



module.exports = router;