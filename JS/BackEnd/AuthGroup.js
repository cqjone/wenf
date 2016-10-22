Ext.onReady(function () {
    var aGroupId = 0; //aGroup 的 Id
	var Code='';
	var Title='';
    var Form_AuthGroup = new Ext.form.FormPanel({

        height: 70,
        labelWidth: 50,
        labelAlign: 'right',
        items: [
            {
                xtype: 'fieldset',
                title: '查询条件',
                layout: 'column',
                items: [
                    {
                        layout: 'form',
                        columnWidth: 0.35,
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'Code',
                                fieldLabel: '编号',
                                anchor: '98%'
                            }
                         ]
                    }, {
                        layout: 'form',
                        columnWidth: 0.35,
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'Title',
                                fieldLabel: '名称',
                                anchor: '98%'
                            }
                         ]
                    }, {
                        columnWidth: 0.25,
						style:'margin-left:1em;',
						layout:'column',
                        items: [
                            {
                                xtype: 'button',
                                text: '查询',
                                width: 70,
								columnWidth: 0.25,
                                listeners: {
                                    'click': function () {
                                         Code = Form_AuthGroup.find('name', 'Code')[0].getValue();
                                         Title = Form_AuthGroup.find('name', 'Title')[0].getValue();
                                        store_AuthGroup.load({
                                            params: { Code: Code, Title: Title }
                                        });
                                    }
                                }
                            },
							{
                                xtype: 'button',
                                text: '添加',
                                width: 70,
								columnWidth: 0.25,
								style:'margin-left:1em;',
                                listeners: {
                                    'click': function () {
										win_AddAuthGroup.show();
										Edit_Save=true;
                                    }
                                }
                            }
                         ]
                    }
                ]
            }
        ]
    });

    var store_AuthGroup = new Ext.data.JsonStore({
        url: '../Apis/AuthGroup.aspx?actionName=ShowaGroup&sid=' + Sys.sid,
        root: 'results',
        fields: [
			{ name: 'Id', mapping: 'Id' },
			{ name: 'Code', mapping: 'Code' },
			{ name: 'Title', mapping: 'Title' },
			{ name: 'MemoInfo', mapping: 'MemoInfo' }
		]
    });

    var grid_AuthGroup = new Ext.grid.GridPanel({
        store: store_AuthGroup,
        stripeRows: true,
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
                new Ext.grid.RowNumberer(),
                { dataIndex: 'Code', header: '编号' },
                { dataIndex: 'Title', header: '名称' },
                { dataIndex: 'MemoInfo', header: '备注' },
                {
                    header: '操作',
                    renderer: showbutton_AuthGroup
                }
            ]
        })
    });

	grid_AuthGroup.on('rowdblclick',function(g,rowIndex,e){
		var Id=store_AuthGroup.getAt(rowIndex).get('Id');
		Form_AddAuthGroup.load({
			url:'../Apis/AuthGroup.aspx?actionName=ShowAuthGroupById&sid='+Sys.sid,
			params:{Id:Id}
		});
		win_AddAuthGroup.show();
	});

    function showbutton_AuthGroup(value, metadata, record, rowIndex, columnIndex, store) {
        window.DelaGroup = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            aGroupId = rowNum.get('Id');
            Ext.Msg.confirm('提示', '确定删除？', function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: '../Apis/AuthGroup.aspx?actionName=DelaGroup&sid=' + Sys.sid,
                        params: { aGroupId: aGroupId },
                        method: 'post',
                        success: function (response, opts) {
                            var obj = new Ext.decode(response.responseText);
                            Ext.Msg.alert('提示', obj.msg);
							store_AuthGroup.load({
								params:{Code:Code,Title:Title}
							});
                        },
                        failure: function (response, opts) {
                            Ext.Msg.alert('提示', obj.msg);
                        }
                    });
                }
            });
        };
        window.AddAuth = function (rowIndex) {
			var rowNum = store.getAt(rowIndex);
            aGroupId = rowNum.get('Id');
			sotre_AddAuth.load();
            win_AddAuth.show();
        };
        var resultStr = "<a href='#' onclick='DelaGroup(" + rowIndex + ")'>删除</a> &nbsp; <a href='#' onclick='AddAuth(" + rowIndex + ")'>添加权限</a>";
        return resultStr;
    }


	//*******************  添加权限  *********************
	var sm_AddAuth=new Ext.grid.CheckboxSelectionModel({handleMouseDown:Ext.emptyFn});

	var sotre_AddAuth=new Ext.data.JsonStore({
		url:'../Apis/AuthGroup.aspx?actionName=ShowMenu&sid='+Sys.sid,
		root:'results',
		fields:[
			{name:'iPointMenuItemId',mapping:'iPointMenuItemId'},
			{name:'iMenuCateCode',mapping:'iMenuCateCode'},
			{name:'iMenuCateTitle',mapping:'iMenuCateTitle'},
			{name:'iPointMenuItemCode',mapping:'iPointMenuItemCode'},
			{name:'iPointMenuItemTitle',mapping:'iPointMenuItemTitle'}
		],
		listeners:{
			'load':function(store){
				var rowIndex=0;
				var MenuIds='';
				Ext.Ajax.request({
					url:'../Apis/AuthGroup.aspx?actionName=GetMenuIds&sid='+Sys.sid,
					params:{aGroupId:aGroupId},
					success:function(response,opts){
						var obj=new Ext.decode(response.responseText);
						MenuIds=(obj.msg).split(',');
						store.each(function(row){
							for(var i=0;i<MenuIds.length;i++){
								if(row.data.iPointMenuItemId==MenuIds[i]){
									sm_AddAuth.selectRow(rowIndex,true);
								}
							}
							rowIndex++;
						})
					},
					failure:function(response,opts){
						var obj=new Ext.decode(response.responseText);
						Ext.Msg.alert(obj.msg);
					}
				});
			}
		}
	});

	//添加权限的窗口
    var win_AddAuth= new Ext.Window({
        title: '添加权限',
        width: 500,
        height: 375,
        modal: true,
        closeAction: 'hide',
		layout:'fit',
        items: [
            new Ext.grid.GridPanel({
				id:'grid_AddAuth',
				height: 300,
                store: sotre_AddAuth,
				sm:sm_AddAuth,
                cm: new Ext.grid.ColumnModel({
                	defaults: {
                    	sortable: true
                    },
                    columns: [
                    	new Ext.grid.RowNumberer(),
						sm_AddAuth,
                        { dataIndex: 'iMenuCateCode', header: '大类编号' },
                        { dataIndex: 'iMenuCateTitle', header: '大类名称' },
                        { dataIndex: 'iPointMenuItemCode', header: '小类编号' },
						{ dataIndex: 'iPointMenuItemTitle', header: '小类名称' }
                    ]
                })
           })
        ],
        buttons: [
            {
                text: '保存',
                handler: function () {
					var addAuth=(Ext.getCmp('grid_AddAuth')).getSelectionModel().getSelections();
					var Ids=new Array();
					for(var i=0;i<addAuth.length;i++){
						Ids[i]=addAuth[i].get('iPointMenuItemId');
					}
					//alert(Ids.length);
					Ext.Ajax.request({
						url:'../Apis/AuthGroup.aspx?actionName=AddAuth&sid='+Sys.sid,
						method:'post',
						params:{aGroupId:aGroupId,Ids:Ids},
						success:function(response,opts){
							var obj=Ext.decode(response.responseText);
							Ext.Msg.alert('提示',obj.msg);
							aGroupId=0;
							win_AddAuth.hide();
						},
						failure:function(response,opts){
							var obj=Ext.decode(response.responseText);
							Ext.Msg.alert('提示',obj.msg);
							aGroupId=0;
							win_AddAuth.hide();
						}
					})
                }
            }
        ]
    });

	//*******************  添加权限组  *********************
	var Form_AddAuthGroup=new Ext.form.FormPanel({
		reader: new Ext.data.JsonReader({
			fields:[
				{name:'Id'},
				{name:'Code'},
				{name:'Title'},
				{name:'MemoInfo'}
			]
		}),

		height:100,
		style:'margin:1em;',
		labelWidth:50,
		labelAlign:'right',
		items:[
			{
				layout:'column',
				border:false,
				style:'margin-top:15px;',
				items:[
					{
						layout:'form',
						border:false,
						columnWidth:0.45,
						items:[
							{
								xtype:'textfield',
								name:'Code',
								fieldLabel:'编号',
								allowBlank:false,
								blankText:'编号为必填项',
								anchor:'100%'
							}
						]
					},
					{
						layout:'form',
						border:false,
						columnWidth:0.45,
						items:[
							{
								xtype:'textfield',
								name:'Title',
								fieldLabel:'名称',
								allowBlank:false,
								blankText:'名称为必填项',
								anchor:'100%'
							}
						]
					}
				]
			},{
				layout:'column',
				border:false,
				style:'margin-top:1em',
				items:[
					{
						layout:'form',
						columnWidth:0.9,
						border:false,
						items:[
							{
								xtype:'textfield',
								name:'MemoInfo',
								fieldLabel:'备注',
								anchor:'100%'
							},{
								xtype:'textfield',
								name:'Id',
								fieldLabel:'Id',
								hidden:true
							}
						]
					}
				]
			}
		]
	});
	var Edit_Save=false;
	var win_AddAuthGroup=new Ext.Window({
		title:'权限组',
		width:500,
		height:190,
		modal:true,
		closeAction:'hide',
		items:[Form_AddAuthGroup],
		buttons:[
			{
				text:'保存',
				handler:function(){
					if(Edit_Save==true){
						Form_AddAuthGroup.getForm().submit({
							url:'../Apis/AuthGroup.aspx?actionName=AddAuthGroup&sid='+Sys.sid,
							success:function(form,action){
								Ext.Msg.alert('提示',action.result.msg);
								Form_AddAuthGroup.getForm().reset();
								win_AddAuthGroup.hide();
								Edit_Save=false;
								store_AuthGroup.load({
									params:{Code:Code,Title:Title}
								});
							},
							failure:function(form,action){
								if(action.result!=null){
									Ext.Msg.alert('提示',action.result.msg);
								}
							}
						});
					}else if(Edit_Save==false){
						Form_AddAuthGroup.getForm().submit({
							url:'../Apis/AuthGroup.aspx?actionName=AuthGroupEdit&sid='+Sys.sid,
							success:function(form,action){
								Ext.Msg.alert('提示',action.result.msg);
								Form_AddAuthGroup.getForm().reset();
								win_AddAuthGroup.hide();
								store_AuthGroup.load({
									params:{Code:Code,Title:Title}
								});
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
		],
		listeners:{
			'hide':function(){
				Form_AddAuthGroup.getForm().reset();
			}
		}
	});

    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_AuthGroup]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -100',
            items: [grid_AuthGroup]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});