"use strict";

chrome.runtime.onInstalled.addListener(function (details) {
  console.log("previousVersion", details.previousVersion);
});

// ui:chain-case, content:chain-case
var listeners = {
  "ui:copy-tab-url": function (req, sender, done) {
    // give null when current tab is default....holy shit!!!!!!
    chrome.tabs.getSelected(null, function (currentTab) {
      var text = formatter[req.format]({
        title: currentTab.title,
        url: currentTab.url
      });
      saveToClipboard(text);

      chrome.tabs.sendMessage(currentTab.id, {
        type: "bg:dialog-notice",
        message: "Copy current tab"
      });
    });
  },
  "ui:copy-tab-all": function (req, sender, done) {
    chrome.tabs.getAllInWindow(null, function (tabs) {
      var i = 0, currentTab, tab, text = [];
      while ((tab = tabs[i++])) {
        text.push(formatter[req.format]({
          title: tab.title,
          url: tab.url
        }));
        if (tab.active) {
          currentTab = tab;
        }
      }
      saveToClipboard(text.join("\n"));

      chrome.tabs.sendMessage(currentTab.id, {
        type: "bg:dialog-notice",
        message: "Copy all tab"
      });
    });
  },
  "ui:open-ogp-url": function (req, sender, done) {
    chrome.tabs.getSelected(null, function (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, {
        type: "bg:request-og-url"
      }, function (resp) {
        if (resp.url == null) {
          chrome.tabs.sendMessage(currentTab.id, {
            type: "bg:dialog-notice",
            message: "<meta property=\"ogp:url\"> not found..."
          });
        } else {
          window.open(resp.url);;
        }
        done();
      });
    });
  },
  "ui:open-ogp-image": function (req, sender, done) {
    chrome.tabs.getSelected(null, function (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, {
        type: "bg:request-og-image"
      }, function (resp) {
        if (resp.url == null) {
          chrome.tabs.sendMessage(currentTab.id, {
            type: "bg:dialog-notice",
            message: "<meta property=\"ogp:image\"> not found..."
          });
        } else {
          window.open(resp.url);;
        }
        done();
      });
    });
  },
  "ui:open-canonical": function (req, sender, done) {
    chrome.tabs.getSelected(null, function (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, {
        type: "bg:request-canonical"
      }, function (resp) {
        if (resp.url == null) {
          chrome.tabs.sendMessage(currentTab.id, {
            type: "bg:dialog-notice",
            message: "<link rel=\"canonical\"> not found..."
          });
        } else {
          window.open(resp.url);;
        }
        done();
      });
    });
  },
  "ui:open-fb-debugger": function (req, sender, done) {
    chrome.tabs.getSelected(null, function (currentTab) {
      window.open("https://developers.facebook.com/tools/debug/og/object?q=" + encodeURIComponent(currentTab.url));;
      done();
    });
  },
  "ui:open-structured-data": function (req, sender, done) {
    chrome.tabs.getSelected(null, function (currentTab) {
      window.open("https://developers.google.com/structured-data/testing-tool/?url=" + encodeURIComponent(currentTab.url));;
      done();
    });
  }
};

/**
 * set listeners
 */
chrome.runtime.onMessage.addListener(function (req, sender, reply) {
  if (typeof req === "string") {
    req = { type: req };
  }
  if (typeof listeners[req.type] !== "function") {
    console.error("Unexpected type message received: " + req.type);
    return;
  }
  console.info("" + req.type + " received");
  listeners[req.type].apply(this, [req, sender, reply]);
});

/**
 * http://zentoo.hatenablog.com/entry/2014/01/26/200914
 * @param str
 */
function saveToClipboard(str) {
  var textArea = document.createElement("textarea");
  textArea.style.cssText = "position:absolute; left:-100%";

  document.body.appendChild(textArea);

  textArea.value = str;
  textArea.select();
  document.execCommand("copy");

  document.body.removeChild(textArea);
}

var formatter = {
  raw: function (param) {
    return "" + param.title + " " + param.url;
  },
  anchor: function (param) {
    return "<a href=\"" + param.url + "\">" + param.title + "</a>";
  },
  markdown: function (param) {
    return "[" + param.title + "](" + param.url + ")";
  }
};