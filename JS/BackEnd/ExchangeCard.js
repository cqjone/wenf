//转卡报表
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
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "开始日期",
                name: "BeginDate",
                value: new Date(),
                emptyText: DateToString(new Date()),
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "店铺",
                name: "deptNo",
                id: "deptNo",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "ID",
                name: "MyId",
                hidden: true,
                id: "MyId",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "结束日期",
                name: "EndDate",
                value: DateToString(new Date()),
                emptyText: DateToString(new Date()),
                anchor: "100%"
            }, {
                layout: "hbox",
                bodyStyle: "margin:0 50px",
                columnWidth: 0.2,
                items: [{
                    xtype: "button",
                    boxMinWidth: 60,
                    width: 60,
                    text: " 选择店铺 ",
                    handler: function () {
                        SelectDeptWindow.show();
                        //ptree.getRootNode().reload();
                    }
                }]
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            columnWidth: 0.2,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    var endDate = pd_top_form.find("name", "EndDate")[0].getValue();
                    var beginDate = pd_top_form.find("name", "BeginDate")[0].getValue();
                    var Ids = document.getElementById("MyId").value;
                    var arr = new Array();
                    arr = Ids.split(" "); //字符分割
                    /*pd_store.load({
                    params: { arr: arr }
                    });*/
                    var a = "";
                    for (i = 0; i < arr.length - 1; i++) {
                        a = a + arr[i] + ",";    //分割后的字符输出
                    }
                    var deptID = a.substring(0, a.length - 1);
                    store.load({
                        params: { EndDate: endDate, BeginDate: beginDate, deptNo: deptID }
                    })
                }
            }]
        }]
    }]
});
var store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/ExchangeCard.aspx?actionName=getExchangeCard&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: 'MyDate', mapping: "BillDate" },
                { name: "DeptName", mapping: "Title" },
                { name: "ExchangePirce", mapping: "TransferMoney" },
                { name: "ExchangeCount", mapping: "Count" },
                { name: "ID", mapping: "DeptID" }
            ]
    })
})
store.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "未查到数据!");
    store.removeAll();
});

//权限树
var ptree = new Ext.tree.TreePanel({
    dataUrl: '../Apis/Dept.aspx?actionName=GetDeptTitle&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    value: id,
    autoScroll: true,
    //rootVisible: false, //是否显示根节点    
    root: {
        checked: false,
        expanded: true,
        nodeType: 'async',
        text: "门店全选"
    }
});


ptree.on('checkchange', function (node, checked) {
    if (checked) {
        var str = document.getElementById("deptNo").value;
        var txt = node.text;
        if (str.indexOf(txt) < 0 && txt != "门店全选") {
            str = str + txt + " ";
        }
        document.getElementById("deptNo").value = str;

        var myid = document.getElementById("MyId").value;
        var did = node.id;
        if (myid.indexOf(did) < 0 && !isNaN(did)) {
            myid = myid + did + " ";
            document.getElementById("MyId").value = myid;
        };

    } else {
        var str = document.getElementById("deptNo").value;
        var txt = node.text;
        str = str.replace(txt + " ", "")
        document.getElementById("deptNo").value = str;

        var myid = document.getElementById("MyId").value;
        var did = node.id;
        myid = myid.replace(did + " ", "");
        document.getElementById("MyId").value = myid;
    }
    if (node.hasChildNodes()) {
        node.eachChild(function (child) {
            child.ui.toggleCheck(checked);
            child.attributes.checked = checked;
            child.fireEvent('checkchange', child, checked); //递归调用
        });
    }

    var str = document.getElementById("deptNo").value;
    if (str == "") {
        document.getElementById("MyId").value = "";
    }
});
//选择店铺
var SelectDeptWindow = new Ext.Window({
    layout: 'fit',
    width: 400,
    height: 300,
    modal: true,
    closeAction: 'hide',
    title: "店铺选择",
    items: [ptree]
});

var clickGrid_top_From = new Ext.form.FormPanel({
    //    frame: true,
    //    bodyBorder: false,
    //    border: false,
    //    autoScroll: true,
    //    // width:700,
    //    // heigh: 100,
    //    //autoWidth:true,
    reader: new Ext.data.JsonReader({
        //root: "data",
        fields: [
        { name: "billDate", mapping: "BillDate", type: "date", convert: ConvertJSONDateToJSDateObject, format: "Y-m-d" },
        { name: "deptNo2", mapping: "Title" },
        { name: "deptPhone", mapping: "Tel"}]
    }),
    defaults: { labelAlign: "right", width: 100 },
    layout: "column",
    items: [{ xtype: "textfield",
        fieldLabel: "ID",
        name: "ID",
        hidden: true,
        anchor: "100%"
    }, {
        layout: "form",
        columnWidth: 0.2,
        items: [{
            xtype: 'datefield',
            fieldLabel: '转卡日期',
            name: "billDate",
            anchor: '95%',
            allowBlank: false,
            readOnly: true,
            format: "Y-m-d"
        }]
    }, {
        layout: "form",
        columnWidth: 0.17,
        items: [{
            xtype: "textfield",
            fieldLabel: "店铺",
            name: "deptNo2",
            readOnly: true,
            anchor: "100%"
        }]
    }, {
        layout: "form",
        columnWidth: 0.18,
        items: [{
            xtype: "textfield",
            fieldLabel: "店铺电话",
            name: "deptPhone",
            readOnly: true,
            anchor: "100%"
        }]
    }, {
        layout: "form",
        columnWidth: 0.2,
        items: [{
            xtype: "combo",
            fieldLabel: "类 型",
            anchor: "100%",
            triggerAction: 'all',
            hiddenName: "Type",
            editable: false,
            mode: 'local',
            value: "全部",
            store: new Ext.data.ArrayStore({
                fields: ['myId', 'displayText'],
                data: [
                        ["1", "全部"],
                        ["2", "已审批"],
                        ["3", "未审批"]
                    ]
            }),
            valueField: 'myId',
            displayField: 'displayText'
        }]
    }, {
        layout: "form",
        bodyStyle: "margin:0 5px",
        columnWidth: 0.17,
        items: [{
            xtype: "button",
            boxMinWidth: 40,
            width: 60,
            text: " 查  询",
            handler: function () {
                var id = clickGrid_top_From.find("name", "ID")[0].getValue();
                var date = clickGrid_top_From.find("name", "billDate")[0].getValue();
                var type = clickGrid_top_From.find("hiddenName", "Type")[0].getValue();
                pd_store_window.load({
                    params: { ID: "", BillDate: "", Type: type, Time: date, TypeID: id }
                });
            }
        }]
    }]
});

var pd_store_window = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/ExchangeCard.aspx?actionName=getDetails&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
            { name: "ExchangeDate", mapping: "BillDate" },
            { name: "ExchangePirce", mapping: "TransferMoney" },
            { name: "ExchangeVerifyCode", mapping: "VerifyCode" },
            { name: "CardOut", mapping: "SrcCardNo" },
            { name: "CardTypeOut", mapping: "Title" },
            { name: "YuEOut", mapping: "Price" },
            { name: "UserNameOut", mapping: "SrcCustomerName" },
            { name: "CardMemoOut", mapping: "MemoInfo" },
            { name: "Card", mapping: "TargetCardNo" },
            { name: "CardType", mapping: "CardTypeTitle" },
            { name: "YuE", mapping: "TargetCardBalance" },
            { name: "UserName", mapping: "CustomerName" },
            { name: "CardMemo", mapping: "TargetCardMemoInfo" }
        ]
    })
});
pd_store_window.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "未查到数据!");
    pd_store_window.removeAll();
});
var datacm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true
    },
    columns: [
                { header: '', dataIndex: 'ExchangeDate', width: 80, renderer: function (v) {
                    return DateToString(ConvertJSONDateToJSDateObject(v));
                }
                },
                { header: '', dataIndex: 'ExchangePirce', width: 80 },
                { header: '', dataIndex: 'ExchangeVerifyCode', width: 80 },
                { header: '', dataIndex: 'CardOut', width: 85 },
                { header: '', dataIndex: 'CardTypeOut', width: 85 },
                { header: '', dataIndex: 'YuEOut', width: 85 },
                { header: '', dataIndex: 'UserNameOut', width: 85 },
                { header: '', dataIndex: 'CardMemoOut', width: 85 },
                { header: '', dataIndex: 'Card', width: 83 },
                { header: '', dataIndex: 'CardType', width: 85 },
                { header: '', dataIndex: 'YuE', width: 85 },
                { header: '', dataIndex: 'UserName', width: 85 },
                { header: '', dataIndex: 'CardMemo', width: 85}]
});


var group = new Ext.ux.grid.ColumnHeaderGroup({
    rows: [
                [
                    { rowspan: 1 },
                    { rowspan: 1 },
                    { rowspan: 1 },
                    { colspan: 5, align: 'center', header: '<B>     转&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp出</B>' },
                    { colspan: 5, align: 'center', header: '<B>     转&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp入</B>' }
                ],
                [

                    { header: '时间', align: 'center' },
                    { header: '转卡金额', align: 'center' },
                    { header: '验证码', align: 'center' },
                    { header: '卡号', align: 'center' },
                    { header: '卡类型', align: 'center' },
                    { header: '转后余额', align: 'center' },
                    { header: '客户姓名', align: 'center' },
                    { header: '卡备注', align: 'center' },
                    { header: '卡号', align: 'center' },
                    { header: '卡类型', align: 'center' },
                    { header: '转后余额', align: 'center' },
                    { header: '客户姓名', align: 'center' },
                    { header: '卡备注', align: 'center' }

                ]
            ]
});

var datagrid = new Ext.grid.EditorGridPanel({
    height: 400,
    headerAsText: false,
    stripeRows: true,
    store: pd_store_window,
    cm: datacm,
    loadMask: true,
    viewConfig: {
        forceFit: true
    },
    plugins: group
});

var action_main_panel = new Ext.Panel({
    border: false,
    layout: "anchor",
    items: [{
        frame: true,
        layout: "fit",
        border: false,
        items: [clickGrid_top_From]
    }, {
        layout: "fit",
        frame: true,
        border: false,
        anchor: '1 1',
        items: [datagrid]
    }]
});

//双击表格Window
var click_grid_Window = new Ext.Window({
    layout: 'fit',
    width: 1100,
    height: 400,
    modal: true,
    closeAction: 'hide',
    title: "转卡详细信息",
    plain: true,
    items: [action_main_panel]
});

//定义列
var cm = new Ext.grid.ColumnModel({
    columns: [new Ext.grid.RowNumberer(),
    {
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    },
     {
         header: '日期',
         dataIndex: 'MyDate',
         width: 130
     }, {
         header: '店铺',
         dataIndex: 'DeptName',
         width: 130
     }, {
         header: '转卡次数',
         dataIndex: 'ExchangeCount',
         width: 100
     }, {
         header: '转卡金额',
         dataIndex: 'ExchangePirce',
         width: 100
     }]
});

var pd_grid = new Ext.grid.GridPanel({
    store: store,
    stripeRows: true,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true
});
//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    id = r.get("ID");
    clickGrid_top_From.find("name", "ID")[0].setValue(id);
    billDate = r.get("MyDate");
    pd_store_window.load({
        params: { ID: id, BillDate: billDate ,Type:"",TypeID:"",Time:""}
    });
    clickGrid_top_From.load({
        url: "../Apis/ExchangeCard.aspx?actionName=getBase&sid=" + Sys.sid,
        params: { ID: id, BillDate: billDate },
        waitMsg: "加载中....."
    });
    click_grid_Window.show();
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