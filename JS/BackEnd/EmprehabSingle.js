
/*      员工复职单       */

Ext.onReady(function () {
	
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
							win_newEmprehabSingle.show();
							Form_newEmprehabSingle.getForm().isValid();
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
								name:'rehabBegin',
								fieldLabel:'复职开始日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'combo',
								hiddenName:'FromDeptId',
								fieldLabel:'原部门',
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
								name:'FromDutyName',
								fieldLabel:'原职位',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'EmpCode',
								fieldLabel:'员工编号',
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
								name:'rehabEnd',
								fieldLabel:'复职结束日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'combo',
								hiddenName:'ToDeptId',
								fieldLabel:'现部门',
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
								name:'ToDutyName',
								fieldLabel:'现职位',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'EmpTitle',
								fieldLabel:'员工姓名',
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						columnWidth:1,
						items:[
							{
								xtype:'textfield',
								name:'IdNo',
								fieldLabel:'身份证号码',
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
		height:250,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:[Form_Search],
		buttons:[
			{
				text:'确定',
				handler:function(){
					Form_Values_Search=Form_Search.getForm().getValues();
					Store_EmprehabSingle.load({
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
	
	var Form_newEmprehabSingle=new Ext.form.FormPanel({
		
		reader:new Ext.data.JsonReader({
			fields:[
				{name:'EmpId'},
				{name:'EmpCode'},
				{name:'EmpTitle'},
				{name:'IdNo'},
				{name:'FromDeptId'},
				{name:'ReinstatementDate'},
				{name:'FromDeptName'},
				{name:'FromDutyId'},
				{name:'FromDutyName'},
				{name:'PreFireDate'},
				{name:'ToDutyId',mapping:'ToDutyName'},
				{name:'ToDeptId',mapping:'ToDeptName'},
				{name:'ReinstatementInfo'},
				{name:'ManagerInfo'},
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
										/*Form_newEmprehabSingle.load({
											url:'../Apis/EmprehabSingle.aspx?actionName=GetEmpInfo&type=NewSingle&sid='+Sys.sid,
											waitMsg:'正在搜索，请稍后...',
											params:{Id:Id}
										});*/
									},
									'keypress':function(thi,e){
										GetEmpInfo(e.keyCode,'Code',this.getRawValue());
									}
								}
							},
							{
								xtype:'datefield',
								name:'ReinstatementDate',
								fieldLabel:'复职日期',
								format:'Y-m-d',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'PreFireDate',
								fieldLabel:'上次离职时间',
								format:'Y-m-d',
								disabled:true,
								allowBlank:false,
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
								name:'EmpTitle',
								fieldLabel:'姓名',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var EmpTitle=this.getValue();
											var FromDeptName=Form_newEmprehabSingle.find('name','FromDeptName')[0].getValue();
											if(EmpTitle.length>0 && FromDeptName.length>0){
												GetEmpInfo(e.keyCode,'Title',EmpTitle,FromDeptName);
											}else{
												Ext.Msg.alert('提示','姓名和原部门都要输入，否组无法找到精确的预复职员工！');
											}
										}
									 }
								}
							},
							{
								xtype:'textfield',
								name:'FromDeptName',
								fieldLabel:'原部门',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var FromDeptName=this.getValue();
											var EmpTitle=Form_newEmprehabSingle.find('name','EmpTitle')[0].getValue();
											if(EmpTitle.length>0 && FromDeptName.length>0){
												GetEmpInfo(e.keyCode,'Title',EmpTitle,FromDeptName);
											}else{
												Ext.Msg.alert('提示','姓名和原部门都要输入，否组无法找到精确的预复职员工！');
											}
										}
									 }
								}
							},
							{
								xtype:'combo',
								name:'ToDeptName',
								hiddenName:'ToDeptId',
								typeAhead:true,
								fieldLabel:'现部门',
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
						layout:'form',
						columnWidth:0.333,
						items:[
							{
								xtype:'textfield',
								name:'IdNo',
								fieldLabel:'身份证号码',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										GetEmpInfo(e.keyCode,'IdNo',this.getValue());
									}
								}
							},
							{
								xtype:'textfield',
								name:'FromDutyName',
								fieldLabel:'原职位',
								disabled:true,
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'ToDutyName',
								hiddenName:'ToDutyId',
								fieldLabel:'现职位',
								mode:'remote',
								triggerAction:'all',
								editable:false,
								store:Store_GetDuty,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
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
								name:'ReinstatementInfo',
								fieldLabel:'复职意见',
								anchor:'100%'
							},
							{
								xtype:'textarea',
								name:'ManagerInfo',
								fieldLabel:'领导审批意见',
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
								fieldLabel:'人事部执行意见',
								anchor:'100%'
							},
							{
								xtype:'textarea',
								name:'MemoInfo',
								fieldLabel:'备注',
								anchor:'100%'
							},{
								xtype:'textarea',
								name:'EmpId',
								hidden:true
							},{
								xtype:'textarea',
								name:'FromDeptId',
								hidden:true
							},{
								xtype:'textarea',
								name:'FromDutyId',
								hidden:true
							}
						]
					}
				]
			}
		]
	});
	
	var win_newEmprehabSingle=new Ext.Window({
		title:'员工复职单',
		width:'50%',
		height:345,
		modal:true,
		closeAction:'hide',	
		layout:'fit',
		items:[Form_newEmprehabSingle],
		buttons:[
			{
				text:'新建',
				handler:function(){
					Form_newEmprehabSingle.getForm().reset();
					win_newEmprehabSingle.buttons[1].setDisabled(false);
				}
			},
			{
				text:'保存',
				handler:function(){
					if(Form_newEmprehabSingle.getForm().isValid()){
						var ToDutyName=Form_newEmprehabSingle.find('name','ToDutyName')[0].getRawValue();
						var ToDeptName=Form_newEmprehabSingle.find('name','ToDeptName')[0].getRawValue();
						var ToDeptId=Form_newEmprehabSingle.find('name','ToDeptName')[0].getValue();
						var FromDutyName=Form_newEmprehabSingle.find('name','FromDutyName')[0].getRawValue();
						var PreFireDate=Form_newEmprehabSingle.find('name','PreFireDate')[0].getRawValue();
						if(!isNaN(ToDeptId) && isNaN(ToDeptName) && ToDeptName!=ToDeptId){
							Form_newEmprehabSingle.getForm().submit({
								url:'../Apis/EmprehabSingle.aspx?actionName=NewSingle&sid='+Sys.sid,
								params:{ToDutyName:ToDutyName,ToDeptName:ToDeptName,FromDutyName:FromDutyName,PreFireDate:PreFireDate},
								waitMsg:'正在保存，请稍候...',
								success:function(form,action){
									Ext.Msg.alert('提示',action.result.msg);
									win_newEmprehabSingle.hide();
									try{
										Store_EmprehabSingle.load({
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
				}
			},
			{
				text:'取消',
				handler:function(){
					win_newEmprehabSingle.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				Form_newEmprehabSingle.getForm().reset();
				win_newEmprehabSingle.buttons[1].setDisabled(false);
			}
		}
	});
	
	function GetEmpInfo(e,type,txt,txt1){
		try
		{
			if(e==13 && (txt.length>0 || parseInt(txt)>0)){
				Form_newEmprehabSingle.getForm().reset();
				Form_newEmprehabSingle.load({
					url:'../Apis/EmprehabSingle.aspx?actionName=GetEmpInfo&sid='+Sys.sid,
					waitMsg:'正在搜素，请稍候...',
					params:{type:type,txt:txt,txt1:txt1}
				});
			}
		}catch(e)
		{}
	}
	
	var Store_EmprehabSingle=new Ext.data.JsonStore({
		url:'../Apis/EmprehabSingle.aspx?actionName=Search&sid='+Sys.sid,
		root:'results',
		totalProperty:'totalCount',
		fields:['ID','CreateDate','EmpCode','EmpTitle','ReinstatementDate','IdNo','PreFireDate','FromDeptName','FromDutyName','ToDeptName','ToDutyName','MemoInfo'],
		listeners:{
			'beforeload':function(){
				Store_EmprehabSingle.baseParams=Form_Values_Search;
				Store_EmprehabSingle.baseParams.start=0;
				Store_EmprehabSingle.baseParams.limit=25;
			}
		}
	});
	
	var Grid_EmprehabSingle=new Ext.grid.GridPanel({
	    store: Store_EmprehabSingle,
	    stripeRows: true,
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'CreateDate',header:'单据日期'},
				{dataIndex:'EmpCode',header:'工号'},
				{dataIndex:'EmpTitle',header:'姓名'},
				{dataIndex:'ReinstatementDate',header:'复职日期'},
				{dataIndex:'IdNo',header:'身份证号码'},
				{dataIndex:'PreFireDate',header:'上一次离职日期'},
				{dataIndex:'FromDeptName',header:'原部门'},
				{dataIndex:'FromDutyName',header:'原职位'},
				{dataIndex:'ToDeptName',header:'现部门'},
				{dataIndex:'ToDutyName',header:'现职位'},
				{dataIndex:'MemoInfo',header:'备注'}
			]
		}),
		bbar: new Ext.PagingToolbar({
			pageSize: 25,
			store: Store_EmprehabSingle,
			displayInfo: true,
			displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg: "没有记录"
		}),
		listeners:{
			'rowdblclick':function(g,rowIndex,e){
				var Id=Store_EmprehabSingle.getAt(rowIndex).get('ID');
				Form_newEmprehabSingle.load({
					url:'../Apis/EmprehabSingle.aspx?actionName=GetSingleById&sid='+Sys.sid,
					params:{Id:Id}
				});
				win_newEmprehabSingle.buttons[1].setDisabled(true);
				win_newEmprehabSingle.show();
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
            items: [Grid_EmprehabSingle]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
	
});