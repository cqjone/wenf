//积分活动管理
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
                fieldLabel: "积分活动名称",
                name: "PointActionName",
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
            width: 160,
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
                boxMinWidth: 40,
                width: 70,
                margins: "0 0 0 5",
                bodyStyle: "margin:0 8px",
                text: "添加活动",
                handler: function () {
                    AddActionWindow.show();
                }
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "有效日期[结束]",
                emptyText: new Date().toLocaleDateString(),
                name: "PeriodEnd",
                anchor: "100%"
            }]
    }]

}]
});


function AddAction() {
    alert('addaction');
}

function seacrhData() {
    store.loadData(myData);
}

var AddActionForm = new Ext.form.FormPanel({
    //xtype: "form",
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 600,
    height: 150,
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
                        fieldLabel: '积分活动名称',
                        name: 'PointActionName',
                        anchor: '95%'
                    }, {
                        xtype: "datefield",
                        fieldLabel: "有效日期[开始]",
                        emptyText: new Date().toLocaleDateString(),
                        name: "PeriodStart",
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '积分规则',
                        name: 'PointRule',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        emptyText: 'Select a rule...',
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
                        //xtype: 'textfield',
                       // fieldLabel: '有效店铺',
                        name: 'ActionShop',
                        //anchor: '100%',
                        layout: "column",
                        items: [{
                            id: 'org2',
                            //anchor: '95%',
                            layout: "form",
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: '有效店铺',
                                allowBlank: false,
                                readOnly: true,
                                width: 125,
                                //anchor: '100%',
                                name: 'ShopName'
                            },
                            {
                                //id:'companyID',
                                xtype: 'hidden',
                                fieldLabel: '店铺ID',
                                name: 'ShopID'
                            }
                            ]
                        }, {
                            //anchor: '100%',
                            xtype: "button",
                            width: 5,
                            text: "选择",
                            handler: function () {
                                setShops();
                            }
                        }]
                    }, {
                        xtype: "datefield",
                        fieldLabel: "有效日期[结束]",
                        emptyText: new Date().toLocaleDateString(),
                        name: "PeriodEnd",
                        anchor: '95%'
                    }, {
                        xtype: "button",
                        //decimalPrecision:0,
                        text: '添加规则',
                        anchor: '30%',
                        align:'right',
                        handler:function(){
                            AddRule();
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
                AddActionForm.getForm().reset();
                AddActionWindow.hide();
            }
        }]
    }
    ]
});

//========================有效门店相关 开始 ========================//

//门店树
var shopTree = new Ext.tree.TreePanel({
    //dataUrl: '../Apis/UserMgr.aspx?actionName=GetPermissions&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    //    root: {
    //        nodeType: 'async'
    //    },
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: "所有店铺",
            leaf: false,
            expanded: true,
            children: [{
                text: "店铺A",
                leaf: true,
                showType: "panel"
            }, {
                text: "店铺B",
                leaf: true,
                showType: "panel"
            }, {
                text: "店铺C",
                leaf: true,
                showType: "panel"
            }]
        }]
    }),
    rootVisible: false,
    listeners: {
        "load": function (node) {
            //alert("aaa");
            getShops();
        }
    }
});
//ptree.expandAll();

//门店窗口
var shopsWindow = new Ext.Window({
    title: '选择有效门店',
    closeAction: 'hide',
    width: 350,
    height: 400,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [shopTree],
    buttons: [{
        text: '选择',
        handler: function () {
        /*
            shops.body.mask("正在提交，请稍候。");
            var msg = '', selNodes = shopTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ', ';
                }
                msg += node.id;
                //n.getUI().toggleCheck(true);
            });
            
            var model = grid.getSelectionModel().getSelected();
            Ext.Ajax.request({
                url: "../Apis/UserMgr.aspx?actionName=SetUserPermissions&sid=" + Sys.sid,
                params: "id=" + model.get("id") + "&itemid=" + msg,
                method: "POST",
                success: function (response) {
                    if (Ext.util.JSON.decode(response.responseText).success) {
                        Ext.Msg.alert("信息", "数据更新成功！");
                    } else {
                        Ext.Msg.alert("信息", "数据更新失败！");
                    }
                    permission.body.unmask();
                },
                failure: function (response) {
                    Ext.Msg.alert("警告", "数据更新失败，请稍后再试！");
                    permission.body.unmask();
                }
            })
             */
        }
    }, {
        text: '取消',
        handler: function () {
            shopsWindow.hide();
        }
    }]
})

//设置有效店铺
function setShops() {
    //getUserPermission();
    shopsWindow.show();
    shopTree.getRootNode().reload();
    //getUserPermission();
}

//取得有效店名
function getShops() {
    //var model = grid.getSelectionModel().getSelected();
    //shopsWindow.body.mask("Loading...");
    /*
    Ext.Ajax.request({
        url: "../Apis/UserMgr.aspx?actionName=GetUserPermissions&sid=" + Sys.sid,
        params: "id=" + model.get("id"),
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);
            var node;
            //ptree.getRootNode().reload();
            if (data != "") {
                for (var i = 0; i < data.length; i++) {
                    node = shopTree.getNodeById(data[i].id);
                    //alert(node);
                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            shopsWindow.body.unmask();
        }
    })
    */
}


//========================有效门店相关 结束 ========================//


//添加规则方法
function AddRule() {
    actionstore.loadData(actionData);
}

var ruleData = [
    [1, '规则一'],
    [2, '规则二'],
    [3, '规则三'],
    [4, '规则四'],
    [5, '规则五']
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
    [1, '规则模式一', '限定条件', '摘要'],
    [2, '规则模式二', '限定条件', '摘要'],
    [3, '规则模式三', '限定条件', '摘要'],
    [4, '规则模式四', '限定条件', '摘要'],
    [5, '规则模式五', '限定条件', '摘要']
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
        items: [AddActionForm]
    }, {
        layout: "fit",
        frame: true,
        border: false,
        anchor: '1 1',
        items: [action_grid]
    }]
});

//新增活动窗口
var AddActionWindow = new Ext.Window({
    layout: 'fit',
    width: 630,
    height: 350,
    modal: true,
    closeAction: 'hide',
    title: "积分活动定义",
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
        header: '积分活动名称',
        dataIndex: 'PointActionName',
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
        ['积分活动一', "2011-02-01", "2013-12-31", 'A店，B店'],
        ['积分活动二', "2011-03-01", "2013-12-31", 'C店，D店'],
        ['积分活动三', "2011-10-01", "2013-12-31", 'E店，F店']
    ];

// create the data store
var store = new Ext.data.ArrayStore({
    fields: [
           { name: 'PointActionName' },
           { name: 'PeriodStart' },
           { name: 'PeriodEnd'},
           { name: 'ActionShop'}
        ]
});

var pd_grid = new Ext.grid.GridPanel({
    store: store,
    cm: cm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

//===========================双击获取该单据 开始======================================//
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    AddActionWindow.show();
   // AddActionForm.find("name", "ID")[0].setValue(r.get("ID"));
});

//===========================双击获取该单据 开始======================================//

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
