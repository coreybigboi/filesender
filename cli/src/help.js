const chalk = require('chalk');

/**
 * This file deals with the help command for the cli
 */

// Reset styles
const reset = "\x1b[0m";

// Text color

const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

// styling
const heading = chalk.bgBlue.white;
const description = chalk.blue;
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

        default: console.log(`${red}Invalid command. Use ${reset}\'node filesender-cli help\' ${red}to list all available commands${reset}`);
    }
}

/**
 * Prints a help message for using the cli
 */
function printHelp() {
    console.log(`\n${chalk.bold("Welcome")} to the ${chalk.bgGreen.white("Filesender CLI")}\n`);
    console.log(`${heading("Usage:")} node filesender-cli [command] [options]`);
    console.log("");
    console.log(`${heading("Commands:")}`);
    console.log(`list-transfers        ${description("Lists basic details for the currently available transfers")}`);
    console.log(`show-transfer         ${description("Shows the full details of a specific transfer")}`);
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
    console.log(`\n${yellow}Command:${reset} list-transfers`);
    console.log(`\n${green}List the basic details for the currently available transfers${reset}`);
    console.log(`\n${yellow}Usage:${reset} node filesender-cli list-transfers\n`);
}

/**
 * Help message for show transfer
 */
function helpShowTransfer(){
    console.log(`\n${yellow}Command:${reset} show-transfer`);
    console.log(`\n${green}Show the full details of a specific transfer. Ensure that the argument after the command is a valid transfer id${reset}`);
    console.log(`\n${yellow}Usage:${reset} node filesender-cli show-transfer 1234        ${description("Shows full details for transfer with ID 1234")}\n`);
}

/**
 * Help message for upload
 */
function helpUpload(){
    console.log(`\n${yellow}Command:${reset} upload`);
    console.log(`\n${green}Create a new transfer for a recipient(s)${reset}`);
    console.log(`\n${yellow}Options:${reset}`)
    console.log(`-r, ${greyedOut}--recipients${reset} [required]                           ${description("Recipient(s) to include in a transfer")}`);
    console.log(`-f, ${greyedOut}--file${reset} [required]                                 ${description("File(s) to include in a transfer")}`);
    console.log(`-u, ${greyedOut}--username${reset} [optional if config file available]    ${description("Your unique username for filesender if not using config file")}`);
    console.log(`-a, ${greyedOut}--apikey${reset} [optional if config file available]      ${description("Your secret API key if not using config file")}`);
    console.log(`-s, ${greyedOut}--subject${reset} [optional]                              ${description("Subject line for the transfer")}`)
    console.log(`-m, ${greyedOut}--message${reset} [optional]                              ${description("Message to add to the transfer")}`);
    console.log(`-e, ${greyedOut}--encryption${reset} [optional]                           ${description("Passphrase to use for encryption")}`);
    console.log(`-d, ${greyedOut}--daysValid${reset} [optional]                            ${description("Number of days that the transfer will be available for")}`);
    console.log(`\n${yellow}Usage:${reset}`);
    console.log(`node filesender-cli upload -u username -a 12345678 -r example@example.com -f file.txt -d 21          ${description("Creates a transfer for recipient example@example.com with file.txt that is valid for 21 days")}\n`);
}

/**
 * Help message for download
 */
function helpDownload(){
    console.log(`\n${yellow}Command:${reset} download`);
    console.log(`\n${green}Download the files of a transfer${reset}`);
    console.log(`\n${yellow}Usage:${reset} node filesender-cli download 1234        ${description("Downloads the files for the transfer with ID 1234")}\n`);
}

/**
 * Help message for show transfer
 */
function helpDelete(){
    console.log(`\n${yellow}Command:${reset} delete`);
    console.log(`\n${green}Delete a transfer${reset}`);
    console.log(`\n${yellow}Usage:${reset} node filesender-cli delete 1234        ${description("Deletes the transfer with ID 1234")}\n`);
}