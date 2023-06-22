const { Router } = require('express')
const tourController = require('../controllers/tourController')
const router = Router();

// router.param('id', tourController.checkID)


router.param('json', (req, res, next, val) => {
  console.log("check body", val)
  next();
})

//路由别名  
//利用中间件，把请求的参数都放到中间件中处理
router.route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router.route("/")
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router.route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = router;


