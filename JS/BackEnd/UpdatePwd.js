var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    //autoWidth:true,
    items: [{
        layout: "column",
        xtype: "fieldset",
        title: "修改条件",
        defaults: { labelAlign: "right", width: 80 },
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "原密码",
                name: "pwd",
                inputType: "password",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "新密码",
                name: "verifyPwd",
                inputType: "password",
                anchor: "100%"
                
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "确认新密码",
                name: "newPwd",
                inputType: "password",
                anchor: "100%"
            }, {
                buttons: [{
                    boxMinWidth: 40,
                    width: 100,
                    text: " 修 改",
                    handler: function () {
                        var Pwd = pd_top_form.find("name", "pwd")[0].getValue();
                        var newPwd = pd_top_form.find("name", "newPwd")[0].getValue();
                        var verifyPwd = pd_top_form.find("name", "verifyPwd")[0].getValue();
                        if (Pwd.length == 0) {
                            Ext.MessageBox.alert("提醒", "请输入原密码！");
                            return;
                        }
                        if (newPwd.length == 0) {
                            Ext.MessageBox.alert("提醒", "请输入新密码！");
                            return;
                        }
                        if (verifyPwd.length == 0) {
                            Ext.MessageBox.alert("提醒", "请确认新密码！");
                            return;
                        }
                        if (newPwd != verifyPwd) {
                            Ext.MessageBox.alert("提醒", "两次密码不一致！");
                            return;
                        }
                        UpdatePwd();
                    }
                }, {
                    boxMinWidth: 40,
                    width: 100,
                    text: " 重 置",
                    handler: function () {
                        pd_top_form.getForm().reset();
                    }
                }]
            }]
        }]

    }]
});
function UpdatePwd() {
    pd_top_form.getForm().submit({
        url: "../Apis/ChangePoint.aspx?actionName=updatePwd&sid=" + Sys.sid,
        success: function (form, action) {
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {
                pd_top_form.getForm().reset();
            }
        },
        failure: function (form, action) {
            if (action != undefined && action.result != undefined) {
                Ext.MessageBox.alert("提醒", action.result.msg);
            } else {
                Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
            }
        }
    })    
}
//主容器
var pd_main_panel = new Ext.Panel({
    //autoScroll: true,
    border: false,
    //autoWidth:true,
    layout: "anchor",
    //anchorSize: { width: 800, height: 600 },
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
