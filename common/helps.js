// Set start point
var _start_point = BasUtils;

// Helps
(function (mtr) {
    _start_point.helps = {};
    var _this = function(){return _start_point.helps;}();

    /* --------------------------------------- */
    /* Delay
    /* --------------------------------------- */
    _this.delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    /* --------------------------------------- */
    /* Get image Base 64
    /* --------------------------------------- */
    _this.get_img_base_64 = function(src) {
        return src.indexOf('data:image') !== -1 ? src.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, ""):null;
    };

    /* --------------------------------------- */
    /* Add http
    /* --------------------------------------- */
    _this.add_http = function(url) {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    };

    /* --------------------------------------- */
    /* Popup window
    /* --------------------------------------- */
    _this.popup_window = function(url, opts) {
        var defaults = {
            center:      "screen", //true, screen || parent || undefined, null, "", false
            createNew:   true,
            height:      500,
            left:        0,
            location:    false,
            menubar:     false,
            name:        null,
            onUnload:    null,
            resizable:   false,
            scrollbars:  false, // os x always adds scrollbars
            status:      false,
            toolbar:     false,
            top:         0,
            width:       500
        };

        var options = $.extend({}, defaults, opts);

        // center the window
        if (options.center === "parent") {
            options.top = window.screenY + Math.round(($(window).height() - options.height) / 2);
            options.left = window.screenX + Math.round(($(window).width() - options.width) / 2);
        } else if (options.center === true || options.center === "screen") {
            var screenLeft = (typeof window.screenLeft !== 'undefined') ? window.screenLeft : screen.left;

            options.top = ((screen.height - options.height) / 2) - 50;
            options.left = screenLeft + (screen.width - options.width) / 2;
        }

        // params
        var params = [];
        params.push('location=' + (options.location ? 'yes' : 'no'));
        params.push('menubar=' + (options.menubar ? 'yes' : 'no'));
        params.push('toolbar=' + (options.toolbar ? 'yes' : 'no'));
        params.push('scrollbars=' + (options.scrollbars ? 'yes' : 'no'));
        params.push('status=' + (options.status ? 'yes' : 'no'));
        params.push('resizable=' + (options.resizable ? 'yes' : 'no'));
        params.push('height=' + options.height);
        params.push('width=' + options.width);
        params.push('left=' + options.left);
        params.push('top=' + options.top);

        // open window
        var random = new Date().getTime();
        var name = options.name || (options.createNew ? 'popup_window_' + random : 'popup_window');
        var win = window.open(url, name, params.join(','));

        // unload handler
        if (options.onUnload && typeof options.onUnload === 'function') {
            var unloadInterval = setInterval(function() {
                if (!win || win.closed) {
                    clearInterval(unloadInterval);
                    options.onUnload();
                }
            }, 50);
        }

        // focus window
        if (win && win.focus) {
            win.focus();
        }

        // return handle to window
        return win;
    };

    // Init
    _this.init = function() {
        //...
    };

    // Update
    _this.update = function() {
        // ...
    };

    // Meteor startup
    mtr.startup(function () {
        // Init
        _this.init();
    });

}( Meteor ));