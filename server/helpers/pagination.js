const getPagination = (page, size = 8) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return ({ limit, offset });
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: response } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, response, totalPages, currentPage };
};

module.exports = {getPagination, getPagingData} 