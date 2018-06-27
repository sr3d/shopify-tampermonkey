(function() {
    // test modification
    var skuRegex = /SKU\:\s([\d-]+)?/;
    var sortSku = function() {

        console.log('sorting...');
        var containers = document.getElementsByClassName('line-items-section');
        console.log('Found ' + containers.length + ' containers');
        for (var i = 0; i < containers.length; i++ ) {
            var divs = containers[i].getElementsByClassName('unfulfilled-card__line_item');
            console.log(divs);
            divs = [].slice.call(divs);
            divs = divs.sort(function(a, b) {
                var skuA = a.innerText.match(skuRegex) && RegExp.$1;
                var skuB = b.innerText.match(skuRegex) && RegExp.$1;
                return skuA < skuB ? -1 :
                skuA > skuB ? 1 :
                0
            });

            /* Replace! */
            var container = containers[i].getElementsByClassName('ui-type-container')[0];
            //console.log('container', container);
            var html = "";
            for (var j = 0; j < divs.length; j++ ) {
                html += divs[j].outerHTML;
                html += '<hr class="line-item-row-separator">';
            }
            container.innerHTML = "<p><b>Sorted By SKU</b></p>" + html;
        }

    }

    function insertCustomPrintCSS() {
       var css = document.createElement("style");
       css.type = "text/css";
       css.media = "print";
       var style = [
           //
           ".unfulfilled-card__line_item { margin-top: 10px !important; border-bottom: 1px solid black; padding-bottom: 5px }",

           // increase size of item's name
           ".ui-stack-item.ui-stack-item--fill a { font-size: 1.2em; }",

           // increase SKU size
           ".ui-text-style.ui-text-style--variation-subdued p { font-weight: bold !important; font-size: 1.5em !important; }",

           // show horizontal ruler
           //".page-order-show .line-item-row-separator { display: block; }",

           // increase image size
           ".aspect-ratio--square--50 { width: 100px; height: 100px }",
           ".aspect-ratio--square--50 img { width: 100%; }",

           ".print-only { display: block !important }",

           // hide the bottom Note section
           ".ui-layout__section--secondary { display: none }",

          // make main area bigger and top section
           ".ui-layout__section--primary { width: 100% !important; }",

           // make top sidebar visible
           ".print-only #order-sidebar {display: block !important; width: 100% !important; }",


       ].join("\n");
       css.innerHTML = style;

       document.body.appendChild(css);
    }

    function insertCSS() {
       var css = document.createElement("style");
       css.type = "text/css";
       var style = [
          ".print-only { display: none; }"
       ].join("\n");
       css.innerHTML = style;
       document.body.appendChild(css);
    }


    function copySideBarToTopPageForPrint () {
        // delay until the timeline is ready;
        if ( !document.getElementById("entire_timeline") ) {
           setTimeout( copySideBarToTopPageForPrint, 500 );
           return;
        }

       var container   = document.getElementsByClassName('ui-layout__sections')[0];
       var mainContent = document.getElementsByClassName('ui-layout__section--primary')[0];
       var sideBar     = document.getElementById('order-sidebar');

        var div = document.createElement("div");
        div.className = "print-only";
        div.innerHTML = sideBar.outerHTML;
        container.insertBefore(div, container.childNodes[0]);

    }


    var delayed = function() {
          if(document.getElementsByClassName('line-items-section').length == 0) {
             setTimeout(delayed, 500);
          } else {
            sortSku();
            insertCustomPrintCSS();
            insertCSS();
            copySideBarToTopPageForPrint();
          }
    }



    //document.addEventListener('DOMContentLoaded', doStuff, false);
    window.addEventListener('load', delayed, false);


})();