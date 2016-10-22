//门店限制操作项
var id = 0;

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
                fieldLabel: "编 号",
                name: "Code",
                anchor: "100%"
            }, {
                xtype: "combo",
                fieldLabel: "类 型",
                anchor: "100%",
                hiddenName: "LimitType",
                triggerAction: 'all',
                //emptyText: '全部',
                editable: false,
                mode: 'local',
                // typeAhead: true, //自动将第一个搜索到的选项补全输入
                selectOnFocus: true,
                triggerAction: "all",
                value: "全部",
                store: new Ext.data.ArrayStore({
                    fields: ['myId', 'displayText'],
                    data: type_Alldata
                }),
                valueField: 'myId',
                displayField: 'displayText'
            }]
        }, {
            layout: "form",
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "名 称",
                name: "Title",
                anchor: "90%"
            }],
            bodyStyle: "margin:0 30px",
            buttons: [
            {
                text: " 查  询",
                handler: function () {
                    var code = pd_top_form.find("name", "Code")[0].getValue();
                    var limitType = pd_top_form.find("hiddenName", "LimitType")[0].getValue();
                    var title = pd_top_form.find("name", "Title")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { code: code, limitType: limitType, title: title }
                    });
                }
            },
            {
                text: " 添  加",
                handler: function () {
                    id = 0;
                    AddForm.find("name", "Code")[0].setValue("");
                    AddForm.find("name", "Title")[0].setValue("");
                    AddForm.find("hiddenName", "LimitType")[0].setValue("");
                    AddForm.find("name", "LimitCount")[0].setValue("");
                    AddForm.find("name", "MemoInfo")[0].setValue("");
                    AddForm.find("name", "CardType")[0].setValue("");
                    AddForm.find("name", "CardTypeID")[0].setValue("");
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
        Ext.Msg.confirm('确认', '真的要删除此信息吗？', function (btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                    url: "../Apis/DeptLimit.aspx?actionName=delDeptLimit&sid=" + Sys.sid,
                    params: { did: did },
                    success: function (result) {
                        var selections =pd_grid.selModel.getSelections();
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
        return s.id;
    }
    return 0;
}


//添加Form窗口
var AddForm = new Ext.form.FormPanel({
    frame: true,
    //autoScroll: true,
    labelWidth: 80,
    // bodyStyle: 'padding:5px',
    layout: "column",
    labelAlign: 'right',
    bodyStyle: "margin:0 -40px",
    items: [
    {
        layout: "form",
        columnWidth: 0.48,
        items: [{
            xtype: "textfield",
            fieldLabel: "编 号",
            name: "Code",
            //id: "Code",
            allowBlank: false,
            anchor: "100%"
        }, {
            xtype: "combo",
            fieldLabel: "类 型",
            anchor: "100%",
            hiddenName: "LimitType",
            triggerAction: 'all',
            allowBlank: false,
            editable: false,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                fields: ['myId', 'displayText'],
                data: type_data
            }),
            valueField: 'myId',
            displayField: 'displayText'
        }]
    }, {
        layout: "form",
        columnWidth: 0.5,
        bodyStyle: "margin:0 -20px",
        items: [{
            xtype: "textfield",
            fieldLabel: "名 称",
            name: "Title",
            allowBlank: false,
            anchor: "98%"
        }, {
            xtype: "numberfield",
            fieldLabel: "数 量",
            name: "LimitCount",
            //id: "LimitCount",
            allowBlank: false,
            anchor: "98%"
        }]
    },
    {
        columnWidth: 0.965,
        layout: 'form',
        items: [{
            //id:'memoinfo',
            xtype: 'textfield',
            fieldLabel: '备 注',
            name: 'MemoInfo',
            anchor: '97%'
        }]
    }, {
        columnWidth: 0.965,
        layout: 'column',
        items: [{
            columnWidth: 0.7,
            layout: "form",
            items: [{
                //id:'memoinfo',
                xtype: 'textfield',
                fieldLabel: '卡类型',
                name: 'CardType',
                readOnly: true,
                anchor: '94%'
            }]
        }, {
            columnWidth: 0.2,
            xtype: "button",
            text: "选择",
            handler: function () {
                var ids = AddForm.find("name", "CardTypeID")[0].getValue();
                //alert(ids);
                SelectDeptWindow.show();
                checkNow();
            }
        }, {
            xtype: "hidden",
            name: "CardTypeID"
        }]
    }],
    buttons: [
    {
        text: '保  存',
        handler: function () {
            SelectCode();
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
    dataUrl: '../Apis/Dept.aspx?actionName=GetCardType&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        checked: false,
        expanded: true,
        nodeType: 'async',
        id:"0",
        text: "卡类型全选"
    }
});



//保存所有选择的ID和名称
var ids = ",";
var titles = "";

ptree.on("afterrender", function (t) {
    //alert("tt");
    //只执行一次
    checkNow();
});

//把现有的勾选上
function checkNow() {
    ids = AddForm.find("name", "CardTypeID")[0].getValue();
    //alert(ids);
    var aids = ids.split(",");
    //alert(aids.length);
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
    ids = ",";
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

        AddForm.find("name", "CardTypeID")[0].setValue(ids);
        AddForm.find("name", "CardType")[0].setValue(titles);
        return;
    } else {

        var checkeds = ptree.getChecked();

        for (var i = 0; i < checkeds.length; i++) {
            if (checkeds[i].id > 0) {
                ids += checkeds[i].id + ",";
                titles += checkeds[i].text + ",";
            }
        }

        AddForm.find("name", "CardTypeID")[0].setValue(ids);
        AddForm.find("name", "CardType")[0].setValue(titles);
        //alert(ids + "\r\n" + titles);
    }
});

var SelectDeptWindow = new Ext.Window({
    layout: 'fit',
    width: 400,
    height: 300,
    modal: true,
    closeAction: 'hide',
    title: "店铺选择",
    items: [ptree]
});


//======卡类型选择=====




//查询编号是否存在
function SelectCode() {
    var count = AddForm.find("name", "LimitCount")[0].getValue();
    if (count < 0) {
        Ext.MessageBox.alert("提醒", "数量不能为负数");
        return false;
    };
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { cid: AddForm.find("name", "Code")[0].getValue(), uid: getId(pd_grid) },
            url: "../Apis/DeptLimit.aspx?actionName=selectCode&sid=" + Sys.sid,
            success: function (form, action) {
                // Ext.MessageBox.alert("提醒", action.result.msg);
                //pd_store.load();
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
   
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { id: id },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/DeptLimit.aspx?actionName=submitDeptLimit&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                    AddForm.find("name", "Code")[0].setValue("");
                    AddForm.find("name", "Title")[0].setValue("");
                    AddForm.find("hiddenName", "LimitType")[0].setValue("");
                    AddForm.find("name", "LimitCount")[0].setValue("");
                    AddForm.find("name", "MemoInfo")[0].setValue("");
                    AddForm.find("name","CardType")[0].setValue("");
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
//修改
function UpdateAction() {
    
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { id: getId(pd_grid) },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/DeptLimit.aspx?actionName=submitDeptLimit&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
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
    //layout: 'fit',
    width: 550,
    minWidth:400,
    autoScroll: true,
    //height: 158,
    modal: true,
    closeAction: 'hide',
    title: "添加限制项",
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
        dataIndex: 'id',
        ID: "MyId",
        hidden: true,
        width: 100
    },
    {
        header: '编号',
        dataIndex: 'Code',
        width: 100
    }, {
        header: "名称",
        dataIndex: "Title",
        width: 130,
        align: 'right'
    }, {
        header: "类型",
        dataIndex: "LimitType",
        width: 130,
        align: 'right',
        renderer: function (v) {
            return rtype(v);
        }
    }, {
        header: "数量",
        dataIndex: "LimitCount",
        width: 100,
        align: 'right'
    }, {
        header: "备注",
        dataIndex: "MemoInfo",
        width: 200,
        align: 'right'
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/DeptLimit.aspx?actionName=getDataByParms&sid=' + Sys.sid,

    reader: new Ext.data.JsonReader({
        //record: 'plant',
        //root: 'msg',
        //totalProperty: 'results',
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "Title", mapping: "Title" },
                { name: "LimitType", mapping: "LimitType" },
                { name: "LimitCount", mapping: "LimitCount" },
                { name: "MemoInfo", mapping: "MemoInfo" },
                { name: "CardTypeID", mapping: "CardTypeID" },
                { name: "CardType", mapping: "CardType" },
                { name: "id", mapping: "id"}
            ]
    })
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    stripeRows: true,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});
//pd_store.load();
AddForm.getForm().reset();
//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    AddForm.getForm().reset();
    var r = pd_grid.getStore().getAt(rowindex);
    AddForm.find("name", "Code")[0].setValue(r.get("Code"));
    AddForm.find("name", "Title")[0].setValue(r.get("Title"));
    AddForm.find("hiddenName", "LimitType")[0].setValue(r.get("LimitType"));
    AddForm.find("name", "LimitCount")[0].setValue(r.get("LimitCount"));
    AddForm.find("name", "MemoInfo")[0].setValue(r.get("MemoInfo"));
    AddForm.find("name", "CardTypeID")[0].setValue(r.get("CardTypeID"));
    AddForm.find("name", "CardType")[0].setValue(r.get("CardType"));
    AddWindow.show();
    id = getId(pd_grid);
});

//主容器
var pd_main_panel = new Ext.Panel({
    //autotoWidth:true,
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