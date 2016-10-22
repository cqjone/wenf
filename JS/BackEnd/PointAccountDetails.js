//查询积分流水
var customer_f = new End.customer_formPanel();

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
                fieldLabel: "身份证号码",
                name: "idNo",
                anchor: "100%"
            },
            {
                xtype: "datefield",
                fieldLabel: "开始日期",
                name: "dateBegin",
                //emptyText: DateToString((new Date()).add("y",-1)),
                anchor: "100%"
            },{
                xtype:"textfield",
                fieldLabel:"卡号",
                name:"card",
                anchor:"100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "手机号码",
                name: "mobileNo",
                anchor: "100%"
            }, {
                xtype: "datefield",
                fieldLabel: "结束日期",
                name: "dateEnd",
                //emptyText:DateToString(new Date()),
                anchor: "100%"
            }]
        }, {
            layout: "form",
            bodyStyle: "margin:0 5px",
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    search();
                }
            }]
        }]

    }]
});

function search() {
    pd_store.removeAll();
    customer_f.getForm().reset();
    var data = pd_top_form.getForm().getValues();
    pd_store.load({
        params:data
    });
    //store.loadData(myData);
}

var fm = Ext.form;

//定义列
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        //id: "Code",
        header: '日期',
        dataIndex: 'BllDate',
        width: 130 ,
        renderer: function (v) {
            return DateToString(ConvertJSONDateToJSDateObject(v));
        }
    }, {
        //id: "Title",
        header: '类型',
        dataIndex: 'ActionType',
        width: 140 
    }, {
        //id: "Title",
        header: '积分数量',
        dataIndex: 'PointCount',
        width: 140,
        align: 'right'
    }, {
        header: "摘要",
        dataIndex: "Summary",
        width: 300 
    }]
});
// create the Data Store
var pd_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed
    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointRules.aspx?actionName=getPointHistory&sid='+Sys.sid,

    // specify a XmlReader (coincides with the XML format of the returned data)
    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        root: 'msg',
        totalProperty: 'results',
        fields: [
                //{ name: "ID", mapping: "ID" },
                { name: 'ActionType', mapping: 'ActionType' },
        // map Record's 'job' field to data object's 'occupation' key
                {name: 'BllDate', mapping: 'BillDate' },
                { name: "PointCount", mapping: "PointCount" },
                { name: "Summary" }
            ]
    }),

    sortInfo: { field: 'BllDate', direction: 'ASC' }
});

pd_store.on('load', function (store, records) {
    //alert("load...");
    //加载成功后，读取客户信息
    customer_f.load({
        params: pd_top_form.getForm().getValues()
    });
    if (store.getCount() == 0) {
        Ext.MessageBox.alert("提醒", "该用户没有积分流水信息");
    };
});

pd_store.on("loadexception", function (mis) {
   
    Ext.MessageBox.alert("提醒", "没有该积分账户！");
    pd_store.removeAll();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 

    loadMask: true
});

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
        items: [pd_top_form, customer_f]
    }, {
        layout:"fit",
        border: false,
        anchor: '-1 -170',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
