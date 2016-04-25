/**
 * Created by Mirek on 2016-02-16.
 */
var testsContext = require.context(".", true, /Test$/);
testsContext.keys().forEach(testsContext);
var context = require.context('../src', true, /Test$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);