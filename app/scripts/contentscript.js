"use strict";

console.log("'Allo 'Allo! Content script");

var dialog;

/**
 * dialog insertion
 */
document.addEventListener("DOMContentLoaded", function () {
  dialog = document.createElement("div");
  dialog.id = "notifier";
  dialog.className = "is-hidden";
  document.body.appendChild(dialog);
});

/**
 * listeners
 */
var listeners = {
  "bg:request-og-url": function (req, sender, done) {
    var meta = document.querySelector("meta[property=\"og:url\"]");
    done({
      url: meta ? meta.getAttribute("content") : null
    });
  },
  "bg:request-og-image": function (req, sender, done) {
    var meta = document.querySelector("meta[property=\"og:image\"]");
    done({
      url: meta ? meta.getAttribute("content") : null
    });
  },
  "bg:request-canonical": function (req, sender, done) {
    var link = document.querySelector("link[rel=\"canonical\"]");
    done({
      url: link ? link.getAttribute("href") : null
    });
  },
  "bg:dialog-notice": function (req, sender, done) {
    dialog.textContent = req.message;
    dialog.classList.remove("is-hidden");
    setTimeout(function () {
      return dialog.classList.add("is-hidden");
    }, 1500);
    done();
  }
};

/**
 * set listeners
 */
chrome.runtime.onMessage.addListener(function (req, sender, done) {
  if (typeof req === "string") {
    req = { type: req };
  }
  if (typeof listeners[req.type] !== "function") {
    console.error("Unexpected type message received: " + req.type);
    return;
  }
  console.info("" + req.type + " received");
  listeners[req.type].apply(this, arguments);
});