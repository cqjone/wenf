    //期数
   var periodsNum="";


  
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
					items : [
								
								{
									items:[
										{
											xtype : "label",
											html : '<font style="color:red;">1、期数(必填项),是批量添加的期数!也是查询条件!也是添加人员的条件!点击批量添加,弹出批量添加窗口.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										},{
											xtype : "label",
											html : '<br><font style="color:red;">&nbsp;2、可以单独添加人员,添加过的人员同期内不能再添加.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										},{
											xtype : "label",
											html : '<br><font style="color:red;">&nbsp;3、点击删除,删除相应的数据.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								},
								
							
						]							
				},{
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
								layout : "column",
								columnWidth : 1,
								style : {
//									marginLeft : '4px',
									marginTop : '10px'
								},
								items : [
									
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;"><b>期数：</b></font>',
										style : {
											    marginTop : '3px',
												marginLeft : '4px'
										}
									},
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;"><b>员工：</b></font>',
										style : {
											marginTop : '3px',
											marginLeft : '130px',
										}
									}
								
									
								]
							},{ //second
								layout : "column",
								columnWidth : 1,
								style : {
									marginLeft : '2px',
									marginTop : '10px'
								},
								items : [//third
					               {
									xtype : "textfield",
									name : "periods",
									width : 150,
									height:25,
									regex :/^\d+$/,
									
									style : {
										marginLeft : '3px',
									}

								},
								 {
								
									
									xtype : "combo",
									name : "EmpId",
									hiddenName: "EmpId",
									store : tar_employee,
									triggerAction: 'all',
									width : 180,
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
											
											}
										}
									},
									style : {
										marginLeft : '20px'

									}
								}, {
									width : 250,
									style : {
										marginTop : '-7px'
									},
									buttons : [ {
											id : "btnsearch",
											text : "查 询",
											listeners : {
												click : function () {
												
													SearchAction();
												}
											}
											
										},{
											id : "btnadd",
											text : "添 加",
											listeners : {
												click : function () {
												
													AddEmployeeAction();
												}
											}
											
										},{
											id : "btnSave",
											text : "批量添加",
											listeners : {
												click : function () {
												
													AddAction();
												}
											}
											
										}
							
								]
								
								}
								
								
								
								
								
										/*{
										text: " 删  除",
										handler: function() {
										//  delItem();
										}
										}*/
									]
								},
								]
								},
								
								//--------------------------------------------------------------------------------------------
//			
//				{ //first
//					xtype : "fieldset",
//					title : "条件",
//					labelWidth : 50,
//					labelAlign : 'right',
//					style : {
//						marginLeft : '4px',
//						marginTop : '10px'
//					},
//					layout : "column",
//					items : 
//					[
//							{
//								layout : "column",
//								columnWidth : 1,
//								style : {
//									marginLeft : '4px',
//									marginTop : '10px'
//								},
//								items : [
//									{
//										xtype : "label",
//										html : '<font style="color:#9A9A9A;">店名或者拼音缩写</font>',
//							        }
//								]
//							},
//							{ //second
////								layout : "column",
//								columnWidth : 1,
//								style : {
//									marginLeft : '2px',
//									marginTop : '10px'
//								},
//								items : [//third
//								  {
//									xtype : "combo",
//									name : "DeptId",
//									hiddenName: "DeptId",
//									store : tar_dept,
//									triggerAction: 'all',
//									width : 200,
//									border : 1,
//									valueField : 'ID',
//									displayField : 'CombineWord',
//									enableKeyEvents : true,
//									selectOnFocus : true,
//									allowBlank : true,
//									forceSelection : true,
//									hideTrigger : true,
//									listeners : {									
//									   "keyup": function (v) {
//											var value = v.getRawValue();
//											if(value!= null && value.length >=1) {
//												tar_dept.load({
//													params: { key: v.getRawValue() }
//												});
//											}
//										},
//										'specialkey' : function (_field, _e) {
//											if (_e.getKey() == _e.ENTER) {
//											pd_top_form.find("name", "remark")[0].focus(false, 100);
//											}
//										}
//									},
//								}
//									]
//								}
//								]
//								}
								//----------------------------------------------------------------------------------------------
	
		]

	}); //form
	
	
	
	
var pd_form = new Ext.form.FormPanel({
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
					items : [
								
								{
									items:[
									{
											xtype : "label",
											html : '<font style="color:red;">1、输入店名或拼音缩写选择后自动获取数据.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										},
										{
											xtype : "label",
											html : '<font style="color:red;"><br>&nbsp;2、选中数据后点击确定按钮,添加到特训营数据中心.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								},
								
							
						]							
				},
								//--------------------------------------------------------------------------------------------
				{ //first
					xtype : "fieldset",
					title : "条件",
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
									marginLeft : '4px',
									marginTop : '10px'
								},
								items : [
									{
										xtype : "label",
										html : '<font style="color:#9A9A9A;">店名或者拼音缩写</font>',
							        }
								]
							},
							{ //second
//								layout : "column",
								columnWidth : 1,
								style : {
									marginLeft : '2px',
									marginTop : '10px'
								},
								items : [//third
								  {
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
										'select':function(){
										  var period = pd_form.getForm().findField("DeptId").getValue();
										  	  select_store.load( {params: { queryID: period }});
										},
															
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
										
											}
										}
									},
								}
									]
								}
								]
								}
								//----------------------------------------------------------------------------------------------
		]
	}); //form
	
	

//列表数据
	 var pd_storeList = ["ID","区域", "门店","工号","姓名","职务","最近期数","操作" ];

        var pd_store = new Ext.data.Store({
			url : '../Apis/GTTTPeriods.aspx?actionName=getdate',
			reader : new Ext.data.JsonReader({
			        root: "results",
                    id: "ID",
                    totalProperty: "totalCount",
			fields: pd_storeList,
				
			}),
			 groupField: 'ID',
			 sortInfo: { field: 'ID', direction: "ASC" }
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
				header : '<center style="font-weight:bold;">区域</center>',
				
				dataIndex : '区域',
				width : 110,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">门店</center>',
				dataIndex : "门店",
					sortable:true,
				width : 110,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">工号</center>',
				dataIndex : "工号",
					sortable:true,
				width : 110,
				align : 'right'

			}
			, {
				header : '<center style="font-weight:bold;">姓名</center>',
				dataIndex : "姓名",
					sortable:true,
				width : 110,
				align : 'left'

			},{
				header : '<center style="font-weight:bold;">职务</center>',
				dataIndex : "职务",
				width : 110,
				align : 'left'

			},
			{
				header : '<center style="font-weight:bold;">最近期数</center>',
				dataIndex : "最近期数",
				sortable:true,
				width : 110,
				align : 'right'

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
      


//删除记录
function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
		  	Ext.Ajax.request({
				url : "../Apis/GTTTPeriods.aspx?actionName=delGTTTPeriodsDate&sid=" + Sys.sid, 
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
				  pd_store.load({params: { periods: periodsNum }});
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
//----------------------------------------------------------------------------------------------------------------------------------------------

//列表数据
	 var select_List = ["ID","区域ID","门店ID","人员ID","工号", "姓名","职务","职务ID","最近期数" ];

        var select_store = new Ext.data.Store({
			url : '../Apis/GTTTPeriods.aspx?actionName=getSelectDate&periods=' + periodsNum,
			reader : new Ext.data.JsonReader({
			        root: "results",
                    id: "ID",
                    totalProperty: "totalCount",
			fields: select_List,
			}),
			 groupField: 'ID',
			 sortInfo: { field: 'ID', direction: "ASC" }
		});
	
     
       
       	var selectsm = new Ext.grid.CheckboxSelectionModel();
//定义列
var selectcm  = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
                      new Ext.grid.RowNumberer(),                     //自动编号。
                     selectsm,//复选框。
                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
                          { header: '区域ID', align: "left", dataIndex: '区域ID',hidden: true },
                              { header: '门店ID', align: "left", dataIndex: '门店ID',hidden: true },
                              { header: '人员ID', align: "left", dataIndex: '人员ID',hidden: true },
                              
                     { header: '<b>工号</b>', align: "right", dataIndex: '工号',sortable:true},
                     { header: '<b>姓名</b>', align: "left",  dataIndex: '姓名',sortable:true},
                     { header: '<b>职务</b>', align: "left", dataIndex: '职务', sortable:true},
                         { header: '<b>职务ID</b>', align: "left", dataIndex: '职务ID', hidden: true},
                     { header: '<b>最近期数</b>', align: "right", dataIndex: '最近期数', sortable:true}
            ]);

   
 //验证是否为数字
 function validate(value){  

   　if (isNaN(value)) { 
　　　　return false;
　　} 
　　return true;
  }  

       var AddEmployeeAction=function()
       {
       var periods =pd_top_form.find("name", "periods")[0].getValue();
  
if(periods!="")
{
  //判断是否是数字
  if( validate(periods))
  {
  var  EmpId = pd_top_form.find("name", "EmpId")[0].getValue();
   if(EmpId!="")
   {
    periodsNum=periods;
    //员工
	var EmpId = pd_top_form.find("name", "EmpId")[0].getValue();
	 Ext.Ajax.request({
		url : '../Apis/GTTTPeriods.aspx?actionName=insertAlone&periods=' + periodsNum+'&EmpId='+EmpId,
		params : {
		
		},
		success : function (response, options) {
//					var respText = Ext.util.JSON.decode(form.responseText);
//					if(respText.success==false){
//						Ext.MessageBox.alert("提醒",respText.msg);
//						return false;
//					}

            if(response.responseText!=""){
            Ext.MessageBox.alert("提醒", response.responseText);
            }
					//操作成功
					 pd_store.load({params: { periods: periodsNum }});  //载入数据。
				},
				failure : function (response, options) {
						Ext.MessageBox.alert("提醒", "添加失败！人员已存在期数中！");
				}
		
		});
		}else{
		 Ext.MessageBox.alert("提醒","添加状态员工必填!");
		}

  }else
  {
  Ext.MessageBox.alert("提醒","期数只能输入数字!");
  }
}else{
Ext.MessageBox.alert("提醒","请填写期数!");
}
  
       }




var SearchAction=function()
{
var periods =pd_top_form.find("name", "periods")[0].getValue();
  
if(periods!="")
{
  //判断是否是数字
  if( validate(periods))
  {
periodsNum=periods;
    var empID =pd_top_form.find("name", "EmpId")[0].getValue();

  pd_store.load({params: { periods: periodsNum ,EmpID:empID}});
  }else
  {
  Ext.MessageBox.alert("提醒","期数只能输入数字!");
  }
}else{
Ext.MessageBox.alert("提醒","请填写期数!");
}
}

var AddAction= function()
{
var periods =pd_top_form.find("name", "periods")[0].getValue();
if(periods!="")
{

  //判断是否是数字
  if( validate(periods))
  {
periodsNum=periods;
        var showpanel = new Ext.grid.GridPanel(
        {
        store : select_store,
		cm : selectcm,
		sm:selectsm,
		stripeRows : true,
		frame: true,
		height:350,
		margins : "2 2 2 2",
		border : false,
//		 closable:true,
		selModel : new Ext.grid.RowSelectionModel({
			singleSelect : false
		}), //设置单行选中模式, 否则将无法删除数据
//		loadMask : true
                 });      
                 
        var show_panel = new Ext.Panel({
//		layout : "anchor",
		items : [{
				frame : true,
				border : false,
				items : [pd_form]
			}, {
			
				border : false,
				height:'500',
				items : [showpanel]
			}
		]
	});
                              
             var alertwin = new Ext.Window({
                   width: 805,
                     height:545,
                title: ' 特训营期数批量添加',
                 modal: true,
                  buttons: [
                {
                 text: '确 定',
                 handler: function () {
                   	var arry = new Array();
                   var rs=showpanel.getSelectionModel().getSelections();//获取所有选择行record数组
                   if(rs.toString()!=""){
                   //++++++++++++++++++++++++++++++
                     Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定添加？</font>", function (btn) {
                 if (btn == 'yes') {
                   var y=0;
                 //---------------
                 Ext.each(rs,function(){
                   var date=this.get("区域ID")+","+this.get("门店ID")+","+this.get("人员ID")+","+this.get("工号")+","+this.get("姓名")+","+this.get("职务ID");
                    arry[y]=date;
                     y+=1;
                })
                //---------------
                updateDateToIndex(arry);
                  alertwin.hide(); 
                  }else{
                  
                  }
                  });
                  //+++++++++++++++++++++++++
                  
                  }else{
                  Ext.MessageBox.alert("提醒","未选中数据!");
                  }
                  }
                  
                 },{
                  text: '关 闭',
                 handler: function () {
                  alertwin.hide(); 
                 }
                 }
                ],
         items:show_panel,
          closable:false,
             });
         alertwin.show();
         }else
             {
            Ext.MessageBox.alert("提醒","期数只能输入数字!");
            }
         
         }else{
Ext.MessageBox.alert("提醒","请填写期数!");
}
        }

       function  updateDateToIndex(arry)
        {
      Ext.getBody().mask("正在保存！请稍候！");
	    var date = Ext.encode(arry);
      Ext.Ajax.request({
		url : '../Apis/GTTTPeriods.aspx?actionName=insertDate&periods=' + periodsNum,
		params : {
			UpdateGTTT : date
		},
		success : function (response, options) {
			  pd_store.load({params: { periods: periodsNum }});  //载入数据。
		
			Ext.getBody().unmask();
		},
		failure : function (response, options) {
			Ext.getBody().unmask();
		}
		});
      
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
