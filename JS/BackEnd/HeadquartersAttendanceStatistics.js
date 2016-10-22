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

var tar_dept = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/BaseInfoUtil.aspx?actionName=getDept&sid=' + Sys.sid,
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

var dept_store = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/AttendanceMgr.aspx?actionName=getDept&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [{
					name : "ID",
					mapping : "ID"
				}, {
					name : "Title",
					mapping : "Title"
				}
			]
		}),
		sortInfo : {
			field : 'ID',
			direction : 'ASC'
		}
	});

var emp_store = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/AttendanceMgr.aspx?actionName=getEmp&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [{
					name : "ID",
					mapping : "ID"
				}, {
					name : "Title",
					mapping : "Title"
				}
			]
		}),
		sortInfo : {
			field : 'ID',
			direction : 'ASC'
		}
	});

var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : true,
		labelWidth : 50,
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
								xtype : "combo",
								name : "comboYear",
								store : yearModelStore,
								mode : 'local',
								hideLabel : true,
								width : 60,
								hiddenName : "comboYear",
								anchor : "100%",
								triggerAction : 'all',
								valueField : 'ID',
								displayField : 'Title',
								editable : false
							}, {
								xtype : "label",
								html : '年',
								style : {
									marginTop : '3px',
								}
							}, {
								xtype : "combo",
								hiddenName : "comboMonth",
								store : monthModelStore,
								name : "comboMonth",
								editable : false,
								hideLabel : true,
								anchor : "100%",
								mode : 'local',
								width : 60,
								valueField : "ID",
								displayField : "Title",
								triggerAction : "all"
							}, {
								xtype : "label",
								html : '月',
								style : {
									marginTop : '3px',
								}
							}, {
								xtype : "label",
								html : '门  店：',
								style : {
									marginTop : '3px',
									marginLeft : '5px',
								}
							},
							{
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
													key : v.getRawValue()
												}
											});

										}
									}
								},
								style : {
									marginLeft : '3px'

								}
							},
							{
								xtype : "label",
								html : '员	工：',
								style : {
									marginTop : '3px',
									marginLeft : '5px',
								}
							}, {
								xtype : "combo",
								name : "EmpId",
								hiddenName : "EmpId",
								store : tar_employee,
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
								minChars : 3,
								listeners : {

									"keyup" : function (v) {
										var value = v.getRawValue();
										if (value != null && value.length >= 1) {
											tar_employee.load({
												params : {
													key : v.getRawValue()
												}
											});

										}
									}
								},
								style : {
									marginLeft : '3px'

								}
							},
							{
								xtype : "button",
								boxMinWidth : 40,
								style : "margin-left:30px",
								width : 60,
								text : " 查  询",
								handler : function () {
									var empid = pd_top_form.getForm().findField('EmpId').getValue();
									var deptid = pd_top_form.getForm().findField('DeptId').getValue();
									if (empid == "" && deptid == "") {
										Ext.MessageBox.alert("提示", "门店和员工必须输入一个");
										return;
									}
									searchData();
								}
							},{
			                    xtype: 'button',
			                    style:"margin-left:3em",
			                    text: " 导出为Excel ",
			                    width: 90,
			                    columnWidth: 0.3,
			                    handler: function() {
			                    	var empid = pd_top_form.getForm().findField('EmpId').getValue();
									var deptid = pd_top_form.getForm().findField('DeptId').getValue();
									if (empid == "" && deptid == "") {
										Ext.MessageBox.alert("提示", "门店和员工必须输入一个");
										return;
									}
			                       Export2Excel();
			                    }
			                }

						]
					}
				]
			}
		]
	});
pd_top_form.getForm().findField('comboYear').setValue(newyear);
pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);
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
			},
			{
				header : "上班门店",
				dataIndex : "DeptName",
				width : 150
			}, {
				header : "实到",
				dataIndex : "RealTo",
				align : 'right',
				width : 110,
				renderer : function (value, m) {
					var position = value.indexOf("(");
					if (value.substr(position + 1, 1) == '0') {
						return value.substring(0, position);
					} else {
						return value;
					}
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

// create the Data Store
var pd_store = new Ext.data.Store({
		autoDestroy : true,
		//autoLoad: true,
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
				},
				{
					name : "Train",
					mapping : "Train"
				},
				{
					name : "DeptName",
					mapping : "DeptName"
				}
			]
		})
	});

/**
 * 查询数据
 */
function searchData(exportExcel) {
	pd_top_form.getForm()
	pd_store.load({
		params : {
			searchYear : pd_top_form.find('name', 'comboYear')[0].value,
			searchMonth : pd_top_form.find('name', 'comboMonth')[0].value,
			searchDept : pd_top_form.find('name', 'DeptId')[0].value,
			searchEmp : pd_top_form.find('name', 'EmpId')[0].value,
			urlName : "total"
		}
	});
}

function Export2Excel () {
	debugger;
    var queryYear=pd_top_form.find('name', 'comboYear')[0].value;
    var queryMonth =pd_top_form.find('name', 'comboMonth')[0].value;
    var searchDept =pd_top_form.find('name', 'DeptId')[0].value;
    var searchEmp = pd_top_form.find('name', 'EmpId')[0].value||"";
    var url1 = '../Apis/AttendanceMgr.aspx?export2Excel=true&actionName=queryDeptAttendanceStatistics&sid=' 
		           + Sys.sid + "&searchYear=" 
		           + queryYear + "&searchMonth=" 
		           + queryMonth + "&searchDept="
		           + searchDept +"&searchEmp="
		           + searchEmp+"&urlName=total";
    Ext.Ajax.request({
        url: url1,
        /*param: { Year: year,Month:month,DeptID: deptId},*/
        success: function (response, option) {
            var data = Ext.decode(response.responseText);
            var fileName = data.file || "";
             if(fileName!=""){
             	window.location.href="../ExportFiles/"+fileName;
           /* var count = data.totalCount || 0;
            if(count>0){*/
               /* window.location.href = '../Apis/AttendanceMgr.aspx?export2Excel=true&actionName=queryDeptAttendanceStatistics&sid=' 
		           + Sys.sid + "&searchYear=" 
		           + queryYear + "&searchMonth=" 
		           + queryMonth + "&searchDept="
		           + searchDept +"&searchEmp="
		           + searchEmp+"&urlName=total"*/
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
		loadMask : true,
		bbar : new Ext.PagingToolbar({
			pageSize : 50,
			store : pd_store,
			displayInfo : true,
			displayMsg : '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg : "没有记录"
		})
	});

pd_store.on('beforeload', function (thiz, options) {
	if (!pd_top_form.getForm().isValid()) {
		return false;
	}
	this.baseParams = pd_top_form.getForm().getValues();
	this.baseParams.urlName = "total";
	this.baseParams.searchEmp = pd_top_form.find('name', 'EmpId')[0].value;
	this.baseParams.searchDept = pd_top_form.find('name', 'DeptId')[0].value;
	this.baseParams.start = 0;
	this.baseParams.limit = 50;
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