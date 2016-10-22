//远程绑定卡

var storeEmp=new Ext.data.JsonStore({
	url:'../Apis/RemoteBindCard.aspx?actionName=findEmp&sid='+Sys.sid,
	root: "results",
    totalProperty: 'totalCount',
	fields:['ID','DeptID','EmpCode','EmpName','EmpIdNo','EmpMobile','DeptName'],
	listeners:{
		'beforeload':function(thStore){
			thStore.baseParams = bindForm.getForm().getValues();
			thStore.baseParams.start = 0;
			thStore.baseParams.limit = 25;
		}
	}
});

var gridColumn=new Ext.grid.ColumnModel({
	defaults: {
		sortable: true
	},
	columns:[
		new Ext.grid.RowNumberer(),
		{hidden:true,dataIndex:'ID'},
		{hidden:true,dataIndex:'DeptID'},
		{header:'员工工号',dataIndex:'EmpCode'},
		{header:'员工姓名',dataIndex:'EmpName'},
		{header:'身份证号',dataIndex:'EmpIdNo'},
		{header:'手机号码',dataIndex:'EmpMobile'},
		{header:'门店名称',dataIndex:'DeptName'}
	]
});

var gridEmp=new Ext.grid.GridPanel({
	height:300,
	store:storeEmp,
	cm:gridColumn,
	loadMask:true,
	frame:true,
	selModel: new Ext.grid.RowSelectionModel({ singleSelect: true }), //设置单行选中模式
	bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: storeEmp,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});

var bindForm=new Ext.FormPanel({
	frame: true,
	labelAlign: 'right',
	bodyStyle: 'padding:5px',
    labelWidth: 60,
	items:[
		{
			layout:'column',
			items:[{
				columnWidth:.5,
				layout:'form',
				labelWidth:70,
				items:[{
					xtype:'textfield',
					fieldLabel:'卡号',
					name:'CardNo',
					anchor:'100%',
					allowBlank:false
				}]
			}]
		},
		{
			xtype:'fieldset',
			title:'员工信息',
			height:430,
			items:[{
				layout:'column',
				items:[
					{
						columnWidth:.5,
						layout:'form',
						items:[
							{
								xtype:'textfield',
								fieldLabel:'门店名称',
								name:'DeptName',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								fieldLabel:'员工姓名',
								name:'EmpName',
								anchor:'100%'
							}
						]
					},
					{
						columnWidth:.5,
						layout:'form',
						items:[
							{
								xtype:'textfield',
								fieldLabel:'员工工号',
								name:'EmpCode',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								fieldLabel:'身份证号',
								name:'EmpIdNo',
								anchor:'100%'
							}
						]
					}
				],
				buttons:[{
					text:'查询',
					handler:function(){
						if(bindForm.find('name','DeptName')[0].getValue() == '' && bindForm.find('name','EmpName')[0].getValue() == '' &&
							bindForm.find('name','EmpCode')[0].getValue() == '' && bindForm.find('name','EmpIdNo')[0].getValue() == '' ){
							Ext.Msg.alert('提示','请输入查询条件...');
							return;
						}
						storeEmp.load();
					}
				}]
			},gridEmp]
		}
	]
});

var winBind=new Ext.Window({
	layout:'fit',
	title:'远程绑定卡',
	width:700,
	height:550,
	closeAction:'hide',
	modal:true,
	plain: true,
	items:[bindForm],
	buttons:[{
		text:'绑定',
		handler:function(){
			if(bindForm.getForm().isValid()){
				if(gridEmp.getSelectionModel().getCount()==0){
					Ext.Msg.alert('提示','请选择员工...');
					return;
				}
				var EmpId=gridEmp.getSelectionModel().getSelected().get('ID');
				var DeptId=gridEmp.getSelectionModel().getSelected().get('DeptID');
				var thButton=this;
				thButton.setDisabled(true);
				thButton.setText('绑定中...');
				Ext.Ajax.request({
					url:'../Apis/RemoteBindCard.aspx?actionName=bindCard&sid='+Sys.sid,
					params:{CardNo:bindForm.find('name','CardNo')[0].getValue(),EmpId:EmpId,DeptId:DeptId},
					success:function(response,opts){
						var obj = Ext.decode(response.responseText);
						Ext.Msg.alert('提示',obj.msg);
					},
					failure:function(response,opts){
						var obj = Ext.decode(response.responseText);
						Ext.Msg.alert('提示',obj.msg);
					},
					callback:function(){
						thButton.setDisabled(false);
						thButton.setText('绑定');
					}
				});
			}
		}
	}]
});

function showBindWindow(){
	winBind.show();
}