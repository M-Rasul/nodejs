const fs = require("fs");
const csv = require("csvtojson");
const { Readable } = require("stream");

// FUNCTION TO ITERATE OVER THE STREAM
const readableToString = async function (readable) {

    // CREATING WRITE STREAM
    const writeable = fs.createWriteStream("./example.txt", { encoding: "utf-8" });

    // CATCHING ERROR
    writeable.on("error", err => {
        console.log(`Error occurred with write stream: ${err}`);
    });

    // ITERATING
    for await (const chunk of readable) {
        writeable.write(chunk);
    }
};

// CONVERTING CSV TO JSON
csv().fromFile("./csvdirectory/example.csv")
    .then(json => {

        // CONVERTING EACH OBJECT TO A STRING
        const jsonStringArray = json.map((obj) => JSON.stringify(obj));

        // READING DATA AS A STREAM
        const readable = Readable.from(jsonStringArray, { encoding: "utf-8" });

        // CALLING FUNCTION
        readableToString(readable);
    })
    .catch(err => {
        console.log(`Error occurred when converting csv to json: ${err}`);
    })