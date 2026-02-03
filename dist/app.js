"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const express_1 = __importDefault(require("express"));
const routers_1 = __importDefault(require("./router/routers"));
const system_variable_1 = require("./config/system.variable");
const db_connection_1 = require("./config/db.connection");
const errorHandler_midleware_1 = require("./midddleware/errorHandler.midleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", routers_1.default);
app.use(errorHandler_midleware_1.handleCustomError);
(0, db_connection_1.mongoConnection)();
app.listen(system_variable_1.PORT, () => {
    console.log(`Server is running on port ${system_variable_1.PORT}`);
});
