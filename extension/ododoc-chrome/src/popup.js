'use strict';

document.getElementById('startTracking').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "startTracking" });
});

document.getElementById('stopTracking').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "stopTracking" });
});
