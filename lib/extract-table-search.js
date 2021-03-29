module.exports = function(searchContentHtml) {

  const openText = 'film-table"';

  const openTable = searchContentHtml.indexOf(openText);
  const closeTable = searchContentHtml.lastIndexOf('</table>');

  return searchContentHtml.slice(
    openTable + openText.length,
    closeTable
  );
}
