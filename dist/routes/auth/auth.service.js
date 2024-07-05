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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = exports.getUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const token_1 = __importDefault(require("./token"));
const prisma = new client_1.PrismaClient();
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            omit: {
                password: true
            },
            where: {
                id: req.params.userId
            },
        });
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const input = {
            username: (_a = req.body.username) === null || _a === void 0 ? void 0 : _a.trim(),
            password: (_b = req.body.password) === null || _b === void 0 ? void 0 : _b.trim()
        };
        if (!input.username) {
            res.status(400).json({ message: "username is required" });
            return;
        }
        if (!input.password) {
            res.status(400).json({ message: "password is required" });
            return;
        }
        const existingUser = yield prisma.user.findUnique({
            where: {
                username: input.username,
            },
            select: {
                id: true,
            }
        });
        if (existingUser) {
            res.status(422).json({ message: "Username is already taken", existingUser });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(input.password, 10);
        const user = yield prisma.user.create({
            data: {
                username: input.username,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
            },
        });
        res.status(201).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const username = (_a = req.body.username) === null || _a === void 0 ? void 0 : _a.trim();
        const password = (_b = req.body.password) === null || _b === void 0 ? void 0 : _b.trim();
        if (!username) {
            res.status(400).json({ message: "username is required" });
            return;
        }
        if (!password) {
            res.status(400).json({ message: "password is required" });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
                username: true,
                password: true,
            }
        });
        if (user) {
            const match = yield bcryptjs_1.default.compare(password, user.password);
            if (match) {
                res.status(200).json({
                    username: user.username,
                    token: (0, token_1.default)(user.id),
                });
                return;
            }
        }
        res.status(403).json({ message: "username or password is invalid" });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
});
exports.login = login;
//# sourceMappingURL=auth.service.js.map