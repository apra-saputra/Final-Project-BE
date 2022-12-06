const getLoaderMore = (size) => {
  const limit = size ? +size : 8;

  return { limit };
};

const getLoadMoreData = (data, limit) => {
  const { count: totalItems, rows: response } = data;

  return { totalItems, response, limit };
};

const getPagination = (page, size = 8) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: response } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, response, totalPages, currentPage };
};

module.exports = {
  getPagination,
  getPagingData,
  getLoaderMore,
  getLoadMoreData,
};

/*
  how to use
  let pagination = getPagination(page) 
  page -> page number start with 0, 
  second param size, total show data per page
  add pagination result as option
  options.limit = pagination.limit
  options.offset = pagination.offset
  const data = await Model.findAndCountAll(options)
  response for frontend
  const responses = getPagingData(data, page, pagination.limit)
  */
