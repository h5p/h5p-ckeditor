H5P.CKEditor = (function (EventDispatcher, $) {

  const DefaultCKEditorConfig = {
    removePlugins: ['MathType'],
    toolbar: [
      'style', 'heading', '|', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'link', '|', 'insertTable'
    ],
  }
  
  /**
   * Constructor
   * @param {string} targetId The id of the DOM lement beeing replaced by CK
   * @param {string} languageCode The two letter language code
   * @param {H5P.jQuery} dialogContainer The DOM element the CK editor
   *                                     dialogs should be attached to
   * @param {string} [initialContent] The inital content of CK
   * @param {Object} [config] Configuration options for CK. If not set, the
   *                          DefaultCKEditorConfig will be used
   * @constructor
   */
  function CKEditor(targetId, languageCode, $dialogContainer, initialContent, config) {
    EventDispatcher.call(this);

    let self = this;
    let ckInstance;
    const data = initialContent;

    config = config || DefaultCKEditorConfig;
    config.defaultLanguage = config.language = languageCode;

    const initCKEditor = function () {
      let $target = $('#' + targetId);

      // Abort if target is gone
      if(!$target.is(':visible')) {
        return ;
      }

      // Create the CKEditor instance
      window.ClassicEditor.create($target.get(0), config)
      .then(editor => {
        editor.ui.element.classList.add("h5p-ckeditor");
        editor.ui.element.style.height = '100%';
        editor.ui.element.style.width = '100%';

        ckInstance = editor;
      })
      .catch(e => {
        throw new Error('Error loading CKEditor of target ' + targetId + ': ' + e);
      });
    }

    self.create = function () {
      if (!window.ClassicEditor) {
        // Load the CKEditor script if it hasn't been loaded yet
        const script = document.createElement('script');
        script.src = H5P.getLibraryPath('H5P.CKEditor-2.0') + '/build/ckeditor.js';
        script.onload = () => initCKEditor();
        document.body.appendChild(script);
      }
      else {
        initCKEditor();
      }
    }

    self.destroy = function () {
      if (self.exists()) {
        ckInstance.destroy()
      }
    }

    // Do I have a CK instance?
    self.exists = function () {
      return ckInstance !== undefined;
    };

    // Get the current CK data
    self.getData = function () {
      return self.exists() ? ckInstance.getData().trim() : (data ? data : '');
    }

    self.resize = function (width, height) {
      // No need this anymore since we have CSS set
    }
  }

  // Extends the event dispatcher
  CKEditor.prototype = Object.create(EventDispatcher.prototype);
  CKEditor.prototype.constructor = CKEditor;

  return CKEditor;
})(H5P.EventDispatcher, H5P.jQuery);
