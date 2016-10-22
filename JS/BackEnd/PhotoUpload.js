
var CoatSizeStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["无", ""],
			["150/76A", "150/76A"],
			["150/78B", "150/78B"],
			["155/80A", "155/80A"],
			["155/82B", "155/82B"],
			["160/84A", "160/84A"],
			["160/86B", "160/86B"],
			["165/88A", "165/88A"],
			["165/88B", "165/88B"],
			["165/90B", "165/90B"],
			["170/92A", "170/92A"],
			["170/92B", "170/92B"],
			["170/94B", "170/94B"],
			["175/96A", "175/96A"],
			["175/96B", "175/96B"],
			["180/100A", "180/100A"],
			["180/100B", "180/100B"],
			["185/104A", "185/104A"],
			["185/104B", "185/104B"],
			["190/108A", "190/108A"],
			["190/108B", "190/108B"]]
	});
var ShirtSizeStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["无", ""],
			["34#", "34#"],
			["35#", "35#"],
			["36#", "36#"],
			["37#", "37#"],
			["38#", "38#"],
			["39#", "39#"],
			["40#", "40#"],
			["41#", "41#"],
			["42#", "42#"],
			["43#", "43#"]]
	});

var RankStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["无", "无"],
			["1", "1"],
			["2", "2"],
			["3", "3"],
			["4", "4"],
			["5", "5"]]

	});



var SexStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["男", "男"],
			["女", "女"]
		]

	});

var RankDuty = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["无", "无"],
			["美发总管", "美发总管"],
			["美发经理", "美发经理"],
			["美发总助", "美发总助"],
			["美发飞虎", "美发飞虎"],
			["高研班", "高研班"],
			["空降兵", "空降兵"],
			["美容总管", "美容总管"],
			["美容经理", "美容经理"],
			["片区美容经理", "片区美容经理"],
			["美容助教", "美容助教"],

			["美容总助", "美容总助"],
			["容飞虎", "副经理"],
			["美发师", "美发师"],
			["美容师", "美容师"],
			["足疗", "足疗"],

			["收银员", "收银员"],
			["美发总监", "美发总监"],
			["美容实习生", "美容实习生"],
			["美容总管", "美容总管"],
			["特种班", "特种班"],

			["区域总管", "区域总管"],
			["大区经理", "大区经理"],
			["小区经理", "小区经理"],
			["老板", "老板"]

		]

	});
var tar_duty = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:true,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getDuty&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'Title',direction:'ASC'}
});

var tar_dutyType = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:true,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getDutyType&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'Title',direction:'ASC'}
});

	
	

var TrousersSizeStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["无", ""],
			["26#", "26#"],
			["27#", "27#"],
			["28#", "28#"],
			["29#", "29#"],
			["30#", "30#"],
			["31#", "31#"],
			["32#", "32#"],
			["33#", "33#"],
			["34#", "34#"],
			["35#", "35#"],
			["36#", "36#"],
			["37#", "37#"],
			["38#", "38#"],
			["39#", "39#"]]
	});

var SkirtSizeStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["无", ""],
			["XS-A", "XS-A"],
			["S-A", "S-A"],
			["M-A", "M-A"],
			["L-A", "L-A"],
			["XL-A", "XL-A"],
			["XXL-A", "XXL-A"],
			["XS-B", "XS-B"],
			["S-B", "S-B"],
			["M-B", "M-B"],
			["L-B", "L-B"],
			["XL-B", "XL-B"],
			["XXL-B", "XXL-B"]]
	});

var ShoesSizeStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			["", ""],
			["22.0(34)", "22.0(34)"],
			["22.5(35)", "22.5(35)"],
			["23.0(36)", "23.0(36)"],
			["23.5(37)", "23.5(37)"],
			["24.0(38)", "24.0(38)"],
			["24.5(39)", "24.5(39)"],
			["25.0(40)", "25.0(40)"],
			["25.5(41)", "25.5(41)"],
			["26.0(42)", "26.0(42)"],
			["26.5(43)", "26.5(43)"],
			["27.0(44)", "27.0(44)"]]
	});

var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		fileUpload : true,
		autoScroll : false,
		labelWidth : 40,
		labelAlign : 'right',
		heigh : 155,
		autoWidth : true,
		items : [{
				xtype : "fieldset",
				title : "衣服尺寸及照片",
				//defaultType: 'textfield',
				defaults : {
					labelAlign : "right",
					width : 5
				},
				//bodyBorder:false,
				layout : "column",
				items : [
				{
						xtype : 'box',
						id : 'logoPicid',
						fieldLabel : '图片预览',
						width : 120,
						height : 168,
							style : {
									marginRight : '15px'

								},
						autoEl : {
							tag : 'img',
							width : 120,
							height : 168,
							id:"photo_area",
							src : '../Imgs/bg02.jpg',
							style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);'
						}

					}, 
					{
						layout : "hbox",
						defaults : {
							margins : '0 10 0 0'
						},

						columnWidth : 1,
						items : [{
								xtype : "label",
								html : '工  号：',
								style : {
									marginTop : '3px'

								}
							}, {
								xtype : "textfield",
								width : 128,
								name : "EmployeeCode",

								

								enableKeyEvents : true,
								listeners : {
									"keyup" : function (v) {
										if (Ext.util.Format.trim(v.getRawValue()).length == 8) {
											Ext.Ajax.request({
												url : '../Apis/EmpInfoMgr.aspx?actionName=getEmpName&sid=' + Sys.sid,
												params : {
													Code : Ext.util.Format.trim(v.getRawValue())
												},
												success : function (response, option) {
													var rs = Ext.decode(response.responseText);
													if (rs.success) {
														if (rs.msg.length >= 0) {
															
															pd_top_form.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
															pd_top_form.getForm().findField('Height').setValue(rs.msg[0]["Height"]);
															pd_top_form.getForm().findField('Weight').setValue(rs.msg[0]["Weight"]);
															pd_top_form.getForm().findField('CoatSize').setValue(rs.msg[0]["CoatSize"]);
															pd_top_form.getForm().findField('TrousersSize').setValue(rs.msg[0]["TrousersSize"]);
															pd_top_form.getForm().findField('ShirtSize').setValue(rs.msg[0]["ShirtSize"]);
															pd_top_form.getForm().findField('SkirtSize').setValue(rs.msg[0]["SkirtSize"]);
															pd_top_form.getForm().findField('ShoesSize').setValue(rs.msg[0]["ShoesSize"]);
															
															pd_top_form.getForm().findField('CommCardNo').setValue(rs.msg[0]["CommCardNo"]);
															pd_top_form.getForm().findField('BocCardNo').setValue(rs.msg[0]["BocCardNo"]);
															pd_top_form.getForm().findField('CmbCardNo').setValue(rs.msg[0]["CmbCardNo"]);
															pd_top_form.getForm().findField('Dept').setValue(rs.msg[0]["Dept"]);
															pd_top_form.getForm().findField('Sex').setValue(rs.msg[0]["Sex"]);
															//pd_top_form.getForm().findField('Duty').setValue(rs.msg[0]["Duty"]);
															//pd_top_form.getForm().findField('DutyID').setValue(rs.msg[0]["DutyID"]);
															
															
															var dutyTypeId=rs.msg[0]["DutyTypeID"];
															if(dutyTypeId!=null && dutyTypeId!=0){
																pd_top_form.find("hiddenName", "DutyTypeID")[0].setValue(dutyTypeId);
																tar_duty.load({  
																	url:'../Apis/BaseInfoUtil.aspx?actionName=getDuty&sid=' + Sys.sid, 
																	params: {  
																		DutyTypeID: dutyTypeId
																	}  
																});
															}
															pd_top_form.find("hiddenName", "DutyID")[0].setValue(rs.msg[0]["DutyID"]); 
															
															pd_top_form.getForm().findField('Mobile').setValue(rs.msg[0]["Mobile"]);
															pd_top_form.getForm().findField('IdNo').setValue(rs.msg[0]["IdNo"]);
															pd_top_form.getForm().findField('Rank').setValue(rs.msg[0]["Rank"]);
															pd_top_form.getForm().findField('TrainPriod').setValue(rs.msg[0]["TrainPriod"]);
															pd_top_form.getForm().findField('BaseWage').setValue(rs.msg[0]["BaseWage"]);
															pd_top_form.getForm().findField('Nvarchar1').setValue(rs.msg[0]["Nvarchar1"]);
															pd_top_form.getForm().findField('FamilyPhone').setValue(rs.msg[0]["FamilyPhone"]);
															pd_top_form.getForm().findField('FamilyAdress').setValue(rs.msg[0]["FamilyAdress"]);
															var img_src="http://jf.wenfeng.com.cn/Imgs/EmpImgs/"+v.getRawValue()+".jpg?num="+getTimeStamp();
															document.getElementById("photo_area").setAttribute('src',img_src);
															Ext.getCmp('btnAdd').setDisabled(false);
														} else {
															Ext.getCmp('btnAdd').setDisabled(true);
														}

													} else {
														Ext.MessageBox.alert("提示", rs.msg);
														Ext.getCmp('btnAdd').setDisabled(true);
													}
												},
												failure : function () {
													Ext.MessageBox.alert("提示", "获取员工姓名异常!");
													Ext.getCmp('btnAdd').setDisabled(true);
												}
											});
										} else {
											//pd_top_form.getForm().findField('EmployeeName').setValue("");
											Ext.getCmp('btnAdd').setDisabled(true);
										}
									}
								}
							}, 
							{
								xtype : "label",
								html : '姓  名：',
								style : {
									marginTop : '3px',
									marginLeft : '25px'
								}
							}, {
								xtype : "textfield",
								readOnly : true,
								hideLabel : true,
								width:128,
								style : {
									marginLeft : '25px'
								},
								name : "EmployeeName",
								anchor : "100%"
							}, 
							{
								xtype : "label",
								html : '部门：',
								style : {
									marginTop : '3px',
									marginLeft : '55px'

								}
							}
							, {
								xtype : "textfield",
								readOnly : true,
								hideLabel : true,
								width:128,
								style : {
									marginLeft : '55px'
								},
								name : "Dept",
								anchor : "100%"
							},
							{
								xtype : "label",
								html : '性别：',
								style : {
									marginTop : '3px',
									marginLeft : '65px'

								}
							}
							, {
								xtype : "combo",
								name : "Sex",
								store : SexStore,
								displayField : "Title",
								valueField : "ID",
								editable : false,
								width : 60,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '65px'

								}
							}
							
							
						]
					}, {
						columnWidth : 1,
						layout : 'hbox',
						style : {
							marginTop : '5px'
						},
						items : [
							{
								xtype : "label",
								html : '岗 位：',
								style : {
									marginTop : '3px'
									
								}
							}, {
								xtype : "combo",
								name : "DutyTypeID",
								hiddenName:"DutyTypeID",
								store : tar_dutyType,
								displayField : "Title",
								valueField : "ID",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '10px'

								},
									listeners: {// select监听函数  
										select : function(combo, record, index){  
											var dutyTypeId= combo.value;  
											if(dutyTypeId!=null && dutyTypeId!=0){
												tar_duty.load({  
													url:'../Apis/BaseInfoUtil.aspx?actionName=getDuty&sid=' + Sys.sid, 
													params: {  
														DutyTypeID: dutyTypeId
													}  
												});     
											}
											
										}    
								}  
							},
							{
								xtype : "label",
								html : '职	务：',
								style : {
									marginTop : '3px',
									marginLeft : '45px'
									
								}
							}, {
								xtype : "combo",
								name : "DutyID",
								hiddenName:"DutyID",
								store : tar_duty,
								displayField : "Title",
								valueField : "ID",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '55px'

								}
							},
							{
								xtype : "label",
								html : '手	机：',
								style : {
									marginTop : '3px',
									marginLeft : '90px'
								}
							}, {
								xtype : "textfield",
								name : "Mobile",
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '101px'
								}
							},
							{
								xtype : "label",
								html : '身份证：',
								style : {
									marginTop : '3px',
									marginLeft : '110px'
								}
							},
							{
								xtype : "textfield",
								name : "IdNo",
								width : 140,
								triggerAction : 'all',
								mode : 'local',
								regex:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
								style : {
									marginLeft : '119px'

								}
							}

						]

					},
					{
						columnWidth : 1,
						layout : 'hbox',
						style : {
							marginTop : '5px'
						},
						items : [
							 
							{
								xtype : "label",
								html : '星 级：',
								style : {
									marginTop : '3px'
									
								}
							}, {
								xtype : "combo",
								name : "Rank",
								store : RankStore,
								displayField : "Title",
								valueField : "ID",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '10px'

								}
							},
							{
								xtype : "label",
								html : '期 数：',
								style : {
									marginTop : '3px',
									marginLeft : '44px'
								}
							}, {
								xtype : "textfield",
								name : "TrainPriod",
								width : 128,
								triggerAction : 'all',
								mode : 'local',

								style : {
									marginLeft : '55px'

								}
							},
							{
								xtype : "label",
								html : '补 贴：',
								style : {
									marginTop : '3px',
									marginLeft : '90px'
								}
							}, {
								xtype : "textfield",
								name : "BaseWage",

								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '101px'
								}
							}
							

						]

					},
					{
						columnWidth : 1,
						layout : 'hbox',
						style : {
							marginTop : '5px'
						},
						items : [
							{
								xtype : "label",
								html : '籍 贯：',
								style : {
									marginTop : '3px'
								
								}
							}, {
								xtype : "textfield",
								name : "Nvarchar1",
								width : 128,
								triggerAction : 'all',
								mode : 'local',

								style : {
									marginLeft : '10px'

								}
							},
							{
								xtype : "label",
								html : '家庭电话：',
								style : {
									marginTop : '3px',
									marginLeft : '25px',
								}
							}, {
								xtype : "textfield",
								name : "FamilyPhone",
								store : CoatSizeStore,
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '35px',
								}

							},
							{
								xtype : "label",
								html : '家庭地址：',
								style : {
									marginTop : '3px',
									marginLeft : '52px'
								}
							}, {
								xtype : "textfield",
								name : "FamilyAdress",

								width : 200,
								triggerAction : 'all',
								mode : 'local',

								style : {
									marginLeft : '60px'

								}
							}

						]

					},
					
					{
						columnWidth : 1,
						layout : 'hbox',
						style : {
							marginTop : '5px'
						},
						items : [
							{
								xtype : "label",
								html : '交	行：',
								style : {
									marginTop : '3px'
								
								}
							}, {
								xtype : "textfield",
								name : "CommCardNo",
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								regex : /^\d{10,22}$/,
								regexText : '银行卡号必须为10~22的位数字',
								style : {
									marginLeft : '10px'

								}
							},
							{
								xtype : "label",
								html : '中国银行：',
								style : {
									marginTop : '3px',
									marginLeft : '25px',
								}
							}, {
								xtype : "textfield",
								name : "BocCardNo",
								store : CoatSizeStore,
								width : 128,
								triggerAction : 'all',
								regex : /^\d{10,22}$/,
								regexText : '银行卡号必须为10~22的位数字',
								mode : 'local',
								style : {
									marginLeft : '35px',
								}

							},
							{
								xtype : "label",
								html : '招商银行：',
								style : {
									marginTop : '3px',
									marginLeft : '52px'
								}
							}, {
								xtype : "textfield",
								name : "CmbCardNo",

								width : 128,
								triggerAction : 'all',
								regex : /^\d{10,22}$/,
								regexText : '银行卡号必须为10~22的位数字',
								mode : 'local',

								style : {
									marginLeft : '60px'

								}
							}

						]

					},
					{
						columnWidth : 1,
						layout : 'hbox',
						style : {
							marginTop : '5px'
						},
						items : [
							
							{
								xtype : "label",
								html : '衣 服：',
								style : {
									marginTop : '3px'
									
								}
							}, {
								xtype : "combo",
								name : "CoatSize",
								store : CoatSizeStore,
								displayField : "ID",
								valueField : "Title",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',

								style : {
									marginLeft : '10px'

								}
							},
							{
								xtype : "label",
								html : '西 裤：',
								style : {
									marginTop : '3px',
									marginLeft : '44px'

								}
							}, {
								xtype : "combo",
								name : "TrousersSize",
								store : TrousersSizeStore,
								displayField : "ID",
								valueField : "Title",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '55px'
								}
							},
							
							{
								xtype : "label",
								html : '短袖衫：',
								style : {
									marginTop : '3px',
									marginLeft : '82px'
								}
							}, {
								xtype : "combo",
								name : "ShirtSize",
								store : ShirtSizeStore,
								displayField : "ID",
								valueField : "Title",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '93px'

								}
							}
							

						]

					}, {
						columnWidth : 1,
						layout : 'hbox',
						style : {
							marginTop : '5px'
						},
						items : [
							{
								xtype : "label",
								html : '皮 鞋：',
								style : {
									marginTop : '3px',
									

								}
							}, {
								xtype : "combo",
								name : "ShoesSize",
								store : ShoesSizeStore,
								displayField : "ID",
								valueField : "Title",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',
								style : {
									marginLeft : '10px'
								},

								anchor : "100%"
							},
							{
								xtype : "label",
								html : '红色裙子：',
								style : {
									marginTop : '3px',
									marginLeft : '25px'
								}
							}, {
								xtype : "combo",
								name : "SkirtSize",
								store : SkirtSizeStore,
								displayField : "ID",
								valueField : "Title",
								editable : false,
								width : 128,
								triggerAction : 'all',
								mode : 'local',

								style : {
									marginLeft : '34px'

								}
							}
							,{
								xtype : "label",
								html : '身高(CM)：',
								style : {
									marginTop : '3px',
									marginLeft : '50px'

								}
							}, {
								xtype : "textfield",
								name : "Height",
								width : 60,
								style : {
									marginLeft : '61px',

								}
							},
							
							{
								xtype : "label",
								html : '体重(KG)：',
								style : {
									marginTop : '3px',
									marginLeft : '75px'
									
								}
							}, {
								xtype : "textfield",
								name : "Weight",
								width : 60,
								style : {
									marginLeft : '85px'
								}
							}
							
							

						]

					}, {
						columnWidth : 1,
						layout : 'hbox',
						style : {
							marginTop : '5px'
						},
						items : [
							
							{
								xtype : 'textfield',
								fieldLabel : '文件路径',
								name : 'File',

								inputType : 'file',
								style : {
									marginLeft : '10px'

								}
							},
							{
								xtype : "label",
								html : '<font style="color:red;font-weight:bold;">免冠1寸证件照。像素为：295*413像素。文件格式为JPG</font>',
								style : {
									marginTop : '3px',
									marginLeft : '30px'

								}
							},
							{
								xtype : "button",
								boxMinWidth : 40,
								id : 'btnAdd',
								disabled : true,
								style : "margin-left:20px",
								width : 60,
								text : "提 交",
								handler : function () {
									AddData();
								},
								style : {
									marginLeft : '70px'
								}
							}

						]

					}
				]
				
			}

		]
	});

var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
		defaults : {
			sortable : false,
			menuDisabled : true,
			multiSelect : true
		},
		columns : [new Ext.grid.RowNumberer(), {
				header : 'ID',
				dataIndex : 'ID',
				hidden : true,
				width : 100
			},
			{
				header : '<font style="font-weight:bold;">员工照片</font>',
				dataIndex : 'photo',
				width : 150,
				renderer : function (value) {
					return "<img src='" + value + "' width='150'/>";
				}
			},
			{
				header : "<font style=\"font-weight:bold;\">工号</font>",
				dataIndex : "EmployeeCode",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">姓名</font>",
				dataIndex : "EmployeeName",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">身高（CM）</font>",
				dataIndex : "Height",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">体重（CM）</font>",
				dataIndex : "Weight",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">西服</font>",
				dataIndex : "CoatSize",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">西裤</font>",
				dataIndex : "TrousersSize",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">短袖衫</font>",
				dataIndex : "ShirtSize",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">红色裙子</font>",
				dataIndex : "SkirtSize",
				width : 120
			}, {
				header : "<font style=\"font-weight:bold;\">皮鞋</font>",
				dataIndex : "ShoesSize",
				width : 120
			}

		]
	});

// create the Data Store
var pd_store = new Ext.data.Store({
		autoDestroy : true,
		autoLoad : true,
		url : '../Apis/EmpInfoMgr.aspx?actionName=queryEmployee&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			record : 'MakeupInfo',
			idProperty : 'ID',
			root : 'results',
			totalProperty : 'totalCount',
			fields : [{
					name : "ID",
				}, {
					name : "EmployeeCode"
				}, {
					name : "EmployeeName"
				}, {
					name : "Height"
				}, {
					name : "Weight"
				}, {
					name : "CoatSize"
				}, {
					name : "TrousersSize"
				}, {
					name : "ShirtSize"
				}, {
					name : "SkirtSize"
				}, {
					name : "ShoesSize"
				}, {
					name : "photo"
				}
			]
		})
	});

var pd_grid = new Ext.grid.GridPanel({
		store : pd_store,
		cm : cm,
		columnLines : true,
		sm : sm,
		margins : "2 2 2 2",
		border : false,
		loadMask : true,
		bbar : new Ext.PagingToolbar({
			pageSize : 40,
			store : pd_store,
			displayInfo : true,
			displayMsg : '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg : "没有记录"
		})
	});

pd_store.on('beforeload', function (thiz, options) {
	this.baseParams.start = 0;
	this.baseParams.limit = 40;
});

function AddData() {


	pd_top_form.getForm().submit({
		waitMsg : "正在提交，请稍候...",
		url : "../Apis/EmpInfoMgr.aspx?sid=" + Sys.sid + '&actionName=upload',
		success : function (from, action) {
			pd_store.load();
			Ext.Msg.alert("提示", action.result.msg);
			var img_src="http://jf.wenfeng.com.cn/Imgs/EmpImgs/"+pd_top_form.getForm().findField('EmployeeCode').getValue()+".jpg?num="+getTimeStamp();
			
			document.getElementById("photo_area").setAttribute('src',img_src);
		},
		failure : function (form, action) {
			if(action.result!= null && typeof(action.result)!="undefined"){
				Ext.Msg.alert("提示", action.result.msg);
			}
			else{
				Ext.Msg.alert("提示", "提交失败，请重试");
			}
			
		}
	});

}
//主容器

var pd_main_panel = new Ext.Panel({
		border : false,
		layout : "border",
		items : [{
				frame : true,
				region : 'north',
				height : 250,
				layout : "fit",
				border : false,
				items : [pd_top_form]
			}, {
				layout : "fit",
				region : 'center',
				border : false,
				anchor : '-1 -140',
				items : []
			}
		]
	});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
/**
var photoWindow = new Ext.Window({
		layout : 'fit',
		width : 1100,
		height : 500,
		modal : true,
		closeAction : 'hide',
		title : "填写员工信息",
		plain : true,
		items : [pd_top_form]
	});

function showPhotoWoindow() {
	photoWindow.show();
	pd_top_form.getForm().isValid();
}**/


function getTimeStamp()
{
    // 声明变量。
    var d, s;
    // 创建 Date 对象。
    d = new Date();
    s = d.getFullYear() ;
    s += ("0"+(d.getMonth()+1)).slice(-2) ;
    s += ("0"+d.getDate()).slice(-2) ;
    s += ("0"+d.getHours()).slice(-2) ;
    s += ("0"+d.getMinutes()).slice(-2) ;
    s += ("0"+d.getSeconds()).slice(-2) ;
    s += ("00"+d.getMilliseconds()).slice(-3);
    return s;
}
