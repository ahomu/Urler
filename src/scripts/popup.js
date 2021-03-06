'use strict';

let global = chrome.extension.getBackgroundPage();

let listeners = {
  'change [type="radio"]': function(e) {
    localStorage.setItem('lastSelected', e.target.value);
  },
  'click #copy-url-md': function() {
    chrome.runtime.sendMessage({
      type   :  `ui:copy-tab-${isAllTabsTargeted() ? 'all' : 'url'}`,
      format : 'markdown'
    });
    window.close();
  },
  'click #copy-url-a': function() {
    chrome.runtime.sendMessage({
      type   : `ui:copy-tab-${isAllTabsTargeted() ? 'all' : 'url'}`,
      format : 'anchor'
    });
    window.close();
  },
  'click #copy-url-raw': function() {
    chrome.runtime.sendMessage({
      type   : `ui:copy-tab-${isAllTabsTargeted() ? 'all' : 'url'}`,
      format : 'raw'
    });
    window.close();
  },
  'click #open-og-url': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:open-og-url'
    }, function() {
      window.close();
    });
  },
  'click #open-og-image': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:open-og-image'
    }, function() {
      window.close();
    });
  },
  'click #open-twitter-url': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:open-twitter-url'
    }, function() {
      window.close();
    });
  },
  'click #open-twitter-image': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:open-twitter-image'
    }, function() {
      window.close();
    });
  },
  'click #open-canonical': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:open-canonical'
    }, function() {
      window.close();
    });
  },
  'click #open-fb-debugger': function() {
    chrome.runtime.sendMessage({
      type   : 'ui:open-fb-debugger'
    }, function() {
      window.close();
    });
  },
  'click #open-structured-data': function() {
    console.log('hogehoge');
    chrome.runtime.sendMessage({
      type   : 'ui:open-structured-data'
    }, function() {
      window.close();
    });
  }
};

const REX_EVENT_SPRITTER = /\s+/;

function isAllTabsTargeted() {
  return !!document.querySelector('input[name="target"]:checked');
}

document.addEventListener('DOMContentLoaded', function() {

  // listeners
  Object.keys(listeners).forEach((eventAndSelector)=> {
    let [event, selector] = eventAndSelector.split(REX_EVENT_SPRITTER),
        delegated, listener;

    listener = listeners[eventAndSelector];
    delegated = createHandler(selector, listener);
    document.body.addEventListener(event, delegated, true);
  });

  function createHandler(selector, handler) {
    /**
     * @param {Event} evt
     */
    return function(evt) {
      let host   = evt.currentTarget,
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
