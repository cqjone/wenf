Ext.onReady(function(){
    
	var Store_LeaveType=new Ext.data.ArrayStore({
		fields:['myId','displayText'],
		data:[[1,'正常离职'],[2,'主动辞职'],[3,'开除'],[4,'劝辞'],[5,'自动离职']]
	});
	
	var Form_Top=new Ext.form.FormPanel({
		items:[
			{
				xtype:'fieldset',
				//height:60,
				layout:'column',
				items:[
					{
						xtype:'button',
						width:70,
						text:'查询',
						style:'margin-left:2em;',
						handler:function(){
							win_Search.show();
						}
					},
					{
						xtype:'button',
						width:70,
						text:'新建单据',
						style:'margin-left:1em;',
						handler:function(){
							win_newEmpleaveSingle.show();
							Form_newEmpleaveSingle.getForm().isValid();
						}
					}
				]
			}
		]
	});
	
	var Form_Search=new Ext.form.FormPanel({
		frame:true,
		border:false,
		labelWidth:80,
		labelAlign:'right',
		autoScroll:true,
		items:[
			{
				xtype:'fieldset',
				title:'查询条件',
				layout:'column',
				items:[
					{
						layout:'form',
						columnWidth:0.5,
						items:[
							{
								xtype:'datefield',
								name:'LeaveDateBegin',
								fieldLabel:'离职开始日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'DeptName',
								hiddenName:'DeptId',
								fieldLabel:'部门',
								mode:'remote',
								triggerAction:'all',
								typeAhead:true,
								minChars:1,
								store:Store_GetDept,
								valueField:'myId',
								displayField:'displayText',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'EmpCode',
								fieldLabel:'员工编号',
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'LeaveType',
								fieldLabel:'离职类型',
								mode:'local',
								triggerAction:'all',
								editable:false,
								store:Store_LeaveType,
								valueField:'myId',
								displayField:'displayText',
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.5,
						items:[
							{
								xtype:'datefield',
								name:'LeaveDateEnd',
								fieldLabel:'离职结束日期',
								value:'2999-12-31',
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'DutyName',
								fieldLabel:'职位',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'EmpTitle',
								fieldLabel:'员工姓名',
								anchor:'100%'
							}
						]
					}
				]
			}
		]
	});
	var Form_Values_Search;
	var win_Search=new Ext.Window({
		title:'查询条件录入',
		width:500,
		height:230,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:[Form_Search],
		buttons:[
			{
				text:'确定',
				handler:function(){
					Form_Values_Search=Form_Search.getForm().getValues();
					Store_EmpleaveSingle.load({
						params:Form_Values_Search
					});
					win_Search.hide();
				}
			},
			{
				text:'取消',
				handler:function(){
					win_Search.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				Form_Search.getForm().reset();
			}
		}
	});
	
	var Form_newEmpleaveSingle=new Ext.form.FormPanel({
		
		reader:new Ext.data.JsonReader({
			fields:[
				{name:'EmpId'},
				{name:'EmpCode'},
				{name:'EmpTitle'},
				{name:'DeptId'},
				{name:'DeptName'},
				{name:'LeaveType'},
				{name:'LeaveDate'},
				{name:'DutyId'},
				{name:'DutyName'},
				{name:'Sex'},
				{name:'State'},
				{name:'LeaveInfo'},
				{name:'DeptInfo'},
				{name:'ManagerInfo'},
				{name:'MemoInfo'}
			]
		}),
													  
		frame:true,
		border:false,
		labelWidth:60,
		labelAlign:'right',
		autoScroll:true,
		items:[
			{
				xtype:'fieldset',
				title:'单据信息',
				layout:'column',
				items:[
					{
						layout:'form',
						columnWidth:0.25,
						items:[
							{
								xtype:'combo',
								name:'EmpCode',
								typeAhead:true,
								minChars:2,
								fieldLabel:'工号',
								mode:'remote',
								triggerAction:'all',
								store:Store_GetEmpCode,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'select':function(){
										var Id=this.getValue();//iEmployee _ Id
										Form_newEmpleaveSingle.load({
											url:'../Apis/EmpleaveSingle.aspx?actionName=ShowsingleById&type=Newsingle&sid='+Sys.sid,
											waitMsg:'正在搜索，请稍后...',
											params:{Id:Id}
										});
									},
									'keypress':function(thi,e){
										var EmpCode=this.getRawValue();
										if(e.keyCode==13){
											if(EmpCode.length>0){
												Form_newEmpleaveSingle.load({
													url:'../Apis/EmpleaveSingle.aspx?actionName=ShowsingleById&type=Newsingle&sid='+Sys.sid,
													waitMsg:'正在搜索，请稍后...',
													params:{EmpCode:EmpCode},
													failure:function(){
														Form_newEmpleaveSingle.getForm().reset();
													}
												});
											}
										}
									}
									
								}
							},
							{
								xtype:'datefield',
								name:'LeaveDate',
								fieldLabel:'离职日期',
								value:new Date(),
								format:'Y-m-d',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'EmpId',
								hidden:true
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.25,
						items:[
							{
								xtype:'textfield',
								name:'EmpTitle',
								fieldLabel:'姓名',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var EmpTitle=this.getValue();
											var DeptName=Form_newEmpleaveSingle.find('name','DeptName')[0].getValue();
											if(EmpTitle.length>0 && DeptName.length>0){
												Form_newEmpleaveSingle.load({
													url:'../Apis/EmpleaveSingle.aspx?actionName=ShowsingleById&type=Newsingle&sid='+Sys.sid,
													waitMsg:'正在搜索，请稍后...',
													params:{EmpTitle:EmpTitle,DeptName:DeptName},
													failure:function(){
														Form_newEmpleaveSingle.getForm().reset();
													}
												});
											}else{
												Ext.Msg.alert('提示','员工姓名和部门请都输入，否则无法查询到准确的预离职员工！');
											}
										}
									}
								}
							},
							{
								xtype:'textfield',
								name:'DutyName',
								fieldLabel:'职位',
								allowBlank:false,
								disabled:true,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'DutyId',
								hidden:true
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.25,
						items:[
							{
								xtype:'textfield',
								name:'DeptName',
								fieldLabel:'部门',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var DeptName=this.getValue();
											var EmpTitle=Form_newEmpleaveSingle.find('name','EmpTitle')[0].getValue();
											if(EmpTitle.length>0 && DeptName.length>0){
												Form_newEmpleaveSingle.load({
													url:'../Apis/EmpleaveSingle.aspx?actionName=ShowsingleById&type=Newsingle&sid='+Sys.sid,
													waitMsg:'正在搜索，请稍后...',
													params:{EmpTitle:EmpTitle,DeptName:DeptName},
													failure:function(){
														Form_newEmpleaveSingle.getForm().reset();
													}
												});
											}else{
												Ext.Msg.alert('提示','员工姓名和部门请都输入，否则无法查询到准确的预离职员工！');
											}
										}
									}
								}
							},
							{
								xtype:'textfield',
								name:'DeptId',
								hidden:true
							},
							{
								xtype:'textfield',
								name:'Sex',
								fieldLabel:'性别',
								allowBlank:false,
								disabled:true,
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.25,
						items:[
							{
								xtype:'combo',
								name:'LeaveType',
								fieldLabel:'离职类型',
								mode:'local',
								triggerAction:'all',
								editable:false,
								store:Store_LeaveType,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'State',
								fieldLabel:'在岗状态',
								allowBlank:false,
								disabled:true,
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.5,
						items:[
							{
								xtype:'textarea',
								name:'LeaveInfo',
								fieldLabel:'离职申请',
								anchor:'100%'
							},
							{
								xtype:'textarea',
								name:'ManagerInfo',
								fieldLabel:'领导意见',
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.5,
						items:[
							{
								xtype:'textarea',
								name:'DeptInfo',
								fieldLabel:'部门意见',
								anchor:'100%'
							},
							{
								xtype:'textarea',
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
	
	var win_newEmpleaveSingle=new Ext.Window({
		title:'员工离职单',
		width:'50%',
		height:315,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:[Form_newEmpleaveSingle],
		buttons:[
			{
				text:'新建',
				handler:function(){
					Form_newEmpleaveSingle.getForm().reset();
					win_newEmpleaveSingle.buttons[1].setDisabled(false);
				}
			},
			{
				text:'保存',
				handler:function(){
					if(Form_newEmpleaveSingle.getForm().isValid())
					{
						var DutyName=Form_newEmpleaveSingle.find('name','DutyName')[0].getValue();
					var Sex=Form_newEmpleaveSingle.find('name','Sex')[0].getValue();
					var State=Form_newEmpleaveSingle.find('name','State')[0].getValue();
					Form_newEmpleaveSingle.getForm().submit({
						url:'../Apis/EmpleaveSingle.aspx?actionName=NewEmpleaveSingle&sid='+Sys.sid,
						waitMsg:'正在提交，请稍候...',
						params:{DutyName:DutyName,Sex:Sex,State:State},
						success:function(form,action){
							Ext.Msg.alert('提示',action.result.msg);
							win_newEmpleaveSingle.hide();
							try{
								Store_EmpleaveSingle.load({
									params:Form_Search.getForm().getValues()
								});
							}catch(e){
								
							}
						},
						failure:function(form,action){
							if(action.result!=null){
								Ext.Msg.alert('提示',action.result.msg);
							}
						}
					});
					}
				}
			},
			{
				text:'退出',
				handler:function(){
					win_newEmpleaveSingle.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				Form_newEmpleaveSingle.getForm().reset();
				win_newEmpleaveSingle.buttons[1].setDisabled(false);
			}
		}
	});
	
	var Store_EmpleaveSingle=new Ext.data.JsonStore({
		url:'../Apis/EmpleaveSingle.aspx?actionName=Search&sid='+Sys.sid,
		root:'results',
		totalProperty: 'totalCount',
		fields:['ID','EmpID','CreateDate','CheckInFlag','EmpCode','EmpTitle','DeptName','DutyName','LeaveDate','LeaveType','Sex','LeaveInfo','MemoInfo'],
		listeners:{
			'beforeload':function(){
				Store_EmpleaveSingle.baseParams=Form_Values_Search;
				Store_EmpleaveSingle.baseParams.start=0;
				Store_EmpleaveSingle.baseParams.limit=25;
			}
		}
	});
	
	var Grid_EmpleaveSingle=new Ext.grid.GridPanel({
        stripeRows:true,
		store:Store_EmpleaveSingle,
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true,
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'CreateDate',header:'单据日期'},
				//{dataIndex:'CheckInFlag',header:'初检状态'},
				{dataIndex:'EmpCode',header:'工号'},
				{dataIndex:'EmpTitle',header:'姓名'},
				{dataIndex:'DeptName',header:'部门'},
				{dataIndex:'DutyName',header:'职位'},
				{dataIndex:'LeaveDate',header:'离职日期'},
				{dataIndex:'LeaveType',header:'离职类型'},
				{dataIndex:'Sex',header:'性别'},
				{dataIndex:'LeaveInfo',header:'离职申请'},
				{dataIndex:'MemoInfo',header:'备注'}
			]
		}),
		bbar: new Ext.PagingToolbar({
			pageSize: 25,
			store:Store_EmpleaveSingle,
			displayInfo: true,
			displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg: "没有记录"
		}),
		listeners:{
			'rowdblclick':function(g,rowIndex,e){
				var ID=Store_EmpleaveSingle.getAt(rowIndex).get('ID');
				Form_newEmpleaveSingle.load({
					url:'../Apis/EmpleaveSingle.aspx?actionName=ShowsingleById&type=StoreDBClick&sid='+Sys.sid,
					waitMsg:'正在搜索，请稍后...',
					params:{Id:ID}
				});
				win_newEmpleaveSingle.buttons[1].setDisabled(true);
				win_newEmpleaveSingle.show();
			}
		}
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
            anchor: '-1 -69',
            items: [Grid_EmpleaveSingle]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();

});