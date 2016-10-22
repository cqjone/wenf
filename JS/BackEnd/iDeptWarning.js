//门店到期提醒
//根据门店提醒的id来查找该提醒下的提醒人和门店
var ID = 0;

function ConvertJSONDateToJSDateObject(JSONDateString) {
    try {
        var date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10));
        return date.format('Y-m-d');
    } catch (e) {
        return JSONDateString;
    }
}
var warningStore = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/iDeptWarning.aspx?actionName=getDepWarning&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{ name: "WarningTitle", mapping: "WarningTitle" },
        { name: "StartTime", mapping: "StartTime", convert: ConvertJSONDateToJSDateObject },
        { name: "Action", mapping: "Action" },
        { name: "ID", mapping: "ID" },
        { name: "AllDept", mapping: "AllDept" },
        { name: "EndTime", mapping: "EndTime", convert: ConvertJSONDateToJSDateObject}]
    })
});

var people = Ext.data.Record.create([
          { name: "ID", mapping: "ID" },
          { name: "Title", mapping: "Title" },
        { name: "Mobile", mapping: "Mobile" },
        { name: "MemoInfo", mapping: "MemoInfo" }
    ]);
        var peopleStore = new Ext.data.GroupingStore({
            url: '../Apis/iDeptWarning.aspx?actionName=getPeople&sid=' + Sys.sid,
            reader: new Ext.data.JsonReader({
                fields: people,
                root: 'data'
            }),
            autoLoad: false
        });


        var warningForm = new Ext.form.FormPanel({
            bodyBorder: false,
            border: false,
            autoScroll: true,
            heigh: 100,
            items: [
        {
            xtype: "fieldset",
            defaults: { labelAlign: "right", width: 80 },
            layout: "column",
            items: [
            {
                xtype: "button",
                width: 70,
                style: 'margin-left:2em;',
                text: "相关人",
                handler: function () {
                    windowPeople.show();
                    peopleStore.load();
                }
            }, {
                xtype: "button",
                width: 70,
                style: 'margin-left:2em;',
                text: "添加提醒",
                handler: function () {
                ID="";
                    AddWarningpeoplestore.removeAll();
                    AddDeptStore.removeAll();
                    AddWarningForm.find("name", "InOrUp")[0].setValue();
                    AddWarningForm.find("name", "Title")[0].setValue();
                    AddWarningForm.find("name", "StartTime")[0].setValue();
                    AddWarningForm.find("name", "EndTime")[0].setValue();
                    AddWarningForm.find("name", "MemoInfo")[0].setValue();
                    AddWarningForm.find("name", "PeopleTitle")[0].setValue();
                    AddWarningForm.find("name", "DeptTitle")[0].setValue();
                    AddWarningForm.find("name", "Action")[0].setValue();
                    windowWarning.show();
                }
            }, {
                xtype: "button",
                width: 70,
                style: 'margin-left:2em;',
                text: "删除提醒",
                handler: function () {
                    var selections = warningGrid.selModel.getSelections();
                    var records = warningGrid.getSelectionModel().getSelections();
                    var deletedIds = "";
                    for (var i = 0, n = records.length; i < n; i++) {
                        deletedIds += records[i].data.ID + ',';
                    }
                    if (deletedIds.length > 0) {
                        Ext.Msg.confirm('提示', '是否确定删除选择的记录？', function (btn) {
                            if (btn == 'yes') {
                                Ext.each(selections, function (item) {
                                    Ext.Ajax.request({
                                        url: '../Apis/iDeptWarning.aspx?actionName=delManyWarning&sid=' + Sys.sid,
                                         params: { deletedIds: deletedIds },
                                        success: function (response, opts) {
                                            var obj = Ext.util.JSON.decode(response.responseText);
                                            Ext.MessageBox.alert("提醒", obj.msg);
                                             warningStore.remove(item);
                                             warningStore.removed.push(item);
                                        },
                                        failure: function (response, opts) {
                                        var obj = Ext.util.JSON.decode(response.responseText);
                                            Ext.Msg.alert('错误', obj.msg);
                                        }
                                    });
                                });
                            }
                        });
                    }
                    else {
                        Ext.Msg.alert('提示', '你还没有选择要操作的记录！');
                    }
                }
            }
        ]
        }
    ]
        });
    var smwarning = new Ext.grid.CheckboxSelectionModel();
    var cm = new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns: [//new Ext.grid.RowNumberer(),
        smwarning,
    {
        header: 'ID',
        dataIndex: 'ID',
        ID: "ID",
        hidden: true,
        width: 100
    }, {
        header: '提醒名称',
        dataIndex: 'WarningTitle',
        width: 100
    },
    {
        header: '开始日期',
        dataIndex: 'StartTime',
        width: 100
    }, {
        header: "结束日期",
        dataIndex: "EndTime",
        width: 100
    }, {
        header: "是否启用",
        dataIndex: "Action"
    }
    , {
        header: "操作",
        renderer: doAction,
        width: 200
    }
    ]
});
var smPeople = new Ext.grid.CheckboxSelectionModel();
var checkmodel = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
var PeopleGrid = new Ext.grid.GridPanel({
    store: peopleStore,
    autoScroll: true,
    selModel: checkmodel,
    width: 400,
    height: 300,
    stripeRows: true,
    region: 'center',
    margins: '0 5 5 5',
  //  plugins: [editorp],
    view: new Ext.grid.GroupingView({
        markDirty: false
    }),
    tbar: [{
        iconCls: 'silk-add',
        text: '添加',
        handler: function () {
            var e = new people({
                Title: '',
                Mobile: '',
                MemoInfo: ''
            });
            editorp.stopEditing();
            peopleStore.insert(0, e);
            PeopleGrid.getView().refresh();
            PeopleGrid.getSelectionModel().selectRow(0);
            editorp.startEditing(0);
        }
    }, {
        ref: '../removeBtn',
        iconCls: 'silk-delete',
        text: '删除',
        handler: function () {
            PeopleGrid.stopEditing();

            var s = PeopleGrid.getSelectionModel().getSelections();
         
            var id = PeopleGrid.getSelectionModel().getSelected().get("ID");
            Ext.Ajax.request({
                params: { id: id },
                url: '../Apis/iDeptWarning.aspx?actionName=delPeople&sid=' + Sys.sid,
                success: function (response, opts) {
                   // var obj = Ext.util.JSON.decode(response.responseText);
                    Ext.MessageBox.alert("成功", "操作成功！");
                },
                failure: function (response, opts) {
                  //  var obj = Ext.util.JSON.decode(response.responseText);
                    Ext.Msg.alert('错误', "操作失败");
                }
            });

            for (var i = 0, r; r = s[i]; i++) {
                peopleStore.remove(r);
            }
        }
    }, {
        text: '保存',

        iconCls: 'silk-add'
    }],
    columns: [
    checkmodel,
        {
        header: '编号',
        hidden: true,
        dataIndex: 'ID', sortable: true,
        editor: { xtype: 'textfield' }
    },
        {
            header: '姓名',
            dataIndex: 'Title', sortable: true,
            editor: { xtype: 'textfield', allowBlank: false }
        }, {
            header: '手机号码',
            dataIndex: 'Mobile', sortable: true,
            editor: { xtype: 'textfield' }
        }, {
            header: '备注',
            dataIndex: 'MemoInfo', sortable: true,
            editor: { xtype: 'textfield' }
        }
        ]
});  
    var warningGrid = new Ext.grid.GridPanel({
        store: warningStore,
        autoScroll:true,
        cm: cm,
        margins: "2 2 2 2",
        border: false,
        stripeRows: true,
        sm: smwarning,
        selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }),
        loadMask: true
    });

     var upInfo = '';
     var newInfo = '';
     var pnlgoods_GPrice = new Ext.Panel({
         width: '99%',
         frame: true,
         height: 300,
         layout: 'fit',
         items: [
			{
			    xtype: 'panel',
			    layout: 'fit',
			    items: [{
			        xtype: 'editorgrid',
			        id: 'editor',
			        sm: checkmodel,
			        store: peopleStore,
			        clicksToEdit: 1,
			        cm: new Ext.grid.ColumnModel(
						{
						    defaults: {
						        sortable: true
						    },
						    columns: [
								new Ext.grid.RowNumberer(),
								checkmodel,
								{ dataIndex: 'ID', header: '编号', hidden: true },
								{ dataIndex: 'Title', header: '姓名',
								    editor: new Ext.form.TextField({
								        allowBlank: false,
								        style: 'text-align:left'
								    })
								},
                                { dataIndex: 'Mobile', header: '手机号码',
                                    editor: new Ext.form.TextField({
                                        style: 'text-align:left'
                                    })
                                },
								{ dataIndex: 'MemoInfo', header: '备注',
								    editor: new Ext.form.TextField({
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
						        var e = new people({
						            Title: '',
						            Mobile: '',
						            MemoInfo: ''
						        });

						        peopleStore.insert(0, e);


						    }
						},
						{
						    xtype: 'button',
						    text: '删除',
						    iconCls: 'silk-delete',
						    handler: function () {
						        var selects = checkmodel.getSelections();
						        var count = selects.length;
						        var delID = "";
						        if (count > 0) {
						            Ext.Msg.confirm('提示', '是否确定删除选择的信息？', function (btn) {
						                if (btn == 'yes') {
						                    for (var i = 0; i < count; i++) {
						                        var record = selects[i];
						                        if (record.get('ID') != undefined && record.get('ID') != '') {
						                            delID += record.get('ID') + ',';
						                        }
						                        peopleStore.remove(record);
						                        peopleStore.getModifiedRecords().remove(record);
						                    }
						                    Ext.Ajax.request({
						                        params: { delID: delID },
						                        url: '../Apis/iDeptWarning.aspx?actionName=delPeoples&sid=' + Sys.sid,
						                        success: function (response, opts) {
						                             var obj = Ext.util.JSON.decode(response.responseText);
						                             Ext.Msg.alert('提示', obj.msg);
						                            // warningStore.reload();
						                        },
						                        failure: function (response, opts) {
						                              var obj = Ext.util.JSON.decode(response.responseText);
						                              Ext.Msg.alert('提示', obj.msg);
						                        }
						                    });
						                }
						            });
						        }
						    }
						}, {
						    xtype: 'button',
						    text: '保存',
						    iconCls: 'silk-add',
						    handler: function () {
						        var Modify = peopleStore.getModifiedRecords();
						        upInfo = '';
						        newInfo = '';
						        for (var i = 0; i < Modify.length; i++) {
						            var record = Modify[i];
						            if (record.data['ID'] != undefined && record.data['ID'] != '') {
						                upInfo += record.data["ID"] + ',' + record.data['Title'] + ',' + record.data['Mobile'] + ',' + record.data['MemoInfo'] + ',' + '-';

						            } else {
						                if (record.data["Title"] != "") {
						                    newInfo += record.data["Title"] + ',' + record.data['Mobile'] + ',' + record.data['MemoInfo'] + '-';
						                }
						                else {
						                    Ext.Msg.alert('保存失败', '姓名不能为空！');
						                    // peopleStore.remove(Modify);
						                    return;
						                }
						            }
						        }
						        if (Modify != "") {
						            Ext.Ajax.request({
						                url: '../Apis/iDeptWarning.aspx?actionName=AddPeople&sid=' + Sys.sid,
						                params: { upInfo: upInfo, newInfo: newInfo },
						                success: function (response, opts) {
						                    var obj = Ext.util.JSON.decode(response.responseText);
						                    Ext.Msg.alert('提示', obj.msg);
						                    upInfo = '';
						                    newInfo = '';
						                    peopleStore.commitChanges();
						                    peopleStore.reload();
						                },
						                failure: function (response, opts) {
						                    Ext.Msg.alert('错误', '操作失败')
						                }
						            });
						        }
						    }
						}
					]
			    }]
			}
		]
     });


    var PeopleForm = new Ext.form.FormPanel({
        bodyBorder: false,
        border: false,
        autoScroll: true,
        heigh: 100,
        frame: true,
        items: [ {
            layout: 'fit',
            items: [PeopleGrid]
        }
        ]
    });
    var InOrUp="";
    var AddWarningForm = new Ext.form.FormPanel({
        frame: true,
        labelWidth: 50,
        layout: "column",
        labelAlign: 'right',
        reader: new Ext.data.JsonReader({
            fields: [
        { name: "ID", mapping: "ID" },
        { name: "StartTime", mapping: "StartTime", convert: ConvertJSONDateToJSDateObject },
         { name: "EndTime", mapping: "EndTime", convert: ConvertJSONDateToJSDateObject },
         { name: "MemoInfo", mapping: "MemoInfo" },
            //          { name: "PeopleTitle", mapping: "PeopleTitle" },
            //        { name: "DeptTitle", mapping: "DeptTitle" },
        {name: "Title", mapping: "Title" },
        { name: "Action", mapping: "Action" },
        { name: "MemoInfo", mapping: "MemoInfo"}]
        }),
        items: [{
            layout: "form",
            columnWidth: 0.32,
            items: [{
                xtype: "textfield",
                fieldLabel: "名称",
                name: "Title",
                allowBlank: false,
                anchor: "98%"
            }, {
                xtype: 'hidden',
                name: 'ID'
            }]
        }, {
            layout: "form",
            columnWidth: 0.32,
            items: [{
                xtype: "datefield",
                fieldLabel: "日期(从)",
                allowBlank: false,
                format: 'Y-m-d',
                name: "StartTime",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.32,
            items: [{
                xtype: "datefield",
                fieldLabel: "到",
                format: 'Y-m-d',
                allowBlank: false,
                name: "EndTime",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.96,
            items: [{
                xtype: "textfield",
                fieldLabel: "备注",
                name: "MemoInfo",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.86,
            items: [{
                xtype: "textfield",
                fieldLabel: "提醒人",
                readOnly: true,
                name: "PeopleTitle",
                anchor: "97%"
            }, {
                xtype: 'hidden',
                name: 'PeoplesID'
            }]
        }, {
            layout: "form",
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                width: 50,
                text: "提醒人",
                handler: function () {
                    if (ID != "") {
                        AddWarningpeoplestore.load({
                            params: { ID: ID }
                        });
                    }
                    AddWarningPeopleWind.show();
                    sPeople.removeAll();
                }
            }]
        }, {
            layout: "form",
            columnWidth: 0.86,
            items: [{
                xtype: "textfield",
                fieldLabel: "门店",
                readOnly: true,
                name: "DeptTitle",
                anchor: "97%"
            }, {
                xtype: 'hidden',
                name: 'DeptsID'
            }]
        }, {
            layout: "form",
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                width: 50,
                text: "门  店",
                handler: function () {

                    if (ID != "") {
                        AddDeptStore.load({
                            params: { ID: ID }
                        });
                    }
                    var chTitle = AddWarningForm.find("name", "DeptTitle")[0].getValue();
                    if (chTitle == "全部门店") {
                        Ext.getCmp("chbox").setValue(true);
                    }
                    else {
                        Ext.getCmp("chbox").setValue(false);
                    }
                    AddDeptWind.show();
                }
            }]
        }, {
            layout: "form",
            columnWidth: 0.86,
            items: [{
                xtype: "checkbox",
                fieldLabel: "启用",
                name: "Action",
                anchor: "97%"
            }, {
                xtype: 'hidden',
                name: "InOrUp"
            }]
        }, {
            layout: "form",
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                width: 50,
                text: "保  存",
                handler: function () {
                    if (AddWarningForm.getForm().isValid()) {
                        AddWarningForm.getForm().submit({
                            waitMsg: "正在提交，请稍候...",
                            url: "../Apis/iDeptWarning.aspx?actionName=SubmitWarning&sid=" + Sys.sid,
                            params: { PersonID: PeopleIDs, DeptID: DeptIDs, AllDept: AllDept },
                            success: function (form, action) {
                                Ext.MessageBox.alert("提醒", action.result.msg);
                                windowWarning.hide();
                                AddWarningpeoplestore.removeAll();
                                AddDeptStore.removeAll();
                                warningStore.reload();
                                DeptIDs = "";
                                PeopleIDs = "";
                            },
                            failure: function (form, action) {
                                if (action != undefined && action.result != undefined) {
                                    Ext.MessageBox.alert("提醒", action.result.msg);
                                } else {
                                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                                }
                            }
                        });
                    }
                }
            }]
        }
        ]
    });


    var Warningpeople = Ext.data.Record.create([
          { name: "ID", mapping: "ID" },
          { name: "WarningpeopleTitle", mapping: "WarningpeopleTitle" },
        { name: "Mobile", mapping: "Mobile" }
    ]);
    var sm_AddWarningPeople = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });

    var AddWarningpeoplestore = new Ext.data.JsonStore({
        autoDestroy: true,
        remoteSort: true,
        url: '../Apis/iDeptWarning.aspx?actionName=getWarningPeople&sid=' + Sys.sid,
        fields: [
                { name: 'ID' },
				{ name: 'Mobile' },
				{ name: 'WarningpeopleTitle' }
				
			]
//        listeners: {
//            'load': function (store) {
//                var index = 0;
//                store.each(function (Info) {
//                    if (Info.data.Remindid != ID) {
//                        sm_AddWarningPeople.selectRow(index, true);        
//                    }
//                    index++;
//                });
//                  var selections = AddWarningpeopleGp.selModel.getSelections();
//                  Ext.each(selections, function (item) {
//                    AddWarningpeoplestore.remove(item);
//                    AddWarningpeoplestore.removed.push(item);           
//                    });
//            },
//        }
    });
   // var remindid = "";
    var AddWarningpeopleGp = new Ext.grid.GridPanel({
        store: AddWarningpeoplestore,
        stripeRows: true,
        autoScroll: true,
        width: 400,
        height: 300,
        region: 'center',
        margins: '0 5 5 5',
        sm: sm_AddWarningPeople,
        tbar: [{
            iconCls: 'silk-add',
            text: '添加',
            handler: function () {
                winAddWarningPeople.show();
                Selform.find("name", "Name")[0].setValue("");
                sPeople.removeAll();
            }
        }, {
            ref: '../removeBtn',
            iconCls: 'silk-delete',
            text: '删除',
            handler: function () {
                AddWarningpeopleGp.stopEditing();
                var s = AddWarningpeopleGp.getSelectionModel().getSelections();
                var deletedIds = "";
                for (var i = 0, n = s.length; i < n; i++) {
                    deletedIds += s[i].data.ID + ',';
                }
                if (s.length > 0) {
                    Ext.Msg.confirm('提示', '确定删除？', function (btn) {
                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: '../Apis/iDeptWarning.aspx?actionName=delWarningPeople&sid=' + Sys.sid,
                                params: { delID: deletedIds, remindid: ID },
                                success: function (response, opts) {
                                    var obj = Ext.util.JSON.decode(response.responseText);
                                    Ext.Msg.alert('提示', obj.msg);
                                    for (var i = 0, r; r = s[i]; i++) {
                                        AddWarningpeoplestore.remove(r);
                                    }
                                },
                                failure: function (response, opts) {
                                    Ext.Msg.alert('错误', '操作失败')
                                    //  sto.removeAt(0);
                                }
                            });

                        }
                    });
                }
            }
        }],
        columns: [new Ext.grid.RowNumberer(),
          sm_AddWarningPeople,
        {
            header: 'ID',
            dataIndex: 'ID',
            hidden: true

        }, {
            header: 'Remindid',
            hidden: true,
            dataIndex: 'Remindid'
        },
        {
            header: '姓名',
            dataIndex: 'WarningpeopleTitle'

        }, {
            header: '手机号码',
            dataIndex: 'Mobile'

        }
        ]
    });  
    var AddWarningPeopleForm = new Ext.form.FormPanel({
        bodyBorder: false,
        border: false,
        autoScroll: true,
        frame: true,
        items: [{
            layout: 'fit',
            items: [AddWarningpeopleGp]
        }
        ]
    });

    var UpdateWarningForm = new Ext.form.FormPanel({
        bodyBorder: false,
        border: false,
        autoScroll: true,
        frame: true,
        labelWidth: 80,
        layout: "column",
        labelAlign: 'right',
        items: [{
            layout: "form",
            columnWidth: 0.48,
            items: [{
                xtype: "textfield",
                fieldLabel: "提醒名称",
                name: "WarningTitle",
                anchor: "100%"
            }, {
                xtype: "datefield",
                fieldLabel: "结束日期",
                format: 'Y-m-d',
                name: "EndTime",
                anchor: "100%"
            }]
        }, {
            layout: 'form',
            columnWidth: 0.48,
            items: [{
                xtype: "datefield",
                fieldLabel: "开始日期",
                format: 'Y-m-d',
                name: "StartTime",
                anchor: "100%"
            }]
        }, {
            layout: 'form',
            columnWidth: 0.48,
            items: [{
                xtype: "combo",
                fieldLabel: "是否启用",
                name: "Action",
                triggerAction: 'all',
                editable: false,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    fields: ['myId', 'displayText'],
                    data: [['0', '是'], ['1', '否']]
                }),
                value: "是",
                valueField: 'myId',
                displayField: 'displayText',
                anchor: "100%"
            }, {
                xtype: 'hidden',
                name: 'ID'
            }]
        }], buttons: [{
            text: '保存',
            handler: function () {
                UpdateWarningForm.getForm().submit({
                    //  params: { ids: DepID },
                    waitMsg: "正在提交，请稍候...",
                    url: "../Apis/iDeptWarning.aspx?actionName=UpdateWarning&sid=" + Sys.sid,
                    success: function (form, action) {
                        Ext.MessageBox.alert("提醒", action.result.msg);
                        windowUpdate.hide();
                        warningStore.reload();
                    },
                    failure: function (form, action) {
                        if (action != undefined && action.result != undefined) {
                            Ext.MessageBox.alert("提醒", action.result.msg);
                        } else {
                            Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                        }
                    }
                });
            }

        }]
    });

    var AddDeptStore = new Ext.data.JsonStore({
        url: '../Apis/iDeptWarning.aspx?actionName=getDept&sid=' + Sys.sid,
        fields: [
				{ name: 'ID' },
                { name: 'Remindid' },
				{ name: 'LandLord' },
                { name: 'Title' },
				{ name: "RentBegin", mapping: "RentBegin", convert: ConvertJSONDateToJSDateObject },
                { name: "RentEnd", mapping: "RentEnd", convert: ConvertJSONDateToJSDateObject }
			],
        listeners: {
            'load': function (store) {
                var index = 0;
                store.each(function (Info) {
                    if (Info.data.Remindid != ID) {
                        sm_Dept.selectRow(index,true);
                    }
                    index++;
                });

                 var selections = AddDeptGp .selModel.getSelections();
                  Ext.each(selections, function (item) {
                    AddDeptStore .remove(item);
                    AddDeptStore.removed.push(item);           
                    });
            }
        }
    });


    var dept = Ext.data.Record.create([
          { name: "ID", mapping: "ID" },
          { name: "LandLord", mapping: "LandLord" },
          { name: "RentDate", mapping: "RentDate" },
          { name: "Title", mapping: "Title" }
    ]);

    var sm_Dept = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
    var AddDeptGp = new Ext.grid.GridPanel({
        store: AddDeptStore,
        autoScroll: true,
        stripeRows: true,
        width: 400,
        height: 300,
        region: 'center',
        sm: sm_Dept,
        margins: '0 5 5 5',
        tbar: [{
            iconCls: 'silk-add',
            text: '添加',
            handler: function () {
                winAddDeptInfo.show();
                SelformDeptInfo.find("name", "Code")[0].setValue("");
                SelformDeptInfo.find("name", "Title")[0].setValue("");

                sDeptInfo.removeAll();
            }
        }, {
            ref: '../removeBtn',
            iconCls: 'silk-delete',
            text: '删除',
            handler: function () {
                AddDeptGp.stopEditing();
                var s = AddDeptGp.getSelectionModel().getSelections();
                var delID = "";
                for (var i = 0; i < s.length; i++) {
                    delID += s[i].data.ID + ',';
                }
                if (s.length > 0) {
                    Ext.Msg.confirm('提示', '确定删除？', function (btn) {
                        if (btn == 'yes') {

                            Ext.Ajax.request({
                                url: '../Apis/iDeptWarning.aspx?actionName=delDept&sid=' + Sys.sid,
                                params: { delID: delID, remindid: ID },
                                success: function (response, opts) {
                                    var obj = Ext.util.JSON.decode(response.responseText);
                                    Ext.Msg.alert('提示', obj.msg);
                                    for (var i = 0, r; r = s[i]; i++) {
                                        AddDeptStore.remove(r);
                                    }
                                },
                                failure: function (response, opts) {
                                    Ext.Msg.alert('错误', '操作失败')

                                }

                            })


                        }
                    });
                }
            }
        }, {
            xtype: 'label',
            style: 'margin-left:2em;',
            text: '所有门店 '
        }, {
            xtype: "checkbox",
            id: "chbox",
            checked: false,
            name: "Action",
            anchor: "97%"
        }],
        columns: [new Ext.grid.RowNumberer(),
        sm_Dept,
        {
            header: 'ID',
            dataIndex: 'ID',
            hidden: true

        }, {
            header: 'Remindid',
            dataIndex: 'Remindid',
            hidden: true
        },
        {
            header: '门店名称',
            dataIndex: 'Title'

        }, {
            header: '房东姓名',
            dataIndex: 'LandLord'

        }, {
            header: '租赁日期',
            dataIndex: 'RentDate',
            renderer: function (v, m, record, ri, ci) { return record.data.c = "从" + record.data.RentBegin + "到" + record.data.RentEnd; },
            width: 200

        }
        ]
    });  
    var AddDeptForm = new Ext.form.FormPanel({
        bodyBorder: false,
        border: false,
        autoScroll: true,
        frame: true,
        items: [{
            layout: 'fit',
            items: [AddDeptGp]
        }
        ]
    });
    var sDeptInfo = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/iDeptWarning.aspx?actionName=getDeptInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{ name: "ID", mapping: "ID" },
        {name:"Code",mapping:'Code'},
        { name: "Title", mapping: "Title" },
        { name: "LandLord", mapping: "LandLord" },
        { name: "RentBegin", mapping: "RentBegin", convert: ConvertJSONDateToJSDateObject },
        { name: "RentEnd", mapping: "RentEnd", convert: ConvertJSONDateToJSDateObject }
        ]
    })
});
    var SelformDeptInfo = new Ext.form.FormPanel({
        frame: true,
        bodyBorder: false,
        border: false,
        autoScroll: true,
        labelAlign: 'right',
        labelWidth: 60,
        items: [{
            xtype: "fieldset",
            title: "查询条件",
            defaults: { labelAlign: "left" },
            layout: "column",
            items: [{
                layout: "form",
                bodyBorder: false,
                columnWidth: 0.4,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "门店编号",
                    name: "Code",
                    width: 300,
                    anchor: "96%"
                }]

            }, {
                layout: "form",
                bodyBorder: false,
                columnWidth: 0.4,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "门店名称",
                    name: "Title",
                    width: 300,
                    anchor: "96%"
                }]
            },{
                layout: "form",
                bodyBorder: false,
                columnWidth: 0.1,
                items: [{
                    xtype: "button",
                    text: "查询",
                    anchor: "100%",
                    handler: function () {
                        var code = SelformDeptInfo.find("name", "Code")[0].getValue();
                        var title = SelformDeptInfo.find("name", "Title")[0].getValue();
                        sDeptInfo.load({
                            params: {code:code, title: title }
                        });
                    }
                }]
            }]

        }]
    });
      var smDept = new Ext.grid.CheckboxSelectionModel();
    var gpDeptInfo = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 280,
    autoWidth: true,
    store: sDeptInfo,
    loadMask: true,
    stripeRows: true,
    sm: smDept,
    cm: new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns:
        [
        smDept, {
            header: 'ID',
            dataIndex: 'ID',
            hidden: true
        }, {
            header:'门店编号',
            dataIndex:'Code'
        },

     {
         header: '门店名称',
         dataIndex: 'Title'
     }
     ,
     {
         header: '房东姓名',
         dataIndex: 'LandLord'
     },
    {
        header: '租赁日期',
        dataIndex: 'RentDate',
        renderer: function (v, m, record, ri, ci) { return record.data.c ="从"+ record.data.RentBegin +"到"+ record.data.RentEnd; },
        width:180
    }
    ]
    })

});
    var sPeople = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/iDeptWarning.aspx?actionName=getPeopleInfo&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{ name: "ID", mapping: "ID" },
        {name:"Remindid",mapping:"Remindid"},
        { name: "WarningpeopleTitle", mapping: "WarningpeopleTitle" },
        { name: "Mobile", mapping: "Mobile" },
        { name: "MemoInfo", mapping: "MemoInfo" }]
    })
});
    var Selform = new Ext.form.FormPanel({
        frame: true,
        bodyBorder: false,
        border: false,
        autoScroll: true,
        labelAlign: 'right',
        labelWidth: 45,
        items: [{
            xtype: "fieldset",
            title: "查询条件",
            defaults: { labelAlign: "left" },
            layout: "column",
            items: [{
                layout: "form",
                bodyBorder: false,
                columnWidth: 0.65,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "姓名",
                    name: "Name",
                    width: 300,
                    anchor: "96%"
                }]

            }, {
                layout: "form",
                bodyBorder: false,
                columnWidth: 0.15,
                items: [{
                    xtype: "button",
                    text: "查询",
                    anchor: "100%",
                    handler: function () {
                        var title = Selform.find("name", "Name")[0].getValue();
                        sPeople.load({
                            params: { title: title }
                        });
                    }
                }]
            }]

        }]
    });
    var sm = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
var gpPeople = new Ext.grid.GridPanel({
    autoScroll: true,
    frame: true,
    height: 280,
    autoWidth: true,
    store: sPeople,
    loadMask: true,
    stripeRows: true,
    sm: sm,
    cm: new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns:
        [
        sm, {
            header: 'ID',
            dataIndex: 'ID',
            hidden: true
        }, {
            header:'Remindid',
            dataIndex: 'Remindid',
            hidden:true
        },

     {
         header: '姓名',
         dataIndex: 'WarningpeopleTitle'
     }
     ,
     {
         header: '手机号码',
         dataIndex: 'Mobile',
         width: 90

     },
    {
        header: '备注',
        dataIndex: 'MemoInfo'

    }
    ]
    })

});
    function doAction(value, metadata, record, rowIndex, columnIndex, store) {
        window.DelInfo = function (rowIndex) {
            var selections = warningGrid.selModel.getSelections();
            var s = warningGrid.getSelectionModel().getSelected().get("ID");
            Ext.Msg.confirm('提示', '确定删除？', function (btn) {
                if (btn == 'yes') {
                    Ext.each(selections, function (item) {
                        warningStore.remove(item);
                        warningStore.removed.push(item);
                        var delID = s;
                        Ext.Ajax.request({
                            params: { delID: delID },
                            url: '../Apis/iDeptWarning.aspx?actionName=delWarning&sid=' + Sys.sid,
                            success: function (response, opts) {
                                var obj = Ext.util.JSON.decode(response.responseText);
                                Ext.Msg.alert('提示', obj.msg);
                            },
                            failure: function (response, opts) {
                                Ext.Msg.alert('提示', obj.msg)

                            }
                        });
                    });
                }
            });
        };
        window.UpdateInfo = function (rowIndex) {
            windowWarning.show();
            var selections = warningGrid.selModel.getSelections();
            var s = warningGrid.getSelectionModel().getSelected().get("ID");
            var AllDept = warningGrid.getSelectionModel().getSelected().get("AllDept");
            var r = warningGrid.getStore().getAt(rowIndex);
            ID = r.get("ID");
            AddWarningForm.find('name', 'InOrUp')[0].setValue(ID);

            AddWarningForm.load({
                url: '../Apis/iDeptWarning.aspx?actionName=getWarningFormInfo&sid=' + Sys.sid,
                params: { ID: ID, AllDept: AllDept },
                waitMsg: "加载中.....",
                success: function (form, action) {
                    if (AddWarningForm.find('name', 'Action')[0].getValue() == '0') AddWarningForm.find("name", "Action")[0].setValue(true);
                    else if (AddWarningForm.find('name', 'Action')[0].getValue() == '1') AddWarningForm.find("name", "Action")[0].setValue(false);
                }
            });
            AddWarningpeoplestore.load({
                params: { ID: ID },
                waitMsg: "加载中.....",
                callback: function (r, options, success) {
                    if (success == false) {
                        Ext.Msg.alert("提示", "数据加载失败！");
                    }
                    else {
                        var titles = "";
                        for (var i = 0; i < AddWarningpeoplestore.getCount(); i++) {
                            var record = AddWarningpeoplestore.getAt(i);
                            titles += record.get('WarningpeopleTitle') + ',';
                        }
                        titles = titles.substring(0, titles.length - 1)
                        AddWarningForm.find("name", "PeopleTitle")[0].setValue(titles);
                    }
                }

            });
            var AllDept = r.get("AllDept");
            AddDeptStore.load({
                params: { ID: ID },
                callback: function (r, options, success) {
                    if (success == false) {
                        Ext.Msg.alert("提示", "数据加载失败！");
                    }
                    else {
                        var deptTitle = "";
                        for (var i = 0; i < AddDeptStore.getCount(); i++) {
                            var record = AddDeptStore.getAt(i);
                            deptTitle += record.get('Title') + ',';
                        }
                        deptTitle = deptTitle.substring(0, deptTitle.length - 1)
                        var splitT = deptTitle.split(',');
                        deptTitle = array_unique(splitT).join(',');
                        if (AllDept == "0") {
                            AddWarningForm.find("name", "DeptTitle")[0].setValue("全部门店");
                        } else {
                            AddWarningForm.find("name", "DeptTitle")[0].setValue(deptTitle);
                        }
                    }
                }
            });

        };
        var resultStr = "<a href='#' onclick='UpdateInfo(" + rowIndex + ")'>修改</a> " + "<a href='#' onclick='DelInfo(" + rowIndex + ")'>删除</a>";
        return resultStr;
    }
    
    var DeptIDs = "";
    var AllDept = "";
    var AddDeptWind = new Ext.Window({
        width: 555,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "门店",
        plain: true,
        items: [AddDeptForm, {
            buttons: [{
                text: '保存',
                handler: function () {
                    var count = AddDeptStore.getCount();
                    var DeptTitles = "";
                    AllDept = Ext.getCmp("chbox").checked;
                    if (count > 0 && AllDept == true) {
                        Ext.Msg.confirm('门店选择有冲突', '所有门店和某些门店不能同时选择，请选择其中一项进行操作！', function (btn) {
                            if (btn == 'yes') {
                                return;
                            }
                        });
                    }
                    else {
                        for (var i = 0; i < count; i++) {
                            DeptIDs += AddDeptStore.getAt(i).get("ID") + ",";
                            DeptTitles += AddDeptStore.getAt(i).get("Title") + ",";
                        }
                        var strSplitID = DeptIDs.split(',');
                        var strSplitTitle = DeptTitles.split(',');
                        DeptTitles = array_unique(strSplitTitle).join(',');
                        DeptIDs = array_unique(strSplitID).join(',');
                        DeptTitles = DeptTitles.slice(0, DeptTitles.length - 1);
                        if (AllDept == true) {
                            AddWarningForm.find("name", "DeptTitle")[0].setValue("全部门店");

                        }
                        else {
                            AddWarningForm.find("name", "DeptTitle")[0].setValue(DeptTitles);
                            AddWarningForm.find("name", "DeptsID")[0].setValue(DeptIDs);
                        }
                    }
                    AddDeptWind.hide();
                    AddDeptStore.removeAll();
                }
            }]
        }]
    });

    function array_unique(ar) {
        var arResult = [];
        for (var i = 0; i < ar.length; i++) {
            var FLAG = false;
            for (var j = 0; j < arResult.length; j++) {
                if (arResult[j] == ar[i]) {
                    FLAG = true;
                    break;
                }
            }
            if (!FLAG) arResult.push(ar[i]);
        }
        return arResult;
    };
    var PeopleIDs = "";
    var AddWarningPeopleWind = new Ext.Window({
        width: 400,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "提醒人",
        plain: true,
        items: [AddWarningPeopleForm, {
            buttons: [{
                text: '保存',
                handler: function () {
                    var count = AddWarningpeoplestore.getCount();
                    PeopleIDs = "";
                    var PeopleTitles = "";
                    for (var i = 0; i < count; i++) {
                        PeopleIDs += AddWarningpeoplestore.getAt(i).get("ID") + ",";
                        PeopleTitles += AddWarningpeoplestore.getAt(i).get("WarningpeopleTitle") + ",";
                    }
                    PeopleTitles = PeopleTitles.slice(0, PeopleTitles.length-1);
                    AddWarningForm.find("name", "PeopleTitle")[0].setValue(PeopleTitles);
                    AddWarningForm.find("name", "PeoplesID")[0].setValue(PeopleIDs);
                    AddWarningPeopleWind.hide();

                    AddWarningForm.find("name", "PeoplesID")[0].setValue(PeopleIDs);
                    AddWarningForm.find("name", "DeptsID")[0].setValue(DeptIDs);
                    AddWarningpeoplestore.removeAll();
                    
                }
            }]
        }]
    });
    var windowWarning = new Ext.Window({
        width: 550,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "提醒",
        plain: true,
        items: [AddWarningForm]
    });

    var windowPeople = new Ext.Window({
        width: 450,
        height:340,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "相关人",
        plain: true,
       // items: [PeopleForm]
        items: [pnlgoods_GPrice]
    });
    var windowUpdate = new Ext.Window({
        width: 450,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "门店到期提醒修改",
        plain: true,
        items: [UpdateWarningForm]
    });

    function isExist(id) {
        var Count = AddWarningpeoplestore.getCount();
        for (var j = 0; j < Count; j++) {
            if (AddWarningpeoplestore.getAt(j).get("ID") == id) {
                return true;
            }
        }
        return false;
    }
    var winAddWarningPeople = new Ext.Window({
        width: 450,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "添加提醒人",
        plain: true,
        items: [Selform, gpPeople, {
            buttons: [
            {
                text: '确  定',
                handler: function () {
                    var selects = sm.getCount();
                    var record = sm.getSelections();

                    var PeopleCount = AddWarningpeopleGp.getStore().getCount();
                    var smp = gpPeople.getSelectionModel();
                    var records = smp.getSelections();

                    for (var i = 0, n = records.length; i < n; i++) {
                        if (isExist(records[i].data.ID)==false) {
                            AddWarningpeoplestore.insert((PeopleCount + i), records);
                        }
                    }
                    winAddWarningPeople.hide();
                }
            }, {
                text: '取  消',
                handler: function () {

                    winAddWarningPeople.hide();
                }
            }
        ]
        }]
    });
    function isExistDept(id) {
        var Count = AddDeptStore.getCount();
        for (var j = 0; j < Count; j++) {
            if (AddDeptStore.getAt(j).get("ID") == id ) {
                return true;
            }
        }
        return false;
    }
    var winAddDeptInfo = new Ext.Window({
        width: 550,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "添加门店",
        plain: true,
        items: [SelformDeptInfo, gpDeptInfo, {
            buttons: [
            {
                text: '确  定',
                handler: function () {
                    var Count = AddDeptStore.getCount();
                    var sm = gpDeptInfo.getSelectionModel();
                    var records = sm.getSelections();

                    for (var i = 0, n = records.length; i < n; i++) {
                        if (!isExistDept(records[i].data.ID)) {
                            AddDeptStore.insert((Count + i), records);
                        }

                    }
                    winAddDeptInfo.hide();
                }
            }, {
                text: '取  消',
                handler: function () {

                    winAddDeptInfo.hide();
                }
            }
        ]
        }]
    });

 
    //主容器
    var pd_main_panel = new Ext.Panel({
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [warningForm]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -70',
            items: [warningGrid]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();