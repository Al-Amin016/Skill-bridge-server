import { NextFunction, Request, Response } from "express";
import {auth as betterAuth} from "../lib/auth"

export enum UserRole {
STUDENT = "STUDENT",
TUTOR = "TUTOR",
ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request{
            user?:{
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean
            }
        }
    }
}

const auth = (...roles: UserRole[]) =>{
    return async (req: Request, res: Response, next: NextFunction) =>{
        // console.log(roles);
        // get user session
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        });

        if(!session) {
            return res.status(401).json({
                success : false,
                message : "You are not authorized!"
            });
        };
        if(!session.user.emailVerified){
            return res.status(403).json({
                success : false,
                message : "Email verification required. Please verify your email!"
            });
        };
        req.user = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role as UserRole,
            emailVerified: session.user.emailVerified 
        };
        if(roles.length && !roles.includes(req.user.role as UserRole)) {
            return res.status(401).json({
                success : false,
                message : "Forbidden! YOu don't have permission to access tis resources"
            });
        };
        next()
    }
};


export default auth