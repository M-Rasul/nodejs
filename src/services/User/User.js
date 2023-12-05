const users = require("../../db/User/User");

// GETTING ACCESS TO USER TABLE
let usersList = users;

// FUNCTION TO CHECK USER EXISTENCE
const checkUserExistsById = function(userId) {
    if(!usersList.some(user => user.id === userId)) {

        // RETURN ERROR
        return "User with such id does not exist";
    } else {
        return null;
    }
};  

// USER SERVICE WITH ALL OPERATIONS
const userService = {

    // USER CREATE
    create(user) {

        // CHECKING IF USER ALREADY EXISTS
        if(usersList.some(singleUser => singleUser.email === user.email)) {
            
            // RETURN ERROR
            return "User with such email already exists";
        }

        // THEN PUSH NEW USER TO TABLE
        usersList.push({...user, id: usersList.at(-1).id + 1});

        // RETURN FINAL LIST OF USERS
        return usersList;
    },
    
    // USER DELETE
    delete(userId) {

        // CHECKING IF USER WITH SUCH ID EXISTS
        const response = checkUserExistsById(userId);

        // IF RESPONSE IS THERE IT IS AN ERROR
        if(response) {
            return response;
        };

        // ELSE DELETE THAT USER
        const renewedUsers = usersList.filter(user => user.id !== userId);

        // ASSIGNED THAT NEW ARRAY TO USERS LIST
        usersList = renewedUsers;

        // RETURN NEW VALUE
        return usersList;
    },

    // USER PARTIAL UPDATE
    partialUpdate(updatedPart, userId) {

        // CHECKING IF SUCH USER EXISTS
        const response = checkUserExistsById(userId);

        // IF RESPONSE IS THERE IT IS AN ERROR
        if(response) {
            return response;
        };

        // UPDAING SPECIFIC PROPERTIES OF SPECIFIC USER
        const index = usersList.findIndex(user => user.id === userId);
        usersList[index] = {...usersList[index], ...updatedPart};
        
        // RETURN THE NEW LIST
        return usersList;
    },

    // RETRIEVE USER BY ID
    getUserById(id) {

        // CHECKING THE USER EXISTENCE
        const response = checkUserExistsById(id);

        // IF RESPONSE IS THERE IT IS AN ERROR
        if(response) {
            return response;
        };

        // FIND THAT USER
        const user = usersList.find(user => user.id === id);

        // RETURN THAT USER 
        return {id: user.id, name: user.name, email: user.email};
    },

    // RETRIEVE ALL USERS
    getUsers() {

        // MAPPING TO RETURN OBJECTS WITHOUT HOBBIES
        return usersList.map(user => ({id: user.id, name: user.name, email: user.email}));
    },

    // HOBBIES

    // HOBBY CREATE
    createHobby(hobbyName, userId) {

        // CHECKING EXISTENCE OF THE USER
        const response = checkUserExistsById(userId);

        // IF RESPONSE IS THERE IT IS AN ERROR
        if(response) {
            return response;
        };

        // FIND THE INDEX OF THE USER
        const userIndex = usersList.findIndex(user => user.id === userId);

        // CHECKING IF HOBBY ALREADY EXISTS ON USER
        if(usersList[userIndex]?.hobbies?.includes(hobbyName)) {
            return "This user already has this hobby";
        }

        // ADDING HOBBY
        usersList[userIndex] = {...usersList[userIndex], hobbies: [... (usersList[userIndex]?.hobbies ? usersList[userIndex]?.hobbies : []), hobbyName]};

        // RETURN USERS LIST
        return usersList;
    },

    // HOBBY DELETE
    deleteHobby(hobbyName, userId) {

        // CHECK THE EXISTENCE OF USER
        const response = checkUserExistsById(userId);

        // IF RESPONSE IS THERE IT IS AN ERROR
        if(response) {
            return response;
        };

        // FIND THE INDEX OF THE USER
        const userIndex = usersList.findIndex(user => user.id === userId);

        // CHECKING IF HOBBY ALREADY EXISTS ON USER
        if(!usersList[userIndex].hobbies.includes(hobbyName)) {
            return "This hobby is not found";
        }

        // REMOVING HOBBY
        usersList[userIndex] = {...usersList[userIndex], hobbies: usersList[userIndex]?.hobbies.filter(hobby => hobby !== hobbyName)};

        // RETURN USERS LIST
        return usersList;
    },

    // RETRIEVE ALL HOBBIES
    getHobbies() {
        
        // HOBBIES LIST
        const hobbies = [];

        // ITERATING OVER USERS
        usersList.forEach(user => {

            // PUSHING HOBBIES TO THE ARRAY
            hobbies.push(...user.hobbies);
        });

        // TURNING ARRAY TO SET TO HAVE UNIQUE VALUES
        const hobbiesSet = new Set(hobbies);

        // RETURNING THE ARRAY
        return [...hobbiesSet];
    },
};

// EXPORT
module.exports = userService;