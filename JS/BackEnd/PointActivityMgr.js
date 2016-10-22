//积分活动管理
var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 120 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "积分活动名称",
                name: "ActivityName",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 220,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    var activityName = pd_top_form.find("name", "ActivityName")[0].getValue();

                    pd_store.load({
                        params: { activityName: activityName }
                    });
                }
            }, {
                xtype: "button",
                boxMinWidth: 40,
                width: 70,
                margins: "0 0 0 5",
                bodyStyle: "margin:0 8px",
                text: "添加活动",
                handler: function () {
                    ActivityStore.removeAll();
                    AddActivityForm.getForm().reset();
                    AddActionWindow.show();
                }
            }, {
                xtype: "button",
                boxMinWidth: 40,
                width: 70,
                margins: "0 0 0 5",
                bodyStyle: "margin:0 8px",
                text: "删除活动",
                handler: function () {
                    var rows = pd_grid.getSelectionModel().getSelections();
                    
                    if (rows.length == 0) {
                        Ext.MessageBox.alert('警告', '最少选择一条信息，进行删除!');
                    } else {
                        Ext.Msg.confirm("提示框", "您确定要进行该操作？", function (btn) {
                            if (btn == "yes") {
                                var rID = rows[0].get("ID");
                                DeleteData(rID);
                            }
                        })
                    }
                }
            }]
        }]

    }]
});

function DeleteData(rID) {
    pd_grid.body.mask("数据提交中！请稍候！");
    Ext.Ajax.request({
        url: "../Apis/PointActivityMgr.aspx?actionName=DeleteActivity&sid=" + Sys.sid,
        params: "ActivityID=" + rID,
        method: "POST",
        success: function (response) {
            if (Ext.util.JSON.decode(response.responseText).success) {
                Ext.Msg.alert("信息", "数据删除成功！", function () { pd_store.reload(); pd_store.commitChanges() });
            } else {
                Ext.Msg.alert("警告", "数据删除失败，请稍后再试！" + Ext.util.JSON.decode(response.responseText).msg);

            }
            pd_grid.body.unmask();
        },
        failure: function (response) {
            Ext.Msg.alert("警告", "数据删除失败，请稍后再试！");
            pd_grid.body.unmask();
        }
    });  
}

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    url: '../Apis/PointActivityMgr.aspx?actionName=GetPointActivity&sid=' + Sys.sid,

    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        //root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" },
                { name: "MemoInfo", mapping: "MemoInfo" }
            ]
    })
});

pd_store.on('load', function (store, records) {
    
    if (store.getCount() == 0) {
        Ext.MessageBox.alert("提醒", "无积分活动！");
    };
});

pd_store.on("loadexception", function (mis) {
    
    Ext.MessageBox.alert("提醒", "无该积分活动！");
    pd_store.removeAll();
});

var fm = Ext.form;

var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [
    {
        //id: "Title",
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: '积分活动名称',
        dataIndex: 'Title',
        width: 140
    },{
        //id: "NeedPoint",
        header: "备注",
        dataIndex: "MemoInfo",
        width: 120
    }]
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

//每个活动的ID
var ActivityID = 0;
//===========================双击获取该单据 开始======================================//
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    ActivityID= r.get("ID");
    var ActivityName = r.get("Title");

    AddActionWindow.show();
    AddActivityForm.find("name", "ActivityID")[0].setValue(ActivityID);
    AddActivityForm.find("name", "ActivityName")[0].setValue(ActivityName);
    ActivityStore.load({
        params: { ID: ActivityID }
    });
});

//===========================双击获取该单据 结束======================================//


//==========================================添加活动窗口 开始======================================================//


//添加活动form
var AddActivityForm = new Ext.form.FormPanel({
    //xtype: "form",
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    height: 60,
    items: [{
        layout: 'column',
        //defaults: { width: 210 },
        items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '活动ID',
                        hidden: true,
                        name: 'ActivityID',
                        anchor: '95%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '活动名称',
                        name: 'ActivityName',
                        allowBlank: false,
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'column',
                    //defaults: { width: 280 },
                    items: [{
                        xtype: "button",
                        text: '添加活动规则',
//                        anchor: '30%',
//                        align: 'right',
                        handler: function () {
                            //添加活动名称
                            if (ActivityID != 0) {
                                AddRuleWindow.show();
                                AddRuleForm.getForm().reset();
                                AddRuleForm.find("name", "ActivityID")[0].setValue(ActivityID);
                                AddRuleForm.findById("Cost").setVisible(false);
                                AddRuleForm.findById("RMB").setVisible(false);

                                AddRuleForm.findById("Give").setVisible(false);
                                AddRuleForm.findById("GivePoint").setVisible(false);

                                AddRuleForm.findById("BasePoint").setVisible(false);
                                AddRuleForm.findById("Multiple").setVisible(false);
                            } else {
                                AddActivity();
                            }
                            //AddRuleWindow.show();
                        }
                    }, {
                        xtype: "button",
                        //decimalPrecision:0,
                        text: '删除活动规则',
                        //anchor: '30%',
                        //align: 'right',
                        handler: function () {
                            var rows = action_grid.getSelectionModel().getSelections();

                            if (rows.length == 0) {
                                Ext.MessageBox.alert('警告', '最少选择一条信息，进行删除!');
                            } else {
                                Ext.Msg.confirm("提示框", "您确定要进行该操作？", function (btn) {
                                    if (btn == "yes") {
                                        var LID = rows[0].get("ID"); //alert(LID);
                                        DeleteList(LID);
                                    }
                                })
                            }
                        }
                    }
                        ]
                }]
    }

    ]
});

        function DeleteList(LID) {
            action_grid.body.mask("数据提交中！请稍候！");
            Ext.Ajax.request({
                url: "../Apis/PointActivityMgr.aspx?actionName=DeleteActivityList&sid=" + Sys.sid,
                params: "ListID=" + LID,
                method: "POST",
                success: function (response) {
                    if (Ext.util.JSON.decode(response.responseText).success) {
                        Ext.Msg.alert("信息", "数据删除成功！", function () { ActivityStore.reload(); ActivityStore.commitChanges() });
                    } else {
                        Ext.Msg.alert("警告", "数据删除失败，请稍后再试！" + Ext.util.JSON.decode(response.responseText).msg);

                    }
                    action_grid.body.unmask();
                },
                failure: function (response) {
                    Ext.Msg.alert("警告", "数据删除失败，请稍后再试！");
                    action_grid.body.unmask();
                }
            });
        }

        //新的活动ID
        var aID = 0;
function AddActivity() {
    if (AddActivityForm.getForm().isValid()) {
        //提交数据
        //addform.body.mask("正在提交，请稍候...");
        AddActivityForm.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointActivityMgr.aspx?actionName=AddActivity&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", "添加活动成功！");
                if (action.result.success) {
                    aID = action.result.msg;
                    AddRuleWindow.show();
                    AddRuleForm.find("name", "ActivityID")[0].setValue(aID);
                    AddRuleForm.findById("Cost").setVisible(false);
                    AddRuleForm.findById("RMB").setVisible(false);

                    AddRuleForm.findById("Give").setVisible(false);
                    AddRuleForm.findById("GivePoint").setVisible(false);

                    AddRuleForm.findById("BasePoint").setVisible(false);
                    AddRuleForm.findById("Multiple").setVisible(false);
                }

                //操作成功
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //addform.body.unmask();
            }
        });
    }
}

    var ActivityCm = new Ext.grid.ColumnModel({
        // specify any defaults for each column
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns: [
        {
            //id: "Title",
            header: 'ID',
            dataIndex: 'ID',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '时间范围',
            dataIndex: 'ActivityDate',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '店铺区域',
            dataIndex: 'DeptRegion',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '指定店铺',
            dataIndex: 'DeptID',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '服务',
            dataIndex: 'ServiceID',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '产品',
            dataIndex: 'ProductID',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '售卡类型',
            dataIndex: 'SellCardType',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '充值卡类型',
            dataIndex: 'RechargeCardType',
            hidden: true,
            width: 100
        },

        {
            //id: "Title",
            header: '区域名称',
            dataIndex: 'RegionName',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '店铺名称',
            dataIndex: 'DeptName',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '服务名称',
            dataIndex: 'ServiceName',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '产品名称',
            dataIndex: 'ProductName',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '售卡类型名称',
            dataIndex: 'SellCardName',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '充值卡类型名称',
            dataIndex: 'RechargeName',
            hidden: true,
            width: 100
        },

         {
            //id: "Title",
            header: '积分规则id',
            dataIndex: 'RuleID',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '积分条件',
            dataIndex: 'RuleCondition',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '产生多少积分',
            dataIndex: 'PointCount',
            hidden: true,
            width: 100
        }, {
            //id: "Title",
            header: '摘要',
            dataIndex: 'Summary',
            width: 300
        }]
    });


        // create the data store
var ActivityStore = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    url: '../Apis/PointActivityMgr.aspx?actionName=GetPointActivityList&sid=' + Sys.sid,

    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        //root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "ActivityDate", mapping: "ActivityDate" },
                { name: "DeptRegion", mapping: "DeptRegion" },
                { name: "DeptID", mapping: "DeptID" },
                { name: "ServiceID", mapping: "ServiceID" },
                { name: "ProductID", mapping: "ProductID" },
                { name: "SellCardType", mapping: "SellCardType" },
                { name: "RechargeCardType", mapping: "RechargeCardType" },
                { name: "RuleID", mapping: "RuleID" },
                { name: "RuleCondition", mapping: "RuleCondition" },
                { name: "PointCount", mapping: "PointCount" },

                { name: "RegionName", mapping: "RegionName" },
                { name: "DeptName", mapping: "DeptName" },
                { name: "ServiceName", mapping: "ServiceName" },
                { name: "ProductName", mapping: "ProductName" },
                { name: "SellCardName", mapping: "SellCardName" },
                { name: "RechargeName", mapping: "RechargeName" },

                { name: "Summary", mapping: "Summary" }
            ]
    })
});

    var action_grid = new Ext.grid.GridPanel({
        store: ActivityStore,
        cm: ActivityCm,
        //frame: true,
        margins: "2 2 2 2",
        border: false,
        //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
        //sm: sm,
        loadMask: true
    });
    
    //每个规则的ID
    var ListID = 0;
    //===========================规则   双击获取该单据 开始======================================//
        action_grid.on("rowdblclick", function (g, rowindex, e) {
        var r = action_grid.getStore().getAt(rowindex);
        AddRuleWindow.show();

        ListID = r.get("ID");
        var ActivityDate = r.get("ActivityDate");
        var DeptRegion = r.get("DeptRegion");
        var DeptID = r.get("DeptID");
        var ServiceID = r.get("ServiceID");
        var ProductID = r.get("ProductID");
        var SellCardType = r.get("SellCardType");
        var RechargeCardType = r.get("RechargeCardType");

        AddRuleForm.find("name", "ListID")[0].setValue(ListID);
        AddRuleForm.find("name", "ActivityID")[0].setValue(ActivityID);

        if (ActivityDate != "") {
            Ext.get('DateRange').dom.checked = true;

            var date = ActivityDate.split('~');

            AddRuleForm.find("name", "DateStart")[0].setValue(date[0]);
            AddRuleForm.find("name", "DateEnd")[0].setValue(date[1]);
        }

        if (DeptRegion != 0 && DeptRegion != -1) {
            Ext.get('AppointRegion').dom.checked = true;
            AddRuleForm.find("name", "Region")[0].setValue(r.get("RegionName"));
            AddRuleForm.find("name", "DeptRegion")[0].setValue(r.get("DeptRegion"));
            AddRuleForm.find("name", "DeptID")[0].setValue(r.get("DeptID"));
        } else {
            if (DeptID == 0) {
                Ext.get('AllDepts').dom.checked = true;
                AddRuleForm.find("name", "DeptID")[0].setValue("0");
            } else if (DeptID != 0 && DeptID != -1) {
                Ext.get('AppointDepts').dom.checked = true;
                AddRuleForm.find("name", "DeptID")[0].setValue(r.get("DeptID"));
                AddRuleForm.find("name", "DeptName")[0].setValue(r.get("DeptName"));
            }
        }

        if (ServiceID == 0) {
            Ext.get('AllServices').dom.checked = true;
            AddRuleForm.find("name", "ServiceID")[0].setValue("0");
        } else if (ServiceID != 0 && ServiceID != -1) {
            Ext.get('AppointService').dom.checked = true;
            AddRuleForm.find("name", "ServiceID")[0].setValue(r.get("ServiceID"));
            AddRuleForm.find("name", "ServiceName")[0].setValue(r.get("ServiceName"));
        } else if (ServiceID == -1) {
            Ext.get('NoneService').dom.checked = true;
            AddRuleForm.find("name", "ServiceID")[0].setValue("-1");
        }

        if (ProductID == 0) {
            Ext.get('AllProducts').dom.checked = true;
            AddRuleForm.find("name", "ProductID")[0].setValue("0");
        } else if (ProductID != 0 && ProductID != -1) {
            Ext.get('AppointProducts').dom.checked = true;
            AddRuleForm.find("name", "ProductID")[0].setValue(r.get("ProductID"));
            AddRuleForm.find("name", "ProductName")[0].setValue(r.get("ProductName"));
        } else if (ProductID == -1) {
            Ext.get('NoneProducts').dom.checked = true;
            AddRuleForm.find("name", "ProductID")[0].setValue("-1");
        }

        if (SellCardType == 0) {
            Ext.get('AllCards').dom.checked = true;
            AddRuleForm.find("name", "SellCardType")[0].setValue("0");
        } else if (SellCardType != 0 && SellCardType != -1) {
            Ext.get('AppointCard').dom.checked = true;
            AddRuleForm.find("name", "SellCardType")[0].setValue(r.get("SellCardType"));
            AddRuleForm.find("name", "SellCardName")[0].setValue(r.get("SellCardName"));
        } else if (SellCardType == -1) {
            Ext.get('NoneCard').dom.checked = true;
            AddRuleForm.find("name", "SellCardType")[0].setValue("-1");
        }

        if (RechargeCardType == 0) {
            Ext.get('AllRechargeCards').dom.checked = true;
            AddRuleForm.find("name", "RechargeCardType")[0].setValue("0");
        } else if (RechargeCardType != 0 && RechargeCardType != -1) {
            Ext.get('AppointRechargeCards').dom.checked = true;
            AddRuleForm.find("name", "RechargeCardType")[0].setValue(r.get("RechargeCardType"));
            AddRuleForm.find("name", "RechargeName")[0].setValue(r.get("RechargeName"));
        } else if (RechargeCardType == -1) {
            Ext.get('NoneRechargeCards').dom.checked = true;
            AddRuleForm.find("name", "RechargeCardType")[0].setValue("-1");
        }

        AddRuleForm.find("hiddenName", "RuleID")[0].setValue(r.get("RuleID"));

        //设置动态表单
        var ruleValue = r.get("RuleID");

        if (ruleValue == 1) {
            AddRuleForm.findById("Cost").setVisible(true);
            AddRuleForm.findById("RMB").setVisible(true);

            AddRuleForm.findById("Give").setVisible(true);
            AddRuleForm.findById("GivePoint").setVisible(true);

            AddRuleForm.findById("BasePoint").setVisible(false);
            AddRuleForm.findById("Multiple").setVisible(false);

            AddRuleForm.find("name", "Cost")[0].setValue(r.get("RuleCondition"));
            AddRuleForm.find("name", "Give")[0].setValue(r.get("PointCount"));
        } else if (ruleValue == 2) {
            AddRuleForm.findById("Cost").setVisible(false);
            AddRuleForm.findById("RMB").setVisible(false);

            AddRuleForm.findById("Give").setVisible(false);
            AddRuleForm.findById("GivePoint").setVisible(false);

            AddRuleForm.findById("BasePoint").setVisible(true);
            AddRuleForm.findById("Multiple").setVisible(true);

            AddRuleForm.find("name", "RuleCondition")[0].setValue(r.get("RuleCondition"));
            AddRuleForm.find("name", "BasePoint")[0].setValue(r.get("PointCount"));
        } else if (ruleValue == 3) {
            AddRuleForm.findById("Cost").setVisible(false);
            AddRuleForm.findById("RMB").setVisible(false);

            AddRuleForm.findById("Give").setVisible(false);
            AddRuleForm.findById("GivePoint").setVisible(false);

            AddRuleForm.findById("BasePoint").setVisible(true);
            AddRuleForm.findById("Multiple").setVisible(true);

            AddRuleForm.find("name", "BasePoint")[0].setValue(r.get("PointCount"));
        } else if (ruleValue == 4) {

        }

        AddRuleForm.find("name", "Summary")[0].setValue(r.get("Summary"));
    });

    //===========================规则   双击获取该单据 结束======================================//


    //添加规则容器
    var action_main_panel = new Ext.Panel({
        //autoScroll: true,
        border: false,
        //autoWidth:true,
        layout: "anchor",
        //anchorSize: { width: 800, height: 600 },
        items: [{
            frame: true,
            layout: "fit",
            border: false,
            items: [AddActivityForm]
        }, {
            layout: "fit",
            frame: true,
            border: false,
            anchor: '-1 -50',
            items: [action_grid]
        }]
    });

    //新增活动窗口
    var AddActionWindow = new Ext.Window({
        layout: 'fit',
        width: 550,
        height: 300,
        modal: true,
        closeAction: 'hide',
        title: "新增活动规则",
        plain: true,
        items: [action_main_panel]
    });


    //==========================================添加活动窗口 结束======================================================//


    //规则模式
    var storeRules = new Ext.data.Store({
        //autoDestroy: true,
        autoLoad: true,
        url: '../Apis/PointRules.aspx?actionName=getActivityRules&sid=' + Sys.sid,
        //remoteSort:true,
        //remoteSort: true,

        // specify a XmlReader (coincides with the XML format of the returned data)
        reader: new Ext.data.JsonReader({
            // records will have a 'plant' tag
            record: 'plant',
            // use an Array of field definition objects to implicitly create a Record constructor
            idProperty: 'id',
            root: 'rows',
            totalProperty: 'results',
            fields: [
                { name: "ID", mapping: "ID" },
                { name: 'Title', mapping: 'Title' },
                { name: 'RuleType', mapping: 'RuleType' }
            ]
        })
    });

    var dateData = [
        ["2011-02-01"],
        ["2011-03-08"],
        ["2011-05-01"]
    ];

    // create the data store
    var dateTestStore = new Ext.data.ArrayStore({
        fields: [
           { name: 'AppointDate',type:'string'}
        ]
    });

    //日历窗口
    var dateCm = new Ext.grid.ColumnModel({
        // specify any defaults for each column
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns: [{
            //id: "Code",
            header: '日期',
            dataIndex: 'AppointDate',
            width: 100,
            //xtype: "datecolumn",
            renderer: function (value) {
                alert(value);
                if (value != undefined) {
                    var d = ConvertJSONDateToJSDateObject(value);
                    if (d == null) {
                        d = value;
                    }
                    return d.dateFormat("Y-m-d");
                }
            },
            format: "Y-m-d",
            editor: new fm.DateField({
                allowBlank: false,
                format: "Y-m-d"
            })
        }
        ]
    });

    var dateStore = new Ext.data.Store({
        // destroy the store if the grid is destroyed
        autoDestroy: true,
        //autoLoad: true,
        // load remote data using HTTP
        //url: '../Apis/Prevention.aspx?actionName=getConstructionList&sid=' + Sys.sid,

        // specify a XmlReader (coincides with the XML format of the returned data)
        reader: new Ext.data.JsonReader({
            // records will have a 'plant' tag
            record: 'plant',
            // use an Array of field definition objects to implicitly create a Record constructor
            //idProperty: 'ID',
            root: 'rows',
            totalProperty: 'results',
            fields: [
                { name: "AppointDate", mapping: "AppointDate" }
            ]
        })
    });

    var dateGrid = new Ext.grid.EditorGridPanel({
        //store: dateStore,
        store: dateTestStore,
        cm: dateCm,
        frame: true,
        selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
        clicksToEdit: 2,
        loadMask: true,
        tbar: [{
            iconCls: 'silk-add',
            text: '添  加',
            handler: function () {
                var Plant = dateTestStore.recordType;
                var p = new Plant({
            });
            //dateTestStore.stopEditing();
            dateTestStore.insert(0, p);
            //dateTestStore.startEditing(0, 2);
        }
    }, {
        text: '保  存',
        iconCls: "icon-save",
        handler: function () {
            var modified = dateTestStore.modified;
            //alert(DateToString(modified[1].get("AppointDate")));
            updateData(modified);
        }
    }, {
        iconCls: 'silk-delete',
        text: '删  除',
        handler: function () {
            var rows = dateStore.getSelectionModel().getSelections();
            //alert(rows[0].get("ID"));

            if (rows.length == 0) {
                Ext.MessageBox.alert('警告', '最少选择一条信息，进行删除!');
            } else {

                Ext.Msg.confirm("提示框", "您确定要进行该操作？", function (btn) {
                    if (btn == "yes") {
                        //deleteConstructionList(rows);
                    }
                })

            }
        }
    }]

});

function updateData(modified) {
    //grid.body.mask("数据提交中！请稍候！");
    var json = [];
    var isOk = true;
    Ext.each(modified, function (item) {
        var date = "";
        date = DateToString(item.data.AppointDate);
        json.push(date);
    });
    AddRuleForm.find("name", "BookDate")[0].setValue(json); 
    //alert(json);
}  


var date2 = "2011-02-02,2011-03-02,3011-04-02";
function getDateData() {
    //dateTestStore.loadData(dateData);
    var dd = [];
    dd = date2.split(',');
    var testDate = [];
    Ext.each(dd, function (item) {
        var newDate = new Date(item);
        testDate.push(newDate);
        //alert(item);
    })
    alert(testDate);
//    alert(dateData);
    dateTestStore.loadData(testDate);
}

var DateWindow = new Ext.Window({
    layout: "fit",
    modal: true,
    width: 400,
    height: 300,
    closeAction: 'hide',
    title: "指定日期",
    plain: true,
    items: [
            dateGrid
        ]
});

    //==========================================添加规则窗口 开始======================================================//

    //================================日历、店铺等按钮的窗口 开始============================//


//========================区域 开始 ========================//

//区域树 
var regionTree = new Ext.tree.TreePanel({
    //title:'权限',
    //split:true,
    dataUrl: '../Apis/PointActivityMgr.aspx?actionName=GetRegional&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        nodeType: 'async'
    },
    rootVisible: false,
    listeners: {
        "load": function (node) {
            //获取每条规则的区域信息
            GetRegionalData();
        }
    }
});
//ptree.expandAll();

//区域窗口
var regionWindow = new Ext.Window({
    title: '设置区域',
    closeAction: 'hide',
    width: 300,
    height: 250,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [regionTree],
    buttons: [{
        text: '设置',
        handler: function () {
            Ext.get('AppointRegion').dom.checked = true;
            //regionWindow.body.mask("正在提交，请稍候。");
            var regionname = '';
            var msg = '', selNodes = regionTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ', ';
                }
                msg += node.id;

                if (regionname.length > 0) {
                    regionname += ', ';
                }
                regionname += node.text;
                if (regionname != null) {
                    AddRuleForm.find("name", "Region")[0].setValue(regionname);
                }
            });

            AddRuleForm.find("name", "DeptRegion")[0].setValue(msg);
            AddRuleForm.find("name", "DeptID")[0].setValue("-1");
            AddRuleForm.find("name", "DeptName")[0].setValue("");

            regionWindow.hide();
        }
    }, {
        text: '取消',
        handler: function () {
            regionWindow.hide();
        }
    }]
})

function SetRegional() {
    regionWindow.show();
    regionTree.getRootNode().reload();
}

function GetRegionalData() {
    regionWindow.body.mask("Loading...");
    Ext.Ajax.request({
        url: "../Apis/PointActivityMgr.aspx?actionName=GetRegionalData&sid=" + Sys.sid,
        params: "ListID=" + ListID,
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);
            if (data != "") {
                var id = data[0].id;
                
                var str = new Array();
                str = id.split(",");
                for (var j = 0; j < str.length; j++) {

                    var node = regionTree.getNodeById(str[j].toString().trim());
                    
                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            regionWindow.body.unmask();
        }
    })
}


//========================区域 结束 ========================//


//========================店铺 开始 ========================//

//店铺树 
var deptTree = new Ext.tree.TreePanel({
    dataUrl: '../Apis/PointActivityMgr.aspx?actionName=GetDept&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        nodeType: 'async'
    },
    rootVisible: false,
    listeners: {
        "load": function (node) {
            //获取每条规则的店铺信息
            GetDeptData();
        }
    }
});
//ptree.expandAll();

//店铺窗口
var deptWindow = new Ext.Window({
    title: '设置店铺',
    closeAction: 'hide',
    width: 350,
    height: 300,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [deptTree],
    buttons: [{
        text: '设置',
        handler: function () {
            Ext.get('AppointDepts').dom.checked = true;
            //deptWindow.body.mask("正在提交，请稍候。");
            var deptname = '';
            var msg = '', selNodes = deptTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ', ';
                }
                msg += node.id;

                if (deptname.length > 0) {
                    deptname += ', ';
                }
                deptname += node.text;
                if (deptname != null) {
                    AddRuleForm.find("name", "DeptName")[0].setValue(deptname);
                }
            });

            AddRuleForm.find("name", "DeptID")[0].setValue(msg);
            AddRuleForm.find("name", "DeptRegion")[0].setValue("-1");
            AddRuleForm.find("name", "Region")[0].setValue("");

            deptWindow.hide();
        }
    }, {
        text: '取消',
        handler: function () {
            deptWindow.hide();
        }
    }]
})

function SetDeptID() {
    deptWindow.show();
    deptTree.getRootNode().reload();
}

function GetDeptData() {
    deptWindow.body.mask("Loading...");
    Ext.Ajax.request({
        url: "../Apis/PointActivityMgr.aspx?actionName=GetDeptIDData&sid=" + Sys.sid,
        params: "ListID=" + ListID,
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);
            
            if (data != "") {
                var id = data[0].id;
                var str = new Array();
                str = id.split(",");
                for (var j = 0; j < str.length; j++) {

                    var node = deptTree.getNodeById(str[j].toString().trim());
                    
                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            deptWindow.body.unmask();
        }
    })
}


//========================店铺 结束 ========================//


//========================服务 开始 ========================//

//服务树 
var serviceTree = new Ext.tree.TreePanel({
    //title:'权限',
    //split:true,
    dataUrl: '../Apis/PointActivityMgr.aspx?actionName=GetService&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        nodeType: 'async'
    },
    rootVisible: false,
    listeners: {
        "load": function (node) {
            //获取每条规则的服务信息
            GetServiceData();
        }
    }
});
//ptree.expandAll();

//服务窗口
var serviceWindow = new Ext.Window({
    title: '设置服务',
    closeAction: 'hide',
    width: 400,
    height: 350,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [serviceTree],
    buttons: [{
        text: '设置',
        handler: function () {
            Ext.get('AppointService').dom.checked = true;
            //serviceWindow.body.mask("正在提交，请稍候。");
            var servicename = '';
            var msg = '', selNodes = serviceTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ', ';
                }
                msg += node.id;

                if (servicename.length > 0) {
                    servicename += ', ';
                }
                servicename += node.text;
                if (servicename != null) {
                    AddRuleForm.find("name", "ServiceName")[0].setValue(servicename);
                }
            });

            AddRuleForm.find("name", "ServiceID")[0].setValue(msg);

            serviceWindow.hide();
        }
    }, {
        text: '取消',
        handler: function () {
            serviceWindow.hide();
        }
    }]
})

function SetService() {
    serviceWindow.show();
    serviceTree.getRootNode().reload();
}

function GetServiceData() {
    serviceWindow.body.mask("Loading...");
    Ext.Ajax.request({
        url: "../Apis/PointActivityMgr.aspx?actionName=GetServiceIDData&sid=" + Sys.sid,
        params: "ListID=" + ListID,
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);
            
            if (data != "") {
                var id = data[0].id;
                var str = new Array();
                str = id.split(",");
                for (var j = 0; j < str.length; j++) {

                    var node = serviceTree.getNodeById(str[j].toString().trim());
                    
                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            serviceWindow.body.unmask();
        }
    })
}


//========================服务 结束 ========================//


//========================产品 开始 ========================//

//产品树 
var productTree = new Ext.tree.TreePanel({
    //title:'权限',
    //split:true,
    dataUrl: '../Apis/PointActivityMgr.aspx?actionName=GetProduct&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        nodeType: 'async'
    },
    rootVisible: false,
    listeners: {
        "load": function (node) {
            //获取每条规则的产品信息
            GetProductData();
        }
    }
});

//产品窗口
var productWindow = new Ext.Window({
    title: '设置产品',
    closeAction: 'hide',
    width: 400,
    height: 350,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [productTree],
    buttons: [{
        text: '设置',
        handler: function () {
            Ext.get('AppointProducts').dom.checked = true;
            //productWindow.body.mask("正在提交，请稍候。");
            var productname = '';
            var msg = '', selNodes = productTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ', ';
                }
                msg += node.id;

                if (productname.length > 0) {
                    productname += ', ';
                }
                productname += node.text;
                if (productname != null) {
                    AddRuleForm.find("name", "ProductName")[0].setValue(productname);
                }
            });

            AddRuleForm.find("name", "ProductID")[0].setValue(msg);

            productWindow.hide();
        }
    }, {
        text: '取消',
        handler: function () {
            productWindow.hide();
        }
    }]
})

function SetProduct() {
    productWindow.show();
    productTree.getRootNode().reload();
}

function GetProductData() {
    productWindow.body.mask("Loading...");
    Ext.Ajax.request({
        url: "../Apis/PointActivityMgr.aspx?actionName=GetProductIDData&sid=" + Sys.sid,
        params: "ListID=" + ListID,
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);
            if (data != "") {
                var id = data[0].id;
                var str = new Array();
                str = id.split(",");
                for (var j = 0; j < str.length; j++) {
                    var node = productTree.getNodeById(str[j].toString().trim());
                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            productWindow.body.unmask();
        }
    })
}


//========================产品 结束 ========================//



//========================卡类型 开始 ========================//

//产品树 
var cardTree = new Ext.tree.TreePanel({
    //title:'权限',
    //split:true,
    dataUrl: '../Apis/PointActivityMgr.aspx?actionName=GetCard&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        nodeType: 'async'
    },
    rootVisible: false,
    listeners: {
        "load": function (node) {
            //获取每条规则的售卡信息
            GetSellCardData();
        }
    }
});
//ptree.expandAll();

//卡类型窗口
var cardWindow = new Ext.Window({
    title: '设置卡类型',
    closeAction: 'hide',
    width: 400,
    height: 350,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [cardTree],
    buttons: [{
        text: '设置',
        handler: function () {
            Ext.get('AppointCard').dom.checked = true;
            //cardWindow.body.mask("正在提交，请稍候。");
            var cardname = '';
            var msg = '', selNodes = cardTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ', ';
                }
                msg += node.id;

                if (cardname.length > 0) {
                    cardname += ', ';
                }
                cardname += node.text;
                if (cardname != null) {
                    AddRuleForm.find("name", "SellCardName")[0].setValue(cardname);
                }
            });

            AddRuleForm.find("name", "SellCardType")[0].setValue(msg);

            cardWindow.hide();
        }
    }, {
        text: '取消',
        handler: function () {
            cardWindow.hide();
        }
    }]
})

function SetSellCard() {
    cardWindow.show();
    cardTree.getRootNode().reload();
}

function GetSellCardData() {
    cardWindow.body.mask("Loading...");
    Ext.Ajax.request({
        url: "../Apis/PointActivityMgr.aspx?actionName=GetSellCardData&sid=" + Sys.sid,
        params: "ListID=" + ListID,
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);
            if (data != "") {
                var id = data[0].id;
                var str = new Array();
                str = id.split(",");
                for (var j = 0; j < str.length; j++) {
                    var node = cardTree.getNodeById(str[j].toString().trim());
                    
                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            cardWindow.body.unmask();
        }
    })
}


//========================卡类型 结束 ========================//

//========================充值卡类型 开始 ========================//

//充值卡树 
var rechargeCardTree = new Ext.tree.TreePanel({
    //title:'权限',
    //split:true,
    dataUrl: '../Apis/PointActivityMgr.aspx?actionName=GetCard&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        nodeType: 'async'
    },
    rootVisible: false,
    listeners: {
        "load": function (node) {
            //获取每条规则的充值卡信息
            GetRechargeCardData();
        }
    }
});

//充值卡类型窗口
var RechargeCardWindow = new Ext.Window({
    title: '设置充值卡类型',
    closeAction: 'hide',
    width: 400,
    height: 350,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [rechargeCardTree],
    buttons: [{
        text: '设置',
        handler: function () {
            Ext.get('AppointRechargeCards').dom.checked = true;
            //RechargeCardWindow.body.mask("正在提交，请稍候。");
            var productname = '';
            var msg = '', selNodes = rechargeCardTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ', ';
                }
                msg += node.id;

                if (productname.length > 0) {
                    productname += ', ';
                }
                productname += node.text;
                if (productname != null) {
                    AddRuleForm.find("name", "RechargeName")[0].setValue(productname);
                }
            });
            AddRuleForm.find("name", "RechargeCardType")[0].setValue(msg);

            RechargeCardWindow.hide();
        }
    }, {
        text: '取消',
        handler: function () {
            RechargeCardWindow.hide();
        }
    }]
})

function SetRechargeCard() {
    RechargeCardWindow.show();
    rechargeCardTree.getRootNode().reload();
}

function GetRechargeCardData() {
    //var model = grid.getSelectionModel().getSelected();
    //ptree.getRootNode().reload();
    RechargeCardWindow.body.mask("Loading...");
    Ext.Ajax.request({
        url: "../Apis/PointActivityMgr.aspx?actionName=GetRechargeCardData&sid=" + Sys.sid,
        params: "ListID=" + ListID,
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);
            if (data != "") {
                var id = data[0].id;
                var str = new Array();
                str = id.split(",");
                for (var j = 0; j < str.length; j++) {

                    var node = rechargeCardTree.getNodeById(str[j].toString().trim());
                    
                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            RechargeCardWindow.body.unmask();
        }
    })
}


//========================充值卡类型 结束 ========================//



//=============================================日历、店铺等按钮的窗口 结束=================================================//



var AddRuleForm = new Ext.form.FormPanel({
    frame: true,
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    autoScroll: true,
    bodyStyle: 'padding:5px 5px 0',
    width: 600,
    height: 400,

    items: [{
        xtype: "fieldset",
        title: "时间定义",
        collapsible: true,
        collapsed: false,
        defaults: { labelAlign: "right" },
        items: [{
            //bodyStyle: 'padding:0 0 10 0',
            height: 20,
            items: [
                {
                    xtype: "radio",
                    boxLabel: '时间范围',
                    checked: true,
                    id: 'DateRange',
                    name: 'TimeRange',
                    anchor: "100%"
                }]
        }, {
            layout: "column",
            items: [{
                layout: "form",
                columnWidth: .5,
                labelWidth: 50,
                defaults: { labelAlign: "right" },
                items: [{
                    xtype: "datefield",
                    // labelAlign:"right",
                    fieldLabel: "从",
                    name: "DateStart",
                    emptyText: new Date().toLocaleDateString(),
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                columnWidth: .5,
                labelWidth: 50,
                defaults: { labelAlign: "right" },
                items: [{
                    xtype: "datefield",
                    fieldLabel: "至",
                    emptyText: new Date().toLocaleDateString(),
                    name: "DateEnd",
                    anchor: "100%"
                }]
            }, {
                xtype: "textfield",
                name: "ActivityDate",
                hidden: true,
                anchor: "100%"
            },
            {
                //每条规则的ID
                xtype: "textfield",
                name: "ListID",
                hidden: true,
                anchor: "100%"
            }, {
                //每个活动的ID
                xtype: "textfield",
                name: "ActivityID",
                hidden: true,
                anchor: "100%"
            }]
        }, {
            //bodyStyle: 'padding:0 0 10 0',
            height: 20,
            items: [
                {
                    xtype: "radio",
                    boxLabel: '指定日期',
                    id: 'BookDate',
                    checked: true,
                    name: 'TimeRange',
                    anchor: "100%"
                }]
        }, {
            layout: "column",
            items: [{
                layout: "form",
                columnWidth: 0.95,
                labelWidth: 10,
                //width: 480,
                defaults: { labelAlign: "right" },
                items: [{
                    xtype: "textfield",
                    name: "BookDate",
                    anchor: "100%"
                }]
            }, {
                //layout: "hbox",
                bodyStyle: "margin:0 5px",
                width: 70,
                anchor: "100%",
                items: [{
                    xtype: "button",
                    boxMinWidth: 40,
                    width: 60,
                    text: " 日历",
                    handler: function () {
                        getDateData();
                        DateWindow.show();

                    }

                }]
            }]
        }
                ]
    },
        {
            xtype: "fieldset",
            title: "店铺定义",
            collapsible: true,
            collapsed: false,
            defaults: { labelAlign: "right" },
            items: [{
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '全部店铺',
                    checked: true,
                    id: 'AllDepts',
                    name: 'AllShops',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('AllDepts').dom.checked) {
                            AddRuleForm.find("name", "DeptID")[0].setValue("0");
                            AddRuleForm.find("name", "DeptName")[0].setValue("");
                            AddRuleForm.find("name", "Region")[0].setValue("");
                            AddRuleForm.find("name", "DeptRegion")[0].setValue("-1");
                        }
                    }
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    id: 'AppointRegion',
                    boxLabel: '指定区域',
                    checked: true,
                    name: 'AllShops',
                    anchor: "100%"
                }]
            }, {
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    labelWidth: 10,
                    //width: 480,
                    defaults: { labelAlign: "right" },
                    items: [{
                        xtype: 'hidden',
                        fieldLabel: '区域ID',
                        name: 'DeptRegion',
                        anchor: '96%'
                    }, {
                        xtype: "textfield",
                        name: "Region",
                        anchor: "100%"
                    }]
                }, {
                    layout: "hbox",
                    bodyStyle: "margin:0 5px",
                    width: 70,
                    items: [{
                        xtype: "button",
                        boxMinWidth: 40,
                        width: 60,
                        text: " 区域",
                        anchor: "100%",
                        handler: function () {
                            regionWindow.show();
                        }
                    }]
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '指定店铺',
                    checked: true,
                    id: 'AppointDepts',
                    name: 'AllShops',
                    anchor: "100%"
                }]
            }, {
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    labelWidth: 10,
                    // width: 480,
                    defaults: { labelAlign: "right" },
                    items: [{
                        xtype: 'hidden',
                        fieldLabel: '店铺ID',
                        name: 'DeptID',
                        anchor: '96%'
                    }, {
                        xtype: "textfield",
                        name: "DeptName",
                        anchor: "100%"
                    }]
                }, {
                    layout: "hbox",
                    bodyStyle: "margin:0 5px",
                    width: 70,
                    items: [{
                        xtype: "button",
                        boxMinWidth: 40,
                        width: 60,
                        text: " 店铺",
                        handler: function () {
                            deptWindow.show();
                        }
                    }]
                }]
            }
            ]
        }, {
            xtype: "fieldset",
            title: "服务定义",
            collapsible: true,
            collapsed: false,
            defaults: { labelAlign: "right" },
            items: [{
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '全部服务',
                    id: 'AllServices',
                    checked: true,
                    name: 'AllServices',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('AllServices').dom.checked) {
                            AddRuleForm.find("name", "ServiceID")[0].setValue("0");
                            AddRuleForm.find("name", "ServiceName")[0].setValue("");
                        }
                    }
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '指定服务',
                    id: 'AppointService',
                    checked: true,
                    name: 'AllServices',
                    anchor: "100%"
                }]
            }, {
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    labelWidth: 10,
                    //width: 480,
                    defaults: { labelAlign: "right" },
                    items: [{
                        xtype: 'hidden',
                        fieldLabel: '服务ID',
                        name: 'ServiceID',
                        anchor: '96%'
                    }, {
                        xtype: "textfield",
                        name: "ServiceName",
                        anchor: "100%"
                    }]
                }, {
                    layout: "hbox",
                    bodyStyle: "margin:0 5px",
                    width: 70,
                    items: [{
                        xtype: "button",
                        boxMinWidth: 40,
                        width: 60,
                        text: " 服务",
                        handler: function () {
                            serviceWindow.show();
                        }
                    }]
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '无',
                    id: 'NoneService',
                    checked: true,
                    name: 'AllServices',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('NoneService').dom.checked) {
                            AddRuleForm.find("name", "ServiceID")[0].setValue("-1");
                            AddRuleForm.find("name", "ServiceName")[0].setValue("");
                        }
                    }
                }]
            }
            ]
        }, {
            xtype: "fieldset",
            title: "产品定义",
            collapsible: true,
            collapsed: false,
            defaults: { labelAlign: "right" },
            items: [{
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '全部产品',
                    id: 'AllProducts',
                    checked: true,
                    name: 'AllProducts',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('AllProducts').dom.checked) {
                            AddRuleForm.find("name", "ProductID")[0].setValue("0");
                            AddRuleForm.find("name", "ProductName")[0].setValue("");
                        }
                    }
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '指定产品',
                    id: 'AppointProducts',
                    checked: true,
                    name: 'AllProducts',
                    anchor: "100%"
                }]
            }, {
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    labelWidth: 10,
                    //width: 480,
                    defaults: { labelAlign: "right" },
                    items: [{
                        xtype: 'hidden',
                        fieldLabel: '产品ID',
                        name: 'ProductID',
                        anchor: '96%'
                    }, {
                        xtype: "textfield",
                        name: "ProductName",
                        anchor: "100%"
                    }]
                }, {
                    layout: "hbox",
                    bodyStyle: "margin:0 5px",
                    width: 70,
                    items: [{
                        xtype: "button",
                        boxMinWidth: 40,
                        width: 60,
                        text: " 产品",
                        handler: function () {
                            productWindow.show();
                        }
                    }]
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '无',
                    id: 'NoneProducts',
                    checked: true,
                    name: 'AllProducts',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('NoneProducts').dom.checked) {
                            AddRuleForm.find("name", "ProductID")[0].setValue("-1");
                            AddRuleForm.find("name", "ProductName")[0].setValue("");
                        }
                    }
                }]
            }
            ]
        }, {
            xtype: "fieldset",
            title: "售卡定义",
            collapsible: true,
            collapsed: false,
            defaults: { labelAlign: "right" },
            items: [{
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '全部卡类型',
                    id: 'AllCards',
                    checked: true,
                    name: 'AllCardType',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('AllCards').dom.checked) {
                            AddRuleForm.find("name", "SellCardType")[0].setValue("0");
                            AddRuleForm.find("name", "SellCardName")[0].setValue("");
                        }
                    }
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '指定卡类型',
                    id: 'AppointCard',
                    checked: true,
                    name: 'AllCardType',
                    anchor: "100%"
                }]
            }, {
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    labelWidth: 10,
                    //width: 480,
                    defaults: { labelAlign: "right" },
                    items: [{
                        xtype: 'hidden',
                        fieldLabel: '售卡类型ID',
                        name: 'SellCardType',
                        anchor: '96%'
                    }, {
                        xtype: "textfield",
                        name: "SellCardName",
                        anchor: "100%"
                    }]
                }, {
                    layout: "hbox",
                    bodyStyle: "margin:0 5px",
                    width: 70,
                    items: [{
                        xtype: "button",
                        boxMinWidth: 40,
                        width: 60,
                        text: "指定卡",
                        handler: function () {
                            cardWindow.show();
                        }
                    }]
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '无',
                    id: 'NoneCard',
                    checked: true,
                    name: 'AllCardType',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('NoneCard').dom.checked) {
                            AddRuleForm.find("name", "SellCardType")[0].setValue("-1");
                            AddRuleForm.find("name", "SellCardName")[0].setValue("");
                        }
                    }
                }]
            }
            ]
        }, {
            xtype: "fieldset",
            title: "充值定义",
            collapsible: true,
            collapsed: false,
            defaults: { labelAlign: "right" },
            items: [{
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '全部卡类型',
                    id: 'AllRechargeCards',
                    checked: true,
                    name: 'AllSupplement',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('AllRechargeCards').dom.checked) {

                            AddRuleForm.find("name", "RechargeCardType")[0].setValue("0");
                            AddRuleForm.find("name", "RechargeName")[0].setValue("");
                        }
                    }
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '指定卡类型',
                    id: 'AppointRechargeCards',
                    checked: true,
                    name: 'AllSupplement',
                    anchor: "100%"
                }]
            }, {
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    labelWidth: 10,
                    //width: 480,
                    defaults: { labelAlign: "right" },
                    items: [{
                        xtype: 'hidden',
                        fieldLabel: '充值卡类型ID',
                        name: 'RechargeCardType',
                        anchor: '96%'
                    }, {
                        xtype: "textfield",
                        name: "RechargeName",
                        anchor: "100%"
                    }]
                }, {
                    layout: "hbox",
                    bodyStyle: "margin:0 5px",
                    width: 70,
                    items: [{
                        xtype: "button",
                        boxMinWidth: 40,
                        width: 60,
                        text: " 指定卡",
                        handler: function () {
                            RechargeCardWindow.show();
                        }
                    }]
                }]
            }, {
                //bodyStyle: 'padding:0 0 10 0',
                height: 20,
                items: [
                {
                    xtype: "radio",
                    boxLabel: '无',
                    id: 'NoneRechargeCards',
                    checked: true,
                    name: 'AllSupplement',
                    anchor: "100%",
                    handler: function () {
                        if (Ext.get('NoneRechargeCards').dom.checked) {

                            AddRuleForm.find("name", "RechargeCardType")[0].setValue("-1");
                            AddRuleForm.find("name", "RechargeName")[0].setValue("");
                        }
                    }
                }]
            }
            ]
        }, {
            xtype: "fieldset",
            title: "规则定义",
            collapsible: true,
            collapsed: false,
            defaults: { labelAlign: "left", labelWidth: 60 },

            items: [{
                layout: "form",
                items: [{
                    xtype: 'combo',
                    fieldLabel: '规则模式',
                    LabelAlign: "right",
                    hiddenName: 'RuleID',
                    editable: false,
                    forceSelection: true,
                    //mode: 'local',
                    //emptyText: 'Select a model...',
                    store: storeRules,
                    displayField: "Title",
                    valueField: "ID",
                    //mode: "local",
                    triggerAction: "all",
                    anchor: '95%',
                    listeners: {
                        select: function (combo, record, value) {
                            var ruleID = AddRuleForm.find("hiddenName", "RuleID")[0].getValue();

                            if (ruleID == 1) {
                                AddRuleForm.findById("Cost").setVisible(true);
                                AddRuleForm.findById("RMB").setVisible(true);

                                AddRuleForm.findById("Give").setVisible(true);
                                AddRuleForm.findById("GivePoint").setVisible(true);

                                AddRuleForm.findById("BasePoint").setVisible(false);
                                AddRuleForm.findById("Multiple").setVisible(false);
                            } else if (ruleID == 2) {
                                AddRuleForm.findById("Cost").setVisible(false);
                                AddRuleForm.findById("RMB").setVisible(false);

                                AddRuleForm.findById("Give").setVisible(false);
                                AddRuleForm.findById("GivePoint").setVisible(false);

                                AddRuleForm.findById("BasePoint").setVisible(true);
                                AddRuleForm.findById("Multiple").setVisible(true);
                            } else if (ruleID == 3) {
                                AddRuleForm.findById("Cost").setVisible(false);
                                AddRuleForm.findById("RMB").setVisible(false);

                                AddRuleForm.findById("Give").setVisible(false);
                                AddRuleForm.findById("GivePoint").setVisible(false);

                                AddRuleForm.findById("BasePoint").setVisible(true);
                                AddRuleForm.findById("Multiple").setVisible(true);
                            } else if (ruleID == 4) {

                            }
                        }
                    }

                }]
            }]
        }, {
            xtype: "fieldset",
            title: "规则参数",
            collapsible: true,
            collapsed: false,
            defaults: { labelAlign: "left", labelWidth: 20 },

            items: [{
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    //width: 550,
                    labelWidth: 30,
                    defaults: { labelAlign: "left", labelWidth: 10 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '满',
                        name: 'Cost',
                        id: 'Cost',
                        anchor: '100%'
                    }]
                }, {
                    layout: "form",
                    //width: 10,
                    labelWidth: 5,
                    autoWidth: true,
                    autoHeight: true,
                    height: 50,
                    labelAlign: "left",
                    //defaults: { labelAlign: "left", labelWidth: 20,autoHeight:true },
                    items: [{
                        //labelAlign: "left",
                        id: 'RMB',
                        html: "元"
                    }]
                }]
            }, {
                layout: "column",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    //width: 550,
                    labelWidth: 30,
                    defaults: { labelAlign: "left", labelWidth: 10 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '送',
                        name: 'Give',
                        id: 'Give',
                        anchor: '100%'
                    }]
                }, {
                    layout: "form",
                    //width: 10,
                    labelWidth: 5,
                    autoWidth: true,
                    autoHeight: true,
                    height: 50,
                    labelAlign: "left",
                    //defaults: { labelAlign: "left", labelWidth: 20,autoHeight:true },
                    items: [{
                        //labelAlign: "left",
                        id: 'GivePoint',
                        html: "积分"
                    }]
                }]
            },
            //基础积分N倍
            {
            layout: "column",
            items: [{
                layout: "form",
                columnWidth: 0.95,
                //width: 550,
                labelWidth: 60,
                defaults: { labelAlign: "left", labelWidth: 10 },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '基础积分',
                    name: 'BasePoint',
                    id: 'BasePoint',
                    anchor: '100%'
                }]
            }, {
                layout: "form",
                //width: 10,
                labelWidth: 5,
                autoWidth: true,
                autoHeight: true,
                height: 50,
                labelAlign: "left",
                //defaults: { labelAlign: "left", labelWidth: 20,autoHeight:true },
                items: [{
                    //labelAlign: "left",
                    id: 'Multiple',
                    html: "倍"
                }]
            }]
        },

            {
                layout: "form",
                items: [{
                    layout: "form",
                    columnWidth: 0.95,
                    //width: 550,
                    labelWidth: 30,
                    defaults: { labelAlign: "left", labelWidth: 20 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '摘要',
                        name: 'Summary',
                        anchor: '100%'
                    },
                    //设值字段
                    {
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: '积分条件',
                    name: 'RuleCondition',
                    anchor: '100%'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: '积分数量，或者基于基本积分N倍数',
                    name: 'PointCount',
                    anchor: '100%'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: '积分规则条件',
                    name: 'PointCondition',
                    anchor: '100%'
                }
                    ]
            }]
        }
			]
    }, {
        buttons: [{
            text: '保  存',
            handler: function () {
                //AddRule();

                //积分规则ID
                var rid = AddRuleForm.find("hiddenName", "RuleID")[0].getValue();
                if (rid == 1) {
                    //满多少元
                    var cost = AddRuleForm.find("name", "Cost")[0].getValue();
                    AddRuleForm.find("name", "RuleCondition")[0].setValue(cost);
                    //送多少分
                    var givepoint = AddRuleForm.find("name", "Give")[0].getValue();
                    AddRuleForm.find("name", "PointCount")[0].setValue(givepoint);

                    AddRuleForm.find("name", "Summary")[0].setValue('满' + cost + '送' + givepoint);
                    AddRuleForm.find("name", "PointCondition")[0].setValue('{RuleCondition:' + cost + ',PointCount:' + givepoint + '}');
                }

                if (rid == 2 || rid == 3) {
                    //N倍积分
                    var multiple = AddRuleForm.find("name", "BasePoint")[0].getValue();
                    AddRuleForm.find("name", "RuleCondition")[0].setValue("0");
                    AddRuleForm.find("name", "PointCount")[0].setValue(multiple);
                    if (rid == 2) {
                        AddRuleForm.find("name", "Summary")[0].setValue(multiple + '倍积分');
                    }

                    if (rid == 3) {
                        AddRuleForm.find("name", "Summary")[0].setValue('生日' + multiple + '倍积分');
                    }

                    AddRuleForm.find("name", "PointCondition")[0].setValue('{PointTime:' + multiple + '}');
                }

                var DateStart = DateToString(AddRuleForm.find("name", "DateStart")[0].getValue());
                var DateEnd = DateToString(AddRuleForm.find("name", "DateEnd")[0].getValue());

                AddRuleForm.find("name", "ActivityDate")[0].setValue(DateStart + '~' + DateEnd);

                var actID = AddRuleForm.find("name", "ActivityID")[0].getValue();
                
                if (actID == 0 || actID == "") {
                    AddRuleForm.find("name", "ActivityID")[0].setValue(aID);
                }
                //                alert("ActivityID=" + AddRuleForm.find("name", "ActivityID")[0].getValue());
                //                alert("ListID=" + AddRuleForm.find("name", "ListID")[0].getValue());
                //添加修改规则
                ActivityList();

            }
        }, {
            text: '取  消',
            handler: function () {
                AddRuleForm.getForm().reset();
                AddRuleWindow.hide();
            }
        }]
    }
        ]
});

function ActivityList() {
    AddRuleForm.getForm().submit({
        waitMsg: "正在提交，请稍候...",
        url: "../Apis/PointActivityMgr.aspx?actionName=InsertActivityList&sid=" + Sys.sid,
        success: function (form, action) {
            //addform.body.unmask();
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {
                AddRuleForm.getForm().reset();
                AddRuleWindow.hide();
                ActivityStore.reload();
            }

            //操作成功
        },
        failure: function (form, action) {
            if (action != undefined && action.result != undefined) {
                Ext.MessageBox.alert("提醒", action.result.msg);
            } else {
                Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
            }
            //addform.body.unmask();
        }
    });
};


    //新增活动窗口
    var AddRuleWindow = new Ext.Window({
        layout: 'fit',
        width: 650,
        autoScroll: true,
        height: 500,
        modal: true,
        closeAction: 'hide',
        title: "新增活动规则",
        plain: true,
        items: [AddRuleForm]
    });



    //==========================================添加规则窗口 结束======================================================//

//主容器
var pd_main_panel = new Ext.Panel({
    //autoScroll: true,
    border:false,
    //autoWidth:true,
    layout: "anchor",
    //anchorSize: { width: 800, height: 600 },
    items: [{
        frame: true,
        border:false,
        items: [pd_top_form]
    }, {
        layout:"fit",
        border: false,
        anchor: '-1 -100',
        items: [pd_grid]
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();
