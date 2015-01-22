"use strict";

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

"use strict";

var global = chrome.extension.getBackgroundPage();

var listeners = {
  "change [type=\"radio\"]": function (e) {
    localStorage.setItem("lastSelected", e.target.value);
  },
  "click #copy-url-md": function () {
    chrome.runtime.sendMessage({
      type: "ui:copy-tab-" + (isAllTabsTargeted() ? "all" : "url"),
      format: "markdown"
    });
    window.close();
  },
  "click #copy-url-a": function () {
    chrome.runtime.sendMessage({
      type: "ui:copy-tab-" + (isAllTabsTargeted() ? "all" : "url"),
      format: "anchor"
    });
    window.close();
  },
  "click #copy-url-raw": function () {
    chrome.runtime.sendMessage({
      type: "ui:copy-tab-" + (isAllTabsTargeted() ? "all" : "url"),
      format: "raw"
    });
    window.close();
  },
  "click #open-ogp-url": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-ogp-url"
    }, function () {
      window.close();
    });
  },
  "click #open-ogp-image": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-ogp-image"
    }, function () {
      window.close();
    });
  },
  "click #open-canonical": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-canonical"
    }, function () {
      window.close();
    });
  },
  "click #open-fb-debugger": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-fb-debugger"
    }, function () {
      window.close();
    });
  }
};

var REX_EVENT_SPRITTER = /\s+/;

function isAllTabsTargeted() {
  return !!document.querySelector("input[name=\"target\"]:checked");
}

document.addEventListener("DOMContentLoaded", function () {
  // listeners
  Object.keys(listeners).forEach(function (eventAndSelector) {
    var _ref = eventAndSelector.split(REX_EVENT_SPRITTER);

    var _ref2 = _toArray(_ref);

    var event = _ref2[0];
    var selector = _ref2[1];
    var delegated;
    var listener;


    listener = listeners[eventAndSelector];
    delegated = createHandler(selector, listener);
    document.body.addEventListener(event, delegated, true);
  });

  // checked
  var lastSelected = localStorage.getItem("lastSelected") || "markdown";
  console.info(lastSelected);
  document.querySelector("[type=\"radio\"][value=\"" + lastSelected + "\"]").setAttribute("checked", true);

  function createHandler(selector, handler) {
    /**
     * @param {Event} evt
     */
    return function (evt) {
      var host = evt.currentTarget, target = evt.target;

      do {
        if (target === host) {
          // not delegate
          break;
        }
        if (target.webkitMatchesSelector(selector)) {
          handler.apply(this, arguments);
          break;
        }
      } while ((target = target.parentNode));
    };
  }
});