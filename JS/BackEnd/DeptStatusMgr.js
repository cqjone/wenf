Ext.onReady(function () { 
	//查询条件框
	var Form_Top=new Ext.form.FormPanel({
		border:false,
		items:[{
			xtype: "fieldset",
			title: "查询条件",
			defaults: { labelAlign: "right", labelWidth:65,width: 80 },
			layout:'column',
			items:[
				{
					layout:'form',
					columnWidth:0.4,
					items:[
						{
							xtype: "textfield",
							fieldLabel: "门店编号",
							name: "DeptCode",
							anchor: "100%"
						},
						combo_DeptStatus
					]
				},
				{
					layout:'form',
					columnWidth:0.4,
					items:[
						{
							xtype: "textfield",
							fieldLabel: "门店名称",
							name: "DeptName",
							anchor: "100%"
						}
					]
				},
				{
					layout:'hbox',
					bodyStyle:'margin-left:10px;',
					width: 140,
					items:[
						{
							xtype: "button",
							boxMinWidth: 40,
							width: 60,
							text: " 查  询",
							handler:function(){
								Store_Dept.load();
							}
						}
					]
				}
			]
		}]
	});
	
	var Store_Dept=new Ext.data.JsonStore({
		url:'../Apis/DeptStatusMgr.aspx?actionName=Search&sid=' + Sys.sid,
		root:'results',
		totalProperty: 'totalCount',
		fields:[
			{name:"DeptId"},
			{name:'DeptCode'},
			{name:'DeptName'},
			{name:'DeptStatus',convert:DeptStatus}
		],
		listeners:{
			'beforeload':function(){
				this.baseParams=Form_Top.getForm().getValues();
				this.baseParams.start=0;
				this.baseParams.limit=40;
			}
		}
	});
	//门店列表
	var Grid_Dept=new Ext.grid.GridPanel({
	    loadMask: true,
	    stripeRows: true,
		cm:new Ext.grid.ColumnModel({
			 defaults: {
				sortable: true        
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'DeptCode',header:'门店编号',width:150},
				{dataIndex:'DeptName',header:'门店名称',width:150},
				{dataIndex:'DeptStatus',header:'门店状态',width:150},
				{
					header:'操作',
					width:150,
					renderer:buttons
				}
			]
		}),
		store:Store_Dept,
		bbar: new Ext.PagingToolbar({
        pageSize: 40,
        store: Store_Dept,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
	});
	//格式化门店状态
	/*function DeptStatus(status){
		if(status == 0){
			return '停业';
		}else if(status == 1){
			return '正常营业';
		}else if(status == 2){
			return '装修';
		}
	}*/
	//列表中显示操作按钮
	function buttons(aa,bb,cc,rowIndex,ff,store){
		window.UpdateDeptStatus=function(rowIndex){
			var record = Store_Dept.getAt(rowIndex);
			form_UpdateStatus.find('name','DeptId')[0].setValue(record.get('DeptId'));
			form_UpdateStatus.find('name','DeptName')[0].setValue(record.get('DeptName'));
			form_UpdateStatus.find('hiddenName','DeptStatus')[0].setValue(record.get('DeptStatus'));
			win_UpdateStatus.show();
		}
		var results="<a href='#' onclick='UpdateDeptStatus(" + rowIndex + ")'>修改门店状态</a>";
		return results;
	}
	//更新门店状态条件框
	var form_UpdateStatus = new Ext.form.FormPanel({
		frame:true,
		labelAlign:'right',
		labelWidth:60,
		items:[
			{
				xtype:'textfield',
				hidden:true,
				name:'DeptId'
			},
			{
				xtype:'textfield',
				fieldLabel:'门店名称',
				name:'DeptName',
				readOnly:true,
				anchor:'100%'
			},
			{
				xtype:'combo',
				fieldLabel:'门店状态',
				hiddenName:'DeptStatus',
				triggerAction: 'all',
				editable: false,
				mode: 'local',
				store: new Ext.data.ArrayStore({
					fields: ['myId', 'displayText'],
					data: [[0, '停业'], [1, '正常营业'],[2,'装修']]
				}),
				value:0,
				valueField: 'myId',
				displayField: 'displayText',
				allowBlank:false,
				anchor:'100%'
			}
		]
	});
	//显示更新门店状态窗口
	var win_UpdateStatus = new Ext.Window({
		title:'修改门店状态',
		width:300,
		height:130,
		closeAction:'hide',
		modal:true,
		items:form_UpdateStatus,
		buttons:[{
			text:'保存',
			handler:function(thBtn){
				if(form_UpdateStatus.getForm().isValid()){
					thBtn.setText('请稍候...');
					thBtn.setDisabled(true);
					form_UpdateStatus.getForm().submit({
						url:'../Apis/DeptStatusMgr.aspx?actionName=Update&sid=' + Sys.sid,
						success:function(form,action){
							thBtn.setText('保存');
							thBtn.setDisabled(false);
							Ext.Msg.alert('提示',action.result.msg,function(){
								win_UpdateStatus.hide();
							});
							Store_Dept.reload();
						},
						failure:function(form,action){
							thBtn.setText('保存');
							thBtn.setDisabled(false);
							Ext.Msg.alert('提示',action.result.msg);
						}
					});
				}
			}
		}]
	});
	
	var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_Top]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -110',
            items: [Grid_Dept]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});