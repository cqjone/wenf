Ext.onReady(function () { 
	
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
						{
							xtype:'combo',
							fieldLabel:'登录类型',
							hiddenName:'LoginType',
							mode:'local',
							triggerAction:'all',
							editable:false,
							store:new Ext.data.ArrayStore({
								fields:['myId','displayText'],
								data:[[0,'全部'],[1,'普通登录'],[2,'刷卡登录']]
							}),
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
							xtype: "textfield",
							fieldLabel: "门店名称",
							name: "DeptName",
							anchor: "100%"
						},
						combo_DeptStatus
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
		url:'../Apis/UpdateLoginType.aspx?actionName=Search&sid='+Sys.sid,
		root:'results',
		totalProperty: 'totalCount',
		fields:[
			{name:"DeptId"},
			{name:'DeptCode'},
			{name:'DeptName'},
			{name:'LoginType'}
		],
		listeners:{
			'beforeload':function(){
				this.baseParams=Form_Top.getForm().getValues();
				this.baseParams.start=0;
				this.baseParams.limit=40;
			}
		}
	});
	
	var Grid_Dept=new Ext.grid.GridPanel({
		cm:new Ext.grid.ColumnModel({
			 defaults: {
				sortable: true        
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'DeptCode',header:'门店编号',width:150},
				{dataIndex:'DeptName',header:'门店名称',width:150},
				{dataIndex:'LoginType',header:'登录类型',width:150,renderer:LoginType},
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
	
	function LoginType(type){
		if(type=='0'){
			return "普通登录";
		}else if(type=='1'){
			return "刷卡登录";
		}
	}
	
	function buttons(aa,bb,cc,rowIndex,ff,store){
		window.aLogin=function(rowIndex,type){
			var Dept=Store_Dept.getAt(rowIndex);
			var DeptId=Dept.get("DeptId");
			var LoginType=Dept.get("LoginType");
			var msg='';
			var msg1='';
			if(type=='0'){
				msg='普通登录？<br/><label style="color:red">(不需要USBKey和IC卡即可直接登录)</label>';
				msg1='普通登录！';
			}else if(type=='1'){
				msg='刷卡登录？<br/><label style="color:red">(必须正确安装USBkey 通过IC卡刷卡登录)</label>';
				msg1='刷卡登录！';
			}
			Ext.Msg.confirm('提示',"更改登录类型为"+msg,function(btn){
				if(btn=='yes'){
					if(type==LoginType){
						Ext.Msg.alert("提示","类型已经为"+msg1);
						return;
					}
					Ext.Ajax.request({
						url:'../Apis/UpdateLoginType.aspx?actionName=Update&sid='+Sys.sid,
						params:{LoginType:type,DeptId:DeptId},
						success:function(response,obt){
							var rs=Ext.decode(response.responseText);
							Ext.Msg.alert('提示',rs.msg);
							Store_Dept.load({
								params:Form_Top.getForm().getValues()
							});
						},
						failure:function(response,obt){
							var rs=Ext.decode(response.responseText);
							Ext.Msg.alert('提示',rs.msg);
						}
					});
				}
			});
		}
		var results="<a href='#' onclick='aLogin("+rowIndex+",0)'>普通登录</a> &nbsp; &nbsp;<a href='#' onclick='aLogin("+rowIndex+",1)'>刷卡登录</a>";
		return results;
	}
	
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