
var $ = jQuery.noConflict();

import 'lightbox2/dist/js/lightbox.min.js';
import 'lightbox2/dist/css/lightbox.min.css';


var numberOfImages = 34;
var gallery = [];

for (var i = 1; i <= numberOfImages; i++) {
    console.log('pushing');
    gallery.push('gallery-' + i + '.jpg');
}

Template.gallery.helpers({
    photos() {
        return gallery;
    }
});



