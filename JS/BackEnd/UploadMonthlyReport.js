var newFieldsCount = 0;
function AddFileUp() {
    var fileField = new Ext.form.TextField({
        name: "newFiles",
        xtype: 'textfield',
        anchor: "95%",
        fieldLabel: '文件路径',
        inputType:'file'
    })
    newFieldsCount++;
    return fileField;
};
var reportTypeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["0", "财务"],
            ["1", "物流"],
            ["2", "人事"]]
});
var form = new Ext.form.FormPanel({
    labelWidth: 70,
    labelAlign:'right',
    border: false,
    fileUpload: true,
    frame: true,
    autoScroll: true,
    items: [
            {
                layout: 'form',
                id: "postForm",
                border: false,
                name: 'postForm',
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: '报表类型',
                        name: 'reportTypeCombo',
                        //editable: false,
                        selectOnFocus: true,
                        forceSelection: true,
                        store: reportTypeStore,
                        displayField: "Title",
                        valueField: "ID",
                        mode: "local",
                        triggerAction: "all",
                        allowBlank: true,
                        anchor:"95%",
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '文件路径',
                        name: 'oldFile',
                        inputType: 'file',
                        anchor: "95%",
                        allowBlank: false
                    }, { html: '<input id="resetForm" type=reset style="display:none;">', border: false }
                ]
            }
       ],
    buttons: [
        {
            text: '添加附件',
            handler: function () {
                Ext.getCmp("postForm").add(AddFileUp());
                Ext.getCmp("postForm").doLayout();
            }
        },
        {
            text: '清空附件',
            handler: function () {
                var newFiles = form.find('name', 'newFiles');
                for (var i = 0; i < newFiles.length; i++) {
                    newFiles[i].destroy();
                }
                form.body.dom.scrollTop = 0;
                newFieldsCount = 0;
                form.getForm().findField("oldFile").reset();
                document.getElementById('resetForm').click();
            }
        }, { text: '删除附件',
            handler: function () {
                var newFiles = form.find('name', 'newFiles');
                if (newFiles.length > 0) {
                    newFiles[newFiles.length - 1].destroy();
                }else {
                    form.getForm().findField("oldFile").reset();
                    document.getElementById('resetForm').click();
                }
            }
        }
    ]
});

var win_Upload = new Ext.Window({
    title: ' 上传文件',
    width: 400,
    height: 200,
    minWidht: 400,
    minHeight: 200,
    modal: true,
    items: form,
    layout: 'fit',
    buttons: [
        {
            text: '确认',
            handler: function () {
                if (form.getForm().isValid()) {
                    form.getForm().submit({
                        waitMsg: "正在上传，请稍候...",
                        url: "../Apis/UploadMonthReport.aspx?sid=" + Sys.sid + '&actionName=uploadMonthReports',
                        dataType: 'json',
                        params: { "reportTypeCmb": form.find('name', 'reportTypeCombo')[0].value },
                        success: function (from, action) {
                            if (action.result == undefined) {
                                Ext.Msg.alert("提示", "服务器错误,文件过大!");
                            } else {
                                Ext.Msg.alert("提示", action.result.msg);
                            }
                            var newFiles = form.find('name', 'newFiles');
                            for (var i = 0; i < newFiles.length; i++) {
                                newFiles[i].destroy();
                            }
                            newFieldsCount = 0;
                            form.getForm().findField("oldFile").reset();
                            document.getElementById('resetForm').click();
                            form.find('name', 'reportTypeCombo')[0].setValue(null);
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert("提示", "服务器异常!");
                        }
                    });
                } else { Ext.Msg.alert("提示", "请将信息填写完整！"); }
            }
        },
        {
            text: '取消',
            handler: function () {
                win_Upload.hide();
            }
        }
    ]
});

win_Upload.show();