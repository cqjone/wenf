//转卡审批列表

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,

    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        //title: "转卡审批",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 1000 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "column",
            items: [
            {
                xtype: "checkbox",
                checked: true,
                //fieldLabel: "自动刷新(1分钟)",
                name: "AutoRefresh",
                width: 20
            }, {
                xtype: "label",
                text: "自动刷新(1分钟)",
                width: 150
            }, {
                xtype: "radio",
                boxLabel: '待审批',
                checked: true,
                id: 'WaitAudit',
                name: 'Audit',
                width: 80
            }, {
                xtype: "radio",
                boxLabel: '全部',
                checked: true,
                id: 'AllAudit',
                name: 'Audit'
            }, {
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    seacrhReservation();
                }
            }]
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
    columns: [{
        header: '单据时间',
        dataIndex: 'ReceiptTime',
        width: 120
    },{
        header: '店铺',
        dataIndex: 'Dept',
        width: 100 
    }, {
        header: '金额',
        dataIndex: 'Money',
        width: 60
    }, {
        header: "转出卡号",
        dataIndex: "OutCard",
        width: 120
    }, {
        header: "转出卡类型",
        dataIndex: "OutCardType",
        width: 120
    }, {
        header: "转入卡号",
        dataIndex: "InCard",
        width: 120
    }, {
        header: "转入卡类型",
        dataIndex: "InCardType",
        width: 120
    }, {
        header: "审批状态",
        dataIndex: "AuditState",
        width: 120
    }]
});

var transferCard_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    //url: "../Apis/PointRules.aspx?actionName=getRulesByIdNo&sid=" + Sys.sid,
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

var myData = [
        ['2011-05-10', "dept1", "10000", "c001", "xx卡", 'c003', "xx卡", "未审批"],
        ['2011-05-10', "dept2", "20000", "c002", "xx卡", 'c004', "xx卡", "审批"]
        
    ];

// create the data store
var store = new Ext.data.ArrayStore({
    fields: [
           { name: 'ReceiptTime' },
           { name: 'Dept' },
           { name: 'Money' },
           { name: 'OutCard' },
           { name: 'OutCardType' },
           { name: 'InCard' },
           { name: 'InCardType' },
           { name: 'AuditState' }
        ]
});

function seacrhReservation() {
    store.loadData(myData);
}

transferCard_store.on('load', function (store, records) {
    
    if (store.getCount() == 0) {
        Ext.MessageBox.alert("提醒", "无记录！");
    };
});

transferCard_store.on("loadexception", function (mis) {
    
   Ext.MessageBox.alert("提醒", "无记录！");
   transferCard_store.removeAll();
});




var transferCardForm = new Ext.form.FormPanel({
    //labelWidth: 100,
    width: 700,
    height: 180,
    items: [{
        layout: 'form',
        items: [{
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 300,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: "审批通过",
                handler: function () {

                }
            }, {
                html: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"
            }, {
                xtype: "button",
                boxMinWidth: 40,
                width: 50,
                bodyStyle: "margin:0 8px",
                text: " 拒  绝",
                handler: function () {

                }
            }]
        },{
            xtype: "fieldset",
            title:"转出卡信息",
			defaults: { labelAlign: "right", width: 100 },
			//bodyBorder:false,
			layout: "column",
			labelWidth: 60,
			items: [{
				layout: "form",
				columnWidth: 0.33,
				
				items: [{
					xtype: "textfield",
					fieldLabel: "转卡金额",
					name: "idNo",
					emptyText: "1000",
					readOnly: true,
					anchor: "100%"
				}, {
					xtype: "textfield",
					fieldLabel: "转出卡号",
					name: "card",
					readOnly: true,
					emptyText: "c001",
					anchor: "100%"
	            }, {
	                xtype: "textfield",
	                fieldLabel: "售出店铺",
	                name: "card",
	                readOnly: true,
	                emptyText: "东川店",
	                anchor: "100%"
	            }]
	        },
            {
                layout: "form",
                columnWidth: 0.33,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "转卡店铺",
                    name: "idNo",
                    readOnly: true,
                    emptyText: "xx店",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "卡类型",
                    name: "card",
                    readOnly: true,
                    emptyText: "白金卡",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "客户姓名",
                    name: "card",
                    readOnly: true,
                    emptyText: "xxx",
                    anchor: "100%"
                }]
            },
            {
                layout: "form",
                columnWidth: 0.33,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "联系电话",
                    name: "idNo",
                    readOnly: true,
                    emptyText: "(021)895646656",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "卡余额",
                    name: "card",
                    readOnly: true,
                    emptyText: "500",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "客户电话",
                    name: "card",
                    readOnly: true,
                    emptyText: "13813855555",
                    anchor: "100%"
                }]
            },
            {
                layout: "form",
                columnWidth: 0.99,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "卡备注",
                    name: "idNo",
                    readOnly: true,
                    emptyText: "xxxxxxxxxxxxxxxxx",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "客户备注",
                    name: "card",
                    readOnly: true,
                    emptyText: "customer menmoinfo",
                    anchor: "100%"
                }]
            }
            ]
		}
]
}]
});

//定义列
var scm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [{
        header: '日期',
        dataIndex: 'Date',
        width: 100
    }, {
        header: '店铺',
        dataIndex: 'Dept',
        width: 100
    }, {
        header: '业务',
        dataIndex: 'Business',
        width: 100
    }, {
        header: '金额',
        dataIndex: 'Money',
        width: 60
    }, {
        header: "余额",
        dataIndex: "Remain",
        width: 60
    }, {
        header: "卡类型",
        dataIndex: "CardType",
        width: 80
    }, {
        header: "业务",
        dataIndex: "Business",
        width: 100
    }]
});

var myData1 = [
        ['2011-05-10', "店铺A", "业务A", "1000", "500", 'c003', "xx卡", "业务C"],
        ['2011-05-10', "店铺B", "业务B", "2000", "800", 'c004', "xx卡", "业务D"]

    ];

// create the data store
var store1 = new Ext.data.ArrayStore({
    fields: [
           { name: 'Date' },
           { name: 'Dept' },
           { name: 'Business' },
           { name: 'Money' },
           { name: 'Remain' },
           { name: 'CardType' },
           { name: 'Business' }
        ]
});

var store1_grid = new Ext.grid.GridPanel({
    //store: transferCard_store,
    store: store1,
    cm: scm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
    loadMask: true
});

var myData2 = [
        ['2011-05-10', "店铺CC", "业务C", "3000", "200", 'c005', "xx卡", "业务C"],
        ['2011-05-10', "店铺DD", "业务D", "5000", "600", 'c006', "xx卡", "业务D"]

    ];

// create the data store
var store2 = new Ext.data.ArrayStore({
    fields: [
           { name: 'Date' },
           { name: 'Dept' },
           { name: 'Business' },
           { name: 'Money' },
           { name: 'Remain' },
           { name: 'CardType' },
           { name: 'Business' }
        ]
});

var store2_grid = new Ext.grid.GridPanel({
    //store: transferCard_store,
    store: store2,
    cm: scm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
    loadMask: true
});

var transferCardFormB = new Ext.form.FormPanel({
    //labelWidth: 100,
    width: 700,
    height: 130,
    items: [{
        layout: 'form',
        items: [{
            xtype: "fieldset",
            title: "转入卡信息",
            defaults: { labelAlign: "right", width: 100 },
            //bodyBorder:false,
            layout: "column",
            labelWidth: 60,
            items: [{
                layout: "form",
                columnWidth: 0.33,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "转入卡号",
                    name: "idNo",
                    emptyText: "No0018",
                    readOnly: true,
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "售卡店铺",
                    name: "card",
                    readOnly: true,
                    emptyText: "店铺xx",
                    anchor: "100%"
                }]
            },
            {
                layout: "form",
                columnWidth: 0.33,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "卡类型",
                    name: "idNo",
                    readOnly: true,
                    emptyText: "金卡",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "客户姓名",
                    name: "card",
                    readOnly: true,
                    emptyText: "xxx",
                    anchor: "100%"
                }]
            },
            {
                layout: "form",
                columnWidth: 0.33,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "卡余额",
                    name: "idNo",
                    readOnly: true,
                    emptyText: "500",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "客户电话",
                    name: "card",
                    readOnly: true,
                    emptyText: "13813855555",
                    anchor: "100%"
                }]
            },
            {
                layout: "form",
                columnWidth: 0.99,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "卡备注",
                    name: "idNo",
                    readOnly: true,
                    emptyText: "xxxxxxxxxxxxxxxxx",
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "客户备注",
                    name: "card",
                    readOnly: true,
                    emptyText: "customer menmoinfo",
                    anchor: "100%"
                }]
            }
            ]
        }
]
    }]
});



//转卡审批信息容器
var transferCard_panel = new Ext.Panel({
    autoScroll: true,
    border: false,
    //autoWidth:true,
    layout: "form",
    //anchorSize: { width: 800, height: 600 },
    items: [{
        frame: true,
        layout: "fit",
        border: false,
        items: [transferCardForm]
    }, {
            layout: "fit",
            frame: true,
            border: false,
            anchor: '-1 -400',
            items: [store1_grid]
        }, {
            frame: true,
            layout: "fit",
            border: false,
            anchor: '-1 -370',
            items: [transferCardFormB]
        }, {
            layout: "fit",
            frame: true,
            border: false,
            anchor: '-1 -400',
            items: [store2_grid]
        }
    ]
});

var TransferCardWindow = new Ext.Window({
    layout: 'fit',
    width: 700,
    height: 550,
    modal: true,
    closeAction: 'hide',
    title: "转卡审批信息",
    plain: true,
    items: [transferCard_panel]
});


var pd_grid = new Ext.grid.GridPanel({
    //store: transferCard_store,
    store:store,
    cm: cm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
    loadMask: true
});

//===========================双击获取该单据 开始======================================//
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    TransferCardWindow.show();
    store1.loadData(myData1);
    store2.loadData(myData2);
});

//===========================双击获取该单据 结束======================================//

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
        items: [pd_top_form]
    }, {
        layout:"fit",
        border: false,
        anchor: '-1 -145',
        items: [pd_grid]
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();
