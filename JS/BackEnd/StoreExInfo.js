//门店扩张信息维护

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
	labelWidth:60,
    heigh: 100,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "right", width: 80 },
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "编号",
                name: "Code",
                anchor: "100%"
            },
			combo_DeptStatus,
			{
                xtype: 'hidden',
                name: 'Title'
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "门店",
                name: "Name",
                anchor: "100%"
            }
            ],
            buttons: [
            {
                text: " 查  询",
                handler: function () {
                    var code = pd_top_form.find("name", "Code")[0].getValue();
                    var title = pd_top_form.find("name", "Name")[0].getValue();
					var DeptStatus = pd_top_form.find('hiddenName','DeptStatus')[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { code: code, title: title,DeptStatus: DeptStatus }
                    });
                }
            }, {
                text: " 添  加",
                handler: function () {
                    AddForm.find("name", "RentBegin")[0].setValue("");
                    AddForm.find("name", "DeptTitle")[0].setValue("");
                    AddForm.find("name", "InOrUp")[0].setValue("");
                    AddForm.find("name", "RentEnd")[0].setValue("");
                    AddForm.find("name", "LordTel")[0].setValue("");
                    AddForm.find("name", "Rental")[0].setValue("");
                    AddForm.find("name", "Area")[0].setValue("");
                    AddForm.find("name", "LandLord")[0].setValue("");
                    AddForm.find("name", "BusinessLic")[0].setValue("");
                    AddForm.find("name", "LegalPerson")[0].setValue("");
                    AddWindow.show();
                }
            },
            {
                text: " 删  除",
                handler: function () {
                    delItem();
                }
            }
             ]
        }]

    }]
});

function delItem() {
    var did = getId(pd_grid);
    if (did) {
        Ext.Msg.confirm('确认', '真的要删除此信息吗？', function (btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                    url: "../Apis/StoreExInfo.aspx?actionName=delDept&sid=" + Sys.sid,
                    params: { did: did },
                    success: function (result) {
                        var selections = pd_grid.selModel.getSelections();
                        Ext.each(selections, function (item) {
                            pd_store.remove(item);
                            pd_store.removed.push(item);
                        });
                        var json_str = Ext.util.JSON.decode(result.responseText);
                        Ext.Msg.alert('信息', json_str.msg);
                    },
                    failure: function () {
                        Ext.Msg.alert('信息', '删除失败，稍后再试!');
                    }
                });
            }
        });
    } else {
        Ext.Msg.alert('提示', '你还没有选择要操作的记录！');
    }
}
function getId(pd_grid) {
    var s = pd_grid.getSelectionModel().getSelected();
    if (s) {
        return s.get("ID");
    }
    return 0;
}


//添加Form窗口
var AddForm = new Ext.form.FormPanel({
    frame: true,
    labelWidth: 90,
    layout: "column",
    labelAlign: 'right',
    bodyStyle: "margin:0 -20px",

    items: [
    {
        layout: "form",
        columnWidth: 0.48,
        items: [{
            xtype: 'combo',
            hiddenName: 'DeptID',
            name: 'DeptTitle',
            typeAhead: true,
            fieldLabel: '门店',
            minChars: 1,
            mode: 'remote',
            triggerAction: 'all',
            store: Store_GetDept,
            valueField: 'myId',
            displayField: 'displayText',
            anchor: '100%'
        }, {
            xtype: 'hidden',
            name: 'InOrUp'
        }
        , {
            xtype: "datefield",
            fieldLabel: "租赁期限",
            name: "RentBegin",
            value: new Date(),
            format: 'Y-m-d',
            vtype: 'daterange',
            anchor: "100%",
            allowBlank: false,
            anchor: "100%"
        }]
    }, {
        layout: "form",
        columnWidth: 0.5,
        items: [{
            xtype: "textfield",
            fieldLabel: "房东姓名",
            name: "LandLord",
            anchor: "98%"
        }
        , {
            xtype: "datefield",
            fieldLabel: "到",
            value: new Date(),
            format: 'Y-m-d',
            name: "RentEnd",
            allowBlank: false,
            vtype: 'daterange',
            anchor: "98%"
        }]
    }, {
        layout: 'form',
        columnWidth: 0.48,

        items: [{
            xtype: 'textfield',
            fieldLabel: '电话',
            name: 'LordTel',
            allowBlank: true,
            anchor: '100%'
        }, {
            xtype: 'textfield',
            fieldLabel: '租金(万/年)',
            name: 'Rental',
            allowBlank: true,
            anchor: '100%'
        }
        ]
    }, {
        layout: 'form',
        columnWidth: 0.5,

        items: [{
            xtype: 'textfield',
            fieldLabel: '面积(平方米)',
            name: 'Area',
            allowBlank: true,
            anchor: '98%'
        }, {
            xtype: 'textfield',
            fieldLabel: '法人',
            name: 'LegalPerson',
            anchor: '98%'
        }
        ]
    }, {
        layout: 'column',
        columnWidth: 1,

        items: [{
            layout: 'form',
            columnWidth: 0.48,
            items: [{
                xtype: 'textfield',
                fieldLabel: '营业执照',
                name: 'BusinessLic',
                anchor: '100%'
            }]
        }, {
            layout: 'form',
            columnWidth: 0.5,
            items: [{
            }]
        }
                , {
                    xtype: "hidden",
                    name: "ID"
                }
        ]
    }],
    buttons: [
    {
        text: '保  存',
        handler: function () {
            SelectCode();
          
        }
    }, {
        text: '取  消',
        handler: function () {
            AddForm.getForm().reset();
            AddWindow.hide();
        }
    }]
});

//======判断日期=====
Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        /*
        * Always return true since we're only using this vtype to set the
        * min/max allowed values (these are tested for after the vtype test)
        */
        return true;
    } 
});

//======卡类型选择=====
var ptree = new Ext.tree.TreePanel({
    dataUrl: '../Apis/Dept.aspx?actionName=GetCardType&sid=' + Sys.sid,
    xtype: 'treepanel',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    autoScroll: true,
    root: {
        checked: false,
        expanded: true,
        nodeType: 'async',
        id: "0",
        text: "卡类型全选"
    }
});



//保存所有选择的ID和名称
var ids = ",";
var titles = "";

ptree.on("afterrender", function (t) {
    //只执行一次
    checkNow();
});

//把现有的勾选上
function checkNow() {
    ids = AddForm.find("name", "CardTypeID")[0].getValue();
    var aids = ids.split(",");
    ptree.root.eachChild(function (child) {
        //alert(child.id); return;
        for (var i = 0; i < aids.length; i++) {
            if (child.id == aids[i]) {
                child.ui.toggleCheck(true);
                child.attributes.checked = true;
            }
        }
    });
}

ptree.on('checkchange', function (node, checked) {
    ids = ",";
    titles = "";

    //判断是不是全选
    if (node.id == 0) {
        if (node.hasChildNodes()) {
            node.eachChild(function (child) {
                if (child.id > 0) {
                    ids += child.id + ",";
                    titles += child.text + ",";
                    child.ui.toggleCheck(checked);
                    child.attributes.checked = checked;
                }
            })
        }

        AddForm.find("name", "CardTypeID")[0].setValue(ids);
        AddForm.find("name", "CardType")[0].setValue(titles);
        return;
    } else {

        var checkeds = ptree.getChecked();

        for (var i = 0; i < checkeds.length; i++) {
            if (checkeds[i].id > 0) {
                ids += checkeds[i].id + ",";
                titles += checkeds[i].text + ",";
            }
        }

        AddForm.find("name", "CardTypeID")[0].setValue(ids);
        AddForm.find("name", "CardType")[0].setValue(titles);
    }
});

var SelectDeptWindow = new Ext.Window({
    layout: 'fit',
    width: 400,
    height: 300,
    modal: true,
    closeAction: 'hide',
    title: "店铺选择",
    items: [ptree]
});


//======卡类型选择=====
function InsertOrUp() {
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { cid: AddForm.find("name", "Code")[0].getValue(), uid: getId(pd_grid)},
            url: "../Apis/StoreExInfo.aspx?actionName=submitDept&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                AddWindow.hide();
                pd_store.reload();
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);

                } else {
                    Ext.MessageBox.alert("提醒", "服务器繁忙，请稍候在试！");

                }
            }
        });
    }
}



//查询编号是否存在
function SelectCode() {
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            url: "../Apis/StoreExInfo.aspx?actionName=selectCode&sid=" + Sys.sid,
            success: function (form, action) {
                // Ext.MessageBox.alert("提醒", action.result.msg);
                //pd_store.load();
                if (action.result.success) {
                    if (id == 0) {
                        AddAction();
                    } else {
                        UpdateAction();
                    };
                    pd_store.load();

                }
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {

                    Ext.Msg.confirm('确认', '该门店扩展信息已存在，是否再次添加扩展信息？', function (btn) {
                        if (btn == 'yes') {
                            AddAction();
                        }
                    });
                } else {
                    Ext.MessageBox.alert("提醒", "服务器繁忙，请稍候在试！");
                }
            }
        });
    }
}

//添加
function AddAction() {
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            params: { did: AddForm.find("name", "DeptTitle")[0].getValue(), dtitle: AddForm.find("name", "DeptTitle")[0].getRawValue() },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/StoreExInfo.aspx?actionName=submitDept&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                AddForm.find("name", "LandLord")[0].setValue("");
                AddForm.find("name", "RentBegin")[0].setValue("");
                AddForm.find("name", "RentEnd")[0].setValue("");
                AddForm.find("name", "LordTel")[0].setValue("");
                AddForm.find("name", "Rental")[0].setValue("");
                AddForm.find("name", "Area")[0].setValue("");
                AddForm.find("name", "LegalPerson")[0].setValue("");
                AddForm.find("name", "BusinessLic")[0].setValue("");
                //操作成功

                AddWindow.hide();
                pd_store.reload();
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
//修改
function UpdateAction() {

    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/StoreExInfo.aspx?actionName=submitDept&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                AddWindow.hide();
                pd_store.reload();
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
            }
        });
    };
}

//添加Window窗口
var AddWindow = new Ext.Window({
    width: 550,
    minWidth: 400,
    autoScroll: true,
    modal: true,
    closeAction: 'hide',
    title: "添加门店扩张信息",
    plain: true,
    items: [AddForm]
});


//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        header: 'ID',
        dataIndex: 'ID',
        ID: "MyId",
        hidden: true,
        width: 90
    }, {
        header: 'DeptID',
        dataIndex: 'DeptID',
        hidden: true
    },
    {
        header: '编号',
        dataIndex: 'Code',
        width: 70
    }, {
        header: '门店',
        dataIndex: 'Title',
        width: 100
    },{
		header:'门店状态',
		dataIndex:'DeptStatus',
		width:70
	}, {
        header: "房东姓名",
        dataIndex: "LandLord",
        width: 90
    }, {
        header: "租赁期限(开始)",
        dataIndex: "RentBegin",
        renderer: ConvertJSONDateToJSDateObjectTextField,
        width: 120
    }, {
        header: "租赁期限(结束)",
        dataIndex: "RentEnd",
        renderer:ConvertJSONDateToJSDateObjectTextField,
        width: 120
    },
    {
        header: "营业执照",
        dataIndex: "BusinessLic",
        width: 70
    }, {
        header: "电话",
        dataIndex: "LordTel",
        width: 100
    }, {
        header: "租金",
        dataIndex: "Rental",
        width: 70
    }, {
        header: "面积",
        dataIndex: "Area",
        width: 70
    }, {
        header: "法人",
        dataIndex: "LegalPerson",
        width: 70
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/StoreExInfo.aspx?actionName=getDataByParms&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "Code", mapping: "Code" },
                { name: "DeptStatus",convert:DeptStatus},
				{ name: "LandLord", mapping: "LandLord" },
                { name: "RentBegin", mapping: "RentBegin" },
                { name: "RentEnd", mapping: "RentEnd" },
                { name: "LordTel", mapping: "LordTel" },
                { name: "Rental", mapping: "Rental" },
                { name: "Area", mapping: "Area" },
                { name: "Title", mapping: "Title" },
                { name: "StoreTitle", mapping: "StoreTitle" },
                { name: "LegalPerson", mapping: "LegalPerson" },
                { name: "BusinessLic", mapping: "BusinessLic" },
                { name: "ID", mapping: "ID" },
                { name: "DeptID", mapping: "DeptID" }
            ]
    })
    ,
    listeners: {
        'beforeload': function () {
            pd_store.baseParams.start = 0;
            pd_store.baseParams.limit = 20;
            
        }
    }
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    stripeRows: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    bbar:new Ext.PagingToolbar({
			pageSize: 20,
			store: pd_store,
			displayInfo: true,
			displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
			emptyMsg: "没有记录"
		}),
    loadMask: true
});
AddForm.getForm().reset();
//表格添加双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    AddForm.getForm().reset();
    var r = pd_grid.getStore().getAt(rowindex);
    AddForm.find("name", "LandLord")[0].setValue(r.get("LandLord"));
    AddForm.find("name", "RentBegin")[0].setValue(ConvertJSONDateToJSDateObjectTextField(r.get("RentBegin")));
    AddForm.find("name", "RentEnd")[0].setValue(ConvertJSONDateToJSDateObjectTextField(r.get("RentEnd")));
    AddForm.find("name", "LordTel")[0].setValue(r.get("LordTel"));
    AddForm.find("name", "Rental")[0].setValue(r.get("Rental"));
    AddForm.find("name", "Area")[0].setValue(r.get("Area"));
    AddForm.find("name", "LegalPerson")[0].setValue(r.get("LegalPerson"));
    AddForm.find("name", "BusinessLic")[0].setValue(r.get("BusinessLic"));
    AddForm.find("name", "ID")[0].setValue(r.get("ID"));
    AddForm.find("name", "InOrUp")[0].setValue(r.get("ID"));

    AddForm.find("hiddenName", "DeptID")[0].setValue(r.get("DeptID"));
    AddWindow.show();
});

//主容器
var pd_main_panel = new Ext.Panel({
    layout: "anchor",
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -125',
        items: [pd_grid]
    }]
});
Store_GetDept.load();
centerPanel.add(pd_main_panel);
centerPanel.doLayout();