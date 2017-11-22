import * as cola from '../node_modules/webcola/WebCola/cola.js';
import $ from '../node_modules/jquery/dist/jquery.min.js';
import _ from '../node_modules/underscore/underscore-min.js';
import Backbone from '../node_modules/backbone/backbone-min.js';
import MIModel from '../node_modules/mi-model/dist/mi-model.js';
import * as jstoxml from '../node_modules/jstoxml/jstoxml.js';
import * as d3 from "d3";

//these are exposed to the window so people can include dependencies manually if they wish, rather than an unwieldy bundle.
window.$ = $;
window._ = _;
window.Backbone = Backbone;
window.MIModel = MIModel;
window.cola = cola;
window.d3 = d3;
window.jstoxml = jstoxml;

//note: webcola is a pain to get working. once webcola is installed, we have to set
//it up as follows: 

//$ cd node_modules/webcola & npm install - g grunt - cli & npm install & grunt

//only then can we bundle all our dependencies correctly. 