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
exports.getFormById = exports.deleteForm = exports.editForm = exports.createForm = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, fields, authorId, usersId } = req.body;
        const form = yield prisma.form.create({
            data: {
                title,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
                fields,
                users: {
                    connect: usersId.map((userId) => ({ id: userId })),
                },
            },
        });
        res.status(201).json({ form });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
});
exports.createForm = createForm;
const editForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, fields, usersId } = req.body;
        const form = yield prisma.form.findUnique({
            where: {
                id: req.params.formId,
            },
            select: {
                authorId: true,
                usersId: true
            },
        });
        if (!form) {
            res.sendStatus(404);
            return;
        }
        if (req.body.userId != (form === null || form === void 0 ? void 0 : form.authorId) && !(form === null || form === void 0 ? void 0 : form.usersId.includes(req.body.userId))) {
            res.sendStatus(403);
            return;
        }
        const updatedForm = yield prisma.form.update({
            where: {
                id: req.params.formId,
            },
            data: {
                title,
                fields,
                users: {
                    set: usersId.map((userId) => ({ id: userId })),
                }
            }
        });
        res.status(200).json({ updatedForm });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
});
exports.editForm = editForm;
const deleteForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = yield prisma.form.findUnique({
            where: {
                id: req.params.formId,
            },
            select: {
                authorId: true,
            }
        });
        if (!form) {
            res.sendStatus(404);
            return;
        }
        const formAuthorId = form === null || form === void 0 ? void 0 : form.authorId;
        if (req.body.userId != formAuthorId) {
            res.sendStatus(403);
            return;
        }
        yield prisma.form.delete({
            where: {
                id: req.params.formId
            },
        });
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
});
exports.deleteForm = deleteForm;
const getFormById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = yield prisma.form.findUnique({
            where: {
                id: req.params.formId
            },
        });
        res.status(200).json({ form });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
});
exports.getFormById = getFormById;
//# sourceMappingURL=forms.service.js.map