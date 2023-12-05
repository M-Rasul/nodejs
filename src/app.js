const http = require("http");
const url = require("url");
const userService = require("./services/User/User");

// CREATING A SERVER
const server = http.createServer((req, res) => {

    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours cache

    // PATHNAME
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const queryParams = parsedUrl.query;

    // SPLITTING PATHNAME BY /
    const splittedPathname = pathname.split("/");

    // GET METHODS
    if (req.method === "GET") {

        // USER
        if (pathname.includes("/users")) {

            // GET USER BY ID
            if (splittedPathname.length > 2) {

                // MAKING USE OF SERVICE
                const userResponse = userService.getUserById(+splittedPathname[2]);

                // IF ERROR
                if (userResponse === "User with such id does not exist") {
                    res.statusCode = 404;
                } else {
                    res.statusCode = 200;
                }

                // RETURNING THE RESULT TO THE CLIENT
                res.end(JSON.stringify(userResponse));
            }

            // GET ALL USERS
            if (splittedPathname.length === 2) {
                const usersResponse = userService.getUsers();

                res.statusCode = 200;
                res.end(JSON.stringify(usersResponse));
            }
        }

        // HOBBIES
        if (pathname.includes("/hobbies")) {

            // GET ALL HOBBIES
            const hobbiesResponse = userService.getHobbies();

            res.statusCode = 200;
            res.end(JSON.stringify(hobbiesResponse));
        }
    }

    // DELETE METHODS
    if (req.method === "DELETE") {

        // USER
        if (pathname.includes("/users")) {

            // DELETE A USER BY ID
            const usersResponse = userService.delete(+splittedPathname[2]);

            if (usersResponse === "User with such id does not exist") {
                res.statusCode = 404;
            } else {
                res.statusCode = 204;
            }

            res.end(JSON.stringify(usersResponse));
        }

        // HOBBIES
        if (pathname.includes("/hobbies")) {

            // DELETE HOBBY BY NAME AND USER ID
            const hobbiesResponse = userService.deleteHobby(splittedPathname[2], +splittedPathname[3]);

            if (hobbiesResponse === "User with such id does not exist" || hobbiesResponse === "This hobby is not found") {
                res.statusCode = 404;
            } else {
                res.statusCode = 204;
            }

            res.end(JSON.stringify(hobbiesResponse));
        }
    }

    // POST
    if (req.method === "POST") {

        // USER
        if (pathname.includes("/users")) {

            // CREATE USER
            const usersResponse = userService.create(queryParams);
            
            if (usersResponse === "User with such email already exists") {
                res.statusCode = 400;
            } else {
                res.statusCode = 201;
            }

            res.end(JSON.stringify(usersResponse));
        }

        // HOBBIES
        if(pathname.includes("/hobbies")) {

            // CREATE HOBBY
            const hobbiesResponse = userService.createHobby(queryParams?.hobbyName, +queryParams?.userId);

            if (hobbiesResponse === "This user already has this hobby" || hobbiesResponse === "User with such id does not exist") {
                res.statusCode = 400;
            } else {
                res.statusCode = 201;
            }

            res.end(JSON.stringify(hobbiesResponse));
        }
    }

    // PATCH
    if(req.method === "PATCH") {

        // UPDATE USER
        const usersResponse = userService.partialUpdate(queryParams, +splittedPathname[2]);

        if(usersResponse === "User with such id does not exist") {
            res.statusCode = 404;
        } else {
            res.statusCode = 200;
        }

        res.end(JSON.stringify(usersResponse));
    }
});

// LISTENING ON PORT 3000
server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});