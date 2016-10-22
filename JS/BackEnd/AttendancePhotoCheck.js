//考勤照片抽查
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
    data: [
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
        ["12", "12"]
    ]
});
Ext.QuickTips.init();

//补录
var tar_employee = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getEmployee&char_length=2&sid=' + Sys.sid,
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


var tar_dept = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getDept&sid=' + Sys.sid,
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



var dept_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=getDept&sid=' + Sys.sid,
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

var emp_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=getEmp&sid=' + Sys.sid,
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
var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 50,
    labelAlign: 'right',
    heigh: 100,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        //defaultType: 'textfield',
        defaults: {
            labelAlign: "right",
            width: 50
        },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "hbox",
            defaults: {
                margins: '0 5 0 0'
            },
            columnWidth: 1,
            items: [{
                    xtype: "combo",
                    name: "comboYear",
                    store: yearModelStore,
                    mode: 'local',
                    hideLabel: true,
                    width: 60,
                    hiddenName: "comboYear",
                    anchor: "100%",
                    triggerAction: 'all',
                    valueField: 'ID',
                    displayField: 'Title',
                    editable: false
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                    }
                }, {
                    xtype: "combo",
                    hiddenName: "comboMonth",
                    store: monthModelStore,
                    name: "comboMonth",
                    editable: false,
                    hideLabel: true,
                    anchor: "100%",
                    mode: 'local',
                    width: 60,
                    valueField: "ID",
                    displayField: "Title",
                    triggerAction: "all"
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                    }
                }, {
                    xtype: "label",
                    html: '门  店：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '5px',
                    }
                }, {
                    xtype: "combo",
                    name: "DeptId",
                    hiddenName: "DeptId",
                    store: tar_dept,
                    triggerAction: 'all',
                    width: 130,
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

                            }
                        }
                    },
                    style: {
                        marginLeft: '3px'

                    }
                },
                /**{
                             xtype: "combo",
                             name: "DeptId",
                             hiddenName: "DeptId",
                             anchor: "100%",
                             triggerAction: 'all',
                             store: dept_store,
                             valueField: 'ID',
                             width: 150,
                             displayField: 'Title',
                             enableKeyEvents: true,
                             selectOnFocus: true,
                             allowBlank: true,
                             forceSelection: true,
                             listeners: {
                                 "keyup": function (v) {
                                     dept_store.load({
                                         params: { dName: v.getRawValue() }
                                     });
                                 },
                                 'select': function () {
                                     if (pd_top_form.find('name', 'DeptId')[0].value != 0) {
                                         pd_top_form.getForm().findField('EmpId').setValue("");
                                     }

                                 }
                             }
                         },**/
                {
                    xtype: "label",
                    html: '员  工：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '5px'
                    }
                }, {
                    xtype: "combo",
                    name: "EmpId",
                    hiddenName: "EmpId",
                    store: tar_employee,
                    triggerAction: 'all',
                    width: 130,
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
                                tar_employee.load({
                                    params: {
                                        key: v.getRawValue()
                                    }
                                });

                            }
                        }
                    },
                    style: {
                        marginLeft: '3px'

                    }
                },

                /**{
                             xtype: "label",
                             html: '姓   名：',
                             style: {
                                 marginTop: '3px',
                                 marginLeft: '5px',
                             }
                         }, {
                             xtype: "combo",
                             name: "EmpId",
                             hiddenName: "EmpId",
                             anchor: "100%",
                             triggerAction: 'all',
                             store: emp_store,
                             width: 150,
                             valueField: 'ID',
                             displayField: 'Title',
                             enableKeyEvents: true,
                             selectOnFocus: true,
                             allowBlank: true,
                             forceSelection: true,
                             listeners: {
                                 "keyup": function (v) {
                                     emp_store.load({
                                         params: { eName: v.getRawValue() }
                                     });
                                 },
                                 'select': function () {
                                     if (pd_top_form.find('name', 'EmpId')[0].value != 0) {
                                         pd_top_form.getForm().findField('DeptId').setValue("");
                                     }
                                 }
                             }
                         }, **/

                {
                    xtype: "button",
                    boxMinWidth: 70,
                    style: "margin-left:30px",
                    width: 70,
                    text: " 随 机 抽 查",
                    handler: function() {
                        RandomSearch();
                    }
                }
            ]
        }]

    }]
});
pd_top_form.getForm().findField('comboYear').setValue(newyear);
pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);

var ImageStore = new Ext.data.JsonStore({
    autoload: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=queryEmployeeImg&sid=' + Sys.sid,
    root: 'ImageResult',
    fields: [{
        name: "src",
        mapping: "src"
    }],
    listeners: {
        load: function(store, record) {
            if (record[0].data["src"] == "") {
                ImageView.tpl = imageTpl1;
                ImageView.refresh();
            } else {
                ImageView.tpl = imageTpl;
                ImageView.refresh();
            }
        }
    }
});
var imageTpl = new Ext.XTemplate(
    '<tpl for=".">',
    '<div style="margin-bottom: 10px; text-align:center" class="thumb-wrap">',
    '<img width=217px src="{src}" />',
    '</div>',
    '</tpl>'
);
var imageTpl1 = new Ext.XTemplate(
    '<tpl for=".">',
    '<div style="margin-bottom: 10px;" class="thumb-wrap">',
    '<div style="text-align:center;font-size:20px;color:#F00;font-weight:bold;">无图片</div>',
    '</div>',
    '</tpl>'
);
var ImageView = new Ext.DataView({
    store: ImageStore,
    tpl: imageTpl,
    region: 'center',
    itemSelector: 'div.thumb-wrap'
});


var pd_left_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: true,
    autoScroll: true,
    labelWidth: 50,
    labelAlign: 'right',
    layout: 'border',
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        region: 'north',
        height: 200,
        autoScroll: false,
        //defaultType: 'textfield',
        defaults: {
            labelAlign: "right",
            width: 5
        },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.9,
            style: 'margin-top:10px;',
            items: [{
                xtype: "textfield",
                fieldLabel: "门  店",
                name: "Dept",
                readOnly: true,
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "工  号",
                name: "EmployeeCode",
                readOnly: true,
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "姓  名",
                name: "EmployeeName",
                readOnly: true,
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "性  别",
                name: "Sex",
                readOnly: true,
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "年  龄",
                name: "Age",
                readOnly: true,
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "职  务",
                name: "Duty",
                readOnly: true,
                anchor: "100%"
            }]
        }]
    }, ImageView]
});



function RendererCell(value, m, record, rowIndex, columnIndex, store) {
   
    var html = "";
    if (value == null || value == "") {
        return "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;' ></div>";
    }
    value = value.split(",");
    if (value[0] == -1) {
        m.css = "x-grid-back-qq";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;' >缺勤</div>";
    } else if (value[0] == 0) {
        m.css = "x-grid-back-bai";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>白班</div>";
    } else if (value[0] == 1) {
        m.css = "x-grid-back-ban";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>晚班</div>";
    } else if (value[0] == 2) {
        m.css = "x-grid-back-xiu";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>休息</div>";
    } else if (value[0] == 3) {
        m.css = "x-grid-back-jia";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>请假</div>";
    } else if (value[0] == 4) {
        m.css = "x-grid-back-wpb";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>未排班</div>";
    } else if (value[0] == 5) {
        m.css = "x-grid-back-tong";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>通班</div>";
    } else if (value[0] == 6) {
        m.css = "x-grid-back-zhong";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>中班</div>";
    } else if (value[0] == 7) {
        m.css = "x-grid-back-pei";
        html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>培训</div>";
    } else if (value[0] == 41) {
        m.css = "x-grid-back-ban";
        html = "<div style='height:90px;'><h2 style='width:100%;height:80px;text-align:center;line-height:80px;font-size:18px;font-weight:bold;' ext:qtitle='补录原因' ext:qtip='" + value[1] + "'>补录</h2><div style='text-align:center;line-height:10px;'>(未排班)</div></div>";
    } else if (value[0] != "") {

        if (value[6] == 4) {
            m.css = "x-grid-back-wpb";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>未排班</div>";
        } else if (value[6] == 2) {
            m.css = "x-grid-back-xiu";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>休息</div>";
        } else if (value[6] == 3) {
            m.css = "x-grid-back-jia";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>请假</div>";
        } else if (value[6] == 5) {
            m.css = "x-grid-back-tong";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>通班</div>";
        } else if (value[6] == 1) {
            m.css = "x-grid-back-ban";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>晚班</div>";
        } else if (value[6] == 6) {
            m.css = "x-grid-back-zhong";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>中班</div>";
        } else if (value[6] == 7) {
            m.css = "x-grid-back-pei";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>培训</div>";
        } else if (value[6] == 0) {
            m.css = "x-grid-back-bai";
            html = "<div style='height:90px;text-align:center;line-height:90px;font-size:18px;font-weight:bold;'>白班</div>";
        }

    }
    if (value[0] != null && value[0].indexOf("jpg4") > 0) {
        if (value[2] == value[3]) {
            if (value[2] > "12:00") {
                value[0] = "";
                value[2] = "";
            } else {
                value[7] = "";
                value[3] = "";
            }
        }
        m.css = "x-grid-back-wpb";

        html = "<table><tr><td><img style='height:70px;width:100%;' src='" + value[0] + "' ondblclick='showMorePic("+rowIndex+","+columnIndex+")' /></td></tr><tr><td><img style='height:70px;width:100%;' src='" + value[7] + "' ondblclick='showMorePic("+rowIndex+","+columnIndex+")'/></td></tr></table><table style='width:100%;'><tr><td style='text-align:left'>" + value[1] + "</td><td style='text-align:right'>" + value[4] + "</td> </tr> <tr> <td style='text-align:left'>" + value[2] + "</td><td style='text-align:right'>" + value[3] + "</td></tr></table>";

    } else if (value[0] != null && value[0].indexOf("jpg") > 0) {
        if (value[2] == value[3]) {
            if (value[2] > "12:00") {
                value[2] = "";
                value[0] = "";
            } else {
                value[3] = "";
                value[7] = "";
            }
        }
        m.css = "x-grid-back-wpb";

        //            html = "<table><tr> <td colspan='2'><img style='height:90px;width:100%;'  src=" + item[0] + "></td></tr><tr><td style='text-align:left'>"+item[1]+"</td><td style='text-align:right'>"+item[4]+"</td> </tr> <tr> <td style='text-align:left'>"+item[2]+"</td><td style='text-align:right'>"+item[3]+"</td></tr></table>";
        html = "<table><tr><td><img style='height:70px;width:100%;' src='" + value[0] + "' ondblclick='showMorePic("+rowIndex+","+columnIndex+")'/></td></tr><tr><td><img style='height:70px;width:100%;' src='" + value[7] + "' ondblclick='showMorePic("+rowIndex+","+columnIndex+")'/></td></tr></table><table style='width:100%;'><tr><td style='text-align:left'>" + value[1] + "</td><td style='text-align:right'>" + value[4] + "</td> </tr> <tr> <td style='text-align:left'>" + value[2] + "</td><td style='text-align:right'>" + value[3] + "</td></tr></table>";

    }
    return html;
}



var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [{
        header: '星期一',
        dataIndex: 'Mon',
        width: 125,
        renderer: function(value, m, record, rowIndex, columnIndex, stroe) {
            return RendererCell(value, m, record, rowIndex, columnIndex, stroe);
        },
        align: 'center'
    }, {
        header: "星期二",
        dataIndex: "Tue",
        width: 125,
        renderer: function(value, m, record, rowIndex, columnIndex, stroe) {
            return RendererCell(value, m, record, rowIndex, columnIndex, stroe);
        },
        align: 'center'
    }, {
        header: "星期三",
        dataIndex: "Wed",
        width: 125,
        renderer: function(value, m, record, rowIndex, columnIndex, stroe) {
            return RendererCell(value, m, record, rowIndex, columnIndex, stroe);
        },
        align: 'center'
    }, {
        header: "星期四",
        dataIndex: "Thu",
        width: 125,
        renderer: function(value, m, record, rowIndex, columnIndex, stroe) {
            return RendererCell(value, m, record, rowIndex, columnIndex, stroe);
        },
        align: 'center'
    }, {
        header: "星期五",
        dataIndex: "Fri",
        width: 125,
        renderer: function(value, m, record, rowIndex, columnIndex, stroe) {
            return RendererCell(value, m, record, rowIndex, columnIndex, stroe);
        },
        align: 'center'
    }, {
        header: "<font style='color:red;'>星期六</font>",
        dataIndex: "Sat",
        width: 125,
        renderer: function(value, m, record, rowIndex, columnIndex, stroe) {
            return RendererCell(value, m, record, rowIndex, columnIndex, stroe);
        },
        align: 'center'
    }, {
        header: "<font style='color:red;'>星期日</font>",
        dataIndex: 'Sun',
        width: 125,
        renderer: function(value, m, record, rowIndex, columnIndex, stroe) {
            return RendererCell(value, m, record, rowIndex, columnIndex, stroe);
        },
        align: 'center'
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=queryAttendancePhotoCheck&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [{
            name: 'Mon',
            mapping: 'Mon'
        }, {
            name: 'Tue',
            mapping: 'Tue'
        }, {
            name: 'Wed',
            mapping: 'Wed'
        }, {
            name: "Thu",
            mapping: "Thu"
        }, {
            name: "Fri",
            mapping: "Fri"
        }, {
            name: "Sat",
            mapping: "Sat"
        }, {
            name: "Sun",
            mapping: "Sun"
        }]
    })
});
/** 
 * 查询数据
 */
function RandomSearch() {
    Ext.Ajax.request({
        url: '../Apis/AttendanceMgr.aspx?actionName=queryEmplyeeInform&sid=' + Sys.sid,
        params: {
            searchYear: pd_top_form.find('name', 'comboYear')[0].value,
            searchMonth: pd_top_form.find('name', 'comboMonth')[0].value,
            searchDept: pd_top_form.find('name', 'DeptId')[0].value,
            searchEmp: pd_top_form.find('name', 'EmpId')[0].value
        },
        success: function(response, option) {
            var rs = Ext.decode(response.responseText);
            if (rs.success) {
                pd_left_form.getForm().findField('Dept').setValue(rs.DeptTitle);
                pd_left_form.getForm().findField('EmployeeCode').setValue(rs.Code);
                pd_left_form.getForm().findField('EmployeeName').setValue(rs.Title);
                pd_left_form.getForm().findField('Sex').setValue(rs.Sex);
                pd_left_form.getForm().findField('Age').setValue(rs.Age);
                pd_left_form.getForm().findField('Duty').setValue(rs.Duty);
                ImageStore.removeAll();
                ImageStore.load({
                    params: {
                        EmployeeCode: rs.Code
                    }
                });
                pd_top_form.getForm()
                pd_store.load({
                    params: {
                        searchYear: pd_top_form.find('name', 'comboYear')[0].value,
                        searchMonth: pd_top_form.find('name', 'comboMonth')[0].value,
                        EmployeeID: rs.EmployeeID
                    }
                });

            } else {
                pd_left_form.getForm().findField('Dept').setValue("");
                pd_left_form.getForm().findField('EmployeeCode').setValue("");
                pd_left_form.getForm().findField('EmployeeName').setValue("");
                pd_left_form.getForm().findField('Sex').setValue("");
                pd_left_form.getForm().findField('Age').setValue("");
                pd_left_form.getForm().findField('Duty').setValue("");
                ImageStore.removeAll();
                pd_store.removeAll();
                Ext.MessageBox.alert("提示", rs.msg);
                return;
            }
        },
        failure: function() {
            Ext.MessageBox.alert("提示", "获取员工信息异常!");
            return;
        }
    });

}

var pictureImageStore = new Ext.data.Store({
    url: '../Apis/AttendanceMgr.aspx?actionName=searchCheckinImag&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "PhotoFileName",
            mapping: "PhotoFileName"
        }, {
            name: "CheckinTime",
            mapping: "CheckinTime"
        }]
    }),
    sortInfo: {
        field: 'CheckinTime',
        direction: 'ASC'
    }
});

var pd_grid = new Ext.grid.EditorGridPanel({
    store: pd_store,
    cm: cm,
    //sm: sm,
    margins: "2 2 2 2",
    border: false,
    bodyBorder: false,
    loadMask: true,
    listeners: {
        cellclick: function(grid, row, col, event) {


            var record = pd_grid.getStore().getAt(row);
            var fieldName = pd_grid.getColumnModel().getDataIndex(col);
            var src = record.get(fieldName);

            if (src.indexOf(".jpg") > 0) {
                src = record.get(fieldName).replace(".jpg4", ".jpg");

                var split = src.split(',');
                src = split[0].substring(7, split[0].length);
                var arr = src.split('/');
                //console.log(arr);
                if (picImageView.getStore() != null && typeof(picImageView.getStore()) != "undefined") {
                    //picImageView.getStore().loadData([[src,src]]);
                    if (arr != null && arr.length == 5) {

                        picImageView.getStore().load({
                            params: {
                                checkinTime: arr[3],
                                EmployeeCode: pd_left_form.find('name', 'EmployeeCode')[0].value
                            }
                        });

                        pictureWindow.show();





                    }



                }



            }
        }
    }

});

//    pictureImageStore.addListener('load', function(st, rds, opts) {
//                          
//                          picfrom.getForm().findField('DepID').setValue(pictureImageStore.data.items[0].json.Title);
//                          picfrom.getForm().findField('paiban').setValue(pictureImageStore.data.items[0].json.Scheduling);
//                            picfrom.getForm().findField('chenkinsatrt').setValue(pictureImageStore.data.items[0].json.CheckinTime);
//                              picfrom.getForm().findField('chenkinend').setValue(pictureImageStore.data.items[0].json.CheckinTimeEnd);
//    });



pd_store.on('beforeload', function(thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    this.baseParams = pd_top_form.getForm().getValues();
});
/**var pictureImageStore = new Ext.data.ArrayStore({
    fields: ['src'],
    data: []
});**/



//
var picImageTpl = new Ext.XTemplate(
    '<tpl for=".">',

    '<div style="margin-bottom: 10px;" class="thumb-wrap"  >',
    '<img width=610px src="http://jf.wenfeng.com.cn/Imgs/Checkin/{PhotoFileName}" />',

    '</div>',
    '</tpl>'
);

var picImageView = new Ext.DataView({
    store: pictureImageStore,
    tpl: picImageTpl,
    region: 'center',
    itemSelector: 'div.thumb-wrap'
});


//var picfrom = new Ext.form.FormPanel({
//    //frame: true,
//    bodyBorder: false,
//    border: true,
//    autoScroll: true,
//    //autoWidth:true,
//    items: [{
//        autoScroll: false,
//        //defaultType: 'textfield',
//        defaults: { labelAlign: "right", width: 5 },
//        //bodyBorder:false,
//        layout: "column",
//        items: [
//       
//            {
//                layout: "form",
//                columnWidth: 0.9,
//                style: 'margin-top:10px;',
//                items: [ picImageView,{
//                    xtype: "textfield",
//                    fieldLabel: "门 店",
//                    name: "DepID",
//                    readOnly: true,
//                    anchor: "100%"
//                }, {
//                    xtype: "textfield",
//                    fieldLabel: "排 班",
//                    name: "paiban",
//                    readOnly: true,
//                    anchor: "100%"
//                }, {
//                    xtype: "textfield",
//                    fieldLabel: "上 班",
//                    name: "chenkinsatrt",
//                    readOnly: true,
//                    anchor: "100%"
//                }, {
//                    xtype: "textfield",
//                    fieldLabel: "下 班",
//                    name: "chenkinend",
//                    readOnly: true,
//                    anchor: "100%"
//                }]
//                       
//            }
//        ]
//        }]
//    });








//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 90,
        layout: "fit",
        border: false,
        items: [pd_top_form]
    }, {
        frame: true,
        region: 'west',
        width: 230,
        layout: "fit",
        autoScroll: true,
        border: true,
        items: [pd_left_form]
    }, {
        layout: "fit",
        region: 'center',
        border: false,
        anchor: '-1 -140',
        items: [pd_grid]
    }]
});

var pictureWindow = new Ext.Window({
    title: ' 图片浏览',
    width: 655,
    height: 545,
    modal: true,
    autoScroll: true,
    closable: false,
    items: picImageView,
    layout: 'fit',
    buttons: [{
        text: '关闭',
        handler: function() {
            pictureWindow.hide();
        }
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();



function showMorePic(row, col, event) {


    var record = pd_grid.getStore().getAt(row);
    var fieldName = pd_grid.getColumnModel().getDataIndex(col);
    var src = record.get(fieldName);

    if (src.indexOf(".jpg") > 0) {
        src = record.get(fieldName).replace(".jpg4", ".jpg");

        var split = src.split(',');
        src = split[0].substring(7, split[0].length);
        var arr = src.split('/');
        //console.log(arr);
        if (picImageView.getStore() != null && typeof(picImageView.getStore()) != "undefined") {
            //picImageView.getStore().loadData([[src,src]]);
            if (arr != null && arr.length == 5) {

                picImageView.getStore().load({
                    params: {
                        checkinTime: arr[3],
                        EmployeeCode: pd_left_form.find('name', 'EmployeeCode')[0].value
                    }
                });

                pictureWindow.show();
            }



        }



    }

}
