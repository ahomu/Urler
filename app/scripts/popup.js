"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

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
  "click #open-og-url": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-og-url"
    }, function () {
      window.close();
    });
  },
  "click #open-og-image": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-og-image"
    }, function () {
      window.close();
    });
  },
  "click #open-twitter-url": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-twitter-url"
    }, function () {
      window.close();
    });
  },
  "click #open-twitter-image": function () {
    chrome.runtime.sendMessage({
      type: "ui:open-twitter-image"
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
  },
  "click #open-structured-data": function () {
    console.log("hogehoge");
    chrome.runtime.sendMessage({
      type: "ui:open-structured-data"
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
  var createHandler = function (selector, handler) {
    /**
     * @param {Event} evt
     */
    return function (evt) {
      var host = evt.currentTarget,
          target = evt.target;

      do {
        if (target === host) {
          // not delegate
          break;
        }
        if (target.webkitMatchesSelector(selector)) {
          handler.apply(this, arguments);
          break;
        }
      } while (target = target.parentNode);
    };
  };

  // listeners
  Object.keys(listeners).forEach(function (eventAndSelector) {
    var _eventAndSelector$split = eventAndSelector.split(REX_EVENT_SPRITTER);

    var _eventAndSelector$split2 = _slicedToArray(_eventAndSelector$split, 2);

    var event = _eventAndSelector$split2[0];
    var selector = _eventAndSelector$split2[1];
    var delegated = undefined;var listener = undefined;

    listener = listeners[eventAndSelector];
    delegated = createHandler(selector, listener);
    document.body.addEventListener(event, delegated, true);
  });
});