import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

function FileNotFoundHandler(message: string = "Page Not Found", status: number = 404) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const err: CustomError = new Error(message);
    err.status = status;
    res.locals.errorView = "404";

    return next(err);
  };
}

export default FileNotFoundHandler;

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
