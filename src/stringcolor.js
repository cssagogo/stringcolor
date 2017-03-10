// STRING TO COLOR
(function(){

    [].forEach.call(document.querySelectorAll('[data-stringcolor]'), function(val, i) {

        var el, text, h, s, l, styles;

        el = document.querySelectorAll('[data-stringcolor]')[i];
        text = el.getAttribute('value') || el.getAttribute('data-stringcolor') || el.textContent || el.innerText;

        h = 360/26;
        s = 60;
        l = 55;

        // Add up character code values of each character in string...
        [].forEach.call(text.split(''), function(val, i) {

            // Only look at letters...
            if (/^([A-Za-z])$/.test(val)) {

                // Make case incensitive...
                val = (Math.abs(val.toUpperCase().charCodeAt(0) - 64));

                // First character drives majority of hue...
                h = (i === 0) ? val * h : h + val;

                // Second letter drives saturation...
                s = (i === 1) ? val + s : s;

                // Third letter drives lightness...
                l = (i === 2) ? (val/1.5) + l : l;
            }

        });

        // Apply color...
        styles = {
            'background-color': 'hsl('+parseInt(h)+','+s+'%,'+l+'%) !important'
        };

        for (var property in styles) {
            el.style[property] = styles[property];
        }

    });

})();