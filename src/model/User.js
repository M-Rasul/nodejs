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
exports.getUserById = exports.getAllUsers = void 0;
const fs = require("fs");
;
// GET ALL USERS
const getAllUsers = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // CREATING A PROMISE
        return new Promise((resolve, reject) => {
            // READ FROM FILE
            fs.readFile(`${__dirname}/../db/userDB.txt`, (err, data) => {
                // IF ERROR
                if (err) {
                    console.log("Failed to read the file");
                }
                // PROCESS DATA FROM FILE
                const usersJSON = JSON.parse(data.toString());
                // RESOLVE USERS
                resolve(usersJSON);
            });
        });
    });
};
exports.getAllUsers = getAllUsers;
// GET USER BY ID
const getUserById = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // GET ALL USERS
        const users = yield (0, exports.getAllUsers)();
        // RETURN USER WITH ID
        return users.find(user => user.id === userId);
    });
};
exports.getUserById = getUserById;
