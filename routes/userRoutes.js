const { Router } = require('express')
const userController = require('../controllers/userController')
const userRouter = Router();
userRouter.route("/")
  .get(userController.getAllUsers)
  .post(userController.creatUser);
userRouter.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;