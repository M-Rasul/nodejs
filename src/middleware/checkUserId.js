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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserId = void 0;
const User_1 = require("../model/User");
;
;
;
const checkUserId = function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // GET USER ID
        const userId = (_a = req.headers) === null || _a === void 0 ? void 0 : _a["x-user-id"];
        // IF NO ID HEADER WAS PROVIDED
        if (!userId) {
            res
                .status(400)
                .send({
                error: "X-user-id headers were not set",
                ok: false,
            });
            return;
        }
        // GET THAT USER
        const user = yield (0, User_1.getUserById)(+userId);
        // GETTING THAT USER
        if (!user) {
            // SEND ERROR
            res
                .status(401)
                .send({
                error: "User with specified id was not found",
                ok: false,
            });
            return;
        }
        next();
    });
};
exports.checkUserId = checkUserId;
