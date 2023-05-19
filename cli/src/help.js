/**
 * This file deals with the help command for the cli
 */

// Reset styles
const reset = "\x1b[0m";

// Text color
const greyedOut = "\x1b[90m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";


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
    }
}

/**
 * Prints a help message for using the cli
 */
function printHelp() {
    console.log(`\n${green}Welcome${reset} to the ${blue}Filesender CLI${reset}!\n`);
    console.log(`${yellow}Usage:${reset} filesender-cli [command] [options]`);
    console.log("");
    console.log(`${yellow}Commands:${reset}`)
    console.log(`list-transfers        ${blue}Lists basic details for the currently available transfers${reset}`);
    console.log(`show-transfer         ${blue}Shows the full details of a specific transfer${reset}`);
    console.log(`upload                ${blue}Create a new transfer for a recipient${reset}`);
    console.log(`download              ${blue}Download the files of a transfer${reset}`);
    console.log(`delete                ${blue}Delete a transfer${reset}`);
    console.log(`help                  ${blue}Show this help message${reset}`);
    console.log("");
    console.log(`${yellow}Options:${reset}`);
    console.log(`-v, ${greyedOut}--verbose${reset}          ${blue}Show detailed log messages${reset}`);
    console.log(`-s, ${greyedOut}--subject${reset}          ${blue}Subject line for the transfer${reset}`)
    console.log(`-m, ${greyedOut}--message${reset}          ${blue}Message to add to the transfer${reset}`);
    console.log(`-u, ${greyedOut}--username${reset}         ${blue}Your unique username for filesender if not using config file${reset}`);
    console.log(`-a, ${greyedOut}--apikey${reset}           ${blue}Your secret API key if not using config file${reset}`);
    console.log(`-r, ${greyedOut}--recipients${reset}       ${blue}Recipient(s) to include in a transfer${reset}`);
    console.log(`-f, ${greyedOut}--file${reset}             ${blue}File(s) to include in a transfer${reset}`);
    console.log(`-e, ${greyedOut}--encryption${reset}       ${blue}Passphrase to use for encryption / decryption${reset}`);
    console.log(`-d, ${greyedOut}--daysValid${reset}        ${blue}Number of days that the transfer will be available for${reset}`);
    console.log("");
    console.log(`${yellow}Examples:${reset}`);
    console.log(`filesender-cli print-transfers                                                                  ${blue}Prints all of your available transfers${reset}`);
    console.log(`filesender-cli upload -u username -a 12345678 -r example@example.com -f file.txt -d 21          ${blue}Creates a transfer for recipient example@example.com with file.txt that is valid for 21 days.${reset}`);
    console.log("");
    console.log(`${green}Please use ${reset}\'filesender-cli help command\'${green} to get detailed information for a specific command's usage${reset}`);
    console.log("");
}

/**
 * Help message for list-transfers command
 */
function helpListTransfers() {
    console.log(`\n${yellow}Command:${reset} list-transfers`);
    console.log(`\n${blue}Lists basic details for the currently available transfers${reset}`);
    console.log(`\n${yellow}Usage:${reset} filesender-cli list-transfers\n`);
}