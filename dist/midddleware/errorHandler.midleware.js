"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomError = exports.newCustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
//
const newCustomError = (message, statusCode) => {
    return new CustomError(message, statusCode);
};
exports.newCustomError = newCustomError;
const handleCustomError = (error, _req, res, _next) => {
    console.log("oooooooppspsp");
    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            success: false,
            payload: error.message,
            timeStamp: new Date(),
        });
    }
    else {
        console.log(error);
        res.status(500).json({
            success: false,
            payload: "Something went wrong!",
            timeStamp: new Date(),
        });
    }
};
exports.handleCustomError = handleCustomError;
