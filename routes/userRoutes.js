const {Router} = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const router = Router();

//
router.post('/signup', authController.signup)

router.route("/")
    .get(userController.getAllUsers)
    .post(userController.creatUser);
router.route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;