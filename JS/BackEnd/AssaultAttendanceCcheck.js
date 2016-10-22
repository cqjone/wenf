//    Ext.onReady(function(){
//Ext.QuickTips.init(); //初始化错误信息提示函数
//Ext.form.Field.prototype.msgTarget = 'side'; //设置错误信息显示方式
//  });
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
    ////获取当月天数
    //function getLastDay(year, month) {
    //    var new_year = year;    //取当前的年份         
    //    var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）         
    //    if (month > 12)            //如果当前大于12月，则年份转到下一年         
    //    {
    //        new_month -= 12;        //月份减         
    //        new_year++;            //年份增         
    //    }
    //    var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天         
    //    var date_count = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月的天数       
    //    return date_count;
    //}

//===================年份和月份Store========================//
//var newyear = new Date().getFullYear(); //这是为了取现在的年份数
//var yearlist = [];
//for (var i = newyear; i >= 1900; i--) {
//    yearlist.push([i, i]);
//}
//var yearModelStore = new Ext.data.ArrayStore({
//    fields: ['ID', 'Title'],
//    data: []
//});
//this.yearModelStore.loadData(yearlist);
//var monthModelStore = new Ext.data.ArrayStore({
//    fields: ['ID', 'Title'],
//    data: [["1", "1"],
//            ["2", "2"],
//            ["3", "3"],
//            ["4", "4"],
//            ["5", "5"],
//            ["6", "6"],
//            ["7", "7"],
//            ["8", "8"],
//            ["9", "9"],
//            ["10", "10"],
//            ["11", "11"],
//            ["12", "12"]]
//});


var dayStatusStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["1", "上班"],
        ["2", "休息"],
        ["3", "请假"]
    ]
});

//var type_store = new Ext.data.Store({
//    autoDestroy: true,
//    url: '../Apis/CardMgr.aspx?actionName=getType&sid=' + Sys.sid,
//    reader: new Ext.data.JsonReader({
//        fields: [
//                { name: "ID", mapping: "ID" },
//                { name: "Title", mapping: "Title" }
//            ]
//    }),
//    sortInfo: { field: 'ID', direction: 'ASC' }
//});

// utilize custom extension for Hybrid Summary
//var cardSummary = new Ext.ux.grid.GridSummary();
//var jckSummary = new Ext.ux.grid.GridSummary();
//var modelStore = new Ext.data.ArrayStore({
//    fields: ['ID', 'Title'],
//    data: [["全部", "全部"],
//            ["正常", "正常"],
//            ["挂失", "挂失"],
//            ["销卡", "销卡"],
//            ["未启用", "未启用"]]
//});

//门店信息下拉框
var tar_dept = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CashierSetting.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
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
});
//员工信息下拉数据
var tar_employee = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CashierSetting.aspx?char_length=3&actionName=getEmployee&sid=' + Sys.sid,
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
});

var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getDate() - 3);


var hour_data = new Ext.data.ArrayStore({
    fields: ['value', 'text'],
    data: [
        ["0", "0"],
        ["1", "1"],
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
        ["12", "12"],
        ["13", "13"],
        ["14", "14"],
        ["15", "15"],
        ["16", "16"],
        ["17", "17"],
        ["18", "18"],
        ["19", "19"],
        ["20", "20"],
        ["21", "21"],
        ["22", "22"],
        ["23", "23"]
    ]

});


var minute_data = new Ext.data.ArrayStore({
    fields: ['value', 'text'],
    data: [
        ["0", "0"],
        ["15", "15"],
        ["30", "30"],
        ["45", "45"]
    ]

});

var errorTime_data = new Ext.data.ArrayStore({
    fields: ['value', 'text'],
    data: [
        ["30", "±30"],
        ["45", "±45"]
    ]

});


var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 50,
    labelAlign: 'right',

    //autoWidth:true,
    items: [{


        xtype: "fieldset",
        title: "注意事项",
        style: {
            marginLeft: '4px',
            marginTop: '10px'
        },
        items: [ //third

            {
                items: [{
                    xtype: "label",
                    html: '<font style="color:red;">1、日期、小时、分钟、门店为必填项.</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '4px'
                    }
                }, {
                    xtype: "label",
                    html: '<br><font style="color:red;">&nbsp;2、只允许选择最近3天的突击抽查.</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '4px'
                    }
                }]
            }

        ]
    }, {
        xtype: "fieldset",
        title: "突击抽查条件",
        //defaultType: 'textfield',
        defaults: {
            labelAlign: "right",
            width: 50
        },
        //bodyBorder:false,
        layout: "column",
        items: [{
                layout: 'form',
                columnWidth: 0.23,
                items: [{
                    xtype: "datefield",
                    minValue: lastDay,
                    maxValue: today.format("Y-m-d"),
                    editable: false,
                    fieldLabel: "日期",
                    name: "mydate",
                    msgTarget: 'side',
                    allowBlank: false,
                    format: "Y-m-d",
                    enableKeyEvents: true,
                    width: 125,
                    listeners: {
                        'specialkey': function(_field, _e) {
                            debugger;
                            if (_e.getKey() == _e.ENTER) {
                                Ext.getCmp("btnSel").setDisabled(false);
                            }
                        }
                    }
                }]
            }, {
                layout: 'form',
                columnWidth: 0.15,
                items: [{
                    xtype: "combo",
                    name: "hour",
                    store: hour_data,
                    displayField: "text",
                    valueField: "value",
                    editable: false,
                    width: 50,
                    fieldLabel: "小时",
                    triggerAction: 'all',
                    msgTarget: 'side',
                    allowBlank: false,
                    mode: 'local',
                    enableKeyEvents: true,
                    selectOnFocus: true,
                    forceSelection: true,
                    editable: false,

                    listeners: {
                        'specialkey': function(_field, _e) {
                            if (_e.getKey() == _e.ENTER) {
                                //                                              pd_top_form.find("name", "mycount")[0].focus(false, 100);
                            }
                        },
                        show: function() {
                            alert();
                        }
                    }

                }]
            }, {
                layout: 'form',
                columnWidth: 0.15,
                items: [{
                    xtype: "combo",
                    name: "minute",
                    store: minute_data,
                    displayField: "text",
                    valueField: "value",
                    editable: false,
                    fieldLabel: "分钟",
                    width: 50,
                    triggerAction: 'all',
                    msgTarget: 'side',
                    allowBlank: false,
                    mode: 'local',
                    enableKeyEvents: true,
                    selectOnFocus: true,
                    forceSelection: true,
                    editable: false,
                    listeners: {
                        'specialkey': function(_field, _e) {
                            if (_e.getKey() == _e.ENTER) {
                                //                                              pd_top_form.find("name", "hour")[0].focus(false, 100);
                            }
                        },
                        show: function() {
                            alert();
                        }
                    }
                }]

            },

            {
                layout: 'form',
                columnWidth: 0.15,
                items: [{
                    xtype: "combo",
                    name: "errorTime",
                    store: errorTime_data,
                    displayField: "text",
                    valueField: "value",
                    msgTarget: 'side',
                    allowBlank: false,
                    editable: false,
                    width: 50,
                    fieldLabel: "时差",
                    triggerAction: 'all',
                    mode: 'local',
                    enableKeyEvents: true,
                    selectOnFocus: true,
                    forceSelection: true,
                    editable: false,
                    listeners: {
                        'specialkey': function(_field, _e) {
                            if (_e.getKey() == _e.ENTER) {
                                //                                              pd_top_form.find("name", "mycount")[0].focus(false, 100);
                            }
                        },
                        show: function() {
                            alert();
                        }
                    }
                }]
            }

            , {
                layout: 'form',
                columnWidth: 0.2,
                items: [{
                    xtype: "combo",
                    name: "DeptID",
                    hiddenName: "DeptID",
                    fieldLabel: "门 店",
                    store: tar_dept,
                    triggerAction: 'all',
                    msgTarget: 'side',
                    allowBlank: false,
                    width: 130,
                    border: 1,
                    valueField: 'ID',
                    displayField: 'CombineWord',
                    enableKeyEvents: true,
                    selectOnFocus: true,
                    forceSelection: true,
                    hideTrigger: true,
                    listeners: {
                        "keyup": function(v) {
                            var value = v.getRawValue();
                            if (value != null && value.length >= 1) {
                                tar_dept.load({
                                    params: {
                                        key: value
                                    }
                                });

                            }
                        }
                    },
                    style: {
                        marginLeft: '3px'

                    }
                }]
            },
            //                              {
            //                                  layout : 'form',
            //                                  columnWidth : 0.23,
            //                                  items : [{
            //                                          xtype : "combo",
            //                                          name : "EmpID",
            //                                          hiddenName : "EmpID",
            //                                          fieldLabel : "员 工",
            //                                          store : tar_employee,
            //                                          triggerAction : 'all',
            //                                          width : 170,
            //                                          border : 1,
            //                                          valueField : 'ID',
            //                                          displayField : 'CombineWord',
            //                                          enableKeyEvents : true,
            //                                          selectOnFocus : true,
            //                                          allowBlank : true,
            //                                          forceSelection : true,
            //                                          hideTrigger : true,
            //                                          listeners : {
            //                                              "keyup" : function (v) {
            //                                                  var value = v.getRawValue();
            //                                                  if (value != null && value.length >= 1) {
            //                                                      tar_dept.load({
            //                                                          params : {
            //                                                              key : value
            //                                                          }
            //                                                      });

            //                                                  }
            //                                              }
            //                                          },
            //                                          style : {
            //                                              marginLeft : '3px'

            //                                          }
            //                                      }
            //                                  ]
            //                              },
            {
                width: 100,
                style: {

                    marginTop: '-7px'
                },
                buttons: [{
                    id: "btnSel",
                    text: "查 询",
                    listeners: {
                        click: function() {
                            searchData();
                        }
                    }

                }]
            }
        ]
    }]
});


function searchData() {
    if (pd_top_form.form.isValid()) {
        var mydate = pd_top_form.find("name", "mydate")[0].getValue();
        var hour = pd_top_form.find("name", "hour")[0].getValue();
        var minute = pd_top_form.find("name", "minute")[0].getValue();
        var depid = pd_top_form.find("name", "DeptID")[0].getValue();
        var errorTime = pd_top_form.find("name", "errorTime")[0].getValue();
        pd_store.load({
            params: {
                sid: Sys.sid,
                mydate: mydate,
                hour: hour,
                depid: depid,
                minute: minute,
                errorTime: errorTime
            }
        }); //载入数据。 
    }
}


var cm = new Ext.ux.grid.LockingColumnModel({

    columns: [{
            header: 'ID',
            dataIndex: 'DeleteEnable',
            hidden: true,
            width: 100
        },

        {
            header: '<center><font style="font-weight:bold">工号</font></center>',
            align: 'center',
            dataIndex: '工号',
            width: 100,
            sortable: true,
            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">姓名</font></center>',
            dataIndex: "姓名",
            align: 'left',
            width: 80,
            sortable: true,
            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">性别</font>',

            dataIndex: "性别",
            align: 'center',
            width: 50,
            sortable: true,
            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">年龄</font></center>',
            dataIndex: "年龄",
            align: 'center',
            width: 50,
            sortable: true,
            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">职务</font></center>',
            dataIndex: "职务",
            align: 'left',
            width: 70,
            sortable: true,
            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">手机</font></center>',
            dataIndex: "手机",
            align: 'center',
            width: 100,

            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">排班</font></center>',
            dataIndex: "排班",
            align: 'center',
            width: 70,
            renderer: function(value, m) {
                return RenderDayStatus(value, m);
            }
        }, {
            header: '<center><font style="font-weight:bold">标准照</font></center>',
            dataIndex: "工号",
            align: 'center',
            width: 120,
            renderer: function(value, m) {

                return String.format("<image src='" + " http://jf.wenfeng.com.cn/Imgs/EmpImgs/" + value + ".jpg" + "' width='120px'  style='cursor:pointer'   />");
            }
        }, {
            header: '<center><font style="font-weight:bold">突击抽查照片</font></center>',
            dataIndex: "突击抽查照片",
            align: 'center',
            width: 300,
            renderer: function(value, m) {
                if (value != null) {
                    return String.format("<image src='" + "http://jf.wenfeng.com.cn/Imgs/Checkin/" + value + "' height='168' style='cursor:pointer'   />");
                } else {
                    return RenderDayStatus(value, m);
                }
            }
        }, {
            header: '<center><font style="font-weight:bold">拍照时间</font></center>',
            dataIndex: "拍照时间",
            align: 'center',
            width: 120,
            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">上班照片</font></center>',
            dataIndex: "上班照片",
            align: 'center',
            width: 300,
            renderer: function(value, m) {
                return String.format("<image src='" + "http://jf.wenfeng.com.cn/Imgs/Checkin/" + value + "' height='168'   style='cursor:pointer'   />");
            }
        }, {
            header: '<center><center><font style="font-weight:bold">上班时间</font></center>',
            dataIndex: "上班时间",
            align: 'center',
            width: 120,
            renderer: function(value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }
    ]
});


var oldData;
// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //    autoLoad: true,
    url: '../Apis/AssaultAttendanceCcheck.aspx?actionName=getAssaultData&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'MakeupInfo',
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [{
            name: "工号",
            mapping: "工号"
        }, {
            name: "姓名",
            mapping: "姓名"
        }, {
            name: '性别',
            mapping: '性别'
        }, {
            name: '年龄',
            mapping: '年龄'
        }, {
            name: '职务',
            mapping: '职务'
        }, {
            name: '手机',
            mapping: '手机'
        }, {
            name: '排班',
            mapping: '排班'
        }, {
            name: "标准照",
            mapping: "标准照"
        }, {
            name: "突击抽查照片",
            mapping: "突击抽查照片"
        }, {
            name: '拍照时间',
            mapping: '拍照时间'
        }, {
            name: "上班照片",
            mapping: "上班照片"
        }, {
            name: "上班时间",
            mapping: "上班时间"
        }]
    }),

});
var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    stripeRows: false,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    region: 'center',
    margins: "2 2 2 2",
    border: false,
    columnLines: true,
    loadMask: true,
});


function RenderDayStatus(value, m) {
    if (value == "0") {
        m.css = 'x-grid-back-bai';
        return "白班";
    } else if (value == "1") {
        m.css = 'x-grid-back-ban';
        return "晚班";
    } else if (value == "2") {
        m.css = 'x-grid-back-xiu';
        return "休假";
    } else if (value == "3") {
        m.css = 'x-grid-back-jia';
        return "请假";
    } else if (value == "4") {
        m.css = 'x-grid-back-jia';
        return "未排班";
    } else if (value == "5") {
        m.css = 'x-grid-back-tong';
        return "通班";
    } else if (value == "6") {
        m.css = 'x-grid-back-zhong';
        return "中班";
    }
    else if (value == "7") {
        m.css = 'x-grid-back-pei';
        return "培训";
    }
    //    else if( value.indexOf("jpg") > 0 || value.indexOf("jpg4") > 0){
    //             m.css = "x-grid-back-wpb";
    //            html = " <img style='height:70px;width:100%;' src='" +"http://jf.wenfeng.com.cn/Imgs/Checkin/"+ value + ">";
    //            return html;
    //    }
}

function BtnUpdateStatus(Status) {
    for (var i = 0; i < pd_grid.selModel.selections.length; i++) {
        var cell = pd_grid.selModel.selections[i];
        pd_grid.getStore().getAt(cell[0]).set("Day" + (cell[1] - 3), 4);
        pd_grid.getStore().getAt(cell[0]).set("Day" + (cell[1] - 3), Status);
    }
    pd_grid.selModel.selections = [];
}

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 180,
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
//设置显示默认日期
var setDefaultValues = function() {
    var now = new Date();
    var date = now.format('Y-m-d');
    pd_top_form.find("name", "mydate")[0].setValue(date);
    pd_top_form.find("name", "errorTime")[0].setValue(30);
    pd_top_form.find("name", "hour")[0].setValue(now.getHours());
    var minutes = (parseInt(now.getMinutes()/15))*15;
    pd_top_form.find("name", "minute")[0].setValue(minutes);
    

};
setDefaultValues();
