var raw_url  = 'https://raw.github.com/subtlepatterns/SubtlePatterns/master/';

chrome.extension.onMessage.addListener(function(message, info, cb) {
  var selector = message.selector || 'body';
  var selected = message.pattern;
  
  var code = 'var style = document.getElementById("style");';
  code += 'style.innerText = "';
  code += selector;
  code += '{ background-image: url(';
  code += selected;
  code += ') !important; }"';
  
  chrome.tabs.executeScript(null, {
    code: "var style = document.getElementById('style'); if (! style) {var style = document.createElement('style'); style.id = 'style'; document.body.appendChild(style);};"
  });
  
  chrome.tabs.executeScript(null, {
    code: code
  });
});