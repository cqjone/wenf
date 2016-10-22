//卡信息修改流水查询

function ConvertJSONDateToJSDateObject(JSONDateString) {
    try {
        var date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10));
        return date.format('Y-m-d H:i:s');
    } catch (e) {
        return JSONDateString;
    }
}

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
                xtype: "datefield",
                fieldLabel: "开始时间",
                format: 'Y-m-d',
                value: new Date(),
                emptyText: DateToString(new Date().dateFormat('Y-m-d')),
                name: "StartTime",
                //editable: false,
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "卡号",
                name: "Code",
                anchor: "100%"

            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "结束时间",
                format: 'Y-m-d',
                value: new Date(),
                emptyText: DateToString(new Date().dateFormat('Y-m-d')),
                name: "EndTime",
                //editable: false,
                anchor: "100%"
            }],
            buttons: [
            {
                text: " 查  询",
                handler: function () {
                    var code = pd_top_form.find("name", "Code")[0].getValue();
                    var startTime = pd_top_form.find("name", "StartTime")[0].getValue();
                    var endTime = pd_top_form.find("name", "EndTime")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { code: code, startTime: startTime, endTime: endTime }
                    });
                }
            }
            
          
             ]
        }]

    }]
});

function getId(pd_grid) {
    var s = pd_grid.getSelectionModel().getSelected();

    if (s) {
        return s.get("ID");
    }
    return 0;
}


var DetailForm = new Ext.form.FormPanel({
    frame: true,
    labelWidth: 80,
    layout: "column",
    labelAlign: 'right',
    items: [{
        layout: "form",
        columnWidth: 0.32,
        items: [{
            xtype: "textfield",
            fieldLabel: "卡号",
            name: "Code",
            readOnly:true,
            anchor: "100%"
        }, {
            xtype: "textfield",
            fieldLabel: "登录名",
            name: "LogName",
            readOnly: true,
            anchor: "100%"
        }
        ]
    }, {
        layout: 'form',
        columnWidth: 0.32,
        items: [
                {
                    xtype: "textfield",
                    fieldLabel: "卡类型",
                    name: "CardType",
                    readOnly: true,
                    anchor: "100%"
                }, {
                    xtype: "textfield",
                    fieldLabel: "用户名",
                    name: "RealName",
                    readOnly: true,
                    anchor: "100%"
                }
            ]
    }, {
        layout: 'form',
        columnWidth: 0.32,
        items: [{
             xtype: "textfield",
            fieldLabel: "门店",
            name: "DeptTitle",
            readOnly: true,
            anchor: "100%"
        },{
            xtype: "textfield",
            fieldLabel: "修改时间",
            name: "CreateDate",
            readOnly: true,
            anchor: "100%"
        }]
    }, {
        layout: 'form',
        columnWidth: 0.97,
        items: [
                    {
                        xtype: "textarea",
                        fieldLabel: "修改内容",
                        height:120,
                        name: "Changes",
                        readOnly: true,
                        anchor: "99%"
                    }
                ]
    }
    ], buttons: [{
        text: '关  闭',
        handler: function () {
            DetailWindow.hide();
        }
    }]
});

//显示详细信息
function showDetailInfo(value, metadata, record, rowIndex, columnIndex, store) {
    window.ShowInfo = function (rowIndex) {
        var r = pd_grid.getStore().getAt(rowIndex);
        DetailForm.getForm().reset();
        DetailForm.find("name", "Code")[0].setValue(r.get("Code"));
        DetailForm.find("name", "CreateDate")[0].setValue(r.get("CreateDate"));
        DetailForm.find("name", "CardType")[0].setValue(r.get("CardType"));
        DetailForm.find("name", "LogName")[0].setValue(r.get("LogName"));
        DetailForm.find("name", "RealName")[0].setValue(r.get("RealName"));
        DetailForm.find("name", "DeptTitle")[0].setValue(r.get("DeptTitle"));
        DetailForm.find("name", "Changes")[0].setValue(r.get("Changes"));
        DetailWindow.show();
    };
    var resultStr = "<a href='#' onclick='ShowInfo(" + rowIndex + ")'>详细信息</a> ";
    return resultStr;
}

//添加Window窗口
var DetailWindow = new Ext.Window({
    layout: 'fit',
    width: 700,
    height:255,
    modal: true,
    closeAction: 'hide',
    title: "详细信息",
    items: [{
        items: [DetailForm]
    }]
});
//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        header: '修改时间',
        dataIndex: 'CreateDate',
        width:120
        
    }, {
        header: '卡号',
		width:100,
        dataIndex: 'Code'
    },
    {
        header: '卡类型',
        dataIndex: 'CardType'
    }, {
        header: "登录名",
        dataIndex: "LogName"
    }, {
        header: "用户名",
        dataIndex: "RealName"
    },{
        header: "门店",
        dataIndex: "DeptTitle"
    }, {
        header: "修改内容",
        hidden:true,
		dataIndex: "Changes",
        width: 200
    }, {
        header: "详情",
        renderer:showDetailInfo
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CardUpSelect.aspx?actionName=getInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        root:'results',
        totalProperty:'totalCount',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "CreateDate", mapping: "CreateDate" },
                { name: "Code", mapping: "Code" },
                { name: "CardType", mapping: "CardType" },
                { name: "LogName", mapping: "LogName" },
                { name: "RealName", mapping: "RealName" },
                { name: "DeptTitle", mapping: "DeptTitle" },
                { name: "Changes", mapping: "Changes" }

            ]
    })
    ,
    listeners:{
        'beforeload':function(){
            pd_store.baseParams.start=0;
          //  pd_store.baseParams.limit = 2;
            pd_store.baseParams.limit = 20;
            this.baseParams["startTime"] = pd_top_form.find("name", "StartTime")[0].getValue();
            this.baseParams["endTime"] = pd_top_form.find("name", "EndTime")[0].getValue();
            this.baseParams["code"] = pd_top_form.find("name", "Code")[0].getValue();
        }
    }
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    stripeRows: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    bbar:new Ext.PagingToolbar({
        //   pageSize:4,
        pageSize:20,
        store: pd_store,
        displayInfo:true,
        displayMsg:'显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    }),
    loadMask: true
});
//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    DetailForm.getForm().reset();
    DetailForm.find("name", "Code")[0].setValue(r.get("Code"));
    DetailForm.find("name", "CreateDate")[0].setValue(r.get("CreateDate"));
    DetailForm.find("name", "CardType")[0].setValue(r.get("CardType"));
    DetailForm.find("name", "LogName")[0].setValue(r.get("LogName"));
    DetailForm.find("name", "RealName")[0].setValue(r.get("RealName"));
    DetailForm.find("name", "DeptTitle")[0].setValue(r.get("DeptTitle"));
    DetailForm.find("name", "Changes")[0].setValue(r.get("Changes"));
    DetailWindow.show();
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
        anchor: '-1 -125',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();