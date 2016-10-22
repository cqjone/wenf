//积分兑换功能  后台 查询 积分可兑换界面
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
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "身份证号码",
                name: "idNo",
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
                    //seacrhReservation();
                    var idno = pd_top_form.find("name", "idNo")[0].getValue();
                    var mobile = pd_top_form.find("name", "mobileNo")[0].getValue();

                        pd_store.load({
                            params: { idNo: idno, mobileNo: mobile }
                        });
                }
            }
            ]
        }]

    }]
    });

var fm = Ext.form;

//定义 勾选框SM
//var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
//定义列
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    //sm,    
    {
        //id: "Title",
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: 'AccountID',
        dataIndex: 'AccountID',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: '收货人',
        dataIndex: 'Consignee',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: '收货地址',
        dataIndex: 'Address',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: '邮编',
        dataIndex: 'ZipCode',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: '联系方式',
        dataIndex: 'TelNo',
        hidden: true,
        width: 100
    }, {
        //id: "Code",
        header: '客户姓名',
        dataIndex: 'CustomerName',
        width: 90
    }, {
        //id: "Code",
        header: '身份证号码',
        dataIndex: 'IdNo',
        width: 130
    }, {
        //id: "Code",
        header: '手机号码',
        dataIndex: 'MobileNo',
        width: 90
    }, {
        //id: "Title",
        header: '预约时间',
        dataIndex: 'ReservationDate',
        width: 90,
        renderer: function (v) {
            return DateToString(ConvertJSONDateToJSDateObject(v));
        }
    }, {
        //id: "Title",
        header: '礼品名称',
        dataIndex: 'OnlineName',
        width: 90
    }, {
        //id: "Title",
        header: '礼品类型',
        dataIndex: 'ExcTargetType',
        width: 100,
        renderer: function (v, mdata, record) {
            return ExchangeTargetTypeDataStore.getById(v).get("name");
        }
    }, {
       
        header: "礼品数量",
        dataIndex: "Quantity",
        width: 60,
        align: 'right'
    }, {

        header: "积分数量",
        dataIndex: "TotalCount",
        width: 70,
        align: 'right'
    }, {
        header: "操作",
        align: "center",
        renderer: function () {
            return "<a href='#' onclick='doSendOut();'>发 货</a>";
        }
    }, {
        header: "取消",
        align: "center",
        renderer: function () {
            return "<a href='#' onclick='cancelExchange();'>取消兑换</a>";
        }
    }
    ]
});

//取消预约兑换
function cancelExchange() {
    var r = pd_grid.getSelectionModel().getSelections();
    
    Ext.Msg.confirm("提示框", "您确定要取消兑换吗？", function (btn) {
        if (btn == "yes") {
            Ext.Ajax.request({
                url: '../Apis/PointExchange.aspx?actionName=cancelExchange&sid=' + Sys.sid,
                params: "EID=" + r[0].get("ID") +
                "&productName=" + r[0].get("OnlineName")
                +"&mobileNo=" + r[0].get("MobileNo"),

                method: "POST",
                success: function (response) {
                    //Ext.Msg.alert(Ext.util.JSON.decode(response.responseText));
                    if (Ext.util.JSON.decode(response.responseText).success) {
                        Ext.Msg.alert("信息", "数据更新成功！");
                        pd_store.removeAll();
                        pd_store.reload();
                    } else {
                        Ext.Msg.alert("信息", Ext.util.JSON.decode(response.responseText).msg);
                    }
                },
                failure: function (response) {
                    Ext.Msg.alert("警告", "数据更新失败，请稍后再试！");
                }
            }) 
        }
    })
}

//发货表单
function doSendOut() {
    var rows = pd_grid.getSelectionModel().getSelections();
    SendOutWindow.show();
    var billID = rows[0].get("ID");
    var AccountID = rows[0].get("AccountID");
    var CustomerName = rows[0].get("CustomerName");
    var IdNo = rows[0].get("IdNo");
    var MobileNo = rows[0].get("MobileNo");
    
    var Consignee = rows[0].get("Consignee");
    var Address = rows[0].get("Address");
    var ZipCode = rows[0].get("ZipCode");
    var TelNo = rows[0].get("TelNo");

    sendOutForm.find("name", "AccountID")[0].setValue(AccountID);
    sendOutForm.find("name", "EID")[0].setValue(billID);
    sendOutForm.find("name", "CustomerName")[0].setValue(CustomerName);
    sendOutForm.find("name", "IdNo")[0].setValue(IdNo);
    sendOutForm.find("name", "MobileNo")[0].setValue(MobileNo);
    sendOutForm.find("name", "Consignee")[0].setValue(Consignee);
    sendOutForm.find("name", "Address")[0].setValue(Address);
    sendOutForm.find("name", "ZipCode")[0].setValue(ZipCode);
    sendOutForm.find("name", "TelNo")[0].setValue(TelNo);
}


var sendOutForm = new Ext.form.FormPanel({
    xtype: "form",
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 460,
    height: 300,
    items: [{
        layout: 'column',
        //defaults: { width: 210 },
        items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'AccountID',
                        name: 'AccountID',
                        hidden: true,
                        emptyText: "0",
                        anchor: '95%'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'EID',
                        name: 'EID',
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
                        xtype: 'textfield',
                        fieldLabel: '收货地址',
                        readOnly: true,
                        name: 'Address',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '联系方式',
                        readOnly: true,
                        name: 'TelNo',
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [ {
                        xtype: "textfield",
                        //decimalPrecision:0,
                        //readOnly: true,
                        fieldLabel: '收货人',
                        readOnly: true,
                        name: 'Consignee',
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        //decimalPrecision:0,
                        //readOnly: true,
                        fieldLabel: '邮编',
                        name: 'ZipCode',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        fieldLabel: '物流公司',
                        name: 'LogisticsCmp',
                        allowBlank: false,
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        fieldLabel: '物流单号',
                        name: 'LogisticsNo',
                        allowBlank: false,
                        anchor: '95%'
                    }]
                }]
    }, {
        buttons: [{
            text: '发  货',
            handler: function () {
                UpdatebPointExchange();
            }
        }, {
            text: '取  消',
            handler: function () {
                sendOutForm.getForm().reset();
                SendOutWindow.hide();
            }
        }]
    }]
});

var SendOutWindow = new Ext.Window({
    layout: 'fit',
    width: 600,
    height: 250,
    modal: true,
    closeAction: 'hide',
    title: "兑换发货",
    plain: true,
    items: [sendOutForm]
});

//更新bPointExchange信息
function UpdatebPointExchange() {
    if (sendOutForm.getForm().isValid()) {
    //提交数据
    sendOutForm.getForm().submit({
        waitMsg: "正在提交，请稍候...",
        url: "../Apis/PointExchange.aspx?actionName=updatebPointExchange&sid=" + Sys.sid,
        success: function (form, action) {
            //addform.body.unmask();
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {
                sendOutForm.getForm().reset();
                SendOutWindow.hide();
                pd_store.removeAll();
                pd_store.reload();
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

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    url: '../Apis/PointExchange.aspx?actionName=getUnexchange&sid=' + Sys.sid,

    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        //root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "AccountID", mapping: "AccountID" },
                { name: 'ReservationDate', mapping: 'ReservationDate' },
                { name: 'Quantity', mapping: 'Quantity' },
                { name: 'Consignee', mapping: 'Consignee' },
                { name: 'Address', mapping: 'Address' },
                { name: 'ZipCode', mapping: 'ZipCode' },
                { name: 'TelNo', mapping: 'TelNo' },
                { name: "TotalCount", mapping: "TotalCount" },
                { name: "CustomerName", mapping: "CustomerName" },
                { name: 'IdNo', mapping: 'IdNo' },
                { name: 'MobileNo', mapping: 'MobileNo' },
                { name: "OnlineName", mapping: "OnlineName" },
                { name: "ExcTargetType", mapping: "ExcTargetType" }
            ]
    })
});

pd_store.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "无该积分账户或该账户无可兑换信息！");
    pd_store.removeAll();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    sm: sm,
    loadMask: true
});

//===========================双击获取该单据 开始======================================//
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    batchExchange(r);

    var IdNo = r.get("IdNo");
    var mobileNo = r.get("MobileNo");
    //alert(IdNo);
    UserExchangeWindow.show();
    exchange_store.removeAll();
    exchange_store.load({
        params: { idNo: IdNo }
    });

});

//===========================双击获取该单据 开始======================================//

function batchExchange(rows) {
    //var rows = pd_grid.getSelectionModel().getSelections();
    //SendOutWindow.show();
    //var billID = rows.get("ID");
    var AccountID = rows.get("AccountID");
    var CustomerName = rows.get("CustomerName");
    var IdNo = rows.get("IdNo");
    var MobileNo = rows.get("MobileNo");

    var Consignee = rows.get("Consignee");
    var Address = rows.get("Address");
    var ZipCode = rows.get("ZipCode");
    var TelNo = rows.get("TelNo");

    BatchForm.find("name", "AccountID")[0].setValue(AccountID);
    //BatchForm.find("name", "EID")[0].setValue(billID);
    BatchForm.find("name", "CustomerName")[0].setValue(CustomerName);
    BatchForm.find("name", "IdNo")[0].setValue(IdNo);
    BatchForm.find("name", "MobileNo")[0].setValue(MobileNo);
    BatchForm.find("name", "Consignee")[0].setValue(Consignee);
    BatchForm.find("name", "Address")[0].setValue(Address);
    BatchForm.find("name", "ZipCode")[0].setValue(ZipCode);
    BatchForm.find("name", "TelNo")[0].setValue(TelNo);
}

//批量兑换form
var BatchForm = new Ext.form.FormPanel({
    xtype: "form",
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 460,
    height: 178,
    items: [{
        layout: 'column',
        //defaults: { width: 210 },
        items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'AccountID',
                        name: 'AccountID',
                        hidden: true,
                        emptyText: "0",
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'EID',
                        name: 'EID',
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
                        xtype: 'textfield',
                        fieldLabel: '收货地址',
                        readOnly: true,
                        name: 'Address',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '联系方式',
                        readOnly: true,
                        name: 'TelNo',
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: "textfield",
                        //decimalPrecision:0,
                        //readOnly: true,
                        fieldLabel: '收货人',
                        readOnly: true,
                        name: 'Consignee',
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        //decimalPrecision:0,
                        //readOnly: true,
                        fieldLabel: '邮编',
                        name: 'ZipCode',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        fieldLabel: '物流公司',
                        name: 'LogisticsCmp',
                        allowBlank: false,
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        fieldLabel: '物流单号',
                        name: 'LogisticsNo',
                        allowBlank: false,
                        anchor: '95%'
                    }]
                }]
    }, {
        buttons: [{
            text: '批量兑换',
            handler: function () {
                var msg = '';
                var ids = sm.getSelections();
                Ext.each(ids, function (node) {
                    if (msg.length > 0) {
                        msg += ', ';
                    }
                    msg += node.id;

                });
                if (msg == "") {
                    Ext.MessageBox.alert("警告", "您未选中任何兑换单据！");
                } else {
                    BatchForm.find("name", "EID")[0].setValue(msg);
                    BatchExchange();
                }
            }
        }, {
            text: '取  消',
            handler: function () {
                BatchForm.getForm().reset();
                UserExchangeWindow.hide();
            }
        }]
    }]
});

//批量兑换方法
function BatchExchange() {
    if (BatchForm.getForm().isValid()) {
        //提交数据
        BatchForm.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointExchange.aspx?actionName=batchExchange&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    BatchForm.getForm().reset();
                    UserExchangeWindow.hide();
                    pd_store.removeAll();
                    pd_store.reload();
                    exchange_store.reload();
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
};

//=========================兑换store==================================//
//定义 勾选框SM
var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
//定义列
var ExchangeCm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    sm,
     {
         //id: "Title",
         header: 'ID',
         dataIndex: 'ID',
         hidden: true,
         width: 100
     }, {
        //id: "Title",
        header: '预约时间',
        dataIndex: 'ReservationDate',
        width: 100,
        renderer: function (v) {
            return DateToString(ConvertJSONDateToJSDateObject(v));
        }
    }, {
        //id: "Title",
        header: '礼品名称',
        dataIndex: 'OnlineName',
        width: 100
    }, {
       
        header: "礼品数量",
        dataIndex: "Quantity",
        width: 100,
        align: 'right'
    }, {

        header: "积分数量",
        dataIndex: "TotalCount",
        width: 100,
        align: 'right'
    }
    
    ]
});

var exchange_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    url: '../Apis/PointExchange.aspx?actionName=getUnexchange&sid=' + Sys.sid,

    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        idProperty: 'ID',
        //root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "AccountID", mapping: "AccountID" },
                { name: 'ReservationDate', mapping: 'ReservationDate' },
                { name: 'Quantity', mapping: 'Quantity' },
                { name: 'Consignee', mapping: 'Consignee' },
                { name: 'Address', mapping: 'Address' },
                { name: 'ZipCode', mapping: 'ZipCode' },
                { name: 'TelNo', mapping: 'TelNo' },
                { name: "TotalCount", mapping: "TotalCount" },
                { name: "CustomerName", mapping: "CustomerName" },
                { name: 'IdNo', mapping: 'IdNo' },
                { name: 'MobileNo', mapping: 'MobileNo' },
                { name: "OnlineName", mapping: "OnlineName" },
                { name: "ExcTargetType", mapping: "ExcTargetType" }
            ]
    })
});


var exchage_grid = new Ext.grid.GridPanel({
    store: exchange_store,
    cm: ExchangeCm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    sm: sm,
    loadMask: true
});

//===========================================================//



var action_main_panel = new Ext.Panel({
    //autoScroll: true,
    border: false,
    //autoWidth:true,
    layout: "anchor",
    //anchorSize: { width: 800, height: 600 },
    items: [{
        frame: true,
        layout: "fit",
        border: false,
        items: [BatchForm]
    }, {
        layout: "fit",
        frame: true,
        border: false,
        anchor: '-1 -100',
        items: [exchage_grid]
    }]
});

//用户兑换窗口
var UserExchangeWindow = new Ext.Window({
    layout: 'fit',
    width: 630,
    height: 400,
    modal: true,
    closeAction: 'hide',
    title: "用户兑换",
    plain: true,
    items: [action_main_panel]
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
        border:false,
        items: [pd_top_form]
    }, {
        layout:"fit",
        border: false,
        anchor: '-1 -100',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
