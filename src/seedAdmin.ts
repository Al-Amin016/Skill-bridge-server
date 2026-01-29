import { prisma } from "./lib/prisma";
import { UserRole } from "./middleware/auth";

async function seedAdmin (){
    try {
        const adminData = {
            name: "Admin Al-Amin",
            email: "1alaminislam112@gmail.com",
            password : "password12345",
            phone : "01609284014",
            role : UserRole.ADMIN
        };
        const existsAdmin = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });
        if(existsAdmin){
            throw new Error("User already exists!!")
        };
        const singUpUser = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "content-type" : "application/json",
                origin : "http://localhost:3000"
            },
            body: JSON.stringify(adminData)
        });
        console.log(singUpUser);
        if(singUpUser.ok){
            await prisma.user.update({
                where: {
                    email: adminData.email,
                },
                data: {
                    emailVerified: true
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
}


seedAdmin()