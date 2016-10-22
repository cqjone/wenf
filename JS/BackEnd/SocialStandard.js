var tar_dept = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getDept&sid=' + Sys.sid,
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


var store = new Ext.data.ArrayStore({
    fields: ['ID', 'Code','Title','Duty','Dept','button'],
    data: [
		[1,'00100161','张三','经理XA','崮山','<a style="text-decoration:underline;cursor:pointer;color:blue;">删除</a>'],
		[1,'00100162','李四','经理XB','西藏一','<a style="text-decoration:underline;cursor:pointer;color:blue;">删除</a>'],
		[1,'00100163','王五','经理XC','金山','<a style="text-decoration:underline;cursor:pointer;color:blue;">删除</a>'],
		[1,'00100164','徐六','经理XD','松江一','<a style="text-decoration:underline;cursor:pointer;color:blue;">删除</a>']
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
								xtype : "combo",
								editable: false,
								fieldLabel : "月份",
								name : "DataMonth",
								mode: 'local',
								store:monthStore,
								displayField : "ID",
								valueField : "Title",
								
								
								
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
												pd_store.reload({ params: { showAll: showAll} });											
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
	var date = now.format('Y年m月');
	pd_top_form.find("name", "DataMonth")[0].setValue(date);
	pd_top_form.show();
};
setDefaultValues();

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

		columns : [new Ext.grid.RowNumberer(), {
				header : 'ID',
				dataIndex : 'ID',
				ID : "ID",
				hidden : true,
				width : 100
			}, {
				header : '工号',
				dataIndex : 'Code',
				width : 110,
				align : 'left'
			}, {
				header : "姓名",
				dataIndex : "Title",
				width : 110,
				align : 'left'
			}, {
				header : "岗位",
				dataIndex : "Duty",
				width : 110

			}
			, {
				header : "门店",
				dataIndex : "Dept",
				width : 110

			},	{
				//删除按钮
				header : "操作",
				dataIndex : "button",
				width : 100,
				align : 'center',
				renderer : '<a>删除</a>'
				

			}
		]
	});


var pd_store = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/LogisticsManagement.aspx?actionName=getLogisticsRegister&sid=' + Sys.sid,
		autoLoad : true,
		reader : new Ext.data.JsonReader({
			//record: 'plant',
			//root: 'msg',
			//totalProperty: 'results',
			fields : [{
					name : "ID",
					mapping : "ID"
				}, {
					name : "EmpNo",
					mapping : "EmpNo"
				}, 
				{
					name : "EmpName",
					mapping : "EmpName"
				},
				{
					name : "Duty",
					mapping : "Duty"
				}, {
					name : "Dept",
					mapping : "Dept"
				}
				,{
					name : "button",
					mapping : "button"
				}
			]
		}),
	});

var pd_grid = new Ext.grid.GridPanel({
		store : store,
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