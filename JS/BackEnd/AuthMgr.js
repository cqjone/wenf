Ext.onReady(function () {

    var CateId = 0; //iMenuCate 的 Id
    var iPointMenuItemId = 0; //iPointMenuItem 的 Id
    var Edit_Save = false; //维护判断 是保存还是修改,  true:修改  false:添加

    //combo 下拉框(从数据库里读)
    var store_comboiMenuCateSelect = new Ext.data.ArrayStore({
        fields: ['myId', 'displayText'],
        url: "../Apis/AuthMgr.aspx?actionName=searchiMenuCateTitle&sid=" + Sys.sid
    });

    //权限维护上层设置
    var pan_top_search = new Ext.form.FormPanel({
        height: 70,
        items: [
			{
			    xtype: 'fieldset',
			    title: '权限维护',
			    layout: 'column',
			    items: [
					{
					    layout: 'form',
					    labelWidth: 60,
					    labelAlign: 'right',
					    columnWidth: 0.4,
					    style: 'margin-left:1em;',
					    items: [
							{
							    xtype: 'combo',
							    name: 'iMenuCateSelect',
							    anchor: '95%',
							    fieldLabel: '权限大类',
							    triggerAction: 'all',
							    editable: false,
							    mode: 'remote',
							    store: store_comboiMenuCateSelect,
							    value: '全部',
							    valueField: 'myId',
							    displayField: 'displayText'
							}
						]
					}, {
					    xtype: 'button',
					    text: '查询',
					    width: 60,
					    listeners: {
					        'click': function () {
					            CateId = pan_top_search.find('name', 'iMenuCateSelect')[0].value;
					            //alert(CateId);
					            if (CateId == '全部') {
					                CateId = 0;
					            }
					            store_iMenuCate.load({
					                params: { CateId: CateId }
					            });
					        }
					    }
					}, {
					    xtype: 'button',
					    text: '大类维护',
					    width: 70,
					    style: 'margin-left:2em',
					    listeners: {
					        'click': function () {
					            store_iMenuCateEdit.load();
					            win_iMenuCateEdit.show();
					        }
					    }
					}, {
					    xtype: 'button',
					    text: '子类维护',
					    width: 70,
					    style: 'margin-left:1em',
					    listeners: {
					        'click': function () {
					            store_iPointMenuItem.load();
					            win_iPointMenuItem.show();
					        }
					    }
					}
				]
			}
		]
    });

    //#################  功能权限维护  #################	


    //**************大类**************//
    //显示所有功能权限(所有iMenuCate,iPointMenuItem)
    var store_iMenuCate = new Ext.data.Store({
        autoDestroy: true,
        url: "../Apis/AuthMgr.aspx?actionName=searchiMenuCate&sid=" + Sys.sid,
        reader: new Ext.data.JsonReader({
            root: "results",
            fields: [
				{ name: 'CateId', mapping: 'CateId' },
				{ name: 'iPointMenuItemId', mapping: 'iPointMenuItemId' },
				{ name: 'iMenuCateCode', mapping: 'iMenuCateCode' },
				{ name: 'iMenuCateTitle', mapping: 'iMenuCateTitle' },
				{ name: 'iPointMenuItemCode', mapping: 'iPointMenuItemCode' },
				{ name: 'iPointMenuItemTitle', mapping: 'iPointMenuItemTitle' },
				{ name: 'iPointMenuItemUrl', mapping: 'iPointMenuItemUrl' }
			]
        })
    });

    var grid_iMenuCate = new Ext.grid.GridPanel({
        autoScroll: true,
        store: store_iMenuCate,
        stripeRows: true,
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true // columns are not sortable by default           
            },
            columns: [
					new Ext.grid.RowNumberer(),
					{ dataIndex: 'CateId', header: 'CateId', hidden: true },
					{ dataIndex: 'iPointMenuItemId', header: 'iPointMenuItemId', hidden: true },
					{ dataIndex: "iMenuCateCode", header: "大类编号" },
					{ dataIndex: "iMenuCateTitle", header: "大类名称" },
					{ dataIndex: 'iPointMenuItemCode', header: '子类编号' },
					{ dataIndex: 'iPointMenuItemTitle', header: '子类名称' },
					{ dataIndex: 'iPointMenuItemUrl', header: '子类Url', width: 200 },
					{
					    header: '操作',
					    width: 200,
					    renderer: showbutton_Del
					}]
        })
    });

    var Form_IMenuCate = new Ext.form.FormPanel({
        reader: new Ext.data.JsonReader({
            fields: [
				{ name: 'Id' },
				{ name: 'Title' },
				{ name: 'MemoInfo' }
			]
        }),
        frame: true,
        style: 'padding:10px;',
        labelWidth: 70,
        defaults: { width: 160 },
        items: [
			{
			    xtype: 'textfield',
			    name: 'Title',
			    fieldLabel: 'Title'
			}, {
			    xtype: 'textarea',
			    name: 'MemoInfo',
			    fieldLabel: 'MemoInfo'
			}, {
			    xtype: 'textfield',
			    name: 'Id',
			    hidden: true
			}
		]
    });

    //具体的大类信息的窗口
    var win_Main_iMenuCate_Edit = new Ext.Window({
        title: 'sadf',
        modal: true,
        closeAction: "hide",
        width: 300,
        height: 200,
        items: [Form_IMenuCate],
        buttons: [
			{
			    text: '确定修改',
			    handler: function () {
			        Form_IMenuCate.getForm().submit({
			            url: '../Apis/AuthMgr.aspx?actionName=iMenuCateEdit&sid=' + Sys.sid,
			            waitMsg: '请稍候...',
			            success: function (form, action) {
			                Ext.Msg.alert('提示', action.result.msg);
			                if (action.result.success == true) {
			                    store_iMenuCate.load();
			                    Form_IMenuCate.getForm().reset();
			                    win_Main_iMenuCate_Edit.hide();
			                }
			            },
			            failure: function (form, action) {
			                if (action.result != null) {
			                    Ext.Msg.alert('提示', action.result.msg);
			                }
			            }
			        });
			    }
			},
			{
			    text: '取消',
			    handler: function () {
			        Form_IMenuCate.getForm().reset();
			        win_Main_iMenuCate_Edit.hide();
			    }
			}
		]
    });

    //删除大类、删除子类的操作按钮
    function showbutton_Del(value, metadata, record, rowIndex, columnIndex, store) {
        window.DeliMenuCateById = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            CateId = rowNum.get("CateId");
            Ext.Msg.confirm("提示", "确定删除大类？ 删除大类其子类将不可用！", function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: '../Apis/AuthMgr.aspx?actionName=Del&dotype=DeliMenuCate&sid=' + Sys.sid,
                        method: 'post',
                        params: { CateId: CateId },
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert("提示", obj.msg);
                            store_iMenuCate.load({
                                params: { CateId: CateId }
                            });
                            store_comboiMenuCateSelect.load();
                        },
                        failure: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert("提示", obj.msg);
                        }
                    });
                }
            });
        };
        window.DeliPointMenuItemById = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            iPointMenuItemId = rowNum.get('iPointMenuItemId');
            Ext.Msg.confirm("提示", "确定删除子类？", function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: '../Apis/AuthMgr.aspx?actionName=Del&dotype=RemoveiPointMenuItem&sid=' + Sys.sid,
                        method: 'post',
                        params: { iPointMenuItemId: iPointMenuItemId },
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert("提示", obj.msg);
                            store_iMenuCate.load({
                                params: { CateId: CateId }
                            });
                        },
                        failure: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert("提示", obj.msg);
                        }
                    });
                }
            });
        }
        var returnStr = "<a href='#' onclick='DeliMenuCateById(" + rowIndex + ")'>删除大类</a> &nbsp; &nbsp;<a href='#' onclick='DeliPointMenuItemById(" + rowIndex + ")'>删除子类</a>";
        return returnStr;
    }

    //大类维护
    var store_iMenuCateEdit = new Ext.data.JsonStore({
        url: '../Apis/AuthMgr.aspx?actionName=GetiMenuCate&sid=' + Sys.sid,
        root: 'results',
        fields: [
			{ name: 'CateId', mapping: 'Id' },
			{ name: 'iMenuCateCode', mapping: 'Code' },
			{ name: 'iMenuCateTitle', mapping: 'Title' },
			{ name: 'iMenuCateMemoInfo', mapping: 'MemoInfo' }
		]
    });

    var Form_iMenuCateEdit = new Ext.form.FormPanel({

        reader: new Ext.data.JsonReader({
            fields: [
				{ name: 'Id' },
				{ name: 'Code' },
				{ name: 'Title' },
				{ name: 'MemoInfo' }
			]
        }),

        frame: true,
        labelWidth: 40,
        style: 'padding:1em;',
        layout: 'anchor',
        labelAlign: 'right',
        items: [
			{
			    layout: 'column',
			    style: 'padding-top:1em;',
			    items: [
					{
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'Code',
							    fieldLabel: '编号',
							    allowBlank: false,
							    blankText: '编号是必填项',
							    anchor: '100%'
							}, {
							    xtype: 'textfield',
							    name: 'Id',
							    hidden: true
							}
						]
					}, {
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							 {
							     xtype: 'textfield',
							     name: 'Title',
							     fieldLabel: '名称',
							     allowBlank: false,
							     blankText: '名称是必填项',
							     anchor: '100%'
							 }
						]
					}, {
					    layout: 'form',
					    columnWidth: 0.18,
					    style: 'padding-left:1em;border:0px blue solid;',
					    items: [
							{
							    xtype: 'button',
							    text: '保存',
							    width: 100,
							    listeners: {
							        'click': function () {
							            if (Edit_Save == true) {
							                Form_iMenuCateEdit.getForm().submit({
							                    url: '../Apis/AuthMgr.aspx?actionName=iMenuCateEdit&sid=' + Sys.sid,
							                    waitMsg: '请稍候...',
							                    success: function (form, action) {
							                        Ext.Msg.alert('提示', action.result.msg);
							                        if (action.result.success == true) {
							                            Form_iMenuCateEdit.getForm().reset();
							                            Edit_Save = false;
							                            store_iMenuCateEdit.load();
							                        }
							                    },
							                    failure: function (form, action) {
							                        if (action.result != null) {
							                            Ext.Msg.alert('提示', action.result.msg);
							                        }
							                    }
							                });
							            } else if (Edit_Save == false) {
							                Form_iMenuCateEdit.getForm().submit({
							                    url: '../Apis/AuthMgr.aspx?actionName=AddiMenuCate&sid=' + Sys.sid,
							                    waitMsg: '请稍候...',
							                    success: function (form, action) {
							                        Ext.Msg.alert('提示', action.result.msg);
							                        if (action.result.success == true) {
							                            Form_iMenuCateEdit.getForm().reset();
							                            store_iMenuCateEdit.load();
							                        }
							                    },
							                    failure: function (form, action) {
							                        if (action.result != null && action.result.failure == true) {
							                            Ext.Msg.alert('提示', action.result.msg);
							                        }
							                    }
							                });
							            }
							        }
							    }
							}
						]
					}, {
					    layout: 'form',
					    columnWidth: 0.8,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'MemoInfo',
							    fieldLabel: '备注',
							    anchor: '100%'
							}
						]
					}, {
					    layout: 'form',
					    columnWidth: 0.18,
					    style: 'padding-left:1em;border:0px blue solid;',
					    items: [
							{
							    xtype: 'button',
							    text: '取消修改',
							    width: 100,
							    listeners: {
							        'click': function () {
							            Edit_Save = false;
							            Form_iMenuCateEdit.getForm().reset();
							        }
							    }
							}
						]
					}
				]
			},
			{
			    style: 'padding-left:1em;padding-top:1em;',
			    layout: 'column',
			    items: [
					{
					    columnWidth: 0.95,
					    autoFill: true,
					    height: 300,
					    style: 'border:1px gray solid;',
					    items: [
							new Ext.grid.GridPanel({
							    width: 1000,
							    height: 300,
							    store: store_iMenuCateEdit,
							    stripeRows: true,
							    cm: new Ext.grid.ColumnModel({
							        defaults: {
							            sortable: true // columns are not sortable by default           
							        },
							        columns: [
										new Ext.grid.RowNumberer(),
										{ dataIndex: 'iMenuCateCode', header: '编号' },
										{ dataIndex: 'iMenuCateTitle', header: '名称' },
										{ dataIndex: 'iMenuCateMemoInfo', header: '备注' },
										{
										    header: '操作',
										    width: 200,
										    renderer: showbutton_iMenuCateEdit
										}
									]
							    })
							})
						]
					}
				]
			}
		]
    });

    //大类维护中按钮事件
    function showbutton_iMenuCateEdit(value, metadata, record, rowIndex, columnIndex, store) {
        window.iMenuCateEdit = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            CateId = rowNum.get('CateId');
            Form_iMenuCateEdit.load({
                url: '../Apis/AuthMgr.aspx?actionName=ShowiMenuCateById&sid=' + Sys.sid,
                params: { CateId: CateId }
            });
            Edit_Save = true;
        };
        window.DeliMenuCateById = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            CateId = rowNum.get('CateId');
            Ext.Msg.confirm("提示", "确定删除大类？ 删除大类其子类将不属于任何大类！", function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: '../Apis/AuthMgr.aspx?actionName=Del&dotype=DeliMenuCate&sid=' + Sys.sid,
                        method: 'post',
                        params: { CateId: CateId },
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert("提示", obj.msg);
                            store_iMenuCateEdit.load();
                        },
                        failure: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert("提示", obj.msg);
                        }
                    });
                }
            });
        };
        window.AddiPionMenuItemToiMenuCate = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            CateId = rowNum.get('CateId');
            store_iMenuCateAddiPointMenuItem.load();
            win_iMenuCateAddiPointMenuItem.show();
        }
        var resultStr = "<a href='#' onclick='iMenuCateEdit(" + rowIndex + ")'>修改</a> &nbsp; <a href='#' onclick='DeliMenuCateById(" + rowIndex + ")'>删除</a> &nbsp; <a href='#' onclick='AddiPionMenuItemToiMenuCate(" + rowIndex + ")'>添加子类</a>";
        return resultStr;
    }

    //大类维护窗口(AddiMenuCate)
    var win_iMenuCateEdit = new Ext.Window({
        title: '大类维护',
        width: 700,
        height: 450,
        modal: true,
        closeAction: 'hide',
        items: [Form_iMenuCateEdit],
        listeners: {
            'hide': function () {
                Form_iMenuCateEdit.getForm().reset();
                CateId = 0;
                Edit_Save = false;
            }
        }
    });

    //大类中添加子类
    var store_iMenuCateAddiPointMenuItem = new Ext.data.JsonStore({
        root: 'results',
        url: '../Apis/AuthMgr.aspx?actionName=ShowiPointMenuItem&type=IniMenuCate&sid=' + Sys.sid,
        fields: [
				{ name: 'Id' },
				{ name: 'CateId' },
				{ name: 'Code' },
				{ name: 'Title' },
				{ name: 'Url' }
			],
        listeners: {
            'load': function (store) {
                var index = 0;
                store.each(function (aa) {
                    if (aa.data.CateId == CateId) {
                        sm_iMenuCateAddiPointMenuItem.selectRow(index, true);
                    }
                    index++;
                });
                //sm_iMenuCateAddiPointMenuItem.selectRow(index);
            }
        }
    });
    var sm_iMenuCateAddiPointMenuItem = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn }); // gird 中的复选框（原来cm中的复选框与sm_iMenumCate要是同一个对象才行）
    //给大类添加子类的窗口
    var win_iMenuCateAddiPointMenuItem = new Ext.Window({
        title: '添加子类',
        width: 500,
        height: 350,
        modal: true,
        autoScroll: true,
        closeAction: 'hide',
        layout: 'fit',
        items: [
			new Ext.grid.GridPanel({
			    id: 'grid_iMenuCateAddiPointMenuItem',
			    store: store_iMenuCateAddiPointMenuItem,
			    stripeRows: true,
			    sm: sm_iMenuCateAddiPointMenuItem,
			    cm: new Ext.grid.ColumnModel({
			        defaults: {
			            sortable: true // columns are not sortable by default           
			        },
			        columns: [
						new Ext.grid.RowNumberer(),
						sm_iMenuCateAddiPointMenuItem,
						{ dataIndex: 'Code', header: '编号' },
						{ dataIndex: 'Title', header: '名称' },
						{ dataIndex: 'Url', header: 'URL' }
					]
			    })
			})
		],
        buttons: [
			{
			    text: '保存',
			    handler: function () {
			        var a = (Ext.getCmp('grid_iMenuCateAddiPointMenuItem')).getSelectionModel().getSelections();
			        var Ids = new Array();
			        for (var i = 0; i < a.length; i++) {
			            Ids[i] = a[i].get('Id');
			        }
			        Ext.Ajax.request({
			            url: '../Apis/AuthMgr.aspx?actionName=iPointMenuItemEidt&type=IniMenuCate&sid=' + Sys.sid,
			            params: { CateId: CateId, Ids: Ids },
			            success: function (response, opts) {
			                var obj = Ext.decode(response.responseText);
			                Ext.Msg.alert('提示', obj.msg);
			                win_iMenuCateAddiPointMenuItem.hide();
			                store_iMenuCate.load();
			            },
			            failure: function (response, opts) {
			                var obj = Ext.decode(response.responseText);
			                Ext.Msg.alert('提示', obj.msg);
			            }
			        });
			    }
			}
		]
    });

    //**************子类**************//	

    var store_iPointMenuItem = new Ext.data.JsonStore({
        url: '../Apis/AuthMgr.aspx?actionName=ShowiPointMenuItem&type=IniPointMenuItem&sid=' + Sys.sid,
        root: 'results',
        fields: [
			{ name: 'Id' },
			{ name: 'Code' },
			{ name: 'Title' },
			{ name: 'Url' },
			{ name: 'ShowType' },
			{ name: 'MemoInfo' },
		]
    });

    var Form_iPointMenuItem = new Ext.form.FormPanel({

        reader: new Ext.data.JsonReader({
            root: 'results',
            fields: [
				{ name: 'Code' },
				{ name: 'Title' },
				{ name: 'Url' },
				{ name: 'ShowType' },
				{ name: 'MemoInfo' },
			]
        }),

        frame: true,
        autoFill: true,
        height: 400,
        border: false,
        layout: 'anchor',
        labelWidth: 60,
        labelAlign: 'right',
        style: 'margin:1em;',
        items: [
			{
			    layout: 'column',
			    style: 'margin-top:1em;margin-left:1em;',
			    items: [
					{
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'Code',
							    fieldLabel: '编号',
							    allowBlank: false,
							    blankText: '编号为必填项',
							    anchor: '99%'
							}
						]
					}, {
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'Title',
							    fieldLabel: '名称',
							    allowBlank: false,
							    blankText: '名称为必填项',
							    anchor: '99%'
							}
						]
					}
				]
			},
			{
			    layout: 'column',
			    style: 'margin-left:1em;',
			    items: [
					{
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'Url',
							    fieldLabel: 'Url',
							    allowBlank: false,
							    blankText: 'Url为必填项',
							    anchor: '99%'
							}
						]
					}, {
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							{
							    xtype: 'combo',
							    name: 'ShowType',
							    fieldLabel: '显示方式',
							    triggerAction: 'all',
							    editable: false,
							    mode: 'local',
							    store: new Ext.data.ArrayStore({
							        fields: ["myId", "displayText"],
							        data: [[0, 'window'], [1, 'panel']]
							    }),
							    valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '99%',
							    allowBlank: false,
							    blankText: '显示方式为必填项'
							}
						]
					}, {
					    columnWidth: 0.2,
					    items: [
							{
							    xtype: 'button',
							    text: '保存',
							    width: 70,
							    listeners: {
							        'click': function () {
							            if (Edit_Save == true) {
							                Form_iPointMenuItem.getForm().submit({
							                    url: '../Apis/AuthMgr.aspx?actionName=iPointMenuItemEidt&type=IniPointMenuItem&sid=' + Sys.sid,
							                    params: { iPointMenuItemId: iPointMenuItemId },
							                    success: function (form, action) {
							                        Ext.Msg.alert('提示', action.result.msg);
							                        if (action.result.success == true) {
							                            Form_iPointMenuItem.getForm().reset();
							                            store_iPointMenuItem.load();
							                        }
							                    },
							                    failure: function (form, action) {
							                        Ext.Msg.alert('提示', action.result.msg);
							                    }
							                });
							            } else if (Edit_Save == false) {
							                Form_iPointMenuItem.getForm().submit({
							                    url: '../Apis/AuthMgr.aspx?actionName=AddiPointMenuItem&sid=' + Sys.sid,
							                    params: { iPointMenuItemId: iPointMenuItemId },
							                    success: function (form, action) {
							                        Ext.Msg.alert('提示', action.result.msg);
							                        if (action.result.success == true) {
							                            Form_iPointMenuItem.getForm().reset();
							                            store_iPointMenuItem.load();
							                        }
							                    },
							                    failure: function (form, action) {
							                        if (action.result != null) {
							                            Ext.Msg.alert('提示', action.result.msg);
							                        }
							                    }
							                });
							            }
							            Edit_Save = false;
							            iPointMenuItemId = 0;
							        }
							    }
							}
						]
					}
				]
			},
			{
			    layout: 'column',
			    style: 'margin-left:1em;',
			    items: [
					{
					    layout: 'form',
					    columnWidth: 0.8,
					    items: [
							{
							    xtype: 'textfield',
							    name: 'MemoInfo',
							    fieldLabel: '备注',
							    anchor: '99%'
							}
						]
					},
					{
					    columnWidth: 0.2,
					    items: [
							{
							    xtype: 'button',
							    text: '取消修改',
							    width: 70,
							    listeners: {
							        'click': function () {
							            Form_iPointMenuItem.getForm().reset();
							            Edit_Save = false;
							            iPointMenuItemId = 0;
							        }
							    }
							}
						]
					}
				]
			},
			{
			    layout: 'column',
			    style: 'margin-left:1em;',
			    items: [
					{
					    columnWidth: 0.95,
					    height: 250,
					    autoScroll: true,
					    style: 'margin-top:1em;margin-left:1em;border:1px gray solid;',
					    items: [
							 new Ext.grid.GridPanel({
							     anchor: '100%',
							     autoHeight: true,
							     store: store_iPointMenuItem,
							     stripeRows: true,
							     cm: new Ext.grid.ColumnModel({
							         defaults: {
							             sortable: true // columns are not sortable by default           
							         },
							         columns: [
										new Ext.grid.RowNumberer(),
										{ dataIndex: 'Code', header: '编号', width: 70 },
										{ dataIndex: 'Title', header: '名称', width: 100 },
										{ dataIndex: 'Url', header: 'Url', width: 100 },
										{ dataIndex: 'ShowType', header: '显示方式', width: 70 },
										{ dataIndex: 'MemoInfo', header: '备注', width: 100 },
										{
										    header: '操作',
										    renderer: showbutton_iPointMenuItemEdit
										}
									]
							     })
							 })
						]
					}
				]
			}
		]
    });

    //子窗口（小类-子菜单-iPointMenuItem）
    var win_iPointMenuItem = new Ext.Window({
        title: '子类维护',
        width: 680,
        height: 450,
        modal: true,
        closeAction: 'hide',
        items: [
			Form_iPointMenuItem
		],
        listeners: {
            'hide': function () {
                Form_iPointMenuItem.getForm().reset();
                iPointMenuItemId = 0;
                Edit_Save = false;
            }
        }
    });

    //修改子类和删除子类的按钮
    function showbutton_iPointMenuItemEdit(value, metadata, record, rowIndex, columnIndex, store) {
        window.DeliPointMenuItem = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            iPointMenuItemId = rowNum.get('Id');
            Ext.Msg.confirm('提示', '确定删除该子类？可能无法恢复！', function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: '../Apis/AuthMgr.aspx?actionName=Del&dotype=DeliPointMenuItem&sid=' + Sys.sid,
                        params: { iPointMenuItemId: iPointMenuItemId },
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert('提示', obj.msg);
                            if (obj.success == true) {
                                store_iPointMenuItem.load();
                            }
                        },
                        failure: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert('提示', obj.msg);
                        }
                    });
                }
            });
        };
        window.EditiPointMenuItem = function (rowIndex) {
            var rowNum = store.getAt(rowIndex);
            iPointMenuItemId = rowNum.get('Id');
            Form_iPointMenuItem.load({
                url: '../Apis/AuthMgr.aspx?actionName=ShowiPointMenuItem&type=IniPointMenuItem&sid=' + Sys.sid,
                params: { iPointMenuItemId: iPointMenuItemId }
            });
            Edit_Save = true;
        };
        var resultStr = "<a href='#' onclick='EditiPointMenuItem(" + rowIndex + ")'>修改</a> &nbsp; <a href='#' onclick='DeliPointMenuItem(" + rowIndex + ")'>删除</a>";
        return resultStr;
    }




    //将主窗体加载到首页中
    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [pan_top_search]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -100',
            items: [grid_iMenuCate]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();

});