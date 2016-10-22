//补录
function arrayToJson(o) {
    var r = [];
    if (typeof o == "string") return "\'" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\'";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push(i + ":" + arrayToJson(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(arrayToJson(o[i]));
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}
//获取当月天数
function getLastDay(year, month) {
    var new_year = year;    //取当前的年份         
    var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）         
    if (month > 12)            //如果当前大于12月，则年份转到下一年         
    {
        new_month -= 12;        //月份减         
        new_year++;            //年份增         
    }
    var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天         
    var date_count = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月的天数       
    return date_count;
}

//===================年份和月份Store========================//
var newyear = new Date().getFullYear(); //这是为了取现在的年份数
var yearlist = [];
for (var i = newyear; i >= 1900; i--) {
    yearlist.push([i, i]);
}
var yearModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: []
});
this.yearModelStore.loadData(yearlist);
var monthModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            ["10", "10"],
            ["11", "11"],
            ["12", "12"]]
});


var dept_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=getDept&sid=' + Sys.sid,
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
    autoScroll: false,
    fileUpload: true,
    frame: true,
    labelWidth: 50,
    labelAlign: 'right',
    id: 'form1',
    heigh: 120,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 40 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            columnWidth: 1,
            layout: 'hbox',
            items: [{
                xtype: "label",
                html: '读取Excel：',
                style: {
                    marginTop: '3px'
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: '文件路径',
                name: 'importExcel',
                id: 'importExcel',
                inputType: 'file',
                width: 250,
                allowBlank: false
            }, {
                xtype: "button",
                boxMinWidth: 40,
                id: 'btnAdd',
                style: "margin-left:0px;",
                width: 60,
                text: " 读 取 ",
                handler: function () {
                    ImportData();
                }
            }, {
                xtype: "label",
                html: '<a href="../../ExcelTemplate/物流模板.xls" style="margin-top:\'10px\';">下载模板</a>',
                style: {
                    marginLeft: '10px'
                }
            }]
        }, {
            layout: "form",
            columnWidth: 1,
            items: [{
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    padding: '10 0 4 20',
                    pack: 'start'
                },
                items: [{
                    xtype: "label",
                    html: '门  店：',
                    style: {
                        marginLeft: '3px'
                    }
                }, {
                    xtype: "combo",
                    name: "DeptId",
                    hiddenName: "DeptId",
                    anchor: "100%",
                    triggerAction: 'all',
                    store: dept_store,
                    valueField: 'ID',
                    width: 150,
                    displayField: 'Title',
                    disabled: true,
                    enableKeyEvents: true,
                    selectOnFocus: true,
                    allowBlank: true,
                    forceSelection: true,
                    listeners: {
                        "keyup": function (v) {
                            dept_store.load({
                                params: { dName: v.getRawValue() }
                            });
                        }
                    }
                },{
                    xtype: "combo",
                    name: "comboYear",
                    store: yearModelStore,
                    hiddenName: "comboYear",
                    style: {
                        marginLeft: '10px'
                    },
                    width: 80,
                    margin: '0 0 0 30',
                    mode: 'local',
                    triggerAction: 'all',
                    valueField: 'ID',
                    displayField: 'Title',
                    disabled: true,
                    editable: false,
                    listeners: {
                        select: function () {
                            //pd_store.reload({ params: { queryYear: pd_top_form.getForm().findField("comboYear").getValue(), queryMonth: pd_top_form.getForm().findField("comboMonth").getValue()} });
                        }
                    }
                }, {
                    xtype: "label",
                    html: '&nbsp;&nbsp;年&nbsp;',
                    style: {
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "combo",
                    fieldLabel: "",
                    hiddenName: "comboMonth",
                    store: monthModelStore,
                    style: {
                        marginLeft: '10px'
                    },
                    name: "comboMonth",
                    editable: false,
                    disabled: true,
                    hideLabel: true,
                    width: 40,
                    anchor: "100%",
                    mode: 'local',
                    valueField: "ID",
                    displayField: "Title",
                    triggerAction: "all",
                    listeners: {
                        select: function () {
                            //pd_store.reload({ params: { queryYear: pd_top_form.getForm().findField("comboYear").getValue(), queryMonth: pd_top_form.getForm().findField("comboMonth").getValue()} });
                        }
                    }
                }, {
                    xtype: "label",
                    html: '&nbsp;&nbsp;月',
                    style: {
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "button",
                    boxMinWidth: 40,
                    id: 'btnImportExcelSave',
                    disabled: true,
                    style: "margin-left:25px;",
                    width: 60,
                    text: " 保  存",
                    handler: function () {
                        SaveData();
                    }

                }]
            }]
        }]
    }]
});
pd_top_form.getForm().findField('comboYear').setValue(newyear);
pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);


//var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [{
        header: '产品名称',
        align:'center',
        dataIndex: 'Title',
        width: 200,
        editor: new Ext.form.TextField({
            allowDecimals: false,
            allowNegative: false,
            allowBlank:false
        })
    }, {
        header: '入库',
        dataIndex: "TotalPurchase",
        align:'right',
        width: 140,
        editor: new Ext.form.NumberField({
            allowDecimals: false,
            allowNegative: false,
            allowBlank:false,  
            minValue: 0, //最小可输入的数值   
            minText: '请输入大于0的整数!', //超过最大值时候的提示信息,配合minValue 一起使用   
            nanText: '请输入大于0的整数!'
        })
    }, {
        header: "出库",
        dataIndex: "TotalSell",
        align:'right',
        width: 140,
        editor: new Ext.form.NumberField({
            allowDecimals: false,
            allowNegative: false,
            allowBlank:false,  
            minValue: 0, //最小可输入的数值   
            minText: '请输入大于0的整数!', //超过最大值时候的提示信息,配合minValue 一起使用   
            nanText: '请输入大于0的整数!'
        })
    }, {
        header: "库存",
        dataIndex: "Inventory",
        align:'right',
        width: 140,
        editor: new Ext.form.NumberField({
            allowDecimals: false,
            allowNegative: false,
            allowBlank:false,  
            minValue: 0, //最小可输入的数值   
            minText: '请输入大于0的整数!', //超过最大值时候的提示信息,配合minValue 一起使用   
            nanText: '请输入大于0的整数!'
        })
    }]
});

var oldData;
// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: false,
    url: '',
    //baseParams: { sid: Sys.sid, queryYear: pd_top_form.getForm().findField("comboYear").getValue(), queryMonth: pd_top_form.getForm().findField("comboMonth").getValue() },
    reader: new Ext.data.JsonReader({
        record: 'MakeupInfo',
        idProperty: 'ID',
        root: 'results',
        fields: [
                { name: "Title", mapping: "Title" },
                { name: "TotalPurchase", mapping: "TotalPurchase" },
                { name: "TotalSell", mapping: "TotalSell" },
                { name: "Inventory", mapping: "Inventory" }
            ]
    })
});
var pd_grid = new Ext.grid.EditorGridPanel({
    store: pd_store,
    //selModel:MultiCellSelectionModel,
    columnLines:true,
    cm: cm,
    //sm: sm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true
});



function ImportData() {
    if (Ext.getCmp('importExcel').getValue() == "") {
        Ext.Msg.alert("提示", "请选择Excel!");
        return;
    }
    pd_top_form.getForm().submit({
        waitMsg: "正在上传，请稍候...",
        url: '../Apis/ImportCommonDetailExcel.aspx?actionName=ImportExcel&sid=' + Sys.sid,
        method: "post",
        success: function (form, response, action) {
            var data = Ext.decode(response.response.responseText);
            pd_store.loadData(data);
            pd_top_form.getForm().findField("comboYear").setDisabled(false);
            pd_top_form.getForm().findField("comboMonth").setDisabled(false);
            pd_top_form.getForm().findField("DeptId").setDisabled(false);
            Ext.getCmp('btnImportExcelSave').setDisabled(false);
        },
        failure: function (form, action) {
            Ext.Msg.alert("提示", "服务器异常!");
        }
    });
}

function SaveData() {
    
    var searchYear = pd_top_form.find('name', 'comboYear')[0].value;
    var searchMonth = pd_top_form.find('name', 'comboMonth')[0].value;
    var DeptID = pd_top_form.find('name', 'DeptId')[0].value;
    if (DeptID == null) {
        Ext.Msg.alert("提示", "请选择门店!");
        return;
    }
    if (Ext.getCmp('importExcel').getValue() == "") {
        Ext.Msg.alert("提示", "请选择Excel!");
        return;
    }
    var records = pd_store.data.items;
    var array = new Array();
    for (var i = 0; i < records.length; i++) {
        array.push(records[i].data);
    }
    var data = Ext.encode(array);
    Ext.getBody().mask("正在保存！请稍候！");
    Ext.Ajax.request({
        url: '../Apis/ImportCommonDetailExcel.aspx?actionName=Save&sid=' + Sys.sid,
        params: { records: data, searchYear: searchYear, searchMonth: searchMonth, DeptID: DeptID },
        success: function (response, options) {
            var data = Ext.decode(response.responseText);
            if (!data.success) {
                Ext.Msg.alert("提示", data.msg);
                Ext.getBody().unmask();
                return;
            } else {
                Ext.Msg.alert("提示", data.msg);
            }
            pd_store.removeAll();
            pd_top_form.getForm().findField("comboYear").setDisabled(true);
            pd_top_form.getForm().findField("comboMonth").setDisabled(true);
            pd_top_form.getForm().findField("DeptId").setDisabled(true);
            Ext.getCmp('btnImportExcelSave').setDisabled(true);
            Ext.getCmp('importExcel').setValue("");
            Ext.getBody().unmask();
        }, failure: function (response, options) {
            Ext.getBody().unmask();
        }
    });
}

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 106,
        layout: "fit",
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        region: 'center',
        border: false,
        anchor: '-1 -140',
        items: [pd_grid]
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();
