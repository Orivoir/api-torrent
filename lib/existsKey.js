module.exports = function(key) {
  return !!(require('./../keys.json').find(k => k === key));
};
