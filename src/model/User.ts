const fs = require("fs");

// USER INTERFACE
export interface IUser {
    id: number;
    name: string;
};

// GET ALL USERS
export const getAllUsers = async function(): Promise<IUser[]> {

    // CREATING A PROMISE
    return new Promise((resolve, reject) => {

        // READ FROM FILE
        fs.readFile(`${__dirname}/../db/userDB.txt`, (err: NodeJS.ErrnoException | null, data: string) => {

            // IF ERROR
            if(err) {
                console.log("Failed to read the file");
            }

            // PROCESS DATA FROM FILE
            const usersJSON = JSON.parse(data.toString());

            // RESOLVE USERS
            resolve(usersJSON);
        })
    })
};

// GET USER BY ID
export const getUserById = async function(userId: number): Promise<IUser | undefined> {

    // GET ALL USERS
    const users = await getAllUsers();

    // RETURN USER WITH ID
    return users.find(user => user.id === userId);
}