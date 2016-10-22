  
  //时间的年份月份
 var queryYear = "";
 var queryMonth = "";
  
     //设置显示默认日期
 
	var now = new Date();
	var date = now.format('Y年m月');
	 queryYear = now.getFullYear();
	 var month=now.getMonth()+1;
	 if(month<10)
	 {
	 month+="0";
	 }
     queryMonth = month;
	
   
   

  
  
  //门店信息下拉框
  var tar_dept = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/CashierSetting.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
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
	url : '../Apis/CashierSetting.aspx?char_length=3&actionName=getEmployee&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'}
});


//列表数据
	 var pd_storeList = ["ID","区域", "大区","门店","片区主管工号","片区主管","备注","操作" ];

        var pd_store = new Ext.data.Store({
			url : '../Apis/CashierSetting.aspx?actionName=getdate&sid=' + Sys.sid,
			reader : new Ext.data.JsonReader({
			        root: "results",
                    id: "ID",
                    totalProperty: "totalCount",
			fields: pd_storeList,
				
			}),
			 groupField: 'ID',
			 sortInfo: { field: 'ID', direction: "ASC" }
		});
	
	
 pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});


//日期数据源
var period_store = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:false,
	url : '../Apis/CashierSetting.aspx?actionName=getPeriod&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
		]
	}),
	sortInfo: {field: 'Value',direction:'desc'}
});
period_store.load();



var id = 0;
var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : false,
		heigh : 100,
		//autoWidth:true,
		 autoScroll: true,
		items : [
		
			  {
					xtype : "fieldset",
					title : "注意事项",
					layout : "column",
					labelWidth : 50,
					labelAlign : 'right',
					style : {
						marginLeft : '4px',
						marginTop : '10px'
					},
					items : [//third
								
								{
									items:[
										{
											xtype : "label",
											html : '<font style="color:red;">1、按"月"设定收银片区,每月可以不同.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										},{
											xtype : "label",
											html : '<br><font style="color:red;">&nbsp;2、只能设定"本月"和"上月"的标准.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								},
								
							
						]							
				},
				{
					xtype : "fieldset",
					title : "条件",

					layout : "column",
					labelWidth : 50,
					labelAlign : 'right',
					

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
								                 queryYear = arr[0];
								                 queryMonth = arr[1];
								                 
								                  var now = new Date();
	                                        var date = now.format('Y年m月');
	                                             var yyear = now.getFullYear();
	                                                 var month=now.getMonth()+1;
	                                                 if(month<10)
	                                                    {
	                                                      month+="0";
		                                                     }
  	                                                      var ymonth = month;
                                                    if(yyear==queryYear &&  ymonth==queryMonth || ymonth-1==queryMonth )
                                                    {
                                              
                                                    }else
                                                    {
                                                      Ext.getCmp("btnSave").setDisabled(true);
                                               
                                                    }
								                 
								                pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
                								
							                }
										}
									}
							}
					]
				},
				
				{ //first
					xtype : "fieldset",
					title : "录入",
						layout : "column",
					labelWidth : 50,
					labelAlign : 'right',
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
//									marginLeft : '4px',
									marginTop : '10px'
								},
								items : [
									
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">工号或者姓名</font>',
										style : {
											    marginTop : '3px',
												marginLeft : '4px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">店名或者拼音缩写</font>',
										style : {
											marginTop : '3px',
											marginLeft : '135px',
										}
									},{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">备注</font>',
										style : {
											marginTop : '3px',
											marginLeft : '105px',
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
//										marginLeft : '20px'

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
											pd_top_form.find("name", "remark")[0].focus(false, 100);
											}
										}
									},

									style : {
										marginLeft : '5px',
									}

								}, {

									

									xtype : "textfield",
									name : "remark",
									width : 200,
									height:25,

									style : {
										marginLeft : '5px',
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
				header : '<center style="font-weight:bold;">区域</center>',
				
				dataIndex : '区域',
				sortable:true,
				width : 110,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">大区</center>',
				dataIndex : "大区",
					sortable:true,
				width : 110,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">门店</center>',
				dataIndex : "门店",
					sortable:true,
				width : 110,
				align : 'left'

			}, {
				header : '<center style="font-weight:bold;">片区主管工号</center>',
				dataIndex : "片区主管工号",
					sortable:true,
				width : 110,
				align : 'right'

			}
			
			, {
				header : '<center style="font-weight:bold;">片区主管</center>',
				dataIndex : "片区主管",
					sortable:true,
				width : 110,
				align : 'left'

			},{
				header : '<center style="font-weight:bold;">备注</center>',
				id:'Remark',
				dataIndex : "备注",
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
				url : "../Apis/CashierSetting.aspx?actionName=delEmployeeToDept&sid=" + Sys.sid, 
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
    //员工
	var EmpId = pd_top_form.find("name", "EmpId")[0].getValue();
	//部门
	var DeptId = pd_top_form.find("name", "DeptId")[0].getValue();
	
	var Reamrk=pd_top_form.find("name", "remark")[0].getValue();
	
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
			url : "../Apis/CashierSetting.aspx?actionName=addCashierSetting&sid=" + Sys.sid, 
			params : {
				queryYear :queryYear ,
				queryMonth : queryMonth,
				EmpId : EmpId,
			    DeptId : DeptId,
			    Reamrk:Reamrk
			},
			
			
			success : function (response, options) {
            if(response.responseText!=""){
            Ext.MessageBox.alert("提醒", response.responseText);
            }
            else
            {
				pd_top_form.find("name", "EmpId")[0].setValue("");
				pd_top_form.find("name", "DeptId")[0].setValue("");
					pd_top_form.find("name", "remark")[0].setValue("");
				//操作成功
			   pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
				pd_top_form.find("name", "EmpId")[0].focus(false, 100);
				
			}
			},
				failure : function (response, options) {
					  Ext.MessageBox.alert("提醒", response.responseText);
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

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
//设置显示默认日期
var setDefaultValues = function () {
//     Ext.getCmp("hideremark").disabled = true;
	var now = new Date();
	var date = now.format('Y年m月');
	 queryYear = now.getFullYear();
	 var month=now.getMonth()+1;
	 if(month<10)
	 {
	 month+="0";
	 }
     queryMonth = month;
	pd_top_form.find("name", "comboPeriod")[0].setValue(date);
	pd_top_form.show();
};
setDefaultValues();