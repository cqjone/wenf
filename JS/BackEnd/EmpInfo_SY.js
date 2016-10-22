Ext.onReady(function () {

    var Form_Top = new Ext.form.FormPanel({
        items: [
			{
			    xtype: 'fieldset',
			    layout: 'column',
			    items: [
					{
					    xtype: 'button',
					    width: 70,
					    text: '查询',
					    style: 'margin-left:2em;',
					    handler: function () {
					        win_Search.show();
					    }
					}
				]
			}
		]
    });

	var Form_Search = new Ext.form.FormPanel({
        frame: true,
        border: false,
        labelWidth: 80,
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
							    xtype: 'textfield',
							    name: 'EmpCode',
							    fieldLabel: '工号',
							    anchor: '100%'
							},
							{
							    xtype: 'combo',
							    name: 'DeptName',
							    hiddenName: 'DeptId',
							    fieldLabel: '部门',
							    mode: 'remote',
							    triggerAction: 'all',
							    typeAhead:true,
								minChars:1,
							    store: Store_GetDept,
							    valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '100%'
							},
							{
							    xtype: 'combo',
								name: 'DutyName',
								hiddenName: 'DutyId',
								fieldLabel: '职位',
								
								mode: 'remote',
								triggerAction: 'all',
								editable: false,
								store: Store_GetDuty,
								valueField: 'myId',
								displayField: 'displayText',
								anchor: '100%'
							},
							{
								xtype:'textfield',
								name:'IdNo',
								fieldLabel:'身份证号码',
								anchor:'100%'
							},
							{
								xtype: 'combo',
								hiddenName: 'FromDeptId',
								fieldLabel: '来源部门',
								mode: 'remote',
								triggerAction: 'all',
								typeAhead: true,
                                minChars:1,
								store: Store_GetDept,
								valueField: 'myId',
								displayField: 'displayText',
								anchor: '100%'
							},
							{
							    xtype: 'textfield',
							    name: 'Tel_Mobile',
							    fieldLabel: '座机或手机',
							    anchor: '100%'
							}
						]
					},
					{
					    columnWidth: 0.5,
					    layout: 'form',
					    items: [
							{
							    xtype: 'textfield',
							    name: 'EmpTitle',
							    fieldLabel: '姓名',
							    anchor: '100%'
							},
							{
								xtype:'combo',
								name:'State',
								fieldLabel:'状态',
								mode:'local',
								triggerAction: 'all',
							    editable: false,
								store:PostStateStore,
								valueField: 'myId',
							    displayField: 'displayText',
								anchor: '100%'
							},
							{
								xtype:'combo',
								name:'Sex',
								fieldLabel:'性别',
								mode:'local',
								triggerAction: 'all',
							    editable: false,
							    store: Store_Sex,
								valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '100%'
							},
							{
								xtype:'textfield',
								name:'Nvarchar1',
								fieldLabel:'籍贯',
								anchor:'100%'
							},
							{
							    xtype: 'combo',
							    name: 'GroupState',
							    fieldLabel: '组状态',
							    mode: 'local',
							    triggerAction: 'all',
							    editable: false,
							    store: GpStateStore,
							    valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '100%'
							}
						]
					}
				]
			}
		]
    });
	
	var Form_Values_Search;
	
	var win_Search=new Ext.Window({
		title:'员工信息',
		width:'40%',
		height:270,
		modal:true,
		closeActoin:'hide',
		layout: 'fit',
		items:[Form_Search],
		buttons:[
			{
				text:'确定',
				handler:function(){
					Form_Values_Search = Form_Search.getForm().getValues();
			        Store_EmpInfo.load({
			            params: Form_Values_Search
			        });
					win_Search.hide();
				}
			},
			{
				text:'关闭',
				handler:function(){
					win_Search.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				Form_Search.getForm().reset();
				Form_Search.find('name','State')[0].clearValue();
				Form_Search.find('name','Sex')[0].clearValue();
				Form_Search.find('name','GroupState')[0].clearValue();
			}
		}
	});

	var Store_EmpInfo=new Ext.data.JsonStore({
		url: '../Apis/EmpInfo_SY.aspx?actionName=Search&sid=' + Sys.sid,
		root:'results',
		totalProperty: 'totalCount',
		fields:[
			{name:'ID'},
			{name:'Code'},
			{name:'Title'},
			{name:'Sex'},
			{name:'IdNo'},
			{name:'DeptName'},
			{name:'DutyName'},
			{name:'IsGlobalName'},
			{name:'State'},
			{name:'GroupType'},
			{name:'Degree'},
			{name:'Tel'},
			{name:'Mobile'},
			{name:'Nvarchar2'},
			{name:'FromDeptName'},
			{name:'Rank'},
			{name:'Nation'},
			{name:'Nvarchar1'},
			{name:'Politics'},
			{name:'Marriage'},
			{name:'HireDate'},
			{name:'FireDate'},
			{name:'BaseWage'},
			{name:'BaseWageInfo'},
			{name:'TrainRecords'},
			{name:'PepNotes'},
			{name:'MemoInfo'}
		],
		listeners:{
			'beforeload':function(){
				Store_EmpInfo.baseParams=Form_Values_Search;
				Store_EmpInfo.baseParams.start=0;
				Store_EmpInfo.baseParams.limit=25;
			}
		}
	});

	var Grid_EmpInfo=new Ext.grid.GridPanel({
	    store: Store_EmpInfo,
	    stripeRows: true,
		cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
				new Ext.grid.RowNumberer(),
				{ dataIndex: 'Code', header: '工号' },
				{ dataIndex: 'Title', header: '姓名' },
				{dataIndex:'Sex',header:'性别'},
				{dataIndex:'IdNo',header:'身份证号码'},
				{ dataIndex: 'DeptName', header: '部门' },
				{ dataIndex: 'DutyName', header: '职位' },
				{dataIndex:'IsGlobalName',header:'是否允许全部店面做单'},
				{dataIndex:'State',header:'在岗状态'},
				{ dataIndex: 'GroupType', header: '组状态' },
				{ dataIndex: 'Degree', header: '学历' },
				{ dataIndex: 'Tel', header: '座机' },
				{ dataIndex: 'Mobile', header: '手机' },
				{ dataIndex: 'Nvarchar2', header: '聘用方式' },
				{ dataIndex: 'FromDeptTitle', header: '来源部门' },
				{dataIndex:'Rank',header:'星级'},
				{dataIndex:'Nation',header:'民族'},
				{ dataIndex: 'Nvarchar1', header: '籍贯' },
				{ dataIndex: 'Politics', header: '政治面貌' },
				{ dataIndex: 'Marriage', header: '婚姻状况' },
				{ dataIndex: 'HireDate', header: '进文峰时间' },
				{ dataIndex: 'FireDate', header: '离职时间' },
				{ dataIndex: 'BaseWage', header: '补贴' },
				{ dataIndex: 'BaseWageInfo', header: '补贴条件' },
				{ dataIndex: 'TrainRecords', header: '在岗培训记录' },
				{ dataIndex: 'PepNotes', header: '个人简历' },
				{ dataIndex: 'MemoInfo', header: '备注' }
			]
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: Store_EmpInfo,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
            emptyMsg: "没有记录"
        }),
		listeners:{
			'rowdblclick':function(g, rowIndex, e){
				var EmpId=Store_EmpInfo.getAt(rowIndex).get('ID');
				Form_EmpInfo.load({
					url:'../Apis/EmpInfo_SY.aspx?actionName=GetEmpById&sid='+Sys.sid,
					params:{Id:EmpId}
				});
				Store_EmpHistory.load({
					params:{Id:EmpId}
				});
				Store_EmpPayerInsure.load({
					params:{Id:EmpId}
				});
				win_EmpInfo.show();
			}
		}
	});

	var Store_EmpHistory=new Ext.data.JsonStore({
		url:'../Apis/EmpInfo_SY.aspx?actionName=GetbEmpHistory&sid='+Sys.sid,
		fields:['EmpId','FlowDate','FromDeptName','FromDutyName','ToDeptName','DutyName']
	});
	
	var Store_EmpPayerInsure=new Ext.data.JsonStore({
		url:'../Apis/EmpInfo_SY.aspx?actionName=GetEmpPayerInsure&sid='+Sys.sid,
		fields:['PayerDate','InsureName','PayerMoney']
	});
	
	var Form_EmpInfo = new Ext.form.FormPanel({

        reader: new Ext.data.JsonReader({
            fields: [
				{ name: 'Id' },
				{ name: 'EmpCode',mapping:'Code' },
				{ name: 'EmpTitle',mapping:'Title' },
				{ name: 'State' },
				{ name: 'DeptName' },
                { name: 'FromDeptName' },
				{ name: 'DutyName', mapping: 'DutyName' },
				{ name: 'IsGlobal', mapping: 'IsGlobal',convert:function(v){if(v=='0') {return '否'} else if(v=='1'){return '是'} } },
				{ name: 'Sex' },
				{ name: 'IdNo' },
				{ name: 'HireDate' },
				{ name: 'FireDate' },
				{ name: 'Birthday'},
				{ name: 'Degree' },
				{ name: 'Politics',convert:function(v){if(v!=null && v.length<=0){}else{return v;}} },
				{ name: 'Tel' },
				{ name: 'Nvarchar2' },
				{ name: 'Marriage',convert:function(v){if(v!=null && v.length<=0){}else{return v;}} },
				{ name: 'BaseWage' },
				{ name: 'BaseWageInfo' },
				{ name: 'Age' },
				{ name: 'Rank' },
				{ name: 'Nvarchar1' },
				{ name: 'Nation' },
				{ name: 'Nvarchar3' },
				{ name: 'GroupType' },
				{ name: 'Mobile' },
				{ name: 'PepTalent' },
				{ name: 'PepNotes' },
				{ name: 'TrainRecords' },
				{ name: 'SocRelations' },
				{ name: 'MemoInfo' }
			]
        }),

        frame: true,
        border: false,
        labelWidth: 80,
        labelAlign: 'right',
        autoScroll: true,
        items: [
			{
			    xtype: 'fieldset',
			    title: '员工信息',
			    layout: 'column',
			    style: 'margin-top:5px;',
			    items: [
					{
					    layout: 'column',
					    columnWidth: 0.5,
					    items: [
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
										xtype:'textfield',
										name:'Id',
										hidden:true
									},
									{
									    xtype: 'textfield',
									    name: 'EmpCode',
									    fieldLabel: '工号',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'DutyName',
									    fieldLabel: '职位',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'datefield',
									    name: 'HireDate',
									    fieldLabel: '录用时间',
										disabled:true,
									    value: new Date(),
									    format: 'Y-m-d',
									    
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    name: 'Politics',
									    fieldLabel: '政治面貌',
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: new Ext.data.ArrayStore({
									        fields: ['myId', 'displayText'],
									        data: [[0, '少先队员'], [1, '党员'], [2, '团员'], [3, '群众']]
									    }),
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%',
										listeners:{
											'blur':function(){
												if(this.getValue()=='' && this.getValue()!='0'){
													this.clearValue();
												}
											}
										}
									},
									{
									    xtype: 'textfield',
									    name: 'FromDeptName',
									    fieldLabel: '来源部门',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'numberfield',
									    name: 'Age',
									    fieldLabel: '年龄',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Nvarchar3',
									    fieldLabel: '户籍所在地',
										disabled:true,
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'EmpTitle',
									    fieldLabel: '姓名',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'IsGlobal',
									    fieldLabel: '全局做单',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'datefield',
									    name: 'FireDate',
									    fieldLabel: '离职时间',
									    value: '2999-12-31',
									    format: 'Y-m-d',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Mobile',
									    fieldLabel: '手机',
									    anchor: '100%'
									},
									{
									    xtype: 'numberfield',
									    name: 'BaseWage',
									    fieldLabel: '补贴',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Rank',
									    fieldLabel: '星级',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'GroupType',
									    fieldLabel: '组状态',
										disabled:true,
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
										height:100,
									    name: 'PepNotes',
									    fieldLabel: '个人简历',
										disabled:true,
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
										height:100,
									    name: 'SocRelations',
									    fieldLabel: '社会关系',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
										height:100,
									    name: 'MemoInfo',
									    fieldLabel: '备注',
									    anchor: '100%'
									}
								]
							}
						]
					},
					{
					    layout: 'column',
					    columnWidth: 0.5,
					    items: [
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'State',
									    fieldLabel: '在岗状态',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Sex',
									    fieldLabel: '性别',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'datefield',
									    name: 'Birthday',
									    fieldLabel: '出生日期',
									    value: new Date(),
									    format: 'Y-m-d',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Nvarchar2',
									    fieldLabel: '聘用方式',
										disabled:true,
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'DeptName',
									    fieldLabel: '部门',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'IdNo',
									    fieldLabel: '身份证号',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Degree',
									    fieldLabel: '学历',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    name: 'Marriage',
									    fieldLabel: '婚姻状况',
										triggerAction: 'all',
									    mode: 'local',
									    editable: false,
									    store: new Ext.data.ArrayStore({
									        fields: ['myId', 'displayText'],
									        data: [[0, '未婚'], [1, '已婚'], [2, '离婚'], [3, '复婚'], [4, '未知']]
									    }),
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%',
										listeners:{
											'blur':function(){
												if(this.getValue()=='' && this.getValue()!='0'){
													this.clearValue();
												}
											}
										}
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'BaseWageInfo',
									    fieldLabel: '补贴条件',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'Nvarchar1',
									    fieldLabel: '籍贯',
										disabled:true,
									    anchor: '100%'
									},{
									    xtype: 'textfield',
									    name: 'Tel',
									    fieldLabel: '座机',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'Nation',
									    fieldLabel: '民族',
										disabled:true,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'PepTalent',
									    fieldLabel: '特长',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
										height:100,
									    name: 'TrainRecords',
									    fieldLabel: '岗位培训记录',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    fieldLabel: '调动晋级记录',
										items:[
											new Ext.grid.GridPanel({
											    style: 'border:1px #C1C1C1 solid',
											    stripeRows: true,
												autoScroll:true,
												height:100,
												store:Store_EmpHistory,
												cm:new Ext.grid.ColumnModel({
													defaults: {
														sortable: true
													},
													columns:[
														new Ext.grid.RowNumberer(),
														{dataIndex:'FlowDate',header:'调动日期'},
														{dataIndex:'FromDeptName',header:'原部门'},
														{dataIndex:'FromDutyName',header:'原职位'},
														{dataIndex:'ToDeptName',header:'现部门'},
														{dataIndex:'DutyName',header:'现职位'}
													]
												})
											})
										]
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    fieldLabel: '保险缴费记录',
									    items:[
											new Ext.grid.GridPanel({
												style:'border:1px #C1C1C1 solid',
												autoScroll: true,
												stripeRows: true,
												height:100,
												store:Store_EmpPayerInsure,
												cm:new Ext.grid.ColumnModel({
													defaults: {
														sortable: true
													},
													columns:[
														new Ext.grid.RowNumberer(),
														{dataIndex:'PayerDate',header:'缴费日期'},
														{dataIndex:'InsureName',header:'保险缴费点'},
														{dataIndex:'PayerMoney',header:'缴费金额'}
													]
												})
											})
										]
									}
								]
							}
						]
					}
				]
			}
		]

    });

	var win_EmpInfo = new Ext.Window({
        title: '员工信息',
        width: '80%',
        height: 560,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        items: [Form_EmpInfo],
        buttons: [
			{
				text:'保存',
				handler:function(){
					if(Form_EmpInfo.getForm().isValid())
					{
						Form_EmpInfo.getForm().submit({
							url:'../Apis/EmpInfo_SY.aspx?actionName=Update&sid='+Sys.sid,
							waitMsg:'正在提交，请稍候...',
							success:function(form,action){
								Ext.Msg.alert('提示',action.result.msg);
								win_EmpInfo.hide();
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
			    text: '关闭',
			    handler: function () {
			        win_EmpInfo.hide();
			    }
			}
		],
        listeners: {
            'hide': function(){
				Form_EmpInfo.getForm().reset();
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
            items: [Grid_EmpInfo]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});