Screenshot
=====================

Author: @nannerB / http://ibrennan.co.uk

This script will run through your defined list of URLs (input/data.csv) and generate a screenshot of each page at the defined resolutions. The results of the script will be stored in the 'output' directory.

Currently this script is only suitable for responsive layouts. In the future I will add support for adapative sites.

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

Coming soon: The ability to define different user agent strings per viewport. This will allow for adaptive sites to be proccessed. 