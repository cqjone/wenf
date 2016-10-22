var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getMonth()-1);

//列表数据
var pd_store = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/LogisticsManagement.aspx?actionName=getSocialSWithhold&sid=' + Sys.sid,
	autoLoad : true,
	reader : new Ext.data.JsonReader({
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
				name : "Price",
				mapping : "Price"
			}
		]
	}),
});

/*
var monthStore = new Ext.data.ArrayStore({
   fields: ['ID', 'Title'],
    data: [["2014年8月", "2014年8月"],["2014年9月", "2014年9月"]]
});
*/
//日期数据源
var period_store = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:false,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getExistPeriod&tableName=iSocialSWithhold&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
		]
	}),
	sortInfo: {field: 'Value',direction:'desc'}
});
period_store.load();


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
											html : '<font style="color:red;">3、"编号"必须唯一，并且作为录入的快捷输入字。</font>',
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
                                width: 145,
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
                								var last=today.getFullYear()+"-"+(today.getMonth()+1);
												if(Date.parse(lastMonth)>Date.parse(period)){
													pd_top_form.getForm().findField("Code").disable();
													pd_top_form.getForm().findField("Name").disable();
													pd_top_form.getForm().findField("Price").disable();
													cm.columns[5].hidden=true;
													pd_top_form.getForm().find("name","btnSave").disable();
												}else{
													pd_top_form.getForm().findField("Code").enable();
													pd_top_form.getForm().findField("Name").enable();
													pd_top_form.getForm().findField("Price").enable();
													cm.columns[5].hidden=false;
												}
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
									marginLeft : '3px',
									marginTop : '5px'
								},
								items : [
									
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">编号</font>',
										style : {
											marginTop : '3px',
											marginLeft : '5px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">标准名称</font>',
										style : {
											marginTop : '3px',
											marginLeft : '120px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">代扣金额</font>',
										style : {
											marginTop : '3px',
											marginLeft : '200px'
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
								items : [//one
								 {
									xtype : "textfield",
									name : "Code",
									width : 150,
									minLength:1,
									minLengthText:'最少输入1个字符',
									maxLength:8,
									maxLengthText:'最多输入8个字符',
									regex:/^[A-Za-z0-9]+$/,
									//allowBlank:false,
									listeners : {									
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "Name")[0].focus(false, 100);
											}
										}
									},
									style : {
										marginLeft : '3px'

									}
								}, {
									xtype : "textfield",
									name : "Name",
									width : 250,
									listeners : {									
										'specialkey' : function (_field, _e) {
											
											if (_e.getKey() == _e.ENTER) {
												pd_top_form.find("name", "Price")[0].focus(false, 100);
											}
										}
									},

									style : {
										marginLeft : '3px',
									}

								},{
									xtype : "textfield",
									name : "Price",
									width : 100,
									
									listeners : {									
										'specialkey' : function (_field, _e) {
											if (_e.getKey() == _e.ENTER) {
												Ext.getCmp("btnSave").fireEvent('click');
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
											name : "btnSave",
											text : "保 存",
											listeners : {
												click : function () {
													id = 0;
													AddData();
												}
											},
											style : {
												marginTop : '-1px'
											},
											
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
									},
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
//删除记录
function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
		  	Ext.Ajax.request({
				url : "../Apis/LogisticsManagement.aspx?actionName=delSocialSWithhold&sid=" + Sys.sid, 
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
        }
    });
}
//新增记录
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
	var Code = pd_top_form.getForm().findField("Code").getValue().trim();
	var Name = pd_top_form.getForm().findField("Name").getValue().trim();
	var Price = pd_top_form.getForm().findField("Price").getValue().trim();
	if (Code == null || Code == "") {
		Ext.MessageBox.alert("提醒", "请输入编号");
		pd_top_form.find("name", "Code")[0].focus(false, 100);
		return;
	}
	else if(Code.length>8)
	{
	   Ext.MessageBox.alert("提醒", "编号最大长度为8,请重新输入");
	   pd_top_form.find("name", "Code")[0].focus(false, 100);
	   return;
	}
	else {
		var reg = /^[A-Za-z0-9]+$/;
		if (!reg.test(Code)) {
			Ext.MessageBox.alert("提醒", "编号只能为英文字母和数字,请输入正确的编号");
			pd_top_form.find("name", "Code")[0].focus(false, 100);
			return;
		}
	}
	if (Name == null || Name == "") {
		Ext.MessageBox.alert("提醒", "请输入标准名称");
		pd_top_form.find("name", "Name")[0].focus(false, 100);
		return;
	}else if(Name.length>16)
	{
	   Ext.MessageBox.alert("提醒", "标准名称最大长度为16,请重新输入");
	   pd_top_form.find("name", "Name")[0].focus(false, 100);
	   return;
	}
	if (Price == null || Price == "") {
		Ext.MessageBox.alert("提醒", "请输入代扣金额");
		pd_top_form.find("name", "Price")[0].focus(false, 100);
		return;
	}else {
		var reg = /^[0-9]{1,6}(\.[0-9]{1,4})?$/;
		if (!reg.test(Price)) {
			Ext.MessageBox.alert("提醒", "请输入正确的数值");
			pd_top_form.find("name", "Price")[0].focus(false, 100);
			return;
		}
	}
	if (pd_top_form.getForm().isValid()) {
	
		Ext.Ajax.request({
			url : "../Apis/LogisticsManagement.aspx?actionName=addSocialSWithhold&sid=" + Sys.sid, 
			params : {
				myYear :myYear ,
				myMonth : myMonth,
				Code : Code,
				Name : Name,
				Price : Price
			},
			success : function (form, action) {
				var respText = Ext.util.JSON.decode(form.responseText);
			    if(respText.success==false){
			        Ext.MessageBox.alert("提醒",respText.msg);
			        return false;
			    }
				pd_top_form.find("name", "Code")[0].setValue("");
				pd_top_form.find("name", "Name")[0].setValue("");
				pd_top_form.find("name", "Price")[0].setValue("");
				//操作成功
				pd_store.reload();
				pd_top_form.find("name", "Code")[0].focus(false, 100);
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

		columns : [new Ext.grid.RowNumberer(), {
				header : 'ID',
				dataIndex : 'ID',
				ID : "ID",
				hidden : true,
				width : 100
			}, {
				header : '<center style="font-weight:bold;">编号</center>',
				
				dataIndex : 'Code',
				width : 100,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">标准名称</center>',
				dataIndex : "Title",
				width : 250,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">代扣金额</center>',
				dataIndex : "Price",
				width : 100,
				align : 'right'

			}
			, {
				//删除按钮
				header : '<center style="font-weight:bold;">操作</center>',
				dataIndex : "ID",
				width : 100,
				align : 'center',
				name:'delCols',
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
//查询控件默认赋值
var setDefaultValues = function () {
	var now = new Date();
	var date = now.format('Y年m月');
	pd_top_form.find("name", "comboPeriod")[0].setValue(date);
	pd_top_form.show();
};

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
setDefaultValues();