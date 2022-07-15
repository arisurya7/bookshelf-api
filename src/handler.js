const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const booksResult = [];
  const queryParams = request.query;
  books.forEach((book) => {
    const { id, name, publisher } = book;
    booksResult.push({ id, name, publisher });
  });

  if (queryParams.reading !== undefined) {
    const booksQueryByReading = [];
    books.forEach((book) => {
      if (Number(book.reading) === parseInt(queryParams.reading, 10)) {
        const { id, name, publisher } = book;
        booksQueryByReading.push({ id, name, publisher });
      }
    });
    return h.response({
      status: 'success',
      data: {
        books: booksQueryByReading,
      },
    }).code(200);
  }

  if (queryParams.finished !== undefined) {
    const booksQueryByFinished = [];
    books.forEach((book) => {
      if (Number(book.finished) === parseInt(queryParams.finished, 10)) {
        const { id, name, publisher } = book;
        booksQueryByFinished.push({ id, name, publisher });
      }
    });
    return h.response({
      status: 'success',
      data: {
        books: booksQueryByFinished,
      },
    }).code(200);
  }

  if (queryParams.name !== undefined) {
    const booksQueryByName = [];
    books.forEach((book) => {
      if (book.name.toLowerCase().includes(queryParams.name.toLowerCase())) {
        const { id, name, publisher } = book;
        booksQueryByName.push({ id, name, publisher });
      }
    });
    return h.response({
      status: 'success',
      data: {
        books: booksQueryByName,
      },
    }).code(200);
  }

  return h.response({
    status: 'success',
    data: {
      books: booksResult,
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookResult = books.filter((b) => b.id === bookId)[0];
  if (bookResult !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book: bookResult,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByHandler,
};
