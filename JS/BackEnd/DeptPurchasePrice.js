
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
		url : '../Apis/LogisticsManagement.aspx?actionName=getProduct&sid=' + Sys.sid,
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

//日期数据源
var period_store = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:false,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getExistPeriod&tableName=iDeptPurchasePrice&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
		]
	}),
	sortInfo: {field: 'Value',direction:'desc'}
});
period_store.load();	
//当月和上月
var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getMonth()-1);
var thisMonth=today.getFullYear()+"-"+today.getMonth();
var lastMonth=lastDay.getFullYear()+"-"+lastDay.getMonth();
//列表数据
var pd_store = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/LogisticsManagement.aspx?actionName=getDeptPurchasePrice&sid=' + Sys.sid,
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
					name : "BiType",
					mapping : "BiType"
				}, {
					name : "Price",
					mapping : "Price"
				}, {
					name : "ID",
					mapping : "ID"
				}
			]
		}),
	});
var bi_store = new Ext.data.ArrayStore({
    fields: ['ID','Title'],
    data: [
		["1",'ZF - 自有美发'],
		["2",'ZR - 自有美容'],
		["3",'WF - 外购美发'],
		["4",'WR - 外购美容'],
		["5",'Q - 其他'],
	]
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
											html : '<font style="color:red;">1、按"月"设定产品门店进货价格。每月可以不同。</font>',
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
											html : '<font style="color:red;">2、只能设定"本月"和"上月"的价格。</font>',
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
											html : '<font style="color:red;">3、只有设定过进货价格的产品，才允许在前台物流单据中录入。</font>',
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
										html : '<font style="color:#9A9A9A;">产品编号或者名称</font>',
										style : {
											marginTop : '3px',
											marginLeft : '2px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">BI大类</font>',
										style : {
											marginTop : '3px',
											marginLeft : '167px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">价格</font>',
										style : {
											marginTop : '3px',
											marginLeft : '73px'
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
									name : "mycode",
									hiddenName: "mycode",
									store : tar_product,
									triggerAction: 'query',
									width : 260,
									border : 1,
									valueField : 'ID',
									displayField : 'Code',
									enableKeyEvents : true,
									selectOnFocus : false,
									minChars : 3,
									mode : 'local',  
									allowBlank : true,
									forceSelection : false,
									hideTrigger : true,
									listeners : {									
									   "keyup": function (v) {
											var value = v.getRawValue();
											if(value != null && value!=""){
												tar_product.load({
													params: { key: v.getRawValue() }
												});
											}
											
										},
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "mytype")[0].focus(false, 100);
											}
										}
									},
									style : {
										marginLeft : '3px'

									}

								}, {

									xtype : "combo",
									name : "mytype",
									hiddenName: "mytype",
									store : bi_store,
									displayField : "Title",
									valueField : "ID",
									editable : false,
									width : 128,
									triggerAction : 'all',
									mode : 'local',
									enableKeyEvents : true,
									selectOnFocus : true,
									forceSelection : true,
									editable : true,
									listeners : {
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "price")[0].focus(false, 100);
											}
										},
										"keyup": function (v) {
											var value = v.getRawValue();
											
											if(value != null && value!=""){
												tar_product.load({
													params: { key: v.getRawValue() }
												});
											}
											
										}
										
									},

									style : {
										marginLeft : '3px',
									}
								},
								{
									xtype : "combo",
									name : "price",
									width : 110,
									forceSelection : false,
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
												    id=0;
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
	pd_top_form.find("name", "mycode")[0].setValue('');
	pd_top_form.find("name", "mytype")[0].setValue('');
	pd_top_form.find("name", "price")[0].setValue('');
	
	//pd_top_form.find("name", "EmployeeCode")[0].setValue("");
	
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
	var ProductID = pd_top_form.getForm().findField("mycode").getValue();
	var BiType=pd_top_form.find("name", "mytype")[0].getRawValue();
	var BiTypeID=pd_top_form.getForm().findField("mytype").getValue();
	var price=pd_top_form.find("name", "price")[0].getRawValue();
	if (ProductID == null || ProductID == "") {
		Ext.MessageBox.alert("提醒", "请选择产品");
		pd_top_form.find("name", "mycode")[0].focus(false, 100);
		return;
	}
	if (BiType == null || BiType == "") {
		Ext.MessageBox.alert("提醒", "请选择Bi大类");
		pd_top_form.find("name", "mytype")[0].focus(false, 100);
		return;
	}
	if (price == null || price == "") {
		Ext.MessageBox.alert("提醒", "请输入价格");
		pd_top_form.find("name", "price")[0].focus(false, 100);
		return;
	}else {
		var reg = /^[0-9]{1,6}(\.[0-9]{1,4})?$/;
		if (!reg.test(price)) {
			Ext.MessageBox.alert("提醒", "请输入正确的数值");
			pd_top_form.find("name", "price")[0].focus(false, 100);
			return;
		}
	}
	if (pd_top_form.getForm().isValid()) {
	
		Ext.Ajax.request({
			url : "../Apis/LogisticsManagement.aspx?actionName=addDeptPurchasePrice&sid=" + Sys.sid, 
			params : {
				myYear :myYear ,
				myMonth : myMonth,
				ProductID : ProductID,
				price : price,
				BiType: BiType,
				BiTypeID:BiTypeID
			},
			success : function (form, action) {
				var respText = Ext.util.JSON.decode(form.responseText);
			    if(respText.success==false){
			        Ext.MessageBox.alert("提醒",respText.msg);
			        return false;
			    }
				pd_top_form.find("name", "mycode")[0].setValue("");
				pd_top_form.find("name", "price")[0].setValue("");
				//操作成功
				pd_store.reload();
				pd_top_form.find("name", "mycode")[0].focus(false, 100);
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
//删除记录
function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
		  	Ext.Ajax.request({
				url : "../Apis/LogisticsManagement.aspx?actionName=delDeptPurchasePrice&sid=" + Sys.sid, 
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
				header : '<center style="font-weight:bold;">产品编号</center>',
				
				dataIndex : 'Code',
				width : 130,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">产品名称</center>',
				dataIndex : "Title",
				width : 130,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">BI大类</center>',
				dataIndex : "BiType",
				width : 110,
				align : 'left'

			}
			, {
				header : '<center style="font-weight:bold;">价格</center>',
				dataIndex : "Price",
				width : 110,
				align:"right"

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
setDefaultValues();