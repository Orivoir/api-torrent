module.exports = function(contentHtml) {

  const openHashIndex = contentHtml.indexOf('<strong>Hash</strong>');

  contentHtml = contentHtml.slice(openHashIndex, openHashIndex+170);

  const textOpenHashTag = '<small title="';
  const openHashTagIndex = contentHtml.indexOf(textOpenHashTag);
  const closeHashTagIndex = contentHtml.indexOf('</small>');

  const hashBrut = contentHtml.slice(openHashTagIndex + textOpenHashTag.length, closeHashTagIndex);

  const closeTagHashBrut = hashBrut.indexOf('">');

  return hashBrut.slice(closeTagHashBrut + 2,);
};
