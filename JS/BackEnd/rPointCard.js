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
        defaults: { labelAlign: "right", width: 80 },
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "开始日期",
                name: "BeginDate",
                value: new Date(),
                emptyText: DateToString(new Date()),
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "结束日期",
                name: "EndDate",
                value: DateToString(new Date()),
                emptyText: DateToString(new Date()),
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            columnWidth: 0.2,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    var begindate = pd_top_form.find("name", "BeginDate")[0].getValue();
                    var enddate = pd_top_form.find("name", "EndDate")[0].getValue();
                    pd_store.load({
                        params: { begindate: begindate, enddate: enddate }
                    });
                }
            }]
        }]

    }, {
        html: "<font color='red' size='2'>*注意：由于此报表计算系统压力较大，请选择尽量短的时间范围!</font>"
    }]
});


var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    },
    {
        header: '最终转卡日期',
        dataIndex: 'BillDate',
        width: 130
    }, {
        header: '最终转卡店铺',
        dataIndex: 'DeptID',
        width: 130
    }, {
        header: '最终卡号',
        dataIndex: 'TargetCardNo',
        width: 130
    }, {
        header: '最终余额',
        dataIndex: 'TargetCardBalance',
        width: 100
    }, {
        header: '转卡次数',
        dataIndex: 'DebitCardNumber',
        width: 100
    }, {
        header: '转卡金额',
        dataIndex: 'TransferMoney',
        width: 100
    }]
});
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/ExchangeCard.aspx?actionName=getTransferCard&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        totalProperty: "results",
        fields: [
                { name: "ID", mapping: "ID" },
                { name: 'BillDate', mapping: "BillDate" },
                { name: "DeptID", mapping: "DeptTitle" },
                { name: "TargetCardNo", mapping: "TargetCardNo" },
                { name: "TargetCardBalance", mapping: "TargetCardBalance" },
                { name: "DebitCardNumber", mapping: "CardCount" },
                { name: "TransferMoney", mapping: "TransferMoney" }
            ]
    })
})
var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    loadMask: true
});
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    id = r.get("ID");
    cardNo = r.get("TargetCardNo");
    base_info_form.find("name", "DebitCardNo")[0].setValue(r.get("TargetCardNo"));
    base_info_form.find("name", "DebitCardBalance")[0].setValue(r.get("TargetCardBalance"));
    base_info_form.find("name", "DebitCardDept")[0].setValue(r.get("DeptID"));
    store.load({
        params: { ID: id }
    })
    base_info_form.load({
        url: "../Apis/ExchangeCard.aspx?actionName=getBaseForm&sid=" + Sys.sid,
        params: { CardNo: cardNo },
        waitMsg: "加载中....."
    })
    accountCardInfoWindow.show();
});
var base_info_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    reader: new Ext.data.JsonReader({
        //root: "data",
        fields: [
        { name: "CustomerName", mapping: "CustomerTitle" },
        { name: "SellCardDept", mapping: "Title" },
        { name: "DeptTel", mapping: "Tel" },
        { name: "CardType", mapping: "TargetCardType" },
        { name: "CustomerRemark", mapping: "CustomerMemoInfo" },
        { name: "CardRemark", mapping: "MemoInfo" }
        ]

    }),
    items: [{
        xtype: "fieldset",
        title: "转卡基础信息",
        defaults: { labelAlign: "right", width: 60 },
        layout: "column",
        items: [{
            columnWidth: .33,
            layout: 'form',
            items: [{
                xtype: 'hidden',
                fieldLabel: 'ID',
                name: 'ID',
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: '最终卡号',
                name: 'DebitCardNo',
                readOnly: true,
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: '客户姓名',
                name: 'CustomerName',
                readOnly: true,
                allowBlank: false,
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: '售卡店铺',
                name: 'SellCardDept',
                readOnly: true,
                anchor: '100%'
            }
                ]

        }, {
            columnWidth: .33,
            layout: 'form',
            items: [{
                id: 'org1',
                layout: "column"
            }, {
                xtype: 'textfield',
                fieldLabel: '卡类型',
                name: 'CardType',
                readOnly: true,
                anchor: '100%'
            },{
                    xtype: 'textfield',
                    fieldLabel: '店铺电话',
                    name: 'DeptTel',
                    readOnly: true,
                    anchor: '100%'
                }
                , {
                    xtype: 'textfield',
                    fieldLabel: '转卡店铺',
                    name: 'DebitCardDept',
                    readOnly: true,
                    anchor: '100%'
                }]
        }, {
            columnWidth: 0.34,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '卡余额',
                name: 'DebitCardBalance',
                readOnly: true,
                anchor: '100%'
            },
                {
                    xtype: 'textfield',
                    fieldLabel: '客户备注',
                    name: 'CustomerRemark',
                    readOnly: true,
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    fieldLabel: '客服电话',
                    name: 'CustomServiceTel',
                    readOnly: true,
                    hidden: true,
                    anchor: '100%'
                }]
        }, {
            columnWidth: 1,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '卡备注',
                name: 'CardRemark',
                readOnly: true,
                anchor: '100%'
            }]
        }]
    }]
});
var cardgridcm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [new Ext.grid.RowNumberer(), {
        header: '转卡日期',
        dataIndex: 'PointCountCardTime',
        width: 120,
        renderer: function (v) {
            return ConvertJSONDateToJSDateObject(v).format("Y-m-d H:i:s");
        }
    }, {
        header: '店铺',
        dataIndex: 'PointCountDept',
        width: 100
    }, {
        header: '转卡金额',
        dataIndex: 'PointCountCardMoney',
        width: 100
    }, {
        header: '转出卡号',
        dataIndex: 'PointCountCardToNo',
        width: 100
    }, {
        header: '转出卡类型',
        dataIndex: 'PointCountCardToType',
        width: 100
    }, {
        header: '转入卡号',
        dataIndex: 'PointCountCardInNo',
        width: 100
    }, {
        header: '转入卡类型',
        dataIndex: 'PointCountCardInType',
        width: 100
    }]
});
var store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/ExchangeCard.aspx?actionName=getTransferCardDetails&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        totalProperty: "results",
        fields: [
                { name: 'PointCountCardTime', mapping: "BillDate" },
                { name: "PointCountDept", mapping: "Title" },
                { name: "PointCountCardMoney", mapping: "TranMoney" },
                { name: "PointCountCardToNo", mapping: "SrcCardNo" },
                { name: "PointCountCardToType", mapping: "SrcCardType" },
                { name: "PointCountCardInNo", mapping: "TargetCardNo" },
                { name: "PointCountCardInType", mapping: "TargetCardType" }
            ]
    })

})
var cardgrid = new Ext.grid.GridPanel({
    store: store,
    cm: cardgridcm,
    frame: true,
    height: 220,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    loadMask: true
});
var accountcard_balance_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    items: [{
        xtype: "fieldset",
        collapsible: true,
        title: "转卡信息",
        items: [cardgrid]
    }]
});
var accountCardInfoWindow = new Ext.Window({
    layout: 'fit',
    width: 900,
    height: 480,
    modal: true,
    //autoScroll: true,
    closeAction: 'hide',
    title: "转卡信息",
    items: [{
        autoScroll: true,
        items: [base_info_form, accountcard_balance_form]
    }]
});
//主容器
var pd_main_panel = new Ext.Panel({
    //autoScroll: true,
    border: false,
    layout: "anchor",
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -100',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();