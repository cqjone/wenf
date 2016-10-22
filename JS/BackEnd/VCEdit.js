
/**** 卡信息修改验证码生成 ****/

Ext.onReady(function () { 
	
	var store_grid=new Ext.data.JsonStore({
		url:'../Apis/CardMgr.aspx?actionName=GetVCodes&sid='+Sys.sid,
		root: "results",
        totalProperty: 'totalCount',
		fields:['Id','VCode','DeptName',
			{name:'CreateDate',convert:ConvertJSONDateToJSDateObject_DateTime},
			{name:'Used',convert:function(txt){if(txt==0){return '未使用'}else{return '已使用'}}}
		],
		listeners:{
			'beforeload':function(){
				store_grid.baseParams=Ext.getCmp('form_search').getForm().getValues();
				store_grid.baseParams.start=0;
				store_grid.baseParams.limit=25;
			}
		}
	});
	
	var pd_top_form=new Ext.Panel({
		height:100,
		items:[{
			xtype:'fieldset',
			height:100,
			title:'查询',
			items:[{
				xtype:'form',
				id:'form_search',
				layout:'column',
				labelWidth:60,
				labelAlign:'right',
				items:[
					{
						layout:'form',
						columnWidth:0.4,
						items:[
							{
								xtype:'datefield',
								name:'BeginDate',
								fieldLabel:'生成时间',
								value:new Date(),
								format:'Y-m-d',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'combo',
								hiddenName:'DeptId',
								fieldLabel:'门店',
								minChars:1,
								typeAhead:true,
								mode:'remote',
								triggerAction: 'all',
								store:Store_GetDept,
								valueField:'myId',
								displayField:'displayText',
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.4,
						items:[
							{
								xtype:'datefield',
								name:'EndDate',
								fieldLabel:'到',
								value:new Date(),
								format:'Y-m-d',
								allowBlank:false,
								anchor:'100%'
							}
						],
						buttons:[
							{
								text:'查询',
								handler:function(){
									if(Ext.getCmp('form_search').getForm().isValid()){
										store_grid.removeAll();
										store_grid.load();
									}
								}
							},
							{
								text:'生成验证码',
								handler:function(){
									win_Vcode.show();
								}
							}
						]
					}
				]
			}]
		}]
	});
	
	var win_Vcode=new Ext.Window({
		title:'生成验证码',
		width:300,
		height:150,
		closeAction: 'hide',
		modal:true,
		layout:'fit',
		items:[{
			xtype:'form',
			id:'form_Vcode',
			frame:true,
			labelWidth:60,
			labelAlign:'right',
			items:[
				{
					xtype:'combo',
					hiddenName:'DeptId',
					fieldLabel:'门店名称',
					store:Store_GetDept,
					mode: 'remote',
					triggerAction: 'all',
					minChars:1,
					typeAhead:true,
					valueField: 'myId',
					displayField: 'displayText',
					allowBlank:false,
					anchor:'100%'
				},
				{
					xtype:'textfield',
					name:'VerifyCode',
					fieldLabel:'验证码',
					readOnly:true,
					anchor:'100%'
				}
			],
			buttons:[
				{
					text:'生成验证码',
					id:'Btn_GetVCode',
					handler:function(){
						this.setDisabled(true);
						if(Ext.getCmp('form_Vcode').getForm().isValid()){
								var DeptId=Ext.getCmp('form_Vcode').find('hiddenName','DeptId')[0].getValue();
								Ext.Ajax.request({
									url: "../Apis/CardMgr.aspx?actionName=GetVCode&sid=" + Sys.sid,
									method:'post',
									params:{DeptId:DeptId},
									success:function(response,opts){
										var obj = Ext.decode(response.responseText);
										if(obj.success==true){
											Ext.getCmp('form_Vcode').find('name','VerifyCode')[0].setValue(obj.Vcode);
											store_grid.load();
											Ext.getCmp('Btn_GetVCode').setDisabled(false);
										}else{
											Ext.Msg.alert("提示",obj.msg,function(){
												Ext.getCmp('Btn_GetVCode').setDisabled(false);
											});
										}
									},
									failure:function(response,opts){
										var obj = Ext.decode(response.responseText);
										Ext.Msg.alert("提示",obj.msg,function(){
											Ext.getCmp('Btn_GetVCode').setDisabled(false);
										});
									}
								});
						}
					}
				}
			]
		}],
		listeners:{
			hide:function(){
				Ext.getCmp('form_Vcode').getForm().reset();
			}
		}
	});

	var grid_Vcodes=new Ext.grid.GridPanel({
		id:'grid_Vcodes',
		loadMask:'正在加载...',
		store: store_grid,
		stripeRows: true,
		cm:new Ext.grid.ColumnModel({
			defaults: {
				sortable: true        
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'CreateDate',header:'生成时间',width:120},
				{dataIndex:'VCode',header:'验证码'},
				{dataIndex:'DeptName',header:'所属门店'},
				{dataIndex:'Used',header:'状态'}
			]
		}),
		bbar: new Ext.PagingToolbar({
			pageSize: 25,
			store: store_grid,
			displayInfo: true,
			displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg: "没有记录"
		})
	})
	
    var pd_main_panel = new Ext.Panel({
		border: false,
		layout: "anchor",
		items: [{
			frame: true,
			border: false,
			items: [pd_top_form]
		}, {
			layout: "fit",
			border: false,
			anchor: '-1 -110',
			items: [grid_Vcodes]
		}]
	});

	centerPanel.add(pd_main_panel);
	centerPanel.doLayout();
});