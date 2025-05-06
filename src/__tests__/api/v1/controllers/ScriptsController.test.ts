import ScriptsController from "../../../../api/v1/controllers/ScriptsController";
import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import path from "path";
import configs from "../../../../config";
import LogsMongoClient from "../../../../libs/mongo/Logs";

jest.mock("fs");
jest.mock("../../../../libs/mongo/Logs");

describe("ScriptsController", () => {
  let scriptsController: ScriptsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    scriptsController = new ScriptsController();
    mockRequest = {};
    mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("config", () => {
    it("should send sanitized configs as JavaScript", async () => {
      const sanitizedConfigs = JSON.parse(JSON.stringify(configs));
      delete sanitizedConfigs.mongo;
      delete sanitizedConfigs.ui.allow;

      await scriptsController.config(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/javascript"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(
        `window.GM_CONFIG = ${JSON.stringify(sanitizedConfigs)};`
      );
      expect(mockResponse.end).toHaveBeenCalled();
    });

    //   it("should handle errors and call next", async () => {
    //     const error = new Error("Test error");
    //     jest.spyOn(JSON, "stringify").mockImplementationOnce(() => {
    //       throw error;
    //     });

    //     await scriptsController.config(
    //       mockRequest as Request,
    //       mockResponse as Response,
    //       mockNext
    //     );

    //     expect(LogsMongoClient.prototype.error).toHaveBeenCalledWith(
    //       "ScriptsController.config",
    //       error.message,
    //       expect.objectContaining({
    //         stack: error.stack,
    //       })
    //     );
    //     expect(mockNext).toHaveBeenCalledWith(error);
    //   });
    // });

  });
  describe("scripts", () => {
    it("should combine and send scripts as JavaScript", async () => {
      const mockScripts = {
        "templates.js": "console.log('templates');",
        "on-ready.js": "console.log('on-ready');",
        "form-validator.js": "console.log('form-validator');",
      };

      jest.spyOn(fs, "readFileSync").mockImplementation((filePath: fs.PathOrFileDescriptor) => {
        if (typeof filePath === "string") {
          const fileName = path.basename(filePath);
          return mockScripts[fileName as keyof typeof mockScripts];
        }
        throw new Error("Invalid file path type");
      });

      await scriptsController.scripts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/javascript"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "console.log('templates');console.log('on-ready');console.log('form-validator');"
      );
      expect(mockResponse.end).toHaveBeenCalled();
    });

    // it("should handle errors and call next", async () => {
    //   const error = new Error("Test error");
    //   jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
    //     throw error;
    //   });

    //   await scriptsController.scripts(
    //     mockRequest as Request,
    //     mockResponse as Response,
    //     mockNext
    //   );

    //   expect(LogsMongoClient.prototype.error).toHaveBeenCalledWith(
    //     "ScriptsController.scripts",
    //     error.message,
    //     expect.objectContaining({
    //       stack: error.stack,
    //     })
    //   );
    //   expect(mockNext).toHaveBeenCalledWith(error);
    // });
  });
});