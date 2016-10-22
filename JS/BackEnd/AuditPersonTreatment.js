//时间的年份月份
var queryYear = "";
var queryMonth = "";

//考勤标准ID
var AttendanceID = "";
var myDate = new Date();
var Year = myDate.getFullYear();
var Month = myDate.getMonth() + 1;

var IsFalse = "";

//补贴ID
var SubsidyID = "";
//奖金ID
var BounsID = "";

//职位下拉框
var RankStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["1", "实习期"],
        ["2", "初级"],
        ["3", "中级"],
        ["4", "高级"],
        ["5", "普通"],
    ]
});
var RankCom = new Ext.form.ComboBox({
    name: "Rank",
    store: RankStore,
    hiddenName: "Rank",
    width: 100,
    margin: '0 0 0 20',
    mode: 'local',
    value: 'ID',
    triggerAction: 'all',
    valueField: 'Title',
    displayField: 'Title',
    editable: false
});
//工资周期
var CycleStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["1", "每天"],
        ["2", "每月"],
    ]
});

var CycleCom = new Ext.form.ComboBox({
    name: "Rank",
    store: CycleStore,
    hiddenName: "Rank",
    width: 100,
    margin: '0 0 0 20',
    mode: 'local',
    value: 'ID',
    triggerAction: 'all',
    valueField: 'Title',
    displayField: 'Title',
    editable: false
});


//            //Ext的总体高
//            var ExtHeight = document.documentElement.clientHeight-175;



//       ------------------------------------------------------------------------------ 考勤标准------------------------------------------------------------------------------------------------     



//            
//            
//          var AttendanceList = ["ID","月份自然日", "标准工作日","本市搬家日","跨市搬家日" ];

//        var Attendance_store = new Ext.data.Store({
//     
//			url: "../Apis/AuditPersonTreatment.aspx?actionName=GetAttendanceList",
//			reader : new Ext.data.JsonReader({
//			        root: "results",
//                    id: "ID",
//                    totalProperty: "totalCount",
//			fields: AttendanceList,
//				
//			}),
//			 groupField: 'ID',
//			 sortInfo: { field: 'ID', direction: "ASC" }
//		});
//		
//	 Attendance_store.load({ params: { queryYear: queryYear, queryMonth: queryMonth}});    //载入数据。
//   
//    var Attendancecm = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
//                      new Ext.grid.RowNumberer(),                     //自动编号。
//                     //sm,//复选框。
//                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
//                     { header: '<b>月份自然日</b>', align: "right", width:150, dataIndex: '月份自然日'  },
//                     { header: '<b>标准工作日</b>', align: "right", width:150, dataIndex: '标准工作日' ,
//                                editor : new Ext.form.NumberField({
//				                    	regex :/^\d+$/,
//					                    nanText : '只能输入数字!'
//				                })},
//                     { header: '<b>本市搬家日</b>', align: "right",width:150, dataIndex: '本市搬家日' ,
//                                editor : new Ext.form.NumberField({
//				                    	regex :/^\d+$/,
//					                    nanText : '只能输入数字!'
//					                     })
//				                } , { header: '<b>跨市搬家日</b>', align: "right", width:150, dataIndex: '跨市搬家日' ,
//                                editor : new Ext.form.NumberField({
//				                    	regex :/^\d+$/,
//					                    nanText : '只能输入数字!'
//				                })}
//				           
//				 
//            ]);
//   
//      var Attendancesm = new Ext.grid.CheckboxSelectionModel();
//     //显示内容
//    var Body_grid0 = new Ext.grid.EditorGridPanel({
//			store : Attendance_store,
//			title:'考勤标准:',
//			cm : Attendancecm,
//			sm : Attendancesm,
//			  stripeRows:true,
//              border:true,
//              collapsible: true,
//             autoScroll: true,
//             height: 70,
//			//selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
//			//sm: sm,
////			loadMask : true,
//		});






//       ------------------------------------------------------------------------------工资标准------------------------------------------------------------------------------------------------     

var Roomfields = ["ID", "职位", "级别", "基本工资", "基本工资周期", "管理费(每店)", "工龄工资(每年)", "工龄工资封顶", "扣生活费", "休息日(天)", "备注"];
var storeDate = new Ext.data.Store({
    url: "../Apis/AuditPersonTreatment.aspx?actionName=GetBaseList",
    reader: new Ext.data.JsonReader({
        fields: Roomfields,
        root: "results",
        id: "ID",
        totalProperty: "totalCount"
    }),
    groupField: 'ID',
    sortInfo: {
        field: 'ID',
        direction: "ASC"
    }
});

var colModel = new Ext.grid.ColumnModel([ //创建GridPanel中的列集合。
    new Ext.grid.RowNumberer(), //自动编号。
    //sm,                                                              //复选框。
    {
        header: 'ID',
        align: "center",
        dataIndex: 'ID',
        hidden: true
    }, //这个编号是ds中的创建的id。
    {
        header: '<font style="font-weight:bold;">职位</font>',
        width: 100,
        align: "left",
        dataIndex: '职位'
    }, {
        header: '<font style="font-weight:bold;">级别</font>',
        width: 100,
        align: "left",
        dataIndex: '级别',
        editor: RankCom
    }, {
        header: '<font style="font-weight:bold;">基本工资</font>',
        width: 100,
        align: "right",
        dataIndex: '基本工资',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<font style="font-weight:bold;">基本工资周期</font>',
        width: 100,
        align: "left",
        dataIndex: '基本工资周期',
        editor: CycleCom
    }, {
        header: '<font style="font-weight:bold;">管理费(每店)</font>',
        width: 100,
        align: "right",
        dataIndex: '管理费(每店)',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<font style="font-weight:bold;">工龄工资(每年)</font>',
        width: 100,
        align: "right",
        dataIndex: '工龄工资(每年)',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<font style="font-weight:bold;">工龄工资封顶</font>',
        width: 100,
        align: "right",
        dataIndex: '工龄工资封顶',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<font style="font-weight:bold;">扣生活费</font>',
        width: 100,
        align: "right",
        dataIndex: '扣生活费',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<font style="font-weight:bold;">休息日(天)</font>',
        width: 100,
        align: "right",
        dataIndex: '休息日(天)',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<font style="font-weight:bold;">备注</font>',
        width: 100,
        align: "left",
        dataIndex: '备注',
        editor: true
    },


]);

Body_grid = new Ext.grid.EditorGridPanel({
    title: '工资标准:',
    store: storeDate, //创建GridPanel 并设置store数据。
    cm: colModel,
    stripeRows: true,
    border: true,
    collapsible: true,
    //sm: sm,                                                   //复选框，有了这个可以全选
    autoScroll: true,
    height: 160,

});
storeDate.load({
    params: {
        queryYear: queryYear,
        queryMonth: queryMonth
    }
}); //载入数据。
//       ------------------------------------------------------------------------------补贴标准------------------------------------------------------------------------------------------------     


var SubsidyList = ["ID", "补贴类型", "补贴金额(元/天)", "备注"];

var Subsidy_store = new Ext.data.Store({

    url: "../Apis/AuditPersonTreatment.aspx?actionName=GetSubsidyList",
    reader: new Ext.data.JsonReader({
        root: "results",
        id: "ID",
        totalProperty: "totalCount",
        fields: SubsidyList,

    }),
    groupField: 'ID',
    sortInfo: {
        field: 'ID',
        direction: "ASC"
    }
});

var Subsidycm = new Ext.grid.ColumnModel([ //创建GridPanel中的列集合。
    new Ext.grid.RowNumberer(), //自动编号。
    //sm,//复选框。
    {
        header: 'ID',
        align: "left",
        dataIndex: 'ID',
        hidden: true,
    }, {
        header: '<b>补贴类型</b>',
        align: "left",
        id: "SubidyType",
        width: 200,
        dataIndex: '补贴类型'
    }, {
        header: '<b>补贴金额(元/天)</b>',
        align: "right",
        id: "SubidyBouns",
        width: 150,
        dataIndex: '补贴金额(元/天)',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<b>备注</b>',
        align: "left",
        width: 200,
        dataIndex: '备注',
        editor: true
    },
    //                     { header: '<b>备注</b>', align: "center", dataIndex: '' , renderer:function(v){  
    //           return "<a  onclick='SubsidyShow()'id:'hideremark', style='text-decoration:underline;cursor:pointer;color:blue;'>备注</a>";    
    //        }  
    //                     },
]);

var sm = new Ext.grid.CheckboxSelectionModel();
//显示内容
var Body_grid2 = new Ext.grid.EditorGridPanel({
    title: '补贴标准:',
    store: Subsidy_store,
    sm: sm,
    cm: Subsidycm,
    region: 'center',
    stripeRows: true,
    border: true,
    collapsible: true,
    //sm: sm,                                                   //复选框，有了这个可以全选
    autoScroll: true,
    height: 140,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
    //loadMask : true,
});
Subsidy_store.load({
    params: {
        queryYear: queryYear,
        queryMonth: queryMonth
    }
}); //载入数据。

var SubidyType = "";
var SubidyBouns = "";
var ReamrkSubidy = "";


var rowclickFnSubsidy = function() {
    var selectionModel = Body_grid2.getSelectionModel();
    var record = selectionModel.getSelected();
    var ID = record.data['ID'];
    var subidyType = record.data['补贴类型'];
    var subidyBouns = record.data['补贴金额(元/天)'];
    var reamrkSubidy = record.data['备注'];

    //补贴ID
    SubsidyID = ID;
    SubidyType = subidyType;
    SubidyBouns = subidyBouns;
    ReamrkSubidy = reamrkSubidy;
}

//添加备注 SubsidyRemark
function SubsidyShow() {

    rowclickFnSubsidy();
    var win = new Ext.Window({
        title: '添加补贴备注',
        id: "windowsID",
        collapsible: true,
        width: 350,
        //height: 400,
        //maximizable: true,
        autoScroll: true,
        modal: true,
        items: [{
            xtype: "panel",
            baseCls: "x-plain",
            layout: "column",
            items: [{
                //columnWidth: 300,
                layout: "form",
                defaults: {
                    xtype: "textfield",
                    id: "subidyType",
                    width: 250,
                    disabled: true
                },
                labelWidth: 70,
                items: [{
                    fieldLabel: "&nbsp;补贴类型",
                }, ]
            }, {
                //columnWidth: 300,
                layout: "form",
                defaults: {
                    xtype: "textfield",
                    id: "subidyBouns",
                    width: 250,
                    disabled: true
                },
                labelWidth: 70,
                items: [{
                    fieldLabel: "&nbsp;补贴金额(元/天)",
                }, ]
            }, {
                //columnWidth: 300,
                layout: "form",
                defaults: {
                    xtype: "textarea",
                    id: "remarkSubidy",
                    grow: true,
                    width: 250,
                    autoHeight: true,
                },
                labelWidth: 70,
                items: [{
                    fieldLabel: "&nbsp;补贴备注"
                }, ]
            }],
            buttons: [{
                text: "保  存",
                id: "SubidySave",
                //minWidth: 70,
                //style: 'margin-right:150px',
                handler: function() {
                    var Remark = Ext.getCmp("remarkSubidy").getValue();
                    UpdateSubsidy(SubsidyID, Remark)
                }
            }, {
                text: "关  闭",
                //minWidth: 70,
                style: 'margin-right:40px',
                //qtip: "重置数据",
                handler: function() {
                    Ext.getCmp("windowsID").close();
                }
            }]

        }],
    });
    win.show();
    if (IsFalse != "") {
        Ext.getCmp("SubidySave").setDisabled(true);
    }
    Ext.getCmp("subidyType").setValue(SubidyType);
    Ext.getCmp("subidyBouns").setValue(SubidyBouns);
    Ext.getCmp("remarkSubidy").setValue(ReamrkSubidy);
}

//添加补贴备注方法
function UpdateSubsidy(SubsidyID, Remark) {
    var UpdateSubsidyarray = new Array();
    UpdateSubsidyarray[0] = SubsidyID;
    UpdateSubsidyarray[1] = Remark;
    Ext.getBody().mask("正在保存！请稍候！");
    var Subsidydata = Ext.encode(UpdateSubsidyarray);
    Ext.Ajax.request({
        url: '../Apis/AuditPersonTreatment.aspx?actionName=updateDataSubsidyRemark&sid' + Sys.sid,
        params: {
            UpdateSubsidyarray: Subsidydata
        },
        success: function(response, options) {
            Subsidy_store.load({
                params: {
                    queryYear: queryYear,
                    queryMonth: queryMonth
                }
            }); //载入数据。
            Ext.getCmp("windowsID").close(); //关闭弹出框
            Ext.getBody().unmask();
        },
        failure: function(response, options) {
            Ext.getBody().unmask();
        }
    });
}


//       ------------------------------------------------------------------------------奖金标准------------------------------------------------------------------------------------------------     




var BonusList = ["ID", "StartIndex", "EndIndex", "BonusIndex", "备注"];

var Bonus_store = new Ext.data.Store({

    url: "../Apis/AuditPersonTreatment.aspx?actionName=GetBonusList",
    reader: new Ext.data.JsonReader({
        root: "results",
        id: "ID",
        totalProperty: "totalCount",
        fields: BonusList,

    }),
    groupField: 'ID',
    sortInfo: {
        field: 'ID',
        direction: "ASC"
    }
});

var Bonuscm = new Ext.grid.ColumnModel([ //创建GridPanel中的列集合。
    new Ext.grid.RowNumberer(), //自动编号。
    //sm,//复选框。
    {
        header: 'ID',
        align: "left",
        dataIndex: 'ID',
        hidden: true
    }, {
        header: '<b></b>',
        align: "right",
        width: 50,
        dataIndex: 'StartIndex',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<b>店内指标(万)</b>',
        align: "center",
        width: 90,
        dataIndex: 'EndIndex',
        renderer: function(v) {
            return "~";
        }
    },
    //
    {
        header: '<b></b>',
        align: "right",
        width: 50,
        dataIndex: 'EndIndex',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<b>完成指标奖金(元/店)</b>',
        align: "right",
        width: 150,
        dataIndex: 'BonusIndex',
        editor: new Ext.form.NumberField({
            regex: /^\d+$/,
            nanText: '只能输入数字!'
        })
    }, {
        header: '<b>备注</b>',
        align: "left",
        width: 200,
        dataIndex: '备注',
        editor: true
    },
    //                     { header: '<b>备注</b>', align: "center", dataIndex: '',
    //                       renderer:function(v){  
    //           return '<a  onclick="BonusShow()" id:"hideremark", style="text-decoration:underline;cursor:pointer;color:blue;">备注</a>';    
    //                    }  
    //                     },
]);

var Bonussm = new Ext.grid.CheckboxSelectionModel();
//显示内容
var Body_grid3 = new Ext.grid.EditorGridPanel({
    store: Bonus_store,
    title: '奖金标准:',
    cm: Bonuscm,
    sm: Bonussm,
    stripeRows: true,
    border: true,
    collapsible: true,
    autoScroll: true,
    height: 140,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
    //sm: sm,
    //			loadMask : true,
});

Bonus_store.load({
    params: {
        queryYear: queryYear,
        queryMonth: queryMonth
    }
}); //载入数据。

var StartIndex = "";
var EndIndex = "";
var BonusIndex = "";
var ReamrkBouns = "";
var rowclickFnBouns = function() {
    var selectionModel = Body_grid3.getSelectionModel();
    var record = selectionModel.getSelected();
    var ID = record.data['ID'];
    var startIndex = record.data['StartIndex'];
    var endIndex = record.data['EndIndex'];
    var bonusIndex = record.data['BonusIndex'];
    var remarkBouns = record.data['备注'];
    //奖金ID
    BounsID = ID;
    StartIndex = startIndex;
    EndIndex = endIndex;
    BonusIndex = bonusIndex;
    ReamrkBouns = remarkBouns;
}


//添加备注 BounsRemark
function BonusShow() {
    rowclickFnBouns();
    var winBouns = new Ext.Window({
        title: '添加奖金备注',
        id: "windowsBounsID",
        collapsible: true,
        width: 350,
        //height: 400,
        //maximizable: true,
        autoScroll: true,
        modal: true,
        items: [{
            xtype: "panel",
            baseCls: "x-plain",
            layout: "column",
            items: [{
                //columnWidth: 300,
                layout: "form",
                defaults: {
                    xtype: "textfield",
                    id: "DepIndex",
                    width: 250,
                    disabled: true
                },
                labelWidth: 70,
                items: [{
                    fieldLabel: "&nbsp;店内指标(万)",
                }, ]
            }, {
                //columnWidth: 300,
                layout: "form",
                defaults: {
                    xtype: "textfield",
                    id: "IndexBouns",
                    width: 250,
                    disabled: true
                },
                labelWidth: 70,
                items: [{
                    fieldLabel: "&nbsp;完成指标奖金(元/店)",
                }, ]
            }, {
                //columnWidth: 300,
                layout: "form",
                defaults: {
                    xtype: "textarea",
                    id: "remarkBouns",
                    grow: true,
                    width: 250,
                    autoHeight: true,
                },
                labelWidth: 70,
                items: [{
                    fieldLabel: "&nbsp;奖金备注"
                }, ]
            }],
            buttons: [{
                text: "保  存",
                id: "BounsSave",
                //minWidth: 70,
                //style: 'margin-right:150px',
                handler: function() {

                    var BounsRemark = Ext.getCmp("remarkBouns").getValue();
                    UpdateBouns(BounsID, BounsRemark)
                }
            }, {
                text: "关  闭",
                //minWidth: 70,
                style: 'margin-right:40px',
                //qtip: "重置数据",
                handler: function() {
                    Ext.getCmp("windowsBounsID").close();
                }
            }]

        }],
    });
    winBouns.show();
    if (IsFalse != "") {
        Ext.getCmp("BounsSave").setDisabled(true);
    }
    Ext.getCmp("DepIndex").setValue(StartIndex + "~" + EndIndex + "(万)");
    Ext.getCmp("IndexBouns").setValue(BonusIndex);
    Ext.getCmp("remarkBouns").setValue(ReamrkBouns);

}

//添加奖金备注方法
function UpdateBouns(BounsID, BounsRemark) {

        var UpdateBounsarray = new Array();
        UpdateBounsarray[0] = BounsID;
        UpdateBounsarray[1] = BounsRemark;

        Ext.getBody().mask("正在保存！请稍候！");
        var Bounsdata = Ext.encode(UpdateBounsarray);
        Ext.Ajax.request({
            url: '../Apis/AuditPersonTreatment.aspx?actionName=updateDataBonusRemark&sid' + Sys.sid,
            params: {
                UpdateBonusarray: Bounsdata
            },
            success: function(response, options) {
                Bonus_store.load({
                    params: {
                        queryYear: queryYear,
                        queryMonth: queryMonth
                    }
                }); //载入数据。
                Ext.getCmp("windowsBounsID").close(); //关闭弹出框
                Ext.getBody().unmask();
            },
            failure: function(response, options) {
                Ext.getBody().unmask();
            }
        });
    }
    //       ------------------------------------------------------------------------------温馨提示------------------------------------------------------------------------------------------------     






var period_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/AuditPersonTreatment.aspx?actionName=getDate&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "Title",
            mapping: "Title"
        }, {
            name: "Value",
            mapping: "Value"
        }, ]
    }),
    sortInfo: {
        field: 'Value',
        direction: 'desc'
    }
});
period_store.load();

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: false,
    heigh: 100,
    //autoWidth:true,
    autoScroll: true,
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
                    html: '<font style="color:red;">1、点击可以直接修改数据.</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '4px'
                    }
                }, {
                    xtype: "label",
                    html: '<br><font style="color:red;">&nbsp;2、选择条件刷新数据,只能操作两个月之间的数据.</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '4px'
                    }
                }]
            }

        ]
    }, {
        xtype: "fieldset",
        title: "条件",
        layout: "column",
        labelWidth: 50,
        labelAlign: 'right',
        style: {
            marginLeft: '4px',
            marginTop: '10px'
        },
        layout: "hbox",
        items: [{
                xtype: "combo",
                name: "comboPeriod",
                store: period_store,
                id: "comboPeriod",
                hiddenName: "comboPeriod",
                width: 150,
                margin: '0 0 0 20',
                mode: 'local',
                //                              mode: 'remote',
                triggerAction: 'all',
                valueField: 'Value',
                displayField: 'Title',
                editable: false,
                forceSelection: true,
                triggerAction: "all",
                listeners: {
                    'select': function() {
                        var period = pd_top_form.find("name", "comboPeriod")[0].getValue();
                        if (period != null && typeof(period) != "undefined") {
                            var arr = period.split("-");
                            queryYear = arr[0];
                            queryMonth = arr[1];
                            var now = new Date();
                            var date = now.format('Y年m月');
                            var yyear = now.getFullYear();
                            var month = now.getMonth() + 1;
                            if (month < 10) {
                                month += "0";
                            }
                            var ymonth = month;
                            if (yyear == queryYear && ymonth == queryMonth || ymonth - 1 == queryMonth) {
                                IsFalse = "";
                            } else {
                                //备注弹框内的保存按钮
                                //                                                      Ext.getCmp("hidesave").setDisabled(true);
                                IsFalse = "隐藏";
                            }

                            storeDate.load({
                                params: {
                                    queryYear: queryYear,
                                    queryMonth: queryMonth
                                }
                            });
                            Subsidy_store.load({
                                params: {
                                    queryYear: queryYear,
                                    queryMonth: queryMonth
                                }
                            });
                            Bonus_store.load({
                                params: {
                                    queryYear: queryYear,
                                    queryMonth: queryMonth
                                }
                            });
                            //                								Attendance_store.load({ params: { queryYear: queryYear, queryMonth: queryMonth}});
                            setAttendanceLevel();
                        }
                    }
                },
                //								style : {
                //											marginLeft : '50px'
                //										}
            },

            {
                xtype: "button",
                boxMinWidth: 40,
                style: "margin-left:20px;margin-Top:-25;",
                width: 60,
                id: "hidesave",
                text: " 保  存",
                handler: function() {
                    Save();
                }
            }

        ],
    }, {
        xtype: "fieldset",
        title: "考勤标准",
        style: {
            marginLeft: '4px',
            marginTop: '10px'
        },
        items: [{
                items: [{
                    xtype: "label",
                    html: Year + '<b>年</b>' + Month + '<b>月    自然日：</b>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '4px'
                    }
                }, {
                    xtype: "textfield",
                    name: "NatureDays",
                    readOnly: true,

                    width: 25,
                    height: 15,
                }, {
                    xtype: "label",
                    html: '<b>标准工作日：</b>',
                }, {
                    xtype: "numberfield",
                    name: "WorkDays",
                    width: 25,
                    height: 15,
                }, {
                    xtype: "label",
                    html: '</br></br>&nbsp;<font style="color:red;"><b>搬家日:本市搬家日：</b></font>',
                }, {
                    xtype: "numberfield",
                    name: "LocalMoveDays",
                    width: 25,
                    height: 15,
                }, {
                    xtype: "label",
                    html: '<font style="color:red;"><b>跨市搬家日：</b></font>',
                }, {
                    xtype: "numberfield",
                    name: "OtherMoveDays",
                    width: 25,
                    height: 15,
                    listeners: {

                    }
                }, ]
            },

        ]
    }]
});

//       ------------------------------------------------------------------------------保存方法------------------------------------------------------------------------------------------------     

function Save() {
    //考勤标准修改

    var WorkDays = pd_top_form.find("name", "WorkDays")[0].getValue();
    var LocalMoveDays = pd_top_form.find("name", "LocalMoveDays")[0].getValue();
    var OtherMoveDays = pd_top_form.find("name", "OtherMoveDays")[0].getValue();

    var Attendancearray = new Array();
    Attendancearray.push(AttendanceID);
    Attendancearray.push(WorkDays);
    Attendancearray.push(LocalMoveDays);
    Attendancearray.push(OtherMoveDays);
    Ext.getBody().mask("正在保存！请稍候！");
    var Attendancedata = Attendancearray;
    Ext.Ajax.request({
        url: '../Apis/AuditPersonTreatment.aspx?actionName=updateDataAttendance&sid' + Sys.sid,
        params: {
            Attendancerecords: Attendancedata,
        },
        success: function(response, options) {
            setAttendanceLevel();
            Ext.getBody().unmask();
        },
        failure: function(response, options) {
            Ext.getBody().unmask();
        }
    });

    //补贴标准修改
    var Subsidyrecords = Subsidy_store.data.items;
    var Subsidyarray = new Array();
    var reg = /^1\d{10}$/;
    for (var y = 0; y < Subsidyrecords.length; y++) {
        Subsidyarray.push(Subsidyrecords[y].data);
    }
    Ext.getBody().mask("正在保存！请稍候！");
    var Subsidydata = Ext.encode(Subsidyarray);
    Ext.Ajax.request({
        url: '../Apis/AuditPersonTreatment.aspx?actionName=updateDataSubsidy&sid' + Sys.sid,
        params: {
            Subsidyrecords: Subsidydata,
        },
        success: function(response, options) {
            Subsidy_store.load({
                params: {
                    queryYear: queryYear,
                    queryMonth: queryMonth
                }
            }); //载入数据。
            Ext.getBody().unmask();
        },
        failure: function(response, options) {
            Ext.getBody().unmask();
        }
    });



    //工资标准修改
    var records = storeDate.data.items;
    var array = new Array();

    for (var i = 0; i < records.length; i++) {
        array.push(records[i].data);
    }
    Ext.getBody().mask("正在保存！请稍候！");
    var data = Ext.encode(array);
    Ext.Ajax.request({
        url: '../Apis/AuditPersonTreatment.aspx?actionName=updateData&sid' + Sys.sid,
        params: {
            records: data
        },
        success: function(response, options) {
            storeDate.load({
                params: {
                    queryYear: queryYear,
                    queryMonth: queryMonth
                }
            }); //载入数据。
            Ext.getBody().unmask();
        },
        failure: function(response, options) {
            Ext.getBody().unmask();
        }
    });

    //  奖金标准修改
    var Bonusrecords = Bonus_store.data.items;
    var Bonusarray = new Array();

    for (var z = 0; z < Bonusrecords.length; z++) {
        Bonusarray.push(Bonusrecords[z].data);
    }
    Ext.getBody().mask("正在保存！请稍候！");
    var Bonusdata = Ext.encode(Bonusarray);
    Ext.Ajax.request({
        url: '../Apis/AuditPersonTreatment.aspx?actionName=updateDataBonus&sid' + Sys.sid,
        params: {
            Bonusrecords: Bonusdata
        },
        success: function(response, options) {
            Bonus_store.load({
                params: {
                    queryYear: queryYear,
                    queryMonth: queryMonth
                }
            }); //载入数据。
            Ext.getBody().unmask();
        },
        failure: function(response, options) {
            Ext.getBody().unmask();
        }
    });
}



//       ------------------------------------------------------------------------------主容器------------------------------------------------------------------------------------------------     





//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    autoScroll: true,
    items: [{
            frame: true,
            region: 'north',
            height: 'auto',
            layout: "fit",
            border: false,
            items: [pd_top_form]
        },
        //			{
        //					layout : "fit",
        //					border : false,
        //					anchor : '-1 -1',
        //					items : [Body_grid0],
        //				},
        {
            layout: "fit",
            border: false,
            anchor: '-1 -1',
            items: [Body_grid],
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -1',
            items: [Body_grid2],
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -1',
            items: [Body_grid3],
        },
    ]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
//设置显示默认日期
var setDefaultValues = function() {
    //     Ext.getCmp("hideremark").disabled = true;
    var now = new Date();
    var date = now.format('Y年m月');
    queryYear = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month < 10) {
        month += "0";
    }
    queryMonth = month;
    pd_top_form.find("name", "comboPeriod")[0].setValue(date);
    pd_top_form.show();
};

//页面加载时为页面考勤标准赋值
var setAttendanceLevel = function() {

    if (queryYear == "" && queryMonth == "") {
        var now = new Date();
        var date = now.format('Y年m月');
        queryYear = now.getFullYear();
        var month = now.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        queryMonth = month;
    }
    var array = new Array();
    array.push(queryYear);
    array.push(queryMonth);
    Ext.getBody().mask("正在加载！请稍候！");
    var data = array;
    Ext.Ajax.request({
        url: "../Apis/AuditPersonTreatment.aspx?actionName=GetAttendanceList",
        params: {
            array: data,
        },
        success: function(response, options) {
            var arry = new Array();
            arry = response.responseText.split(',');
            AttendanceID = arry[0];
            pd_top_form.find("name", "NatureDays")[0].setValue(arry[1]);
            pd_top_form.find("name", "WorkDays")[0].setValue(arry[2]);
            pd_top_form.find("name", "LocalMoveDays")[0].setValue(arry[3]);
            pd_top_form.find("name", "OtherMoveDays")[0].setValue(arry[4]);
            Ext.getBody().unmask();
        },
        failure: function(response, options) {
            Ext.getBody().unmask();
        }
    });
}
setAttendanceLevel();
setDefaultValues();
