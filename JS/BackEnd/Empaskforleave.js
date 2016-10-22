
/*       员工请假单         */

Ext.onReady(function () {
	
	var Store_afl=new Ext.data.ArrayStore({
		fields:['myId','displayText'],
		data:[[1,'事假'],[2,'病假'],[3,'婚假'],[4,'产假'],[5,'探亲假'],[6,'丧假'],[7,'连休']]
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
							win_newEmpaskforleave.show();
							Form_newEmpaskforleave.getForm().isValid();
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
								name:'FlowBegin',
								fieldLabel:'请假开始日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'FlowType',
								fieldLabel:'请假类型',
								mode:'local',
								triggerAction:'all',
								editable:false,
								store:Store_afl,
								valueField:'myId',
								displayField:'displayText',
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
								name:'EmpName',
								fieldLabel:'员工姓名',
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
								name:'FlowEnd',
								fieldLabel:'请假结束日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'combo',
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
		height:220,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:[Form_Search],
		buttons:[
			{
				text:'确定',
				handler:function(){
					Form_Values_Search=Form_Search.getForm().getValues();
					Store_Empaskforleave.load({
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
	
	var Form_newEmpaskforleave=new Ext.form.FormPanel({
		
		reader:new Ext.data.JsonReader({
			fields:[
				{name:'EmpId',mapping:'ID'},
				{name:'EmpCode'},
				{name:'EmpName'},
				{name:'FromDeptId',mapping:'DeptId'},
				{name:'FromDeptName'},
				{name:'DutyId'},
				{name:'DutyName'},
				{name:'FlowDate'},
				{name:'FlowType'},
				{name:'Days'},
				{name:'FactDays'},
				{name:'FromDeptInfo'},
				{name:'RensInfo'},
				{name:'MemoInfo'}
			]
		}),
		
		frame:true,
		border:false,
		labelWidth:90,
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
						columnWidth:0.333,
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
										GetEmpInfo(13,'Id',Id);
									},
									'keypress':function(thi,e){
										GetEmpInfo(e.keyCode,'Code',this.getRawValue());
									}
								}
							},
							{
								xtype:'textfield',
								name:'DutyName',
								fieldLabel:'职位',
								disabled:true,
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.333,
						items:[
							{
								xtype:'textfield',
								name:'EmpName',
								fieldLabel:'姓名',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var EmpName=this.getValue();
											var FromDeptName=Form_newEmpaskforleave.find('name','FromDeptName')[0].getValue();
											if(EmpName.length>0 && FromDeptName.length>0){
												GetEmpInfo(e.keyCode,'Title',EmpName,FromDeptName);
											}else{
												Ext.Msg.alert('提示','姓名和部门都要输入，否组无法找到精确的预请假员工！');
											}
										}
									 }
								}
							},
							{
								xtype:'datefield',
								name:'FlowDate',
								fieldLabel:'请假日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.333,
						items:[
							{
								xtype:'textfield',
								name:'FromDeptName',
								fieldLabel:'部门',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var FromDeptName=this.getValue();
											var EmpName=Form_newEmpaskforleave.find('name','EmpName')[0].getValue();
											if(EmpName.length>0 && FromDeptName.length>0){
												GetEmpInfo(e.keyCode,'Title',EmpName,FromDeptName);
											}else{
												Ext.Msg.alert('提示','姓名原部门都要输入，否组无法找到精确的预请假员工！');
											}
										}
									 }
								}
							},
							{
								xtype:'combo',
								name:'FlowType',
								fieldLabel:'请假类型',
								mode:'local',
								triggerAction:'all',
								editable:false,
								store:Store_afl,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.3333,
						items:[
							{
								xtype:'numberfield',
								name:'Days',
								fieldLabel:'请假申请天数',
								allowBlank:false,
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:0.3333,
						items:[
							{
								xtype:'textfield',
								name:'FactDays',
								fieldLabel:'请假实际天数',
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
								name:'FromDeptInfo',
								fieldLabel:'部门意见',
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
								name:'RensInfo',
								fieldLabel:'人事部门意见',
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:1,
						items:[
							{
								xtype:'textarea',
								name:'MemoInfo',
								fieldLabel:'备注',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'FromDeptId',
								hidden:true
							},
							{
								xtype:'textfield',
								name:'DutyId',
								hidden:true
							},
							{
								xtype:'textfield',
								name:'EmpId',
								hidden:true
							}
						]
					}
				]
			}
		]
	});
	
	var win_newEmpaskforleave=new Ext.Window({
		title:'员工请假单',
		width:'50%',
		height:345,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:[Form_newEmpaskforleave],
		buttons:[
			{
				text:'新建',
				handler:function(){
					Form_newEmpaskforleave.getForm().reset();
					win_newEmpaskforleave.buttons[1].setDisabled(false);
				}
			},
			{
				text:'保存',
				handler:function(){
					if(Form_newEmpaskforleave.getForm().isValid()){
						var DutyName=Form_newEmpaskforleave.find('name','DutyName')[0].getRawValue();
					Form_newEmpaskforleave.getForm().submit({
						url:'../Apis/EmpaskforleaveSingle.aspx?actionName=NewSingle&sid='+Sys.sid,
						params:{DutyName:DutyName},
						waitMsg:'正在保存，请稍候...',
						success:function(form,action){
							Ext.Msg.alert('提示',action.result.msg);
							win_newEmpaskforleave.hide();
							try{
								Store_Empaskforleave.load({
									params:Form_Search.getForm().getValues()
								});
							}catch(e){}
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
				text:'取消',
				handler:function(){
					win_newEmpaskforleave.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				Form_newEmpaskforleave.getForm().reset();
				win_newEmpaskforleave.buttons[1].setDisabled(false);
			}
		}
	});
	
	function GetEmpInfo(e,type,txt,txt1){
		try
		{
			//alert("Type:"+type+" , txt:"+txt);
			if(e==13 && (txt.length>0 || parseInt(txt)>0)){
				Form_newEmpaskforleave.getForm().reset();
				Form_newEmpaskforleave.load({
					url:'../Apis/EmpaskforleaveSingle.aspx?actionName=GetEmpInfo&sid='+Sys.sid,
					waitMsg:'正在搜素，请稍候...',
					params:{type:type,txt:txt,txt1:txt1}
				});
			}
		}catch(e)
		{}
	}
	
	var Store_Empaskforleave=new Ext.data.JsonStore({
		url:'../Apis/EmpaskforleaveSingle.aspx?actionName=Search&sid='+Sys.sid,
		root:'results',
		totalProperty:'totalCount',
		fields:['ID','CreateDate','BaxaFlag','EmpCode','EmpName','FromDeptName','DutyName','FlowDate','FlowType','Days','FactDays','MemoInfo'],
		listeners:{
			'beforeload':function(){
				Store_Empaskforleave.baseParams=Form_Values_Search;
				Store_Empaskforleave.baseParams.start=0;
				Store_Empaskforleave.baseParams.limit=25;
			}
		}
	});
	
	var Grid_Empaskforleave=new Ext.grid.GridPanel({
	    store: Store_Empaskforleave,
	    stripeRows: true,
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'CreateDate',header:'单据日期'},
				{dataIndex:'BaxaFlag',header:'销假状态'},
				{dataIndex:'EmpCode',header:'工号'},
				{dataIndex:'EmpName',header:'姓名'},
				{dataIndex:'FromDeptName',header:'部门'},
				{dataIndex:'DutyName',header:'职位'},
				{dataIndex:'FlowDate',header:'请假日期'},
				{dataIndex:'FlowType',header:'请假类型'},
				{dataIndex:'Days',header:'请假申请天数'},
				{dataIndex:'FactDays',header:'请假实际天数'},
				{dataIndex:'MemoInfo',header:'备注'}
			]
		}),
		bbar: new Ext.PagingToolbar({
			pageSize: 25,
			store: Store_Empaskforleave,
			displayInfo: true,
			displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg: "没有记录"
		}),
		listeners:{
			'rowdblclick':function(g,rowIndex,e){
				var Id=Store_Empaskforleave.getAt(rowIndex).get('ID');
				Form_newEmpaskforleave.load({
					url:'../Apis/EmpaskforleaveSingle.aspx?actionName=GetSingleById&sid='+Sys.sid,
					params:{Id:Id}
				});
				win_newEmpaskforleave.buttons[1].setDisabled(true);
				win_newEmpaskforleave.show();
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
            items: [Grid_Empaskforleave]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
	
});