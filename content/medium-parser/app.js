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

var	scriptName = "Medium Parser",
	viewport = [1024,768],
	outputDir = "output/",
	libsDir = "../../_libs/",
	fs = require('fs'),
	system = require('system'),
	casper = require('casper').create({
		logLevel: "debug",
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
			result : []
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

		self.createUrls();

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

		// Set the input URL
		system.stdout.writeLine("Which Medium URL you like to parse?");
		self.global.originalURL = system.stdin.readLine().replace("\n","");

		// Process the url
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

			if(application.global.originalURL === ""){

				this.die("No URLs defined, try again.", 1);

			};

			this.echo("Processing: " + application.global.originalURL, "INFO");

			this.thenOpen(application.global.originalURL, function(){

				/*
				   ###     ######  ######## ####  #######  ##    ## 
				  ## ##   ##    ##    ##     ##  ##     ## ###   ## 
				 ##   ##  ##          ##     ##  ##     ## ####  ## 
				##     ## ##          ##     ##  ##     ## ## ## ## 
				######### ##          ##     ##  ##     ## ##  #### 
				##     ## ##    ##    ##     ##  ##     ## ##   ### 
				##     ##  ######     ##    ####  #######  ##    ## 
				
				*/

				var urls = this.evaluate(function(){

					var urls = [];

					$(".bucket").each(function(){

						// Check if this is the latest posts list
						if($(this).find("h2:first").text() === "Latest"){

							$(this).find("li").each(function(){

								urls.push($(this).find("a").attr("href"));

							});

						}

					});

					return urls;

				});

				application.global.inputURLS = urls;

			});

			this.eachThen(application.global.inputURLS, function(url){

				this.echo("Processing: " + url.data, "INFO");

				this.thenOpen(url.data, function(){

					var title = this.evaluate(function(){

						return $("h1").text();

					});

					application.global.output.result.push({
						title : title
					});

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