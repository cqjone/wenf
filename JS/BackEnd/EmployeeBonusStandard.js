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
var tar_product = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/LogisticsManagement.aspx?actionName=getProduct&DeptID=1&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [
			        {name : "Code",mapping : "Code"}, 
			        {name : "ID",mapping : "ID"}
			]
		}),
		sortInfo: {field: 'Code',direction:'ASC'}
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
var tar_bonus = new Ext.data.ArrayStore({
    fields: ['ID','Title'],
    data: [
		[1,'B1-标准1'],
		[2,'B2-标准2'],
		[3,'B3-标准3'],
		[4,'B4-标准4']
	]
});
var tar_deduction = new Ext.data.ArrayStore({
    fields: ['ID','Title'],
    data: [
		[1,'S1-标准1'],
		[2,'S2-标准2'],
		[3,'S3-标准3'],
		[4,'S4-标准4']
	]
});	
//当月和上月
var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getMonth()-1);
var thisMonth=today.getFullYear()+"-"+today.getMonth();
var lastMonth=lastDay.getFullYear()+"-"+lastDay.getMonth();

var pd_store = new Ext.data.ArrayStore({
    fields: ['ID', 'Code','Title','store','position','bonus','training_num','check','decoration','stock','memo'],
    data: [
		[1,'00100161','张三','经理1','崮山','B1-标准1',2,'是','S1-标准1','股票1',''],
		[2,'00100162','李四','经理2','西藏一','B2-标准2',2,'是','S2-标准2','股票1',''],
		[3,'00100163','王五','经理3','金山','B3-标准3',2,'是','S3-标准3','股票1',''],
		[4,'00100164','汤六','经理4','松江一','B4-标准4',2,'是','S4-标准4','股票4',''],
	]
});
var bi_store = new Ext.data.ArrayStore({
    fields: ['ID','Title'],
    data: [
		["ZF",'ZF - 自有美发'],
		["ZR",'ZR - 自有美容'],
		["WF",'WF - 外购美发'],
		["WR",'WR - 外购美容'],
		["Q",'Q - 其他'],
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
											html : '<font style="color:red;">1、按“月”设定员工待遇及奖金标准。每个月可以不同。</font>',
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
											html : '<font style="color:red;">2、只能设定“本月”和“上月”的标准。</font>',
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
											html : '<font style="color:red;">3、必须选择门店或员工，才可以查询。</font>',
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
										html : '<font style="color:#9A9A9A;">工号或姓名</font>',
										style : {
											marginTop : '3px',
											marginLeft : '2px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">待遇及奖金标准</font>',
										style : {
											marginTop : '3px',
											marginLeft : '150px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">扣除培训基金标准</font>',
										style : {
											marginTop : '3px',
											marginLeft : '80px'
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
									width : 210,
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
												pd_top_form.find("name", "bonus")[0].focus(false, 100);
											}
										}
									},
									style : {
										marginLeft : '3px'

									}

								}, {

									xtype : "combo",
									name : "bonus",
									store : tar_bonus,
									displayField : "Title",
									valueField : "ID",
									editable : false,
									width : 160,
									triggerAction : 'all',
									mode : 'local',
									enableKeyEvents : true,
									selectOnFocus : true,
									forceSelection : true,
									editable : true,
									hideTrigger : true,
									listeners : {
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "deduction")[0].focus(false, 100);
											}
										}
										
									},

									style : {
										marginLeft : '3px',
									}
								},
								{
									xtype : "combo",
									name : "deduction",
									store : tar_deduction,
									displayField : "Title",
									valueField : "ID",
									editable : false,
									width : 155,
									triggerAction : 'all',
									mode : 'local',
									enableKeyEvents : true,
									selectOnFocus : true,
									allowBlank : true,
									forceSelection : true,
									hideTrigger : true,
									
									listeners : {
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												Ext.getCmp("btnSave").fireEvent('click');
											}
										}
									},
									style : {
										marginLeft : '3px'
									},
								},
								{
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
	
	var codeValue = pd_top_form.find("name", "mycode")[0].getRawValue();
	var typeValue = pd_top_form.find("name", "mytype")[0].getRawValue();
	var arr1 = codeValue.split(' ');
	var arr2 = typeValue.split(' - ');
	console.log(arr2);
	var record = new Ext.data.Record({
		ID:1,
		Code:arr1[0],
		Title:arr1[2],
		Duty:arr2[1],
		Dept:pd_top_form.find("name", "price")[0].getRawValue()
	});
	pd_grid.stopEditing();
	pd_store.insert(0,record);//可以自定义在stroe的某个位置插入一行数据。
	pd_grid.startEditing(3, 0);
	pd_top_form.find("name", "EmpId")[0].setValue('');
	pd_top_form.find("name", "bonus")[0].setValue('');
	pd_top_form.find("name", "decoration")[0].setValue('');
	
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

		columns : [new Ext.grid.RowNumberer(), {
				header : 'ID',
				dataIndex : 'ID',
				ID : "ID",
				hidden : true,
				width : 10
			}, {
				header : '<center style="font-weight:bold;">工号</center>',
				dataIndex : 'Code',
				width : 100,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">姓名</center>',
				dataIndex : "Title",
				width : 100,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">门店</center>',
				dataIndex : "store",
				width : 100

			}
			, {
				header : '<center style="font-weight:bold;">职务</center>',
				dataIndex : "position",
				width : 100,
				align:"left"

			},{
				header : '<center style="font-weight:bold;">待遇及奖金标准</center>',
				dataIndex : "bonus",
				width : 110,
				align:"left"
            },{
				header : '<center style="font-weight:bold;">培训期数</center>',
				dataIndex : "training_num",
				width : 100,
				align:"right"
            },{
				header : '<center style="font-weight:bold;">审批</center>',
				dataIndex : "check",
				width : 100,
				align:"left"
            },{
				header : '<center style="font-weight:bold;">扣除培训基金标准</center>',
				dataIndex : "decoration",
				width : 110,
				align:"left"
            },{
				header : '<center style="font-weight:bold;">股份</center>',
				dataIndex : "stock",
				width : 100,
				align:"left"
			},{
				header : '<center style="font-weight:bold;">备注</center>',
				dataIndex : "memo",
				width : 120,
				align:"left"
			}			
			,{
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
     pd_top_form.getForm().findField("mycode").disable();
     pd_top_form.getForm().findField("mytype").disable();
     pd_top_form.getForm().findField("price").disable();
	 cm.columns[6].hidden=true;
	 //pd_top_form.getForm().find("name","btnSave")[0].hidden();
	// pd_top_form.find("id", "btnSave")[0].editable=false;
   }
   else
   {
     pd_top_form.getForm().findField("mycode").enable();
     pd_top_form.getForm().findField("mytype").enable();
     pd_top_form.getForm().findField("price").enable();
	 cm.columns[6].hidden=false;
	 //pd_top_form.find("id", "btnSave")[0].editable=true;
   }
}
centerPanel.add(pd_main_panel);
centerPanel.doLayout();