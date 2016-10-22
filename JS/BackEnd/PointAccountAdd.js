//积分账户开户方法
var sub;
//添加窗口
var addform = new Ext.FormPanel({

    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 80,
    items: [{
        layout: 'column',
        items: [{
            columnWidth: .5,
            layout: 'form',
            items: [{
                //id:'loginName',
                xtype: 'hidden',
                fieldLabel: 'ID',
                name: 'ID',
                anchor: '95%'
            }, {
                //id:'loginName',
                xtype: 'textfield',
                fieldLabel: '积分协议编号',
                name: 'AgreementNo',
                //allowBlank: false,
                invalidText: "必输",
                anchor: '95%'
            }, {
                //id:'id',
                xtype: 'textfield',
                fieldLabel: '客户姓名',
                name: 'CustomerName',
                allowBlank: false,
                anchor: '95%'
            }, {
                //id:'name',
                xtype: 'textfield',
                fieldLabel: '身份证号码',
                name: 'IdNo',
                id: 'IdNo',
                //allowBlank: false,
                anchor: '95%',
                //身份证正则表达式  \d{17}[\d|X]|\d{15}
                listeners: {
                    'blur': function () {
                        var IdLength = this.getValue().trim().length;
                        //regex:d{15}|d{18};
                        //regexText: "员工号只能由字母和数字组成！";
                        var cmp = this.getValue().trim();

                        if (parseInt(IdLength) != 18 && parseInt(IdLength) != 15 && parseInt(IdLength) != 0) {
                            Ext.MessageBox.alert("提醒", "身份证号码长度不正确！");
                            return false;
                        }
                        if (parseInt(IdLength) == 18 || parseInt(IdLength) == 15) {
                            sub = this.getValue().substring(6, 14);
                            var year = sub.substring(0, 4) + "-";
                            var month = sub.substring(4, 6) + "-";
                            var day = sub.substring(6, 8);

                            document.getElementById("Birthday").value = year + month + day;
                        } 
                    }
                }
            },
                {
                    //id:'mobile',
                    xtype: 'textfield',
                    fieldLabel: '手机号码',
                    name: 'MobileNo',
                    allowBlank: false,
                    anchor: '95%'
                },
                {
                    //id:'mobile',
                    xtype: 'textfield',
                    fieldLabel: '客户生日',
                    name: 'Birthday',
                    id: 'Birthday',
                    anchor: '95%',
                    validator: function (value) {
                        //alert(value);
                        return checkAccountDate(value);
                    }
                }]
        }, {
            columnWidth: .5,
            layout: 'form',
            items: [{
                id: 'org1',
                layout: "column"
            }, {
                //id:'tel',
                xtype: 'textfield',
                fieldLabel: '联系地址',
                name: 'Address',
                anchor: '96%'
            },
                {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '邮编',
                    name: 'ZipCode',
                    anchor: '96%'
                }, {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '电子邮件',
                    name: 'Email',
                    anchor: '96%',
                    vtype: "email"
                }, {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '其他联系方式',
                    name: 'Contact',
                    anchor: '96%'
                }, {
                    height: 30,
                    html: '<h2><font color=red size=2>(年-月-日)</font></h2>',
                    anchor: '96%'
                }]
        },
            {
                columnWidth: 1,
                layout: 'form',
                items: [{
                    //id:'memoinfo',
                    xtype: 'textfield',
                    fieldLabel: '备注',
                    name: 'MemoInfo',
                    anchor: '98%'
                }]
            }
            , {
                columnWidth: .5,
                layout: 'form',
                items: [{
                    //id:'memoinfo',
                    xtype: 'textfield',
                    fieldLabel: '密码',
                    name: 'Pwd',
                    allowBlank: false,
                    inputType: "password",
                    anchor: '95%'
                }]
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [{
                    //id:'memoinfo',
                    xtype: 'textfield',
                    fieldLabel: '重复密码',
                    name: 'RepeatPassWord',
                    allowBlank: false,
                    inputType: "password",
                    anchor: '96%'
                }]
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [{
                    //id:'memoinfo',
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: '重复密码',
                    name: 'Password',
                    inputType: "password",
                    anchor: '96%'
                }]
            }
            ]
    }, {
        html: '<font color=red size=2>(红色输入框为必填项!)</font>',
        anchor: '96%'
    }],
    buttons: [{
        text: "保存并绑定会员卡",
        handler: function () {
            saveBind();
        }
    }, {
        text: "保 存",
        handler: function () {
            //alert("save");
            //checkPwd();

            save();
        }
    }, {
        text: "取 消",
        handler: function () {
            addform.getForm().reset();
            showWindow.hide();
        }
    }]
});

function checkAccountDate(value) {
    //alert(value.length);
    if (value.length > 10) {
        Ext.MessageBox.alert("警告", "生日格式错误！");
        return;
    } else {
        var reDate = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/;
        //alert(reDate.test(value));
        if (reDate.test(value)) {
            return reDate.test(value);
        } else {
            var reMonth = /[0-1][0-9]-[0-3][0-9]/;
            return reMonth.test(value);
        }
    }
}
function saveBind() {
    var pwd1 = addform.find("name", "Pwd")[0].getValue();
    var pwd2 = addform.find("name", "RepeatPassWord")[0].getValue();
    if (Ext.isEmpty(pwd1) || Ext.isEmpty(pwd2)) {
        Ext.MessageBox.alert("提醒", "请输入密码！");
        return false;
    } else {
        var AgreementNoLength = addform.find("name", "AgreementNo")[0].getValue().trim().length; //获取积分协议编号长度
        var CustomerNameLength = addform.find("name", "CustomerName")[0].getValue().trim().length; //获取客户姓名长度

        var MobileLength = addform.find("name", "MobileNo")[0].getValue().trim().length; //获取手机长度
        var IdLength = addform.find("name", "IdNo")[0].getValue().trim().length; //获取身份证号码长度
        var Mobile = addform.find("name", "MobileNo")[0].getValue(); //获取手机号码
        /*
        if (AgreementNoLength == 0) {
            Ext.MessageBox.alert("提醒", "积分协议编号不能为空！");
            return false;
        }*/
        if (CustomerNameLength == 0) {
            Ext.MessageBox.alert("提醒", "客户姓名不能为空！");
            return false;
        }
        //regex:d{15}|d{18};
        //regexText: "员工号只能由字母和数字组成！";
        if (parseInt(IdLength) != 18 && parseInt(IdLength) != 15 && parseInt(IdLength) != 0) {
            Ext.MessageBox.alert("提醒", "身份证号码长度不正确！");
            return false;
        }        
        if (parseInt(MobileLength) != 11) {
            Ext.MessageBox.alert("提醒", "手机号码长度不正确！");
            return false;
        }
        if (Mobile.length > 0) {
            for (var i = Mobile.length - 1; i >= 0; i--) {
                unicode = Mobile.charCodeAt(i);
                if (unicode > 65280 && unicode < 65375) {
                    Ext.MessageBox.alert("提醒", "手机号码不能输入全角字符，请输入半角字符");
                    return false;
                }
            }
        }
        if (isNaN(Mobile)) {
            Ext.MessageBox.alert("提醒", "手机号码必须是数字！");
            return false;
        }
       
        if (pwd1 != pwd2) {
            Ext.MessageBox.alert("提醒", "两次密码不一致！请重新输入！");
            return false;
        } else {
            var md5 = MD5(pwd1);
            addform.find("name", "Password")[0].setValue(md5);
            AddPointAccountBind();
        }
    }
}
function save() {
    var pwd1 = addform.find("name", "Pwd")[0].getValue();
    var pwd2 = addform.find("name", "RepeatPassWord")[0].getValue();
    if (Ext.isEmpty(pwd1) || Ext.isEmpty(pwd2)) {
        Ext.MessageBox.alert("提醒", "请输入密码！");
        return false;
    } else {    
        var AgreementNoLength = addform.find("name", "AgreementNo")[0].getValue().trim().length;//获取积分协议编号长度
        var CustomerNameLength = addform.find("name", "CustomerName")[0].getValue().trim().length; //获取客户姓名长度

        var MobileLength = addform.find("name", "MobileNo")[0].getValue().trim().length; //获取手机长度
        var IdLength = addform.find("name", "IdNo")[0].getValue().trim().length; //获取身份证号码长度
        var Mobile = addform.find("name", "MobileNo")[0].getValue();//获取手机号码
        if (CustomerNameLength == 0) {
            Ext.MessageBox.alert("提醒", "客户姓名不能为空！");
            return false;
        }

        if (parseInt(IdLength) != 18 && parseInt(IdLength) != 15 && parseInt(IdLength) != 0) {
            Ext.MessageBox.alert("提醒", "身份证号码长度不正确！");
            return false;
        }

        if (parseInt(MobileLength) != 11) {
            Ext.MessageBox.alert("提醒", "手机号码长度不正确！");
            return false;
        }
        if (Mobile.length > 0) {
            for (var i = Mobile.length - 1; i >= 0; i--) {
                unicode = Mobile.charCodeAt(i);
                if (unicode > 65280 && unicode < 65375) {
                    Ext.MessageBox.alert("提醒", "手机号码不能输入全角字符，请输入半角字符");
                    return false;
                }
            }
        }

        if (isNaN(Mobile)) {
            Ext.MessageBox.alert("提醒", "手机号码必须是数字！");
            return false;
        }
       
        if (pwd1 != pwd2) {
            Ext.MessageBox.alert("提醒", "两次密码不一致！请重新输入！");
            return false;
        } else {
            var md5 = MD5(pwd1);
            addform.find("name", "Password")[0].setValue(md5);
            AddPointAccount();
        }
    }
 }
//添加积分账户并绑定会员卡
function AddPointAccountBind() {
    if (addform.getForm().isValid()) {
        //提交数据
        //addform.body.mask("正在提交，请稍候...");
        addform.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=AddPointAccount&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                var account_idNo = addform.find("name", "IdNo")[0].getValue();
                var account_mobileNo = addform.find("name", "MobileNo")[0].getValue();
                if (action.result.success) {
                    addform.getForm().reset();
                    showWindow.hide();
                    account_InfoWindow.show();
                    account_base_info_form.load({
                        url: "../Apis/PointAccount.aspx?actionName=selectAccountByMobileNo&sid=" + Sys.sid,
                        params: { idNo: account_idNo, mobileNo: account_mobileNo },
                        waitMsg: "加载中....."
                    })
                    account_base_info_form.on('actioncomplete', function () {
                        var account_id = account_base_info_form.find("name", "ID")[0].getValue();
                        account_pwdform.find("name", "ID")[0].setValue(account_id);
                        account_cardForm.find("name", "ID")[0].setValue(account_id);
                        removeaccount_cardForm.find("name", "ID")[0].setValue(account_id);
                        account_card_store.removeAll();
                        account_card_store.load({
                            params: { id: account_id }
                        });
                        account_point_store.removeAll();
                        account_point_store.load({
                            params: { id: account_id }
                        });
                    })
                }

                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //addform.body.unmask();
            }
        });
    }
}

//添加积分账户
function AddPointAccount() {
    if (addform.getForm().isValid()) {
        //提交数据
        //addform.body.mask("正在提交，请稍候...");
        addform.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=AddPointAccount&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    addform.getForm().reset();
                }
                
                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //addform.body.unmask();
            }
        });
    }
}
//判断密码是否相同
function checkPwd() {
    //alert(addform.find("name","Pwd").length);
    var pwd1 = addform.find("name", "Pwd")[0].getValue();
    var pwd2 = addform.find("name", "RepeatPassWord")[0].getValue();

    if (pwd1 != pwd2) {
        Ext.Msg.alert("提示", "两次密码不同！请再次输入！");
        return;
    } else {
        var md5 = MD5(pwd1);
        addform.find("name", "Password")[0].setValue(md5);
        AddPointAccount();
    }
}
//账户基础信息表单
var account_base_info_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    // width:700,
    // heigh: 100,
    //autoWidth:true,
    reader: new Ext.data.JsonReader({
        //root: "data",
        fields: [{
            name: "ID", mapping: "ID"
        }, { name: "CustomerName", mapping: "CustomerName" },
        { name: "AgreementNo", mapping: "AgreementNo" },
        { name: "IdNo" },
        { name: "MobileNo" },
        { name: "Address" },
        { name: "Email" },
        { name: "Birthday", convert: ConvertJSONDateToJSDateObjectTextField },
        { name: "ZipCode" },
        { name: "Contact" },
        { name: "MemoInfo"}]
    }),
    items: [{
        xtype: "fieldset",
        title: "账户基础信息",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 60 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            columnWidth: .5,
            layout: 'form',
            items: [{
                //id:'loginName',
                xtype: 'hidden',
                fieldLabel: 'ID',
                name: 'ID',
                anchor: '100%'
            }, {
                //id:'loginName',
                xtype: 'textfield',
                fieldLabel: '积分协议编号',
                name: 'AgreementNo',
                allowBlank: false,
                anchor: '100%'
            }, {
                //id:'id',
                xtype: 'textfield',
                fieldLabel: '客户姓名',
                name: 'CustomerName',
                allowBlank: false,
                anchor: '100%'
            }, {
                //id:'name',
                xtype: 'textfield',
                fieldLabel: '身份证号码',
                name: 'IdNo',
                anchor: '100%'
            },
                {
                    //id:'mobile',
                    xtype: 'textfield',
                    fieldLabel: '手机号码',
                    name: 'MobileNo',
                    allowBlank: false,
                    anchor: '100%'
                },
                {
                    //id:'mobile',
                    xtype: 'textfield',
                    fieldLabel: '客户生日',
                    name: 'Birthday',
                    //format: "Y-m-d",
                    anchor: '100%',
                    validator: function (value) {
                        //alert(value);
                        return checkAccountDate(value);
                    }
                }]

        }, {
            columnWidth: .5,
            layout: 'form',
            items: [{
                id: 'org1',
                layout: "column"
            }, {
                //id:'tel',
                xtype: 'textfield',
                fieldLabel: '联系地址',
                name: 'Address',
                anchor: '100%'
            },
                {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '邮编',
                    name: 'ZipCode',
                    anchor: '100%'
                }, {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '电子邮件',
                    name: 'Email',
                    anchor: '100%',
                    vtype: "email"
                }, {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '其他联系方式',
                    name: 'Contact',
                    anchor: '100%'
                }]
        }, {
            columnWidth: 1,
            layout: 'form',
            items: [{
                //id:'memoinfo',
                xtype: 'textfield',
                fieldLabel: '备注',
                name: 'MemoInfo',
                anchor: '100%'
            }]
        }, {
            columnWidth: 1,
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 100,

            buttons: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: "密码重置",
                handler: function () {
                    account_mPwd.show();
                }
            }, {
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: "保存基础信息",
                handler: function () {
                    UpdatePointAccount();
                }
            }]
        }]
    }]
});
function checkAccountDate(value) {
    if (value.length > 10) {
        Ext.MessageBox.alert("警告", "生日格式错误！");
        return;
    } else {
        var reDate = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/;
        //alert(reDate.test(value));
        if (reDate.test(value)) {
            return reDate.test(value);
        } else {
            var reMonth = /[0-1][0-9]-[0-3][0-9]/;
            return reMonth.test(value);
        }
    }
}

//更新客户基础信息
function UpdatePointAccount() {
    var MobileLength = account_base_info_form.find("name", "MobileNo")[0].getValue().trim().length; //获取手机长度
    var Mobile = account_base_info_form.find("name", "MobileNo")[0].getValue();//获取手机号码
    if (parseInt(MobileLength) != 11) {
        Ext.MessageBox.alert("提醒", "手机号码长度不正确！");
        return false;
    };
    if (Mobile.length > 0) {
        for (var i = Mobile.length - 1; i >= 0; i--) {
            unicode = Mobile.charCodeAt(i);
            if (unicode > 65280 && unicode < 65375) {
                Ext.MessageBox.alert("提醒", "手机号码不能输入全角字符，请输入半角字符");
                return false;
            }
        }
    }
    if (isNaN(Mobile)) {
        Ext.MessageBox.alert("提醒", "手机号码必须是数字！");
        return false;
    }

    if (account_base_info_form.getForm().isValid()) {
        //提交数据
        //addform.body.mask("正在提交，请稍候...");
        account_base_info_form.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=AddPointAccount&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                //                if (action.result.success) {
                //                    account_base_info_form.getForm().reset();
                //                }
                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //addform.body.unmask();
            }
        });
    }
}


//修改用户密码form
var account_pwdform = new Ext.form.FormPanel({
    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 70,
    items: [{
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '新密码',
        name: 'newPwd',
        allowBlank: false,
        inputType: "password",
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '确定新密码',
        name: 'reNewPwd',
        allowBlank: false,
        inputType: "password",
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'hidden',
        fieldLabel: '用户ID',
        name: 'ID',
        anchor: '95%'
    }]

})

//修改密码窗口
var account_mPwd = new Ext.Window({
    title: '修改密码',
    closeAction: 'hide',
    iconCls: 'find',
    width: 280,
    height: 150,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: account_pwdform,
    buttons: [{
        text: '修改',
        handler: function () {
            if (account_pwdform.getForm().isValid()) {
                Ext.Msg.confirm("提示框", "您确定要修改密码吗？", function (btn) {
                    if (btn == "yes") {
                        checkPwd();
                    }
                })
            }
        }
    }, {
        text: '取消',
        handler: function () {
            account_mPwd.hide();
            account_pwdform.getForm().reset();
        }
    }]
});

//判断密码是否相同
function checkPwd() {
    var pwd1 = account_pwdform.find("name", "newPwd")[0].getValue();
    var pwd2 = account_pwdform.find("name", "reNewPwd")[0].getValue();

    if (pwd1 != pwd2) {
        Ext.Msg.alert("提示", "两次密码不同！请再次输入！");
        return;
    } else {
        modifyPassword();
    }
}

function modifyPassword() {
    if (account_pwdform.getForm().isValid()) {
        account_pwdform.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=UpdatePassword&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    account_mPwd.hide();
                    account_pwdform.getForm().reset();
                }
                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //addform.body.unmask();
            }
        });
    }
}
var account_cardForm = new Ext.form.FormPanel({
    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 70,
    items: [{
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '卡号',
        name: 'Code',
        allowBlank: false,
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '密码',
        name: 'Password',
        allowBlank: false,
        inputType: "password",
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'hidden',
        fieldLabel: '用户ID',
        name: 'ID',
        anchor: '95%'
    }]

})

//绑定窗口
var account_cardWindow = new Ext.Window({
    title: '绑定会员卡',
    closeAction: 'hide',
    iconCls: 'find',
    width: 280,
    height: 150,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: account_cardForm,
    buttons: [{
        text: '绑定',
        handler: function () {
            AddPointAccountCard();
        }
    }, {
        text: '取消',
        handler: function () {
            account_cardWindow.hide();
            account_cardForm.getForm().reset();
        }
    }]
});

//绑定会员卡
function AddPointAccountCard() {
    var card = account_cardForm.find("name", "Code")[0].getValue().length;
    var pwd = account_cardForm.find("name", "Password")[0].getValue().length;
    if (card == 0) {
        Ext.MessageBox.alert("提醒", "请输入卡号！")
        return false;
    }
    if (pwd == 0) {
        Ext.MessageBox.alert("提醒", "请输入密码！");
        return false;
    }
    if (account_cardForm.getForm().isValid()) {
        account_cardForm.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=addCard&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    account_cardWindow.hide();
                    account_cardForm.getForm().reset();
                    account_card_store.reload();
                }
                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //addform.body.unmask();
            }
        });
    }
}
//定义列
var account_membercm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [new Ext.grid.RowNumberer(), {
        //id: "CardNo",
        header: '卡号',
        dataIndex: 'Code',
        width: 120
    }, {
        //id: "UserName",
        header: '卡类型',
        dataIndex: 'Title',
        width: 100
    }, {
        //id: "UserName",
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    }
    /*,{
    id: "MemoInfo",
    header: '备注',
    dataIndex: 'MemoInfo',
    width: 200
    }*/
    ]
});

var account_card_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed

    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: "../Apis/PointAccount.aspx?actionName=getCardInfo&sid=" + Sys.sid,
    // specify a XmlReader (coincides with the XML format of the returned data)
    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        //root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "Code", mapping: "Code" },
                { name: 'Title', mapping: 'Title' }
            ]
    })

    //sortInfo: { field: 'Code', direction: 'ASC' }
});

//解除绑定form
var removeaccount_cardForm = new Ext.form.FormPanel({
    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 70,
    items: [{
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '卡号',
        readOnly: true,
        name: 'Code',
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '密码',
        name: 'Password',
        allowBlank: false,
        inputType: "password",
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'hidden',
        fieldLabel: '用户ID',
        name: 'ID',
        anchor: '95%'
    }]

})

//解除窗口
var removeaccount_cardWindow = new Ext.Window({
    title: '解除会员卡',
    closeAction: 'hide',
    iconCls: 'find',
    width: 280,
    height: 150,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: removeaccount_cardForm,
    buttons: [{
        text: ' 解除',
        handler: function () {
            removeAccountCard();
        }
    }, {
        text: '取消',
        handler: function () {
            removeaccount_cardWindow.hide();
            removeaccount_cardForm.getForm().reset();
        }
    }]
});


var account_membergrid = new Ext.grid.GridPanel({
    store: account_card_store,
    cm: account_membercm,
    frame: true,
    height: 120,
    //margins: "2 2 2 2",
    //border: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    // sm: sm,
    loadMask: true,
    tbar: [
    {
        text: '绑定会员卡',
        iconCls: 'silk-add',
        handler: function () {
            account_cardWindow.show();
        }
    }
		, {
		    text: '解除绑定',
		    iconCls: "silk-book",
		    handler: function () {
		        var r = account_membergrid.getSelectionModel().getSelections();
		        //alert(rows[0].get("id"));
		        if (r.length == 0) {
		            Ext.MessageBox.alert('警告', '最少选择一条信息，解除绑定!');
		        } else {
		            var rows = account_membergrid.getSelectionModel().getSelections();
		            removeaccount_cardWindow.show();
		            //removeaccount_cardForm.find("name", "ID")[0].setValue(rows[0].get("ID"));
		            removeaccount_cardForm.find("name", "Code")[0].setValue(rows[0].get("Code"));
		        }
		    }
		}]

});

//解除会员卡
function removeAccountCard() {
    if (removeaccount_cardForm.getForm().isValid()) {
        removeaccount_cardForm.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=removeCard&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    removeaccount_cardWindow.hide();
                    removeaccount_cardForm.getForm().reset();
                    account_card_store.reload();
                }
                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //addform.body.unmask();
            }
        });
    }
}

//绑定卡信息
var account_card_info_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    //width:700,
    //heigh: 100,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        collapsible: true,
        title: "绑定/解除会员卡",
        //layout: "column",
        //defaults: { labelAlign: "right", width: 60 },
        items: [account_membergrid]
    }]
});

//定义列
var account_balancecm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [new Ext.grid.RowNumberer(), {
        //id: "CardNo",
        header: '积分数量',
        dataIndex: 'PointCount',
        width: 120
    }, {
        //id: "UserName",
        header: '有效期',
        dataIndex: 'ExpiredDate',
        width: 100,
        renderer: function (value) {
            if (value != undefined) {
                var d = ConvertJSONDateToJSDateObject(value);
                if (d == null) {
                    d = value;
                }
                return d.dateFormat("Y-m-d");
            }
        },
        format: "Y-m-d"
    }]
});

var account_point_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed

    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: "../Apis/PointAccount.aspx?actionName=getPoint&sid=" + Sys.sid,
    // specify a XmlReader (coincides with the XML format of the returned data)
    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        //root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "PointCount", mapping: "PointCount" },
                { name: 'ExpiredDate', mapping: 'ExpiredDate' }
            ]
    })

    //sortInfo: { field: 'Code', direction: 'ASC' }
});

var account_balancegrid = new Ext.grid.GridPanel({
    store: account_point_store,
    cm: account_balancecm,
    frame: true,
    height: 120,
    //margins: "2 2 2 2",
    //border: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    // sm: sm,
    loadMask: true
});

//余额有效期
var pointaccount_balance_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    //width:700,
    //heigh: 100,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        collapsible: true,
        title: "积分余额及有效期",
        //layout: "column",
        //defaults: { labelAlign: "right", width: 60 },
        items: [account_balancegrid]
    }]
});

var account_InfoWindow = new Ext.Window({
    layout: 'fit',
    width: 750,
    height: 500,
    modal: true,
    //autoScroll: true,
    closeAction: 'hide',
    title: "积分账户信息",
    //plain: true,
    //frame:true,
    items: [{
        autoScroll: true,
        items: [account_base_info_form, account_card_info_form, pointaccount_balance_form]
    }]
});
var showWindow = new Ext.Window({
    layout: 'fit',
    width: 600,
    height: 300,
    modal: true,
    closeAction: 'hide',
    title: "积分账户开户",
    plain: true,
    items: [addform]
});

function showPointAccountAdd() {

    showWindow.show();
    addform.getForm().isValid();
}