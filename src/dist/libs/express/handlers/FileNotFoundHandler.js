"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function FileNotFoundHandler(message = "Page Not Found", status = 404) {
    return (req, res, next) => {
        const err = new Error(message);
        err.status = status;
        res.locals.errorView = "404";
        return next(err);
    };
}
exports.default = FileNotFoundHandler;
// function FileNotFoundHandler(message, status) {
//   return (req, res, next) => {
//     if (!message) {
//       message = "Page Not Found";
//     }
//     let err = new Error(message);
//     err.status = status || 404;
//     res.locals.errorView = "404";
//     return next(err);
//   };
// }
// module.exports = FileNotFoundHandler;
