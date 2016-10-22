//培训记录管理
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
                xtype: "datefield",
                fieldLabel: "开始时间",
                name: "TrainDate",
                format: 'Y-m-d',
                value: new Date(),
                emptyText: DateToString(new Date().dateFormat('Y-m-d')),
                editable: false,
                anchor: "100%"
                // typeAhead: true, //自动将第一个搜索到的选项补全输入

            }, { xtype: "datefield",
                fieldLabel: "结束时间",
                name: "TrainDateEnd",
                value: new Date(),
                emptyText: DateToString(new Date().dateFormat('Y-m-d')),
                format: 'Y-m-d',
                editable: false,
                anchor: "100%"
            }, {
                xtype: 'hidden',
                name: 'ID'
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "期数",
                name: "Term",
                anchor: "100%"
            }],
            buttons: [
            {
                text: " 查  询",
                handler: function () {
                    var trainDate = pd_top_form.find("name", "TrainDate")[0].getValue();
                    var trainDateEnd = pd_top_form.find("name", "TrainDateEnd")[0].getValue();
                    var term = pd_top_form.find("name", "Term")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { trainDate: trainDate,trainDateEnd:trainDateEnd, term: term }
                    });
                }
            },
            {
                text: " 添  加",
                handler: function () {
                    id = 0;
                    AddForm.find("name", "InOrUp")[0].setValue("");
                    AddForm.find("name", "TrainDate")[0].setValue("");
                    AddForm.find("name", "Term")[0].setValue("");
                    AddForm.find("name", "MemoInfo")[0].setValue("");
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
        Ext.Msg.confirm('确认', '是否确定删除此培训记录信息？', function (btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                    url: "../Apis/TrainMgr.aspx?actionName=delTrain&sid=" + Sys.sid,
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


var sDep = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/TrainMgr.aspx?actionName=getTrainInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }

            ]
    })
});
var oneSm = new Ext.grid.CheckboxSelectionModel();
var gpDep = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 220,
    autoWidth: true,
    store: sDep,
    loadMask: true,
    stripeRows: true,
    tbar: [
    {
        text: '选择人员',
        iconCls: 'silk-add',
        handler: function () {
            Selform.find("name", "Code")[0].setValue("");
            Selform.find("name", "Name")[0].setValue("");
            combo.setValue("");
            TrainSt.removeAll();
            SelectWindow.show();
        }
    },
    {
        text: '删除',
        iconCls: 'silk-delete',
        handler: function () {
            var id = AddForm.find("name", "ID")[0].getValue();
            var selections = gpDep.selModel.getSelections();
            var records = gpDep.getSelectionModel().getSelections();
            var delID = "";
            for (var i = 0, n = records.length; i < n; i++) {
                delID += records[i].data.ID+',';
            }

            Ext.Msg.confirm('提示', '是否确定删除？', function (btn) {
                if (btn == 'yes') {
                    Ext.each(selections, function (item) {
                        sDep.remove(item);
                        sDep.removed.push(item);
                        Ext.Ajax.request({
                            params: { delID: delID, id: id },
                            url: '../Apis/TrainMgr.aspx?actionName=delStore&sid=' + Sys.sid
                        });
                    });
                }
            });


        }
    }],
    sm: oneSm,
    cm: new Ext.grid.ColumnModel({
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns:
        [oneSm,
    {
        header: 'id',
        dataIndex: 'ID',
        ID: "ID",
        hidden: true
    },
     {
         header: '员工编号',
         dataIndex: 'Code'
     },
    {
        header: '员工名称',
        dataIndex: 'Title'
    }
    ]
    })

});

//function showbuttonDele(value, metadata, record, rowIndex, columnIndex, store) {
//    window.DelInfo = function (rowIndex) {
//        var id = AddForm.find("name", "ID")[0].getValue();
//        var selections = gpDep.selModel.getSelections();
//        var s = gpDep.getSelectionModel().getSelected().get("ID");
//        Ext.Msg.confirm('提示', '确定删除？', function (btn) {
//            if (btn == 'yes') {
//                Ext.each(selections, function (item) {
//                    sDep.remove(item);
//                    sDep.removed.push(item);
//                    var delID = s;
//                    Ext.Ajax.request({
//                        params: { delID: delID ,id:id},
//                        url: '../Apis/TrainMgr.aspx?actionName=delStore&sid=' + Sys.sid
//                    });
//                });
//            }
//        });
//    };
//    var resultStr = "<a href='#' onclick='DelInfo(" + rowIndex + ")'>删除</a> ";
//    return resultStr;
//}


//添加Form窗口
var AddForm = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 70,
    items: [{
        xtype: "fieldset",
        title: "培训信息",
        defaults: { labelAlign: "right", width: 180 },
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.5,
            items: [{
                    xtype: "datefield",
                fieldLabel: "培训日期",
                anchor: "100%",
                format: 'Y-m-d',
                name: "TrainDate",
                allowBlank: false,
                anchor: "100%"

            },
             {
                 xtype: "textfield",
                 fieldLabel: "备注",
                 name: "MemoInfo",
                 anchor: "100%"
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
                        fieldLabel: "期数",
                        name: "Term",
                        allowBlank: false,
                        anchor: "98%"
                    }, {
                        xtype: 'hidden',
                        name: 'ID'
                    }, {
                        xtype: 'hidden',
                        name: 'InOrUp'
                    }
                    ]
                }

                ]

            }

            ]
        }]
    }, {
        xtype: "fieldset",
        title: "培训人员",
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

var combo = new Ext.form.ComboBox({
    hiddenName: 'DeptId',
    typeAhead: true,
    fieldLabel: '员工门店',
    minChars: 1,
    mode: 'remote',
    triggerAction: 'all',
    store: Store_GetDept,
    valueField: 'myId',
    displayField: 'displayText',
    anchor: '80%'
});
var Selform = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelAlign: 'right',
    labelWidth: 60,
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
                fieldLabel: "员工编号",
                name: "Code",
                width: 300,
                anchor: "100%"
            }]
        }, {
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.48,
            items: [{
                xtype: "textfield",
                fieldLabel: "员工姓名",
                name: "Name",
                width: 300,
                anchor: "100%"
            }]
        }, {
            layout: "form",
            bodyBorder: false,
            columnWidth: 0.5,
            items: [{
                    xtype: 'combo',
                    hiddenName: 'DeptID',
                    name: 'DeptTitle',
                    typeAhead: true,
                    fieldLabel: '员工门店',
                    minChars: 1,
                    mode: 'remote',
                    triggerAction: 'all',
                    store: Store_GetDept,
                    valueField: 'myId',
                    displayField: 'displayText',
                    anchor: '96%'
            }
            ]
        }, {
            columnWidth: 0.1,
            xtype: "button",
            text: "查询",
            handler: function () {
                var code = Selform.find("name", "Code")[0].getValue();
                var name = Selform.find("name", "Name")[0].getValue();
                var deptid = Selform.find("name", "DeptTitle")[0].getValue()
               // var dept = combo.getRawValue();
                TrainSt.load({
                    params: { code: code, name: name, deptid: deptid }
                });
            }
        }]
    }]
});

 Store_GetDept = new Ext.data.Store({
    url: '../Apis/TrainMgr.aspx?actionName=getDept&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: ['myId', 'displayText']
    })
});

//保存所有选择的ID和名称
var ids = ",";
var titles = "";

var nodes;
var TrainSt = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/TrainMgr.aspx?actionName=getTrainMenu&sid=' + Sys.sid,
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
var TrainGp =new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 280,
    autoWidth: true,
    store: TrainSt,
    loadMask: true,
    sm: sm,
    stripeRows: true,
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
         width: 90

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
function isExistTrain(id) {
    var deptCount = sDep.getCount();
    for (var j = 0; j < deptCount; j++) {
        if (sDep.getAt(j).get("ID") == id) {
            return true;
        }
    }
    return false;
}

           var SelectWindow = new Ext.Window({
               width: 560,
               modal: true,
               closeAction: 'hide',
               title: "人员选择",
               items: [Selform, TrainGp,
    {
        buttons: [{
            text: '确定',
            handler: function () {
                var deptCount = sDep.getCount();

                var sm = TrainGp.getSelectionModel();
                var records = sm.getSelections();

                for (var i = 0, n = records.length; i < n; i++) {
                    if (!isExistTrain(records[0].data.ID)) {
                        sDep.insert((deptCount + i), records);
                    }
                }
                SelectWindow.hide();
            }

        }, {
            text: '取消',
            handler: function () {
                SelectWindow.hide();
            }
        }]
    }
    ]
           });

function InsertOrUpdate() {
    var count = sDep.getCount();
    var DepIDS = "";
    for (var i = 0; i < count; i++) {
        DepIDS += sDep.getAt(i).get("ID") + ",";
    }
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { cid: AddForm.find("name", "Term")[0].getValue(), uid: getId(pd_grid), ids: DepIDS },
            url: "../Apis/TrainMgr.aspx?actionName=submitTrain&sid=" + Sys.sid,
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
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { cid: AddForm.find("name", "Term")[0].getValue(), uid: getId(pd_grid) },
            url: "../Apis/TrainMgr.aspx?actionName=selectCode&sid=" + Sys.sid,
            success: function (form, action) {
                // Ext.MessageBox.alert("提醒", action.result.msg);
                //pd_store.load();
                if (action.result.success) {
                    if (id == 0) {
                        AddAction();
                    } else {
                        UpdateAction();
                    };
                    pd_store.reload();
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
    var count = sDep.getCount();
    var DepIDS = "";
    for (var i = 0; i < count; i++) {
        DepIDS += sDep.getAt(i).get("ID") + ",";
    }
        if (AddForm.getForm().isValid()) {
            AddForm.getForm().submit({
                params: { ids: DepIDS },
                waitMsg: "正在提交，请稍候...",
                url: "../Apis/TrainMgr.aspx?actionName=submitTrain&sid=" + Sys.sid,
                success: function (form, action) {
                   // Ext.MessageBox.alert("提醒", action.result.msg);
                    AddForm.find("name", "Term")[0].setValue("");
                    AddForm.find("name", "TrainDate")[0].setValue("");
                    AddForm.find("name", "MemoInfo")[0].setValue("");

                    sDep.removeAll();
                    sDep.reload();
                    //操作成功

                    AddWindow.hide();
                    pd_store.reload();
                },
                failure: function (form, action) {
                    if (action != undefined && action.result != undefined) {
                        Ext.MessageBox.alert("提醒", action.result.msg);
                        pd_store.reload();
                    } else {
                        Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                        pd_store.reload();
                    }
                }
            });
        }
}
//修改
function UpdateAction() {
    var count = sDep.getCount();
    var DepIDS = "";
    for (var i = 0; i < count; i++) {
        DepIDS += sDep.getAt(i).get("ID") + ",";
    }
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { ids: DepIDS },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/TrainMgr.aspx?actionName=submitTrain&sid=" + Sys.sid,
            success: function (form, action) {
              //  Ext.MessageBox.alert("提醒", action.result.msg);
                AddForm.find("name", "ID")[0].setValue("");
                AddWindow.hide();
                pd_store.reload();
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                    AddWindow.hide();
                    pd_store.reload();
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                    AddWindow.hide();
                    pd_store.reload();
                }
            }
        });
    };
}

//添加Window窗口
var AddWindow = new Ext.Window({
    width: 500,
    minWidth: 400,
    autoScroll: true,
    modal: true,
    closeAction: 'hide',
    title: "添加培训记录",
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
    }, {
        header: 'EmpID',
        dataIndex: 'EmpID',
        hidden: true,
        width: 100
    },
     {
        header: "培训日期",
        dataIndex: "TrainDate",
        renderer: ConvertJSONDateToJSDateObjectTextField,
        width: 100
    }, {
        header: "期数",
        dataIndex: "Term",
        width: 100
    }, {
        header: "备注",
        dataIndex: "MemoInfo",
        width: 200
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/TrainMgr.aspx?actionName=getDataByParms&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [

                { name: "TrainDate", mapping: "TrainDate" },
                { name: "Term", mapping: "Term" },
                { name: "TrainName", mapping: "TrainName" },
                { name: "MemoInfo", mapping: "MemoInfo" },
                { name: "EmpID", mapping: "EmpID" },
                { name: "ID", mapping: "ID" }
            ]
    })
    ,
    listeners: {
        beforeload: function () {
            var trainDate = pd_top_form.find("name", "TrainDate")[0].getValue();
            var trainDateEnd = pd_top_form.find("name", "TrainDateEnd")[0].getValue();
            var term = pd_top_form.find("name", "Term")[0].getValue();
            pd_store.baseParams.trainDate = trainDate;
            pd_store.baseParams.trainDateEnd = trainDateEnd;
            pd_store.baseParams.term = term;
        }
    }
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    stripeRows: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    loadMask: true
});
//pd_store.load();
AddForm.getForm().reset();
//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    AddForm.getForm().reset();
    var r = pd_grid.getStore().getAt(rowindex);
    AddForm.find("name", "TrainDate")[0].setValue(ConvertJSONDateToJSDateObjectTextField(r.get("TrainDate")));
    AddForm.find("name", "Term")[0].setValue(r.get("Term"));
    AddForm.find("name", "MemoInfo")[0].setValue(r.get("MemoInfo"));
    AddForm.find("name", "ID")[0].setValue(r.get("ID"));
    AddForm.find("name", "InOrUp")[0].setValue(r.get("ID"));
    var Term = AddForm.find("name", "Term")[0].getValue();
    var trainID = AddForm.find("name", "ID")[0].getValue();

    sDep.removeAll();
    sDep.load({
        params: "trainID=" + trainID
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