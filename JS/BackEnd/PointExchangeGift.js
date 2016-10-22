//查询积分可兑换礼品
var NeedPoint = 0;
var avilablePoint = 0;

var customer_f = new End.customer_formPanel();

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,

    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 80 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.5,
            items: [{
                xtype: "textfield",
                fieldLabel: "身份证号码",
                name: "idNo",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "卡号",
                name: "card",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.5,
            items: [{
                xtype: "textfield",
                fieldLabel: "手机号码",
                name: "mobileNo",
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
                    customer_f.getForm().reset();
                    var idno = pd_top_form.find("name", "idNo")[0].getValue(); 
                    var mobile = pd_top_form.find("name", "mobileNo")[0].getValue();
                    var card = pd_top_form.find("name", "card")[0].getValue();
       
                    rules_store.load({
                        params: { idNo: idno, mobileNo: mobile, card: card }
                    });
                }
            }
            ]
        }]
    }]
});



var fm = Ext.form;

//定义列
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [new Ext.grid.RowNumberer(),{
        //id: "Title",
        header: '礼品类型',
        dataIndex: 'ExcTargetType',
        width: 100,
        renderer: function (v, mdata,record) {
            return ExchangeTargetTypeDataStore.getById(v).get("name");
        }
    },{
        //id: "Title",
        header: '礼品名称',
        dataIndex: 'OnlineName',
        width: 140 
    }, {
        //id: "Title",
        header: '礼品介绍',
        dataIndex: 'OnlineDescription',
        width: 160,
        align: 'right'
    }, {
        id: "ExchangeNum",
        header: "可兑换数量",
        dataIndex: "ExcMaxCount",
        hidden:true,
        width: 120
    }, {
        id: "NeedPoint",
        header: "需积分数量",
        dataIndex: "PointCountUse",
        width: 120
    }, {
        header: "预约兑换",
        align: "center", 
        renderer: function () {
            return "<a href='#' onclick='OrderExchange();'>预约兑换</a>";
        }
    }]
});

var rules_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: "../Apis/PointRules.aspx?actionName=getRulesByIdNo&sid=" + Sys.sid,
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
                { name: "PointCountUse", mapping: "PointCountUse" },
                { name: "OnlineName", mapping: "OnlineName" },
                { name: "PointCountUse", mapping: "PointCountUse" },
                { name: "OnlineDescription", mapping: "OnlineDescription" },
                { name: "PointCountUse", mapping: "PointCountUse" },
                { name: 'ExcMaxCount', mapping: 'ExcMaxCount' },
                { name: "ExcTargetType"}
            ]
    })
});

rules_store.on('load', function (store, records) {
    //alert("load...");
    //加载成功后，读取客户信息
    customer_f.load({
        params: pd_top_form.getForm().getValues()
    });
    if (store.getCount() == 0) {
        Ext.MessageBox.alert("提醒", "该用户没有积分可兑换礼品信息！");
    };
});

rules_store.on("loadexception", function (mis) {
    customer_f.load({
        params: pd_top_form.getForm().getValues()
    });
   Ext.MessageBox.alert("提醒", "无该积分账户！请重新核对身份证或手机号码！");
    rules_store.removeAll();
});


function OrderExchange() {
    OrderExchangeWindow.show();

    var rows = pd_grid.getSelectionModel().getSelections();
    CustomerName = customer_f.find("name", "customerName")[0].getValue();
    ExcTargetType = rows[0].get("ExcTargetType");
    //判断是取货方式
    if (ExcTargetType == '1') {
        exchangeForm.find("hiddenName", "GetType")[0].setValue("0");
        exchangeForm.find("hiddenName", "GetType")[0].disabled = true;
    } else {
        exchangeForm.find("hiddenName", "GetType")[0].store = getTypeStore;
        exchangeForm.find("hiddenName", "GetType")[0].disabled = false;
    }
    idNo = customer_f.find("name", "idNo")[0].getValue();
    mobileNo = customer_f.find("name", "mobileNo")[0].getValue();
    var AccountID = customer_f.find("name", "id")[0].getValue();
    //alert(AccountID);
    avilablePoint = customer_f.find("name", "avilablePoint")[0].getValue();
    //alert("AccountID"+AccountID);
    //单个礼品所需要多少积分数量
    NeedPoint = rows[0].get("PointCountUse");
    //积分账户ID
    exchangeForm.find("name", "PointAccountID")[0].setValue(AccountID);
    pwdform.find("name", "ID")[0].setValue(AccountID);
    //RuleID
    exchangeForm.find("name", "RuleID")[0].setValue(rows[0].get("ID"));
    exchangeForm.find("name", "PointCount")[0].setValue(NeedPoint);
    exchangeForm.find("name", "CustomerName")[0].setValue(CustomerName);
    exchangeForm.find("name", "IdNo")[0].setValue(idNo);
    exchangeForm.find("name", "MobileNo")[0].setValue(mobileNo);
    exchangeForm.find("name", "OnlineName")[0].setValue(rows[0].get("OnlineName"));
    exchangeForm.find("name", "AvilablePoint")[0].setValue(avilablePoint);
    exchangeForm.find("name", "Quantity")[0].setValue("1");
    exchangeForm.find("name", "TotalCount")[0].setValue(NeedPoint);
     
    //兑换窗口中的一些信息
    exchangeForm.find("name", "Consignee")[0].setValue(customer_f.find("name", "customerName")[0].getValue());
    exchangeForm.find("name", "TelNo")[0].setValue(customer_f.find("name", "mobileNo")[0].getValue());
    exchangeForm.find("name", "Address")[0].setValue(customer_f.find("name", "address")[0].getValue());
    exchangeForm.find("name", "ZipCode")[0].setValue(customer_f.find("name", "zipCode")[0].getValue());
    //exchangeForm.find("name", "Consignee")[0].setValue(customer_f.find("name", "customerName")[0].getValue());


    exchangeForm.find("name", "ReservationDept")[0].setValue(document.getElementById("DeptID").value);
    exchangeForm.find("name", "ReservationDeptName")[0].setValue(document.getElementById("DeptName").value);
}

var exchangeForm = new Ext.form.FormPanel({
    //xtype: "form",
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    //bodyStyle: 'padding:5px 5px 0',
    width: 460,
    //height: 500,
    items: [{
        layout: 'column',
        items: [{
            columnWidth: .5,
            layout: 'form',
            defaults: { width: 280 },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'AvilablePoint',
                name: 'AvilablePoint',
                hidden: true,
                anchor: '95%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'PointCount',
                name: 'PointCount',
                hidden: true,
                anchor: '95%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'PointAccountID',
                name: 'PointAccountID',
                hidden: true,
                anchor: '95%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'RuleID',
                name: 'RuleID',
                hidden: true,
                anchor: '95%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Status',
                name: 'Status',
                hidden: true,
                emptyText: "0",
                anchor: '95%'
            }, {
                xtype: 'textfield',
                fieldLabel: '客户名称',
                name: 'CustomerName',
                disabled: true,
                anchor: '95%'
            }, {
                xtype: 'textfield',
                fieldLabel: '身份证号码',
                name: 'IdNo',
                disabled: true,
                anchor: '95%'
            }, {
                xtype: 'textfield',
                fieldLabel: '手机号码',
                name: 'MobileNo',
                disabled: true,
                anchor: '95%'
            }, {
                xtype: 'datefield',
                fieldLabel: '预约时间',
                name: 'ReservationDate',
                emptyText: new Date().toLocaleDateString(),
                anchor: '95%'
            }, {
                xtype: "textfield",
                //decimalPrecision:0,
                readOnly: true,
                fieldLabel: '取货门店',
                name: 'ReservationDeptName',
                anchor: '95%'
            }, {
                xtype: "textfield",
                //decimalPrecision:0,
                readOnly: true,
                hidden: true,
                fieldLabel: '取货门店ID',
                name: 'ReservationDept',
                anchor: '95%'
            }]
        }, {
            columnWidth: .5,
            layout: 'form',
            defaults: { width: 280 },
            items: [{
                xtype: 'textfield',
                fieldLabel: '礼品名称',
                name: 'OnlineName',
                disabled: true,
                anchor: '95%'
            }, {
                xtype: 'numberfield',
                fieldLabel: '礼品数量',
                allowBlank: false,
                readOnly: true,
                name: 'Quantity',
                anchor: '95%',
                enableKeyEvents: true,
                listeners: {
                    'keyup': function (textfield, e) {
                        var num = e.getTarget().value;
                        var point = NeedPoint;

                        exchangeForm.find("name", "Quantity")[0].setValue(num);
                        var totalPoint = num * point;
                        exchangeForm.find("name", "TotalCount")[0].setValue(totalPoint);
                    }
                }
            }, {
                xtype: "textfield",
                //decimalPrecision:0,
                readOnly: true,
                fieldLabel: '合计兑换积分数量',
                name: 'TotalCount',
                anchor: '95%'
            }, {
                xtype: 'combo',
                fieldLabel: '取货方式',
                hiddenName: 'GetType',
                editable: false,
                forceSelection: true,
                valueField: "id",
                value: "0",
                mode: 'local',
                //emptyText: 'Select a model...',
                store: getTypeStore,
                displayField: "name",
                triggerAction: "all",
                anchor: '95%'
            }, {
                xtype: "button",
                text: "选择其他门店",
                hidden: true,
                anchor: "95%"
            }]
        }]
    }, {
        layout:"form",
        //xtype: "form",
        name: "wlForm",
        items: [{
            xtype: "textfield",
            fieldLabel: "收货人",
            name: "Consignee",
            anchor: '97%'
        }, {
            xtype: "textfield",
            fieldLabel: "联系方式",
            name: "TelNo",
            anchor: '97%'
        }, {
            xtype: "textfield",
            fieldLabel: "收货地址",
            name: "Address",
            anchor: '97%'
        }, {
            xtype: "textfield",
            fieldLabel: "邮编",
            name: "ZipCode",
            anchor: '97%'
        }, {
            xtype: "textfield",
            fieldLabel: "备注",
            name: "MemoInfo",
            anchor: '97%'
        }]
    }, {
        buttons: [{
            text: '保  存',
            handler: function () {
                mPwd.show();
            }
        }, {
            text: '取  消',
            handler: function () {
                exchangeForm.getForm().reset();
                OrderExchangeWindow.hide();
            }
        }]
    }]
});

//验证密码
var pwdform = new Ext.form.FormPanel({
    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 70,
    items: [{
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '请输入密码',
        name: 'pwd',
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

//密码验证窗口
var mPwd = new Ext.Window({
    title: '密码验证',
    closeAction: 'hide',
    iconCls: 'find',
    width: 280,
    height: 130,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: pwdform,
    buttons: [{
        text: '确 认',
        handler: function () {
            if (pwdform.getForm().isValid()) {
                checkPassword();
            }
        }
    }, {
        text: '取 消',
        handler: function () {
            mPwd.hide();
            pwdform.getForm().reset();
        }
    }]
});

function checkPassword() {
    if (pwdform.getForm().isValid()) {
        //提交数据
        //addform.body.mask("正在提交，请稍候...");
        pwdform.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointExchange.aspx?actionName=checkPassword&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    pwdform.getForm().reset();
                    mPwd.hide();
                    PointExchange();
                }
                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
            }
        });
    }
}

function PointExchange() {
    var total = exchangeForm.find("name", "TotalCount")[0].getValue();
    //alert("total=" + total);
    var tempPoint = avilablePoint;
    //alert("tempPoint=" + tempPoint);
    //alert(tempPoint < total);
    //return;
    if (tempPoint < total) {
        //alert(tempPoint < total);
        Ext.MessageBox.alert("提醒", "您的积分不够兑换该礼品！");
        return;
    } else {
        if (exchangeForm.getForm().isValid()) {
            //提交数据
            //addform.body.mask("正在提交，请稍候...");
            exchangeForm.getForm().submit({
                waitMsg: "正在提交，请稍候...",
                url: "../Apis/PointExchange.aspx?actionName=PointExchangeMgr&sid=" + Sys.sid,
                //params: exchangeForm.find("name","wlForm")[0].getForm().getValues(),
                success: function (form, action) {
                    //addform.body.unmask();
                    Ext.MessageBox.alert("提醒", action.result.msg);
                    if (action.result.success) {
                        exchangeForm.getForm().reset();
                        OrderExchangeWindow.hide();
                        rules_store.reload();
                    }
                    //操作成功
                },
                failure: function (form, action) {
                    if (action != undefined && action.result != undefined) {
                        Ext.MessageBox.alert("提醒", action.result.msg);
                    } else {
                        Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                    }
                }
            });
        }
    }
}

var OrderExchangeWindow = new Ext.Window({
        layout: 'fit',
        width: 600,
        height: 380,
        modal: true,
        closeAction: 'hide',
        title: "预约兑换",
        plain: true,
        items:[exchangeForm]
});

var pd_grid = new Ext.grid.GridPanel({
    store: rules_store,
    cm: cm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 

    loadMask: true
});

//主容器
var pd_main_panel = new Ext.Panel({
    //autoScroll: true,
    border:false,
    //autoWidth:true,
    layout: "anchor",
    //anchorSize: { width: 800, height: 600 },
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form,customer_f]
    }, {
        layout:"fit",
        border: false,
        anchor: '-1 -145',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
