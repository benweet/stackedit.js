const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.stackedit-iframe-open {
  overflow: hidden;
}

.stackedit-button-wrapper a {
  color: #0c93e4;
  font-size: 0.85em;
  text-decoration: underline;
}

.stackedit-button-wrapper a:hover,
.stackedit-button-wrapper a:focus {
  text-decoration: none;
}

.stackedit-button-wrapper img {
  width: 1.33em;
  height: 1.33em;
  vertical-align: text-bottom;
  margin-left: 0.33em;
}
`;
document.head.appendChild(style);

class Stackedit {
  options = {};
  open = false;

  constructor(opts) {
    // Override options
    Object.keys(opts).forEach((key) => {
      this.options[key] = opts[key];
    });
  }

  open() {
    this.close();
  }

  close() {
    if (this.open) {
      // do close
    }
  }
}

export default Stackedit;
