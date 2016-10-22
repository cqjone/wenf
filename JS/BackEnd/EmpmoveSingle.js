
/*        员工调动单          */

Ext.onReady(function(){
	
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
							win_newEmpmoveSingle.show();
							Form_newEmpmoveSingle.getForm().isValid();
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
								name:'moveBegin',
								fieldLabel:'调动开始日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'combo',
								hiddenName:'FromDeptId',
								fieldLabel:'调出部门',
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
					},
					{
						layout:'form',
						columnWidth:0.5,
						items:[
							{
								xtype:'datefield',
								name:'moveEnd',
								fieldLabel:'调出结束日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'ToDeptName',
								hiddenName:'ToDeptId',
								fieldLabel:'调入部门',
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
		width:450,
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
					Store_EmpmoveSingle.load({
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
	
	var Form_newEmpmoveSingle=new Ext.form.FormPanel({
		
		reader:new Ext.data.JsonReader({
			fields:[
				{name:'EmpId'},
				{name:'EmpCode'},
				{name:'EmpName'},
				{name:'IdNo'},
				{name:'FromDeptId'},
				{name:'FromDeptName'},
				{name:'ToDeptId',mapping:'ToDeptName'},
				{name:'FlowDate'},
				{name:'FromDutyID',mapping:'FromDutyId'},
				{name:'FromDutyName'},
				{name:'DutyId',mapping:'DutyName'},
				{name:'Age'},
				{name:'Sex'},
				{name:'Nvarchar1'},
				{name:'BaseWage'},
				{name:'BaseWageInfo'},
				{name:'ShqinnInfo'},
				{name:'FromDeptInfo'},
				{name:'ToDeptInfo'},
				{name:'RensInfo'},
				{name:'MemoInfo'},
				{name:'FromBaseWage'},
				{name:'FromBaseWageInfo'}
			]
		}),
		
		frame:true,
		border:false,
		labelWidth:80,
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
						columnWidth:0.3333,
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
								name:'FromDeptName',
								fieldLabel:'调出部门',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var FromDeptName=this.getValue();
											var EmpName=Form_newEmpmoveSingle.find('name','EmpName')[0].getValue();
											if(EmpName.length>0 && FromDeptName.length>0){
												GetEmpInfo(e.keyCode,'Title',EmpName,FromDeptName);
											}else{
												Ext.Msg.alert('提示','申请人姓名和调出部门请都输入，否则无法查询到准确的预调动员工！');
											}
										}
									 }
								}
							},{
								xtype:'textfield',
								name:'FromDeptId',
								hidden:true
							},
							{
								xtype:'combo',
								name:'DutyName',
								hiddenName:'DutyId',
								fieldLabel:'职位',
								mode:'remote',
								triggerAction:'all',
								editable:false,
								store:Store_GetDuty,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'Nvarchar1',
								fieldLabel:'籍贯',
								disabled:true,
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
								name:'EmpName',
								fieldLabel:'申请人',
								allowBlank:false,
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										if(e.keyCode==13){
											var EmpName=this.getValue();
											var FromDeptName=Form_newEmpmoveSingle.find('name','FromDeptName')[0].getValue();
											if(EmpName.length>0 && FromDeptName.length>0){
												GetEmpInfo(e.keyCode,'Title',EmpName,FromDeptName);
											}else{
												Ext.Msg.alert('提示','申请人姓名和调出部门请都输入，否则无法查询到准确的预调动员工！');
											}
										}
									 }
								}
							},
							{
								xtype:'datefield',
								name:'FlowDate',
								fieldLabel:'调动日期',
								value:new Date(),
								format:'Y-m-d',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'Age',
								fieldLabel:'年龄',
								disabled:true,
								anchor:'100%'
							},
							{
								xtype:'numberfield',
								name:'BaseWage',
								allowDecimals : true,
								decimalSeparator : ".",
								decimalPrecision : 6,
								fieldLabel:'补贴变动',
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
								name:'IdNo',
								fieldLabel:'身份证号码',
								anchor:'100%',
								enableKeyEvents:true,
								listeners:{
									'keypress':function(thi,e){
										GetEmpInfo(e.keyCode,'IdNo',this.getValue());
									}
								}
							},
							{
								xtype:'combo',
								name:'ToDeptName',
								hiddenName:'ToDeptId',
								typeAhead:true,
								fieldLabel:'调入部门',
								mode:'remote',
								triggerAction:'all',
								minChars:1,
								store:Store_GetDept,
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'Sex',
								fieldLabel:'性别',
								disabled:true,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'BaseWageInfo',
								fieldLabel:'补贴条件',
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
								name:'ShqinnInfo',
								fieldLabel:'申请调动理由',
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
								fieldLabel:'调出单位意见',
								anchor:'100%'
							},
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
						columnWidth:0.5,
						items:[
							{
								xtype:'textarea',
								name:'ToDeptInfo',
								fieldLabel:'调入单位意见',
								anchor:'100%'
							},
							{
								xtype:'textarea',
								name:'MemoInfo',
								fieldLabel:'备注',
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'FromDutyID',
								hidden:true
							},
							{
								xtype:'textfield',
								name:'FromDutyName',
								hidden:true
							},
							{
								xtype:'textfield',
								name:'FromBaseWage',
								hidden:true
							},
							{
								xtype:'textfield',
								name:'FromBaseWageInfo',
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
	
	var win_newEmpmoveSingle=new Ext.Window({
		title:'员工调动单',
		width:'50%',
		height:440,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:[Form_newEmpmoveSingle],
		buttons:[
			{
				text:'新建',
				handler:function(){
					Form_newEmpmoveSingle.getForm().reset();
					win_newEmpmoveSingle.buttons[1].setDisabled(false);
				}
			},
			{
				text:'保存',
				handler:function(){
					if(Form_newEmpmoveSingle.getForm().isValid())
					{
						var ToDeptName=Form_newEmpmoveSingle.find('name','ToDeptName')[0].getRawValue();
						var ToDeptId=Form_newEmpmoveSingle.find('name','ToDeptName')[0].getValue();
						var ToDutyName=Form_newEmpmoveSingle.find('name','DutyName')[0].getRawValue();
						var Nvarchar1=Form_newEmpmoveSingle.find('name','Nvarchar1')[0].getRawValue();
						var Sex=Form_newEmpmoveSingle.find('name','Sex')[0].getRawValue();
						var Age=Form_newEmpmoveSingle.find('name','Age')[0].getRawValue();
						if(!isNaN(ToDeptId) && isNaN(ToDeptName) && ToDeptName!=ToDeptId){
							Form_newEmpmoveSingle.getForm().submit({
								url:'../Apis/EmpmoveSingle.aspx?actionName=NewSingle&sid='+Sys.sid,
								params:{ToDeptName:ToDeptName,ToDutyName:ToDutyName,Nvarchar1:Nvarchar1,Sex:Sex,Age:Age},
								waitMsg:'正在保存，请稍候...',
								success:function(form,action){
									Ext.Msg.alert('提示',action.result.msg);
									win_newEmpmoveSingle.hide();
									try{
										Store_EmpmoveSingle.load({
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
				text:'退出',
				handler:function(){
					win_newEmpmoveSingle.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				Form_newEmpmoveSingle.getForm().reset();
				win_newEmpmoveSingle.buttons[1].setDisabled(false);
			}
		}
	});
	
	function GetEmpInfo(e,type,txt,txt1){
		try
		{
			//alert("Type:"+type+" , txt:"+txt);
			if(e==13 && (txt.length>0 || parseInt(txt)>0)){
				Form_newEmpmoveSingle.getForm().reset();
				Form_newEmpmoveSingle.load({
					url:'../Apis/EmpmoveSingle.aspx?actionName=GetEmpInfo&sid='+Sys.sid,
					waitMsg:'正在搜素，请稍候...',
					params:{type:type,txt:txt,txt1:txt1}
				});
			}
		}catch(e)
		{}
	}
	
	var Store_EmpmoveSingle=new Ext.data.JsonStore({
		url:'../Apis/EmpmoveSingle.aspx?actionName=Search&sid='+Sys.sid,
		root:'results',
		totalProperty:'totalCount',
		fields:['ID','CreateDate','EmpCode','EmpName','BaxaFlag','FromDeptName','ToDeptName','DutyName','FlowDate','Sex','BaseWage','Age','ShqinnInfo','MemoInfo'],
		listeners:{
			'beforeload':function(){
				Store_EmpmoveSingle.baseParams=Form_Values_Search;
				Store_EmpmoveSingle.baseParams.start=0;
				Store_EmpmoveSingle.baseParams.limit=25;
			}
		}
	});
	
	var Grid_EmpmoveSingle=new Ext.grid.GridPanel({
		store:Store_EmpmoveSingle,
        stripeRows:true,
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true,
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'ID',header:'',hidden:true},
				{dataIndex:'CreateDate',header:'单据日期'},
				{dataIndex:'BaxaFlag',header:'报道状态'},
				{dataIndex:'EmpCode',header:'工号'},
				{dataIndex:'EmpName',header:'申请人'},
				{dataIndex:'FromDeptName',header:'调出部门'},
				{dataIndex:'ToDeptName',header:'调入部门'},
				{dataIndex:'DutyName',header:'职位'},
				{dataIndex:'FlowDate',header:'调动日期'},
				{dataIndex:'Sex',header:'性别'},
				{dataIndex:'BaseWage',header:'补贴变动'},
				{dataIndex:'Age',header:'年龄'},
				{dataIndex:'ShqinnInfo',header:'申请调动理由'},
				{dataIndex:'MemoInfo',header:'备注'}
			]
		}),
		bbar: new Ext.PagingToolbar({
			pageSize: 25,
			store: Store_EmpmoveSingle,
			displayInfo: true,
			displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg: "没有记录"
		}),
		listeners:{
			'rowdblclick':function(g,rowIndex,e){
				var Id=Store_EmpmoveSingle.getAt(rowIndex).get('ID');
				Form_newEmpmoveSingle.load({
					url:'../Apis/EmpmoveSingle.aspx?actionName=GetSingleById&sid='+Sys.sid,
					params:{Id:Id}
				});
				win_newEmpmoveSingle.buttons[1].setDisabled(true);
				win_newEmpmoveSingle.show();
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
            items: [Grid_EmpmoveSingle]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();

});