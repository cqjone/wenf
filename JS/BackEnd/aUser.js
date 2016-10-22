Ext.onReady(function () {
	
	var aUserId=0;
	var GroupId=0;
	var DeptId=0;
	var RealName='';
	var Edit_Save=false;
	
	var Store_Emp= new Ext.data.JsonStore({
									 url:'../Apis/aUser.aspx?actionName=ShowEmployeeByDeptId&sid='+Sys.sid,
									 root:'results',
									 fields: ['myId', 'displayText'],
									 listeners:{
										'load':function(){
											/*this.baseParams.query='';
											var EmployeeId=Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].getValue();
											if(EmployeeId!=null && EmployeeId!=0)
											{
												Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].setValue(EmployeeId);
											}*/
										},
										'beforeload':function(){
											var DeptId=Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].getValue();
											this.baseParams.DeptId=DeptId;
										}
									}
								 });
	
    var Form_aUser = new Ext.form.FormPanel({
        labelWidth: 45,
        labelAlign: 'right',
        items: [
            {
                xtype: 'fieldset',
                title: '查询条件',
                height: 70,
                layout: 'column',
                items: [
                    {
                        layout: 'form',
						columnWidth:0.3,
                        items: [
                            {
                                xtype: 'combo',
                                hiddenName:'GroupId',
                                fieldLabel:'权限组',
								mode:'remote',
								triggerAction:'all',
								editable:false,
								store:new Ext.data.JsonStore({
									url:'../Apis/aUser.aspx?actionName=ShowaGroup&type=Search&sid='+Sys.sid,
									root:'results',
									fields:['myId','displayText']
								}),
								valueField:'myId',
								displayField:'displayText',
								anchor:'100%'
                            }
                        ]
                    },{
						layout:'form',
						columnWidth:0.3,
						items:[
							{
								xtype:'combo',
								name:'DeptTitle',
								hiddenName:'DeptId',
								fieldLabel:'部门',
								mode:'remote',
								triggerAction:'all',
								minChars: 1,
                                typeAhead:true,
								store:new Ext.data.JsonStore({
									url:'../Apis/aUser.aspx?actionName=ShowDept&type=Search&sid='+Sys.sid,
									root:'results',
									fields:['myId','displayText'],
									listeners:{
										'beforeload':function(){
											this.baseParams.DeptTypeId='';
										}
									}
								}),
								valueField:'myId',
								displayField:'displayText',
								anchor:'100%'
							}
						]
					},{
						layout:'form',
						labelWidth: 65,
						columnWidth:0.3,
						items:[
							{
								xtype:'textfield',
								name:'Username',
								fieldLabel:'登录名称',
								anchor:'100%'
							}
						]
					},{
						xtype:'button',
						text:'查询',
						width:70,
						style:'margin-left:1em;',
						handler:function(){
							GroupId=Form_aUser.find('hiddenName','GroupId')[0].getValue();
							DeptId=Form_aUser.find('hiddenName','DeptId')[0].getValue();
							Username=Form_aUser.find('name','Username')[0].getValue();
							Store_aUser.load({
								params:{GroupId:GroupId,DeptId:DeptId,Username:Username}
							});
						}
					},{
						xtype:'button',
						text:'添加',
						width:70,
						style:'margin-left:1em;',
						handler:function(){
							win_aUser_Add_Edit.setTitle('添加');
							win_aUser_Add_Edit.show();
							Edit_Save=true;
						}
					}
                ]
            }
        ]
    });

	var Store_aUser=new Ext.data.JsonStore({
		url:'../Apis/aUser.aspx?actionName=SearchaUser&sid='+Sys.sid,
		root:'results',
		totalProperty:'totalCount',
		fields:['Id','Username','RealName','aGroupTitle','DeptName','MemoInfo'],
		listeners:{
			'beforeload':function(){
				Store_aUser.baseParams=Form_aUser.getForm().getValues();
				Store_aUser.baseParams.start=0;
				Store_aUser.baseParams.limit=25;
			}
		}
	});

var Grid_aUser = new Ext.grid.GridPanel({
    stripeRows: true,
		cm:new Ext.grid.ColumnModel({
			 defaults: {
				sortable: true        
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'Username',header:'登录名称',width:150},
				{dataIndex:'RealName',header:'用户名称',width:150},
				{dataIndex:'aGroupTitle',header:'权限组',width:150},
				{dataIndex:'DeptName',header:'部门名称',width:150},
				{dataIndex:'MemoInfo',header:'备注',width:150},
				{
					header:'操作',
					width:150,
					renderer:showbutton_aUser
				}
			]
		}),
		store:Store_aUser,
		bbar:new Ext.PagingToolbar({
			pageSize: 25,
			store: Store_aUser,
			displayInfo: true,
			displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg: "没有记录"
		})
	});
	
	function showbutton_aUser(aa,bb,cc,rowIndex,ff,store){
		window.Del=function(rowIndex){
			var a=store.getAt(rowIndex);
			aUserId=a.get("Id");
			Ext.Msg.confirm("提示","确定删除？",function(btn){
				if(btn=="yes"){
					Ext.Ajax.request({
						url:'../Apis/aUser.aspx?actionName=DelaUserbyId&sid='+Sys.sid,
						params:{aUserId:aUserId},
						success:function(response,opts){
							var obj=new Ext.decode(response.responseText);
							Store_aUser.load({
								params:{GroupId:GroupId,DeptId:DeptId,Username:Username}
							});
							Ext.Msg.alert("提示",obj.msg);
						},
						failure:function(response,opts){
							var obj=new Ext.decode(response.responseText);
							Ext.Msg.alert("提示",obj.msg);
						}
					});
				}
			});
			
		}
		var resultStr="<a href='#' onclick='Del("+rowIndex+")'>删除</a>";
		return resultStr;
	}
	
	var Form_aUser_Add_Edit=new Ext.form.FormPanel({			
		
		reader:new Ext.data.JsonReader({
			fields:[
				{name:'RealName'},
				{name:'Username',mapping:'Username'},
				{name:'GroupId',mapping:'GroupId'},
				{name:'DeptId',mapping:'DeptId'},
				{name:'DeptTypeId'},
				{name:'Password'},
				{name:'rePassword',mapping:'Password'},
				{name:'MemoInfo'},
				{name:'EmployeeId',convert:function(v){if(v=='0'){}else{return v;}}}
			]
		}),
		
		frame:true,
		border:false,
		layout:'column',
		labelWidth:65,
		labelAlign:'right',
		items:[
			{
				columnWidth:1,
				autoHeight:true,
				layout:'column',
				style:'margin-top:1em;',
				items:[
					{
						layout:'form',
						columnWidth:0.47,
						items:[
							{
								xtype:'textfield',
								name:'Username',
								fieldLabel:'登录名称',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'textfield',
								name:'Password',
								fieldLabel:'密码',
								inputType:'password',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'GroupTitle',
								hiddenName:'GroupId',
								fieldLabel:'权限组',
								modal:'remote',
								triggerAction:'all',
								editable:false,
								store:new Ext.data.JsonStore({
									url:'../Apis/aUser.aspx?actionName=ShowaGroup&type=Add&sid='+Sys.sid,
									root:'results',
									fields:['myId','displayText'],
									listeners:{
										'load':function(){
											var GroupId=Form_aUser_Add_Edit.find('hiddenName','GroupId')[0].getValue();
											if(GroupId!=null && GroupId!=0)
											{
												Form_aUser_Add_Edit.find('hiddenName','GroupId')[0].setValue(GroupId);
											}
										}
									}
								}),
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'DeptTitle',
								hiddenName:'DeptId',
								minChars:1,
								fieldLabel:'部门',
								mode:'remote',
								triggerAction:'all',
								store:new Ext.data.JsonStore({
									url:'../Apis/aUser.aspx?actionName=ShowDept&type=Add&sid='+Sys.sid,
									root:'results',
									fields:['myId','displayText'],
									listeners:{
										'load':function(){
											/*this.baseParams.query='';
											var DeptId=Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].getValue();
											if(DeptId!=null && DeptId!=0)
											{
												Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].setValue(DeptId);
											}else if(DeptId=='0'){
												Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].setValue('');
											}
											this.baseParams.query='';*/
										},
										'beforeload':function(){
											var DeptTypeId=Form_aUser_Add_Edit.find('hiddenName','DeptTypeId')[0].getValue();
											if(DeptTypeId!=null && DeptTypeId>0)
											{
												this.baseParams.DeptTypeId=DeptTypeId;
											}else{
												this.baseParams.DeptTypeId='0';
											}
											//Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].setValue('');
										}
									}
								}),
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%',
								listeners:{
									'focus':function(){
										var DeptTypeId=Form_aUser_Add_Edit.find('hiddenName','DeptTypeId')[0].getValue();
										if(DeptTypeId!=null && DeptTypeId!=0)
										{
											this.store.baseParams.DeptTypeId=DeptTypeId;
										}
										this.store.load();
									},
									'select' :function(){
										Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].store.baseParams.query='';
										Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].setValue('');
						}
								}
							}
						]
					},{
						layout:'form',
						columnWidth:0.47,
						items:[
							{
								xtype:'textfield',
								name:'RealName',
								fieldLabel:'显示名称',
								allowBlank:false,
								anchor:'100%'
							},{
								xtype:'textfield',
								name:'rePassword',
								fieldLabel:'重复密码',
								inputType:'password',
								allowBlank:false,
								anchor:'100%'
							},
							{
								xtype:'combo',
								name:'DeptType',
								hiddenName:'DeptTypeId',
								fieldLabel:'部门类型',
								mode:'local',
								triggerAction:'all',
								editable:false,
								store: new Ext.data.ArrayStore({
									fields:['myId','displayText'],
									data:[[1,'门店'],[3,'部门']]
								}),
								valueField:'myId',
								displayField:'displayText',
								allowBlank:false,
								anchor:'100%',
								listeners:{
									'select':function(){
										Form_aUser_Add_Edit.find('name','DeptTitle')[0].store.baseParams.query='';
										Form_aUser_Add_Edit.find('name','DeptTitle')[0].setValue('');
										Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].store.baseParams.query='';
										Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].setValue('');
									}
								}
							},
							{
								xtype: 'combo',
								 name: 'EmployeeTitle',
								 hiddenName:'EmployeeId',
								 minChars:1,
								 fieldLabel: '分配操作员',
								 mode: 'remote',
								 triggerAction: 'all',
								 store:Store_Emp,
								 valueField: 'myId',
								 displayField: 'displayText',
								 anchor:'100%',
								 listeners:{
									'focus':function(){
										var a=Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].getValue();
										if(a==0 || a.length==0){
											this.store.baseParams.DeptId='0000';
										}else{
											this.store.baseParams.DeptId=a;
										}
										this.store.load();
									}
								}
							}
						]
					},{
						layout:'form',
						columnWidth:0.94,
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
	
	var win_aUser_Add_Edit=new Ext.Window({
		title:'添加',
		width:500,
		height:220,
		modal:true,
		closeAction:'hide',
		layout:'fit',
		items:[Form_aUser_Add_Edit],
		buttons:[
			{
				text:'保存',
				handler:function(){
					var Password=Form_aUser_Add_Edit.find('name','Password')[0].getValue();
					var rePassword=Form_aUser_Add_Edit.find('name','rePassword')[0].getValue();
					
					DeptId=Form_aUser_Add_Edit.find('name','DeptTitle')[0].getValue();
					var DeptTitle=Form_aUser_Add_Edit.find('name','DeptTitle')[0].getRawValue();
					var EmpTitle=Form_aUser_Add_Edit.find('name','EmployeeTitle')[0].getRawValue();
					var EmpId=Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].getValue();
					
					if(Password!=rePassword){
						Ext.Msg.alert('提示','密码重复有误！');
						return false;
					}
					if(Edit_Save==true){
						if(Form_aUser_Add_Edit.getForm().isValid()){
							if(!isNaN(DeptId) && isNaN(DeptTitle) && DeptId!=DeptTitle)
							{
								DeptTitle='';
							}
							if((!isNaN(EmpId) && isNaN(EmpTitle) && EmpId!=EmpTitle)){
								EmpTitle='';
							}
							Form_aUser_Add_Edit.getForm().submit({
								url:'../Apis/aUser.aspx?actionName=AddaUser&sid='+Sys.sid,
								waitMsg:'正在保存，请稍候...',
								params:{aUserId:aUserId,DeptTitle:DeptTitle,EmpTitle:EmpTitle},
								success:function(form,action){
									Ext.Msg.alert("提示",action.result.msg);
									Form_aUser_Add_Edit.getForm().reset();
									Store_aUser.load({
										params:Form_aUser.getForm().getValues()
									});
									win_aUser_Add_Edit.hide();
									Edit_Save=false;
								},
								failure:function(form,action){
									if(action.result!=null){
										Ext.Msg.alert("提示",action.result.msg);
									}
								}
							});
						}
						
					}else if(Edit_Save==false){
						if(Form_aUser_Add_Edit.getForm().isValid()){
							if(!isNaN(DeptId) && isNaN(DeptTitle) && DeptId!=DeptTitle)
							{
								DeptTitle='';
							}
							if((!isNaN(EmpId) && isNaN(EmpTitle) && EmpId!=EmpTitle)){
								EmpTitle='';
							}
							Form_aUser_Add_Edit.getForm().submit({
								url:'../Apis/aUser.aspx?actionName=aUserEdit&sid='+Sys.sid,
								waitMsg:'正在保存，请稍候...',
								params:{aUserId:aUserId,DeptTitle:DeptTitle,EmpTitle:EmpTitle},
								success:function(form,action){
									Ext.Msg.alert("提示",action.result.msg);
									Form_aUser_Add_Edit.getForm().reset();
									DeptId=Form_aUser.find('hiddenName','DeptId')[0].getValue();
									Store_aUser.load({
										params:{GroupId:GroupId,DeptId:DeptId,RealName:RealName}
									});
									win_aUser_Add_Edit.hide();
									Edit_Save=false;
								},
								failure:function(form,action){
									Ext.Msg.alert("提示",action.result.msg);
								}
						   });
						}
					}
					
				}
			}	 
		],
		listeners:{
			'hide':function(){
				var a=Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].store.baseParams.query='';
				var b=Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].store.baseParams.query='';
				Form_aUser_Add_Edit.getForm().reset();
			}
		}
	}); 

	Grid_aUser.on('rowdblclick',function(g,rowIndex,e){
				aUserId=Store_aUser.getAt(rowIndex).get("Id");
				win_aUser_Add_Edit.show();
				Form_aUser_Add_Edit.load({
					url:'../Apis/aUser.aspx?actionName=ShowaUserbyId&sid='+Sys.sid,
					params:{Id:aUserId},
					waitMsg:"加载中....."/*,
					success:function(){
						Form_aUser_Add_Edit.find('hiddenName','GroupId')[0].store.load();
						Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].store.load();
						Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].store.load({
							params:{DeptId:Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].getValue(),
									EmpId:Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].getValue(),
									query:''}
						});
					}*/
				});
				win_aUser_Add_Edit.setTitle('修改');
				Edit_Save=false;
	});	
	
	//Form_aUser_Add_Edit.find('hiddenName','EmployeeId')[0].store.load();
	Form_aUser_Add_Edit.find('hiddenName','GroupId')[0].store.load();
	Form_aUser_Add_Edit.find('hiddenName','DeptId')[0].store.load();
	Store_Emp.load();
	
    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_aUser]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -100',
            items: [Grid_aUser]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});