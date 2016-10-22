//收银员管理

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    //autoWidth:true,
    items: [{
        id: "sw",
        xtype: "fieldset",
        //title: "查询条件",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 80 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: "添   加",
                handler: function () {
                    dutyWindow.show();
                    SetDuty();
                }
            }, {
                xtype: 'hidden',
                fieldLabel: '职位ID',
                name: 'DutyID',
                anchor: '96%'
            }, {
                xtype: 'hidden',
                fieldLabel: '需删除的ID',
                name: 'DelID',
                anchor: '96%'
            }]
        }, {
            layout: "form",
            columnWidth: 0.1,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: "删   除",
                handler: function () {
                    var selModel = pd_grid.getSelectionModel();
                    if (selModel.hasSelection()) {
                        Ext.Msg.confirm("警告", "确定要删除吗？", function (button) {
                            if (button == "yes") {
                                var selections = selModel.getSelections();
                                Ext.each(selections, function (item) {
                                    //pd_store.remove(item);
                                    pd_top_form.find("name", "DelID")[0].setValue(item.get("ID"));
                                    DelDutyID();
                                });
                            }
                        });
                    }
                    else {
                        Ext.Msg.alert("错误", "没有任何行被选中，无法进行删除操作！");
                    }
                }
            }]
        }]

    }]
});

function DelDutyID() {
    if (pd_top_form.getForm().isValid()) {
        pd_top_form.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/CasherMgr.aspx?actionName=DelDutyID&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", "删除职位成功！");
                if (action.result.success) {
                    pd_store.reload();
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



var fm = Ext.form;

//定义 勾选框SM
var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
//定义列
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        //id: "Code",
        header: 'ID',
        dataIndex: 'ID',
        hidden:true,
        width: 80
    }, 
    {
        //id: "Code",
        header: '职位编码',
        dataIndex: 'Code',
        width: 80
    }, {
        //id: "Title",
        header: '职位名称',
        dataIndex: 'Title',
        width: 250
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed

    autoDestroy: true,
    autoLoad: true,
    // load remote data using HTTP
    url: "../Apis/CasherMgr.aspx?actionName=GetCasherKey&sid=" + Sys.sid,

    // specify a XmlReader (coincides with the XML format of the returned data)
    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        root: 'rows',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: 'Code', mapping: 'Code' },
                { name: 'Title', mapping: 'Title' }
            ]
    })

    //sortInfo: { field: 'Code', direction: 'ASC' }
});
//
pd_store.on('load', function (store, records) {
    //加载成功后，读取客户信息
    /*pd_top_form.load({
    params: pd_top_form.getForm().getValues()
    });*/
});

pd_store.on("loadexception", function (mis) {

    //Ext.MessageBox.alert("提醒", "没有该积分账户！");
    //pd_store.removeAll();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});


//========================职位 开始 ========================//

//职位树 
var dutyTree = new Ext.tree.TreePanel({
    dataUrl: '../Apis/CasherMgr.aspx?actionName=GetDuty&sid=' + Sys.sid,
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
            GetDutyData();
        }
    }
});
//ptree.expandAll();

//职位窗口
var dutyWindow = new Ext.Window({
    title: '设置职位',
    closeAction: 'hide',
    width: 350,
    height: 300,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [dutyTree],
    buttons: [{
        text: '设置',
        handler: function () {
            //deptWindow.body.mask("正在提交，请稍候。");
            var dutyname = '';
            var msg = '', selNodes = dutyTree.getChecked();
            Ext.each(selNodes, function (node) {
                if (msg.length > 0) {
                    msg += ',';
                }
                msg += node.id;
                //alert(msg);

                /*
                if (dutyname.length > 0) {
                dutyname += ', ';
                }
                dutyname += node.text;
                if (dutyname != null) {
                pd_top_form.find("name", "DeptName")[0].setValue(deptname);
                }*/
            });
            pd_top_form.find("name", "DutyID")[0].setValue(msg);
            //alert(msg);
            SetDutyID();
            /*
            AddRuleForm.find("name", "DeptID")[0].setValue(msg);
            AddRuleForm.find("name", "DeptRegion")[0].setValue("-1");
            AddRuleForm.find("name", "Region")[0].setValue("");
            */
            dutyWindow.hide();
        }
    }, {
        text: '取消',
        handler: function () {
            dutyWindow.hide();
        }
    }]
})

function SetDuty() {
    dutyWindow.show();
    dutyTree.getRootNode().reload();
}


function SetDutyID() {
    if (pd_top_form.getForm().isValid()) {
        pd_top_form.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/CasherMgr.aspx?actionName=SetDutyID&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", "添加职位成功！");
                if (action.result.success) {
                    pd_store.reload();
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

function GetDutyData() {
    dutyWindow.body.mask("Loading...");
    Ext.Ajax.request({
        url: "../Apis/CasherMgr.aspx?actionName=GetDutyID&sid=" + Sys.sid,
        //params: "ListID=" + ListID,
        method: "POST",
        success: function (response) {
            var data = Ext.util.JSON.decode(response.responseText);

            if (data != "") {
                var id = data[0].id;
                var str = new Array();
                str = id.split(",");
                for (var j = 0; j < str.length; j++) {

                    var node = dutyTree.getNodeById(str[j].toString().trim());

                    if (node != undefined) {
                        node.getUI().toggleCheck(true);
                    }
                }
            }
            dutyWindow.body.unmask();
        }
    })
}


//========================职位 结束 ========================//



//主容器
var pd_main_panel = new Ext.Panel({
    //autoScroll: true,
    border: false,
    //autoWidth:true,
    layout: "anchor",
    //anchorSize: { width: 800, height: 600 },
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -50',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
