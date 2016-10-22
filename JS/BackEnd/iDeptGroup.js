var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    //autoWidth:true,
    items: [{
        layout: "column",
        xtype: "fieldset",
        title: "查询条件",
        defaults: { labelAlign: "right", width: 80 },
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "组名称",
                name: "iDeptGroup",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "门店名",
                name: "iDeptName",
                anchor: "100%"
            }, {
                buttons: [{
                    boxMinWidth: 40,
                    width: 100,
                    text: " 添加组",
                    handler: function () {
                        AddExchangeForm.getForm().reset();
                        getCheck();
                        pd_group_store.removeAll();
                        pd_idept_store.removeAll();
                        AddExchangeWindow.show();
                    }
                }, {
                    boxMinWidth: 40,
                    width: 100,
                    text: " 删除组",
                    handler: function () {
                        var r = pd_grid.getSelectionModel().getSelections(); ;
                        if (r.length == 0) {
                            Ext.MessageBox.alert("警告", "至少选择一条信息，删除数据！");
                        } else {
                            var id = pd_grid.getSelectionModel().getSelected().get("ID");
                            var DeptTitle = pd_grid.getSelectionModel().getSelected().get("DeptTitle");
                            Ext.MessageBox.confirm("提示", "是否确定删除？", function (btn) {
                                if (btn == "yes") {
                                    DeletedGroup(id, DeptTitle);
                                }
                            });
                        }
                    }
                }]
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 100,
            columnWidth: 0.2,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    var ideptgroup = pd_top_form.find("name", "iDeptGroup")[0].getValue();
                    var ideptname = pd_top_form.find("name", "iDeptName")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { iDeptGroup: ideptgroup, iDeptName: ideptname }
                    });
                }
            }

            ]
        }]

    }]
});
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    {
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    },
    {
        header: '组名称',
        dataIndex: 'limitGroupTitle',
        width: 130
    }, {
        header: '备注',
        dataIndex: 'MemoInfo',
        width: 170
    }, {
        header: '门店',
        dataIndex: 'DeptTitle',
        width: 500
    }]
});
function DeletedGroup(id, DeptTitle) {
    pd_top_form.getForm().submit({
        params: { id: id, IsDeleted: 1, DeptTitle: DeptTitle },
        waitMsg: "正在提交，请稍候...",
        url: "../Apis/DeptGroup.aspx?actionName=iDeptLimitGroup&sid=" + Sys.sid,
        success: function (form, action) {
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {
                var selections = pd_grid.selModel.getSelections();
                Ext.each(selections, function (item) {
                    pd_store.remove(item);
                    pd_store.removed.push(item);
                });
            }
            //操作成功.
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

var pd_store = new Ext.data.Store({

    url: '../Apis/DeptGroup.aspx?actionName=getDeptGroup&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: 'ID', mapping: 'Id' },
                { name: 'limitGroupTitle', mapping: 'Title' },
                { name: "MemoInfo", mapping: "MemoInfo" },
                { name: "DeptTitle", mapping: "ideptTitle" }
            ]
    })
});
pd_store.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "未查到数据!");
    pd_store.removeAll();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    stripeRows: true,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});
var AddExchangeForm = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    // width:700,
    // heigh: 100,
    //autoWidth:true,
    reader: new Ext.data.JsonReader({
        //root: "data",
        fields: [
        { name: "ID", mapping: "ID" },
        { name: "Code", mapping: "Code" },
        { name: "Title", mapping: "Title" },
        { name: "MemoInfo", mapping: "MemoInfo"}]
    }),
    items: [{
        xtype: "fieldset",
        title: "组基础信息",
        defaults: { labelAlign: "right", width: 80 },
        layout: "column",
        items: [{
            columnWidth: .5,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'ID',
                name: "ID",
                hidden: true
            }, {
                xtype: 'textfield',
                fieldLabel: '编号',
                name: 'Code',
                anchor: '90%'
            }]

        }, {
            columnWidth: .5,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '名称',
                name: 'Title',
                anchor: '90%'
            }]
        }, {
            columnWidth: 1,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '备注',
                name: 'MemoInfo',
                anchor: '95%'
            }]
        }]
    }]
});

var ideptlimititemgridcm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [new Ext.grid.RowNumberer(),
     {
         header: '名称',
         dataIndex: 'Title',
         width: 120
     }, {
         header: '数量',
         dataIndex: 'LimitCount',
         width: 120
     }, {
         header: '限制类别',
         dataIndex: 'LimitType',
         width: 100,
         renderer: function (v) {
             return rtype(v);
         }
     }, {
         header: '备注',
         dataIndex: 'MemoInfo',
         width: 100
     }]
});
var pd_deptlimititem_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/DeptGroup.aspx?actionName=getDeptLimitItem&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'plant',
        fields: [
                { name: "ID", mapping: "id" },
                { name: "LimitType", mapping: "limitType" },
                { name: "LimitCount", mapping: "limitCount" },
                { name: 'Title', mapping: 'title' },
                { name: 'MemoInfo', mapping: 'memoInfo' }
            ]
    })
});
var ideptlimititemgrid = new Ext.grid.GridPanel({
    height: 260,
    store: pd_deptlimititem_store,
    autoScroll: true,
    cm: ideptlimititemgridcm,
    border: false,
    stripeRows: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true,
    tbar: [
    {
        text: '添加限制项',
        iconCls: 'silk-add',
        handler: function () {
            var r = ideptlimititemgrid.getSelectionModel().getSelections();
            if (r.length == 0) {
                Ext.MessageBox.alert('警告', '最少选择一条数据!');
            } else {
                var limitType = ideptlimititemgrid.getSelectionModel().getSelected().get("LimitType");
                if (pd_group_store.getCount() > 0) {
                    for (var i = 0; i < pd_group_store.getCount(); i++) {
                        var rec = pd_group_store.getAt(i);
                        if (rec.get("LimitType") == limitType) {
                            Ext.MessageBox.alert("警告", "限制类型已存在！");
                            return;
                        }
                    }

                    var id = ideptlimititemgrid.getSelectionModel().getSelected().get("ID");
                    var limitCount = ideptlimititemgrid.getSelectionModel().getSelected().get("LimitCount");
                    var title = ideptlimititemgrid.getSelectionModel().getSelected().get("Title");
                    var memoInfo = ideptlimititemgrid.getSelectionModel().getSelected().get("MemoInfo");
                    var newEmpModel = pd_group_store.recordType;
                    var newEmp = new newEmpModel({
                        limitId: id,
                        LimitType: limitType,
                        LimitCount: limitCount,
                        Title: title,
                        MemoInfo: memoInfo
                    });
                    pd_group_store.insert(0, newEmp);
                    IdeptGroupWindow.hide();
                } else {
                    var id = ideptlimititemgrid.getSelectionModel().getSelected().get("ID");
                    var title = ideptlimititemgrid.getSelectionModel().getSelected().get("Title");
                    var memoInfo = ideptlimititemgrid.getSelectionModel().getSelected().get("MemoInfo");
                    var limitCount = ideptlimititemgrid.getSelectionModel().getSelected().get("LimitCount");
                    var newEmpModel = pd_group_store.recordType;
                    var newEmp = new newEmpModel({
                        limitId: id,
                        LimitType: limitType,
                        LimitCount: limitCount,
                        Title: title,
                        MemoInfo: memoInfo
                    });
                    pd_group_store.insert(0, newEmp);
                    IdeptGroupWindow.hide();
                }
            }
        }
    }]
});

var IdeptGroupWindow = new Ext.Window({
    layout: 'fit',
    width: 500,
    height: 260,
    modal: true,
    //autoScroll: true,
    closeAction: 'hide',
    title: "添加限制项",
    items: [ideptlimititemgrid]
});
var pd_group_store = new Ext.data.Store({
    autoDestroy: true,
    //    url: "../Apis/DeptGroup.aspx?actionName=getDeptLimitItem&sid=" + Sys.sid,
    url: "../Apis/DeptGroup.aspx?actionName=getiDeptLimitItemById&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        totalProperty: "results",
        id: 'name',
        fields: [
                { name: "ID", mapping: "id" },
                { name: "limitId", mapping: "limitId" },
                { name: "LimitType", mapping: "limitType" },
                { name: "LimitCount", mapping: "limitCount" },
                { name: 'Title', mapping: 'title' },
                { name: 'MemoInfo', mapping: 'memoInfo' }
            ]
    })

});
var cardgridcm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [{
        header: '名称',
        dataIndex: 'Title',
        width: 120
    }, {
        header: '数量',
        dataIndex: 'LimitCount',
        width: 100
    }, {
        header: '限制类别',
        dataIndex: 'LimitType',
        width: 100,
        renderer: function (v) {
            return rtype(v);
        }
    }, {
        header: '备注',
        dataIndex: 'MemoInfo',
        width: 100
    }]
});
var cardgrid = new Ext.grid.GridPanel({
    height: 150,
    store: pd_group_store,
    autoScroll: true,
    cm: cardgridcm,
    margins: "2 2 2 2",
    border: false,
    stripeRows: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true,
    tbar: [
    {
        text: '添加限制项',
        iconCls: 'silk-add',
        handler: function () {
            pd_deptlimititem_store.load();
            IdeptGroupWindow.show();
        }
    }, {
        text: '删除限制项',
        iconCls: "silk-book",
        handler: function () {
            var r = cardgrid.getSelectionModel().getSelections();
            if (r.length == 0) {
                Ext.MessageBox.alert('警告', '最少选择一条数据!');
            } else {
                var rows = cardgrid.getSelectionModel().getSelections();
                for (var i = 0; i < rows.length; i++) {
                    pd_group_store.remove(rows[i]);
                }
            }
        }
    }]
});


var accountcard_balance_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    items: [{
        xtype: "fieldset",
        collapsible: true,
        title: "限制项",
        items: [cardgrid]
    }]
});

var cardgridcm2 = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
    columns: [{
        header: "ID",
        dataIndex: "ID",
        hidden: true
    }, {
        header: '编号',
        dataIndex: 'Code',
        width: 120
    }, {
        header: '名称',
        dataIndex: 'Title',
        width: 100
    }]
});
var pd_idept_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/DeptGroup.aspx?actionName=getiDept&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'plant',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "Code", mapping: "Code" },
                { name: 'Title', mapping: 'Title' }
            ]
    })
})
var cardgrid2 = new Ext.grid.GridPanel({
    store: pd_idept_store,
    cm: cardgridcm2,
    margins: "2 2 2 2",
    frame: true,
    height: 150,
    stripeRows: true,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    loadMask: true,
    tbar: [
    {
        text: '添加门店',
        iconCls: 'silk-add',
        handler: function () {
            SelectDeptWindow.show();
        }
    }, {
        text: '删除门店',
        iconCls: "silk-book",
        handler: function () {
            var r = cardgrid2.getSelectionModel().getSelections();
            if (r.length == 0) {
                Ext.MessageBox.alert('警告', '最少选择一个门店!');
            } else {
                var rows = cardgrid2.getSelectionModel().getSelections();
                for (var i = 0; i < rows.length; i++) {
                    pd_idept_store.remove(rows[i]);
                }
            }
        }
    }]
});

var accountcard_balance_form2 = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    items: [{
        xtype: "fieldset",
        collapsible: true,
        title: "门店",
        items: [cardgrid2]
    }]
});
function getCheck() {
    var selNodes = ptree.getRootNode();
    if (selNodes.length == 0) {

    }
    else {
        selNodes.ui.toggleCheck(false);
        selNodes.attributes.checked = false;
        selNodes.fireEvent('click', selNodes, false);
        findchildnode(selNodes);
    }

}
function findchildnode(node) {
    var childnodes = node.childNodes;
    var rootnode;
    for (var i = childnodes.length; i > 0; i--) {  //从节点中取出子节点依次遍历
        rootnode = childnodes[0];
        rootnode.ui.toggleCheck(false);
        rootnode.attributes.checked = false;
        rootnode.fireEvent('click', rootnode, false);
    }
}

var ptree = new Ext.tree.TreePanel({
    dataUrl: '../Apis/Dept.aspx?actionName=GetDeptTitle&sid=' + Sys.sid,
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
        text: "门店全选"
    }
});
ptree.on('checkchange', function (node, checked) {
    if (checked) {
        var Code = "";
        var ID = "";
        var Title = "";
        var id = node.id;
        var count;
        for (var i = 0; i < pd_idept_store.getCount(); i++) {
            var rec = pd_idept_store.getAt(i);
            if (rec.get("ID") == id) {
                count = 1;
            }
        }
        if (count == 1) {

        }
        else {
            var txt = node.attributes.text;
            if (Title.indexOf(txt) < 0 && txt != "门店全选") {
                Title = Title + txt;
            }
            var code = node.attributes.code;
            if (Code.indexOf(code) < 0 && txt != "门店全选") {
                Code = Code + code;
            }

            if (ID.indexOf(id) < 0 && !isNaN(id)) {
                ID = ID + id;
            };
            var newEmpModel = pd_idept_store.recordType;
            var newEmp = new newEmpModel({
                ID: ID,
                Code: Code,
                Title: Title
            });
            if (Title != "") {
                pd_idept_store.insert(0, newEmp);
            }
        }
    } else {
        var id = node.id;
        for (var i = 0; i < pd_idept_store.getCount(); i++) {
            var rec = pd_idept_store.getAt(i);
            if (rec.get("ID") == id) {
                pd_idept_store.remove(rec);
            }
        }
    }
    if (node.hasChildNodes()) {
        node.eachChild(function (child) {
            child.ui.toggleCheck(checked);
            child.attributes.checked = checked;
            child.fireEvent('checkchange', child, checked); //递归调用
        });
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
var btn_save_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    items: [{
        xtype: "fieldset",
        defaults: { labelAlign: "right", width: 100 },
        layout: "column",
        items: [{
            layout: 'form',
            columnWidth: 1,
            buttons: [{
                text: '保  存',
                handler: function () {
                    AddAstrict();
                }
            }, {
                text: '取  消',
                handler: function () {
                    AddExchangeWindow.hide();
                }
            }]

        }]
    }]
});
//保存限制组信息
function AddAstrict() {
    var code = AddExchangeForm.find("name", "Code")[0].getValue();
    var title = AddExchangeForm.find("name", "Title")[0].getValue();
    var id = AddExchangeForm.find("name", "ID")[0].getValue();
    if (code.length == 0) {
        Ext.MessageBox.alert("提示", "请输入组编号！");
        return;
    }
    if (title.length == 0) {
        Ext.MessageBox.alert("提示", "请输入组名称！");
        return;
    }
    if (pd_group_store.getCount() <= 0) {
        Ext.MessageBox.alert("提示", "请添加限制项！");
        return;
    }
    if (pd_idept_store.getCount() <= 0) {
        Ext.MessageBox.alert("提示", "请添加门店！");
        return;
    };
    var iGroupId = "";

    for (var i = 0; i < pd_group_store.getCount(); i++) {
        iGroupId = pd_group_store.getAt(i).get("ID");
    }
    var iDeptId = "";
    var limitId = "";
    for (var i = 0; i < pd_group_store.getCount(); i++) {

        if (i == pd_group_store.getCount() - 1) {
            limitId = limitId + pd_group_store.getAt(i).get("limitId");
//            alert(limitId);
        } else {
            limitId = limitId + pd_group_store.getAt(i).get("limitId") + ",";
        }
    }
    for (var i = 0; i < pd_idept_store.getCount(); i++) {
        if (i == pd_idept_store.getCount() - 1) {
            iDeptId = iDeptId + pd_idept_store.getAt(i).get("ID");
        } else {
            iDeptId = iDeptId + pd_idept_store.getAt(i).get("ID") + ",";
        }
    }
    AddExchangeForm.getForm().submit({

        params: { id: iGroupId, ideptId: iDeptId, idept: id, limitId: limitId },
        waitMsg: "正在提交，请稍候...",
        url: "../Apis/DeptGroup.aspx?actionName=addGroup&sid=" + Sys.sid,
        success: function (form, action) {
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {
                AddExchangeForm.getForm().reset();
                pd_group_store.removeAll();
                pd_idept_store.removeAll();
                pd_store.reload();
            }
            AddExchangeWindow.hide();
            //操作成功
        },
        failure: function (form, action) {
            if (action != undefined && action.result != undefined) {
                Ext.MessageBox.alert("提醒", action.result.msg);
            } else {
                Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
            }

        }
    })
};
//双击事件
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    AddExchangeForm.getForm().reset();
    pd_group_store.removeAll();
    pd_idept_store.removeAll();
    id = r.get("ID");
    AddExchangeForm.load({
        url: "../Apis/DeptGroup.aspx?actionName=getGroup&sid=" + Sys.sid,
        params: { id: id },
        waitMsg: "加载中....."
    });
    AddExchangeWindow.show();
    pd_group_store.load({
        params: { id: id }
    });
    pd_idept_store.load({
        params: { id: id }
    });

});

var AddExchangeWindow = new Ext.Window({
    layout: 'fit',
    width: 700,
    height: 500,
    modal: true,
    //autoScroll: true,
    closeAction: 'hide',
    title: "添加组",
    items: [{
        autoScroll: true,
        items: [AddExchangeForm, accountcard_balance_form, accountcard_balance_form2, btn_save_form]
    }]
});

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
        anchor: '-1 -125',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();