//积分使用情况报表

// utilize custom extension for Hybrid Summary
var summary = new Ext.ux.grid.GridSummary();

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
            columnWidth: 0.37,
            items: [{
                xtype: "datefield",
                fieldLabel: "开始日期",
                name: "BeginTime",
                value: new Date(),
                emptyText:DateToString(new Date()),
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.37,
            items: [{
                xtype: "datefield",
                fieldLabel: "结束日期",
                value: new Date(),
                name: "EndTime",
                emptyText: DateToString(new Date()),
                anchor: "100%"
            }]
        }, /*{
            layout: "form",
            columnWidth: 0.3,
            items: [{
                xtype: 'combo',
                fieldLabel: '门店',
                hiddenName: 'MenDian',
                store: deptStore,
                forceSelection: true,
                //typeAhead: true,
                triggerAction: "all",
                editable: false,
                displayField: "Title",
                valueField: "ID",

                mode: 'remote'

                
                xtype: 'textfield',
                fieldLabel: '门店',
                name: 'MenDian',
                anchor: '100%'
            }]
        }, */{
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 50,
                text: " 查  询",
                handler: function () {
                    var BeginTime = pd_top_form.find("name", "BeginTime")[0].getValue();
                    var EndTime = pd_top_form.find("name", "EndTime")[0].getValue();
                    //var MenDian = pd_top_form.find("name", "MenDian")[0].getValue();

                    pd_store.load({
                        params: { BeginTime: BeginTime, EndTime: EndTime /*, MenDian: MenDian*/ }
                    });
                    Ext.getCmp('btn1').setDisabled(false); //把生成验证码变成可用
                }
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 20px",
            columnWidth: 0.16,
            items:
            [{
                xtype: "button",
                boxMinWidth: 60,
                width: 80,
                id: "btn1",
                disabled: true,
                text: "导出Excel",
                handler: function () {
                    toExcel();
                }
            }]
        }]

    }]
});
//积分使用情况导出
function toExcel() {
    //Ext.MessageBox.wait("正在导出，请稍候。","消息");
    pd_main_panel.body.mask("正在导出，请稍候。");

    Ext.Ajax.request({
        params: { begindate: pd_top_form.find("name", "BeginTime")[0].getValue(), enddate: pd_top_form.find("name", "EndTime")[0].getValue() },
        url: "../Apis/ToExcel.aspx?actionName=rPointUseToExcle&sid=" + Sys.sid,
        success: function (response) {
           pd_main_panel.body.unmask();
            var result = Ext.util.JSON.decode(response.responseText);
            if (result.success) {
                window.open("../Temp/" + result.msg);
            } else {
                Ext.Msg.alert("警告", "导出失败！请稍后再试！");
            }
        },
        failure: function (response) {
            Ext.Msg.alert("警告", "导出失败！请稍后再试！");
            pd_main_panel.body.unmask();
        }
    })
}

var fm = Ext.form;

var renderSummary = function (o, cs, cm) {
    return '合计：';
}

//定义 勾选框SM
//var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    {
       
        header: '分部',
        dataIndex: 'DeptName',
        width: 130,
        summaryRenderer: renderSummary
    }, {
        header: '上期结存积分',
        dataIndex: 'LastBalance',
        summaryType: "sum",
        //formatFloat(1.222222222, 2)
        width: 130
    }, {
        header: '本期增加积分',
        dataIndex: 'CurrentAdd',
        summaryType:"sum",
        width: 130
    }, {
        header: '本期已兑换积分',
        dataIndex: 'CurrentReduction',
        summaryType: "sum",
        width: 130
    }, {
        header: '期末结存积分',
        dataIndex: 'CurrentBalance',
        summaryType: "sum",
        width: 130
    }]
});
function formatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/PointUse.aspx?actionName=GetData&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'plant',
        totalProperty: 'results',
        fields: [
                { name: "DeptName", mapping: "DeptName" },
                { name: 'LastBalance', mapping: 'LastBalance',type: 'float',convert:function formatFloat(val){return Number(Number(val).toFixed(2));}},
                { name: 'CurrentAdd', mapping: 'CurrentAdd', type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } },
                { name: "CurrentReduction", mapping: "CurrentReduction", type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } },
                { name: "CurrentBalance", mapping: "CurrentBalance", type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } }
            ]
    })
});


var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true,
    plugins: summary
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