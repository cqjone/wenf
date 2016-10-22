//积分兑换管理

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
                fieldLabel: "积分兑换规则名称",
                name: "PointExchangeName",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "有效日期[开始]",
                emptyText: new Date().toLocaleDateString(),
                name: "PeriodStart",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 220,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    seacrhData();
                }
            }, {
                xtype: "button",
                boxMinWidth: 60,
                width: 80,
                margins: "0 0 0 5",
                bodyStyle: "margin:0 5px",
                text: "添加积分兑换规则",
                handler: function () {
                    AddExchangeWindow.show();
                }
            }]
        }, {
            layout: "column",
            columnWidth: 1,
            items: [{
                layout: "form",
                columnWidth: 0.4,
                items:[{
                    xtype: "datefield",
                    fieldLabel: "有效日期[结束]",
                    emptyText: new Date().toLocaleDateString(),
                    name: "PeriodEnd",
                    anchor: "100%"
                }]
            },
            {
                layout: "form",
                columnWidth: 0.4,
                items:[{
                    xtype: 'combo',
                    fieldLabel: '有效店铺',
                    name: 'EffectShop',
                    editable: false,
                    forceSelection: true,
                    mode: 'local',
                    emptyText: 'Select a shop...',
                    store: shopStore,
                    displayField: "ShopName",
                    triggerAction: "all",
                    anchor: '95%'
                }]                            
        }]
    }]

}]
});

var shopData = [
    [1, '全部'],
    [2, '店铺A'],
    [3, '店铺B'],
    [4, '店铺C']
];

//规则store
var shopStore = new Ext.data.ArrayStore({
    fields: [
            { name: 'ID' },
           { name: 'ShopName' }
        ],
    data: shopData
});

function AddAction() {
    alert('addaction');
}

function seacrhData() {
    store.loadData(myData);
}

//增加积分兑换规则
var AddExchangeForm = new Ext.form.FormPanel({
    //xtype: "form",
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 600,
    height: 180,
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
                        fieldLabel: '礼品名称',
                        name: 'GiftName',
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        fieldLabel: "积分数量",
                        name: "PointNum",
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '最多可兑换数量',
                        name: "MaxExchangeNum",
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '兑换规则模式',
                        name: 'ExchangeModel',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        emptyText: 'Select a model...',
                        store: ruleStore,
                        displayField: "PointRule",
                        triggerAction: "all",
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'combo',
                        fieldLabel: '是否需要预约',
                        name: 'IsNeedBook',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "whether",
                        triggerAction: "all",
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '是否可门店兑换',
                        name: 'IsShopExchange',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "whether",
                        triggerAction: "all",
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '是否无限数兑换',
                        name: 'IsUnlimitedExchange',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "whether",
                        triggerAction: "all",
                        anchor: '95%'
                    }, {
                        xtype: "button",
                        //decimalPrecision:0,
                        text: '添加规则模式',
                        anchor: '30%',
                        align: 'right',
                        handler: function () {
                            AddRuleModel();
                        }
                    }]
                }]
    }
    , {
        buttons: [{
            text: '保  存',
            handler: function () {
                AddAction();
            }
        }, {
            text: '取  消',
            handler: function () {
                AddExchangeForm.getForm().reset();
                AddExchangeWindow.hide();
            }
        }]
    }
    ]
});

var ifData = [
    ['是'],
    ['否']
];

//规则store
var ifStore = new Ext.data.ArrayStore({
    fields: [
           { name: 'whether' }
        ],
    data: ifData
});

//添加规则方法
function AddRuleModel() {
    actionstore.loadData(actionData);
}

var ruleData = [
    [1, '兑换规则一'],
    [2, '兑换规则二'],
    [3, '兑换规则三'],
    [4, '兑换规则四'],
    [5, '兑换规则五']
];

//规则store
var ruleStore = new Ext.data.ArrayStore({
    fields: [
            { name: 'ID' },
           { name: 'PointRule' }
        ],
    data: ruleData
});

var actionData = [
    [1, '兑换规则模式一', '限定条件', '摘要'],
    [2, '兑换规则模式二', '限定条件', '摘要'],
    [3, '兑换规则模式三', '限定条件', '摘要'],
    [4, '兑换规则模式四', '限定条件', '摘要'],
    [5, '兑换规则模式五', '限定条件', '摘要']
];

//积分规则store
var actionstore = new Ext.data.ArrayStore({
    fields: [
            { name: 'ID' },
           { name: 'RuleModel' },
            { name: 'Limitation' },
            { name: 'Summary' }
        ],
    data: ruleData
});

var actioncm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [{
        //id: "Title",
        header: '规则模式',
        dataIndex: 'RuleModel',
        width: 100
    }, {
        //id: "Title",
        header: '限定/例外',
        dataIndex: 'Limitation',
        width: 100,
        align: 'right'
    }, {
        //id: "ExchangeNum",
        header: "摘要",
        dataIndex: "Summary",
        align: 'right',
        width: 120
    }]
});

var action_grid = new Ext.grid.GridPanel({
    store: actionstore,
    cm: actioncm,
    frame: true,
    //margins: "2 2 2 2",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

//添加规则容器
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
        items: [AddExchangeForm]
    }, {
        layout: "fit",
        frame: true,
        border: false,
        anchor: '-1 -100',
        items: [action_grid]
    }]
});

//新增活动窗口
var AddExchangeWindow = new Ext.Window({
    layout: 'fit',
    width: 630,
    height: 400,
    modal: true,
    closeAction: 'hide',
    title: "积分兑换规则定义",
    plain: true,
    items: [action_main_panel]
});

var fm = Ext.form;

var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [{
        //id: "Title",
        header: '积分兑换规则名称',
        dataIndex: 'PointExchangeName',
        width: 140
    }, {
        //id: "Title",
        header: '有效日期[开始]',
        dataIndex: 'PeriodStart',
        width: 160,
        align: 'right'
    }, {
        //id: "ExchangeNum",
        header: "有效日期[结束]",
        dataIndex: "PeriodEnd",
        align: 'right',
        width: 120
    }, {
        //id: "NeedPoint",
        header: "有效店铺",
        dataIndex: "ActionShop",
        width: 120
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed

    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    //url: '../Apis/BaseData.aspx?actionName=GetiBaitStationType',

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
                { name: 'Code', mapping: 'Code' },
        // map Record's 'job' field to data object's 'occupation' key
                {name: 'Title', mapping: 'Title' },
                { name: "MemoInfo", mapping: "MemoInfo" }
            ]
    }),

    sortInfo: { field: 'Code', direction: 'ASC' }
});
//

// sample static data for the store
var myData = [
        ['积分兑换规则一', "2011-02-01", "2013-12-31", 'A店，B店'],
        ['积分兑换规则二', "2011-03-01", "2013-12-31", 'C店，D店'],
        ['积分兑换规则三', "2011-10-01", "2013-12-31", 'E店，F店']
    ];

// create the data store
var store = new Ext.data.ArrayStore({
    fields: [
           { name: 'PointExchangeName' },
           { name: 'PeriodStart' },
           { name: 'PeriodEnd' },
           { name: 'ActionShop' }
        ]
});

var pd_grid = new Ext.grid.GridPanel({
    store: store,
    cm: cm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

//===========================双击获取该单据 开始======================================//
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    AddExchangeWindow.show();
    // AddActionForm.find("name", "ID")[0].setValue(r.get("ID"));
});

//===========================双击获取该单据 开始======================================//

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
        anchor: '-1 -100',
        items: [pd_grid]
    }]
});



centerPanel.add(pd_main_panel);
centerPanel.doLayout();
