"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const asyncWrapper_1 = require("../midddleware/asyncWrapper");
const user_services_1 = require("../services/user.services");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.preRegister = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const response = yield user_services_1.UserService.preRegister(user);
    res.status(200).json({ success: true, payload: response });
}));
AuthController.register = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const response = yield user_services_1.UserService.register(user);
    res.status(201).json({ success: true, payload: response });
}));
AuthController.login = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const response = yield user_services_1.UserService.login(email, password);
    res.status(200).json({ success: true, payload: response });
}));
