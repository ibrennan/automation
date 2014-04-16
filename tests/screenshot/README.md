Screenshot
=====================

Author: @nannerB / http://ibrennan.co.uk

This script will run through your defined list of URLs (input/data.csv) and generate a screenshot of each page at the defined resolutions. The results of the script will be stored in the 'output' directory.

## Instructions for use

1. Ensure you have CasperJS installed on your machine: http://casperjs.org
2. Open Terminal, and CD to the directory 'automation/tests/screen-shot'
3. Make sure that input/data.csv is populated with your URLs. Seperate URLs by linebreaks
4. Then run "casperjs app.js"
5. Follow the prompts on screen
6. When the script has finished, your results will be found in the output directory 'output'

## Settings

### Device resolutions

The following resolutions are used by default:

smartphone-portrait: 320x480
smartphone-landscape: 480 x 320
tablet-portrait: 768 x 1024
tablet-landscape: 1024 x 768
desktop: 1280 x 1024

You can change these resolutions by adjusting the 'viewports' variable at the start of the app.js script.

### User agent string

Because some sites use adaptive techniques for mobile, rather than responsive, we have to spoof the user agent string for each resolution.

The 'viewports' variable at the start of the app.js script defines these user agent strings, by default they are:

smartphone-portrait: 
"Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25"
smartphone-landscape: "Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25"
tablet-portrait: "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"
tablet-landscape: "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"
desktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36"
