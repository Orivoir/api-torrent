module.exports = function(tdLines) {

  return tdLines.map(tdLine => {

    tdLine = tdLine.split('\n');

    return tdLine
    .map(lineContent => lineContent.trim())
    .filter(lineContent => (
      lineContent.startsWith('<a title="') ||
      lineContent.startsWith('<input type="hidden" name="id" value="')
    ))
    .map(lineDataContent => {

      if(lineDataContent.startsWith('<a title="')) {

        const openText = '<a title="';
        const openTitleIndex = lineDataContent.indexOf(openText);
        const closeTitleIndex = lineDataContent.indexOf('" href="');

        const title = lineDataContent.slice(openTitleIndex+openText.length, closeTitleIndex);
        return title;

      } else {
        const openText = 'value="';
        const openIdIndex = lineDataContent.indexOf(openText);
        const closeIdIndex = lineDataContent.indexOf('">');

        const id = lineDataContent.slice(openIdIndex + openText.length, closeIdIndex);

        return parseInt(id);
      }

    })

  })
  .map(data => ({
    title: data[0],
    id: data[1]
  }))

};