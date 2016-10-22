﻿var wl_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/VerifyCode.aspx?actionName=getDept&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "ID",
            mapping: "ID"
        }, {
            name: "Title",
            mapping: "Title"
        }]
    }),
    sortInfo: {
        field: 'ID',
        direction: 'ASC'
    }
});

var tar_dept = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getDept&Type=1&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "CombineWord",
            mapping: "CombineWord"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'CombineWord',
        direction: 'ASC'
    }
})
var wlYearStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["2014", "2014"],
        ["2015", "2015"],
        ["2016", "2016"],
        ["2017", "2017"],
        ["2018", "2018"],
        ["2019", "2019"],
        ["2020", "2020"],
        ["2021", "2021"],
        ["2022", "2022"],
        ["2023", "2023"],
        ["2024", "2024"]
    ]
});

var wlMonthStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["1", "一月"],
        ["2", "二月"],
        ["3", "三月"],
        ["4", "四月"],
        ["5", "五月"],
        ["6", "六月"],
        ["7", "七月"],
        ["8", "八月"],
        ["9", "九月"],
        ["10", "十月"],
        ["11", "十一月"],
        ["12", "十二月"]
    ]
});

//物料登记
var id = 0;
var pd_top_form = new Ext.form.FormPanel({

    height: 70,
    labelWidth: 50,
    labelAlign: 'right',
    items: [{
        xtype: 'fieldset',
        title: '查询条件',
        layout: 'column',
        items: [{
                layout: 'form',
                columnWidth: 0.25,
                items: [{
                    xtype: "combo",
                    name: "DeptID",
                    hiddenName: "DeptID",
                    fieldLabel: "门 店",
                    store: tar_dept,
                    triggerAction: 'all',
                    width: 170,
                    border: 1,
                    valueField: 'ID',
                    displayField: 'CombineWord',
                    enableKeyEvents: true,
                    selectOnFocus: true,
                    allowBlank: true,
                    forceSelection: true,
                    hideTrigger: true,
                    listeners: {
                        "keyup": function(v) {
                            var value = v.getRawValue();
                            if (value != null && value.length >= 1) {
                                tar_dept.load({
                                    params: {
                                        key: v.getRawValue()
                                    }
                                });
                                tar_store.load({
                                    params: {
                                        dName: v.getRawValue()
                                    }
                                });
                            }
                        }
                    },
                    style: {
                        marginLeft: '3px'

                    }
                }]
            }, {
                layout: 'form',
                columnWidth: 0.25,
                items: [{
                    xtype: 'combo',
                    fieldLabel: '年 份',
                    name: 'Year',
                    editable: false,
                    selectOnFocus: true,
                    forceSelection: true,
                    mode: 'local',
                    store: wlYearStore,
                    displayField: "Title",
                    valueField: "ID",
                    triggerAction: "all",
                    anchor: '90%',
                    allowBlank: true,
                    value: new Date().getFullYear()
                }]
            }, {
                layout: 'column',
                columnWidth: 0.25,
                items: [{
                    xtype: 'combo',
                    fieldLabel: '月 份',
                    name: 'Month',
                    editable: false,
                    selectOnFocus: true,
                    forceSelection: true,
                    mode: 'local',
                    store: wlMonthStore,
                    displayField: "Title",
                    valueField: "ID",
                    triggerAction: "all",
                    anchor: '90%',
                    allowBlank: true,
                    value: new Date().getMonth() + 1
                }]
            },
            {
                columnWidth: 0.12,
                style: 'margin-left:1em;',
                layout: 'column',
                items: [{
                    xtype: 'button',
                    text: " 查  询",
                    width: 70,
                    columnWidth: 0.25,
                    handler: function() {
                        var DeptID = pd_top_form.find('name', 'DeptID')[0].value;
                        var Month = pd_top_form.find('name', 'Month')[0].value;
                        var Year = pd_top_form.find('name', 'Year')[0].value;
                        pd_store.removeAll();
                        pd_store.load({
                            params: {
                                DeptID: DeptID,
                                Year: Year,
                                Month: Month
                            }
                        });
                    }
                },{
                    xtype: 'button',
                    style:"margin-left:1em",
                    text: " 导出为Excel ",
                    width: 90,
                    columnWidth: 0.3,
                    handler: function() {
                        var DeptID = pd_top_form.find('name', 'DeptID')[0].value;
                        var Month = pd_top_form.find('name', 'Month')[0].value;
                        var Year = pd_top_form.find('name', 'Year')[0].value;
                       Export2Excel(Year,Month,DeptID);
                    }
                }]
            }

        ]
    }]
});

//页面加载设置默认值
var setDefaultValues = function() {
    var now = new Date();
    var date = now.format('Y-m-d');
    pd_top_form.find("name", "mydate")[0].setValue(date);
    pd_top_form.find("name", "isThisMonth")[0].setValue(true);
    pd_top_form.show();
};
//setDefaultValues();

function getId(pd_grid) {
    var s = pd_grid.getSelectionModel().getSelected();
    if (s) {
        return s.id;
    }
    return 0;
}

//添加Form窗口
var AddForm = new Ext.form.FormPanel({
    frame: true,
    //autoScroll: true,
    labelWidth: 80,
    // bodyStyle: 'padding:5px',
    layout: "column",
    labelAlign: 'right',
    bodyStyle: "margin:0 -40px",
    items: [{
        layout: "form",
        columnWidth: 0.48,
        items: [{
            xtype: "textfield",
            fieldLabel: "编 号",
            name: "Code",
            //id: "Code",
            allowBlank: false,
            anchor: "100%"
        }, {
            xtype: "combo",
            fieldLabel: "类 型",
            anchor: "100%",
            hiddenName: "LimitType",
            triggerAction: 'all',
            allowBlank: false,
            editable: false,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                fields: ['myId', 'displayText'],
                data: type_data
            }),
            valueField: 'myId',
            displayField: 'displayText'
        }]
    }, {
        layout: "form",
        columnWidth: 0.5,
        bodyStyle: "margin:0 -20px",
        items: [{
            xtype: "textfield",
            fieldLabel: "名 称",
            name: "Title",
            allowBlank: false,
            anchor: "98%"
        }, {
            xtype: "numberfield",
            fieldLabel: "数 量",
            name: "LimitCount",
            //id: "LimitCount",
            allowBlank: false,
            anchor: "98%"
        }]
    }, {
        columnWidth: 0.965,
        layout: 'form',
        items: [{
            //id:'memoinfo',
            xtype: 'textfield',
            fieldLabel: '备 注',
            name: 'MemoInfo',
            anchor: '97%'
        }]
    }, {
        columnWidth: 0.965,
        layout: 'column',
        items: [{
            columnWidth: 0.7,
            layout: "form",
            items: [{
                //id:'memoinfo',
                xtype: 'textfield',
                fieldLabel: '卡类型',
                name: 'CardType',
                readOnly: true,
                anchor: '94%'
            }]
        }, {
            columnWidth: 0.2,
            xtype: "button",
            text: "选择",
            handler: function() {
                var ids = AddForm.find("name", "CardTypeID")[0].getValue();
                //alert(ids);
                SelectDeptWindow.show();
                checkNow();
            }
        }, {
            xtype: "hidden",
            name: "CardTypeID"
        }]
    }],
    buttons: [{
        text: '保  存',
        handler: function() {
            SelectCode();
        }
    }, {
        text: '取  消',
        handler: function() {
            AddForm.getForm().reset();
            AddWindow.hide();
        }
    }]
});

//添加Window窗口
var AddWindow = new Ext.Window({
    //layout: 'fit',
    width: 550,

    autoScroll: true,
    //height: 158,
    modal: true,
    closeAction: 'hide',
    title: "物料登记",
    plain: true,
    items: [AddForm]
});

//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },

    columns: [new Ext.grid.RowNumberer(), {
        header: "产品编号",
        dataIndex: "Code",
        width: 130,
        align: 'center'
    }, {
        header: "产品名称",
        dataIndex: "Title",
        width: 130

    }, {
        header: "月初库存",
        dataIndex: "StartNum",
        width: 130,
        align: 'right'

    }, {
        header: "入库数量",
        dataIndex: "RNum",
        width: 130,
        align: 'right'
    }, {
        header: "销售",
        dataIndex: "XNum",
        width: 100,
        align: 'right'

    }, {
        header: "领用",
        dataIndex: "LNum",
        width: 100,
        align: 'right'

    }, {
        header: "月末",
        dataIndex: "EndNum",
        width: 100,
        align: 'right'

    }, {
        header: "损益",
        dataIndex: "CreaseNum",
        width: 100,
        align: 'right'

    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/LogisticsManagement.aspx?actionName=getLogisticsReport&sid=' + Sys.sid,
    autoLoad: false,
    reader: new Ext.data.JsonReader({
        //record: 'plant',
        //root: 'msg',
        //totalProperty: 'results',
        fields: [{
            name: "Code",
            mapping: "Code"
        }, {
            name: "Title",
            mapping: "Title"
        }, {
            name: "RNum",
            mapping: "RNum"
        }, {
            name: "LNum",
            mapping: "LNum"
        }, {
            name: "XNum",
            mapping: "XNum"
        }, {
            name: "StartNum",
            mapping: "StartNum"
        }, {
            name: "EndNum",
            mapping: "EndNum"
        }, {
            name: "CreaseNum",
            mapping: "CreaseNum"
        }, {
            name: "remark",
            mapping: "remark"
        }]
    }),
});
var defaultShow = function() {
    var curDate = new Date();
    var mydate = Ext.Date.format(curDate, 'Y-m-d');
    pd_top_form.find("name", "date")[0].setValue(mydate);
}
var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    stripeRows: true,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({
        singleSelect: false
    }), //设置单行选中模式, 否则将无法删除数据
    //sm: sm,
    loadMask: true
});
//pd_store.load();
AddForm.getForm().reset();
//表格添加双击事件


//主容器
var pd_main_panel = new Ext.Panel({
    //autotoWidth:true,
    layout: "anchor",
    //anchorSize: { width: 800, height: 600 },
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
//添加
function AddAction() {
        if (!validateDate()) {
            return;
        }
        var mydate = Ext.util.Format.date(pd_top_form.find("name", "mydate")[0].getValue(), 'Y-m-d');
        var mycode = pd_top_form.find("name", "mycode")[0].getValue();
        var mytype = pd_top_form.find("name", "mytype")[0].getRawValue();
        var mycount = pd_top_form.find("name", "mycount")[0].getValue();
        if (mydate == null || mydate == "") {
            Ext.MessageBox.alert("提醒", "请选择日期");
            pd_top_form.find("name", "mydate")[0].focus(false, 100);
            return;
        }

        if (mycode == null || mycode == "") {
            Ext.MessageBox.alert("提醒", "请选择产品");
            pd_top_form.find("name", "mycode")[0].focus(false, 100);
            return;
        }

        if (mytype == null || mytype == "") {
            Ext.MessageBox.alert("提醒", "请选择类型");
            pd_top_form.find("name", "mytype")[0].focus(false, 100);
            return;
        }

        if (mycount == null || mycount == "") {
            Ext.MessageBox.alert("提醒", "请输入数字");
            pd_top_form.find("name", "mycount")[0].focus(false, 100);
            return;
        } else {
            var reg = /^\d+$/;
            if (!reg.test(mycount)) {
                Ext.MessageBox.alert("提醒", "请输入正确的整数值");
                pd_top_form.find("name", "mycount")[0].focus(false, 100);
                return;
            }
        }

        if (pd_top_form.getForm().isValid()) {
            Ext.Ajax.request({
                url: "../Apis/LogisticsManagement.aspx?actionName=addLogisticsRegister&DeptID=1&sid=" + Sys.sid, //+"&mydate="+mydate+"&myCode="+mycode+"&mytype="+mytype+"&mycount="+mycount,

                params: {
                    mydate: mydate,
                    mycode: mycode,
                    mytype: mytype,
                    mycount: mycount
                },
                success: function(form, action) {
                    //Ext.MessageBox.alert("提醒", action.result.msg);
                    pd_top_form.find("name", "mycode")[0].setValue("");
                    pd_top_form.find("name", "mycount")[0].setValue("");
                    pd_top_form.find("name", "mytype")[0].setValue("");
                    //操作成功
                    //Ext.MessageBox.alert("提醒", "提交成功");
                    pd_store.reload();
                    pd_top_form.find("name", "mycode")[0].focus(false, 100);
                },
                failure: function() {

                    if (action != undefined && action.result != undefined) {
                        Ext.MessageBox.alert("提醒", action.result.msg);
                    } else {
                        Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                    }
                }
            });

        }
    }
    //验证日期
function validateDate() {
    var date = pd_top_form.find("name", "mydate")[0].getValue();
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();

    var selectedMonth = date.getMonth() + 1;

    if (date.getFullYear() != year) {
        Ext.MessageBox.alert("提醒", "年份选择有误");
        return false;
    }
    if (selectedMonth > month) {
        Ext.MessageBox.alert("提醒", "月份选择有误");
        return false;
    }

    if (day > 5 && month != selectedMonth || day < 5 && month - selectedMonth > 1) {
        Ext.MessageBox.alert("提醒", "月份选择有误！");
        return false;
    }
    return true;
}
centerPanel.add(pd_main_panel);
centerPanel.doLayout();

 window.Export2Excel = function (year ,month,deptId) {
    deptId = deptId||"";

    debugger;
    Ext.Ajax.request({
        url: '../Apis/LogisticsManagement.aspx?actionName=getLogisticsReport&sid=' + Sys.sid + "&Year=" + year + "&Month=" + month+"&DeptID="+deptId,
        /*param: { Year: year,Month:month,DeptID: deptId},*/
        success: function (response, option) {
            debugger;
            var data = Ext.decode(response.responseText);
            var success = data.success;
            if (typeof(data.success)=="undefined") {
                window.location.href = '../Apis/LogisticsManagement.aspx?actionName=export2Excel&sid=' + Sys.sid + "&Year=" + year + "&Month=" + month+"&DeptID="+deptId;
                return false
            } else {
                Ext.MessageBox.alert("提示", data.msg);
            }
            return;
        },
        failure: function () {
            Ext.MessageBox.alert("提示", "下载失败!");
        }
    });
};
