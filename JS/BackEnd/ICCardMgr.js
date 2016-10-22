//IC卡停用与激活

var pd_top_form = new Ext.form.FormPanel({
	labelAlign:'right',
	labelWidth:60,
	items:[{
		layout:'column',
		xtype:'fieldset',
		title:'查询条件',
		items:[
			{
				layout:'form',
				columnWidth:.3,
				items:[
					{
						xtype: "textfield",
						fieldLabel:'员工工号',
						name: "EmpCode",
						anchor: "100%"
					},
					{
						xtype: "textfield",
						fieldLabel:'身份证号',
						name: "EmpIdNo",
						anchor: "100%"
					}
				]
			},
			{
				layout:'form',
				columnWidth:.3,
				items:[
					{
						xtype: "textfield",
						fieldLabel:'员工姓名',
						name: "EmpName",
						anchor: "100%"
					},
					{
						xtype: "combo",
						fieldLabel:'状态',
						hiddenName: "EmpStatus",
						mode:'local',
						triggerAction:'all',
						editable:false,
						store:new Ext.data.ArrayStore({
							fields:['Id','Text'],
							data:[[0,'全部'],[-1,'停用'],[1,'已激活']]
						}),
						value:0,
						valueField:'Id',
						displayField:'Text',
						anchor: "100%"
					}
				]
			},
			{
				layout:'form',
				columnWidth:.3,
				items:[
					{
						xtype: "combo",
						fieldLabel:'部门',
						hiddenName: "DeptId",
						triggerAction:'all',
						typeAhead:true,
						minChars:1,
						store:Store_GetDept,
						valueField: 'myId',
						displayField:'displayText',
						anchor: "100%"
					}
				],
				buttons:[{
					text:'查询',
					handler:function(){
						store_Card.load();
					}
				}]
			}
		]
	}]
});

var store_Card=new Ext.data.JsonStore({
	url: '../Apis/ICCardMgr.aspx?actionName=findCard&sid=' + Sys.sid,
    root: "results",
    totalProperty: 'totalCount',
	fields:['DeptName','EmpCode','EmpName','Mobile','SN','CardNo','EmpIDNO',
		{
			name:'Status',
			convert:function(val){
				if(val == 1){
					return '已激活';
				}else if(val == -1){
					return '停用';
				}else{
					return '';
				}
			}
		}
	],
	listeners:{
		'beforeload':function(thStore){
			thStore.baseParams = pd_top_form.getForm().getValues();
			thStore.baseParams.start = 0;
			thStore.baseParams.limit = 25;
		}
	}
});

var cm = new Ext.grid.ColumnModel({
	defaultSortable:true,
	columns:[
		new Ext.grid.RowNumberer(),
		{header:'门店名称',dataIndex:'DeptName',width:60},
		{header:'员工工号',dataIndex:'EmpCode',width:60},
		{header:'员工姓名',dataIndex:'EmpName',width:60},
		{header:'手机号',dataIndex:'Mobile',width:100},
		{header:'IC卡序列号',dataIndex:'SN',width:100},
		{header:'状态',dataIndex:'Status',width:60},
		{header:'卡号',dataIndex:'CardNo',width:100},
		{header:'身份证号',dataIndex:'EmpIDNO',width:120},
		{
			header:'操作',
			renderer:SetBtn
		}
	]
});
function SetBtn(aa,bb,cc,rowIndex,ff,store){
	window.Start_Stop=function(rowIndex,status){
		try{
			var msg = '';
			if(status == 1){
				msg = '确定激活？';
			}else{
				msg = '确定停用？';
			}
			Ext.Msg.confirm('提示',msg,function(btn){
				if(btn == 'yes'){
					var record=store_Card.getAt(rowIndex);
					Ext.Ajax.request({
						url:'../Apis/ICCardMgr.aspx?actionName=updateStatus&sid=' + Sys.sid,
						params:{status:status,cardSn:record.get('SN')},
						success:function(response,opt){
							var obj = Ext.decode(response.responseText);
							Ext.Msg.alert('提示',obj.msg);
							if(obj.success==true){
								store_Card.reload();
							}
						},
						failure:function(response,opt){
							var obj = Ext.decode(response.responseText);
							Ext.Msg.alert('提示',obj.msg);
						},
						callback:function(){
							win_mask.hide();
						}
					});
					win_mask.show();
				}
			});
		}catch(e){in_mask.hide()}
		
	};
	return "<a href='#' onclick='Start_Stop("+rowIndex+",1)'>激活</a>&nbsp; <a href='#' onclick='Start_Stop("+rowIndex+",-1)'>停用</a>";
}

var win_mask=new Ext.Window({
	width:100,
	height:40,
	modal:true,
	closeAction:'hide',
	closable:false,
	resizable:false,
	draggable:false,
	html:"<div style='padding:3px;'>执行中...</div>",
});

var grid_Cards=new Ext.grid.GridPanel({
	cm:cm,
	store:store_Card,
	loadMask:true,
    stripeRows:true,
	bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: store_Card,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});

//主容器
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
        anchor: '-1 -125',
        items: [grid_Cards]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();