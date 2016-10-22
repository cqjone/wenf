	
var today = new Date();
var queryYear=today.getFullYear();
var queryMonth=today.getMonth()+1;
var period=today.queryYear+"-"+queryMonth;
var lastDay = new Date();
lastDay.setDate(today.getMonth()-1);
var thisMonth=today.getFullYear()+"-"+today.getMonth();
var lastMonth=lastDay.getFullYear()+"-"+lastDay.getMonth();
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

/*
var tar_info = new Ext.data.ArrayStore({
    fields: ['ID','CombineWord'],
    data: [
		[1,'B1-标准1'],
		[2,'B2-标准2'],
		[3,'B3-标准3'],
		[4,'B4-标准4']
	]
});
*/
var tar_info = new Ext.data.Store({
	autoDestroy : true,
	autoLoad : true,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getSocialWithHold&year='+queryYear+'&month='+queryMonth+'&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'},
});

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



/*
var pd_store = new Ext.data.ArrayStore({

    fields: ['ID','EmpId','Name','DeptId','Withhold'],
    data: [
		[1,'00100161','张三','大华店','250'],
		[2,'00100162','李松','静安店','318'],
		[3,'00100163','王五','财大店','250'],
		[4,'00100164','赵六','七宝店','318']
	]
});
*/

//列表数据
var pd_store = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/LogisticsManagement.aspx?actionName=getSendSocialSWithhold&sid=' + Sys.sid,
	autoLoad : true,
	reader : new Ext.data.JsonReader({
		//record: 'plant',
		//root: 'msg',
		//totalProperty: 'results',
		
		//DataMonth : DataMonth,
		//EmpCode : EmpCode,
		//DepCode: DepCode
		autoLoad : true,
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
				name : "DeptID",
				mapping : "DeptID"
			}, {
				name : "DeptTitle",
				mapping : "DeptTitle"
			}, {
				name : "WsTitle",
				mapping : "WsTitle"
			}
		]
	}),
});

/*
var monthStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
	[ now.getFullYear()+"-"+month,  now.getFullYear()+"年"+month+"月"],
	[ perYear+"-"+perMonth,  perYear+"年"+perMonth+"月"]
	]
});
*/
//日期数据源
var monthStore = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:false,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getExistPeriod&tableName=bSendSocialSWithhold&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
		]
	}),
	sortInfo: {field: 'Value',direction:'desc'}
});
monthStore.load();
	
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
											html : '<font style="color:red;">1、按"月"设定员工社保代扣标准及缴费门店。每个月可以不同。</font>',
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
											html : '<font style="color:red;">2、只能设定"本月"和"上月"的社保代扣标准。</font>',
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
											html : '<font style="color:red;">3、跨店人员在"设定跨店人员"后，会自动平摊。</font>',
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
					layout : "column",
					labelWidth : 50,
					labelAlign : 'right',
					
					items : [
					 {
						layout : 'form',
						//columnWidth : 0.25,
						items : [{
								xtype : 'combo',
								fieldLabel : '月 份',
								name : 'DataMonth',
								editable : false,
								forceSelection : true,
								mode : 'remote',
								store : monthStore,
								displayField : "Title",
								valueField : "Value",
								triggerAction : "all",
								anchor : '90%',
								width:126,
								listeners : {									
										'select':function(){
							                period = pd_top_form.getForm().findField("DataMonth").getValue();
							                if(period!= null && typeof(period)!="undefined"){
							                    period=period.replace("年","-");
                                                period=period.replace("月","");
								                var arr = period.split("-");
								                queryYear = arr[0];
								                queryMonth = arr[1];
								                pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
                								
							                }
										}
									},
							}
						]
					},
					{
						layout : 'form',
						//columnWidth : 0.25,
						items : [
						{
							xtype : "combo",
							name : "DepCode",
							hiddenName: "DepCode",
							fieldLabel : '门店',
							store : tar_dept,
							triggerAction: 'query',
							anchor : '90%',
							border : 1,
							valueField : 'ID',
							displayField : 'CombineWord',
							enableKeyEvents : true,
							selectOnFocus : false,
							mode : 'remote',  
							allowBlank : true,
							forceSelection : false,
							hideTrigger : true,
							listeners : {									
							   "keyup": function (v) {
									var value = v.getRawValue();
									
									if(value != null && value!=""){
										tar_dept.load({
											params: { key: v.getRawValue() }
										});
									}
									
								},
								'specialkey' : function (_field, _e) {
									if (_e.getKey() == _e.ENTER) {
										pd_top_form.find("name", "EmpCode")[0].focus(false, 100);
									}
								}
							},
							style : {
								marginLeft : '3px'

							}

						}
						]
					},
					{
						layout : 'form',
						//columnWidth : 0.25,
						items : [
						{
							xtype : "combo",
							name : "EmpCode",
							hiddenName: "EmpCode",
							fieldLabel : '员工',
							store : tar_employee,
							triggerAction: 'query',
							anchor : '90%',
							border : 1,
							valueField : 'ID',
							displayField : 'CombineWord',
							enableKeyEvents : true,
							selectOnFocus : false,
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
										Ext.getCmp("btnSel").fireEvent('click');
									}
								}
							},
							style : {
								marginLeft : '3px'

							}

						}
						]
					},
					
						 {
									width : 100,
									style : {

										marginTop : '-7px'
									},
									buttons : [ {
											id : "btnSel",
											text : "查 询",
											listeners : {
												click : function () {
													//var DataMonth = pd_top_form.find('name', 'DataMonth')[0].value;
													var DepCode = pd_top_form.find('name', 'DepCode')[0].getValue();
													var EmpCode = pd_top_form.find('name', 'EmpCode')[0].getValue();
												    period = pd_top_form.getForm().findField("DataMonth").getValue();
													queryYear=today.getFullYear();
												    queryMonth=today.getMonth();
													if(period!= null && typeof(period)!="undefined"){
														period=period.replace("年","-");
		                                                period=period.replace("月","");
														var arr = period.split("-");
														queryYear = arr[0];
													    queryMonth = arr[1];
														pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth,EmpID:EmpCode,DeptID:DepCode}});
														setComponentStatusByPeriod(period);
													}
													//pd_store.removeAll();
													/*pd_store.load({
														params : {
															Code : EmpCode,
															DeptID: DepCode
														}
													});*/
												}
											}
											
										}
									]
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
										html : '<font style="color:#9A9A9A;">工号或名称</font>',
										style : {
											marginTop : '3px',
											marginLeft : '5px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">缴费门店</font>',
										style : {
											marginTop : '3px',
											marginLeft : '190px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">代扣标准</font>',
										style : {
											marginTop : '3px',
											marginLeft : '75px'
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
									width : 250,
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
									triggerAction: 'query',
									width : 125,
									border : 1,
									valueField : 'ID',
									displayField : 'CombineWord',
									enableKeyEvents : true,
									selectOnFocus : true,
									allowBlank : true,
									forceSelection : true,
									hideTrigger : true,
									minChars : 3,
									mode : 'remote',  
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
												//AddData();
												pd_top_form.find("name", "Withhold")[0].focus(false, 100);
											}
										}
									},

									style : {
										marginLeft : '3px',
									}

								}, {

									

									xtype : "combo",
									name : "Withhold",
									hiddenName: "Withhold",
									triggerAction: 'all',
									width : 200,
									border : 1,
									valueField : 'ID',
									displayField : 'CombineWord',
									store : tar_info,
									enableKeyEvents : true,
									selectOnFocus : true,
									allowBlank : true,
									forceSelection : true,
									hideTrigger : false,
									autoreload:true,
									listeners : {									
									   "keyup": function (v) {
											var value = v.getRawValue();
											if(value!= null && value.length >=1) {
												tar_info.load({
													params: { key: v.getRawValue() }
												});
												
											}
										},									
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												AddData();
											}
										}
									},

									style : {
										marginLeft : '0px',
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
													AddData();
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
//页面加载设置默认值
var setDefaultValues = function () {
	var now = new Date();
	var month = now.getMonth()+1;
	var date = now.getFullYear()+"年"+month+"月";
	pd_top_form.getForm().findField('DataMonth').setValue(date);
	
	
	pd_top_form.show();
};
setDefaultValues();

/*
function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
			//id = id.split(",")[0];
            var index = pd_store.find('ID',id);
			pd_store.remove(pd_store.getAt(index));
        }
    });
}
*/

//删除记录
function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
		  	Ext.Ajax.request({
				url : "../Apis/LogisticsManagement.aspx?actionName=delSendSocialSWithhold&sid=" + Sys.sid, 
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

function AddData() {
	/*
	var empValue = pd_top_form.find("name", "EmpId")[0].getRawValue();
	var deptValue = pd_top_form.find("name", "DeptId")[0].getRawValue();
	var WithholdV	= pd_top_form.find("name", "Withhold")[0].getRawValue();
	var arr1 = empValue.split(' ');
	var arr2 = deptValue.split(' ');
	//  fields: ['ID','EmpId','Name','DeptId','Withhold'],
	var record = new Ext.data.Record({
		ID:1,
		EmpId:arr1[0],
		Name:arr1[1],
		DeptId:arr2[1],
		Withhold:WithholdV
	});
	pd_grid.stopEditing();
	pd_store.insert(0,record);//可以自定义在stroe的某个位置插入一行数据。
	pd_grid.startEditing(3, 0);
	
	//pd_top_form.find("name", "EmployeeCode")[0].setValue("");
	
	*/
	
	//日期
    var _period = pd_top_form.getForm().findField("DataMonth").getValue();
    var myYear='';
	var myMonth='';
	if(_period!= null && typeof(_period)!="undefined"){
	    _period=_period.replace("年","-");
		_period=_period.replace("月","");
		var arr = _period.split("-");
		myYear = arr[0];
	    myMonth =arr[1];
	}
    var empValue = pd_top_form.find("name", "EmpId")[0].getValue();
	var deptValue = pd_top_form.find("name", "DeptId")[0].getValue();
	var WithholdV	= pd_top_form.find("name", "Withhold")[0].getValue();
	if (empValue == null || empValue == "") {
		Ext.MessageBox.alert("提醒", "请选择员工");
		pd_top_form.find("name", "EmpId")[0].focus(false, 100);
		return;
	}
	if (deptValue == null || deptValue == "") {
		Ext.MessageBox.alert("提醒", "请选择门店");
		pd_top_form.find("name", "DeptId")[0].focus(false, 100);
		return;
	}
	if (WithholdV == null || WithholdV == "") {
		Ext.MessageBox.alert("提醒", "请选择代扣标准");
		pd_top_form.find("name", "Withhold")[0].focus(false, 100);
		return;
	}
	if (pd_top_form.getForm().isValid()) {
	
		Ext.Ajax.request({
			url : "../Apis/LogisticsManagement.aspx?actionName=addSendSocialSWithhold&sid=" + Sys.sid, 
			params : {
				myYear :myYear,
				myMonth : myMonth,
				EmpId : empValue,
				DeptId : deptValue,
				Withhold : WithholdV
			},
			success : function (form, action) {
				var respText = Ext.util.JSON.decode(form.responseText);
			    if(respText.success==false){
			        Ext.MessageBox.alert("提醒",respText.msg);
			        return false;
			    }
				pd_top_form.find("name", "EmpId")[0].setValue("");
				pd_top_form.find("name", "DeptId")[0].setValue("");
				pd_top_form.find("name", "Withhold")[0].setValue("");
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
function getId(pd_grid) {
	var s = pd_grid.getSelectionModel().getSelected();
	if (s) {
		return s.id;
	}
	return 0;
}







//======卡类型选择=====






//定义列
var cm = new Ext.grid.ColumnModel({
		defaults : {
			sortable : false,
			menuDisabled : true,
			multiSelect : true
		},
//fields: ['ID','EmpId','Name','DeptId','Withhold'],
		columns : [new Ext.grid.RowNumberer(), {
				header : 'ID',
				dataIndex : 'ID',
				ID : "ID",
				hidden : true,
				width : 125
			}, {
				header : '<center style="font-weight:bold;">工号</center>',
				dataIndex : 'Code',
				width : 125,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">名称</center>',
				dataIndex : "Title",
				width : 125,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">缴费门店</center>',
				dataIndex : "DeptTitle",
				width : 125,
				align:'left'

			}, {
				header : '<center style="font-weight:bold;">代扣标准</center>',
				dataIndex : "WsTitle",
				width : 125,
				align:'left'

			}, {
				//删除按钮
				header : '<center style="font-weight:bold;">操作</center>',
				dataIndex : "ID",
				width : 125,
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

//设置界面控件的隐藏和显示，根据选择的日期逻辑
var setComponentStatusByPeriod=function(selectMonth)
{
   if(Date.parse(lastMonth)>Date.parse(selectMonth))
   {
     pd_top_form.getForm().findField("EmpId").disable();
     pd_top_form.getForm().findField("DeptId").disable();
     pd_top_form.getForm().findField("Withhold").disable();
	 cm.columns[6].hidden=true;
	 //pd_top_form.getForm().find("name","btnSave")[0].hidden();
	// pd_top_form.find("id", "btnSave")[0].editable=false;
   }
   else
   {
     pd_top_form.getForm().findField("DeptId").enable();
     pd_top_form.getForm().findField("mytype").enable();
     pd_top_form.getForm().findField("Withhold").enable();
	 cm.columns[6].hidden=false;
	 //pd_top_form.find("id", "btnSave")[0].editable=true;
   }
}
centerPanel.add(pd_main_panel);
centerPanel.doLayout();