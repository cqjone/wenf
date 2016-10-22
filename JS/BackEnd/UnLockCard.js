//解锁卡
var modelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["全部", "全部"],
            ["正常", "正常"],
            ["挂失", "挂失"],
            ["销卡", "销卡"],
            ["未启用", "未启用"]]
});

var type_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CardMgr.aspx?actionName=getType&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }
            ]
    }),
    sortInfo: { field: 'ID', direction: 'ASC' }
});
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
        defaults: { labelAlign: "right", width: 60 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.3,
            items: [{
                xtype: "combo",
                fieldLabel: "卡类型",
                name: "TypeId",
                hiddenName: "TypeId",
                anchor: "100%",
                triggerAction: 'all',
                store: type_store,
                valueField: 'ID',
                displayField: 'Title',
                enableKeyEvents: true,
                selectOnFocus: true,
                allowBlank: true,
                forceSelection: true,
                listeners: {
                    "keyup": function (v) {
                        type_store.load({
                            params: { tName: v.getRawValue() }
                        });
                    }
                }
            }]
        }, {
            layout: "form",
            columnWidth: 0.3,
            items: [{
                xtype: "textfield",
                fieldLabel: "卡号[开始]",
                name: "CardNoBegin",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.3,
            items: [{
                xtype: "textfield",
                fieldLabel: "卡号[结束]",
                name: "CardNoEnd",
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
                    searchData();
                }
            }, {
                xtype: "button",
                style: "margin-left:10px",
                boxMinWidth: 40,
                width: 60,
                text: " 解锁",
                handler: function () {
                    lockCard();
                }
            }]
        }]

}]
});

var fm = Ext.form;
var sm = new Ext.grid.CheckboxSelectionModel();
var sm1 = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect:true
    },
    columns: [new Ext.grid.RowNumberer(),sm, {
        //id: "Title",
        header: 'ID',
        dataIndex: 'CardID',
        hidden:true,
        width: 100
    }, {
        //id: "Title",
        header: '部门',
        dataIndex: 'DeptName',
        width: 100
    }, {
        //id: "Title",
        header: '卡号',
        dataIndex: 'CardNo',
        width: 100,
        align: 'right'
    }, {
        header: "卡类型",
        dataIndex: "CardTypeName",
        //align: 'right',
        width: 120
    }, {
        header: "卡状态",
        dataIndex: "Status",
        //align: 'right',
        width: 120
    }, {
        header: "卡备注",
        dataIndex: "MemoInfo",
        //align: 'right',
        width: 200
    }, {
        header: "次卡套盒",
        dataIndex: "CardTypeCode",
        //align: 'right',
        width: 100,
        renderer: function (value, mdata, record) {
            if (value == 'JCK') {
                return "<a href='#' onclick='showJckWindow(" + record.data["CardID"] + ");'>计次卡套盒</a> ";
            }
            return "";
        }
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/CardMgr.aspx?actionName=queryUnlockedCard&queryType=2&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({ 
        record: 'CardInfo',
        idProperty: 'CardID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "CardID", mapping: "CardID" },
                { name: 'DeptName', mapping: 'DeptName' },
                { name: 'CardTypeName', mapping: 'CardTypeName' },
                { name: 'CardNo', mapping: 'CardNo' },
                { name: "Status", mapping: "Status" },
                { name: "MemoInfo", mapping: "MemoInfo" },
                { name: "CardTypeCode", mapping: "CardTypeCode" }
            ]
    }),
    listeners: {
        load: function (records, options, success) {
            if (records.data.length > 0) {
                if (records.data.items[0].json.msg != undefined) {
                    Ext.MessageBox.alert("提示", records.data.items[0].json.msg);
                    pd_store.remove(pd_store.getAt(0));
                    return;
                }
            }
        }
    }
    //sortInfo: { field: 'Code', direction: 'ASC' }
});
//

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    sm:sm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    loadMask: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 40,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});

pd_store.on('beforeload', function (thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    this.baseParams = pd_top_form.getForm().getValues();
    this.baseParams.start = 0;
    this.baseParams.limit = 40;
});


//==次卡窗口===//

function showJckWindow(cardid) {

    var win_Search = new Ext.Window({
        title: '计次卡',
        width: 600,
        height: 350,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        items: [jck_pd_grid],
        buttons: [
			{
			    text: '解锁',
			    handler: function () {
			        if (lockJck()) {
			            win_Search.hide();
			        }
			    }
			},
			{
			    text: '取消',
			    handler: function () {
			        win_Search.hide();
			    }
			}
        ],
        listeners: {
            'hide': function () {
            }
        }
    });
    win_Search.show();
    jck_pd_store.load({ "params": "cardID=" + cardid });
}
var jck_cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [new Ext.grid.RowNumberer(), sm1, {
        //id: "Title",
        header: 'CardID',
        dataIndex: 'CardID',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: 'JckInfoID',
        dataIndex: 'JckInfoID',
        hidden: true,
        width: 100
    }, {
        header: "套盒编号",
        dataIndex: "Code",
        //align: 'right',
        width: 100
    }, {
        header: "套盒名称",
        dataIndex: "Title",
        //align: 'right',
        width: 200
    }, {
        header: "总次数",
        dataIndex: "TotalCount",
        //align: 'right',
        width: 80
    }, {
        header: "剩余次数",
        dataIndex: "RemainCount",
        //align: 'right',
        width: 80
    }]
});
// create the Data Store
var jck_pd_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/CardMgr.aspx?actionName=queryUnlockedCard&queryType=2&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'JckCardInfo',
        idProperty: 'JckInfoID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "CardID", mapping: "CardID" },
                { name: 'JckInfoID', mapping: 'JckInfoID' },
                { name: 'JckTypeID', mapping: 'JckTypeID' },
                 { name: "CardTypeID", mapping: "CardTypeID" },
                 { name: "Code", mapping: "Code" },
                 { name: "Title", mapping: "Title" },
                { name: "TotalCount", mapping: "TotalCount" },
                { name: "RemainCount", mapping: "RemainCount" }
        ]
    })
    //sortInfo: { field: 'Code', direction: 'ASC' }
});
//

var jck_pd_grid = new Ext.grid.GridPanel({
    store: jck_pd_store,
    cm: jck_cm,
    sm: sm1,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

//==次卡窗口== end//

//===================function begin==============================//
/** 
* 查询数据
*/
function searchData() {
    var CardNoBegin = pd_top_form.getForm().findField("CardNoBegin").getValue().trim();
    var CardNoEnd = pd_top_form.getForm().findField("CardNoEnd").getValue().trim();
    if (CardNoBegin == "" && CardNoEnd == "") {
        Ext.MessageBox.alert("提示", "请至少输入一个卡号！");
        return;
    }
    pd_top_form.getForm()
    pd_store.load({
        params: {TypeId: pd_top_form.find('name', 'TypeId')[0].value }
    });
}

function lockCard() {
    if (!pd_grid.getSelectionModel().hasSelection()) {
        alert("请选择需要解锁的卡！");
        return;
    }
    var records = pd_grid.getSelectionModel().getSelections();
    var cardids = "";
    for (var i = 0; i < records.length; i++) {
        //alert(records[i].data.CardID);
        cardids += records[i].data.CardID + ";";
    }
    Ext.Msg.confirm('提示', "是否解锁选中卡？", function (btn) {
        if (btn == 'yes') {
            Ext.Ajax.request({
                url: '../Apis/CardMgr.aspx?actionName=unLockCard&sid=' + Sys.sid,
                params: { CardIDs: cardids },
                success: function (response, obt) {
                    var rs = Ext.decode(response.responseText);
                    Ext.Msg.alert('提示', rs.msg);
                    searchData();
                },
                failure: function (response, obt) {
                    var rs = Ext.decode(response.responseText);
                    Ext.Msg.alert('提示', rs.msg);
                }
            });
        }
    }
    );
}

//锁 计次卡
function lockJck() {
    if (!jck_pd_grid.getSelectionModel().hasSelection()) {
        alert("请选择需要锁定的卡！");
        return false;
    }
    var records = jck_pd_grid.getSelectionModel().getSelections();
    var cardids = "";
    var cardid = "";
    for (var i = 0; i < records.length; i++) {
        //alert(records[i].data.CardID);
        cardid = records[i].data.CardID;
        cardids += records[i].data.JckInfoID + ";";
    }
    Ext.Msg.confirm('提示', "是否解锁选中卡？", function (btn) {
        if (btn == 'yes') {
            Ext.Ajax.request({
                url: '../Apis/CardMgr.aspx?actionName=unLockCard&sid=' + Sys.sid,
                params: { CardIDs: cardids, CardID: cardid },
                success: function (response, obt) {
                    var rs = Ext.decode(response.responseText);
                    Ext.Msg.alert('提示', rs.msg);
                    searchData();
                    return true;
                },
                failure: function (response, obt) {
                    var rs = Ext.decode(response.responseText);
                    Ext.Msg.alert('提示', rs.msg);
                }
            });
        }
    }
    );
    return true;
}
//===================function end==============================//

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
        anchor: '-1 -110',
        items: [pd_grid]
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();
