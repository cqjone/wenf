//价格管理

Ext.onReady(function () {

    var V_GroupId = 0; //组Id
    var DelIds = ''; //移除的服务Id
    var DelIdg = ''; //移除的产品Id

    //价格组_store
    var store_ggroup = new Ext.data.JsonStore({
        url: '../Apis/PriceMgr.aspx?actionName=search&sid=' + Sys.sid,
        root: 'items',
        totalProperty: 'datacount',
        fields: ['Id', 'Code', 'Title', 'MemoInfo'],
        /*data:[
        {Id:1,Code:'111',Title:'111',MemoInfo:'111'},
        {Id:2,Code:'222',Title:'222',MemoInfo:'222'}
        ],*/
        listeners: {
            beforeload: function () {
                store_ggroup.baseParams.start = 0;
                store_ggroup.baseParams.limit = 25;
                store_ggroup.baseParams.code = form_search.find('name', 'GCode')[0].getValue();
                store_ggroup.baseParams.name = form_search.find('name', 'GName')[0].getValue();
            }
        }
    });

    //组价格_产品/服务
    var store_gpg = new Ext.data.JsonStore({
        url: '../Apis/PriceMgr.aspx?actionName=&sid=' + Sys.sid,
        fields: ['Id', 'Code', 'Title', 'Price']
    });

    //服务价格
    var store_gps = new Ext.data.JsonStore({
        autoDestroy: true,
        url: '../Apis/PriceMgr.aspx?actionName=getPrice&type=service&sid=' + Sys.sid,
        fields: ['Id', 'ServiceId', 'Code', 'Title', 'Price']
    });
    //产品价格
    var store_gpgoods = new Ext.data.JsonStore({
        autoDestroy: true,
        url: '../Apis/PriceMgr.aspx?actionName=getPrice&type=goods&sid=' + Sys.sid,
        fields: ['Id', 'ProductId', 'Code', 'Title', 'Price']
    });

    //获得组门店
    var store_GDept = new Ext.data.JsonStore({
        url: '../Apis/PriceMgr.aspx?actionName=getDept&type=GDept&sid=' + Sys.sid,
        fields: ['Id', 'DeptId', 'Code', 'Title']
    });
    //选择门店
    var store_FDept = new Ext.data.JsonStore({
        url: '../Apis/PriceMgr.aspx?actionName=getDept&type=FDept&sid=' + Sys.sid,
        fields: ['Id', 'Code', 'Title']
    });

    var form_search = new Ext.form.FormPanel({
        //height:100,
        labelWidth: 60,
        labelAlign: 'right',
        items: [
			{
			    xtype: 'fieldset',
			    title: '查询',
			    layout: 'column',
			    items: [
					{
					    layout: 'form',
					    columnWidth: 0.45,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'GCode',
							    fieldLabel: '组编号',
							    anchor: '100%'
							}
						]
					},
					{
					    layout: 'form',
					    columnWidth: 0.45,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'GName',
							    fieldLabel: '组名称',
							    anchor: '100%'
							}
						],
					    buttons: [
							{
							    text: '查询',
							    handler: function () {
							        store_ggroup.load();
							    }
							},
							{
							    text: '新增',
							    handler: function () {
							        win_groupnew_eidt.show();
							    }
							}
						]
					}
				]
			}
		]
    });

    var form_new_edit = new Ext.form.FormPanel({

        frame: true,
        height: 70,
        border: false,
        labelWidth: 60,
        labelAlign: 'right',
        items: [
			{
			    layout: 'column',
			    items: [
					{
					    layout: 'form',
					    labelWidth: 60,
					    labelAlign: 'right',
					    columnWidth: 0.5,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'GCode',
							    fieldLabel: '组编号',
							    allowBlank: false,
							    anchor: '100%'
							}
						]
					},
					{
					    layout: 'form',
					    labelWidth: 60,
					    labelAlign: 'right',
					    columnWidth: 0.5,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'GName',
							    fieldLabel: '组名称',
							    allowBlank: false,
							    anchor: '100%'
							}
						]
					}
				]
			},
			{
			    xtype: 'textfield',
			    name: 'GMemoInfo',
			    fieldLabel: '备注',
			    anchor: '100%'
			},
			{
			    xtype: 'textfield',
			    name: 'Id',
			    hidden: true
			}
		]
    });

    var G_new_edit = 'insert';
    var win_groupnew_eidt = new Ext.Window({
        title: '新增组',
        modal: true,
        closeAction: 'hide',
        height: 130,
        width: 450,
        items: [form_new_edit],
        buttons: [
			{
			    text: '保存',
			    handler: function () {
			        if (form_new_edit.getForm().isValid()) {
			            var url = '../Apis/PriceMgr.aspx?actionName=GNewEdit&type=' + G_new_edit + '&sid=' + Sys.sid;
			            form_new_edit.getForm().submit({
			                url: url,
			                success: function (form, action) {
			                    Ext.Msg.alert('提示', action.result.msg, function () {
			                        win_groupnew_eidt.hide();
			                        store_ggroup.load();
			                    });
			                },
			                failure: function (form, action) {
			                    Ext.Msg.alert('提示', action.result.msg);
			                }
			            });
			        }
			    }
			}
		],
        listeners: {
            hide: function () {
                form_new_edit.getForm().reset();
                //form_new_edit.find('name', 'GName')[0].setValue('');
                G_new_edit = 'insert';
            }
        }
    });

    var gird_ggroup = new Ext.grid.GridPanel({
        store: store_ggroup,
        loadMask: true,
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
				    width: 180,
				    renderer: function (aa, bb, cc, rowIndex, ff, store) {
				        window.edit = function (rowIndex) {
				            var record = store.getAt(rowIndex);
				            form_new_edit.find('name', 'Id')[0].setValue(record.get('Id'));
				            form_new_edit.find('name', 'GCode')[0].setValue(record.get('Code'));
				            form_new_edit.find('name', 'GName')[0].setValue(record.get('Title'));
				            form_new_edit.find('name', 'GMemoInfo')[0].setValue(record.get('MemoInfo'));
				            win_groupnew_eidt.setTitle('修改组');
				            G_new_edit = 'update';
				            win_groupnew_eidt.show();
				        };
				        window.GPrice = function (rowIndex) {
				            var record = store.getAt(rowIndex);
				            V_GroupId = record.get('Id');
				            store_gps.proxy = new Ext.data.HttpProxy({ url: '../Apis/PriceMgr.aspx?actionName=getPrice&type=service&sid=' + Sys.sid });
				            store_gps.load({
				                params: { GroupId: V_GroupId }
				            });
				            store_gpgoods.proxy = new Ext.data.HttpProxy({ url: '../Apis/PriceMgr.aspx?actionName=getPrice&type=goods&sid=' + Sys.sid });
				            store_gpgoods.load({
				                params: { GroupId: V_GroupId }
				            });
				            var title = '组价格(' + record.get('Title') + '组)';
				            win_GPrice.setTitle(title);
				            win_GPrice.show();
				        };
				        window.GDept = function (rowIndex) {
				            var record = store.getAt(rowIndex);
				            V_GroupId = record.get('Id');
				            store_GDept.load({
				                params: { GroupId: V_GroupId }
				            });
				            var title = '组门店(' + record.get('Title') + '组)';
				            win_GDept.setTitle(title);
				            win_GDept.show();
				        };
				        window.Del = function (rowIndex) {
				            Ext.Msg.confirm('提示', '确定删除？如果删除所有价格都将删除！', function (btn) {
				                if (btn == 'yes') {
				                    var record = store.getAt(rowIndex);
				                    var GroupId = record.get('Id');
				                    Ext.Ajax.request({
				                        url: '../Apis/PriceMgr.aspx?actionName=GDel&sid=' + Sys.sid,
				                        params: { GroupId: GroupId },
				                        success: function (response, opts) {
				                            var obj = Ext.decode(response.responseText);
				                            Ext.Msg.alert('提示', obj.msg);
				                            store_ggroup.load();
				                        },
				                        failure: function (response, opts) {
				                            var obj = Ext.decode(response.responseText);
				                            Ext.Msg.alert('提示', obj.msg);
				                        }
				                    });
				                }
				            });
				        }
				        return "<a href='#' onclick='edit(" + rowIndex + ")'>修改</a>&nbsp; <a href='#' onclick='GPrice(" + rowIndex + ")'>组价格</a>&nbsp; <a href='#' onclick='GDept(" + rowIndex + ")'>组门店</a>&nbsp; <a href='#' onclick='Del(" + rowIndex + ")'>删除</a>";
				    }
				}
			]
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: store_ggroup,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
            emptyMsg: "没有记录"
        })
    });

    var sm_Gpservice = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
    var sm_Gpg = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
    var sm_Gpgoods = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
    var sm_Gdept = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
    var sm_Fdept = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
    var Gtype = '';
    //服务_产品窗口
    var win_gpg = new Ext.Window({
        title: '',
        modal: true,
        width: 500,
        height: 400,
        closeAction: 'hide',
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'vbox',
            frame: true,
            items: [
				{
				    xtype: 'form',
				    id: 'fm_gpg',
				    layout: 'column',
				    labelWidth: 40,
				    style: 'width:99%;',
				    items: [
						{
						    layout: 'form',
						    labelAlign: 'right',
						    columnWidth: 0.45,
						    items: [{
						        xtype: 'textfield',
						        fieldLabel: '编号',
						        name: 'Code',
						        anchor: '100%'
						    }]
						},
						{
						    layout: 'form',
						    labelAlign: 'right',
						    columnWidth: 0.45,
						    items: [{
						        xtype: 'textfield',
						        fieldLabel: '名称',
						        name: 'Title',
						        anchor: '100%'
						    }]
						},
						{
						    layout: 'form',
						    columnWidth: 0.1,
						    style: 'margin-left:10px;',
						    items: [{
						        xtype: 'button',
						        text: '查询',
						        anchor: '100%',
						        handler: function () {
						            var f = Ext.getCmp('fm_gpg');
						            var code = f.find('name', 'Code')[0].getValue();
						            var title = f.find('name', 'Title')[0].getValue();
						            store_gpg.proxy = new Ext.data.HttpProxy({ url: '../Apis/PriceMgr.aspx?actionName=gpg_search&type=' + Gtype + '&sid=' + Sys.sid });
						            store_gpg.load({
						                params: { code: code, title: title }
						            });
						        }
						    }]
						}
					]
				},
				{
				    xtype: 'grid',
				    id: 'grid_gpg',
				    height: 280,
				    sm: sm_Gpg,
				    store: store_gpg,
				    loadMask: true,
				    cm: new Ext.grid.ColumnModel({
				        defaults: {
				            sortable: true
				        },
				        columns: [
							new Ext.grid.RowNumberer(),
							sm_Gpg,
							{ dataIndex: 'Code', header: '编号' },
							{ dataIndex: 'Title', header: '名称', width: 160 },
							{ dataIndex: 'Price', header: '价格' }
						]
				    })
				}
			]
        }],
        buttons: [
			{
			    text: '保存',
			    handler: function () {
			        var selects = sm_Gpg.getCount();
			        var record = sm_Gpg.getSelections();
			        var Id = false; //判断数据是否已经存在,如果存在则取消这一条数据的添加
			        for (var i = 0; i < selects; i++) {
			            var re = record[i];
			            if (Gtype == 'service') {
			                /*store_gps.each(function(fn){
			                if(fn.data["ServiceId"]==re.data['Id']){
			                Id=true;
			                return ;
			                }
			                });*/
			                store_gps.findBy(function (fn) {
			                    if (fn.data['ServiceId'] == re.data['Id']) {
			                        Id = true;
			                        return;
			                    }
			                });
			            } else if (Gtype == 'goods') {
			                /*store_gpgoods.each(function(fn){
			                if(fn.data["ProductId"]==re.data['Id']){
			                Id=true;
			                return ;
			                }
			                });*/
			                store_gpgoods.findBy(function (fn) {
			                    if (fn.data['ProductId'] == re.data['Id']) {
			                        Id = true;
			                        return;
			                    }
			                });
			            }

			            if (!Id) {
			                var m = new gpgmodel({
			                    pgId: re.data["Id"],
			                    Code: re.data["Code"],
			                    Title: re.data["Title"],
			                    Price: re.data["Price"]
			                });
			                if (Gtype == 'service') {
			                    store_gps.add(m);
			                } else if (Gtype == 'goods') {
			                    store_gpgoods.add(m);
			                }
			            }
			            Id = false;
			        };
			        win_gpg.hide();
			    }
			}
		],
        listeners: {
            hide: function () {
                Gtype = '';
                store_gpg.removeAll();
                Ext.getCmp('grid_gpg').getStore().removeAll();
            }
        }
    });

    var gpgmodel = new Ext.data.Record.create([
		{ name: 'pgId' },
		{ name: 'Code' },
		{ name: 'Title' },
		{ name: 'Price' }
	]);

    //组价格_服务
    var pnlservice_GPrice = new Ext.Panel({
        width: '99%',
        //height:400,
        frame: true,
        layout: 'fit',
        items: [
			{
			    xtype: 'panel',
			    layout: 'vbox',
			    layout: 'fit',
			    items: [
					{
					    xtype: 'editorgrid',
					    id: 'gird_ps',
					    height: 350,
					    sm: sm_Gpservice,
					    store: store_gps,
					    clicksToEdit: 1,
					    cm: new Ext.grid.ColumnModel(
							{
							    defaults: {
							        sortable: true
							    },
							    columns: [
									new Ext.grid.RowNumberer(),
									sm_Gpservice,
									{ dataIndex: 'Code', header: '服务编号' },
									{ dataIndex: 'Title', header: '服务名称', width: 160 },
									{
									    dataIndex: 'Price',
									    header: '最低价格',
									    editor: new Ext.form.NumberField({
									        allowBlank: false,
									        style: 'text-align:left'
									    })
									}
								]
							}
						),
					    tbar: [
							{
							    xtype: 'button',
							    text: '新增',
							    iconCls: 'silk-add',
							    handler: function () {
							        Gtype = 'service';
							        win_gpg.setTitle('服务');
							        win_gpg.show();
							    }
							},
							{
							    xtype: 'button',
							    text: '删除',
							    iconCls: 'silk-delete',
							    handler: function () {
							        var selects = sm_Gpservice.getSelections();
							        var count = selects.length;
							        for (var i = 0; i < count; i++) {
							            var record = selects[i];
							            if (record.get('Id') != undefined && record.get('Id') != '') {
							                DelIds += record.get('Id') + ',';
							            }
							            store_gps.remove(record); //从store中移该数据
							            store_gps.getModifiedRecords().remove(record); //从store中的更改数据中移除该数据
							        }
							    }
							},
							{
							    xtype: 'form',
							    id: 'frm_searips',
							    layout: 'column',
							    style: 'border:1px #E9E9E9 solid',
							    defaults: {
							        labelWidth: 30,
							        labelAlign: 'right'
							    },
							    items: [
									{
									    layout: 'form',
									    columnWidth: 0.5,
									    items: [{
									        xtype: 'textfield',
									        name: 'Code',
									        fieldLabel: '编号',
									        anchor: '100%'
									    }]
									},
									{
									    layout: 'form',
									    columnWidth: 0.5,
									    items: [{
									        xtype: 'textfield',
									        name: 'Name',
									        fieldLabel: '名称',
									        anchor: '100%'
									    }]
									}
								]
							},
							{
							    xtype: 'button',
							    text: ' 查询',
							    handler: function () {
							        var code = Ext.getCmp('frm_searips').find('name', 'Code')[0].getValue();
							        var name = Ext.getCmp('frm_searips').find('name', 'Name')[0].getValue();
							        if (code == '' && name == '') { store_gps.clearFilter(); return; }
							        try {
							            store_gps.filter([
											{ property: 'Code', value: code, anyMatch: true, caseSensitive: false },
											{ property: 'Title', value: name, anyMatch: true, caseSensitive: false }
										]);
							        } catch (e) {
							            if (code != '') {
							                store_gps.filter([
												{ property: 'Code', value: code, anyMatch: true, caseSensitive: false }
											]);
							            } else {
							                store_gps.filter([
												{ property: 'Title', value: name, anyMatch: true, caseSensitive: false }
											]);
							            }
							        }
							    }
							}
						]
					}
				]
			}
		]
    });

    //组价格_产品
    var pnlgoods_GPrice = new Ext.Panel({
        width: '99%',
        //height:400,
        frame: true,
        layout: 'fit',
        items: [
			{
			    xtype: 'panel',
			    layout: 'fit',
			    items: [{
			        xtype: 'editorgrid',
			        sm: sm_Gpgoods,
			        store: store_gpgoods,
			        clicksToEdit: 1,
			        cm: new Ext.grid.ColumnModel(
						{
						    defaults: {
						        sortable: true
						    },
						    columns: [
								new Ext.grid.RowNumberer(),
								sm_Gpgoods,
								{ dataIndex: 'Code', header: '产品编号' },
								{ dataIndex: 'Title', header: '产品名称', width: 160 },
								{
								    dataIndex: 'Price',
								    header: '最低价格',
								    editor: new Ext.form.NumberField({
								        allowBlank: false,
								        style: 'text-align:left'
								    })
								}
							]
						}
					),
			        tbar: [
						{
						    xtype: 'button',
						    text: '新增',
						    iconCls: 'silk-add',
						    handler: function () {
						        Gtype = 'goods';
						        win_gpg.setTitle('产品');
						        win_gpg.show();
						    }
						},
						{
						    xtype: 'button',
						    text: '删除',
						    iconCls: 'silk-delete',
						    handler: function () {
						        var selects = sm_Gpgoods.getSelections();
						        var count = selects.length;
						        for (var i = 0; i < count; i++) {
						            var record = selects[i];
						            if (record.get('Id') != undefined && record.get('Id') != '') {
						                DelIdg += record.get('Id') + ',';
						            }
						            store_gpgoods.remove(record); //从store中移该数据
						            store_gpgoods.getModifiedRecords().remove(record); //从store中的更改数据中移除该数据
						        }
						    }
						},
						{
						    xtype: 'form',
						    id: 'frm_searipg',
						    layout: 'column',
						    style: 'border:1px #E9E9E9 solid',
						    defaults: {
						        labelWidth: 30,
						        labelAlign: 'right'
						    },
						    items: [
									{
									    layout: 'form',
									    columnWidth: 0.5,
									    items: [{
									        xtype: 'textfield',
									        name: 'Code',
									        fieldLabel: '编号',
									        anchor: '100%'
									    }]
									},
									{
									    layout: 'form',
									    columnWidth: 0.5,
									    items: [{
									        xtype: 'textfield',
									        name: 'Name',
									        fieldLabel: '名称',
									        anchor: '100%'
									    }]
									}
								]
						},
							{
							    xtype: 'button',
							    text: ' 查询',
							    handler: function () {
							        var code = Ext.getCmp('frm_searipg').find('name', 'Code')[0].getValue();
							        var name = Ext.getCmp('frm_searipg').find('name', 'Name')[0].getValue();
							        if (code == '' && name == '') { store_gpgoods.clearFilter(); return; }
							        try {
							            store_gpgoods.filter([
											{ property: 'Code', value: code, anyMatch: true, caseSensitive: false },
											{ property: 'Title', value: name, anyMatch: true, caseSensitive: false }
										]);
							        } catch (e) {
							            if (code != '') {
							                store_gpgoods.filter([
												{ property: 'Code', value: code, anyMatch: true, caseSensitive: false }
											]);
							            } else {
							                store_gpgoods.filter([
												{ property: 'Title', value: name, anyMatch: true, caseSensitive: false }
											]);
							            }
							        }
							    }
							}
					]
			    }]
			}
		]
    });

    //组价格窗口
    var win_GPrice = new Ext.Window({
        title: '组价格',
        modal: true,
        closeAction: 'hide',
        width: 500,
        height: 500,
        layout: 'fit',
        items: [{
            xtype: 'tabpanel',
            frame: true,
            height: 200,
            activeTab: 0,
            items: [
				{
				    title: '服务',
				    layout: 'fit',
				    items: [pnlservice_GPrice]
				},
				{
				    title: '产品',
				    layout: 'fit',
				    items: [pnlgoods_GPrice]
				}
			]
        }],
        buttons: [{
            text: '保存',
            handler: function () {
                var Modify = store_gps.getModifiedRecords();
                var updsp = '';
                var newsp = '';
                for (var i = 0; i < Modify.length; i++) {
                    var record = Modify[i];
                    if (record.data['Id'] != undefined && record.data['Id'] != '') {
                        updsp += '' + record.data["Id"] + ',' + record.data['Price'] + '_';
                        continue;
                    } else {
                        newsp += '' + record.data["pgId"] + ',' + record.data['Price'] + '_';
                        continue;
                    }
                }
                Ext.Ajax.request({
                    url: '../Apis/PriceMgr.aspx?actionName=UdatePG&type=service&sid=' + Sys.sid,
                    params: { DelIds: DelIds, GroupId: V_GroupId, updsp: updsp, newsp: newsp },
                    success: function (response, opts) {
                        //var obj = Ext.decode(response.responseText);
                        //Ext.Msg.alert('提示',obj.msg);
                        DelIds = '';
                        //store_gps.removeAll();
                        store_gps.commitChanges();
                    },
                    failure: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        Ext.Msg.alert('提示', '保存服务时：' + obj.msg, function () {
                            return;
                        });
                    }
                });

                Modify = store_gpgoods.getModifiedRecords();
                updsp = '';
                newsp = '';
                for (var i = 0; i < Modify.length; i++) {
                    var record = Modify[i];
                    if (record.data['Id'] != undefined && record.data['Id'] != '') {
                        updsp += '' + record.data["Id"] + ',' + record.data['Price'] + '_';
                        continue;
                    } else {
                        newsp += '' + record.data["pgId"] + ',' + record.data['Price'] + '_';
                        continue;
                    }
                }
                Ext.Ajax.request({
                    url: '../Apis/PriceMgr.aspx?actionName=UdatePG&type=goods&sid=' + Sys.sid,
                    params: { DelIds: DelIdg, GroupId: V_GroupId, updsp: updsp, newsp: newsp },
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        Ext.Msg.alert('提示', obj.msg);
                        DelIdg = '';
                        //store_gpgoods.removeAll();
                        store_gpgoods.commitChanges();
                    },
                    failure: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        Ext.Msg.alert('提示', '保存门店时：' + obj.msg, function () {
                            return;
                        });
                    }
                });
            }
        }],
        listeners: {
            hide: function () {
                store_gps.removeAll();
                store_gps.commitChanges();
                store_gpgoods.removeAll();
                store_gpgoods.commitChanges();
                V_GroupId = 0;
                DelIds = '';
                DelIdg = '';
            }
        }
    });

    //组门店
    var win_GDept = new Ext.Window({
        title: '组门店',
        modal: true,
        width: 500,
        height: 400,
        closeAction: 'hide',
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'vbox',
            frame: true,
            items: [
				{
				    xtype: 'form',
				    id: 'fm_gdept',
				    layout: 'column',
				    labelWidth: 40,
				    style: 'width:99%;',
				    items: [
						{
						    layout: 'form',
						    labelAlign: 'right',
						    columnWidth: 0.45,
						    items: [{
						        xtype: 'textfield',
						        fieldLabel: '编号',
						        name: 'Code',
						        anchor: '100%'
						    }]
						},
						{
						    layout: 'form',
						    labelAlign: 'right',
						    columnWidth: 0.45,
						    items: [{
						        xtype: 'textfield',
						        fieldLabel: '名称',
						        name: 'Title',
						        anchor: '100%'
						    }]
						},
						{
						    layout: 'form',
						    columnWidth: 0.1,
						    style: 'margin-left:10px;',
						    items: [{
						        xtype: 'button',
						        text: '查询',
						        anchor: '100%',
						        handler: function () {
						            var f = Ext.getCmp('fm_gdept');
						            var code = f.find('name', 'Code')[0].getValue();
						            var title = f.find('name', 'Title')[0].getValue();
						            /*store_GDept.load({
						            params:{code:code,title:title,GroupId:V_GroupId}
						            });*/
						            if (code == '' && title == '') {
						                store_GDept.clearFilter();
						                return;
						            }
						            try {
						                store_GDept.filter([
											{ property: 'Code', value: code, anyMatch: true, caseSensitive: false },
											{ property: 'Title', value: title, anyMatch: true, caseSensitive: false }
										]);
						            } catch (e) {
						                if (code != '') {
						                    store_GDept.filter([
												{ property: 'Code', value: code, anyMatch: true, caseSensitive: false }
											]);
						                } else {
						                    store_GDept.filter([
												{ property: 'Title', value: title, anyMatch: true, caseSensitive: false }
											]);
						                }
						            }
						        }
						    }]
						}
					]
				},
				{
				    xtype: 'grid',
				    id: 'grid_gdept',
				    height: 280,
				    sm: sm_Gdept,
				    store: store_GDept,
				    loadMask: true,
				    cm: new Ext.grid.ColumnModel({
				        defaults: {
				            sortable: true
				        },
				        columns: [
							new Ext.grid.RowNumberer(),
							sm_Gdept,
							{ dataIndex: 'Code', header: '编号' },
							{ dataIndex: 'Title', header: '名称', width: 160 }
						]
				    }),
				    tbar: [
						{
						    xtype: 'button',
						    text: '新增',
						    iconCls: 'silk-add',
						    handler: function () {
						        win_Dept.show();
						    }
						},
						{
						    xtype: 'button',
						    text: '删除',
						    iconCls: 'silk-delete',
						    handler: function () {
						        var selects = sm_Gdept.getSelections();
						        var count = selects.length;
						        for (var i = 0; i < count; i++) {
						            var record = selects[i];
						            if (record.get('Id') != undefined && record.get('Id') != '') {
						                DelIds += record.get('Id') + ',';
						            }
						            store_GDept.remove(record); //从store中移该数据
						            store_GDept.getModifiedRecords().remove(record); //从store中的更改数据中移除该数据
						        }
						    }
						}
					]
				}
			]
        }],
        buttons: [
			{
			    xtype: 'panel',
			    border: false,
			    html: '<div style="color:red;cursor:text;">(如果前面的价格组中存在您选择的门店，则前面价格组中的门店将被删除！)</div>'
			},
			{
			    //xtype:'button',
			    text: '保存',
			    handler: function () {
			        var Modify = store_GDept.getModifiedRecords();
			        var newGdept = '';
			        for (var i = 0; i < Modify.length; i++) {
			            var record = Modify[i];
			            newGdept += '' + record.data["DeptId"] + ',';
			        }
			        Ext.Ajax.request({
			            url: '../Apis/PriceMgr.aspx?actionName=UdateGDept&sid=' + Sys.sid,
			            params: { DelIds: DelIds, GroupId: V_GroupId, newGdept: newGdept },
			            success: function (response, opts) {
			                var obj = Ext.decode(response.responseText);
			                Ext.Msg.alert('提示', obj.msg);
			                //store_GDept.removeAll();
			                store_GDept.commitChanges();
			            },
			            failure: function (response, opts) {
			                var obj = Ext.decode(response.responseText);
			                Ext.Msg.alert('提示', obj.msg);
			            }
			        });
			    }
			}
		],
        listeners: {
            hide: function () {
                store_GDept.removeAll();
                store_GDept.commitChanges();
                Ext.getCmp('fm_gdept').find('name', 'Code')[0].setValue('');
                Ext.getCmp('fm_gdept').find('name', 'Title')[0].setValue('');
                V_GroupId = 0;
                DelIds = '';
            }
        }
    });

    //选择门店
    var win_Dept = new Ext.Window({
        title: '选择门店',
        modal: true,
        width: 500,
        height: 400,
        closeAction: 'hide',
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'vbox',
            frame: true,
            items: [
				{
				    xtype: 'form',
				    id: 'fm_Dept',
				    layout: 'column',
				    labelWidth: 40,
				    style: 'width:99%;',
				    items: [
						{
						    layout: 'form',
						    labelAlign: 'right',
						    columnWidth: 0.45,
						    items: [{
						        xtype: 'textfield',
						        fieldLabel: '编号',
						        name: 'Code',
						        anchor: '100%'
						    }]
						},
						{
						    layout: 'form',
						    labelAlign: 'right',
						    columnWidth: 0.45,
						    items: [{
						        xtype: 'textfield',
						        fieldLabel: '名称',
						        name: 'Title',
						        anchor: '100%'
						    }]
						},
						{
						    layout: 'form',
						    columnWidth: 0.1,
						    style: 'margin-left:10px;',
						    items: [{
						        xtype: 'button',
						        text: '查询',
						        anchor: '100%',
						        handler: function () {
						            var f = Ext.getCmp('fm_Dept');
						            var code = f.find('name', 'Code')[0].getValue();
						            var title = f.find('name', 'Title')[0].getValue();
						            store_FDept.load({
						                params: { code: code, title: title }
						            });
						        }
						    }]
						}
					]
				},
				{
				    xtype: 'grid',
				    id: '',
				    height: 280,
				    sm: sm_Fdept,
				    store: store_FDept,
				    loadMask: true,
				    cm: new Ext.grid.ColumnModel({
				        defaults: {
				            sortable: true
				        },
				        columns: [
							new Ext.grid.RowNumberer(),
							sm_Fdept,
							{ dataIndex: 'Code', header: '编号' },
							{ dataIndex: 'Title', header: '名称', width: 160 }
						]
				    })
				}
			]
        }],
        buttons: [
			{
			    text: '保存',
			    handler: function () {
			        var selects = sm_Fdept.getSelections();
			        var DeptId = false;
			        for (var i = 0; i < selects.length; i++) {
			            var re = selects[i];
			            /*store_GDept.each(function(fn){
			            if(fn.data["DeptId"]==re.data['Id']){
			            DeptId=true;
			            return ;
			            }
			            });*/
			            store_GDept.findBy(function (fn) {
			                if (fn.data['DeptId'] == re.data['Id']) {
			                    DeptId = true;
			                    return;
			                }
			            });
			            if (!DeptId) {
			                var m = new deptmodel({
			                    DeptId: re.data['Id'],
			                    Code: re.data['Code'],
			                    Title: re.data['Title']
			                });
			                store_GDept.add(m);
			            }
			            DeptId = false;
			        }
			        win_Dept.hide();
			    }
			}
		],
        listeners: {
            hide: function () {
                store_FDept.removeAll();
            }
        }
    });

    var deptmodel = new Ext.data.Record.create([
		{ name: 'DeptId' },
		{ name: 'Code' },
		{ name: 'Title' }
	]);

    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [form_search]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -123',
            items: [gird_ggroup]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
})