var config = {};
config.enabled = 1;
config.text = 'Cookies help us deliver our services. By using our services, you agree to our use of cookies.';
config.moreLinkUrl = '/privacy-policy.html';
config.moreLinkLabel = 'Learn more';
config.buttonLabel = 'Got it!';
config.position = 'bottom';

if (config.enabled) {

    var euCookieInitialized = false;

    var hasCookie = function(key, value) {
        var regexp = new RegExp(key + '=' + value);
        return regexp.test(document.cookie);
    };

    var addEuCookieWidget = function(config) {
        if (hasCookie('eucookieconsent', '1') || euCookieInitialized) {
            return;
        }
        var body = document.querySelector('body');
        var head = document.querySelector('head');
        var css = document.createElement('STYLE');
        var widgetBar = document.createElement('DIV');
        var widgetText = document.createElement('P');
        var widgetMoreLink = document.createElement('A');
        var widgetButton = document.createElement('button');

        widgetBar.className = 'eucookiebar';
        if (config.position === 'bottom') {
            widgetBar.className = widgetBar.className + ' bottom';
        }
        widgetText.innerHTML = config.text + ' ';
        widgetMoreLink.href = config.moreLinkUrl;
        widgetMoreLink.target = '_blank';
        widgetMoreLink.innerHTML = config.moreLinkLabel;
        widgetButton.innerHTML = config.buttonLabel;
        widgetText.appendChild(widgetMoreLink);
        widgetText.innerHTML += '.';
        widgetBar.appendChild(widgetText);
        widgetBar.appendChild(widgetButton);

        css.type = 'text/css';
        css.innerHTML = '.eucookiebar button,.eucookiebar p{display:inline-block;margin:.25em .5em !important;font-family:"Lucida Grande",Geneva,Arial,Verdana,sans-serif !important;}' +
            '.eucookiebar{text-align:center;position:absolute;top:-100px;left:0;right:0;background:#fff;padding:.5% 2%;box-shadow:0 4px 10px 1px rgba(0,0,0,.2);z-index:1000;font-size:12px;font-family:"Lucida Grande",Geneva,Arial,Verdana,sans-serif;color:#666;transition:top .5s ease,bottom .5s ease}' +
            '.eucookiebar a{color:#00f;font-weight:400;text-decoration:underline}' +
            '.eucookiebar a:visited{color:#551A8B}' +
            '.eucookiebar a:active{color:red}' +
            '.eucookiebar button{background:#eee;border:1px solid #888;border-radius:4px;font-size:100%;font-weight:700;color:#666}' +
            '.eucookiebar button:hover{background:#666;color:#fff}' +
            '.eucookiebar.show{top:0;}' +
            '.eucookiebar.hide{top:-100px;}' +
            '.eucookiebar.bottom{top:auto;bottom:-100px;position:fixed;}' +
            '.eucookiebar.bottom.show{bottom:0;}' +
            '.eucookiebar.bottom.hide{bottom:-100px;}';

        head.appendChild(css);
        body.appendChild(widgetBar);

        // Without the setTimeout the animation would not work.
        setTimeout(function() {
            widgetBar.className = widgetBar.className + ' show';
        }, 10);

        widgetButton.addEventListener("click", function () {
            var expires = new Date();
            expires.setFullYear(expires.getFullYear() + 10);
            document.cookie = 'eucookieconsent=1; expires=' + expires.toUTCString();
            widgetBar.className = widgetBar.className + ' hide';
        }, false);

        euCookieInitialized = true;
    };

    var euCookieInit = function() {
        document.addEventListener("DOMContentLoaded", function () {
            addEuCookieWidget(config);
        }, false);

        // Make sure the bar is added if the JS file loads after DOMContentLoaded.
        if (!euCookieInitialized) {
            addEuCookieWidget(config);
        }
    };

    var xhrSuccess = function() {
        this.callback.apply(this, this.arguments);
    };

    var xhrError = function() {
        console.error(this.statusText);
    };

    var loadURL = function(sURL, fCallback /*, argumentToPass1, argumentToPass2, etc. */) {
        var oReq = new XMLHttpRequest();
        oReq.callback = fCallback;
        oReq.arguments = Array.prototype.slice.call(arguments, 2);
        oReq.onload = xhrSuccess;
        oReq.onerror = xhrError;
        oReq.open("get", sURL, true);
        oReq.send(null);
    };

    var testCountry = function() {
        var country = this.getResponseHeader('x-request-country');
        var euVisitor = /Austria|Belgium|Bulgaria|Croatia|Cyprus|Czech Republic|Denmark|Estonia|Finland|France|Germany|Greece|Hungary|Ireland|Italy|Latvia|Lithuania|Luxembourg|Malta|Netherlands|Poland|Portugal|Romania|Slovakia|Slovenia|Spain|Sweden|United Kingdom/.test(country);
        if (euVisitor) {
            euCookieInit();
        }
    };

    if (hasCookie('ss_beta_ui', '1')) {
        euCookieInit();
    } else {
        loadURL('/sd/support-files/eucookie.js', testCountry);
    }
}
