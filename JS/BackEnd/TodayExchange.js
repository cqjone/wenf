//当日积分兑换
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
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "手机号码",
                name: "mobileNo",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 100,
            columnWidth: 0.2,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    var todaydate = new Date().dateFormat('Y-m-d');
                    //alert(TodayDate);
                    var idno = pd_top_form.find("name", "idNo")[0].getValue();
                    var mobile = pd_top_form.find("name", "mobileNo")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { idNo: idno, mobileNo: mobile, todayDate:todaydate }
                    });
                }
            }
            ]
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
        header: '客户姓名',
        dataIndex: 'CustomerName',
        width: 130
    }, {
        header: '礼品类型',
        dataIndex: 'ExcTargetType',
        width: 170
       
    }, {
        header: '礼品名称',
        dataIndex: 'OnlineName',
        width: 130
    }, {

        header: "礼品数量",
        dataIndex: "Quantity",
        width: 130,
        align: 'right'
    }, {

        header: "积分数量",
        dataIndex: "TotalCount",
        width: 130,
        align: 'right'
    }]
});



var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //url: '../Apis/PointExchange.aspx?actionName=getUnexchange&sid=' + Sys.sid,
    url:'../Apis/TodayExchange.aspx?actionName=GetDataByToday&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'plant',
        totalProperty: 'results',
        fields: [
                { name: 'Quantity', mapping: 'Quantity' },
                { name: "TotalCount", mapping: "TotalCount" },
                { name: "CustomerName", mapping: "CustomerName" },
                { name: "OnlineName", mapping: "OnlineName" },
                { name: "ExcTargetType", mapping: "ExcTargetType" }
            ]
    })
});
pd_store.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "未查到数据!");
    pd_store.removeAll();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
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