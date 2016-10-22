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

	
var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getMonth()-1);


var pd_store = new Ext.data.ArrayStore({

    fields: ['ID','EmpId','Name','DeptId','Withhold'],
    data: [
		[1,'00100161','张三','大华店','250'],
		[2,'00100162','李松','静安店','318'],
		[3,'00100163','王五','财大店','250'],
		[4,'00100164','赵六','七宝店','318']
	]
});


var monthStore = new Ext.data.ArrayStore({
   fields: ['ID', 'Title'],
    data: [["2014年8月", "2014年8月"],["2014年9月", "2014年9月"]]
});


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
											html : '<font style="color:red;">1、按"月"设定员工罚款清单。每个月可以不同。</font>',
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
											html : '<font style="color:red;">3、系统会自动导入门店前台已输入的罚款，请不要重复。</font>',
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
								selectOnFocus : true,
								forceSelection : true,
								mode : 'local',
								store : monthStore,
								displayField : "Title",
								valueField : "ID",
								triggerAction : "all",
								anchor : '90%',
								allowBlank : true,
								width:126
							}
						]
					},
					{
						layout : 'form',
						columnWidth : 0.23,
						items : [
						{
							xtype : "combo",
							name : "DeptID",
							hiddenName: "DeptID",
							fieldLabel : "门 店",
							store : tar_dept,
							triggerAction: 'all',
							width : 170,
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
											params: { key: value }
										});
										
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
						columnWidth : 0.23,
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
													id = 0;
													//AddData();
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
										html : '<font style="color:#9A9A9A;">罚款金额</font>',
										style : {
											marginTop : '3px',
											marginLeft : '190px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">罚款日期</font>',
										style : {
											marginTop : '3px',
											marginLeft : '75px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">原因</font>',
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
									triggerAction: 'all',
									width : 125,
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
									store : tar_dept,
									triggerAction: 'all',
									width : 125,
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
												AddData();
											}
										}
									},

									style : {
										marginLeft : '3px',
									}

								},{
									xtype : "combo",
									name : "Withhold",
									hiddenName: "Withhold",
									store : tar_dept,
									triggerAction: 'all',
									width : 125,
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
												AddData();
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


function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
			//id = id.split(",")[0];
            var index = pd_store.find('ID',id);
			pd_store.remove(pd_store.getAt(index));
        }
    });
}

function AddData() {
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
		DeptId:arr2[0],
		Withhold:WithholdV
	});
	pd_grid.stopEditing();
	pd_store.insert(0,record);//可以自定义在stroe的某个位置插入一行数据。
	pd_grid.startEditing(3, 0);
	//pd_top_form.find("name", "EmployeeCode")[0].setValue("");
	
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
				dataIndex : 'EmpId',
				width : 125,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">姓名</center>',
				dataIndex : "Name",
				width : 125,
				align : 'center'
			}, {
				header : '<center style="font-weight:bold;">罚款金额</center>',
				dataIndex : "DeptId",
				width : 125

			}, {
				header : '<center style="font-weight:bold;">日期</center>',
				dataIndex : "Withhold",
				width : 125

			}, {
				header : '<center style="font-weight:bold;">原因</center>',
				dataIndex : "Withhold",
				width : 125

			},{
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


centerPanel.add(pd_main_panel);
centerPanel.doLayout();