Medium - Article Parser
=====================

Note: Having problems with this and the forced https that medium uses. I haven't resolved it yet, but leaving the code here and will revisit at another date.

Author: @nannerB / http://ibrennan.co.uk

Although Medium (https://medium.com/) has an XML feed it doesn't return enough detail for people who want to parse entire articles for use on their own sites.

This script will scrape your latest articles, and parse them out into usable JSON.

Instructions for use:

1. Ensure you have CasperJS installed on your machine: http://casperjs.org
2. Open Terminal, and CD to the directory 'automation/content/medium-parser'
4. Then run "casperjs app.js"
5. Follow the prompts on screen
7. It will ask you for the URL you'd like to parse, this should be your Medium profile (for example https://medium.com/@nannerb)
8. Then the output file, you can leave this blank and it will default to "medium-articles.json"
9. When the script has finished, your results will be found in the output file detailed in the previous step
