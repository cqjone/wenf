//部门考勤统计
//===================年份和月份Store========================//
var newyear = new Date().getFullYear(); //这是为了取现在的年份数
var yearlist = [];
for (var i = newyear; i >= 1900; i--) {
    yearlist.push([i, i]);
}
var yearModelStore = new Ext.data.ArrayStore({
        fields : ['ID', 'Title'],
        data : []
    });
this.yearModelStore.loadData(yearlist);
var monthModelStore = new Ext.data.ArrayStore({
        fields : ['ID', 'Title'],
        data : [["1", "1"],
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
var tar_employee = new Ext.data.Store({
        autoDestroy : true,
        url : '../Apis/BaseInfoUtil.aspx?actionName=getEmployee&char_length=3&sid=' + Sys.sid,
        reader : new Ext.data.JsonReader({
            fields : [{
                    name : "CombineWord",
                    mapping : "CombineWord"
                }, {
                    name : "ID",
                    mapping : "ID"
                }
            ]
        }),
        sortInfo : {
            field : 'CombineWord',
            direction : 'ASC'
        }
    });

var period_store = new Ext.data.Store({
        autoDestroy : true,
        url : '../Apis/BaseInfoUtil.aspx?actionName=getPeriod&sid=' + Sys.sid,
        reader : new Ext.data.JsonReader({
            fields : [{
                    name : "Title",
                    mapping : "Title"
                }, {
                    name : "Value",
                    mapping : "Value"
                },
            ]
        }),
        sortInfo : {
            field : 'Value',
            direction : 'desc'
        }
    });
period_store.load();

var pd_top_form = new Ext.form.FormPanel({
        //frame: true,
        bodyBorder : false,
        border : false,
        autoScroll : true,
        labelWidth : 5,
        labelAlign : 'right',
        heigh : 100,
        //autoWidth:true,
        items : [{
                xtype : "fieldset",
                title : "查询条件",
                //defaultType: 'textfield',
                defaults : {
                    labelAlign : "right",
                    width : 50
                },
                //bodyBorder:false,
                layout : "column",
                items : [{
                        layout : "hbox",
                        defaults : {
                            margins : '0 5 0 0'
                        },
                        columnWidth : 1,
                        items : [{
                                xtype : "label",
                                html : '时   间：',
                                style : {
                                    marginTop : '3px'
                                }
                            }, {
                                xtype : "combo",
                                name : "comboPeriod",
                                store : period_store,
                                hiddenName : "comboPeriod",
                                width : 180,
                                margin : '0 0 0 20',
                                mode : 'local',
                                triggerAction : 'all',
                                valueField : 'Value',
                                displayField : 'Title',
                                editable : false,
                                forceSelection : true,
                                triggerAction : "all"

                            }, {
                                xtype : "label",
                                html : '员  工：',
                                style : {
                                    marginTop : '3px'
                                }
                            }, {
                                xtype : "combo",
                                name : "Employee",
                                hiddenName : "ID",
                                store : tar_employee,
                                triggerAction : 'query',
                                width : 130,
                                border : 1,
                                valueField : 'ID',
                                displayField : 'CombineWord',
                                enableKeyEvents : true,
                                selectOnFocus : true,
                                allowBlank : true,
                                forceSelection : false,
                                minChars : 8,
                                hideTrigger : true,
                                listeners : {
                                    'specialkey' : function (_field, _e) {
                                        if (_e.getKey() == _e.ENTER) {
                                            searchData();
                                        }
                                    },
                                    "keyup" : function (v) {

                                        var value = v.getRawValue();

                                        tar_employee.load({
                                            params : {
                                                key : pd_top_form.find("name", "Employee")[0].getRawValue()
                                            }
                                        });
                                    }
                                },
                                style : {
                                    marginLeft : '3px'

                                }
                            }, {
                                xtype : "button",
                                boxMinWidth : 40,
                                style : "margin-left:30px",
                                width : 60,
                                text : " 查  询",
                                handler : function () {
                                    searchData();
                                }
                            }, {
                                xtype : 'button',
                                style : "margin-left:3em",
                                text : " 导出为Excel ",
                                width : 90,
                                columnWidth : 0.3,
                                handler : function () {
                                    Export2Excel()
                                }
                            }
                        ]
                    }
                ]

            }
        ]
    });

var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
        defaults : {
            sortable : false,
            menuDisabled : true,
            multiSelect : true
        },
        columns : [new Ext.grid.RowNumberer(), {
                header : 'ID',
                dataIndex : 'ID',
                hidden : true,
                width : 100
            }, {
                header : "工号",
                dataIndex : "EmployeeCode",
                width : 120
            }, {
                header : "姓名",
                dataIndex : "EmployeeName",
                width : 150
            }, {
                header : "实到",
                dataIndex : "RealTo",
                align : 'right',
                width : 110,
                renderer : function (value, m) {
                    var position = value.indexOf("(");
                    var deipslayValue = value;
                    if (deipslayValue.substr(position + 1, 1) == '0') {
                        deipslayValue = deipslayValue.substring(0, position);
                    }
                    return '<span style="font-weight:bold;">' + deipslayValue + '</span>';

                }
            }, {
                header : "通班",
                dataIndex : "WholeDay",
                width : 110,
                align : 'right'
            }, {
                header : "白班",
                dataIndex : "DayGoTo",
                width : 110,
                align : 'right'
            }, {
                header : "中班",
                dataIndex : "MiddleDay",
                width : 110,
                align : 'right'
            }, {
                header : "晚班",
                dataIndex : "NightGoTo",
                width : 110,
                align : 'right'
            }, {
                header : "休息",
                align : 'right',
                dataIndex : "Rest",
                width : 110,
                renderer : function (value, m) {
                    var str = value;
                    if (value > 4) {
                        str = "<span style='color:red; font-weight:bold;'>" + value + "</span>";
                    }
                    return str;

                }

            }, {
                header : "请假",
                align : 'right',
                dataIndex : "Leave",
                width : 110
            }, {
                header : "培训",
                align : 'right',
                dataIndex : "Train",
                width : 110
            }, {
                header : "迟到",
                align : 'right',
                dataIndex : "BeLate",
                width : 110
            }, {
                header : "早退",
                align : 'right',
                dataIndex : "LeaveEarly",
                width : 110
            }
        ]
    });

var setDefaultValues = function () {
    var now = new Date();
    var date = now.format('Y年m月');
    pd_top_form.find("name", "comboPeriod")[0].setValue(date);
    pd_top_form.show();

};

// create the Data Store
var pd_store = new Ext.data.Store({
        autoDestroy : true,
        autoLoad : true,
        url : '../Apis/AttendanceMgr.aspx?actionName=queryDeptAttendanceStatistics&sid=' + Sys.sid,
        reader : new Ext.data.JsonReader({
            idProperty : 'ID',
            root : 'results',

            totalProperty : 'totalCount',
            fields : [{
                    name : "ID",
                    mapping : "ID"
                }, {
                    name : "EmployeeCode",
                    mapping : "EmployeeCode"
                }, {
                    name : "EmployeeName",
                    mapping : "EmployeeName"
                }, {
                    name : "DayGoTo",
                    mapping : "DayGoTo"
                }, {
                    name : "MiddleDay",
                    mapping : "MiddleDay"
                }, {
                    name : "WholeDay",
                    mapping : "WholeDay"
                }, {
                    name : "NightGoTo",
                    mapping : "NightGoTo"
                }, {
                    name : "RealTo",
                    mapping : "RealTo"
                }, {
                    name : "Rest",
                    mapping : "Rest"
                }, {
                    name : "Leave",
                    mapping : "Leave"
                }, {
                    name : "BeLate",
                    mapping : "BeLate"
                }, {
                    name : "LeaveEarly",
                    mapping : "LeaveEarly"
                }, {
                    name : "Train",
                    mapping : "Train"
                }
            ]
        })
    });

/**
 * 查询数据
 */
function searchData(exportExcel) {
    var period = pd_top_form.getForm().findField("comboPeriod").getValue();
    var searchEmp = pd_top_form.find("name", "Employee")[0].getValue();

    //if (period != null && typeof(period) != "undefined") {
    var queryYear = "";
    var queryMonth = "";
    var arr;
    if (period != null && typeof(period) != "undefined") {
        arr = period.split("-");
        if (arr.length > 1) {
            queryYear = arr[0];
            queryMonth = arr[1];
        } else if (period.split("年").length > 1) {
            arr = period.split("年");
            queryYear = arr[0];
            queryMonth = arr[1].replace("月", "");
        }

    }

    var queryEmployee;
    pd_store.reload({
        params : {
            searchYear : queryYear,
            searchMonth : queryMonth,
            searchEmp : searchEmp,
            export2Excel : exportExcel || false
        }
    });

    //}
}

function Export2Excel() {
    var period = pd_top_form.getForm().findField("comboPeriod").getValue();
    var searchEmp = pd_top_form.find("name", "Employee")[0].getValue();

    //if (period != null && typeof(period) != "undefined") {
    var queryYear = "";
    var queryMonth = "";
    var arr;
    if (period != null && typeof(period) != "undefined") {
        arr = period.split("-");
        if (arr.length > 1) {
            queryYear = arr[0];
            queryMonth = arr[1];
        } else if (period.split("年").length > 1) {
            arr = period.split("年");
            queryYear = arr[0];
            queryMonth = arr[1].replace("月", "");
        }

    }
    var url1 = '../Apis/AttendanceMgr.aspx?export2Excel=true&actionName=queryDeptAttendanceStatistics&sid='
                 + Sys.sid + "&searchYear="
                 + queryYear + "&searchMonth="
                 + queryMonth + "&searchEmp="
                 + searchEmp+"&urlName=dept";

    Ext.Ajax.request({
        url: url1,
        /*param: { Year: year,Month:month,DeptID: deptId},*/
        success: function (response, option) {
            var data = Ext.decode(response.responseText);
            var fileName = data.file || "";
            if(fileName!=""){
                window.location.href="../ExportFiles/"+fileName;
              /* window.location.href = '../Apis/AttendanceMgr.aspx?export2Excel=true&actionName=queryDeptAttendanceStatistics&sid='
                 + Sys.sid + "&searchYear="
                 + queryYear + "&searchMonth="
                 + queryMonth + "&searchEmp="
                 + searchEmp+"&urlName=dept";*/
            }
            else{
                Ext.MessageBox.alert("提示", "没有相关记录!");
            }
           
        },
        failure: function () {
            Ext.MessageBox.alert("提示", "下载失败!");
        }
    });


   
};

var pd_grid = new Ext.grid.GridPanel({
        store : pd_store,
        cm : cm,
        sm : sm,
        margins : "2 2 2 2",
        border : false,
        columnLines : true,
        loadMask : true

    });

pd_store.on('beforeload', function (thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    this.baseParams = pd_top_form.getForm().getValues();
    this.baseParams.urlName = "dept";
    //this.baseParams.start = 0;
    //this.baseParams.limit = 20;
});

//主容器
var pd_main_panel = new Ext.Panel({
        border : false,
        layout : "border",
        items : [{
                frame : true,
                region : 'north',
                height : 90,
                layout : "fit",
                border : false,
                items : [pd_top_form]
            }, {
                layout : "fit",
                region : 'center',
                border : false,
                anchor : '-1 -140',
                items : [pd_grid]
            }
        ]
    });

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
setDefaultValues();