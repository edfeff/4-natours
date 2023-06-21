const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "tour must have name"]
  },
  price: {
    type: Number,
    unique: false,
    required: [true, "tour must have price"]
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  duration: {
    type: Number
  },
  maxGroupSize: Number,
  difficulty: String,
  ratingsAverage: Number,
  ratingsQuantity: Number,
  summary: String,
  description: String,
  imageCover: String,
  images: Array,
  startDates: Array
})

//mongodb 内的集合是 此处模型的小写+s 即 tours
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour
// const tourTest = new Tour({
//   name: 'woo-test',
//   rating: 1,
//   price: 431
// })
// tourTest.save().then(doc => {
//   console.log("save ok", doc)
// }).catch(err => {
//   console.log("save fail", err)
// })