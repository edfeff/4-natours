const Tour = require('./../models/tourModel')
const sendErr = (res, err) => {
  const message = err instanceof String ? err : err.toString()
  res.status(400).json({ status: "fail", message: message })
}
const sendData = (res, data) => {
  res.status(200).json({ status: "success", data: data })
}
exports.checkBody = (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid Data, require name and price"
    })
  }
  next()
}

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingAverage,price'
  req.query.fields = 'name,price,ratingAverage,summary,difficulty'
  next();
}

exports.getAllTours = async (req, res) => {
  //     const tours = await Tour.find({ duration: '51', difficulty: 'easy' })
  //     const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
  try {
    let queryObj = { ...req.query }

    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach(el => delete queryObj[el])

    //filter
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq|ne)\b/g, match => "$" + match)
    queryObj = JSON.parse(queryStr)

    //
    let query = Tour.find(queryObj);

    //sort 
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    //fields
    if (req.query.fields) {
      const fieldArray = Array.from(req.query.fields.split(','));
      const fields = fieldArray.join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    //pagination
    let page = req.query.page * 1 || 1;
    page = page <= 0 ? 1 : page;
    let limit = req.query.limit * 1 || 100;
    limit = limit <= 0 ? 100 : limit;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit)

    if (req.query.page) {
      const nums = await Tour.countDocuments()
      if (skip > nums) {
        throw new Error("没有此页面")
      }
    }
    //
    const tours = await query
    res.status(200).json(
      {
        status: "success",
        result: tours.length,
        data: {
          tours
        }
      })
  } catch (err) {
    sendErr(res, err)
  }
}

exports.getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    sendData(res, { tour })
  } catch (err) {
    sendErr(res, err);
  }
}

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    sendData(res, { tour });
  } catch (err) {
    sendErr(res, err);
  }
}
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
      {
        new: true,
        runValidators: true
      }
    )
    sendData(res, { tour })
  } catch (err) {
    sendErr(res, err)
  }

}
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    sendData(res, { tour })
  } catch (err) {
    sendErr(res, err);
  }
}

