
//获取物料类型数据
/**var tar_type = new Ext.data.Store({
autoDestroy: true,
url: '../Apis/LogisticsManagement.aspx?actionName=getLogisticsTypeName&DeptID=1&sid=' + Sys.sid,
reader: new Ext.data.JsonReader({
fields: [
{ name: "shorttext", mapping: "shorttext" },
{ name: "displaytext", mapping: "displaytext" }
]
}),
sortInfo: { field: 'shorttext', direction: 'ASC' }
});**/

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

var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getDate()-3);
var tar_type = new Ext.data.ArrayStore({
		fields : ['value', 'text'],
		data : [
			["R", "R - 入库"],
			["L", "L - 领用"],
			["X", "X - 销售"],
			["P", "P - 盘点"]]

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
		items : [{
					items : [//third
								{
									xtype : "label",
									html : '<font style="color:red;">1、本单据重要，请谨慎录入。</font>',
									style : {
										marginTop : '3px',
										marginLeft : '4px'
									}
								}
							
						]							
				},
				{
					items : [//third
								{
									xtype : "label",
									html : '<font style="color:red;">2、只允许录入三天内的单据，也可以删除三天内的单据。</font>',
									style : {
										marginTop : '20px',
										marginLeft : '4px'
									}
								}
							
						]							
				},
				{
					items : [//third
								{
									xtype : "label",
									html : '<font style="color:red;">3、指定产品、指定日期，录入盘点单据后，不允许再录入进货或销售或领用单据。</font>',
									style : {
										marginTop : '20px',
										marginLeft : '4px'
									}
								}
							
						]							
				},
				{ //first
					xtype : "fieldset",
					title : "物流单据录入",
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
										html : '<font style="color:#9A9A9A;">单据日期</font>',
										
										style : {
											marginTop : '3px',
											marginLeft : '3px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">产品编号或名称</font>',
										style : {
											marginTop : '3px',
											marginLeft : '80px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">类型</font>',
										style : {
											marginTop : '3px',
											marginLeft : '138px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">数量</font>',
										style : {
											marginTop : '3px',
											marginLeft : '100px'
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
									xtype : "datefield",
									
									minValue: lastDay,
									maxValue: today.format("Y-m-d"),
									editable: false,
									fieldLabel : "日期",
									name : "mydate",
									format : "Y-m-d",
									enableKeyEvents : true,
									width : 125,
									listeners : {
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "mycode")[0].focus(false, 100);
											}
										}
									}
								}, {
									xtype : "combo",
									fieldLabel : "产品编号",
									name : "mycode",
									hiddenName: "Code",
									store : tar_product,
									triggerAction: 'all',
									width : 220,
									border : 1,
									valueField : 'ID',
									displayField : 'Code',
									enableKeyEvents : true,
									selectOnFocus : true,
									allowBlank : true,
									forceSelection : true,
									hideTrigger : true,
									listeners : {
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "mytype")[0].focus(false, 100);
											}
										},
									   "keyup": function (v) {
											var value = v.getRawValue();
											if(value!= null && value.length >=2) {
												tar_product.load({
													params: { Code: v.getRawValue() }
												});
											}
										}
									},
									style : {
										marginLeft : '3px'

									}
								}, {

									

									xtype : "combo",
									name : "mytype",
									store : tar_type,
									displayField : "text",
									valueField : "value",
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
												pd_top_form.find("name", "mycount")[0].focus(false, 100);
											}
										},
										show:function(){
											alert();			    
										}
									},

									style : {
										marginLeft : '3px',
									}

								}, {
									xtype : "textfield",
									fieldLabel : "数量",
									name : "mycount",
									width : 130,
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
	var date = now.format('Y-m-d');
	pd_top_form.find("name", "mydate")[0].setValue(date);
	pd_top_form.find("name", "isThisMonth")[0].setValue(true);
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

//添加Form窗口
var AddForm = new Ext.form.FormPanel({
		frame : true,
		//autoScroll: true,
		labelWidth : 80,
		// bodyStyle: 'padding:5px',
		layout : "column",
		labelAlign : 'right',
		bodyStyle : "margin:0 -40px",
		items : [{
				layout : "form",
				columnWidth : 0.48,
				items : [{
						xtype : "textfield",
						fieldLabel : "编 号",
						name : "Code",
						//id: "Code",
						allowBlank : false,
						anchor : "100%"
					}, {
						xtype : "combo",
						fieldLabel : "类 型",
						anchor : "100%",
						hiddenName : "LimitType",
						triggerAction : 'all',
						allowBlank : false,
						editable : false,
						mode : 'local',
						store : new Ext.data.ArrayStore({
							fields : ['myId', 'displayText'],
							data : type_data
						}),
						valueField : 'myId',
						displayField : 'displayText'
					}
				]
			}, {
				layout : "form",
				columnWidth : 0.5,
				bodyStyle : "margin:0 -20px",
				items : [{
						xtype : "textfield",
						fieldLabel : "名 称",
						name : "Title",
						allowBlank : false,
						anchor : "98%"
					}, {
						xtype : "numberfield",
						fieldLabel : "数 量",
						name : "LimitCount",
						//id: "LimitCount",
						allowBlank : false,
						anchor : "98%"
					}
				]
			}, {
				columnWidth : 0.965,
				layout : 'form',
				items : [{
						//id:'memoinfo',
						xtype : 'textfield',
						fieldLabel : '备 注',
						name : 'MemoInfo',
						anchor : '97%'
					}
				]
			}, {
				columnWidth : 0.965,
				layout : 'column',
				items : [{
						columnWidth : 0.7,
						layout : "form",
						items : [{
								//id:'memoinfo',
								xtype : 'textfield',
								fieldLabel : '卡类型',
								name : 'CardType',
								readOnly : true,
								anchor : '94%'
							}
						]
					}, {
						columnWidth : 0.2,
						xtype : "button",
						text : "选择",
						handler : function () {
							var ids = AddForm.find("name", "CardTypeID")[0].getValue();
							//alert(ids);
							SelectDeptWindow.show();
							checkNow();
						}
					}, {
						xtype : "hidden",
						name : "CardTypeID"
					}
				]
			}
		],
		buttons : [{
				text : '保  存',
				handler : function () {
					SelectCode();
				}
			}, {
				text : '取  消',
				handler : function () {
					AddForm.getForm().reset();
					AddWindow.hide();
				}
			}
		]
	});

//======卡类型选择=====
var ptree = new Ext.tree.TreePanel({
		dataUrl : '../Apis/Dept.aspx?actionName=GetCardType&sid=' + Sys.sid,
		xtype : 'treepanel',
		useArrows : true,
		autoScroll : true,
		animate : true,
		enableDD : true,
		autoScroll : true,
		root : {
			checked : false,
			expanded : true,
			nodeType : 'async',
			id : "0",
			text : "卡类型全选"
		}
	});

//保存所有选择的ID和名称
var ids = ",";
var titles = "";

ptree.on("afterrender", function (t) {
	//alert("tt");
	//只执行一次
	checkNow();
});

//把现有的勾选上
function checkNow() {
	ids = AddForm.find("name", "CardTypeID")[0].getValue();
	//alert(ids);
	var aids = ids.split(",");
	//alert(aids.length);
	ptree.root.eachChild(function (child) {
		//alert(child.id); return;
		for (var i = 0; i < aids.length; i++) {
			if (child.id == aids[i]) {
				child.ui.toggleCheck(true);
				child.attributes.checked = true;
			}
		}
	});
}

ptree.on('checkchange', function (node, checked) {
	ids = ",";
	titles = "";

	//判断是不是全选
	if (node.id == 0) {
		if (node.hasChildNodes()) {
			node.eachChild(function (child) {
				if (child.id > 0) {
					ids += child.id + ",";
					titles += child.text + ",";
					child.ui.toggleCheck(checked);
					child.attributes.checked = checked;
				}
			})
		}

		AddForm.find("name", "CardTypeID")[0].setValue(ids);
		AddForm.find("name", "CardType")[0].setValue(titles);
		return;
	} else {

		var checkeds = ptree.getChecked();

		for (var i = 0; i < checkeds.length; i++) {
			if (checkeds[i].id > 0) {
				ids += checkeds[i].id + ",";
				titles += checkeds[i].text + ",";
			}
		}

		AddForm.find("name", "CardTypeID")[0].setValue(ids);
		AddForm.find("name", "CardType")[0].setValue(titles);
		//alert(ids + "\r\n" + titles);
	}
});

var SelectDeptWindow = new Ext.Window({
		layout : 'fit',
		width : 400,
		height : 300,
		modal : true,
		closeAction : 'hide',
		title : "店铺选择",
		items : [ptree]
	});

//======卡类型选择=====


//查询编号是否存在
function SelectCode() {
	var count = AddForm.find("name", "Num")[0].getValue();
	if (count < 0) {
		Ext.MessageBox.alert("提醒", "数量不能为负数");
		return false;
	};
	if (AddForm.getForm().isValid()) {
		AddForm.getForm().submit({
			params : {
				cid : AddForm.find("name", "Code")[0].getValue(),
				uid : getId(pd_grid)
			},
			url : "../Apis/DeptLimit.aspx?actionName=selectCode&sid=" + Sys.sid,
			success : function (form, action) {
				// Ext.MessageBox.alert("提醒", action.result.msg);
				//pd_store.load();
				if (action.result.success) {
					if (id == 0) {
						// AddAction();
					} else {
						// UpdateAction();
					};
					pd_store.load();
				}
			},
			failure : function (form, action) {
				if (action != undefined && action.result != undefined) {
					Ext.MessageBox.alert("提醒", action.result.msg);
				} else {
					Ext.MessageBox.alert("提醒", "服务器繁忙，请稍候在试！");
				}
			}
		});
	}
}

//修改
function UpdateAction() {

	if (AddForm.getForm().isValid()) {
		AddForm.getForm().submit({
			params : {
				id : getId(pd_grid)
			},
			waitMsg : "正在提交，请稍候...",
			url : "../Apis/DeptLimit.aspx?actionName=submitDeptLimit&sid=" + Sys.sid,
			success : function (form, action) {
				Ext.MessageBox.alert("提醒", action.result.msg);
				//alert("1");
			},
			failure : function (form, action) {
				debugger;
				if (action != undefined && action.result != undefined) {
					Ext.MessageBox.alert("提醒", action.result.msg);
				} else {
					Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
				}
			}
		});
	};
}

//添加Window窗口
var AddWindow = new Ext.Window({
		//layout: 'fit',
		width : 550,
		
		autoScroll : true,
		//height: 158,
		modal : true,
		closeAction : 'hide',
		title : "物料登记",
		plain : true,
		items : [AddForm]
	});

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
				header : '日期',
				dataIndex : 'BillDate',
				width : 130,
				align : 'center'
			}, {
				header : "产品编号",
				dataIndex : "Code",
				width : 110,
				align : 'center'
			}, {
				header : "产品名称",
				dataIndex : "Title",
				width : 110

			}, {
				header : "类型",
				dataIndex : "type",
				width : 130,
				align : 'center'

			}, {
				header : "数量",
				dataIndex : "Num",
				width : 130,
				align : 'right'
			}, {
				//删除按钮
				header : "操作",
				dataIndex : "button",
				width : 100,
				align : 'center',
				renderer : showbuttonDele

			}
		]
	});

function showbuttonDele(value, metadata, record, rowIndex, columnIndex, store) {
	window.DelInfo = function (rowIndex) {
		var selections = pd_grid.selModel.getSelections();
		var s = pd_grid.getSelectionModel().getSelected().get("ID");

		Ext.Msg.confirm('提示', '确定删除？', function (btn) {
			if (btn == 'yes') {
				Ext.each(selections, function (item) {
					var delID = s;
					Ext.Ajax.request({
						params : {
							id : id
						},
						success : function (form, action) {
							pd_store.reload();
						},

						url : '../Apis/LogisticsManagement.aspx?actionName=deleteItem&sid=' + Sys.sid
					});

				});
			}
		});
	};
	/**var resultStr = ""; 
	var billDate = record.data["BillDate"];
	if(billDate!= null && typeof(billDate)!="undefined"){
		var date = new Date();
		var crtMonth = date.getMonth()+1;
		var month = parseInt(billDate.split('-')[1]);
		if(month==crtMonth || date.getDate()<5){
			resultStr = "<a href='#' onclick='DelInfo(" + rowIndex + ")'>删除</a> ";
		}
	}**/
	
	var resultStr = "<a href='#' onclick='DelInfo(" + rowIndex + ")'>删除</a> ";
	return resultStr;
}

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
					name : "date",
					mapping : "date"
				}, 
				{
					name : "BillDate",
					mapping : "BillDate"
				},
				{
					name : "Code",
					mapping : "Code"
				}, {
					name : "Title",
					mapping : "Title"
				}, {
					name : "type",
					mapping : "type"
				}, {
					name : "Num",
					mapping : "Num"
				}, {
					name : "id",
					mapping : "id"
				}
			]
		}),
	});
var defaultShow = function () {
	var curDate = new Date();
	var mydate = Ext.Date.format(curDate, 'Y-m-d');
	pd_top_form.find("name", "date")[0].setValue(mydate);
}
var pd_grid = new Ext.grid.GridPanel({
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
AddForm.getForm().reset();
//表格添加双击事件
/* pd_grid.on("rowdblclick", function(g, rowindex, e) {
AddForm.getForm().reset();
var r = pd_grid.getStore().getAt(rowindex);
AddForm.find("name", "Code")[0].setValue(r.get("Code"));
AddForm.find("name", "Title")[0].setValue(r.get("Title"));
AddForm.find("hiddenName", "type")[0].setValue(r.get("LimitType"));
AddForm.find("name", "count")[0].setValue(r.get("LimitCount"));
AddForm.find("name", "MemoInfo")[0].setValue(r.get("MemoInfo"));
AddForm.find("name", "CardTypeID")[0].setValue(r.get("CardTypeID"));
AddForm.find("name", "CardType")[0].setValue(r.get("CardType"));
// AddWindow.show();
id = getId(pd_grid);
});*/

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
//添加
function AddAction() {
	if (!validateDate()) {
		return;
	}
	var mydate = Ext.util.Format.date(pd_top_form.find("name", "mydate")[0].getValue(), 'Y-m-d');
	var mycode = pd_top_form.find("name", "mycode")[0].getValue();
	
	var mytype = pd_top_form.find("name", "mytype")[0].getRawValue();
	var mycount = pd_top_form.find("name", "mycount")[0].getValue();
	if (mydate == null || mydate == "") {
		Ext.MessageBox.alert("提醒", "请选择日期");
		pd_top_form.find("name", "mydate")[0].focus(false, 100);
		return;
	}

	if (mycode == null || mycode == "") {
		Ext.MessageBox.alert("提醒", "请选择产品");
		pd_top_form.find("name", "mycode")[0].focus(false, 100);
		return;
	}

	if (mytype == null || mytype == "") {
		Ext.MessageBox.alert("提醒", "请选择类型");
		pd_top_form.find("name", "mytype")[0].focus(false, 100);
		return;
	}

	if (mycount == null || mycount == "") {
		Ext.MessageBox.alert("提醒", "请输入数字");
		pd_top_form.find("name", "mycount")[0].focus(false, 100);
		return;
	} else {
		var reg = /^(-)?\d+$/;
		if (!reg.test(mycount)) {
			Ext.MessageBox.alert("提醒", "请输入正确的整数值");
			pd_top_form.find("name", "mycount")[0].focus(false, 100);
			return;
		}
		
		if(parseInt(mycount)==0 && mytype.indexOf("P")==-1){
			Ext.MessageBox.alert("提醒", "除盘点外不得输入等于0的数字");
			pd_top_form.find("name", "mycount")[0].focus(false, 100);
			return;
		}
	}
	var day=Ext.util.Format.date(mydate,'d');

	/**if(day<10&&mytype.indexOf("P")>-1){
	    Ext.MessageBox.confirm("提醒", "确定月初进行盘点录入？",function(e){
	       // if(e=="yes"){
					if (pd_top_form.getForm().isValid()) {
						Ext.Ajax.request({
							url : "../Apis/LogisticsManagement.aspx?actionName=addLogisticsRegister&DeptID=1&sid=" + Sys.sid, //+"&mydate="+mydate+"&myCode="+mycode+"&mytype="+mytype+"&mycount="+mycount,

							params : {
								mydate : mydate,
								mycode : mycode,
								mytype : mytype,
								mycount : mycount
							},
							success : function (form, action) {
								var respText = Ext.util.JSON.decode(form.responseText);
								if(respText.success==false){
									Ext.MessageBox.alert("提醒",respText.msg);
									return false;
								}
								//Ext.MessageBox.alert("提醒", action.result.msg);
								pd_top_form.find("name", "mycode")[0].setValue("");
								pd_top_form.find("name", "mycount")[0].setValue("");
								pd_top_form.find("name", "mytype")[0].setValue("");
								//操作成功
								//Ext.MessageBox.alert("提醒", "提交成功");
								pd_store.reload();
								pd_top_form.find("name", "mycode")[0].focus(false, 100);
								return true;
							},
							failure : function () {

								if (action != undefined && action.result != undefined) {
									Ext.MessageBox.alert("提醒", action.result.msg);
								} else {
									Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
								}
							}
						});
					}
	        }else{
	            pd_top_form.find("name", "mytype")[0].focus(false, 100);
	        }
	    });
		return false;
	}**/

	if (pd_top_form.getForm().isValid()) {
	
		Ext.Ajax.request({
			url : "../Apis/LogisticsManagement.aspx?actionName=addLogisticsRegister&DeptID=1&sid=" + Sys.sid, //+"&mydate="+mydate+"&myCode="+mycode+"&mytype="+mytype+"&mycount="+mycount,

			params : {
				mydate : mydate,
				mycode : mycode,
				mytype : mytype,
				mycount : mycount
			},
			success : function (form, action) {
				var respText = Ext.util.JSON.decode(form.responseText);
			    if(respText.success==false){
			        Ext.MessageBox.alert("提醒",respText.msg);
			        return false;
			    }
				//Ext.MessageBox.alert("提醒", action.result.msg);
				pd_top_form.find("name", "mycode")[0].setValue("");
				pd_top_form.find("name", "mycount")[0].setValue("");
				pd_top_form.find("name", "mytype")[0].setValue("");
				//操作成功
				//Ext.MessageBox.alert("提醒", "提交成功");
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
		/*pd_top_form.getForm().submit({
		//params: { mydate: , Code: pd_top_form.find("name", "Code")[0].getValue(),type: pd_top_form.find("name", "type")[0].getRawValue(),type: pd_top_form.find("name", "count")[0].getValue()},
		waitMsg: "正在提交，请稍候...",
		url: "../Apis/LogisticsManagement.aspx?actionName=addLogisticsRegister&DeptID=1&sid=" + Sys.sid+"&mydate="+mydate+"&myCode="+mycode+"&mytype="+mytype+"&mycount="+mycount,
		success: function (form, action) {
		Ext.MessageBox.alert("提醒", action.result.msg);
		pd_top_form.find("name", "Code")[0].setValue("");
		pd_top_form.find("name", "Title")[0].setValue("");
		pd_top_form.find("name", "count")[0].setValue("");
		pd_top_form.find("hiddenName", "type")[0].setValue("");
		pd_top_form.find("name", "type")[0].setValue("");
		//操作成功
		AddWindow.hide();
		pd_store.reload();
		},
		failure: function (form, action) {
		if (action != undefined && action.result != undefined) {
		Ext.MessageBox.alert("提醒", action.result.msg);
		} else {
		Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
		}
		}
		});*/
	}
}
//验证日期
function validateDate() {
	/**var date = pd_top_form.find("name", "mydate")[0].getValue();
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();

	var selectedMonth = date.getMonth() + 1;

	if (date.getFullYear() != year) {
		Ext.MessageBox.alert("提醒", "年份选择有误");
		return false;
	}
	if (selectedMonth > month) {
		Ext.MessageBox.alert("提醒", "月份选择有误");
		return false;
	}

	if (day > 5 && month != selectedMonth || day < 5 && month - selectedMonth > 1) {
		Ext.MessageBox.alert("提醒", "月份选择有误！");
		return false;
	}**/
	return true;
}
centerPanel.add(pd_main_panel);
centerPanel.doLayout();