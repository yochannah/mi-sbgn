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

Assuming you now have a folder in your project root called `mi-sbgn`, add the bundles and css to your page:

```html
    <link rel="stylesheet" href="mi_sbgn/dist/styles.css" type="text/css">
    <script src="mi_sbgn/dist/mi-sbgn-dependencies.bundle.js"></script>
    <script src="mi_sbgn/dist/mi-sbgn-main.bundle.js"></script>

```
Somewhere in the body of your HTML, add tags that look like this: 

```html
        <div class="svgcontainer">
            <svg id="mi-sbgn" xmlns="http://www.w3.org/2000/svg" height="100" width="100">
            </svg>
        </div>
``` 
The main.bundle.js file will initialise the component with id `mi-sbgn` automatically

Optionally, add an xml export download button:


```html
            <button type="button" class="download-sbgn">
                <svg id="icon-download" viewBox="0 0 32 32">
                    <title>download</title>
                    <path d="M23 14l-8 8-8-8h5v-12h6v12zM15 22h-15v8h30v-8h-15zM28 26h-4v-2h4v2z"></path>
                </svg>
                Export as SBGN-ML</button>
```

To initialise a specific protein complex, run `initViewer("EBI-SOMECOMPLEXHERE")`, e.g.

```html
    <script>
        initViewer("EBI-10828997");
    </script>

```

## building from source

We use webpack to build the js into two bundles

To automatically build files while editing them, run this from the mi-sbgn directory root:

```bash
./node_modules/.bin/webpack --config webpack.config.js --watch
```
