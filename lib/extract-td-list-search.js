module.exports = function(tableContentHtml) {

  const td = [];
  let i = 0;

  do {
    const openTdIndex = tableContentHtml.indexOf('<td>');
    const closeTdIndex = tableContentHtml.indexOf('</td>');

    if(closeTdIndex < openTdIndex) {
      // false line (divider or another UI elements)
      const remove = tableContentHtml.slice(closeTdIndex, closeTdIndex+5);
      tableContentHtml = tableContentHtml.replace(remove, "");
    } else {
      i++;
      const tdLine = tableContentHtml.slice(openTdIndex, closeTdIndex + 5);
      tableContentHtml = tableContentHtml.replace(tdLine, "");

      td.push(tdLine);
      if(i >= 100) {
        throw new Error("infinite loop extract-td-list");
      }
    }

  } while(tableContentHtml.indexOf('<td>') !== -1);

  return td;
};
