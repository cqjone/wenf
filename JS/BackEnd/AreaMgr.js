//区域管理
var sDep = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AreaMgr.aspx?actionName=getDepInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }
            ]
    })
});
var pd_top_form = new Ext.form.FormPanel({
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
                fieldLabel: "区域编号",
                name: "Code",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "区域名称",
                name: "Title",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "备注",
                name: "MemoInfo",
                anchor: "100%"
            }],
            buttons: [
            {
                text: " 查  询",
                handler: function () {
                    var code = pd_top_form.find("name", "Code")[0].getValue();
                    var memoInfo = pd_top_form.find("name", "MemoInfo")[0].getValue();
                    var title = pd_top_form.find("name", "Title")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { code: code, title: title, memoInfo: memoInfo }
                    });
                }
            },
            {
                text: " 添  加",
                handler: function () {
                    AddForm.find("name", "Code")[0].setValue("");
                    AddForm.find("name", "Title")[0].setValue("");
                    AddForm.find("name", "ParentID")[0].setValue("");
                    AddForm.find("name", "ParentTitle")[0].setValue("");
                    AddForm.find("name", "MemoInfo")[0].setValue("");
                    AddForm.find("name", "InOrUp")[0].setValue("");
                    Selform.find("name", "men")[0].setValue("");
                    Selform.find("name", "ming")[0].setValue("");
                    sDep.removeAll();
                    AddWindow.show();
                }
            },
            {
                text: " 删  除",
                handler: function () {
                    delItem();
                }
            }
             ]
        }]

    }]
});

function delItem() {
    var did = getId(pd_grid);
    if (did) {
        Ext.Msg.confirm('确认', '是否确认删除此区域信息？', function (btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                    url: "../Apis/AreaMgr.aspx?actionName=del&sid=" + Sys.sid,
                    params: { did: did },
                    success: function (result) {
                        var selections = pd_grid.selModel.getSelections();
                        Ext.each(selections, function (item) {
                            pd_store.remove(item);
                            pd_store.removed.push(item);
                            ptree.getLoader().load(ptree.getRootNode());
                        });
                        pd_store.reload();
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

var gpDep = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 220,
    store: sDep,
    loadMask: true,
    stripeRows: true,
    tbar: [
    {
        text: '选择门店',
        iconCls: 'silk-add',
        handler: function () {
            Selform.find("name", "men")[0].setValue("");
            Selform.find("name", "ming")[0].setValue("");
            Dptree.getLoader().load(Dptree.getRootNode());
            Dptree.expandAll();
            StoreWindow.show();
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
         header: '门店编号',
         dataIndex: 'Code'
     },
    {
        header: '门店名称',
        dataIndex: 'Title'
    }, {
        header: '操作',
        renderer: showbuttonDele
    }]
    })

});

function showbuttonDele(value, metadata, record, rowIndex, columnIndex, store) {
    window.DelInfo = function (rowIndex) {
        var selections = gpDep.selModel.getSelections();
        var s = gpDep.getSelectionModel().getSelected().get("ID");
        Ext.Msg.confirm('提示', '确定删除？', function (btn) {
            if (btn == 'yes') {
                Ext.each(selections, function (item) {
                    sDep.remove(item);
                    sDep.removed.push(item);
                    var delID = s;
                    Ext.Ajax.request({
                        params: { delID: delID },
                        url: '../Apis/AreaMgr.aspx?actionName=delStore&sid=' + Sys.sid
                    });
                    Dptree.root.eachChild(function (child) {
                        if (child.id == s) {
                            child.attributes.checked = false;
                        }
                    });

                });
            }
        });
    };
    var resultStr = "<a href='#' onclick='DelInfo(" + rowIndex + ")'>删除</a> ";
    return resultStr;
}

var AddForm = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 70,
    items: [{
        xtype: "fieldset",
        title: "区域信息",
        defaults: { labelAlign: "right", width: 180 },
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.5,
            items: [{
                xtype: "textfield",
                fieldLabel: "区域编号",
                allowBlank: false,
                labelWidth: 30,
                name: "Code",
                anchor: "95%"
            },
             {
                 xtype: "textfield",
                 fieldLabel: "区域名称",
                 allowBlank: false,
                 name: "Title",
                 anchor: "95%"
             }
            ]
        }, {
            layout: "form",
            columnWidth: 0.5,
            items: [{
                columnWidth: 1,
                layout: 'column',
                items: [{
                    layout: "form",
                    columnWidth: 0.85,
                    items: [
                    {
                        xtype: "textfield",
                        fieldLabel: "上级区域",
                        allowBlank: false,
                        readOnly: true,
                        name: "ParentTitle",
                        anchor: "100%"
                    }, {
                        xtype: 'hidden',
                        name: 'ParentID'
                    }, {
                        xtype: 'hidden',
                        name: 'ID'
                    }, {
                        xtype: 'hidden',
                        name: 'InOrUp'
                    }
                    ]
                }, {
                    columnWidth: 0.1,
                    xtype: "button",
                    text: "选择",
                    handler: function () {
                        SelectWindow.show();
                        ptree.expandAll();
                    }
                }]

            }, {
                xtype: "textfield",
                fieldLabel: "备注",
                name: "MemoInfo",
                anchor: "95%"
            }

            ]
        }]
    }, {
        xtype: "fieldset",
        title: "门店",
        items: [
        gpDep
        ]
    }
    ], buttons: [
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


var ptree = new Ext.tree.TreePanel({
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
            SelectWindow.hide();
            AddForm.find("name", "ParentTitle")[0].setValue(node.text);
            AddForm.find("name", "ParentID")[0].setValue(node.id);

        }
    }

});

var Selform = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelAlign: 'right',
    labelWidth: 55,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "left" },
        layout: "column",
        items: [{
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.48,
            items: [{
                xtype: "textfield",
                fieldLabel: "门店编号",
                name: "men",
                width: 300,
                anchor: "100%"
            }]
        }, {
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.48,
            items: [{
                xtype: "textfield",
                fieldLabel: "门店名称",
                name: "ming",
                width: 300,
                anchor: "100%"

            }],
            buttons: [
            {
                text: " 查  询",
                handler: function () {
                    var code = Selform.find("name", "men")[0].getValue();
                    var title = Selform.find("name", "ming")[0].getValue();
                    var loader = new Ext.tree.TreeLoader({ 
                     dataUrl: '../Apis/AreaMgr.aspx?actionName=getDepMenu&sid=' + Sys.sid,
                     baseParams: { code: code, title: title }
                 });
                    loader.load(Dptree.root);
                    Dptree.expandAll();

                }
            }
             ]
        }]

    }]
});

var Dptree = new Ext.tree.TreePanel({
    xtype: 'treepanel',
    height: 300,
    autoScroll: true,
    useArrows: true,
    animate: true,
    enableDD: true,
    rootVisible: false,
    root: new Ext.tree.AsyncTreeNode(),
    loader: new Ext.tree.TreeLoader({
        dataUrl: '../Apis/AreaMgr.aspx?actionName=getDepMenu&sid=' + Sys.sid, baseParams: { id: "0" }
    })
});

//保存所有选择的ID和名称
var ids = "";
var titles = "";
Dptree.on('checkchange', function (node, checked) {
    ids = "";
    titles = "";
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

        var checkeds = Dptree.getChecked();

        for (var i = 0; i < checkeds.length; i++) {
            if (checkeds[i].id > 0) {
                ids += checkeds[i].id + ",";
                titles += checkeds[i].text + ",";

            }
        }
    }
});
var SelectWindow = new Ext.Window({
    layout: 'fit',
    width: 260,
    height: 350,
    modal: true,
    closeAction: 'hide',
    title: "区域选择",
    items: [ptree]
});
var nodes;
var Dept = Ext.data.Record.create([
// 下面的 "name" 匹配读到的标签名称
           { name: 'ID', type: 'int' },
           { name: 'Code', type: 'string' },
           { name: 'Title', type: 'string' }
      ]);

//判断选择的门店是否是重复选中的
function isExistDept(id) {
    var deptCount = sDep.getCount();
    for (var j = 0; j < deptCount; j++) {
        if (sDep.getAt(j).get("ID") == id) {
            return true;
        }
    }
    return false;
           }
           //选择门店窗体
           var StoreWindow = new Ext.Window({
               width: 440,
               height: 490,
               modal: true,
               closeAction: 'hide',
               title: "请选择",
               items: [Selform, Dptree, {
                   buttons: [
            {
                xtype: 'button',
                text: '确定',
                handler: function () {
                    var deptCount = sDep.getCount();
                    nodes = Dptree.getChecked();                 
                    for (var i = 0, n = nodes.length; i < n; i++) {
                        if (!isExistDept(nodes[i].id)) {
                            sDep.insert((deptCount + i), new Dept({
                                ID: nodes[i].id,
                                Code: nodes[i].attributes.code,
                                Title: nodes[i].attributes.Title
                            }));
                       }                     
                    }              
                    Dptree.getLoader().load(Dptree.getRootNode());
                    Dptree.expandAll();
                    StoreWindow.hide();
                }
            }, {
                text: '取消',
                handler: function () {

                    StoreWindow.hide();
                }
            }
        ]
               }]
           });


    function InsertOrUpdate() {
        var count = sDep.getCount()
        var DepID = "";
        for (var i = 0; i < count; i++) {
            DepID += sDep.getAt(i).get("ID") + ",";
        }
        if (AddForm.getForm().isValid()) {
            AddForm.getForm().submit({
                params: { cid: AddForm.find("name", "Code")[0].getValue(), uid: getId(pd_grid), ids: DepID },
                url: "../Apis/AreaMgr.aspx?actionName=submitArea&sid=" + Sys.sid,
                success: function (form, action) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                    AddWindow.hide();
                     pd_store.reload();                
                     ptree.getLoader().load(ptree.getRootNode());
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
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { cid: AddForm.find("name", "Code")[0].getValue(), uid: getId(pd_grid) },
            url: "../Apis/AreaMgr.aspx?actionName=selectCode&sid=" + Sys.sid,
            success: function (form, action) {
                 Ext.MessageBox.alert("提醒", action.result.msg);
                pd_store.load();
                if (action.result.success) {
                    if (id == 0) {

                        AddAction();
                       

                    } else {
                        UpdateAction();
                    };
                    pd_store.load();
                }
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

//添加
function AddAction() {
    var count = sDep.getCount()
    var DepID = "";
    for (var i = 0; i < count; i++) {
        DepID += sDep.getAt(i).get("ID") + ",";
    }
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { ids: DepID },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/AreaMgr.aspx?actionName=submitArea&sid=" + Sys.sid,
            success: function (form, action) {
                // Ext.MessageBox.alert("提醒", action.result.msg);
                AddForm.find("name", "Code")[0].setValue("");
                AddForm.find("name", "Title")[0].setValue("");
                AddForm.find("name", "ParentID")[0].setValue("");
                AddForm.find("name", "ParentTitle")[0].setValue("");
                AddForm.find("name", "MemoInfo")[0].setValue("");
                sDep.removeAll();
                sDep.load();
                //操作成功
                AddWindow.hide();
                pd_store.load();
                ptree.getLoader().load(ptree.getRootNode());
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
    var count = sDep.getCount()
    var DepID = "";
    for (var i = 0; i < count; i++) {
        DepID += sDep.getAt(i).get("ID") + ",";
    }
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { ids: DepID },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/AreaMgr.aspx?actionName=submitArea&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                AddForm.find("name", "ID")[0].setValue("");
                AddWindow.hide();
                pd_store.load();
                ptree.getLoader().load(ptree.getRootNode());
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
    layout: 'fit',
    width: 550,
    height: 450,
    modal: true,
    closeAction: 'hide',
    title: "区域管理",
    items: [{
        items: [AddForm]
    }]
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
        ID: "ID",
        hidden: true,
        width: 100
    }, {
        header: 'ParentID',
        dataIndex: 'ParentID',
        hidden: true,
        width: 100
    }, {
        header: '区域编号',
        dataIndex: 'Code',
        width: 100
    },
    {
        header: '区域名称',
        dataIndex: 'Title',
        width: 100
    }, {
        header: "上级区域",
        dataIndex: "ParentTitle",
        width: 100
    }, {
        header: "备注",
        dataIndex: "MemoInfo",
        width: 200
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AreaMgr.aspx?actionName=GetInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "MemoInfo", mapping: "MemoInfo" },
                { name: "ParentID", mapping: "ParentID" },
                { name: "ParentTitle", mapping: "ParentTitle" },
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }

            ]
    })
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    stripeRows: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    loadMask: true
});
AddForm.getForm().reset();
//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    AddForm.getForm().reset();
    var r = pd_grid.getStore().getAt(rowindex);
    AddForm.find("name", "Code")[0].setValue(r.get("Code"));
    AddForm.find("name", "Title")[0].setValue(r.get("Title"));
    AddForm.find("name", "MemoInfo")[0].setValue(r.get("MemoInfo"));
    AddForm.find("name", "ParentID")[0].setValue(r.get("ParentID"));
    AddForm.find("name", "ParentTitle")[0].setValue(r.get("ParentTitle"));
    AddForm.find("name", "ID")[0].setValue(r.get("ID"));
    AddForm.find("name", "InOrUp")[0].setValue(r.get("ID"));
    var AreaID = AddForm.find("name", "ID")[0].getValue();
    sDep.removeAll();
    sDep.load({
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