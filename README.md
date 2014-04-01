Automation
=========

## Introduction

A collection of automated scripts for processing sites / content.

Uses CasperJS.


## Running Scripts

1. Ensure you have CasperJS installed on your machine: http://casperjs.org
2. Open Terminal, and CD to your script "CD ~/automation/content/critical-css"
3. Then run "casperjs app.js"
5. Follow the prompts on screen

Note: Some scripts have their own procedue to run, please check the README.md in the directory for specific steps.


## Results

All application (test / content / whatever you decide) results, by default, are output to output/results.json.

The format of this output is entirely upto you, and will be defined by the type of scripts you run.


## Template

There is a template application in /template/app.js. When starting a new CasperJS automation script you should copy this directory, and alter as required. For most uses, you'll only likely need to modify two areas of the code:

### Setup

This is where you define the general variables, and libraries required to run the script.

### Action

This is where we can evaluate our page, manipulate content, and run test scripts. At the end of the Action section we can push the data into our results object.