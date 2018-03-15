/* eslint-disable prefer-arrow-callback, comma-dangle */
/* global Stackedit */

function makeEditButton(el) {
  const div = document.createElement('div');
  div.className = 'stackedit-button-wrapper';
  div.innerHTML = '<a href="javascript:void(0)"><img src="icon.svg">Edit with StackEdit</a>';
  el.parentNode.insertBefore(div, el.nextSibling);
  return div.getElementsByTagName('a')[0];
}

const textareaEl = document.querySelector('textarea');
makeEditButton(textareaEl)
  .addEventListener('click', function onClick() {
    const stackedit = new Stackedit();
    stackedit.on('fileChange', function onFileChange(file) {
      textareaEl.value = file.content.text;
    });
    stackedit.openFile({
      name: 'Markdown with StackEdit',
      content: {
        text: textareaEl.value
      }
    });
  });

const htmlEl = document.querySelector('.html');
let markdown = 'Hello **Markdown** writer!';

function doOpen(background) {
  const stackedit = new Stackedit();
  stackedit.on('fileChange', function onFileChange(file) {
    markdown = file.content.text;
    htmlEl.innerHTML = file.content.html;
  });
  stackedit.openFile({
    name: 'HTML with StackEdit',
    content: {
      text: markdown
    }
  }, background);
}

doOpen(true);
makeEditButton(htmlEl)
  .addEventListener('click', function onClick() {
    doOpen(false);
  });

