//区域经理管理

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "right", width: 80 },
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "员工编号",
                name: "Code",
                anchor: "90%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: 'textfield',
                fieldLabel: "员工姓名",
                name: 'Name',
                anchor: "90%"

            }]
        }, {
            layout: "column",
            columnWidth: 0.75,
            labelWidth: 70,
            bodyStyle: "margin:0 30px",
            items: [{
                columnWidth: 0.47,
                layout: "form",
                items: [{
                    xtype: 'combo',
                    fieldLabel: '选择区域',
                    name: 'ParentTitle',
                    allowBlank: false,
                    readOnly: true,
                    anchor: '95%'
                }, {
                    xtype: 'hidden',
                    name: 'AreaID'
                }]
            }, {
                columnWidth: 0.1,
                xtype: "button",
                text: "选择",

                handler: function () {
                    Qptree.expandAll();
                    SelectQWindow.show();

                }
            }, {
                xtype: "button",
                style: "margin-left:50px",
                columnWidth: 0.15,
                text: "查  询",
                handler: function () {
                    var code = pd_top_form.find("name", "Code")[0].getValue();
                    var name = pd_top_form.find("name", "Name")[0].getValue();
                    var parentTitle = pd_top_form.find("name", "ParentTitle")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { code: code, parentTitle: parentTitle, name: name }
                    });
                }
            }, {
                xtype: "button",
                columnWidth: 0.1,
                style: "margin-left:10px",
                text: "添  加",
                handler: function () {
                    id = 0;
                    AddForm.find("name", "ParentTitle")[0].setValue("");
                    AddForm.find("name", "ID")[0].setValue("");
                    AddForm.find("name", "InOrUp")[0].setValue("");
                    sManager.removeAll();
                    sMarketing.removeAll();
                    AddWindow.show();
                }
            }, {
                xtype: "button",
                columnWidth: 0.1,
                text: "删  除",
                style: "margin-left:10px",
                handler: function () {
                    delItem();
                }
            }]
        }]

    }]
});

function delItem() {
    var did = getId(pd_grid);
    if (did) {
        Ext.Msg.confirm('确认', '真的要删除此信息吗？', function (btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                    url: "../Apis/AreaBossMgr.aspx?actionName=delBoss&sid=" + Sys.sid,
                    params: { did: did },
                    success: function (result) {
                        var selections = pd_grid.selModel.getSelections();
                        Ext.each(selections, function (item) {
                            pd_store.remove(item);
                            pd_store.removed.push(item);
                        });
                        var json_str = Ext.util.JSON.decode(result.responseText);
                        Ext.Msg.alert('信息', json_str.msg);
                    },
                    failure: function () {
                        Ext.Msg.alert('信息', '删除失败，稍后再试!');
                    }
                });
            }
        });
    } else {
        Ext.Msg.alert('提示', '你还没有选择要操作的记录！');
    }
}
function getId(pd_grid) {
    var s = pd_grid.getSelectionModel().getSelected();
    if (s) {
        return s.get("ID");
    }
    return 0;
}

var sMarketing = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AreaBossMgr.aspx?actionName=getMarketingInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }

            ]
    })
});

var sManager = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AreaBossMgr.aspx?actionName=getManagerInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }

            ]
    })
});
var gpMarketing = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 180,
    autoWidth: true,
    store: sMarketing,
    loadMask: true,
    stripeRows:true,
    tbar: [
    {
        text: '选择人员',
        iconCls: 'silk-add',
        handler: function () {
            sMkSelect.removeAll();
            SelformMk.find("name", "Code")[0].setValue("");
            SelformMk.find("name", "Title")[0].setValue("");
            ptreeXiao.getLoader().load(ptreeXiao.getRootNode());
            SelectXiaoWindow.show();
        }
    }],
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }),
    cm: new Ext.grid.ColumnModel({
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns:
        [new Ext.grid.RowNumberer(),
    {
        header: 'id',
        dataIndex: 'ID',
        ID: "ID",
        hidden: true,
        width: 100
    },
     {
         header: '员工编号',
         dataIndex: 'Code'
     },
    {
        header: '员工名称',
        dataIndex: 'Title'
    }, {
        header: '操作',
        renderer: showbuttonDeleMk
    }]
    })

});
var gpManager = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 180,
    autoWidth: true,
    store: sManager,
    loadMask: true,
    stripeRows:true,
    tbar: [
    {
        text: '选择人员',
        iconCls: 'silk-add',
        handler: function () {
            sManagerSelect.removeAll();
            Selform.find("name", "Code")[0].setValue("");
            Selform.find("name", "Title")[0].setValue("");
            ptree.getLoader().load(ptree.getRootNode());
            SelectWindow.show();
        }
    }],
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }),
    cm: new Ext.grid.ColumnModel({
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns:
        [new Ext.grid.RowNumberer(),
    {
        header: 'id',
        dataIndex: 'ID',
        ID: "ID",
        hidden: true,
        width: 100
    },
     {
         header: '员工编号',
         dataIndex: 'Code'
     },
    {
        header: '员工名称',
        dataIndex: 'Title'
    }, {
        header: '操作',
        renderer: showbuttonDele
    }]
    })

});

function showbuttonDele(value, metadata, record, rowIndex, columnIndex, store) {
    window.DelInfo = function (rowIndex) {
        var selections = gpManager.selModel.getSelections();
        var s = gpManager.getSelectionModel().getSelected().get("ID");
        Ext.Msg.confirm('提示', '确定删除？', function (btn) {
            if (btn == 'yes') {
                Ext.each(selections, function (item) {
                    sManager.remove(item);
                    sManager.removed.push(item);
                    var delID = s;
                    var AreaID = AddForm.find("name", "AreaID")[0].getValue();
                    Ext.Ajax.request({
                        params: { delID: delID,AreaID:AreaID, dutyid: '238' },
                        url: '../Apis/AreaBossMgr.aspx?actionName=delStore&sid=' + Sys.sid
                    });
                    pd_store.reload();

                });
            }
        });
    };
    var resultStr = "<a href='#' onclick='DelInfo(" + rowIndex + ")'>删除</a> ";
    return resultStr;
}

function showbuttonDeleMk(value, metadata, record, rowIndex, columnIndex, store) {
    window.DelInfoMk = function (rowIndex) {
        var selections = gpMarketing.selModel.getSelections();
        var s = gpMarketing.getSelectionModel().getSelected().get("ID");
        var ATitle = AddForm.find("name", "ParentTitle")[0].getValue();
        Ext.Msg.confirm('提示', '确定删除？', function (btn) {
            if (btn == 'yes') {
                Ext.each(selections, function (item) {
                    sMarketing.remove(item);
                    sMarketing.removed.push(item);
                    var delID = s;
                    var AreaID = AddForm.find("name", "AreaID")[0].getValue();
                    Ext.Ajax.request({
                        params: { delID: delID,AreaID:AreaID, dutyid: '239' },
                        url: '../Apis/AreaBossMgr.aspx?actionName=delStore&sid=' + Sys.sid
                    });
                    pd_store.reload();
                });
            }
        });
    };
    var resultStr = "<a href='#' onclick='DelInfoMk(" + rowIndex + ")'>删除</a> ";
    return resultStr;
}
//添加Form窗口
var AddForm = new Ext.form.FormPanel({
    frame: true,
    labelWidth: 110,
    layout: "column",
    labelAlign: 'right',
  //  bodyStyle: "margin:0 -40px",
    items: [
    {
        columnWidth: 0.965,
        layout: 'column',
        items: [{
            columnWidth: 0.7,
            layout: "form",
            items: [{
                xtype: 'textfield',
                fieldLabel: '选择区域',
                allowBlank: false,
                name: 'ParentTitle',
                readOnly: true,
                anchor: '94%'
            }, {
                xtype: 'hidden',
                name: 'AreaID'
            }, {
                xtype: 'hidden',
                name: 'ID'
            }, {
                xtype: 'hidden',
                name: 'DutyID',
                emptyText: "1"
            }, {
                xtype: 'hidden',
                name: 'EmpID'
            }, {
                xtype: 'hidden',
                name: 'XiaoDutyID'
            }, {
                xtype: 'hidden',
                name: 'InOrUp'
            }]
        }, {
            columnWidth: 0.2,
            xtype: "button",
            text: "选择",
            handler: function () {
                ptreeArea.expandAll();
                SelectAreaWindow.show();
                checkNow();
            }
        }]
    }
    ,
    {
        columnWidth: 1,
        layout: 'column',
        items: [
            {
                columnWidth: 1,
              //  bodyStyle: "margin:0 30px",
                items: [
                    {
                        xtype: "fieldset",
                        collapsible: true,
                        title: "区域经理",
                        items: [
                         gpManager
                      ]
                    }
                ]
            }
        ]
    }, {
        columnWidth: 1,
        layout: 'column',
        items: [
            {
                columnWidth: 1,
               // bodyStyle: "margin:0 30px",
                items: [
                    {
                        xtype: "fieldset",
                        collapsible: true,
                        title: "营销经理",
                        items: [
                         gpMarketing
                      ]
                    }
                ]
            }
        ]
    }

],
    buttons: [
    {
        text: '保  存',
        handler: function () {

            InsertOrUpdate();

        }
    }, {
        text: '取  消',
        handler: function () {
            AddForm.getForm().reset();
            AddWindow.hide();
        }
    }]
});


//======卡类型选择=====
var ptree = new Ext.tree.TreePanel({
    xtype: 'treepanel',
    autoScroll: true,
    height: 300,
    useArrows: true,
    animate: true,
    rootVisible: false,
    enableDD: true,
    root: new Ext.tree.AsyncTreeNode(),
    loader: new Ext.tree.TreeLoader({
        //         dataUrl: '../Apis/AreaBossMgr.aspx?actionName=getDepMenu&sid=' + Sys.sid, baseParams: { id:"0"}
    })

});

var ptreeArea = new Ext.tree.TreePanel({
    width: 150,
    minSize: 275,
    maxSize: 400,
    xtype: 'treepanel',
    autoScroll: true,
    margins: '5 0 0 5',
    rootVisible: false,
    loader: new Ext.tree.TreeLoader({
        dataUrl: '../Apis/AreaMgr.aspx?actionName=getAreaMenu&sid=' + Sys.sid
    }),
    root: new Ext.tree.AsyncTreeNode(),
    listeners: {
        'dblclick': function (node, e) {

            SelectAreaWindow.hide();
            AddForm.find("name", "ParentTitle")[0].setValue(node.text);
            AddForm.find("name", "AreaID")[0].setValue(node.id);

        }
    }
});

var ptreeXiao = new Ext.tree.TreePanel({
    height: 300,
    xtype: 'treepanel',
    autoScroll: true,
    margins: '5 0 0 5',
    rootVisible: false,
    loader: new Ext.tree.TreeLoader({
        //  dataUrl: '../Apis/AreaBossMgr.aspx?actionName=getDepMenu&sid=' + Sys.sid, baseParams: { id: "0" }
    }),
    root: new Ext.tree.AsyncTreeNode()
});
var Qptree = new Ext.tree.TreePanel({
    width: 150,
    minSize: 275,
    maxSize: 400,
    xtype: 'treepanel',
    autoScroll: true,
    margins: '5 0 0 5',
    loader: new Ext.tree.TreeLoader({
        dataUrl: '../Apis/AreaMgr.aspx?actionName=getAreaMenu&sid=' + Sys.sid
    }),
    root: {
        nodeType: 'async',
        text: '全部',
        draggable: false,
        id: '0'
    },
    listeners: {  
        'dblclick': function (node, e) {
            SelectQWindow.hide();
            pd_top_form.find("name", "ParentTitle")[0].setValue(node.text);
            pd_top_form.find("name", "AreaID")[0].setValue(node.id);

        }
    }
});
var Selform = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelAlign: 'right',
    labelWidth: 45,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "left" },
        layout: "column",
        items: [{
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "编 号",
                name: "Code",
                width: 300,
                anchor: "100%"
            }]
        }, {
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "姓名",
                name: "Title",
                width: 300,
                anchor: "96%"
            }]

        },{
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                text: "查询",
                anchor: "100%",
                handler: function () {
                var code = Selform.find("name", "Code")[0].getValue();

                var title = Selform.find("name", "Title")[0].getValue();
                sManagerSelect.load({
                    params: { code: code, title: title }
                });
            }
            }]
        }]

    }]
});

var SelformMk = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelAlign: 'right',
    labelWidth: 45,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "left" },
        layout: "column",
        items: [{
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "编 号",
                name: "Code",
                width: 300,
                anchor: "100%"
            }]
        }, {
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "姓名",
                name: "Title",
                width: 300,
                anchor: "96%"
            }]

        },{
                     layout: "form",
            bodyBorder: false,
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                text: "查询",
                anchor: "100%",
                handler: function () {
                    var code = SelformMk.find("name", "Code")[0].getValue();

                    var title = SelformMk.find("name", "Title")[0].getValue();
                    sMkSelect.load({
                        params: { code: code, title: title }
                    });
            }
            }]
        }]

    }]
});

var sManagerSelect = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AreaBossMgr.aspx?actionName=getManagerGp&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" },
                { name: "Duty", mapping: "Duty" },
                { name: "Dept", mapping: "Dept" },
                { name: "Mobile", mapping: "Mobile" }

            ]
    })
});
var sm = new Ext.grid.CheckboxSelectionModel();
var gpManagerSelect = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 280,
    autoWidth: true,
    store: sManagerSelect,
    loadMask: true,
    sm: sm,
    stripeRows:true,
    cm: new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns:
        [
        sm, {
            header: 'ID',
            dataIndex: 'ID',
            hidden: true
        },

     {
         header: '员工编号',
         dataIndex: 'Code',

     }
     ,
     {
         header: '所在部门',
         dataIndex: 'Dept',
         width: 90

     },
    {
        header: '员工姓名',
        dataIndex: 'Title'

    },
    {
        header: '员工职务',
        dataIndex: 'Duty'

    },
    {
        header: '联系方式',
        dataIndex: 'Mobile'

    }
    ]
    })

});
var smk = new Ext.grid.CheckboxSelectionModel();
var sMkSelect = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AreaBossMgr.aspx?actionName=getMkGp&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" },
                { name: "Duty", mapping: "Duty" },
                { name: "Dept", mapping: "Dept" },
                { name: "Mobile", mapping: "Mobile" }

            ]
    })
});
var gpMkSelect = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 280,
    autoWidth: true,
    store: sMkSelect,
    loadMask: true,
    stripeRows:true,
    sm: smk,
    cm: new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns:
        [new Ext.grid.RowNumberer(),
        smk, {
            header: 'ID',
            dataIndex: 'ID',
            hidden: true
        },

     {
         header: '员工编号',
         dataIndex: 'Code',
         width: 90

     }
     ,
     {
         header: '所在部门',
         dataIndex: 'Dept'

     },
    {
        header: '员工姓名',
        dataIndex: 'Title'

    },
    {
        header: '员工职务',
        dataIndex: 'Duty'

    },
    {
        header: '联系方式',
        dataIndex: 'Mobile'

    }
    ]
    })

});

ptree.on("afterrender", function (t) {
    //只执行一次
    checkNow();
});
ptreeXiao.on("afterrender", function (t) {
    //只执行一次
    checkXiaoNow();
});

//把现有的勾选上
function checkNow() {
    var ids = "";
    var titles = "";
    var aids = ids.split(",");
    ptree.root.eachChild(function (child) {
        //alert(child.id); return;
        for (var i = 0; i < aids.length; i++) {
            if (child.id == aids[i]) {
                child.ui.toggleCheck(true);
                child.attributes.checked = true;
            }
        }
    });
}

ptree.on('checkchange', function (node, checked) {
    var ids = "";
    var titles = "";

    //判断是不是全选
    if (node.id == 0) {
        if (node.hasChildNodes()) {
            node.eachChild(function (child) {
                if (child.id > 0) {
                    ids += child.id + ",";
                    titles += child.text + ",";
                    child.ui.toggleCheck(checked);
                    child.attributes.checked = checked;
                }
            })
        }

        return;
    } else {

        var checkeds = ptree.getChecked();

        for (var i = 0; i < checkeds.length; i++) {
            if (checkeds[i].id > 0) {
                ids += checkeds[i].id + ",";
                titles += checkeds[i].text + ",";
            }
        }
    }
});

//把现有的勾选上
function checkXiaoNow() {
    var ids = "";
    var aids = ids.split(",");
    ptreeXiao.root.eachChild(function (child) {
        //alert(child.id); return;
        for (var i = 0; i < aids.length; i++) {
            if (child.id == aids[i]) {
                child.ui.toggleCheck(true);
                child.attributes.checked = true;
            }
        }
    });
}

ptreeXiao.on('checkchange', function (node, checked) {
    var ids = "";
    var titles = "";

    //判断是不是全选
    if (node.id == 0) {
        if (node.hasChildNodes()) {
            node.eachChild(function (child) {
                if (child.id > 0) {
                    ids += child.id + ",";
                    titles += child.text + ",";
                    child.ui.toggleCheck(checked);
                    child.attributes.checked = checked;
                }
            })
        }

        return;
    } else {

        var Xiaocheckeds = ptreeXiao.getChecked();

        for (var i = 0; i < Xiaocheckeds.length; i++) {
            if (Xiaocheckeds[i].id > 0) {
                ids += Xiaocheckeds[i].id + ",";
                titles += Xiaocheckeds[i].text + ",";
            }
        }

    }
});

function isExistTrain(id) {
    var deptCount = sManager.getCount();
    for (var j = 0; j < deptCount; j++) {
        if (sManager.getAt(j).get("ID") == id) {
            return true;
        }
    }
    return false;
}
var train = Ext.data.Record.create([
// 下面的 "name" 匹配读到的标签名称
           {name: 'ID', type: 'int' },
           { name: 'Code', type: 'string' },
           { name: 'Title', type: 'string' }

      ]);
var nodes;

var SelectWindow = new Ext.Window({
    width: 560,
    modal: true,
    closeAction: 'hide',
    title: "请选择区域经理",
    items: [Selform, gpManagerSelect, {
        buttons: [
            {
                text: '确  定',
                handler: function () {
                    var deptCount = sManager.getCount();
                    var sm = gpManagerSelect.getSelectionModel();
                    var records = sm.getSelections();

                    for (var i = 0, n = records.length; i < n; i++) {
                        if (!isExistTrain(records[0].data.ID)) {
                            sManager.insert((deptCount + i), records);
                        }
                    }
                    SelectWindow.hide();
                }
            }, {
                text: '取  消',
                handler: function () {

                    SelectWindow.hide();
                }
            }
        ]
    }]
});

function isExistTrainMk(id) {
    var deptCount = sMarketing.getCount();
    for (var j = 0; j < deptCount; j++) {
        if (sMarketing.getAt(j).get("ID") == id) {
            return true;
        }
    }
    return false;
}
var SelectXiaoWindow = new Ext.Window({
    width: 560,
    modal: true,
    closeAction: 'hide',
    title: "请选择销售经理",
    items: [SelformMk, gpMkSelect, {
        buttons: [
            {
                text: '确  定',
                handler: function () {
                    var deptCount = sMarketing.getCount();
                    var sm = gpMkSelect.getSelectionModel();
                    var records = sm.getSelections();
                    
                    for (var i = 0, n = records.length; i < n; i++) {
                        if (!isExistTrainMk(records[0].data.ID)) {
                            sMarketing.insert((deptCount + i), records);
                        }
                    }
                    SelectXiaoWindow.hide();
                }
            }, {
                text: '取  消',
                handler: function () {

                    SelectXiaoWindow.hide();
                }
            }
        ]
    }]

});
var SelectQWindow = new Ext.Window({
    layout: 'fit',
    width: 260,
    height: 350,
    modal: true,
    closeAction: 'hide',
    title: "请选择",
    items: [Qptree]
});

var SelectAreaWindow = new Ext.Window({
    layout: 'fit',
    width: 260,
    height: 350,
    modal: true,
    closeAction: 'hide',
    title: "请选择",
    items: [ptreeArea]
});

function InsertOrUpdate() {
    var count = sManager.getCount()
    var ManagerID = "";
    for (var i = 0; i < count; i++) {
        ManagerID += sManager.getAt(i).get("ID") + ",";
    }

    var count = sMarketing.getCount()
    var MarketingID = "";
    for (var i = 0; i < count; i++) {
        MarketingID += sMarketing.getAt(i).get("ID") + ",";
    }
    AddForm.find("name", "DutyID")[0].setValue("1");
    AddForm.find("name", "EmpID")[0].setValue(ManagerID);
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { ManagerID: ManagerID, MarketingID: MarketingID },
            url: "../Apis/AreaBossMgr.aspx?actionName=submitBoss&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                AddWindow.hide();
                pd_store.reload();

            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);

                } else {
                    Ext.MessageBox.alert("提醒", "服务器繁忙，请稍候在试！");

                }
            }
        });
    }
}


//查询编号是否存在
function SelectCode() {
    if (id == 0) {
        AddAction();
    } else {
        UpdateAction();
    };
}

//添加
function AddAction() {
    var count = sManager.getCount()
    var ManagerID = "";
    for (var i = 0; i < count; i++) {
        ManagerID += sManager.getAt(i).get("ID") + ",";
    }

    var count = sMarketing.getCount()
    var MarketingID = "";
    for (var i = 0; i < count; i++) {
        MarketingID += sMarketing.getAt(i).get("ID") + ",";
    }
    AddForm.find("name", "DutyID")[0].setValue("1");
    AddForm.find("name", "EmpID")[0].setValue(ManagerID);

    AddForm.find("name", "XiaoDutyID")[0].setValue("2");
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { ManagerID: ManagerID, MarketingID: MarketingID },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/AreaBossMgr.aspx?actionName=submitBoss&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);

                AddForm.find("name", "ParentTitle")[0].setValue("");
                AddForm.find("name", "AreaID")[0].setValue("");
                AddForm.find("name", "DutyID")[0].setValue("");
                AddForm.find("name", "EmpID")[0].setValue("");

                //操作成功
                AddWindow.hide();
                pd_store.reload();
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
//修改
function UpdateAction() {
    var count = sManager.getCount()
    var ManagerID = "";
    for (var i = 0; i < count; i++) {
        ManagerID += sManager.getAt(i).get("ID") + ",";
    }

    var count = sMarketing.getCount()
    var MarketingID = "";
    for (var i = 0; i < count; i++) {
        MarketingID += sMarketing.getAt(i).get("ID") + ",";
    }
    AddForm.find("name", "DutyID")[0].setValue("1");
    AddForm.find("name", "EmpID")[0].setValue(ManagerID);
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { ManagerID: ManagerID, MarketingID: MarketingID },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/AreaBossMgr.aspx?actionName=submitBoss&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                AddForm.find("name", "AreaID")[0].setValue("");
                AddWindow.hide();
                pd_store.reload();
                //alert("1");
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
            }
        });
    };
}

//添加Window窗口
var AddWindow = new Ext.Window({
    width: 550,
    minWidth: 400,
    autoScroll: true,
    modal: true,
    closeAction: 'hide',
    title: "添加区域经理",
    plain: true,
    items: [AddForm]
});


//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        header: 'ID',
        dataIndex: 'ID',
        ID: "MyId",
        hidden: true,
        width: 100
    },
    {
        header: 'AreaID',
        dataIndex: 'AreaID',
        hidden: true,
        width: 100
    }, {
        header: "区域",
        dataIndex: "ParentTitle",
        width: 100
    }, {
        header: "职务",
        dataIndex: "DutyID",
        width: 100
    },
    {
        header: '编号',
        dataIndex: 'Code',
        width: 100
    }, {
        header: "姓名",
        dataIndex: "Name",
        width: 100
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AreaBossMgr.aspx?actionName=getDataByParms&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "ID", mapping: "ID" },
                { name: "AreaID", mapping: "AreaID" },
                { name: "ParentTitle", mapping: "ParentTitle" },
                { name: "Name", mapping: "Name" },
                { name: "DutyID", mapping: "DutyID" }

            ]
    })
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    stripeRows:true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    loadMask: true
});
//pd_store.load();
AddForm.getForm().reset();
//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    AddForm.getForm().reset();
    var r = pd_grid.getStore().getAt(rowindex);
    AddForm.find("name", "ParentTitle")[0].setValue(r.get("ParentTitle"));
    AddForm.find("name", "ID")[0].setValue(r.get("ID"));
    AddForm.find("name", "AreaID")[0].setValue(r.get("AreaID"));
    AddForm.find("name", "InOrUp")[0].setValue(r.get("ID"));
    var AreaID = AddForm.find("name", "AreaID")[0].getValue();
    var AreaTitle = AddForm.find("name", "ParentTitle")[0].getValue();
    sManager.removeAll();
    sManager.load({
        params: "AreaID=" + AreaID
    });
    sMarketing.removeAll();
    sMarketing.load({
        params: "AreaID=" + AreaID
    });
    AddWindow.show();
    id = getId(pd_grid);
});

//主容器
var pd_main_panel = new Ext.Panel({
    layout: "anchor",
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