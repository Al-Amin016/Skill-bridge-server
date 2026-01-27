import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port = config.port;

async function main () {
    try {
        await prisma.$connect();
        console.log("connected to the database successfully");

        app.listen(port, () =>{
            console.log(`the server in running port: ${port}`);
        })
    } catch (err) {
        console.log(err);
        await prisma.$disconnect();
        process.exit(1)
    }
};

main();