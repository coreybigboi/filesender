const chalk = require('chalk');

// styling
const heading = chalk.bold;
const description = chalk.green;
const greyedOut = chalk.grey;

/**
  * Handles help command
  * @param args -the cli arguments
  */
export function handleHelp(args) {
    // general case
    if (!args[3]) {
        printHelp();
        return;
    }
    switch (args[3]) {
        case "list-transfers":
            helpListTransfers();
            break;

        case "show-transfer":
            helpShowTransfer();
            break;

        case "upload":
            helpUpload();
            break;

        case "download":
            helpDownload();
            break;

        case "delete":
            helpDelete();
            break;

        default: console.log(`${chalk.red("Invalid command")}. Use ${chalk.bgGrey("node filesender-cli help")} to see all available commands`);
    }
}

/**
 * Prints a help message for using the cli
 */
function printHelp() {
    console.log(`\n${chalk.bold("Welcome")} to the ${chalk.bgBlue.white.bold("Filesender CLI")}\n`);
    console.log(`${heading("Usage:")} node filesender-cli [command] [options]`);
    console.log("");
    console.log(`${heading("Commands:")}`);
    console.log(`list-transfers        ${description("List basic details for the currently available transfers")}`);
    console.log(`show-transfer         ${description("Show the full details of a specific transfer")}`);
    console.log(`upload                ${description("Create a new transfer for a recipient(s)")}`);
    console.log(`download              ${description("Download the files of a transfer")}`);
    console.log(`delete                ${description("Delete a transfer")}`);
    console.log(`help                  ${description("Show this help message")}`);
    console.log("");
    console.log(`${heading("Options:")}`);
    console.log(`-v, ${greyedOut("--verbose")}          ${description("Show detailed log messages")}`);
    console.log(`-s, ${greyedOut("--subject")}          ${description("Subject line for the transfer")}`)
    console.log(`-m, ${greyedOut("--message")}          ${description("Message to add to the transfer")}`);
    console.log(`-u, ${greyedOut("--username")}         ${description("Your unique username for filesender if not using config file")}`);
    console.log(`-a, ${greyedOut("--apikey")}           ${description("Your secret API key if not using config file")}`);
    console.log(`-r, ${greyedOut("--recipients")}       ${description("Recipient(s) to include in a transfer")}`);
    console.log(`-f, ${greyedOut("--file")}             ${description("File(s) to include in a transfer")}`);
    console.log(`-e, ${greyedOut("--encryption")}       ${description("Passphrase to use for encryption / decryption")}`);
    console.log(`-d, ${greyedOut("--daysValid")}        ${description("Number of days that the transfer will be available for")}`);
    console.log("");
    console.log(`${heading("Examples:")}`);
    console.log(`node filesender-cli print-transfers                                                                  ${description("Prints all of your available transfers")}`);
    console.log(`node filesender-cli upload -u username -a 12345678 -r example@example.com -f file.txt -d 21          ${description("Creates a transfer for recipient example@example.com with file.txt that is valid for 21 days")}`);
    console.log("");
    console.log(`Please use ${chalk.bgGrey.bold("filesender-cli help command")} to get detailed information for a specific command's usage`);
    console.log("");
}

/**
 * Help message for list-transfers command
 */
function helpListTransfers() {
    console.log(`\n${chalk.green.bold("list-transfers")}`);
    console.log(`\nList the basic details for the currently available transfers`);
    console.log(`\n${heading("Usage:")} \nnode filesender-cli list-transfers\n`);
}

/**
 * Help message for show transfer
 */
function helpShowTransfer(){
    console.log(`\n${chalk.green.bold("show-transfer")}`);
    console.log(`\nShow the full details of a specific transfer. Ensure that the argument after the command is a valid transfer id`);
    console.log(`\n${heading("Usage:")} \nnode filesender-cli show-transfer [id]    ${description("Shows full details for transfer with ID [id]")}\n`);
}

/**
 * Help message for upload
 */
function helpUpload(){
    console.log(`\n${chalk.green.bold("upload")}`);
    console.log(`\nCreate a new transfer for one or more recipients`);
    console.log(`\n${heading("Options:")}`);
    console.log(`-r, ${greyedOut("--recipients")} [required]                           ${description("Recipient(s) to include in a transfer")}`);
    console.log(`-f, ${greyedOut("--file")} [required]                                 ${description("File(s) to include in a transfer")}`);
    console.log(`-u, ${greyedOut("--username")} [optional if config file available]    ${description("Your unique username for filesender if not using config file")}`);
    console.log(`-a, ${greyedOut("--apikey")} [optional if config file available]      ${description("Your secret API key if not using config file")}`);
    console.log(`-s, ${greyedOut("--subject")} [optional]                              ${description("Subject line for the transfer")}`)
    console.log(`-m, ${greyedOut("--message")} [optional]                              ${description("Message to add to the transfer")}`);
    console.log(`-e, ${greyedOut("--encryption")} [optional]                           ${description("Passphrase to use for encryption")}`);
    console.log(`-d, ${greyedOut("--daysValid")} [optional]                            ${description("Number of days that the transfer will be available for")}`);
    console.log(`\n${heading("Example:")}`);
    console.log(`node filesender-cli upload -r example@example.com -f file.txt -d 21    ${description("Creates a transfer for recipient example@example.com with file.txt that is valid for 21 days")}\n`);
}

/**
 * Help message for download
 */
function helpDownload(){
    console.log(`\n${chalk.green.bold("download")}`);
    console.log(`\nDownload the files of a transfer.`);
    console.log(`\n${heading("Usage:")} node filesender-cli download [id]      ${description("Downloads the files for the transfer with ID [id]")}`);
    console.log(`${heading("Usage:")} node filesender-cli download latest    ${description("Downloads the files for the most recent transfer")}\n`);
}

/**
 * Help message for show transfer
 */
function helpDelete(){
    console.log(`\n${chalk.green.bold("delete")}`);
    console.log(`\nDelete a transfer. Can either delete a single transfer by inputting its ID or delete all transfers.`);
    console.log(`\n${heading("Usage:")}`); 
    console.log(`node filesender-cli delete [id]    ${description("Deletes the transfer with ID [id]")}`);
    console.log(`node filesender-cli delete all     ${description("Deletes all transfers")}\n`);
}