const styleContent = `
.stackedit-no-overflow {
  overflow: hidden;
}

.stackedit-container {
  background-color: rgba(160, 160, 160, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
}

.stackedit-hidden-container {
  position: absolute;
  width: 10px;
  height: 10px;
  left: -99px;
}

.stackedit-iframe-container {
  background-color: #fff;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 95%;
  width: 90%;
  max-width: 1280px;
  border-radius: 2px;
  overflow: hidden;
}

@media (max-width: 920px) {
  .stackedit-iframe-container {
    width: 95%;
  }
}

.stackedit-iframe {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 0;
  border-radius: 2px;
}

@media (max-width: 740px) {
  .stackedit-iframe-container {
    height: 100%;
    width: 100%;
    border-radius: 0;
  }

  .stackedit-iframe {
    border-radius: 0;
  }
}

.stackedit-close-button {
  position: absolute;
  width: 38px;
  height: 36px;
  margin: 4px;
  padding: 0 4px;
  text-align: center;
  vertical-align: middle;
  border-radius: 2px;
  text-decoration: none;
}
`;

let createStyle = () => {
  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.innerHTML = styleContent;
  document.head.appendChild(styleEl);
  createStyle = () => {}; // Create style only once
};

const containerHtml = `
<div class="stackedit-iframe-container">
  <iframe class="stackedit-iframe"></iframe>
  <a href="javascript:void(0)" class="stackedit-close-button" title="Close">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#777" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
    </svg>
  </a>
</div>
`;

const origin = `${location.protocol}//${location.host}`;
const urlParser = document.createElement('a');

class Stackedit {
  $options = {
    url: 'https://stackedit.io/app',
  };

  constructor(opts = {}) {
    // Override options
    Object.keys(opts).forEach((key) => {
      this.$options[key] = opts[key];
    });
  }

  // For emitting events
  $listeners = {};
  $trigger(type, payload) {
    const listeners = this.$listeners[type] || [];
    // Use setTimeout as a way to ignore errors
    listeners.forEach(listener => setTimeout(() => listener(payload), 1));
  }

  on(type, listener) {
    const listeners = this.$listeners[type] || [];
    listeners.push(listener);
    this.$listeners[type] = listeners;
  }

  off(type, listener) {
    const listeners = this.$listeners[type] || [];
    const idx = listeners.indexOf(listener);
    if (idx >= 0) {
      listeners.splice(idx, 1);
      if (listeners.length) {
        this.$listeners[type] = listeners;
      } else {
        delete this.$listeners[type];
      }
    }
  }

  openFile(file = {}, silent = false) {
    // Close before opening a new iframe
    this.close();

    // Make StackEdit URL
    urlParser.href = this.$options.url;
    this.$origin = `${urlParser.protocol}//${urlParser.host}`; // Save StackEdit origin
    const content = file.content || {};
    const params = {
      origin,
      fileName: file.name,
      contentText: content.text,
      contentProperties: !content.yamlProperties && content.properties
        ? JSON.stringify(content.properties) // Use JSON serialized properties as YAML properties
        : content.yamlProperties,
      silent,
    };
    const serializedParams = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key] || '')}`)
      .join('&');
    urlParser.hash = `#${serializedParams}`;

    // Make the iframe
    createStyle();
    this.$containerEl = document.createElement('div');
    this.$containerEl.className = silent
      ? 'stackedit-hidden-container'
      : 'stackedit-container';
    this.$containerEl.innerHTML = containerHtml;
    document.body.appendChild(this.$containerEl);

    // Load StackEdit in the iframe
    const iframeEl = this.$containerEl.querySelector('iframe');
    iframeEl.src = urlParser.href;

    // Add close button handler
    const closeButton = this.$containerEl.querySelector('a');
    closeButton.addEventListener('click', () => this.close());

    // Add message handler
    this.$messageHandler = (event) => {
      if (event.origin === this.$origin && event.source === iframeEl.contentWindow) {
        switch (event.data.type) {
          case 'ready':
            // StackEdit has its own one close button
            closeButton.parentNode.removeChild(closeButton);
            break;
          case 'fileChange':
            // Trigger fileChange event
            this.$trigger('fileChange', event.data.payload);
            if (silent) {
              this.close();
            }
            break;
          case 'close':
          default:
            this.close();
        }
      }
    };
    window.addEventListener('message', this.$messageHandler);

    if (!silent) {
      // Remove body scrollbars
      document.body.className += ' stackedit-no-overflow';
    }
  }

  close() {
    if (this.$messageHandler) {
      // Clean everything
      window.removeEventListener('message', this.$messageHandler);
      document.body.removeChild(this.$containerEl);

      // Release memory
      this.$messageHandler = null;
      this.$containerEl = null;

      // Restore body scrollbars
      document.body.className = document.body.className.replace(/\sstackedit-no-overflow\b/, '');

      // Trigger close event
      this.$trigger('close');
    }
  }
}

export default Stackedit;
