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

var	scriptName = "Screenshot",
	viewports = {
		{
			'name': 'smartphone-portrait',
			'viewport': {
				width: 320,
				height: 480
			}
		},
		{
			'name': 'smartphone-landscape',
			'viewport': {
				width: 480,
				height: 320
			}
		},
		{
			'name': 'tablet-portrait',
			'viewport': {
				width: 768,
				height: 1024
			}
		},
		{
			'name': 'tablet-landscape',
			'viewport': {
				width: 1024,
				height: 768
			}
		},
		{
			'name': 'desktop',
			'viewport': {
				width: 1280,
				height: 1024
			}
		}
	},
	outputDir = "output/",
	inputDir = "input/",
	dataFile = inputDir + "data.csv",
	libsDir = "../_libs/",
	fs = require('fs'),
	system = require('system'),
	casper = require('casper').create({
		logLevel: "error",
		clientScripts:  [
	        libsDir + 'jquery.js'
	    ]
	}),
	date = new Date();

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
		output : {
			name : scriptName,
			date : date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear(),
			time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
			result : {}
		}
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
			this.viewport(viewport[0], viewport[1]);

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
					*/

					// Wait for all assets to load, will swap this to a better solution at some point
					// a time based pause will be flakey.
					this.wait(5000);

					this.each(viewports, function(casper, viewport) {

						this.then(function() {

							this.viewport(viewport["viewport"]["width"], viewport["viewport"]["height"]);

						});

						this.then(function(){

							this.echo('Screenshot - ' + viewport["name"] + ' (' + viewport["viewport"]["width"] + 'x' + viewport["viewport"]["height"] + ')', 'info');

							var date = date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear();
							
							this.capture('output/' + date + '/' + viewport["name"] + '-' + viewport["viewport"]["width"] + 'x' + viewport["viewport"]["height"] + '.png', {
						
						top: 0,
						left: 0,
						width: viewport.viewport.width,
						height: viewport.viewport.height
						});
						});
						});

					var title = this.evaluate(function(){

						return document.title;

					});

					var url = this.evaluate(function(){

						return window.location.href;

					});

					// Store the results of our work
					application.global.output.result[url] = {
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

			var output = JSON.stringify(application.global.output);

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