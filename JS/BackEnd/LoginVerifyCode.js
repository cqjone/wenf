//门店限制操作项
var id = 0;

var pd_top_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 80 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "卡号",
                name: "CardNo",
                anchor: "95%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "员工姓名",
                name: "EmpName",
                anchor: "98%"
            }],
            //bodyStyle: "margin:0 30px",
            buttons: [
            {
                width: 80,
                text: " 查  询",
                handler: function () {
                    var deptName = pd_top_form.find("name", "CardNo")[0].getValue();
                    var mobileNo = pd_top_form.find("name", "EmpName")[0].getValue();
                    pd_store.removeAll();
                    pd_store.load({
                        params: { CardNo: deptName, EmpName: mobileNo }
                    });
                }
            },
            {
                width: 120,
                text: "生成验证码",
                handler: function () {
                    id = 0;
                    AddForm.getForm().reset();
                    AddWindow.show();
                    tar_store.load();
                   // AddForm.getForm().findField('DeptID').el.dom.disabled = false;
//                    AddForm.getForm().findField('TransferAmount').el.dom.readOnly = false; //限制金额能修改
//                    AddForm.getForm().findField('Cash').el.dom.readOnly = false; //限制金额能修改
//                    AddForm.getForm().findField('SrcCardNo').el.dom.readOnly = false; //限制金额能修改
//                    AddForm.getForm().findField('DstCardNo').el.dom.readOnly = false; //限制金额能修改

                    Ext.getCmp('btn1').setDisabled(false); //把生成验证码变成可用
                    Ext.getCmp('btn2').setDisabled(true); //把发送验证码变成不可用
                    AddForm.getForm().findField('MobileNo').el.dom.readOnly = true; //手机号文本框变成不可用
                }
            }]
        }]
    }]
});
//门店
var tar_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/VerifyCode.aspx?actionName=getDept&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }
            ]
    }),
    sortInfo: { field: 'ID', direction: 'ASC' }
});
//添加Form窗口
var AddForm = new Ext.form.FormPanel({
    frame: true,
    //autoScroll: true,
    labelWidth: 110,
    // bodyStyle: 'padding:5px',
    layout: "column",
    labelAlign: 'right',
    bodyStyle: "margin:0 -40px",
    items: [
  {
        columnWidth: 0.965,
        layout: 'form',
        items: [{
            xtype: 'textfield',
            fieldLabel: '卡号',
            allowBlank: false,
            name: 'CardNo',
            anchor: '97%'
        }]
    }, {
        columnWidth: 0.965,
        layout: 'form',
        items: [{
            xtype: 'textfield',
            fieldLabel: '员工姓名',
            name: 'EmpName',
            readOnly: true,
           // allowBlank: false,
            anchor: '97%'
        }]
    },
    {
        columnWidth: 0.965,
        layout: 'form',
        items: [{
            xtype: 'textfield',
            fieldLabel: '所属门店',
            readOnly: true,
            name: 'DeptName',
            anchor: '97%'
        }]
    }, {
        columnWidth: 0.495,
        layout: 'form',
        items: [{
            readOnly: true,
            xtype: 'textfield',
            fieldLabel: '录授权',
            name: 'Code',
            anchor: '92%'
        },{
            readOnly: true,
            xtype: 'hidden',
            fieldLabel: '验证码ID',
            name: 'CodeID',
            anchor: '92%'
        }]
    }, {
        columnWidth: 0.965,
        layout: 'form',
        items: [{
            xtype: 'textfield',
            fieldLabel: '手机号',
            readOnly: true,
            name: 'MobileNo',
            anchor: '97%'
        }],
        html: '<font color=red size=2>11111(多张卡号用逗号隔开。多个手机号码用逗号隔开)</font>'
    }],
    buttons: [
    {
        text: '重置',
        handler: function () {
            tar_store.load(); //门店重新加载
            //AddForm.getForm().findField('DeptID').el.dom.readOnly = false; //门店能修改
//            AddForm.getForm().findField('DeptID').el.dom.disabled = false;
//            AddForm.getForm().findField('TransferAmount').el.dom.readOnly = false; //限制金额能修改
//            AddForm.getForm().findField('Cash').el.dom.readOnly = false; //限制金额能修改
//            AddForm.getForm().findField('SrcCardNo').el.dom.readOnly = false; //限制金额能修改
//            AddForm.getForm().findField('DstCardNo').el.dom.readOnly = false; //限制金额能修改
            AddForm.find("name", "CodeID")[0].setValue("0");

            Ext.getCmp('btn1').setDisabled(false); //把生成验证码变成可用
            Ext.getCmp('btn2').setDisabled(true); //把发送验证码变成不可用
            AddForm.getForm().findField('MobileNo').el.dom.readOnly = true; //手机号文本框变成不可用
            AddForm.getForm().reset();
        }
    },
    {
        text: '生成验证码',
        id: "btn1",
        handler: function () {
            chenck();
        }
    }, {
        text: '发送验证码',
        id: "btn2",
        disabled: true,
        handler: function () {
            UpdateAction();
        }
    }]
});
function chenck() {
    var deptid = AddForm.find("name", "CardNo")[0].getValue();

    if (isNaN(deptid) || deptid =="") {
        Ext.MessageBox.alert("提醒", "请输入正确的卡号");
        return false;
    }
   
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
            url: "../Apis/VerifyCode.aspx?actionName=getLoginCode&sid=" + Sys.sid,
            success: function (form, action) {
                //Ext.MessageBox.alert("提醒", action.result.success);
                if (action.result.success) {
                    AddForm.find("name", "Code")[0].setValue(action.result.msg);
                    AddForm.find("name", "EmpName")[0].setValue(action.result.empname);
                    AddForm.find("name", "DeptName")[0].setValue(action.result.deptname);
                    AddForm.find("name", "MobileNo")[0].setValue(action.result.mobileno);
                    AddForm.find("name", "CodeID")[0].setValue(action.result.codeid);

                    Ext.getCmp('btn1').setDisabled(true); //把生成验证码变成不可用
                    Ext.getCmp('btn2').setDisabled(false); //把发送验证码变成可用
                } else {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                }
                //GetCode();
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
            }
        })
    }
}

//获取验证码
function GetCode() {
    var deptid = AddForm.find("hiddenName", "DeptID")[0].getValue()
    var money = AddForm.find("name", "TransferAmount")[0].getValue();
    AddForm.getForm().submit({
        params: { dempID: AddForm.find("hiddenName", "DeptID")[0].getValue(), money: money },
        url: "../Apis/VerifyCode.aspx?actionName=getVerifyCodeByParms&sid=" + Sys.sid,
        success: function (form, action) {
            AddForm.find("name", "Code")[0].setValue(action.result.msg);
//            AddForm.getForm().findField('DeptID').el.dom.disabled = true; //门店不能修改

//            AddForm.getForm().findField('TransferAmount').el.dom.readOnly = true; //限制金额能修改
//            AddForm.getForm().findField('Cash').el.dom.readOnly = true; //限制金额能修改
//            AddForm.getForm().findField('SrcCardNo').el.dom.readOnly = true; //限制金额能修改
//            AddForm.getForm().findField('DstCardNo').el.dom.readOnly = true; //限制金额能修改
            AddAction();
            Ext.getCmp('btn1').setDisabled(true); //把生成验证码变成不可用
            Ext.getCmp('btn2').setDisabled(false);//把发送验证码变成可用
            AddForm.getForm().findField('MobileNo').el.dom.readOnly = false;//手机号文本框变成可用
        }
    })
}
//添加
function AddAction() {
        AddForm.getForm().submit({
            params: { id: id },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/VerifyCode.aspx?actionName=submitVerifyCode&sid=" + Sys.sid,
            success: function (form, action) {
                //Ext.MessageBox.alert("提醒", action.result.msg);
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
//修改(手机号和备注)
function UpdateAction() {
var code=AddForm.find("name", "Code")[0].getValue();
var mobile = AddForm.find("name", "MobileNo")[0].getValue();
if (mobile == "") {
    Ext.MessageBox.alert("提醒", "手机号码不能为空!");
    return false;
}
//var memoInfo = AddForm.find("name", "MemoInfo")[0].getValue();
    if (AddForm.getForm().isValid()) {
        AddForm.getForm().submit({
           // params: { ucode: code,umobile: mobile,umemoInfo:memoInfo},
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/VerifyCode.aspx?actionName=updateLoginVerifyByCode&sid=" + Sys.sid,
            success: function (form, action) {
                Ext.MessageBox.alert("提醒", action.result.msg);
                //alert("1");
                pd_store.load();
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
   //layout: '',
    width: 550,
    minWidth: 400,
    autoScroll: true,
   // height: 200,
    modal: true,
    closeAction: 'hide',
    title: "生成验证码",
    plain: true,
    items: [AddForm]
});


//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
    columns: [new Ext.grid.RowNumberer(),
    /*{
    header: 'ID',
    dataIndex: 'id',
    ID: "MyId",
    hidden: true,
    width: 100
    },*/
    {
    header: "生成时间",
    dataIndex: "CreateDate",
    sortable: true,
   
    width: 130
},
    {
        header: '门店ID',
        dataIndex: 'DeptID',
        hidden: true,
        width: 100
    }, {
        header: '门店名称',
        dataIndex: 'DeptName',
        sortable: true,
        width: 100
    }, {
        header: '员工姓名',
        dataIndex: 'EmpName',
        sortable: true,
        width: 100
    }, {
        header: "手机号码",
        dataIndex: "MobileNo",
        sortable: true,
        width: 130
    }, {
        header: "卡号",
        dataIndex: "CardNo",
        sortable: true,
        width: 130
    }, {
        header: "认证码",
        dataIndex: "VCode",
        sortable: true,
        width: 130
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/VerifyCode.aspx?actionName=getLoginDataByParms&sid=' + Sys.sid,
    remoteSort: true,//字段排序
    reader: new Ext.data.JsonReader({
        root: "results",
        totalProperty: 'totalCount',
        fields: [
                { name: "CreateDate", mapping: "CreateDate" },
                { name: "DeptID", mapping: "DeptID" },
                { name: "MobileNo", mapping: "MobileNo" },
                { name: "EmpName", mapping: "EmpName" },
                { name: "DeptName", mapping: "DeptName" },
                { name: "CardNo", mapping: "CardNo" },
                { name: "VCode", mapping: "VCode" }
            ]
    })
});

pd_store.on('beforeload', function (thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
//    thiz.baseParams["deptName"] = pd_top_form.find("name", "DeptName")[0].getValue();
//    thiz.baseParams["mobileNo"] = pd_top_form.find("name", "MobileNo")[0].getValue();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true,
    stripeRows: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "anchor",
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -150',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
