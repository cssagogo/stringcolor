/* https://bgrins.github.io/TinyColor/docs/tinycolor.html */

var stringcolor = function () {

    'use strict';

    return {

        init: function () {

            var that = this;

            [].forEach.call(document.querySelectorAll('[data-stringcolor]'), function(val, i) {

                var el = document.querySelectorAll('[data-stringcolor]')[i];
                var text = el.getAttribute('value') || el.getAttribute('data-stringcolor') || el.textContent || el.innerText;

                var color = that.getHSL(text);

                that.updateHSL(el, color);


            });

        },
        getHSL: function (text) {

            text = text.split('');

            var color = {};
            color.hue           = 360/26;
            color.saturation    = 60;
            color.lightness     = 55;

            for (var i = 0; i < text.length; i++) {

                // Only look at letters...
                if (/^([A-Za-z])$/.test(text[i])) {

                    // Make case insensitive...
                    var val = this.getCharacterCode(text[i]);

                    // First character drives majority of color...
                    color.hue = (i === 0) ? parseInt(val * color.hue) : color.hue + val;

                    // Second letter drives saturation...
                    color.saturation = (i === 1) ? val + color.saturation : color.saturation;

                    // Third letter drives lightness...
                    color.lightness = (i === 2) ? (val/1.5) + color.lightness : color.lightness;

                }

            }

            return color;

        },
        getHSLstring: function (color) {
            return 'hsl(' + color.hue + ',' + color.saturation + '%,' + color.lightness + '%)';
        },
        getCharacterCode: function (character) {

            return (Math.abs(character.toUpperCase().charCodeAt(0) - 64));

        },
        updateHSL: function (el, color) {

            // Apply color...
            var hsl = this.getHSLstring(color);
            el.style.setProperty ('background-color', hsl, "important");

            
        }
        
    };

};

stringcolor().init();

