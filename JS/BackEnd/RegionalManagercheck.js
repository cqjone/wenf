var start = 0 //起始记录
var limit = 50 //每页记录

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
                    html: '<font style="color:red;">1、日期、员工为必填项.</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '4px'
                    }
                }
                ]
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
            columnWidth: 0.2,
            items: [{
                xtype: "datefield",
                editable: false,
                fieldLabel: "日期",
                name: "mydate",
                msgTarget: 'side',
                allowBlank: false,
                format: "Y-m-d",
                enableKeyEvents: true,
                width: 125,
                listeners: {
                    'specialkey': function (_field, _e) {
                        debugger;
                        if (_e.getKey() == _e.ENTER) {
                            Ext.getCmp("btnSel").setDisabled(false);
                        }
                    }
                }
            }]
        }, {
            layout: 'form',
            columnWidth: 0.2,
            items: [{
                xtype: "combo",
                name: "empid",
                hiddenName: "empid",
                fieldLabel: "员 工",
                store: tar_employee,
                triggerAction: 'all',
                width: 120,
                border: 1,
                valueField: 'ID',
                msgTarget: 'side',
                allowBlank: false,
                displayField: 'CombineWord',
                enableKeyEvents: true,
                selectOnFocus: true,
                forceSelection: true,
                hideTrigger: true,
                listeners: {
                    "keyup": function (v) {
                        var value = v.getRawValue();
                        if (value != null && value.length >= 1) {
                            tar_employee.load({
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
            }
            ]
        },
            {
                width: 100,
                style: {
                    marginTop: '-5px'
                },
                buttons: [{
                    id: "btnSel",
                    text: "查 询",
                    listeners: {
                        click: function () {
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
        var empid = pd_top_form.find("name", "empid")[0].getValue();

        pd_store.load({
            params: {
                sid: Sys.sid,
                start: start,
                limit: limit,
                empid: empid,
                mydate: mydate
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
            header: '<center><font style="font-weight:bold">日期</font></center>',
            align: 'center',
            dataIndex: '日期',
            width: 100,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">星期</font></center>',
            dataIndex: "星期",
            align: 'center',
            width: 80,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">照片</font></center>',
            dataIndex: "照片",
            align: 'center',
             width: 300,
            renderer: function (value, m) {
                if (value != null) {
                    m.css = 'x-grid-back-wpb';
                    return String.format("<image src='" + "http://jf.wenfeng.com.cn/Imgs/Checkin/" + value + "' height='168' style='cursor:pointer'     />");
                } else {
                    m.css = 'x-grid-back-wpb';
                    return RenderDayStatus(value, m);
                }
            }
        }, {
            header: '<center><font style="font-weight:bold">门店</font></center>',
            dataIndex: "门店",
            align: 'center',
            width: 120,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }, {
            header: '<center><font style="font-weight:bold">时长</font></center>',
            dataIndex: "时长",
            align: 'center',
            width: 120,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                var num = parseInt(value);
                var hours =  Math.floor((num/60));
                var minutes = num % 60;

                return hours+"小时"+minutes+"分";
            }
        }, {
            header: '<center><font style="font-weight:bold">进店时间</font></center>',
            dataIndex: "进店时间",
            align: 'center',
            width: 120,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }
        , {
            header: '<center><font style="font-weight:bold">出店时间</font></center>',
            dataIndex: "出店时间",
            align: 'center',
            width: 120,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }
        , {
            header: '<center><font style="font-weight:bold">DeptID</font></center>',
            dataIndex: "DeptID",
            hidden: true,
            align: 'right',
            width: 120,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }

        , {
            header: '<center><font style="font-weight:bold">EmployeeID</font></center>',
            dataIndex: "EmployeeID",
            align: 'right',
            hidden: true,
            width: 120,
            renderer: function (value, m) {
                m.css = 'x-grid-back-wpb';
                return value;
            }
        }
    ]
});


var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/ReguinalManagercheck.aspx?actionName=getRegionalManagercheckData&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [{
            name: "日期",
            mapping: "日期"
        }, {
            name: "星期",
            mapping: "星期"
        }, {
            name: '照片',
            mapping: '照片'
        }, {
            name: '门店',
            mapping: '门店'
        }, {
            name: '时长',
            mapping: '时长'
        }, {
            name: '进店时间',
            mapping: '进店时间'
        }, {
            name: '出店时间',
            mapping: '出店时间'
        }
            , {
                name: 'DeptID',
                mapping: 'DeptID'
            }
            , {
                name: 'EmployeeID',
                mapping: 'EmployeeID'
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
    bbar: new Ext.PagingToolbar({
        pageSize: limit,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});


var EmployeeID = "";
var DeptID = "";

var rowclickFn = function (pd_main_panel, rowIndex, e) {
    debugger;
    var selectionModel = pd_grid.getSelectionModel();
    var record = selectionModel.getSelected();
    EmployeeID = record.data['EmployeeID'];
    DeptID = record.data['DeptID'];
}


var imgList = "";
var ImageStore = new Ext.data.JsonStore({
    autoload: true,
    url: '../Apis/ReguinalManagercheck.aspx?actionName=getRegionalManagercheckpicture&sid=' + Sys.sid,
    root: 'results',
    fields: [
        {name: "照片", mapping: "照片"}
    ],
    listeners: {
        load: function (store, record) {
            debugger;
            if (record.length > 0) {
                for (var t = 0; t < record.length; t++) {
                    imgList += "<img src='" + "http://jf.wenfeng.com.cn/Imgs/Checkin/" + record[t].data["照片"] + "' width='860'>";
                }
            }

            showpicture();


        }
    }
});

//显示图片
function showPhoto() {
    rowclickFn();
    var mydate = pd_top_form.find("name", "mydate")[0].getValue();
    var postdata = {};
    postdata["EmployeeID"] = EmployeeID;
    postdata["DeptID"] = DeptID;
    postdata["mydate"] = mydate;


    ImageStore.load({
        params: {
            sid: Sys.sid,
            EmployeeID: EmployeeID,
            DeptID: DeptID,
            mydate: mydate
        }
    });

//            	$.ajax({
//                        type: "post",
//                        url:  '../Apis/ReguinalManagercheck.aspx?actionName=getRegionalManagercheckpicture&sid=' + Sys.sid,
//                        data: postdata,
//                        success: function (msg) {
//                            if (msg != null) {
//                            debugger;
//                            alert(msg);
//                            }
//                        }
//                    });


//            


}

function showpicture() {
    var panel = new Ext.Panel({
        width: 880,
        height: 500,
        autoScroll: true,
        html: "<div> <img src='" + imgList + "' width='880'> </div>"

    });

    var win = new Ext.Window({
        width: 900,
        height: 'auto',
        title: ' 门店照片浏览',

        modal: true,
        autoScroll: false,
        buttons: [{
            text: '关闭',
            handler: function () {
                win.close();
            }
        }
        ],
        items: panel,
        closable: false,
    });

    win.show();
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
