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

var	scriptName = "404 Checker",
	limit = 0,
	outputDir = "output/",
	libsDir = "../../_libs/",
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

		//system.stdout.writeLine("What is the URL of the site you want to check?");

		//application.global.inputURLS.push(system.stdin.readLine().replace("\n",""));

		application.global.inputURLS.push("http://akzotest.duluxtradepaintexpert.co.uk");

		application.crawl();

	},

	/*	
	 ######  ########     ###    ##      ## ##       
	##    ## ##     ##   ## ##   ##  ##  ## ##       
	##       ##     ##  ##   ##  ##  ##  ## ##       
	##       ########  ##     ## ##  ##  ## ##       
	##       ##   ##   ######### ##  ##  ## ##       
	##    ## ##    ##  ##     ## ##  ##  ## ##       
	 ######  ##     ## ##     ##  ###  ###  ######## 
	*/

	crawl : function(url){

		casper.start().then(function() {

			this.eachThen(application.global.inputURLS, function(url){

				if(!application.global.output.result[url.data]){

					this.echo("Crawling: " + url.data, "INFO_BAR");

					application.global.output.result[url.data] = {
						crawled : false,
						code : 0
					};

					this.thenOpen(url.data, function(){

						var links = this.evaluate(function(){

							var links = [];

							$("a[href^='"+window.location.origin+"'], a[href^='/'], a[href^='./'], a[href^='../']").each(function(){

								links.push($(this).attr("href"));

							});

							return links;

						});

						for(var i=0; i<links.length; i++){

							if(application.global.inputURLS.indexOf(links[i]) === -1){

								application.global.inputURLS.push(links[i]);

							};

						}

						

					});

				
					application.global.output.result[url.data]['crawled'] = true;

					this.then(function() {

						if (this.currentHTTPStatus === 404) {

							this.echo("404: " + url.data, "WARNING");

						} else if (this.currentHTTPStatus === 500) {

						    this.echo("500: " + url.data, "ERROR");

						} else {

							this.echo(this.currentHTTPStatus + ": " + url.data, "GREEN_BAR");

						};

					});
					
					application.global.output.result[url.data]['status'] = this.currentHTTPStatus;

				}

			}, application);

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

		casper.run();

	}

} // application

application.init();