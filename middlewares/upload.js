const Boom = require('@hapi/boom');

const multer = require('multer');

function uploadMiddleware({ dest, field }) {
  return async (req, _res, next) => {
    try {
      const contype = req.headers['content-type'];

      if ((contype !== contype.indexOf('multipart/form-data')) !== 0)
        throw Boom.badRequest('File not received');

      const upload = multer({ dest });

      upload.single(field);

      req.body.image = `${req.url}/${req.file.originalname}`;

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = uploadMiddleware;
