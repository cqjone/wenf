Ext.onReady(function () {
    
	var Form_Top=new Ext.form.FormPanel({
		items:[
			{
				xtype:'fieldset',
				title:'收银员代班',
				layout:'column',
				labelAlign:'right',
				labelWidth:60,
				items:[
					{
						layout:'form',
						columnWidth:0.35,
						items:[
							{
								xtype:'textfield',
								name:'EmpCode',
								fieldLabel:'员工工号',
								anchor:'100%'
							}   
						]
						
					},
					{
						layout:'form',
						columnWidth:0.35,
						items:[
							{
								xtype:'textfield',
								name:'Title',
								fieldLabel:'员工姓名',
								anchor:'100%'
							}   
						]
					},
					{
						xtype:'button',
						text:'查询',
						style:'margin-left:10px;',
						width:60,
						handler:function(){
							Store_Cs.load({
								params:Form_Top.getForm().getValues()
							});
						}
					},
					{
						xtype:'button',
						text:'新建单据',
						style:'margin-left:10px;',
						width:70,
						handler:function(){
							win_New.show();
						}
					}
				]
			}
		]
	});
	
	var From_New=new Ext.form.FormPanel({
		
		reader:new Ext.data.JsonReader({
			fields:[
				{name:'Id'},
				{name:'EmpCode'},
				{name:'EmpName'},
				{name:'IdNo'},
				{name:'DeptId'},
				{name:'DeptName'},
				{name:'ExpiredDate',convert:ConvertJSONDateToJSDateObjectTextField},
				{name:'MemoInfo'}
			]
		}),
	
	    frame: true,
        border: false,
        labelWidth: 60,
		labelAlign:'right',
        items: [
			{
				xtype: 'fieldset',
			    title: '查询条件',
			    layout: 'column',
			    labelAlign: 'right',
			    items: [
					{
						columnWidth: 0.5,
					    layout: 'form',
					    items: [
							{
								xtype:'textfield',
								name:'Id',
								hidden:true
							},
							{
								xtype:'combo',
								name:'EmpCode',
								typeAhead:true,
								fieldLabel:'员工工号',
								mode:'remote',
								triggerAction:'all',
								minChars:1,
								store:Store_GetEmpCode,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%',
								listeners:{
									'select':function(){
										var EmpId=this.getValue();
										From_New.getForm().reset();
										From_New.load({
											url:'../Apis/CashierDispatch.aspx?actionName=GetEmpInfo&sid='+Sys.sid,
											waitMsg:'正在加载...',
											params:{EmpId:EmpId},
											success:function(form,action){
												
											}
										});
									}
								}
							},
							{
								xtype:'textfield',
								name:'IdNo',
								fieldLabel:'身份证号',
								readOnly:true,
								anchor:'100%'
							},
							{
								xtype:'combo',
								hiddenName:'ToDeptId',
								typeAhead:true,
								fieldLabel:'目标门店',
								mode:'remote',
								triggerAction:'all',
								minChars:1,
								store:Store_GetDept,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%'
							}
						]
					},
					{
						columnWidth: 0.5,
					    layout: 'form',
						items:[
							{
								xtype:'textfield',
								name:'EmpName',
								fieldLabel:'员工姓名',
								readOnly:true,
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'DeptName',
								fieldLabel:'门店',
								readOnly:true,
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'DeptId',
								hidden:true,
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'datefield',
								name:'ExpiredDate',
								fieldLabel:'回店日期',
								value:new Date(),
								format:'Y-m-d',
								allowBlank:false,
								anchor:'100%'
							}
						]
					},
					{
						columnWidth: 1,
					    layout: 'form',
						items:[
							{
								xtype:'textfield',
								name:'MemoInfo',
								fieldLabel:'备注',
								anchor:'100%'
							}
						]
					}
				]
			}
		]
	});
	
	var win_New=new Ext.Window({
		title:'收银员代班',
		width:'40%',
		height:220,
		modal:true,
		closeAction:'hide',
        layout:'fit',
		items:[From_New],
		buttons:[
			{
				text:'保存',
				handler:function(){
					if(From_New.getForm().isValid())
					{
						var DeptName=From_New.find('hiddenName','ToDeptId')[0].getRawValue();
						var DeptId=From_New.find('hiddenName','ToDeptId')[0].getValue();
						if(!isNaN(DeptId) && isNaN(DeptName) && DeptName!=DeptId){
							From_New.getForm().submit({
								url:'../Apis/CashierDispatch.aspx?actionName=New_CashierDispatch&sid='+Sys.sid,
								waitMsg:'正在保存，请稍候...',
								success:function(form,action){
									Ext.Msg.alert('提示',action.result.msg);
									Store_Cs.load();
									win_New.hide();
								},
								failure:function(form,action){
									if(action.result!=null){
										Ext.Msg.alert('提示',action.result.msg);
									}
								}
							});
						}
					}
				}
			},
			{
				text:'关闭',
				handler:function(){
					win_New.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				From_New.getForm().reset();
			}
		}
	});
	
	var Store_Cs=new Ext.data.JsonStore({
		url:'../Apis/CashierDispatch.aspx?actionName=Search&sid='+Sys.sid,
		root:'results',
		totalProperty:'totalCount',
		fields:['Id','Status','BillDate','EmpCode','EmpName','SourceCode','EmpID','SourceTitle','TargetCode','TargetTitle','TargetDeptID','ExpiredDate'],
		listeners:{
			'beforeload':function(){
				this.baseParams.start=0;
				this.baseParams.limit=25;
			}
		}
	});
	
	var Grid_Cs=new Ext.grid.GridPanel({
		store:Store_Cs,
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true,
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'BillDate',header:'日期'},
				{dataIndex:'EmpCode',header:'员工工号'},
				{dataIndex:'EmpName',header:'员工姓名'},
				{dataIndex:'SourceCode',header:'原门店编号'},
				{dataIndex:'SourceTitle',header:'原门店名称'},
				{dataIndex:'TargetCode',header:'代班店编号'},
				{dataIndex:'TargetTitle',header:'代班店名称'},
				{dataIndex:'ExpiredDate',header:'代班有效期'},
				{dataIndex:'Status',header:'状态'},
				{
					header:'操作',
					renderer:function(aa,bb,cc,rowIndex,ff,store){
						window.CallBack=function(rowIndex){
							var thisStore=Store_Cs.getAt(rowIndex);
							var Id=thisStore.get('Id');
							var EmpId=thisStore.get('EmpID');
							var did=thisStore.get('TargetDeptID');
							var status=thisStore.get('Status');
							if(status=='已回店'){
								Ext.Msg.alert('提示','该收银员已经回店！');
								return;
							}else{
								Ext.Msg.confirm('提示','是否确定让该收银员回店？',function(btn){
									if(btn=='yes'){
										Ext.Ajax.request({
											url:'../Apis/CashierDispatch.aspx?actionName=Update&sid='+Sys.sid,
											params:{Id:Id,EmpId:EmpId,did:did},
											waitMsg:'正在执行操作...',
											success:function(response,opts){
												var obj=new Ext.decode(response.responseText);
												Store_Cs.load();
												Ext.Msg.alert("提示",obj.msg);
											},
											failure:function(response,opts)
											{
												var obj=new Ext.decode(response.responseText);
												Ext.Msg.alert("提示",obj.msg);
											}
										});
									}
								});
							}
						}
						var result="<a href='#' onclick='CallBack("+rowIndex+")'>回店</a>";
						return result;
					}
				}
			]
		}),
		bbar: new Ext.PagingToolbar({
			pageSize: 25,
			store:Store_Cs,
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
            items: [Form_Top]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -90',
            items: [Grid_Cs]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});