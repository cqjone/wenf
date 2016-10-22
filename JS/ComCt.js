End = {};

/*
*   自定义弹出框，主要是 密码输入
*/
End.Msg = function () {
    var dlg, opt, mask, waitTimer,
        bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl,
        buttons, activeTextEl, bwidth, bufferIcon = '', iconCls = '',
        buttonNames = ['ok', 'yes', 'no', 'cancel'];

    // private
    var handleButton = function (button) {
        buttons[button].blur();
        if (dlg.isVisible()) {
            dlg.hide();
            handleHide();
            Ext.callback(opt.fn, opt.scope || window, [button, activeTextEl.dom.value, opt], 1);
        }
    };

    // private
    var handleHide = function () {
        if (opt && opt.cls) {
            dlg.el.removeClass(opt.cls);
        }
        progressBar.reset();
    };

    // private
    var handleEsc = function (d, k, e) {
        if (opt && opt.closable !== false) {
            dlg.hide();
            handleHide();
        }
        if (e) {
            e.stopEvent();
        }
    };

    // private
    var updateButtons = function (b) {
        var width = 0,
            cfg;
        if (!b) {
            Ext.each(buttonNames, function (name) {
                buttons[name].hide();
            });
            return width;
        }
        dlg.footer.dom.style.display = '';
        Ext.iterate(buttons, function (name, btn) {
            cfg = b[name];
            if (cfg) {
                btn.show();
                btn.setText(Ext.isString(cfg) ? cfg : Ext.MessageBox.buttonText[name]);
                width += btn.getEl().getWidth() + 15;
            } else {
                btn.hide();
            }
        });
        return width;
    };

    return {
        /**
        * Returns a reference to the underlying {@link Ext.Window} element
        * @return {Ext.Window} The window
        */
        getDialog: function (titleText) {
            if (!dlg) {
                var btns = [];

                buttons = {};
                Ext.each(buttonNames, function (name) {
                    btns.push(buttons[name] = new Ext.Button({
                        text: this.buttonText[name],
                        handler: handleButton.createCallback(name),
                        hideMode: 'offsets'
                    }));
                }, this);
                dlg = new Ext.Window({
                    autoCreate: true,
                    title: titleText,
                    resizable: false,
                    constrain: true,
                    constrainHeader: true,
                    minimizable: false,
                    maximizable: false,
                    stateful: false,
                    modal: true,
                    shim: true,
                    buttonAlign: "center",
                    width: 400,
                    height: 100,
                    minHeight: 80,
                    plain: true,
                    footer: true,
                    closable: true,
                    close: function () {
                        if (opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel) {
                            handleButton("no");
                        } else {
                            handleButton("cancel");
                        }
                    },
                    fbar: new Ext.Toolbar({
                        items: btns,
                        enableOverflow: false
                    })
                });
                dlg.render(document.body);
                dlg.getEl().addClass('x-window-dlg');
                mask = dlg.mask;
                bodyEl = dlg.body.createChild({
                    html: '<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="password" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
                });
                iconEl = Ext.get(bodyEl.dom.firstChild);
                var contentEl = bodyEl.dom.childNodes[1];
                msgEl = Ext.get(contentEl.firstChild);
                textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10, 13], function () {
                    if (dlg.isVisible() && opt && opt.buttons) {
                        if (opt.buttons.ok) {
                            handleButton("ok");
                        } else if (opt.buttons.yes) {
                            handleButton("yes");
                        }
                    }
                });
                textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
                textareaEl.enableDisplayMode();
                progressBar = new Ext.ProgressBar({
                    renderTo: bodyEl
                });
                bodyEl.createChild({ cls: 'x-clear' });
            }
            return dlg;
        },

        /**
        * Updates the message box body text
        * @param {String} text (optional) Replaces the message box element's innerHTML with the specified string (defaults to
        * the XHTML-compliant non-breaking space character '&amp;#160;')
        * @return {Ext.MessageBox} this
        */
        updateText: function (text) {
            if (!dlg.isVisible() && !opt.width) {
                dlg.setSize(this.maxWidth, 100); // resize first so content is never clipped from previous shows
            }
            // Append a space here for sizing. In IE, for some reason, it wraps text incorrectly without one in some cases
            msgEl.update(text ? text + ' ' : '&#160;');

            var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0,
                mw = msgEl.getWidth() + msgEl.getMargins('lr'),
                fw = dlg.getFrameWidth('lr'),
                bw = dlg.body.getFrameWidth('lr'),
                w;

            w = Math.max(Math.min(opt.width || iw + mw + fw + bw, opt.maxWidth || this.maxWidth),
                    Math.max(opt.minWidth || this.minWidth, bwidth || 0));

            if (opt.prompt === true) {
                activeTextEl.setWidth(w - iw - fw - bw);
            }
            if (opt.progress === true || opt.wait === true) {
                progressBar.setSize(w - iw - fw - bw);
            }
            if (Ext.isIE && w == bwidth) {
                w += 4; //Add offset when the content width is smaller than the buttons.    
            }
            msgEl.update(text || '&#160;');
            dlg.setSize(w, 'auto').center();
            return this;
        },

        /**
        * Updates a progress-style message box's text and progress bar. Only relevant on message boxes
        * initiated via {@link Ext.MessageBox#progress} or {@link Ext.MessageBox#wait},
        * or by calling {@link Ext.MessageBox#show} with progress: true.
        * @param {Number} value Any number between 0 and 1 (e.g., .5, defaults to 0)
        * @param {String} progressText The progress text to display inside the progress bar (defaults to '')
        * @param {String} msg The message box's body text is replaced with the specified string (defaults to undefined
        * so that any existing body text will not get overwritten by default unless a new value is passed in)
        * @return {Ext.MessageBox} this
        */
        updateProgress: function (value, progressText, msg) {
            progressBar.updateProgress(value, progressText);
            if (msg) {
                this.updateText(msg);
            }
            return this;
        },

        /**
        * Returns true if the message box is currently displayed
        * @return {Boolean} True if the message box is visible, else false
        */
        isVisible: function () {
            return dlg && dlg.isVisible();
        },

        /**
        * Hides the message box if it is displayed
        * @return {Ext.MessageBox} this
        */
        hide: function () {
            var proxy = dlg ? dlg.activeGhost : null;
            if (this.isVisible() || proxy) {
                dlg.hide();
                handleHide();
                if (proxy) {
                    // unghost is a private function, but i saw no better solution
                    // to fix the locking problem when dragging while it closes
                    dlg.unghost(false, false);
                }
            }
            return this;
        },

       
        show: function (options) {
            if (this.isVisible()) {
                this.hide();
            }
            opt = options;
            var d = this.getDialog(opt.title || "&#160;");

            d.setTitle(opt.title || "&#160;");
            var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
            d.tools.close.setDisplayed(allowClose);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if (opt.prompt) {
                if (opt.multiline) {
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(Ext.isNumber(opt.multiline) ? opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                } else {
                    textboxEl.show();
                    textareaEl.hide();
                }
            } else {
                textboxEl.hide();
                textareaEl.hide();
            }
            activeTextEl.dom.value = opt.value || "";
            if (opt.prompt) {
                d.focusEl = activeTextEl;
            } else {
                var bs = opt.buttons;
                var db = null;
                if (bs && bs.ok) {
                    db = buttons["ok"];
                } else if (bs && bs.yes) {
                    db = buttons["yes"];
                }
                if (db) {
                    d.focusEl = db;
                }
            }
            if (Ext.isDefined(opt.iconCls)) {
                d.setIconClass(opt.iconCls);
            }
            this.setIcon(Ext.isDefined(opt.icon) ? opt.icon : bufferIcon);
            bwidth = updateButtons(opt.buttons);
            progressBar.setVisible(opt.progress === true || opt.wait === true);
            this.updateProgress(0, opt.progressText);
            this.updateText(opt.msg);
            if (opt.cls) {
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === true;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            if (!d.isVisible()) {
                // force it to the end of the z-index stack so it gets a cursor in FF
                document.body.appendChild(dlg.el.dom);
                d.setAnimateTarget(opt.animEl);
                //workaround for window internally enabling keymap in afterShow
                d.on('show', function () {
                    if (allowClose === true) {
                        d.keyMap.enable();
                    } else {
                        d.keyMap.disable();
                    }
                }, this, { single: true });
                d.show(opt.animEl);
            }
            if (opt.wait === true) {
                progressBar.wait(opt.waitConfig);
            }
            return this;
        },

        /**
        * Adds the specified icon to the dialog.  By default, the class 'ext-mb-icon' is applied for default
        * styling, and the class passed in is expected to supply the background image url. Pass in empty string ('')
        * to clear any existing icon. This method must be called before the MessageBox is shown.
        * The following built-in icon classes are supported, but you can also pass in a custom class name:
        * <pre>
        Ext.MessageBox.INFO
        Ext.MessageBox.WARNING
        Ext.MessageBox.QUESTION
        Ext.MessageBox.ERROR
        *</pre>
        * @param {String} icon A CSS classname specifying the icon's background image url, or empty string to clear the icon
        * @return {Ext.MessageBox} this
        */
        setIcon: function (icon) {
            if (!dlg) {
                bufferIcon = icon;
                return;
            }
            bufferIcon = undefined;
            if (icon && icon != '') {
                iconEl.removeClass('x-hidden');
                iconEl.replaceClass(iconCls, icon);
                bodyEl.addClass('x-dlg-icon');
                iconCls = icon;
            } else {
                iconEl.replaceClass(iconCls, 'x-hidden');
                bodyEl.removeClass('x-dlg-icon');
                iconCls = '';
            }
            return this;
        },

        /* 密码登陆框
        */
        password: function (title, msg, fn, scope, multiline, value) {
        this.show({
        title: title,
        msg: msg,
        buttons: this.OKCANCEL,
        fn: fn,
        minWidth: this.minPromptWidth,
        scope: scope,
        prompt: true,
        multiline: multiline,
        value: value
        });
        return this;
        },

        /**
        * Button config that displays a single OK button
        * @type Object
        */
        OK: { ok: true },
        /**
        * Button config that displays a single Cancel button
        * @type Object
        */
        CANCEL: { cancel: true },
        /**
        * Button config that displays OK and Cancel buttons
        * @type Object
        */
        OKCANCEL: { ok: true, cancel: true },
        /**
        * Button config that displays Yes and No buttons
        * @type Object
        */
        YESNO: { yes: true, no: true },
        /**
        * Button config that displays Yes, No and Cancel buttons
        * @type Object
        */
        YESNOCANCEL: { yes: true, no: true, cancel: true },
        /**
        * The CSS class that provides the INFO icon image
        * @type String
        */
        INFO: 'ext-mb-info',
        /**
        * The CSS class that provides the WARNING icon image
        * @type String
        */
        WARNING: 'ext-mb-warning',
        /**
        * The CSS class that provides the QUESTION icon image
        * @type String
        */
        QUESTION: 'ext-mb-question',
        /**
        * The CSS class that provides the ERROR icon image
        * @type String
        */
        ERROR: 'ext-mb-error',

        /**
        * The default height in pixels of the message box's multiline textarea if displayed (defaults to 75)
        * @type Number
        */
        defaultTextHeight: 75,
        /**
        * The maximum width in pixels of the message box (defaults to 600)
        * @type Number
        */
        maxWidth: 600,
        /**
        * The minimum width in pixels of the message box (defaults to 100)
        * @type Number
        */
        minWidth: 100,
        /**
        * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
        * for setting a different minimum width than text-only dialogs may need (defaults to 250).
        * @type Number
        */
        minProgressWidth: 250,
        /**
        * The minimum width in pixels of the message box if it is a prompt dialog.  This is useful
        * for setting a different minimum width than text-only dialogs may need (defaults to 250).
        * @type Number
        */
        minPromptWidth: 250,
        /**
        * An object containing the default button text strings that can be overriden for localized language support.
        * Supported properties are: ok, cancel, yes and no.  Generally you should include a locale-specific
        * resource file for handling language support across the framework.
        * Customize the default text like so: Ext.MessageBox.buttonText.yes = "oui"; //french
        * @type Object
        */
        buttonText: {
            ok: "OK",
            cancel: "Cancel",
            yes: "Yes",
            no: "No"
        }
    };
} ();

//*************密码框定义 结束*****************//

var deptStore = new Ext.data.Store({
    // destroy the store if the grid is destroyed
    autoDestroy: true,
    autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointExchange.aspx?actionName=getDeptByID&sid=' + Sys.sid,

    // specify a XmlReader (coincides with the XML format of the returned data)
    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        idProperty: 'ID',
        root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: 'Title', mapping: 'Title' }
            ]
    })

   // sortInfo: { field: 'ID', direction: 'ASC' }
});

//*****************客户信息公共form***********************//
End.customer_formPanel = function(){
    return new Ext.form.FormPanel({
        bodyBorder: false,
        border: false,
        autoScroll: true,
        url: "../Apis/pointAccount.aspx?actionName=getDataByIdNo&sid=" + Sys.sid,
        reader: new Ext.data.JsonReader({
            //root: "data",
            fields: [{
                name: "id"}, {
                name: "customerName"
            }, { name: "idNo" },
                    { name: "mobileNo" },
                    { name: "email" },
                    { name: "address" },
                    { name: "zipCode" },
                    { name: "avilablePoint" },
                    { name: "pointCount" },
                    { name: "memoInfo" },
                    { name: "contact" },
                    { name: "agreementNo" }]
        }),
        items: [
         {
             xtype: "fieldset",
             title: "客户信息",
             collapsible: true,
             collapsed: true,

             //defaultType: 'textfield',
             defaults: { labelAlign: "right", width: 80 },
             //bodyBorder:false,
             layout: "column",
             items: [{
                 layout: "form",
                 columnWidth: 1,
                 items: [{
                     xtype: "displayfield",
                     fieldLabel: "客户ID",
                     hidden:true,
                     name: "id"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "客户姓名",
                     name: "customerName"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "身份证号码",
                     name: "idNo"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "手机号码",
                     name: "mobileNo"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "电子邮件",
                     name: "email"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "积分数量",
                     name: "pointCount"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "可用积分",
                     name: "avilablePoint"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "邮编",
                     name: "zipCode"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "联系方式",
                     name: "contact"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "联系地址",
                     name: "address"
                 }, {
                     xtype: "displayfield",
                     fieldLabel: "备注",
                     name: "memoInfo"
                 }]
             }]
         }
    ]
    })
}

 //*****************客户信息公共form  end***********************//

