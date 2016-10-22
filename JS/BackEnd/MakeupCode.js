//补录
//过滤特殊字符

var tar_employee = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/BaseInfoUtil.aspx?actionName=getEmployee&match_all=true&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [{
					name : "CombineWord",
					mapping : "CombineWord"
				}, {
					name : "ID",
					mapping : "ID"
				}, {
					name : "Code",
					mapping : "Code"
				}
			]
		}),
		sortInfo : {
			field : 'CombineWord',
			direction : 'ASC'
		}
	});
var tar_dept = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/BaseInfoUtil.aspx?actionName=getDept&type=1&state=1&sid=' + Sys.sid,
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
//===================年份和月份Store========================//


var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : true,
		labelWidth : 40,
		labelAlign : 'right',
		heigh : 110,
		autoWidth : true,
		items : [{
				xtype : "fieldset",
				title : "考勤补录授权码维护",
				//defaultType: 'textfield',
				defaults : {
					labelAlign : "right",
					width : 5
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
								html : '日	期：',
								style : {
									marginTop : '3px',
									marginLeft : '5px'
								}
							}, {
								xtype : "datefield",
								
								editable : false,
								fieldLabel : "日期",
								name : "VailDate",
								format : "Y-m-d",
								enableKeyEvents : true,
								width : 125,
								style : {
									marginLeft : '5px'
								}
								
							}, {
								xtype : "label",
								html : '门	店：',
								style : {
									marginTop : '3px',
									marginLeft : '15px'
								}
							}, {
								xtype : "combo",
								name : "DeptId",
								hiddenName : "DeptId",
								store : tar_dept,
								triggerAction : 'all',
								width : 130,
								border : 1,
								valueField : 'ID',
								displayField : 'CombineWord',
								enableKeyEvents : true,
								selectOnFocus : true,
								allowBlank : true,
								forceSelection : true,
								hideTrigger : true,
								listeners : {

									"keyup" : function (v) {
										var value = v.getRawValue();
										if (value != null && value.length >= 1) {
											tar_dept.load({
												params : {
													key : v.getRawValue(),
													state:1,
													type:1
												}
											});

										}
									}
								},
								style : {
									marginLeft : '15px'

								}
							}, {
								xtype : "button",
								boxMinWidth : 40,
								id : 'btnAdd',
								disabled : false,
								style : "margin-left:50px",
								width : 60,
								text : " 添  加",
								handler : function () {
									AddData();
								}
							}

						]
					}
				]
			}
		]
	});

function AddData() {
	var deptid = pd_top_form.find("name", "DeptId")[0].getValue();
	var vaildate = pd_top_form.find("name", "VailDate")[0].getValue();
	
	if (vaildate=="" || vaildate == null || typeof(vaildate) == "undefined") {
		Ext.MessageBox.alert("提示", "请选择日期!");
		return;
	}
	
	if (deptid=="" || deptid == null || typeof(deptid) == "undefined") {
		Ext.MessageBox.alert("提示", "请选择门店!");
		return;
	}
	
	 pd_store.load({
        params: { DeptID: deptid,VailDate:vaildate  }
     });
}
var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [new Ext.grid.RowNumberer(), {
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    }, {
        header: '日期',
        dataIndex: 'VailDate',
        width: 100
       
    }, {
        header: '部门',
        dataIndex: 'Dept',
        width: 100
        
    }, {
        header: "授权码",
        dataIndex: "Code",
        width: 120
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: false,
    url: '../Apis/AttendanceMgr.aspx?actionName=generateMakeupCode&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'MakeupInfo',
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: 'VailDate', mapping: 'VailDate' },
                { name: 'Dept', mapping: 'Dept' },
                { name: 'Code', mapping: 'Code' },
            ]
    })
});


var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    columnLines:true,
    sm: sm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true
    /**bbar: new Ext.PagingToolbar({
        pageSize: 20,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })**/
});


//主容器
var pd_main_panel = new Ext.Panel({
		border : false,
		layout : "border",
		items : [{
				frame : true,
				region : 'north',
				height : 115,
				layout : "fit",
				border : false,
				items : [pd_top_form]
			}, {
				layout : "fit",
				region : 'center',
				border : false,
				anchor : '-1 -140',
				items: [pd_grid]

			}
		]
	});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();