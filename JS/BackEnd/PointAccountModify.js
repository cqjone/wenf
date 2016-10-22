//积分兑换功能
var CustomerID = 0;

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    //autoWidth:true,
    items: [{
            html: "<font color='red' size='2'>*本功能用作查询和修改当天本店已开户的积分账户的资料!</font>"
    },{
        id: "sw",
        xtype: "fieldset",
        title: "查询条件",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 80 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "客户姓名",
                name: "customerName",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "身份证号码",
                name: "idNo",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "卡号",
                name: "iCardId",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "手机号码",
                name: "mobileNo",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "电子邮件",
                name: "email",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 140,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    var data = pd_top_form.getForm().getValues();
                    //if (isValide()) {
                        //alert(data);
                        pd_top_form.getForm().reset();
                        pd_store.load({
                            params: data
                        });
                    //}
                }
            }]
        }]
    }]
});

function isValide() {
    var customerName = pd_top_form.find("name", "customerName")[0].getValue().trim().length;
    var mobile = pd_top_form.find("name", "mobileNo")[0].getValue().trim().length;
    var idNo = pd_top_form.find("name", "idNo")[0].getValue().trim().length;
    var email = pd_top_form.find("name", "email")[0].getValue().trim().length;
    var icard = pd_top_form.find("name", "iCardId")[0].getValue().trim().length;
    if (customerName == 0 && mobile == 0 && email == 0 && idNo == 0 && icard == 0) {
        Ext.MessageBox.alert("提醒", "请输入查询条件!");
        return false;
    } else {
    return true;
    }
}
var fm = Ext.form;

//定义 勾选框SM
var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
//定义列
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        //id: "Code",
        header: '客户姓名',
        dataIndex: 'CustomerName',
        width: 80
    }, {
        //id: "Title",
        header: '身份证号码',
        dataIndex: 'IdNo',
        width: 120
    }, {
        //id: "Title",
        header: '手机号码',
        dataIndex: 'MobileNo',
        width: 100
    }, {

        header: "电子邮件",
        dataIndex: "Email",
        width: 100
    }, {

        header: "联系地址",
        dataIndex: "Address",
        width: 100
    }, {

        header: "邮编",
        dataIndex: "ZipCode",
        width: 100
    }, {

        header: "备注",
        dataIndex: "MemoInfo",
        width: 160
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed

    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: "../Apis/PointAccount.aspx?actionName=getCurrentData&sid=" + Sys.sid,

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
                { name: 'AgreementNo', mapping: 'AgreementNo' },
                { name: 'CustomerName', mapping: 'CustomerName' },
                { name: 'IdNo', mapping: 'IdNo' },
                { name: 'MobileNo', mapping: 'MobileNo' },
                { name: 'Email', mapping: 'Email' },
                { name: 'Address', mapping: 'Address' },
                { name: 'Birthday', mapping: 'Birthday',type: "date", convert: ConvertJSONDateToJSDateObject,format:"Y-m-d" },
                { name: 'ZipCode', mapping: 'ZipCode' },
                { name: 'Contact', mapping: 'Contact' },
                { name: "MemoInfo", mapping: "MemoInfo" }
            ]
    })

    //sortInfo: { field: 'Code', direction: 'ASC' }
});
//
pd_store.on('load', function (store, records) {
    //alert("load...");
    //加载成功后，读取客户信息
    /*pd_top_form.load({
        params: pd_top_form.getForm().getValues()
    });*/
});

pd_store.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "没有查到积分账户！");
    pd_store.removeAll();
});
var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
    //sm: sm,
    loadMask: true
});

//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    accountInfoWindow.show();
    //alert(r.get("AgreementNo"));
    pwdform.find("name", "ID")[0].setValue(r.get("ID"));
    cardForm.find("name", "ID")[0].setValue(r.get("ID"));
    removeCardForm.find("name", "ID")[0].setValue(r.get("ID"));
    /*
    base_info_form.find("name", "ID")[0].setValue(r.get("ID"));
    base_info_form.find("name", "CustomerName")[0].setValue(r.get("CustomerName"));
    base_info_form.find("name", "AgreementNo")[0].setValue(r.get("AgreementNo"));
    base_info_form.find("name", "IdNo")[0].setValue(r.get("IdNo"));
    base_info_form.find("name", "MobileNo")[0].setValue(r.get("MobileNo"));
    base_info_form.find("name", "Address")[0].setValue(r.get("Address"));
    base_info_form.find("name", "Email")[0].setValue(r.get("Email"));
    base_info_form.find("name", "ZipCode")[0].setValue(r.get("ZipCode"));
    base_info_form.find("name", "Contact")[0].setValue(r.get("Contact"));
    base_info_form.find("name", "MemoInfo")[0].setValue(r.get("MemoInfo"));*/

    id = r.get("ID");
    CustomerID = id;
    //alert(id   +"|" + CustomerID);
    base_info_form.getForm().reset();
    base_info_form.load({
        url: "../Apis/PointAccount.aspx?actionName=getDataById&sid=" + Sys.sid,
        params: { id: id },
        waitMsg: "加载中....."
    });
    card_store.removeAll();
    card_store.load({
        params: { id: CustomerID }
    });
    point_store.removeAll();
    point_store.load({
        params: { id: CustomerID }
    });
});

//账户基础信息表单
var base_info_form = new Ext.form.FormPanel({
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
        { name: "Birthday",convert: ConvertJSONDateToJSDateObjectTextField },
        { name: "ZipCode"},
        { name: "Contact" },
        { name: "MemoInfo" }]
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
                //allowBlank: false,
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
                        return checkDate(value);
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
                    mPwd.show();
                }
            }, {
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: "保存基础信息",
                handler: function () {
                    UpdateAccount();
                }
            }]
        }]
    }]
});

function checkDate(value) {
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
function UpdateAccount() {
    var MobileLength = base_info_form.find("name", "MobileNo")[0].getValue().trim().length; //获取手机长度
    var IdLength = base_info_form.find("name", "IdNo")[0].getValue().trim().length; //获取身份证号码长度
    var Mobile = base_info_form.find("name", "MobileNo")[0].getValue(); //获取手机号码
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

    if (parseInt(IdLength) != 18 && parseInt(IdLength) != 15 && parseInt(IdLength) != 0) {
        Ext.MessageBox.alert("提醒", "身份证号码长度不正确！");
        return false;
    };
    if (base_info_form.getForm().isValid()) {
        //提交数据
        //addform.body.mask("正在提交，请稍候...");
        base_info_form.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=AddPointAccount&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
//                if (action.result.success) {
//                    base_info_form.getForm().reset();
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
var pwdform = new Ext.form.FormPanel({
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
var mPwd = new Ext.Window({
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
    items: pwdform,
    buttons: [{
        text: '修改',
        handler: function () {
            if (pwdform.getForm().isValid()) {
                Ext.Msg.confirm("提示框", "您确定要修改密码吗？", function (btn) {
                    if (btn == "yes") {
                        checkPassword();
                    }
                })
            }
        }
    }, {
        text: '取消',
        handler: function () {
            mPwd.hide();
            pwdform.getForm().reset();
        }
    }]
});

//判断密码是否相同
function checkPassword() {
    var pwd1 = pwdform.find("name", "newPwd")[0].getValue();
    var pwd2 = pwdform.find("name", "reNewPwd")[0].getValue();

    if (pwd1 != pwd2) {
        Ext.Msg.alert("提示", "两次密码不同！请再次输入！");
        return;
    } else {
        modifyPwd();
    }
}

function modifyPwd() {
    if (pwdform.getForm().isValid()) {
        pwdform.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=UpdatePassword&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    mPwd.hide();
                    pwdform.getForm().reset();
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

//绑定卡 列表grid
var cardForm = new Ext.form.FormPanel({
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
var cardWindow = new Ext.Window({
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
    items: cardForm,
    buttons: [{
        text: '绑定',
        handler: function () {
            var pwd = cardForm.find("name", "Password")[0].getValue();
            if (pwd.length > 0) {
                for (var i = pwd.length - 1; i >= 0; i--) {
                    unicode = pwd.charCodeAt(i);
                    if (unicode > 65280 && unicode < 65375) {
                        Ext.MessageBox.alert("提醒", "密码不能输入全角字符，请输入半角字符");
                        return false;
                    }
                }
            }
            AddCard();
        }
    }, {
        text: '取消',
        handler: function () {
            cardWindow.hide();
            cardForm.getForm().reset();
        }
    }]
});

//绑定会员卡
function AddCard() {
    if (cardForm.getForm().isValid()) {
        cardForm.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=addCard&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    cardWindow.hide();
                    cardForm.getForm().reset();
                    card_store.reload();
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
var membercm = new Ext.grid.ColumnModel({
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
        hidden:true,
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

var card_store = new Ext.data.Store({
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
var removeCardForm = new Ext.form.FormPanel({
    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 70,
    items: [{
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '卡号',
        readOnly:true,
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
var removeCardWindow = new Ext.Window({
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
    items: removeCardForm,
    buttons: [{
        text: ' 解除',
        handler: function () {
            removeCard();
        }
    }, {
        text: '取消',
        handler: function () {
            removeCardWindow.hide();
            removeCardForm.getForm().reset();
        }
    }]
});


var membergrid = new Ext.grid.GridPanel({
    store: card_store,
    cm: membercm,
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
            cardWindow.show();
        }
    }
		, {
		    text: '解除绑定',
		    iconCls: "silk-book",
		    handler: function () {
		        var r = membergrid.getSelectionModel().getSelections();
		        //alert(rows[0].get("id"));
		        if (r.length == 0) {
		            Ext.MessageBox.alert('警告', '最少选择一条信息，解除绑定!');
		        } else {
		            var rows = membergrid.getSelectionModel().getSelections();
		            removeCardWindow.show();
		            //removeCardForm.find("name", "ID")[0].setValue(rows[0].get("ID"));
		            removeCardForm.find("name", "Code")[0].setValue(rows[0].get("Code"));
		        }
		    }
		}]

});

//解除会员卡
function removeCard() {
    if (removeCardForm.getForm().isValid()) {
        removeCardForm.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointAccount.aspx?actionName=removeCard&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    removeCardWindow.hide();
                    removeCardForm.getForm().reset();
                    card_store.reload();
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
var card_info_form = new Ext.form.FormPanel({
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
        items: [membergrid]
    }]
});

//定义列
var balancecm = new Ext.grid.ColumnModel({
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
        renderer: function(value) {
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

var point_store = new Ext.data.Store({
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

var balancegrid = new Ext.grid.GridPanel({
    store: point_store,
    cm: balancecm,
    frame: true,
    height: 120,
    //margins: "2 2 2 2",
    //border: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
    // sm: sm,
    loadMask: true
});

//余额有效期
var account_balance_form = new Ext.form.FormPanel({
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
        items: [balancegrid]
    }]
});



//账户信息 window
var accountInfoWindow = new Ext.Window({
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
        items: [base_info_form, card_info_form, account_balance_form]
    }]
});



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
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -150',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
