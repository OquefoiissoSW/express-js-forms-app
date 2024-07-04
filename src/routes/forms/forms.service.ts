import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express"

const prisma = new PrismaClient();

export const createForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, fields, authorId, usersId } = req.body;

        const form = await prisma.form.create({
            data: {
                title,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
                fields,
                users: {
                    connect: usersId.map((userId: string) => ({ id: userId })),
                },
            },
        });

        res.status(201).json({ form })
    } catch(err) { 
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
}

export const editForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, fields, usersId } = req.body;

        const form = await prisma.form.findUnique({
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
            return
        }

        if (req.body.userId != form?.authorId && !form?.usersId.includes(req.body.userId)) {
            res.sendStatus(403);
            return
        }

        const updatedForm = await prisma.form.update({
            where: {
                id: req.params.formId,
            },
            data: {
                title,
                fields,
                users: {
                    set: usersId.map((userId: string) => ({ id: userId })),
                }
            }
        })
        
        res.status(200).json({ updatedForm })
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
}

export const deleteForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const form = await prisma.form.findUnique({
            where: {
                id: req.params.formId,
            },
            select: {
                authorId: true,
            }
        })

        if(!form) {
            res.sendStatus(404);
            return
        }

        const formAuthorId = form?.authorId;

        if(req.body.userId != formAuthorId) {
            res.sendStatus(403);
            return
        }

        await prisma.form.delete({
            where: {
                id: req.params.formId
            },
        });
        res.sendStatus(200);
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
   
}

export const getFormById = async (req: Request, res: Response): Promise<void> => {
    try {
        const form = await prisma.form.findUnique({
            where: {
                id: req.params.formId
            },
        })

        res.status(200).json({ form })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
}