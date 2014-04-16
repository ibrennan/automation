/*

 ######  ######## ######## ##     ## ########  
##    ## ##          ##    ##     ## ##     ## 
##       ##          ##    ##     ## ##     ## 
 ######  ######      ##    ##     ## ########  
      ## ##          ##    ##     ## ##        
##    ## ##          ##    ##     ## ##        
 ######  ########    ##     #######  ##        

*/

var	scriptName = "Screenshot",
	viewports = [
		{
			'name': 'desktop',
			'dimensions': {
				width: 1280,
				height: 1024
			},
			'useragent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36(KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36'
		},
		{
			'name': 'smartphone-portrait',
			'dimensions': {
				width: 320,
				height: 480
			},
			'useragent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25'
		},
		{
			'name': 'smartphone-landscape',
			'dimensions': {
				width: 480,
				height: 320
			},
			'useragent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25'
		},
		{
			'name': 'tablet-portrait',
			'dimensions': {
				width: 768,
				height: 1024
			},
			'useragent': 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
		},
		{
			'name': 'tablet-landscape',
			'dimensions': {
				width: 1024,
				height: 768
			},
			'useragent': 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'

		}
	],
	outputDir = "output/",
	inputDir = "input/",
	dataFile = inputDir + "data.csv",
	libsDir = "../../_libs/",
	fs = require('fs'),
	system = require('system'),
	casper = require('casper').create({
		logLevel: "info"
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
			date : date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear(),
			time : date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
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
		casper.start(function(){

			if(application.global.inputURLS.length === 0){

				this.die("No URLs defined, try again.", 1);

			};

		});

		casper.eachThen(application.global.inputURLS, function(url){

			this.thenOpen(url.data, function(response){

				this.echo("Opening: " + response.url, "INFO");

				// Wait for assets to load
				// (there must be a much better way to do this?)
				this.wait(5000);

			});

			this.eachThen(viewports, function(viewport){
				viewport = viewport.data;

				this.echo("Processing: " + viewport.name, "COMMENT");

				// Resize browser
				this.viewport(viewport.dimensions.width, viewport.dimensions.height);

				this.then(function(response){

					var formattedURL = response.url.replace('https://', '').replace('http://', '').replace(/\/$/, ""),
						filename = outputDir + application.global.output.date + " " + application.global.output.time + "/" + formattedURL + "/" + viewport.name + ".png",
						height = this.evaluate(function(){

							return document.documentElement.scrollHeight

						});

					this.capture(filename, {
    					top: 0,
    					left: 0,
				        width: viewport.dimensions.width,
				        height: height
					});

					this.echo("Screenshot captured for: " + response.url, "COMMENT");

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