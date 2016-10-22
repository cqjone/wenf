var tar_dept = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'}
});
//员工信息下拉数据
var tar_employee = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/BaseInfoUtil.aspx?char_length=3&actionName=getEmployee&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'}
});

//列表数据
var pd_store = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/LogisticsManagement.aspx?actionName=getEmployeeToDept&sid=' + Sys.sid,
		autoLoad : true,
		reader : new Ext.data.JsonReader({
			//record: 'plant',
			//root: 'msg',
			//totalProperty: 'results',
			fields : [{
					name : "ID",
					mapping : "ID"
				},
				{
					name : "Code",
					mapping : "Code"
				},
				{
					name : "Title",
					mapping : "Title"
				}, {
					name : "DutyTitle",
					mapping : "DutyTitle"
				}, {
					name : "DeptTitle",
					mapping : "DeptTitle"
				}, {
					name : "ID",
					mapping : "ID"
				}
			]
		}),
	});
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
//日期数据源
var period_store = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:false,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getExistPeriod&tableName=iEmployeeToDept&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
		]
	}),
	sortInfo: {field: 'Value',direction:'desc'}
});
period_store.load();
//得到当前月和上一月
var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getMonth()-1);
var thisMonth=today.getFullYear()+"-"+today.getMonth();
var lastMonth=lastDay.getFullYear()+"-"+lastDay.getMonth();
//物料登记
var id = 0;
var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : false,
		heigh : 100,
		//autoWidth:true,
		
		items : [
		
			  {
					xtype : "fieldset",
					title : "注意事项",
					style : {
						marginLeft : '4px',
						marginTop : '10px'
					},
					items : [//third
								
								{
									items:[
										{
											xtype : "label",
											html : '<font style="color:red;">1、按"月"设定社跨店人员。每月可以不同。</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								},
								{
									items:[
										{
											xtype : "label",
											html : '<font style="color:red;">2、只能设定"本月"和"上月"的标准。</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								},
								{
									items:[
										{
											xtype : "label",
											html : '<font style="color:red;">3、一个人可以跨多个门店</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								}
								
								
							
						]							
				},
				{
					xtype : "fieldset",
					title : "条件",
					style : {
						marginLeft : '4px',
						marginTop : '10px'
					},
					items : [
						{
                                xtype: "combo",
                                name: "comboPeriod",
                                store: period_store,
                                hiddenName: "comboPeriod",
                                width: 180,
                                margin: '0 0 0 20',
                                mode: 'local',
                                triggerAction: 'all',
                                valueField: 'Value',
                                displayField: 'Title',
                                editable: false,
					            forceSelection :true,
					            triggerAction: "all",
								listeners : {									
										'select':function(){
							                var period = pd_top_form.getForm().findField("comboPeriod").getValue();
							                if(period!= null && typeof(period)!="undefined"){
								                var arr = period.split("-");
								                var queryYear = arr[0];
								                var queryMonth = arr[1];
								                pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
                								setComponentStatusByPeriod(period);
							                }
										}
									},
								style : {
											marginLeft : '-95px'
										}
							}
					]
				},
				
				{ //first
					xtype : "fieldset",
					title : "录入",
					style : {
						marginLeft : '4px',
						marginTop : '10px'
					},
					
					layout : "column",
					items : 
							
					[
							{
								layout : "column",
								columnWidth : 1,
								style : {
									marginLeft : '4px',
									marginTop : '10px'
								},
								items : [
									
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">工号或者姓名</font>',
										style : {
											marginTop : '3px',
											marginLeft : '0px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">店名或者拼音缩写</font>',
										style : {
											marginTop : '3px',
											marginLeft : '255px'
										}
									}
									
								]
							},
							{ //second
								layout : "column",
								columnWidth : 1,
								style : {
									marginLeft : '4px',
									marginTop : '10px'
								},
								items : [//third
								 {
									xtype : "combo",
									name : "EmpId",
									hiddenName: "EmpId",
									store : tar_employee,
									triggerAction: 'query',
									width : 320,
									border : 1,
									valueField : 'ID',
									displayField : 'CombineWord',
									enableKeyEvents : true,
									selectOnFocus : false,
									minChars : 3,
									mode : 'remote',  
									allowBlank : true,
									forceSelection : false,
									hideTrigger : true,
									listeners : {									
									   "keyup": function (v) {
											var value = v.getRawValue();
											
											if(value != null && value!=""){
												tar_employee.load({
													params: { key: v.getRawValue() }
												});
											}
											
										},
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "DeptId")[0].focus(false, 100);
											}
										}
									},
									style : {
										marginLeft : '3px'

									}
								}, {

									

									xtype : "combo",
									name : "DeptId",
									hiddenName: "DeptId",
									store : tar_dept,
									triggerAction: 'all',
									width : 200,
									border : 1,
									valueField : 'ID',
									displayField : 'CombineWord',
									enableKeyEvents : true,
									selectOnFocus : true,
									allowBlank : true,
									forceSelection : true,
									hideTrigger : true,
									listeners : {									
									   "keyup": function (v) {
											var value = v.getRawValue();
											if(value!= null && value.length >=1) {
												tar_dept.load({
													params: { key: v.getRawValue() }
												});
												
											}
										},
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												AddAction();
											}
										}
									},

									style : {
										marginLeft : '3px',
									}

								}, {
									width : 100,
									style : {

										marginTop : '-7px'
									},
									buttons : [ {
											id : "btnSave",
											text : "保 存",
											listeners : {
												click : function () {
													id = 0;
													AddAction();
												}
											}
											
										}
										/*{
										text: " 删  除",
										handler: function() {
										//  delItem();
										}
										}*/
									]
								}, {
									//仅显示当月 选择框
									xtype : "checkbox",
									fieldLabel : "仅显示当月记录",
									name : "isThisMonth",
									width : 15,
									checked : false,
									hidden:true,
									selectOnFocus : true,
									listeners:{  
										afterrender:function(obj){  
											var now = new Date();
											var day = now.getDate();

											if(day<=4){
												pd_top_form.find("name", "isThisMonth")[0].setValue(false);
											}
											obj.getEl().dom.onclick = function(){  
												var checked = pd_top_form.find("name", "isThisMonth")[0].getValue();
												var showAll = checked==true?false:true;
												//pd_store.reload({ params: { showAll: showAll} });											
											};  
										}  
									}  ,
									style : {
										marginTop : '5px'
									}

								}, {
									//仅显示当月 label
									xtype : "label",
									hidden:true,
									text : "仅显示当月记录",
									name : "isThisMonthLabel",
									width : 100,
									style : {
										marginLeft : '5px',
										marginTop : '5px'
									}
								}
							]//third
						}
					]//second
				}
		]//first

	}); //form

function getId(pd_grid) {
	var s = pd_grid.getSelectionModel().getSelected();
	if (s) {
		return s.id;
	}
	return 0;
}
//定义列
var cm = new Ext.grid.ColumnModel({
		defaults : {
			sortable : false,
			menuDisabled : true,
			multiSelect : true
		},

		columns : [new Ext.grid.RowNumberer(), {
				header : 'ID',
				dataIndex : 'ID',
				ID : "ID",
				hidden : true,
				width : 100
			}, {
				header : '<center style="font-weight:bold;">工号</center>',
				
				dataIndex : 'Code',
				width : 110,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">姓名</center>',
				dataIndex : "Title",
				width : 110,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">岗位</center>',
				dataIndex : "DutyTitle",
				width : 110,
				align : 'left'

			}
			, {
				header : '<center style="font-weight:bold;">门店</center>',
				dataIndex : "DeptTitle",
				width : 110,
				align : 'left'

			},	{
				//删除按钮
				header : '<center style="font-weight:bold;">操作</center>',
				dataIndex : "ID",
				width : 100,
				align : 'center',
				
				renderer : function (value) {
					var str= '<a style="text-decoration:underline;cursor:pointer;color:blue;" onclick=deleteRrecord('+value+')>删除</a>'
					return str;
				}
				

			}
		]
	});




var pd_grid = new Ext.grid.EditorGridPanel({
		store : pd_store,
		cm : cm,
		stripeRows : true,
		//frame: true,
		margins : "2 2 2 2",
		border : false,
		selModel : new Ext.grid.RowSelectionModel({
			singleSelect : false
		}), //设置单行选中模式, 否则将无法删除数据
		//sm: sm,
		loadMask : true
	});
//pd_store.load();
//删除记录
function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
		  	Ext.Ajax.request({
				url : "../Apis/LogisticsManagement.aspx?actionName=delEmployeeToDept&sid=" + Sys.sid, 
				params : {
					id :id 
				},
				success : function (form, action) {
					var respText = Ext.util.JSON.decode(form.responseText);
					if(respText.success==false){
						Ext.MessageBox.alert("提醒",respText.msg);
						return false;
					}
					//操作成功
					pd_store.reload();
				},
				failure : function (form, action) {
					if (action != undefined && action.result != undefined) {
						Ext.MessageBox.alert("提醒", action.result.msg);
					} else {
						Ext.MessageBox.alert("提醒", "删除失败！请稍候重试！");
					}
				}
			});
            //var index = pd_store.find('ID',id);
			//pd_store.remove(pd_store.getAt(index));
        }
    });
}
//新增记录
function AddAction() {
    //日期
    var period = pd_top_form.getForm().findField("comboPeriod").getValue();
    var myYear='';
	var myMonth='';
	if(period!= null && typeof(period)!="undefined"){
	    period=period.replace("年","-");
		period=period.replace("月","");
		var arr = period.split("-");
		myYear = arr[0];
	    myMonth =arr[1];
	}
	
    //员工
	var EmpId = pd_top_form.find("name", "EmpId")[0].getValue();
	//部门
	var DeptId = pd_top_form.find("name", "DeptId")[0].getValue();
	if (EmpId == null || EmpId == "") {
		Ext.MessageBox.alert("提醒", "请选择员工");
		pd_top_form.find("name", "EmpId")[0].focus(false, 100);
		return;
	}

	if (DeptId == null || DeptId == "") {
		Ext.MessageBox.alert("提醒", "请选择门店");
		pd_top_form.find("name", "DeptId")[0].focus(false, 100);
		return;
	}
	if (pd_top_form.getForm().isValid()) {
	
		Ext.Ajax.request({
			url : "../Apis/LogisticsManagement.aspx?actionName=addEmployeeToDept&sid=" + Sys.sid, 
			params : {
				myYear :myYear ,
				myMonth : myMonth,
				EmpId : EmpId,
				DeptId : DeptId
			},
			success : function (form, action) {
				var respText = Ext.util.JSON.decode(form.responseText);
			    if(respText.success==false){
			        Ext.MessageBox.alert("提醒",respText.msg);
			        return false;
			    }
				pd_top_form.find("name", "EmpId")[0].setValue("");
				pd_top_form.find("name", "DeptId")[0].setValue("");
				//操作成功
				pd_store.reload();
				pd_top_form.find("name", "EmpId")[0].focus(false, 100);
			},
			failure : function (form, action) {
				if (action != undefined && action.result != undefined) {
					Ext.MessageBox.alert("提醒", action.result.msg);
				} else {
					Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
				}
			}
		});
	}
}

//主容器
var pd_main_panel = new Ext.Panel({
		//autotoWidth:true,
		layout : "anchor",
		//anchorSize: { width: 800, height: 600 },
		items : [{
				frame : true,
				border : false,
				items : [pd_top_form]
			}, {
				layout : "fit",
				border : false,
				anchor : '-1 -150',
				items : [pd_grid]
			}
		]
	});
//设置显示默认日期
var setDefaultValues = function () {
	var now = new Date();
	var date = now.format('Y年m月');
	pd_top_form.find("name", "comboPeriod")[0].setValue(date);
	pd_top_form.show();
};
//设置界面控件的隐藏和显示，根据选择的日期逻辑
var setComponentStatusByPeriod=function(selectMonth)
{
   if(Date.parse(lastMonth)>Date.parse(selectMonth))
   {
     pd_top_form.getForm().findField("EmpId").disable();
     pd_top_form.getForm().findField("DeptId").disable();
	 cm.columns[6].hidden=true;
	 //pd_top_form.getForm().find("name","btnSave")[0].hidden();
	// pd_top_form.find("id", "btnSave")[0].editable=false;
   }
   else
   {
     pd_top_form.getForm().findField("EmpId").enable();
     pd_top_form.getForm().findField("DeptId").enable();
	 cm.columns[6].hidden=false;
	 //pd_top_form.find("id", "btnSave")[0].editable=true;
   }
}
centerPanel.add(pd_main_panel);
centerPanel.doLayout();
setDefaultValues();