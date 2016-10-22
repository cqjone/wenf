Ext.onReady(function () {

	var Form_FindJck=new Ext.form.FormPanel({
		items:[
			{
				xtype:'fieldset',
				layout:'column',
				labelWidth:60,
				labelAlign:'right',
				items:[
					{
						layout:'form',
						columnWidth:.4,
						items:[{
							xtype:'textfield',
							name:'Code',
							fieldLabel:'卡号',
							allowBlank:false,
							anchor:'100%'
						}]
					},
					{
						xtype:'button',
						text:'查询',
						style:'margin-left:10px;',
						width:60,
						handler:function(){
							if(Form_FindJck.getForm().isValid()){
								Store_FindJck.load();
							}
						}
					}
				]
			}
		]
	});

	var Store_FindJck=new Ext.data.JsonStore({
		url:'../Apis/JckValidMgr.aspx?actionName=FindJck&sid='+Sys.sid,
		fields:['Id','Code','CustomerName','Tel','Mobile','RemainCount','TotalCount',
			{name:'ExpireDate'}
		],
		listeners:{
			beforeload:function(thStore,options){
				thStore.baseParams=Form_FindJck.getForm().getValues();
			}
		}
	});
	
	var Grid_Jck=new Ext.grid.GridPanel({
		store:Store_FindJck,
		id:'Grid_Jck',
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'Code',header:'卡号'},
				{dataIndex:'CustomerName',header:'客户姓名'},
				{dataIndex:'Tel',header:'联系电话'},
				{dataIndex:'Mobile',header:'手机'},
				{dataIndex:'RemainCount',header:'剩余次数'},
				{dataIndex:'TotalCount',header:'总次数'},
				{dataIndex:'ExpireDate',header:'到期时间'},
				{
					header:'操作',
					renderer:ReturnButton
				}
			]
		}),
		loadMask: true
	});
	
	function ReturnButton(value,metadata,record,rowIndex,columnIndex,store){
		window.UpdateExpireDate=function(rowIndex){
			var re=store.getAt(rowIndex);
			Form_Update.find('name','TargetId')[0].setValue(re.data['Id']);
			Form_Update.find('name','TargetCode')[0].setValue(re.data['Code']);
			Form_Update.find('name','UpdateDate')[0].setValue(re.data['ExpireDate']);
			win_Update.show();
		}
		var returnStr = "<a href='#' onclick='UpdateExpireDate("+rowIndex+")'> 修改有效期时间 </a>";
		return returnStr;
	}
	
	var Form_Update=new Ext.form.FormPanel({
		frame:true,
		labelWidth:60,
		labelAlign:'right',
		items:[
			{
				xtype:'textfield',
				name:'TargetId',
				hidden:true
			},
			{
				xtype:'textfield',
				name:'TargetCode',
				fieldLabel:'卡号',
				readOnly:true,
				anchor:'100%'
			},
			{
				xtype:'datefield',
				name:'UpdateDate',
				fieldLabel:'有效期',
				value:new Date(),
				format:'Y-m-d',
				allowBlank:false,
				anchor:'100%'
			}
		]
	});
	
	var win_Update=new Ext.Window({
		title:'修改计次卡有效期',
		width:300,
		height:150,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:Form_Update,
		buttons:[{
			text:'确定',
			handler:function(){
				if(Form_Update.getForm().isValid()){
					Form_Update.getForm().submit({
						url:'../Apis/JckValidMgr.aspx?actionName=UpdateExpireDate&sid='+Sys.sid,
						success:function(form,action){
							Ext.Msg.alert('提示',action.result.msg,function(){
								Store_FindJck.load();
								win_Update.hide();
							});
						},
						failure:function(form,action){
							Ext.Msg.alert('提示',action.result.msg);
						}
					});
				}
			}
		}],
		listeners:{
			hide:function(){
				Form_Update.getForm().reset();
			}
		}
	});
	
    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_FindJck]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -80',
            items: [Grid_Jck]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});