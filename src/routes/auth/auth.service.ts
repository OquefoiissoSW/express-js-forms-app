import { Request, Response } from "express";
import { RegisterInput } from "./register-input.model";
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client";
import generateToken from "./token";

const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            omit: {
                password: true
            },
            where: {
                id: req.params.userId
            },
        })

        res.status(200).json({ user })
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const input: RegisterInput = {
            username: req.body.username?.trim(),
            password: req.body.password?.trim()
        }

        if (!input.username) {
            res.status(400).json({ message: "username is required" })
            return;
        }

        if (!input.password) {
            res.status(400).json({ message: "password is required"})
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                username: input.username,
            },
            select: {
                id: true,
            }
        })

        if (existingUser) {
            res.status(422).json({ message: "Username is already taken", existingUser });
            return
        }
    
        const hashedPassword = await bcrypt.hash(input.password, 10);
    
        const user = await prisma.user.create({
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
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err });
    }
    
}

export const login  = async (req: Request, res: Response): Promise<void> => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();

        if (!username) {
            res.status(400).json({ message: "username is required" })
            return;
        }
        if (!password) {
            res.status(400).json({ message: "password is required"})
            return;
        }

        const user = await prisma.user.findUnique({
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
            const match = await bcrypt.compare(password, user.password);
            
            if (match) {
                res.status(200).json({
                    username: user.username,
                    token: generateToken(user.id),
                })

                return;
            }
        }

        res.status(403).json({ message: "username or password is invalid" })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err  });
    }
}