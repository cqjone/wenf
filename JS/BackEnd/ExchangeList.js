//兑换物品清单

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
                fieldLabel: "客户姓名",
                name: "CustomerName",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "身份证号码",
                name: "idNo",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "预约时间",
                value: new Date(),
                name: "ReservationDate",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "手机号码",
                name: "mobileNo",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 10px",
            columnWidth: 0.2,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    var customername = pd_top_form.find("name", "CustomerName")[0].getValue();
                    var reservationdate = pd_top_form.find("name", "ReservationDate")[0].getValue();
                    var idno = pd_top_form.find("name", "idNo")[0].getValue();
                    var mobile = pd_top_form.find("name", "mobileNo")[0].getValue();

                    pd_store.load({
                        params: { idNo: idno, mobileNo: mobile, customerName: customername, reservationDate: reservationdate }
                    });
                }
            }
            ]
        }]

    }]
});

var fm = Ext.form;

//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true     
    },
    columns: [new Ext.grid.RowNumberer(),
    {
    header: '客户姓名',
    dataIndex: 'CustomerName',
    width: 110
}, {
    header: '预约时间',
    dataIndex: 'ReservationDate',
    width: 100,
    renderer: function (v) {
        return DateToString(ConvertJSONDateToJSDateObject(v));
    }
}, {
    header: '手机号码',
    dataIndex: 'MobileNo',
    width: 110
},  {
    header: '物品名称',
    dataIndex: 'OnlineName',
    width: 110
}, {
    header: '物品类型',
    dataIndex: 'ExcTargetType',
    width: 110,
    renderer: function (v, mdata, record) {
        return ExchangeTargetTypeDataStore.getById(v).get("name");
    }
}, {

    header: "数量",
    dataIndex: "Quantity",
    width: 110,
    align: 'right'
}, {

    header: "积分数量",
    dataIndex: "TotalCount",
    width: 110,
    align: 'right'
}, {
    header: "操作",
    align: "center",
    renderer: function () {
        return "<a href='#' onclick=''>查 看</a>";
    }
}
    ]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //url: '../Apis/PointExchange.aspx?actionName=getUnexchange&sid=' + Sys.sid,
    url:'',

    reader: new Ext.data.JsonReader({
        record: 'plant',
        totalProperty: 'results',
        fields: [
                    { name: 'ReservationDate', mapping: 'ReservationDate' },
                    { name: 'Quantity', mapping: 'Quantity' },
                    { name: "TotalCount", mapping: "TotalCount" },
                    { name: "CustomerName", mapping: "CustomerName" },
                    { name: 'MobileNo', mapping: 'MobileNo' },
                    { name: "OnlineName", mapping: "OnlineName" },
                    { name: "ExcTargetType", mapping: "ExcTargetType" }
            ]
    })
});

//定义 勾选框SM
var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    frame: true,
    margins: "2 2 2 2",
    border: false,
    sm: sm,
    loadMask: true
});

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
