const { Router } = require('express')
const tourController = require('../controllers/tourController')
const router = Router();

// router.param('id', tourController.checkID)


router.param('json', (req, res, next, val) => {
  console.log("check body", val)
  next();
})

router.route("/")
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router.route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = router;


