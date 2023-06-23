const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const tourSchema = new mongoose.Schema(
  {
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
    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"]
    },
    ratingsAverage: Number,
    ratingsQuantity: Number,
    summary: String,
    description: String,
    imageCover: String,
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    slug: {
      type: String
    },
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
// 虚拟字段
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
})
//  pre post hooks（save、create,find）
// save前钩子
tourSchema.pre('save', function (next) {
  console.log('保存前 设置slug')
  this.slug = slugify(this.name, { lower: true })
  next();
})
tourSchema.pre('save', function (next) {
  console.log('保存前 站位记录')
  next();
})

//
tourSchema.post('save', function (doc, next) {
  console.log("保存成功");
  next();
})

// query中间件
// tourSchema.pre('find', function (next) {
//   console.log("query中间件", this)
//   this.find({ secretTour: { $ne: true } })
//   next();
// })
// 匹配所有find前缀的钩子
tourSchema.pre(/^find/, function (next) {
  // console.log("query开始")
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now();
  next();
})
tourSchema.post(/^find/, function (doc, next) {
  console.log(`query结束，耗时${Date.now() - this.start}ms`)
  next();
})

// 
tourSchema.pre('aggregate', function () {
  console.log("aggregate pre", this)
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
})

tourSchema.post('aggregate', function () {
  console.log("aggregate post", this)
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