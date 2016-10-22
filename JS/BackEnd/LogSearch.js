//日志查询
var pd_top_form = new Ext.form.FormPanel({
    bodyBorder: false,
    border: false,
    autoScroll: true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "right", width: 80 },
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.28,
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
            columnWidth: 0.28,
            items: [{
                xtype: "datefield",
                fieldLabel: "结束日期",
                name: "EndDate",
                value: DateToString(new Date()),
                emptyText: DateToString(new Date()),
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.28,
            items: [{
                xtype: "combo",
                fieldLabel: "日志类型",
                hiddenName: "LogType",
                anchor: "100%",
                triggerAction: 'all',
                editable: false,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    fields: ['myId', 'displayText'],
                    data: [['信息', '信息'], ['警告', '警告'], ['错误', '错误']]
                }),
                value:"信息",
                valueField: 'myId',
                displayField: 'displayText'
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            columnWidth: 0.16,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    pd_store.load();
                    
                }
            }]
        }]
    }]
});

//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
     {
         header: '日志时间',
         dataIndex: 'LogDate',
         sortable : true,
         width: 150
     }, {
         header: '日志类型',
         dataIndex: 'LogType',
         sortable: true,
         width: 80
     }, {
         header: '日志内容',
         dataIndex: 'Detail',
         sortable: true,
         width: 400
     },{
         header: 'IP地址',
         dataIndex: 'IpAddress',
         sortable: true,
         width: 100
     }, {
         header: 'ActionName',
         dataIndex: 'ActionName',
         sortable: true,
         width: 100
     }, {
         header: '执行时间(毫秒)',
         dataIndex: 'ExecTime',
         sortable: true,
         width: 100
     }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/Log.aspx?actionName=GetData&sid=" + Sys.sid,
    root: "results",
    remoteSort: true,
    reader: new Ext.data.JsonReader({
        root: "results",
        totalProperty: 'totalCount',
        fields: [
            { name: "LogDate", mapping: "LogDate" },
            { name: "LogType", mapping: "LogType" },
            { name: "Detail", mapping: "Detail" },
            { name: "IpAddress", mapping: "IP" },
            { name: "ActionName", mapping: "ActionName" },
            { name: "ExecTime", mapping: "ExecTime", type: 'float' }
            ]
    })
});

pd_store.on('beforeload', function (thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    thiz.baseParams["begindate"] = pd_top_form.find("name", "BeginDate")[0].getValue();
    thiz.baseParams["enddate"] = pd_top_form.find("name", "EndDate")[0].getValue();
    thiz.baseParams["logType"] = pd_top_form.find("hiddenName", "LogType")[0].getValue();
});



var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});




//主容器
var pd_main_panel = new Ext.Panel({
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