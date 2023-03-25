export const ruTargetBodyScript = `
(function(w, d, s, p) { 
  var f = d.getElementsByTagName(s)[0], j = d.createElement(s); 
  j.async = true; 
  j.src = '//cdn.rutarget.ru/static/tag/tag.js'; 
  f.parentNode.insertBefore(j, f); 
  w[p] = {rtgNoSync: false, rtgSyncFrame: true}; 
})(window, document, 'script', '_rtgParams');
`;
