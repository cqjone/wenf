/************  Task 页面  ************/
Ext.onReady(function () {

    var store_Task = new Ext.data.JsonStore({
        url: '../Apis/TaskMgr.aspx?actionName=searTask&sid=' + Sys.sid,
        root: 'results',
        totalProperty: 'totalCount',
        fields: ['Id', 'Code', 'Title', 'Params', 'Type', 'ToDept',
		{ name: 'IsCompleted', convert: function (val) { if (val == '1') { return '已执行' } else { return '未执行' } } },
		{ name: 'CreateDate', convert: ConvertJSONDateToJSDateObject_DateTime}],
        listeners: {
            'beforeload': function (thStore, op) {
                thStore.baseParams = Form_Task.getForm().getValues();
                thStore.baseParams.start = 0;
                thStore.baseParams.limit = 25;
            }
        }
    });

    var store_Dept = new Ext.data.JsonStore({
        url: '../Apis/TaskMgr.aspx?actionName=getDept&sid=' + Sys.sid,
        root: "results",
        totalProperty: 'totalCount',
		fields: ['Id', 'DeptCode', 'DeptName',
			{
				name:'DeptStatus',
				convert:DeptStatus
			}
		],
        listeners: {
            'beforeload': function (thStore, op) {
                thStore.baseParams = Form_searDept.getForm().getValues();
            }
        }
    });

    var Form_Task = new Ext.form.FormPanel({
        labelWidth: 65,
        labelAlign: 'right',
        items: [{
            xtype: 'fieldset',
            title: '查询条件',
            height: 100,
            layout: 'column',
            items: [
			{
			    layout: 'form',
			    columnWidth: 0.3,
			    items: [
					{
					    xtype: 'textfield',
					    fieldLabel: '任务编号',
					    name: 'TCode',
					    anchor: '100%'
					},
					{
					    xtype: 'datefield',
					    fieldLabel: '生成时间',
					    name: 'TDateBegin',
					    format: 'Y-m-d H:i:s',
					    value: (new Date()).format('Y-m-d 00:00:00'),
					    anchor: '100%'
					}
				]
			},
			{
			    layout: 'form',
			    columnWidth: 0.3,
			    items: [
					{
					    xtype: 'textfield',
					    fieldLabel: '任务名称',
					    name: 'TTitle',
					    anchor: '100%'
					},
					{
					    xtype: 'datefield',
					    fieldLabel: '至',
					    name: 'TDateEnd',
					    format: 'Y-m-d H:i:s',
					    value: (new Date()).format('Y-m-d 23:59:59'),
					    anchor: '100%'
					}
				]
			},
			{
				layout:'form',
				columnWidth:0.2,
				items:[combo_DeptStatus],
				buttons:[
					{
						text: '查询',
						anchor: '40%',
						handler: function () {
							store_Task.load();
						}
					},
					{
						text: '新增',
						anchor: '40%',
						style:'margin-left:10px;',
						handler: function () {
							winDow_newTask.show();
						}
					}
				]
			}
			]
        }]
    });

    var Grid_Task = new Ext.grid.GridPanel({
        store: store_Task,
        loadMask: true,
        stripeRows: true,
        cm: new Ext.grid.ColumnModel({
            defaults: { sortable: true },
            columns: [
			new Ext.grid.RowNumberer(),
			{ dataIndex: 'CreateDate', header: '任务生成时间', width: 120 },
			{ dataIndex: 'Code', header: '任务编号' },
			{ dataIndex: 'Title', header: '任务名称' },
			{ dataIndex: 'Type', header: '任务类型' },
			{ dataIndex: 'ToDept', header: '目标门店' },
			{ dataIndex: 'IsCompleted', header: '执行状态' },
			{ dataIndex: 'Params', header: '任务参数', width: 300 }
		]
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: store_Task,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
            emptyMsg: "没有记录"
        })
    });

    Grid_Task.on('rowdblclick', function (thGrid, rowIndex, e) {
        var record = store_Task.getAt(rowIndex);
        Form_TaskInfo.find('name', 'CreateDate')[0].setValue(record.get('CreateDate'));
        Form_TaskInfo.find('name', 'TCode')[0].setValue(record.get('Code'));
        Form_TaskInfo.find('name', 'TTitle')[0].setValue(record.get('Title'));
        Form_TaskInfo.find('name', 'ToDept')[0].setValue(record.get('ToDept'));
        Form_TaskInfo.find('name', 'TType')[0].setValue(record.get('Type'));
        Form_TaskInfo.find('name', 'Params')[0].setValue(record.get('Params'));
        winDow_TaskInfo.show();
    });

    var Form_newTask = new Ext.form.FormPanel({
        frame: true,
        labelWidth: 65,
        labelAlign: 'right',
        layout: 'column',
        items: [
		{
		    layout: 'form',
		    columnWidth: 1,
		    items: [
				{
				    xtype: "textfield",
				    fieldLabel: '任务编号',
				    name: 'TCode',
				    allowBlank: false,
				    anchor: '100%'
				},
				{
				    xtype: "combo",
				    fieldLabel: '任务类型',
				    name: 'TType',
				    triggerAction: 'all',
				    editable: false,
				    mode: 'local',
				    store: new Ext.data.ArrayStore({
				        fields: ['myId', 'displayText'],
				        data: [[0, 'SQL']]
				    }),
				    value: 0,
				    valueField: 'myId',
				    displayField: 'displayText',
				    allowBlank: false,
				    anchor: '100%'
				}
			]
		},
		{
		    layout: 'form',
		    columnWidth: 1,
		    items: [
				{
				    xtype: "textfield",
				    fieldLabel: '任务名称',
				    name: 'TTitle',
				    allowBlank: false,
				    anchor: '100%'
				}
			]
		},
		{
		    layout: 'form',
		    columnWidth: 1,
		    items: [{
		        xtype: 'textarea',
		        fieldLabel: 'Sql',
		        name: 'TParams',
		        allowBlank: false,
		        anchor: '100%'
		    }]
		}
	]
    });

    var winDow_newTask = new Ext.Window({
        title: '新增任务',
        width: 600,
        height: 225,
        closeAction: 'hide',
        modal: true,
        items: [Form_newTask],
        buttons: [
		{
		    text: '选择门店',
		    handler: function () {
		        winDept.show();
		    }
		},
		{
		    text: '保存',
		    handler: SaveNewTask
		},
		{
		    text: '取消',
		    handler: function () {
		        winDow_newTask.hide();
		    }
		}
	],
        listeners: {
            'hide': function (th) {
                store_Dept.removeAll();
                Form_newTask.getForm().reset();
            }
        }
    });
    function SaveNewTask(thBtn) {
        if (Form_newTask.getForm().isValid()) {
            var TCode = Form_newTask.find('name', 'TCode')[0].getValue();
            var TTitle = Form_newTask.find('name', 'TTitle')[0].getValue();
            var TParams = Form_newTask.find('name', 'TParams')[0].getValue();
            var selectedDepts = Grid_Dept.getSelectionModel().getSelections();
            if (selectedDepts.length == 0) {
                Ext.Msg.alert('提示', '请选择门店！');
                return false;
            }
            var DeptIds = '';
			if (selectedDepts.length == store_Dept.getTotalCount()) {
                DeptIds = "0";
            } else {
                for (var i = 0; i < selectedDepts.length; i++) {
                    DeptIds += selectedDepts[i].get('Id') + ',';
                }
            }
            Ext.Msg.confirm('提醒', '是否保存？', function (btn) {
                if (btn == 'yes') {
                    thBtn.setText('保存中...');
                    thBtn.setDisabled(true);
                    Ext.Ajax.request({
                        url: '../Apis/TaskMgr.aspx?actionName=newTask&sid=' + Sys.sid,
                        params: { TCode: TCode, TTitle: TTitle, TParams: TParams, DeptIds: DeptIds },
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert('提示', obj.msg, function () {
                                winDow_newTask.hide();
                            });
                            thBtn.setText('保存');
                            thBtn.setDisabled(false);
							store_Task.reload();
                        },
                        failure: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert('提示', obj.msg, function () {
                                winDow_newTask.hide();
                            });
                            thBtn.setText('保存');
                            thBtn.setDisabled(false);
                        }
                    });
                }
            });
        }
    }


    var Form_TaskInfo = new Ext.form.FormPanel({
        frame: true,
        labelWidth: 65,
        labelAlign: 'right',
        layout: 'column',
        items: [
		{
		    layout: 'form',
		    columnWidth: 0.5,
		    items: [
				{
				    xtype: "textfield",
				    fieldLabel: '任务编号',
				    name: 'TCode',
				    readOnly: true,
				    anchor: '100%'
				},
				{
				    xtype: "textfield",
				    fieldLabel: '任务类型',
				    name: 'TType',
				    readOnly: true,
				    anchor: '100%'
				}
			]
		},
		{
		    layout: 'form',
		    columnWidth: 0.5,
		    items: [
				{
				    xtype: "textfield",
				    fieldLabel: '任务名称',
				    name: 'TTitle',
				    readOnly: true,
				    anchor: '100%'
				},
				{
				    xtype: "textfield",
				    fieldLabel: '目标门店',
				    name: 'ToDept',
				    hiddenName: 'ToDeptId',
				    readOnly: true,
				    anchor: '100%'
				}
			]
		},
		{
		    layout: 'form',
		    columnWidth: 1,
		    items: [{
		        xtype: 'textfield',
		        fieldLabel: '生成时间',
		        name: 'CreateDate',
		        readOnly: true,
		        anchor: '100%'
		    }]
		},
		{
		    layout: 'form',
		    columnWidth: 1,
		    items: [{
		        xtype: 'textarea',
		        fieldLabel: 'Sql',
		        name: 'Params',
		        readOnly: true,
		        anchor: '100%'
		    }]
		}
	]
    });

    var winDow_TaskInfo = new Ext.Window({
        title: '任务详细',
        width: 600,
        height: 225,
        closeAction: 'hide',
        modal: true,
        items: [Form_TaskInfo],
        buttons: [
		{
		    text: '关闭',
		    handler: function () {
		        winDow_TaskInfo.hide();
		    }
		}
	]
    });

    var Form_searDept = new Ext.form.FormPanel({
        frame: true,
        labelWidth: 60,
        labelAlign: 'right',
        //height: 100,
        layout: 'column',
        items: [
		{
		    layout: 'form',
		    columnWidth: 0.5,
		    items: [{
		        xtype: "textfield",
		        fieldLabel: '门店编号',
		        name: 'DeptCode',
		        anchor: '100%'
		    },combo_DeptStatus]
		},
		{
		    layout: 'form',
		    columnWidth: 0.5,
		    items: [{
		        xtype: "textfield",
		        fieldLabel: '门店名称',
		        name: 'DeptTitle',
		        anchor: '100%'
		    }],
			buttons:[{
				text: '查询',
		        anchor: '100%',
		        handler: function () {
		            store_Dept.load();
		        }
			}]
		}
	]
    });

    var sm_Dept = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
    var Grid_Dept = new Ext.grid.GridPanel({
        store: store_Dept,
        loadMask: true,
        height: 300,
        sm: sm_Dept,
        cm: new Ext.grid.ColumnModel({
            defaults: { sortable: true },
            columns: [
			sm_Dept,
			{ dataIndex: 'Id', hidden: true },
			{ dataIndex: 'DeptName', header: '门店名称', width: 140 },
			{ dataIndex: 'DeptStatus', header: '门店状态', width: 140 }
		]
        })
    });

    var winDept = new Ext.Window({
        title: '选择门店',
        width: 500,
        height: 445,
        modal: true,
        closeAction: 'hide',
        items: [Form_searDept, Grid_Dept],
        buttons: [{
            text: '确定',
            handler: function () {
                winDept.hide();
            }
        }]
    });

    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_Task]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -120',
            items: [Grid_Task]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});