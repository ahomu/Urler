'use strict';

console.log('\'Allo \'Allo! Popup script');

var global = chrome.extension.getBackgroundPage();

var listeners = {
  'change [type="radio"]': function(e) {
    localStorage.setItem('lastSelected', e.target.value);
  },
  'click #copy-tab-url': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:copy-tab-url',
      format : getFormat()
    });
    window.close();
  },
  'click #copy-tab-all': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:copy-tab-all',
      format : getFormat()
    });
    window.close();
  },
  'click #copy-ogp-url': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:copy-ogp-url'
    }, function() {
      window.close();
    });
  },
  'click #copy-ogp-image': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:copy-ogp-image'
    }, function() {
      window.close();
    });
  },
  'click #copy-canonical': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:copy-canonical'
    }, function() {
      window.close();
    });
  },
  'click #copy-fb-debugger': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:copy-fb-debugger'
    }, function() {
      window.close();
    });
  }
};

const REX_EVENT_SPRITTER = /\s+/;

function getFormat() {
  return document.querySelector('input[name="format"]:checked').value;
}

document.addEventListener('DOMContentLoaded', function() {

  // listeners
  Object.keys(listeners).forEach((eventAndSelector)=> {
    var [event, selector] = eventAndSelector.split(REX_EVENT_SPRITTER),
        delegated, listener;

    listener = listeners[eventAndSelector];
    delegated = createHandler(selector, listener);
    document.body.addEventListener(event, delegated, true);
  });

  // checked
  var lastSelected = localStorage.getItem('lastSelected') || 'markdown';
  console.info(lastSelected);
  document.querySelector(`[type="radio"][value="${lastSelected}"]`).setAttribute('checked', true);

  function createHandler(selector, handler) {
    /**
     * @param {Event} evt
     */
    return function(evt) {
      var host   = evt.currentTarget,
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
      } while ((target = target.parentNode));
    }
  }
});