const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },

  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },

  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },

  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler,
  },

  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByHandler,
  },

];

module.exports = routes;
