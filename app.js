const os = require("os");
const childProcess = require("child_process");
const fs = require("fs");

// DETERMINING OS TYPE OF THE USER
const osType = os.type();

// SETTING COMMAND AS PER OS
let command;
let arguments;
if(osType === "Linux" || osType === "Darwin") {
    command = "ps";
    arguments = ["-A -o %cpu,%mem,comm | sort -nr | head -n 1"];
} else if(osType === "Windows_NT") {
    command = "powershell";
    arguments = ["Get-Process | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"];
}

// USING SPAWN TO DELEGATE TASK TO CHILD PROCESS
const process = childProcess.spawn(command, arguments);

// VARIABLE FOR THE FINAL DATA
let fullData = "";

// HANDLER WHEN CHILD PROCESS MAKES SOME DATA
let lines = [];
process.stdout.on("data", data => {
    
    // APPENDING FULL DATA
    fullData += data.toString();

    // Split data into individual lines
    lines = lines.concat(data.toString().split('\n'));
});

// INTERVAL TO WRITE DATA TO A FILE
const fileInterval = setInterval(() => {
    fs.writeFile("activityMonitor.log", fullData, err => {
        if(err) {
            throw err;
        }
        console.log("LOGS SAVED!");
    });
}, 60000);

// Function to display the output and clear the console
function displayLines() {
    if (lines.length === 0) {
        setTimeout(displayLines, 1000); // No lines to display, check again in a second.
        return;
    }

    console.log(lines.shift());
    setTimeout(() => {
        // Clear console
        console.clear();
        // process.stdout.write('\033c');
        displayLines();
    }, 100);
}

displayLines(); // Call the displayLines function initially


