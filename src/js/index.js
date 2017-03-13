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
            if (styles.hasOwnProperty(property)) {
                el.style[property] = styles[property];
            }
        }


    });

})();


(function(){

    function testmeout() {
        return "dog";
    }

    const PI = 3.141593;


    var materials = [
        'Hydrogen',
        'Helium',
        'Lithium',
        'Beryllium'
    ];

    var materialsLength1 = materials.map(function(material) {
        return material.length;
    });

    var materialsLength2 = materials.map((material) => {
            return material.length;
    });

    var materialsLength3 = materials.map(material => material.length);

    console.log([PI, materialsLength1, materialsLength2, materialsLength3, testmeout()]);

})();