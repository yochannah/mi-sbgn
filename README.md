# mi-sbgn
SBGN viewer for PSI-MI protein complexes from http://www.ebi.ac.uk/complexportal/home 

[Demo](https://yochannah.github.io/mi-sbgn/)

## Installing

This repository requires [npm](https://docs.npmjs.com/getting-started/installing-node) to manage dependencies. Once npm is installed:

1. Clone this repo
2. `cd mi-sbgn`
3. `npm install`

This should install all relevant dependencies, including the MI-model backbone-based application which helps us co-ordinate the protein complex data with other elements on the same page.

## Initialising the mi-sbgn viewer on an html page

Assuming you're in the mi-sbgn folder, add the bundles and css to your page:

```
    <link rel="stylesheet" href="dist/styles.css" type="text/css">
    <script src="dist/mi-sbgn-dependencies.bundle.js"></script>
    <script src="dist/mi-sbgn-main.bundle.js"></script>

```
Somewhere in the body of your HTML, add tags that look like this: 

```
        <div class="svgcontainer">
            <svg id="mi-sbgn" xmlns="http://www.w3.org/2000/svg" height="100" width="100">
            </svg>
        </div>
``` 
The main.bundle.js file will initialise the component with id `mi-sbgn` automatically

Optionally, add an xml export download button:


```
            <button type="button" class="download-sbgn">
                <svg id="icon-download" viewBox="0 0 32 32">
                    <title>download</title>
                    <path d="M23 14l-8 8-8-8h5v-12h6v12zM15 22h-15v8h30v-8h-15zM28 26h-4v-2h4v2z"></path>
                </svg>
                Export as SBGN-ML</button>
```




## building from source
webpack
