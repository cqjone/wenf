﻿

       var start = 0; //起始记录
       var limit = 20; //每页记录
       var Body_grid;
       var storeDate = null;
       
       var tar_dept = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/BaseInfoUtil.aspx?actionName=getDept&type=1&state=1&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [{
					name : "CombineWord",
					mapping : "CombineWord"
				}, {
					name : "ID",
					mapping : "ID"
				}
			]
		}),
		sortInfo : {
			field : 'CombineWord',
			direction : 'ASC'
		}
	});
       
       
       Ext.onReady(function () {
       	var Roomfields = ["ID","区域","门店编码","门店", "地址", "电话", "面积", "房租", "房东", "租期开始", "租期结束", "法人", "营业执照", "税务登记证", "机构代码证", "消防许可证"];  
       	storeDate = new Ext.data.Store({
       			url : "../Apis/JyMaintain.aspx?actionName=GetList",
       			reader : new Ext.data.JsonReader({
       				fields : Roomfields,
       				root : "results",
       				id : "ID",
       				totalProperty : "totalCount"
       			}),
       			groupField : 'ID',
       			sortInfo : {
       				field : 'ID',
       				direction : "ASC"
       			}
       		});
       	var ExtWidth = document.documentElement.clientWidth;

          var depid="";
           	storeDate.load({ params: { start: start, limit: limit ,depID:depid } });  //载入数据。

       	//            var sm = new Ext.grid.CheckboxSelectionModel();  //创建一个复选框。
       	var colModel = new Ext.grid.ColumnModel([//创建GridPanel中的列集合。
       				new Ext.grid.RowNumberer(), //自动编号。
       				//                       sm,                                                              //复选框。
       				{
       					header : 'ID',
       					align : "center",
       					dataIndex : 'ID',
       					hidden : true
       				}, //这个编号是ds中的创建的id。
       				{
       					header : '<center style="font-weight:bold;">区域</center>',
       					width : 100,
       					sortable:true,
       					align : "left",
       					dataIndex : '区域'
       				},
       				{
       					header : '<center style="font-weight:bold;">门店编码</center>',
       					width : 100,
       					sortable:true,
       					align : "left",
       					dataIndex : '门店编码'
       				},
       				{
       					header : '<center style="font-weight:bold;">门店</center>',
       					width : 150,
       					align : "left",
       					dataIndex : '门店'
       				}, {
       					header : '<center style="font-weight:bold;">地址</center>',
       					width : 200,
       					align : "left",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '地址'
       				}, {
       					header : '<center style="font-weight:bold;">电话</center>',
       					width : 100,
       					align : "left",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '电话'
       				}, {
       					header : '<center style="font-weight:bold;">面积</center>',
       					width : 100,
       					align : "right",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '面积'
       				}, {
       					header : '<center style="font-weight:bold;">房租</center>',
       					width : 100,
       					align : "right",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '房租'
       				}, {
       					header : '<center style="font-weight:bold;">房东</center>',
       					width : 200,
       					align : "left",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '房东'
       				}, {
       					header : '<center style="font-weight:bold;">租期开始</center>',
       					width : 200,
       					align : "left",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '租期开始'
       				}, {
       					header : '<center style="font-weight:bold;">租期结束</center>',
       					width : 200,
       					align : "left",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '租期结束'
       				}, {
       					header : '<center style="font-weight:bold;">法人</center>',
       					width : 100,
       					align : "left",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '法人'
       				}, {
       					header : '<center style="font-weight:bold;">营业执照</center>',
       					width : 150,
       					align : "right",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '营业执照'
       				}, {
       					header : '<center style="font-weight:bold;">税务登记证</center>',
       					width : 150,
       					align : "right",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '税务登记证'
       				}, {
       					header : '<center style="font-weight:bold;">机构代码证</center>',
       					width : 150,
       					align : "right",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '机构代码证'
       				}, {
       					header : '<center style="font-weight:bold;">消防许可证</center>',
       					width : 150,
       					align : "left",
       					editor : new Ext.form.TextField({}),
       					dataIndex : '消防许可证'
       				},

       			]);

       	Body_grid = new Ext.grid.EditorGridPanel({
       			store : storeDate, //创建GridPanel 并设置store数据。
       			cm : colModel,
       			stripeRows : true,
       			border : true,
       			//                collapsible: true,
       			//                sm: sm,                                                   //复选框，有了这个可以全选
       			autoScroll : true,
       			columnLines : true,
		        loadMask : true,
//       			bbar : new Ext.PagingToolbar({
//       				pageSize : limit,
//       				store : storeDate,
//       				displayInfo : true,
//       				displayMsg : '第{0} 到 {1} 条数据 共{2}条',
//       				emptyMsg : "没有数据",
//       				prevText : "上一页",
//       				nextText : "下一页",
//       				refreshText : "刷新",
//       				lastText : "最后页",
//       				firstText : "第一页",
//       				beforePageText : "当前页",
//       				afterPageText : "共{0}页"
//       			}),

       		});
       });

       var pd_top_form = new Ext.form.FormPanel({

       		bodyBorder : false,
       		border : false,
       		autoScroll : true,
       		labelWidth : 5,
       		labelAlign : 'right',
       		heigh : 100,
       		items : [{
       				xtype : "fieldset",
       				title : "温馨提示",
       				//defaultType: 'textfield',
       				defaults : {
       					labelAlign : "right",
       					width : 50
       				},
       				height : 75,
       				//bodyBorder:false,
       				layout : "column",
       				items : [{
       						xtype : "button",
       						boxMinWidth : 40,
       						style : "margin-left:30px",
       						width : 60,
       						text : " 保  存",
       						handler : function () {
       							Save();
       						}
       					}, {
       						xtype : "label",
       						height : 75,
       						width : 330,
       						html : '<font style="font-weight:bold;color:font-size:14px;  ">注：</font><font style="color:red;">双击单元格可以修改数据!</font>',
       						style : {
       							marginTop : '3px',
       							marginLeft : '65px'
       						}

       					}
       				],},
       			{ //first
					xtype : "fieldset",
					title : "条件",
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
										html : '<font style="color:#9A9A9A;">店名或者拼音缩写</font>',
										style : {
											marginTop : '3px',
											marginLeft : '10px',
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

									style : {
										marginLeft : '5px',
									}

								},  {
									width : 100,
									style : {
										marginTop : '-7px'
									},buttons : [ {
											id : "btnsearch",
											text : "查 询",
											listeners : {
												click : function () {
												
													SearchAction();
												}
											}
											
										}]
								} 
							]//third
						}
					]//second
				}
		]//first

	}); //form
	
	
	function SearchAction()
	{
		var depid = pd_top_form.getForm().findField("DeptId").getValue();
		storeDate.load({ params: { start: start, limit: limit ,depID:depid } }); 
	}
	
	
       //保存修改的数据
       function Save() {
       	var records = storeDate.data.items;
       	var array = new Array();
       	var reg = /^1\d{10}$/;
       	for (var i = 0; i < records.length; i++) {
       		array.push(records[i].data);
       	}
       	Ext.getBody().mask("正在保存！请稍候！");
       	var data = Ext.encode(array);
       	Ext.Ajax.request({
       		url : '../Apis/JyMaintain.aspx?actionName=updateData&sid' + Sys.sid,
       		params : {
       			records : data
       		},
       		success : function (response, options) {
				var depid = pd_top_form.getForm().findField("DeptId").getValue();
       			storeDate.load({ params: { start: start, limit: limit ,depID:depid } }); //载入数据。
       			Ext.getBody().unmask();
       		},
       		failure : function (response, options) {
       			Ext.getBody().unmask();
       		}
       	});
       }

       //主容器
       var pd_main_panel = new Ext.Panel({
       		border : false,
       				layout : "border",
       		autoScroll : true,
       		items : [{
       				frame : true,
       				region : 'north',
       		    height:200,
       				border : false,
       				items : [pd_top_form]
       			}, {
       				layout : "fit",
       				region : 'center',
       				border : false,
       				anchor : '-1 -140',
       				items : [Body_grid],
       			},
       		]
       	});

       centerPanel.add(pd_main_panel);
       centerPanel.doLayout();