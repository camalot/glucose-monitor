import { Request, Response, NextFunction } from 'express';

interface ErrorHandlerOptions {
  view?: string;
  viewData?: Record<string, any>;
}

interface CustomError extends Error {
  status?: number;
}

function ErrorHandler(view?: string, viewData?: Record<string, any>) {
  return (err: CustomError | null, req: Request, res: Response, next: NextFunction): Response | void => {
    if (!err) {
      err = new Error('Unknown Error') as CustomError;
      err.status = 500;
    }

    err.status = err.status || 500;
    view = view || String(res.locals.errorView) || 'error';

    if (err.status > 499) {
      console.error(err);
    } else if (err.status > 400 && err.status <= 499) {
      console.warn(err);
    }

    const contentType = req.get('content-type') || 'text/html';

    switch (contentType) {
      case 'application/json':
      case 'text/x-json':
        return res.json({
          error: {
            code: err.status,
            message: err.message,
            stack: req.app.get('env') === 'development' ? err.stack : null,
          },
        });
      default:
        res.status(err.status);
        res.locals.message = err.message;
        res.locals.errorCode = err.status;
        res.locals.error =
          req.app.get('env') === 'development' ? err : { message: err.message };
        return res.render(view, viewData || { title: err.status });
    }
  };
}

export default ErrorHandler;
