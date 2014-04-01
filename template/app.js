/*
 ######  ######## ######## ##     ## ########  
##    ## ##          ##    ##     ## ##     ## 
##       ##          ##    ##     ## ##     ## 
 ######  ######      ##    ##     ## ########  
      ## ##          ##    ##     ## ##        
##    ## ##          ##    ##     ## ##        
 ######  ########    ##     #######  ##        

Here we set up the variables for the application to run.

*/

var	viewport = [1024,768],
	outputDir = "output/",
	inputDir = "input/",
	dataFile = inputDir + "data.csv",
	libsDir = "../libs/",
	fs = require('fs'),
	system = require('system'),
	casper = require('casper').create({
		logLevel: "error",
		clientScripts:  [
	        libsDir + 'jquery.js'
	    ]
	});

/*
   ###    ########  ########  
  ## ##   ##     ## ##     ## 
 ##   ##  ##     ## ##     ## 
##     ## ########  ########  
######### ##        ##        
##     ## ##        ##        
##     ## ##        ##        
*/

var application = {

	/*
	##     ##    ###    ########   ######  
	##     ##   ## ##   ##     ## ##    ## 
	##     ##  ##   ##  ##     ## ##       
	##     ## ##     ## ########   ######  
	 ##   ##  ######### ##   ##         ## 
	  ## ##   ##     ## ##    ##  ##    ## 
	   ###    ##     ## ##     ##  ######  	
	*/

	global : {
		inputURLS : [],
		result : {}
	},

	/*
	#### ##    ## #### ######## 
	 ##  ###   ##  ##     ##    
	 ##  ####  ##  ##     ##    
	 ##  ## ## ##  ##     ##    
	 ##  ##  ####  ##     ##    
	 ##  ##   ###  ##     ##    
	#### ##    ## ####    ##    
	*/

	init : function(){
		var self = this;

		self.getData();

	},

	/*
	 ######   ######## ######## ########     ###    ########    ###    
	##    ##  ##          ##    ##     ##   ## ##      ##      ## ##   
	##        ##          ##    ##     ##  ##   ##     ##     ##   ##  
	##   #### ######      ##    ##     ## ##     ##    ##    ##     ## 
	##    ##  ##          ##    ##     ## #########    ##    ######### 
	##    ##  ##          ##    ##     ## ##     ##    ##    ##     ## 
	 ######   ########    ##    ########  ##     ##    ##    ##     ## 
	*/

	getData : function(){

		/*
			The below code could be used to prompt for a CSV file, rather than
			define it in the global scope. It gets a little annoying always
			prompting for a file, so I took it out.
		*/

		// system.stdout.writeLine("Which CSV file shall I use?");

		// application.global.dataFile = 

		// application.global.dataFile = system.stdin.readLine().replace("\n","");

		application.createUrls();

	},

	/*
	 ######  ########  ########    ###    ######## ######## 
	##    ## ##     ## ##         ## ##      ##    ##       
	##       ##     ## ##        ##   ##     ##    ##       
	##       ########  ######   ##     ##    ##    ######   
	##       ##   ##   ##       #########    ##    ##       
	##    ## ##    ##  ##       ##     ##    ##    ##       
	 ######  ##     ## ######## ##     ##    ##    ######## 
	##     ## ########  ##        ######                    
	##     ## ##     ## ##       ##    ##                   
	##     ## ##     ## ##       ##                         
	##     ## ########  ##        ######                    
	##     ## ##   ##   ##             ##                   
	##     ## ##    ##  ##       ##    ##                   
	 #######  ##     ## ########  ######                    
	*/

	createUrls : function(){
		var self = this;

		// Read the CSV file, and split on new lines
		var details = fs.read(dataFile).split("\n");

		for(var i=0; i<details.length; i++){

		    if(details[i] != ""){

		    	// Replace the comma if it's there
		    	var url = details[i].replace(",","");

		    	// Store the url in our array, we might need it later
		        application.global.inputURLS.push(url);

		    } // if

		} // for

		// Process the urls
		application.parseURL();

	},

	/*	
	########     ###    ########   ######  ######## ##     ## ########  ##       
	##     ##   ## ##   ##     ## ##    ## ##       ##     ## ##     ## ##       
	##     ##  ##   ##  ##     ## ##       ##       ##     ## ##     ## ##       
	########  ##     ## ########   ######  ######   ##     ## ########  ##       
	##        ######### ##   ##         ## ##       ##     ## ##   ##   ##       
	##        ##     ## ##    ##  ##    ## ##       ##     ## ##    ##  ##       
	##        ##     ## ##     ##  ######  ########  #######  ##     ## ######## 
	*/

	parseURL : function(){

		// Start the CasperJS party
		casper.start();

		casper.then(function() {

			if(application.global.inputURLS.length === 0){

				this.die("No URLs defined, try again.", 1);

			};

			// Set the viewport
			casper.viewport(viewport[0], viewport[1]);

			this.eachThen(application.global.inputURLS, function(url){

				this.echo("Processing: " + url.data, "INFO");

				this.thenOpen(url.data, function(){

					/*
					   ###     ######  ######## ####  #######  ##    ## 
					  ## ##   ##    ##    ##     ##  ##     ## ###   ## 
					 ##   ##  ##          ##     ##  ##     ## ####  ## 
					##     ## ##          ##     ##  ##     ## ## ## ## 
					######### ##          ##     ##  ##     ## ##  #### 
					##     ## ##    ##    ##     ##  ##     ## ##   ### 
					##     ##  ######     ##    ####  #######  ##    ## 
					
					This is where we manipulate the page, and return the various values we need.

					You can run tests or capture data.

					After this, we output the results and put them into JSON and CSV format.
				
					*/

					var title = this.evaluate(function(){

						return document.title;

					});

					var url = this.evaluate(function(){

						return window.location.href;

					});

					// Store the results of our work
					application.global.result[url] = {
						title : title
					};

				});

			});

		});

		/*
		########  ######## ##     ##  ######  ##       ######## 
		##     ## ##       ##     ## ##    ## ##          ##    
		##     ## ##       ##     ## ##       ##          ##    
		########  ######   ##     ##  ######  ##          ##    
		##   ##   ##       ##     ##       ## ##          ##    
		##    ##  ##       ##     ## ##    ## ##          ##    
		##     ## ########  #######   ######  ########    ##    
		*/

		casper.then(function(){

			var output = JSON.stringify(application.global.result);

			fs.write(outputDir + "results.json", output, 'w');

		});

        casper.on("page.error", function(msg, trace) {
			this.echo("Error:    " + msg, "ERROR");
			this.echo("file:     " + trace[0].file, "WARNING");
			this.echo("line:     " + trace[0].line, "WARNING");
			this.echo("function: " + trace[0]["function"], "WARNING");
		});

		casper.run();

	}

} // application

application.init();