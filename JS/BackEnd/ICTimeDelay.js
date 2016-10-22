/******************* IC卡有效期延期 *********************/

var form_IC = new Ext.form.FormPanel({
    labelAlign: 'right',
    labelWidth: 40,
    frame: true,
    layout: 'column',
    items: [{
        columnWidth: .95,
        layout: 'form',
        items: [{ 
            xtype: 'textfield',
            fieldLabel: 'IC卡号',
            name: 'CardNo',
            anchor: '100%',
            allowBlank: false
        }]
    }]
});

var win_IC = new Ext.Window({
    title: 'IC卡有效期延期',
    width: 250,
    height: 100,
    closeAction: 'hide',
    modal: true,
    items: form_IC,
    buttons: [{
        text: '延期',
        handler: function (thBtn) {
            if (form_IC.getForm().isValid()) {
                thBtn.setText('请稍候...');
                thBtn.setDisabled(true);
                form_IC.getForm().submit({
                    url: '../Apis/ICTimeDelay.aspx?actionName=timeDelay&sid=' + Sys.sid,
                    success: function (form, action) {
                        var result = action.result;
                        Ext.Msg.alert('提示', result.msg);
                        //form_IC.getForm().reset();
                        thBtn.setText('延期');
                        thBtn.setDisabled(false);
                    },
                    failure: function (form, action) {
                        var result = action.result;
                        Ext.Msg.alert('提示', result.msg);
                        thBtn.setText('延期');
                        thBtn.setDisabled(false);
                    }
                });
            }
        }
    }]
}).show();

function showDialog() {
    win_IC.show();
}