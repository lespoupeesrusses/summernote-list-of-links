/**
 * 
 * Les Poupées Russes
 * email: contact@lespoupees.paris
 * 
 */
(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {

  var body_prototype = '\
    <div class="form-group note-form-group">\
      <label class="note-form-label">Text to display</label>\
      <input class="note-link-text form-control note-form-control  note-input" type="text" />\
    </div>\
    <div class="form-group note-form-group">\
      <label class="note-form-label">Choose a link in this list</label>\
      <select class="note-link-list form-control note-form-control note-input"></select>\
    </div>'

  $.extend($.summernote.plugins, { 
    'list-of-links': function(context) {
      var self = this;
      var ui = $.summernote.ui;

      var $editor = context.layoutInfo.editor;
      var options = context.options;
      if (options.listOfLinks !== undefined) {
        var listUrl = options.listOfLinks.listUrl;
      }

      context.memo('button.list-of-links', function () {
        return ui.button({
          contents: '<i class="note-icon-unorderedlist"> <i class="note-icon-link">',
          tooltip: 'List of links',
          click: function () {
            self.show();
          }
        }).render();
      });

      this.loadList = function() {
        return $.Deferred(function(deferred) {
          if (self.data === undefined && listUrl !== undefined) {
            $.get(listUrl, function(data) {
              self.data = data;
              $.each(data, function(key, value) {
                var url = value[0];
                var label = value[1];
                $('.note-link-list').append($('<option>', { 
                  value: url,
                  text : label 
                }));
                deferred.resolve();
              });
            })
          } else {
            deferred.resolve();
          }
        });
      }

      this.initialize = function () {
        var $container = options.dialogsInBody ? $(document.body) : $editor;

        var buttonClass = 'btn btn-primary note-btn note-btn-primary note-link-btn';
        var footer = '<button type="submit" href="#" class="' + buttonClass + '">Insert link</button>';

        this.$dialog = ui.dialog({
          title: 'List of links',
          body: body_prototype,
          footer: footer
        }).render().appendTo($container);

        this.$linkText = self.$dialog.find('.note-link-text');
        this.$linkList = self.$dialog.find('.note-link-list');
        this.$linkBtn = self.$dialog.find('.note-link-btn');
      };

      this.show = function () {
        var linkInfo = context.invoke('editor.getLinkInfo');
        context.invoke('editor.saveRange');
        context.triggerEvent('dialog.shown');

        this.loadList().then(function() {
          self.showLinkDialog(linkInfo).then(function (linkInfo) {
            context.invoke('editor.restoreRange');
            context.invoke('editor.createLink', linkInfo);
          }).fail(function () {
            context.invoke('editor.restoreRange');
          });
        });
      };

      this.initButtonEvent = function(deferred, linkInfo) {
        self.$linkBtn.one('click', function(event) {
          event.preventDefault();
          var linkUrl = self.$linkList.val();
          deferred.resolve({
            range: linkInfo.range,
            url: linkUrl,
            text: self.$linkText.val(),
            isNewWindow: false
          });
          ui.hideDialog(self.$dialog);
        });
      };

      this.showLinkDialog = function (linkInfo) {
        return $.Deferred(function (deferred) {
          ui.onDialogShown(self.$dialog, function () {
            self.$linkText.val(linkInfo.text);
            self.$linkList.val(linkInfo.url);
            self.initButtonEvent(deferred, linkInfo);
          });

          ui.onDialogHidden(self.$dialog, function () {
            self.$linkBtn.off('click');
            if (deferred.state() === 'pending') {
              deferred.reject();
            }
          });
          ui.showDialog(self.$dialog);
        });
      };
    } 
  });
}));
