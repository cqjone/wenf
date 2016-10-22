/*****************   查询门店Id和PosId   *******************/
 
Ext.onReady(function () {

var Form_DPId = new Ext.form.FormPanel({
    labelWidth: 55,
    labelAlign: 'right',
    items: [
        {
            xtype: 'fieldset',
            title: '查询条件',
            height: 70,
            layout: 'column',
            items: [
				{
					layout:'form',
					columnWidth:0.3,
					items:[{
						xtype:"textfield",
						fieldLabel:"门店名称",
						name:"DeptName",
						anchor:"100%"
					}]
				},
				{
					layout:'form',
					columnWidth:0.2,
					items:[combo_DeptStatus]
				},
				{
					layout:'form',
					columnWidth:0.2,
					items:[{
						xtype:"button",
						text:'查询',
						width:70,
						handler:function(){
							Store_DeptId.load();
						}
					}]
				}
			]
        }
    ]
});

var Store_DeptId=new Ext.data.JsonStore({
	url:'../Apis/SearDPId.aspx?actionName=searDPId&sid='+Sys.sid,
	root:'results',
	totalProperty:'totalCount',
	fields:['DeptId','PosId','DeptName','PosName','MemoInfo',
		{
			name:'DeptStatus',
			convert:DeptStatus
		}
	],
	listeners:{
		'beforeload':function(thStore,op){
			thStore.baseParams=Form_DPId.getForm().getValues();
			thStore.baseParams.start=0;
			thStore.baseParams.limit=25;
		}
	}
});

var Grid_DPId=new Ext.grid.EditorGridPanel({
loadMask:true,
clicksToEdit: 1,
stripeRows: true,
cm:new Ext.grid.ColumnModel({
	defaults: {sortable:true},
	columns:[
		new Ext.grid.RowNumberer(),
		{
			dataIndex:'DeptId',
			header:'门店Id',
			width:60,
			editor: new Ext.form.TextField({
               readOnly:true
            })
		},
		{
			dataIndex:'PosId',
			header:'PosId',
			width:60,
			editor: new Ext.form.TextField({
               readOnly:true
            })
		},
		{dataIndex:'DeptStatus',header:'门店状态',width:70},
		{dataIndex:'DeptName',header:'门店名称',width:100},
		{dataIndex:'PosName',header:'Pos名称',width:120},
		{dataIndex:'MemoInfo',header:'备注(Pos备注)',width:160}
	]
}),
store:Store_DeptId,
bbar: new Ext.PagingToolbar({
	pageSize: 25,
	store: Store_DeptId,
	displayInfo: true,
	displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
	emptyMsg: "没有记录"
})
});

var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "anchor",
    items: [{
        frame: true,
        border: false,
        items: [Form_DPId]
    }, 
	{
        layout: "fit",
        border: false,
        anchor: '-1 -100',
        items: [Grid_DPId]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();

});