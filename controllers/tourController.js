const exp = require('constants')
const fs = require('fs')
const tourSimpleFile = `${__dirname}/../dev-data/data/tours-simple.json`
const tours = JSON.parse(fs.readFileSync(tourSimpleFile)).filter(el => !el.isDelete)

exports.checkBody = (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid Data, require name and price"
    })
  }
  next()
}

exports.checkID = (req, res, next, val) => {
  const tour = tours.find(t => t.id == val);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: "Invalid Id"
    });
  }
  next()
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: {
      tours
    }
  });
}
exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(t => t.id == id);
  res.status(200).json({
    status: 'sucess',
    data: {
      tour
    }
  });
}
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(tourSimpleFile, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newTour
      }
    })
  })
}
exports.updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(t => t.id == id);
  const newTour = Object.assign(tour, req.body);
  const index = tours.indexOf(tour);
  tours[index] = newTour;
  fs.writeFile(tourSimpleFile, JSON.stringify(tours), err => {
    res.status(200).json({
      status: 'sucess',
      data: {
        tour: newTour
      }
    })
  })
}
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(t => t.id == id);
  tour.isDelete = true;
  fs.writeFile(tourSimpleFile, JSON.stringify(tours), err => {
    res.status(204).json({
      status: "success",
      data: null
    })
  })
}