
class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }
  filter() {
    const queryObj = { ...this.queryString }
    Array.from(['page', 'sort', 'limit', 'fields']).forEach(el => delete queryObj[el])
    let queryStr = JSON
      .stringify(queryObj)
      .replace(/\b(gte|gt|lte|lt|eq|ne)\b/g, match => "$" + match)
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this;
  }
  pagination() {
    let page = this.queryString.page * 1 || 1;
    page = page <= 0 ? 1 : page;
    let limit = this.queryString.limit * 1 || 100;
    limit = limit <= 0 ? 100 : limit;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit)
    return this;
  }
}
module.exports = APIFeatures