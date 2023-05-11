import arg from 'arg';// Command line interface to be run through node.js
import { Blob } from 'buffer';

const http = require('https'); //used to download the config file
const fs = require('fs'); //used to save the config file
const ini = require('ini') //used to parse the config file
const FileReader = require('filereader') //used in the crypto_blob_reader.js
global.FileReader = FileReader;

//get the users home directory
const home = process.env.HOME || process.env.USERPROFILE;

//Get the API key and security token from ~/.filesender/filesender.py.ini
var user_config_file;
try{
  user_config_file = fs.readFileSync(home + '/.filesender/filesender.py.ini', 'utf8');
}
catch(err){
  console.log("Error: Could not find config file at " + home + '/.filesender/filesender.py.ini');
  console.log("Please download it from your FileSender instance and place it there.");
  //stop the program
  process.exit(1);
}


const user_config = ini.parse(user_config_file);
const base_url = user_config['system']['base_url'].split('/').slice(0, -1).join('/');
const default_transfer_days_valid = user_config['system']['default_transfer_days_valid'];
var username = user_config['user']['username'];
var apikey = user_config['user']['apikey'];

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "", {url: base_url + "/?s=upload"} );
global.$ = global.jQuery = require( "jquery" )( window );

// Set up the global window object
global.window = global;

//get the config file

const file = fs.createWriteStream("filesender-config.js");


export function cli(args) {

  const method = args[2];

  if (method == "list-transfers") {
    seeTransfers();
    return;
  }

  if (method == "show-transfer") {
    getTransferInfo(args[3], printTransfer);
    return;
  }

  if (method == "upload") {
    upload(args);
    return
  }

  if (method == "download") {
    download(args[3]);
    return
  }

}

function download(transfer_id) {

}

/*
  * Gets the information for a transfer
  * @param {string} transfer_id - the ID of the transfer
  * @param {function} callback - callback function
  * 
  * This is for the show-transfer command and runs when the user runs 'filesender show-transfer'
  */
function getTransferInfo(transfer_id, callback) {
  call('GET', '/rest.php/transfer/' + transfer_id, (transfer) => {
    if (!transfer) {
      console.log("No transfer found with ID " + transfer_id);
      return;
    }
    callback(transfer);
  });
}

function printTransfer(transfer) {
  //TODO add more information like the time it was uploaded
  console.log(`Transfer ID: ${transfer.id}`);
  console.log(`From: ${transfer.user_email}`);
  if(transfer.subject) console.log(`Subject: ${transfer.subject}`);
  if(transfer.message) console.log(`Message: ${transfer.message}`);
  console.log(`Expires: ${transfer.expires.formatted}\n`);
  console.log(`Files:`);
  for (let file of transfer.files) {
    console.log(`ID: ${file.id}\t${file.name} (${file.size})`);
  }
}

/*
 * Uploads a file to the FileSender instance
 * @param {string[]} args - command line arguments
 * 
 * This is for the upload command and runs when the user runs 'filesender upload'
 */
function upload(args) {

  let options = parseArgumentsIntoOptions(args);
  
  if (options.verbose) console.log("Downloading config...");

  if (options.files.length == 0) {
    console.log("No files specified");
    console.log("Use '--file ./file1.txt' to specify a file to upload");
    return;
  }

  if (options.recipients.length == 0) {
    console.log("No recipients specified");
    console.log("Use '--recipient someone@example.com' to specify a recipient for the transfer");
    return;
  }

  if (options.apikey != undefined){
    apikey = options.apikey;
  }

  if (options.username != undefined){
    username = options.username;
  }

  //if the user wants --verbose, then don't show progress as it is already given in the verbose output
  if (options.verbose) options.progress = false;

  if (!options.verbose) process.stdout.write("Getting config...")


  const request = http.get(base_url+"/filesender-config.js.php", function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
        file.close();
        if (options.verbose) console.log("Config downloaded");
        if (!options.verbose) process.stdout.write("uploading...")

        //if the user wants to see the progress, add a new line
        if (options.progress) process.stdout.write("\n");

        ////get all the required files
        require('../filesender-config.js');
        require('../../www/js/client.js');
        require('../../www/js/filesender.js');
        require('../../www/js/transfer.js');
        require('../../www/js/crypter/crypto_app.js');
        require('../../www/js/crypter/crypto_blob_reader.js');
        require('../../www/js/crypter/crypto_common.js');

        //add some required functions
        global.window.filesender.ui = {};
        global.window.filesender.ui.error = function(error,callback) {
            console.log('[error] ' + error.message);
            console.log(error);
        }
        global.window.filesender.ui.rawError = function(text) {
            console.log('[raw error] ' + text);
        }
        global.window.filesender.ui.log = function(message) {
          if (options.verbose)
            console.log('[log] ' + message);
        }
        global.window.filesender.log = function(message) {
          if (options.verbose)
            console.log('[logger] ' + message);
        }
        global.window.filesender.ui.validators = {};
        global.window.filesender.ui.validators.email = /^[a-z0-9!#$%&'*+\/=?^_\`\{|\}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_\`\{|\}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[a-z]{2,})$/i

        global.window.location = {}
        global.window.location.href = base_url + "/?s=upload";
        
        
        //create a new transfer
        var transfer = new global.window.filesender.transfer()
        global.window.filesender.client.from = username;
        global.window.filesender.client.remote_user = username;
        transfer.from = username;

	      //Turn on reader support for API transfers
        global.window.filesender.supports.reader = true;
	      global.window.filesender.client.api_key = apikey;

        // global.window.filesender.config.terasender_enabled = true;
        

        //Add the files
        var errorHandler;
        for (var i = 0; i < options.files.length; i++) {
            var blob = new Blob([fs.readFileSync(options.files[i])]);
            //get the file name without the path, supports both unix and windows paths
            var filename = options.files[i].split('/').pop().split('\\').pop();
            blob.name = filename;
            transfer.addFile(filename, blob, errorHandler);
        }

        //add the recipients
        for (var i = 0; i < options.recipients.length; i++) {
            transfer.addRecipient(options.recipients[i], undefined);
        }

        // add the subject
        transfer.subject = options.subject;

        //add message
        transfer.message = options.message;
    
        // set the expiry date to the daysValid argument if exists, otherwise use default value in config file
        let daysValid = options.daysValid ? options.daysValid : default_transfer_days_valid
        let expiry = (new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000));
        // format as a string in the yyyy-mm-dd format
        transfer.expires = expiry.toISOString().split('T')[0];
        global.window.filesender.ui.log(`File will be valid until ${transfer.expires}, (${daysValid} day(s) from now)`)

        //set the security token
        //global.window.filesender.client.authentication_required = true;

        //if the user wants to see the progress (--progress) then show it
        transfer.onprogress = function( file , done) {
          var uploaded = file.fine_progress ? file.fine_progress : file.uploaded;
          var total = file.size;
          var percent = Math.round(uploaded / total * 100);
          if (options.progress) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`Uploading: ${percent}%`);
          }
        }

        //start the transfer
        transfer.start();

        transfer.oncomplete = function( time ) {
          //if the progress is show, display a new line
          if (options.progress) 
            process.stdout.write("\n")
            
          if (!options.verbose) process.stdout.write("done.")
        }
        
    });
  });
}

/**
 * Displays all the available transfers for a user 
 */
function seeTransfers(){
  call('GET', '/rest.php/transfer/', printTransfers);
}


/**
 * Prints the list of available transfers
 * @param {Transfer[]} transfers 
 */
function printTransfers(transfers){
  if(!transfers || transfers.length === 0) console.log("You have no available transfers.");
  
  console.log(`\nYou have ${transfers.length} available transfers:\n`)
  
  for(let transfer of transfers){
    console.log(`Transfer ID: ${transfer.id}`);
    console.log(`From: ${transfer.user_email}`);
    if(transfer.subject) console.log(`Subject: ${transfer.subject}`);
    if(transfer.message) console.log(`Message: ${transfer.message}`);
    console.log(`Expires: ${transfer.expires.formatted}\n`);
  }
}


/**
 * Sends a request to the REST API
 * @param {string} method - GET, POST, PUT etc.
 * @param {string} resource - url resource
 * @param {function} callback - callback function
 */
function call(method, resource, callback){
  const crypto = require('crypto');
  
  // set url arguments
  const timestamp = Math.floor(Date.now() / 1000);
  const remote_user = username;
  let args = [];
  args.push('remote_user' + '=' + remote_user);
  args.push('timestamp' + '=' + timestamp);
  args.sort();
  
  // prepare request for signing
  const to_sign = method.toLowerCase() + '&' + base_url.replace('https://','',1).replace('http://','',1) + resource + '?' + args.join('&');

  // generate the HMAC signature using shared secret  
  let signature = crypto.createHmac("sha1", apikey).update(to_sign).digest('hex');
  args.push('signature' + '=' + signature);
  
  const request_url = base_url + resource + '?' + args.join('&');

  // make the request
  if (method.toLowerCase() === "get") {
    console.log("\nLoading...")
    const request = http.get(request_url, (result) => {
      let data = '';
      result.on('data', (chunk) => {
        data += chunk;
      });
      result.on('end', () => {
        let parsed_data = JSON.parse(data);
        console.log("\nDone!")
        callback(parsed_data);
      });
    }).on('error', (error) => {
      console.log(`[error]: ${error}`);
    });
  }
}

/*
 * Parses the command line arguments
 * @param {string[]} rawArgs - command line arguments
 * @returns {Object} - parsed arguments
 * 
 * This is for the upload command
 */
function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
     '--verbose': Boolean,
     '--insecure': Boolean,
     '--progress': Boolean,
     '--subject': String,
     '--message': String,
     '--username': String,
     '--apikey': String,
     '--recipients': [ String ],
     '--file': [ String ],
     '--encryption': String,
     '-v': '--verbose',
     '-p': '--progress',
     '-i': '--insecure',
     '-s': '--subject',
     '-m': '--message',
     '-u': '--username',
     '-a': '--apikey',
     '-r': '--recipients',
     '-f': '--file',
     '-e': '--encryption',
   },
   {
     argv: rawArgs.slice(3),
   }
 );
 return {
   skipPrompts: args['--yes'] || false,
   git: args['--git'] || false,
   template: args._[0],
   runInstall: args['--install'] || false,
   recipients: args['--recipients'] || [],
   files : args['--file'] || [],
   message : args['--message'] || "",
   subject : args['--subject'] || "",
   encryption : args['--encryption'] || null,
 };
}