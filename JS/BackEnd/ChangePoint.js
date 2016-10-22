//积分调整


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
            }, {
                xtype: "datefield",
                fieldLabel: "开始日期",
                name: "dateBegin",
                //emptyText: DateToString((new Date()).add("y",-1)),
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "卡号",
                name: "card",
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
                xtype: "datefield",
                fieldLabel: "结束日期",
                name: "dateEnd",
                //emptyText:DateToString(new Date()),
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
                    store.removeAll();
                    search();
                }
            }, {
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                margins: "0 0 0 5",
                bodyStyle: "margin:0 5px",
                text: " 积分调整",
                handler: function () {
                    baseForm.getForm().reset();
                    ChangePointWindow.show();
                }
            }]
        }]

    }]
});

function search() {
    var IdNo = pd_top_form.find("name", "idNo")[0].getValue();
    var Mobile = pd_top_form.find("name", "mobileNo")[0].getValue();
    var Card = pd_top_form.find("name", "card")[0].getValue();
    if (IdNo.length == 0 && Mobile.length == 0 && Card == 0) {
        Ext.MessageBox.alert("提醒", "请输入查询条件！");
        return;
    };
    var data = pd_top_form.getForm().getValues();
    store.load({
        params: data
    });
}
var store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/ChangePoint.aspx?actionName=getChangPoint&sid=' + Sys.sid,
    remoteSort: true,
    reader: new Ext.data.JsonReader({
        root: "results",
        totalProperty: 'totalCount',
        fields: [
                { name: 'UserName', mapping: 'CustomerName' },
                { name: "PointIdNo", mapping: "IdNo" },
                { name: "PointMobileNo", mapping: "MobileNo" },
                { name: "PointCount", mapping: "PointCount" },
                { name: "PointBillDate", mapping: "BillDate" },
                { name: "PointExpiredDate", mapping: "ExpiredDate" },
                { name: "ChangeReason", mapping: "Reason" },
                { name: "ChangeModel", mapping: "RegulationType" },
                { name: "MemoInfo", mapping: "MemoInfo" }
            ]
    })
})
store.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "没有查到数据！");
    store.removeAll();
});

var modelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'ChangeModel'],
    data: [["IN", "调增"],
            ["OUT", "调减"]]
});
var tar_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/VerifyCode.aspx?actionName=getDept&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }
            ]
    }),
    sortInfo: { field: 'ID', direction: 'ASC' }
});

var baseForm = new Ext.form.FormPanel({
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    items: [{
        xtype: "fieldset",
        title: "用户基础信息",
        defaults: { labelAlign: "right", width: 50 },
        layout: "column",
        items: [{
            columnWidth: .4,
            layout: 'form',
            defaults: { width: 300 },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'ID',
                name: "ID",
                hidden: true
            }, {
                xtype: 'textfield',
                fieldLabel: '客户姓名',
                name: 'UserName',
                disabled: true,
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: '身份证号码',
                disabled: true,
                name: 'IdNo',
                anchor: '100%'
            }]

        }, {
            columnWidth: .4,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '手机号码',
                disabled: true,
                name: 'Mobile',
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: '当前积分数量',
                disabled: true,
                name: 'PointNum',
                anchor: '100%'
            }]
        }, {
            layout: "form",
            bodyStyle: "margin:0 5px",
            columnWidth: .15,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 50,
                text: " 查  询",
                handler: function () {
                    pd_store.removeAll();
                    baseWindow.show();
                }
            }]
        }]
    }, {
        xtype: "fieldset",
        title: "积分调整",
        defaults: { labelAlign: "right", width: 50 },
        layout: "column",
        items: [{
            columnWidth: .5,
            layout: 'form',
            defaults: { width: 300 },
            items: [{
                xtype: "combo",
                fieldLabel: "门 店",
                hiddenName: "DeptID",
                anchor: "93%",
                triggerAction: 'all',

                store: tar_store,
                valueField: 'ID',
                displayField: 'Title',

                enableKeyEvents: true,

                selectOnFocus: true,
                allowBlank: false,
                listeners: {
                    "keyup": function (v) {
                        tar_store.load({
                            params: { dName: v.getRawValue() }
                        });
                    }
                }
            }, {
                xtype: 'combo',
                fieldLabel: '调整模式',
                hiddenName: 'RegulationType',
                editable: false,
                selectOnFocus: true,
                forceSelection: true,
                mode: 'local',
                store: modelStore,
                displayField: "ChangeModel",
                valueField: "ID",
                mode: "local",
                triggerAction: "all",
                anchor: '93%',
                allowBlank: false
            }]

        }, {
            columnWidth: .5,
            layout: 'form',
            items: [{
                xtype: 'numberfield',
                fieldLabel: '积分数量',
                name: 'PointCount',
                allowBlank: false,
                anchor: '93%'
            },{
                xtype: "datefield",
                //decimalPrecision:0,
                fieldLabel: '积分有效期',
                name: 'Period',
//                allowBlank: false,
                hidden: true,
                format: "Y-m-d",
                anchor: '93%'
            } ]
        }, {
            columnWidth: 1,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '调整理由',
                name: 'ChangeReason',
                anchor: '97%'
            }, {
                xtype: 'textfield',
                fieldLabel: '备  注  ',
                name: 'MemoInfo',
                anchor: '97%'
            }]
        }]
    }, {
        buttons: [{
            text: '保  存',
            handler: function () {
                DeptID();
            }
        }, {
            text: '取  消',
            handler: function () {
                ChangePointWindow.hide();
            }
        }]
    }]
});


var ChangePointWindow = new Ext.Window({
    layout: 'fit',
    width: 620,
    height: 340,
    modal: true,
    closeAction: 'hide',
    title: "积分调整",
    plain: true,
    items: [{
        autoScroll: true,
        items: [baseForm]
    }]
});

var baseChangePointForm = new Ext.form.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    autoScroll: true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "right", width: 50 },
        layout: "column",
        items: [{
            columnWidth: .4,
            layout: 'form',
            defaults: { width: 300 },
            items: [{
                xtype: 'textfield',
                fieldLabel: '身份证号码',
                name: 'IdNo',
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: '卡号',
                name: 'CardID',
                anchor: '100%'
            }]

        }, {
            columnWidth: .4,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '手机号码',
                name: 'Mobile',
                anchor: '100%'
            }]
        }, {
            layout: "form",
            bodyStyle: "margin:0 5px",
            columnWidth: .15,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 50,
                text: " 查  询",
                handler: function () {
                    var IdNo = baseChangePointForm.find("name", "IdNo")[0].getValue();
                    var Mobile = baseChangePointForm.find("name", "Mobile")[0].getValue();
                    var CardID = baseChangePointForm.find("name", "CardID")[0].getValue();
                    if (IdNo.length == 0 && Mobile == 0 && CardID == 0) {
                        Ext.MessageBox.alert("提醒", "请输入查询条件!");
                        return;
                    }
                    pd_store.removeAll();
                    baseChangePointForm.getForm().reset();
                    pd_store.load({
                        params: { IdNo: IdNo, Mobile: Mobile, CardID: CardID }
                    });
                }
            }]
        }]
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    url: '../Apis/ChangePoint.aspx?actionName=getPointRegulation&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: 'ID', mapping: 'Id' },
                { name: 'CustomerName', mapping: 'CustomerName' },
                { name: "IdNo", mapping: "IdNo" },
                { name: "MobileNo", mapping: "MobileNo" },
                { name: "PointCount", mapping: "PointCount" }
            ]
    })
});

var base_cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(), {
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    },
    {
        //id: "Code",
        header: '客户姓名',
        dataIndex: 'CustomerName',
        width: 80
    }, {
        //id: "Title",
        header: '身份证号',
        dataIndex: 'IdNo',
        align: 'right',
        width: 120
    }, {
        //id: "Title",
        header: '手机号',
        dataIndex: 'MobileNo',
        width: 160,
        align: 'right'
    }, {
        //id: "ExchangeNum",
        header: "积分数量",
        dataIndex: "PointCount",
        width: 140
    }]
});
var base_pd_grid = new Ext.grid.GridPanel({
    height: 150,
    store: pd_store,
    cm: base_cm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 

    loadMask: true
});
base_pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = base_pd_grid.getStore().getAt(rowindex);
    baseForm.find("name", "ID")[0].setValue(r.get("ID"));
    baseForm.find("name", "UserName")[0].setValue(r.get("CustomerName"));
    baseForm.find("name", "IdNo")[0].setValue(r.get("IdNo"));
    baseForm.find("name", "Mobile")[0].setValue(r.get("MobileNo"));
    baseForm.find("name", "PointNum")[0].setValue(r.get("PointCount"));
    baseWindow.hide();
});
var base_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    items: [{
        xtype: "fieldset",
        collapsible: true,
        title: "用户信息",
        items: [base_pd_grid]
    }]
});
var baseWindow = new Ext.Window({
    layout: 'fit',
    width: 620,
    height: 370,
    modal: true,
    closeAction: 'hide',
    title: "基础信息查询",
    plain: true,
    items: [{
        autoScroll: true,
        items: [baseChangePointForm, base_form]
    }]
});
function DeptID() {
    if (baseForm.getForm().isValid()) {
        var iPountId = baseForm.find("name", "ID")[0].getValue();
        if (iPountId.length == 0) {
            Ext.MessageBox.alert("提醒", "请先查询数据！");
            return;
        }
        baseForm.getForm().submit({
            params: { did: baseForm.find("hiddenName", "DeptID")[0].getValue() },
            url: "../Apis/VerifyCode.aspx?actionName=getDid&sid=" + Sys.sid,
            success: function (form, action) {
                ChangePoint();
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
};

//调整积分
function ChangePoint() {
    if (baseForm.getForm().isValid()) {
        baseForm.getForm().submit({
            params: { Point:  baseForm.find("name", "PointNum")[0].getValue() },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/ChangePoint.aspx?actionName=submitPoint&sid=" + Sys.sid,
            success: function (form, action) {
                //AddExchangeForm.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    baseForm.getForm().reset();
                }
                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //AddExchangeForm.body.unmask();
            }
        });
    }
}


var fm = Ext.form;

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
        dataIndex: 'UserName',
        width: 80
    }, {
        //id: "Title",
        header: '身份证号',
        dataIndex: 'PointIdNo',
        align: 'right',
        width: 120
    }, {
        //id: "Title",
        header: '手机号',
        dataIndex: 'PointMobile',
        align: 'right',
        width: 120
    }, {
        //id: "ExchangeNum",
        header: "调整模式",
        dataIndex: "ChangeModel",
        width: 140,
        renderer: function (v) {
            if (v == "IN") {
                return "增加";
            } else {
                return "减少";
            }
        }
    }, {
        //id: "Title",
        header: '积分数量',
        dataIndex: 'PointCount',
        align: 'right',
        width: 120
    }, {
        //id: "Title",
        header: '调整日期',
        dataIndex: 'PointBillDate',
        align: 'right',
        width: 120
        
    }, {
        //id: "Title",
        header: '积分有效期',
        dataIndex: 'PointExpiredDate',
        width: 160,
        align: 'right',
        hidden: true
        
    }, {
        //id: "ExchangeNum",
        header: "调整理由",
        dataIndex: "ChangeReason",
        width: 140
    }, {
        header: "备注",
        dataIndex: "MemoInfo",
        width: 140
    }]
});

store.on('beforeload', function (thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    thiz.baseParams["dateBegin"] = pd_top_form.find("name", "dateBegin")[0].getValue();
    thiz.baseParams["dateEnd"] = pd_top_form.find("name", "dateEnd")[0].getValue();
    thiz.baseParams["idNo"] = pd_top_form.find("name", "idNo")[0].getValue();
    thiz.baseParams["mobile"] = pd_top_form.find("name", "mobileNo")[0].getValue();
    thiz.baseParams["card"] = pd_top_form.find("name", "card")[0].getValue();
});


var pd_grid = new Ext.grid.GridPanel({
    store: store,
    cm: cm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 

    loadMask: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
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
        anchor: '-1 -135',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
