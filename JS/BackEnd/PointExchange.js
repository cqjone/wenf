//积分兑换功能  前台
var customer_f = new End.customer_formPanel();


//验证密码
var pwdform = new Ext.form.FormPanel({
    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 70,
    items: [{
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '请输入密码',
        name: 'pwd',
        allowBlank: false,
        inputType: "password",
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'hidden',
        fieldLabel: '用户ID',
        name: 'ID',
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'hidden',
        fieldLabel: '单据ID',
        name: 'billID',
        anchor: '95%'
    }]

})

//验证密码
var pwdform_S = new Ext.form.FormPanel({
    labelAlign: 'right',
    frame: true,
    bodyStyle: 'padding:5px',
    labelWidth: 70,
    items: [{
        layout: 'form',
        xtype: 'textfield',
        fieldLabel: '请输入密码',
        name: 'pwd',
        allowBlank: false,
        inputType: "password",
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'hidden',
        fieldLabel: '用户ID',
        name: 'ID',
        anchor: '95%'
    }, {
        layout: 'form',
        xtype: 'hidden',
        fieldLabel: '单据ID',
        name: 'billID',
        anchor: '95%'
    }]

})

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
        defaults: { labelAlign: "right", width: 80 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.5,
            items: [{
                xtype: "textfield",
                fieldLabel: "身份证号码",
                name: "idNo",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "卡号",
                name: "card",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.5,
            items: [{
                xtype: "textfield",
                fieldLabel: "手机号码",
                name: "mobileNo",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 140,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    //seacrhReservation();
                    //customer_f.getForm().reset();
                    search();
                }
            }
            ]
        }]

    }]
});

function search() {
    pd_store.removeAll();
    customer_f.getForm().reset();
    var data = pd_top_form.getForm().getValues();
    pd_store.load({
        params:data
    });
    //store.loadData(myData);
}


var fm = Ext.form;

//定义 勾选框SM
//var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
//定义列
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
   {
       //id: "Title",
       header: 'ID',
       dataIndex: 'ID',
       hidden: true,
       width: 100
   },
    {
        //id: "Title",
        header: 'RuleID',
        dataIndex: 'RuleID',
        hidden: true,
        width: 100
    },
   {
       //id: "Title",
       header: '预约时间',
       dataIndex: 'ReservationDate',
       width: 100,
       renderer: function (v) {
           return DateToString(ConvertJSONDateToJSDateObject(v));
       }
   }, {
       //id: "Title",
       header: '礼品类型',
       dataIndex: 'ExcTargetType',
       width: 100,
       renderer: function (v, mdata, record) {
           return ExchangeTargetTypeDataStore.getById(v).get("name");
       }
   }, {
       //id: "Title",
       header: '礼品名称',
       dataIndex: 'OnlineName',
       width: 100
   }, {

       header: "礼品数量",
       dataIndex: "Quantity",
       width: 100,
       align: 'right'
   }, {

       header: "积分数量",
       dataIndex: "TotalCount",
       width: 100,
       align: 'right'
   }, {
       header: "是否门店可兑换 ",
       dataIndex: "ShopExchangeable",
       width: 100,
       align: 'right',
       renderer: function (v) {
           if (ifStore.getById(v) != null && ifStore.getById(v) != undefined) {
               return ifStore.getById(v).get("name");
           } else {
               return v;
           }
       }
   }, {
       header: "操作",
       align: "center",
       renderer: function () {
           return "<a href='#' onclick='doExchange();'>兑 换</a>";
       }
   }]
});


//员工提成列
//定义列
var memberCm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [
   {
       //id: "Title",
       header: '提成员工',
       dataIndex: 'EmpName',
       width: 200
   }, {

       header: "提成比例",
       dataIndex: "TcBl",

       align: 'right'
   }]
});

// create the Data Store
var pd_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed
    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointExchange.aspx?actionName=getDataByIdNo&sid=' + Sys.sid,

    // specify a XmlReader (coincides with the XML format of the returned data)
    reader: new Ext.data.JsonReader({
        // records will have a 'plant' tag
        record: 'plant',
        // use an Array of field definition objects to implicitly create a Record constructor
        //idProperty: 'ID',
        root: 'msg',
        totalProperty: 'results',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "RuleID", mapping: "RuleID" },
                { name: 'ReservationDate', mapping: 'ReservationDate' },
                { name: 'Quantity', mapping: 'Quantity' },
                { name: "TotalCount", mapping: "TotalCount" },
                { name: "OnlineName", mapping: "OnlineName" },
                { name: "ShopExchangeable", mapping: "ShopExchangeable" },
                { name: "ExcTargetType"}
            ]
    })
});
//员工提成store
var member_store = new Ext.data.Store({
    autoDestroy: true,
    //url: "../Apis/PointAccount.aspx?actionName=getCardInfo&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'plant',
       
        totalProperty: 'results',
        fields: [
                { name: "TcId", mapping: "TcId" },
                { name: "EmpName",mapping:"EmpName"},
                { name: "TcBl", mapping: "TcBl" }
            ]
    })

    //sortInfo: { field: 'Code', direction: 'ASC' }
});

//======积分服务兑换 、 窗口=====//
//密码验证窗口
var servicePwd = new Ext.Window({
    title: '密码验证',
    closeAction: 'hide',
    iconCls: 'find',
    width: 280,
    height: 130,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: pwdform_S,
    buttons: [{
        text: '确 认',
        handler: function () {
            //if (pwdform.getForm().isValid()) {
                servicePointExchange();
            //}
        }
    }, {
        text: '取 消',
        handler: function () {
            servicePwd.hide();
            pwdform.getForm().reset();
        }
    }]
});

//减积分
function servicePointExchange() {
    /*
    pwdform.getForm().submit({
    waitMsg: "正在提交，请稍候...",
    url: "../Apis/PointExchange.aspx?actionName=exchangePoint&sid=" + Sys.sid,
    success: function (form, action) {
    //addform.body.unmask();
    Ext.MessageBox.alert("提醒", action.result.msg);
    if (action.result.success) {
    pwdform.getForm().reset();
    mPwd.hide();
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
    }
    });
    */
    //alert("t");
    if (serviceForm.getForm().isValid()) {
        var pwd = servicePwd.find("name", "pwd")[0].getValue();
        if (pwd == "") {
            Ext.Msg.alert("提醒","请输入密码！");
            return;
        }
        serviceForm.find("name", "Password")[0].setValue(pwd);
        //alert(serviceForm.find("name","Password")[0].getValue());
        //UpdatebPointExchange();
        updateServiceExchange();
    }
}
//提交请求
function updateServiceExchange() {
    //得到 提成员工
    var empIds = "";
    var empDeducts = "";
    for (var i = 0; i < member_store.getCount(); i++) {
        empIds += member_store.getAt(i).get("TcId") + ",";
        empDeducts += member_store.getAt(i).get("TcBl") + ",";
    }

    serviceForm.getForm().submit({
        waitMsg: "正在提交，请稍候...",
        url: "../Apis/PointExchange.aspx?actionName=checkPwd&sid=" + Sys.sid,
        params:{empIds:empIds,empDeducts:empDeducts},
        success: function (form, action) {
            //addform.body.unmask();
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {
                serviceForm.getForm().reset();
                servicePwd.hide();
                serviceWindow.hide();
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


//员工提成grid
var member_grid = new Ext.grid.GridPanel({
    store: member_store,
    cm: memberCm,
    height: 200,
    frame: true,
    //margins: "2 2 2 2",
    //border: false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true,
    tbar: [{
		    text: '删除员工',
		    iconCls: "silk-book",
		    handler: function () {
		        var r = member_grid.getSelectionModel().getSelections();
		        //alert(rows[0].get("id"));
		        if (r.length == 0) {
		            Ext.MessageBox.alert('警告', '最少选择一个员工!');
		        } else {
		            var rows = member_grid.getSelectionModel().getSelections();
		            //removeCardForm.find("name", "ID")[0].setValue(rows[0].get("ID"));
		            //alert(rows[0].get("TcId"));
		            for (var i = 0; i < rows.length; i++) {
		                //得到 员工提成比例
                        deductRatio = deductRatio - rows[i].get("TcBl");
                        member_store.remove(rows[i]);
                    }
                }
		    }
		}]
});

var deductRatio = 0;//员工总提成
var serviceForm = new Ext.form.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 500,
    //height: 600,
    //anchor:'95%',
    items: [{
        layout: 'column',
        //defaults: { width: 210 },
        items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '用户ID',
                        name: 'AccountID',
                        hidden: true,
                        emptyText: "0",
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'EID',
                        name: 'EID',
                        hidden: true,
                        emptyText: "0",
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '客户名称',
                        name: 'CustomerName',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '身份证号码',
                        name: 'IdNo',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '手机号码',
                        name: 'MobileNo',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: '预约时间',
                        name: 'ReservationDate',
                        readOnly: true,
                        //emptyText: new Date().toLocaleDateString(),
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '礼品名称',
                        name: 'OnlineName',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '礼品数量',
                        allowBlank: false,
                        readOnly: true,
                        name: 'Quantity',
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        //decimalPrecision:0,
                        readOnly: true,
                        fieldLabel: '合计兑换积分数量',
                        name: 'TotalCount',
                        //disabled: true,
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        hidden: true,
                        //readOnly: true,
                        fieldLabel: '密码',
                        name: 'Password',
                        anchor: '95%'
                    }]
                }]
    },
                {
                    xtype: "fieldset",
                    title: "员工提成",
                    height: 255,
                    //anchor: "100%",
                    //layout:"form",
                    items:[{
                    layout: "column",
                    items: [{
                        layout: "form",
                        columnWidth: 0.5,
                        items: [{
                            xtype: 'combo',
                            fieldLabel: '提成员工',
                            hiddenName: 'TcId',
                            store: deptStore,
                            forceSelection: true,
                            //typeAhead: true,
                            triggerAction: "all",
                            editable: false,
                            displayField: "Title",
                            valueField: "ID",
                            mode: 'remote',
                            anchor:"95%"
                        }]
                    }, {
                        layout: "form",
                        columnWidth: 0.4,
                        items: [{
                            xtype: "numberfield",
                            fieldLabel: "提成比例",
                            name: "TcBl",
                            anchor:"100%"
                        }]
                    }, {
                        //layout: "hbox",
                        columnWidth:0.1,
                        //bodyStyle: "margin:0 5px",
                        width: 50,
                        items: [{
                            xtype: "button",
                            //width: 50,
                            text: "添  加",
                            handler: function () {
                                //alert(serviceForm.find("hiddenName", "TcId")[0].getValue());
                                var empID = serviceForm.find("hiddenName", "TcId")[0].getValue(); //员工id
                                if(empID != ""){
                                    var empName = deptStore.getById(empID).get("Title");
                                    //alert(empName);
                                    var oneRatio = serviceForm.find("name", "TcBl")[0].getValue();
                                    if(oneRatio != "") {
                                        //alert(oneRatio);
                                        //添加到 grid
                                        if (deductRatio + oneRatio > 1) {
                                            Ext.Msg.alert("提醒", "提成比例总和不能大于1！");
                                        } else {
                                            deductRatio += oneRatio;
                                            var newEmpModel = member_store.recordType;
                                            var newEmp = new newEmpModel({
                                                TcId:empID,
                                                EmpName:empName,
                                                TcBl:oneRatio
                                            });

                                            //插入表格
                                            member_store.insert(0, newEmp);
                                            //清空录入
                                            serviceForm.find("hiddenName", "TcId")[0].setValue("");
                                            serviceForm.find("name", "TcBl")[0].setValue(1-deductRatio);
                                        }
                                    }else {
                                        Ext.Msg.alert("提醒","请输入提成比例，且提成比例不能大于1！");
                                    }
                                }

                            }
                        }]
                    }]
                }, {
                    layout:"fit",
                    items:[member_grid]
                    }]
                },

                {
                    buttons: [{
                        text: '保  存',
                        handler: function () {
                            //UpdatebPointExchange();
                            //判断 员工提成有没有录入
                            if(deductRatio == 0){
                                Ext.Msg.alert("提醒", "请录入提成员工！");
                                return ;
                            }
                            if (deductRatio != 1) {
                                Ext.Msg.alert("提醒", "提成比例总和必须为1！");
                                return;
                            }
                            //alert("保存");
                            servicePwd.show();
                        }
                    }, {
                        text: '取  消',
                        handler: function () {
                            serviceForm.getForm().reset();
                            member_store.removeAll();
                            serviceWindow.hide();
                        }
                    }]
                }]
});
            


var serviceWindow = new Ext.Window({
    layout: 'fit',
    width: 650,
    height: 500,
    modal: true,
    closeAction: 'hide',
    title: "积分服务兑换",
    plain: true,
    items: [serviceForm]
});

//兑换服务
function doService() {
    var rows = pd_grid.getSelectionModel().getSelections();
    var AccountID = customer_f.find("name", "id")[0].getValue();
    var customerName = customer_f.find("name", "customerName")[0].getValue();
    var idNo = customer_f.find("name", "idNo")[0].getValue();
    var mobileNo = customer_f.find("name", "mobileNo")[0].getValue();
    var address = customer_f.find("name", "address")[0].getValue();
    var zipCode = customer_f.find("name", "zipCode")[0].getValue();
    var contact = customer_f.find("name", "contact")[0].getValue();
    var quantity = rows[0].get("Quantity");
    var onlineName = rows[0].get("OnlineName");
    var totalCount = rows[0].get("TotalCount");
    var ReservationDate = rows[0].get("ReservationDate");
    var date = ConvertJSONDateToJSDateObject(ReservationDate);
    //alert(date);
    serviceForm.find("name", "AccountID")[0].setValue(AccountID);
    var billID = rows[0].get("ID");
    //pwdform.find("name", "billID")[0].setValue(billID);
    serviceForm.find("name", "EID")[0].setValue(billID);
    serviceForm.find("name", "CustomerName")[0].setValue(customerName);
    serviceForm.find("name", "IdNo")[0].setValue(idNo);
    serviceForm.find("name", "MobileNo")[0].setValue(mobileNo);
    serviceForm.find("name", "Quantity")[0].setValue(quantity);
    serviceForm.find("name", "OnlineName")[0].setValue(onlineName);
    serviceForm.find("name", "TotalCount")[0].setValue(totalCount);
    serviceForm.find("name", "ReservationDate")[0].setValue(date);
    //serviceForm.find("name", "Consignee")[0].setValue(customerName);
    //serviceForm.find("name", "ZipCode")[0].setValue(zipCode);
    //serviceForm.find("name", "Address")[0].setValue(address);
    //serviceForm.find("name", "TelNo")[0].setValue(contact);

    deductRatio = 0;
    serviceWindow.show();
}

//======积分服务兑换 、 窗口= end====//


var exchangeForm = new Ext.form.FormPanel({
    xtype: "form",
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 460,
    height: 300,
    items: [{
        layout: 'column',
        //defaults: { width: 210 },
        items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '用户ID',
                        name: 'AccountID',
                        hidden: true,
                        emptyText: "0",
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'EID',
                        name: 'EID',
                        hidden: true,
                        emptyText: "0",
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '客户名称',
                        name: 'CustomerName',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '身份证号码',
                        name: 'IdNo',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '手机号码',
                        name: 'MobileNo',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: '预约时间',
                        name: 'ReservationDate',
                        readOnly: true,
                        //emptyText: new Date().toLocaleDateString(),
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '收货地址',
                        name: 'Address',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '联系方式',
                        name: 'TelNo',
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '礼品名称',
                        name: 'OnlineName',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '礼品数量',
                        allowBlank: false,
                        readOnly: true,
                        name: 'Quantity',
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        //decimalPrecision:0,
                        readOnly: true,
                        fieldLabel: '合计兑换积分数量',
                        name: 'TotalCount',
                        //disabled: true,
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '提成员工',
                        hiddenName: 'DeductEmpID',
                        anchor: '95%',
                        store: deptStore,
                        forceSelection: true,
                        //typeAhead: true,
                        triggerAction: "all",
                        editable: false,
                        displayField: "Title",
                        valueField: "ID",
                        mode: 'remote',
                        hidden:true
                        //allowBlank: false
                    }, {
                        xtype: "textfield",
                        //decimalPrecision:0,
                        //readOnly: true,
                        fieldLabel: '收货人',
                        name: 'Consignee',
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        //decimalPrecision:0,
                        //readOnly: true,
                        fieldLabel: '邮编',
                        name: 'ZipCode',
                        anchor: '95%'
                    }, {
                        xtype: "textfield",
                        hidden: true,
                        //readOnly: true,
                        fieldLabel: '密码',
                        name: 'Password',
                        anchor: '95%'
                    }]
                }]
    }, {
        buttons: [{
            text: '保  存',
            handler: function () {
                //UpdatebPointExchange();
                mPwd.show();
            }
        }, {
            text: '取  消',
            handler: function () {
                exchangeForm.getForm().reset();
                OrderExchangeWindow.hide();
            }
        }]
    }]
});



var OrderExchangeWindow = new Ext.Window({
    layout: 'fit',
    width: 600,
    height: 250,
    modal: true,
    closeAction: 'hide',
    title: "预约兑换",
    plain: true,
    items: [exchangeForm]
});




//密码验证窗口
var mPwd = new Ext.Window({
    title: '密码验证',
    closeAction: 'hide',
    iconCls: 'find',
    width: 280,
    height: 130,
    modal: true,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: pwdform,
    buttons: [{
        text: '确 认',
        handler: function () {
            if (pwdform.getForm().isValid()) {
                PointExchange();
            }
        }
    }, {
        text: '取 消',
        handler: function () {
            mPwd.hide();
            pwdform.getForm().reset();
        }
    }]
});

function doExchange() {
    //mPwd.show();
    var rows = pd_grid.getSelectionModel().getSelections();
    var ShopExchangeable = rows[0].get("ShopExchangeable");
    if (ShopExchangeable == 0) {
        Ext.MessageBox.alert("提示","不允许门店兑换，需要到总部兑换");
        return false;
    }

    if (rows[0].get("ExcTargetType") == 1) {
        //alert("兑换服务");
        doService();
        return false;
    }

    OrderExchangeWindow.show();
    var AccountID = customer_f.find("name", "id")[0].getValue();
    var customerName = customer_f.find("name", "customerName")[0].getValue();
    var idNo = customer_f.find("name", "idNo")[0].getValue();
    var mobileNo = customer_f.find("name", "mobileNo")[0].getValue();
    var address = customer_f.find("name", "address")[0].getValue();
    var zipCode = customer_f.find("name", "zipCode")[0].getValue();
    var contact = customer_f.find("name", "contact")[0].getValue();
    var quantity = rows[0].get("Quantity");
    var onlineName = rows[0].get("OnlineName");
    var totalCount = rows[0].get("TotalCount");
    var ReservationDate = rows[0].get("ReservationDate");
    var date = ConvertJSONDateToJSDateObject(ReservationDate);
    //alert(date);
    exchangeForm.find("name", "AccountID")[0].setValue(AccountID);
    var billID = rows[0].get("ID");
    //pwdform.find("name", "billID")[0].setValue(billID);
    exchangeForm.find("name", "EID")[0].setValue(billID);
    exchangeForm.find("name", "CustomerName")[0].setValue(customerName);
    exchangeForm.find("name", "IdNo")[0].setValue(idNo);
    exchangeForm.find("name", "MobileNo")[0].setValue(mobileNo);
    exchangeForm.find("name", "Quantity")[0].setValue(quantity);
    exchangeForm.find("name", "OnlineName")[0].setValue(onlineName);
    exchangeForm.find("name", "TotalCount")[0].setValue(totalCount);
    exchangeForm.find("name", "ReservationDate")[0].setValue(date);
    exchangeForm.find("name", "Consignee")[0].setValue(customerName);
    exchangeForm.find("name", "ZipCode")[0].setValue(zipCode);
    exchangeForm.find("name", "Address")[0].setValue(address);
    exchangeForm.find("name", "TelNo")[0].setValue(contact);
}

//更新bPointExchange信息
function UpdatebPointExchange() {
    //if (exchangeForm.getForm().isValid()) {
        //提交数据
        //addform.body.mask("正在提交，请稍候...");
    exchangeForm.getForm().submit({
        waitMsg: "正在提交，请稍候...",
        url: "../Apis/PointExchange.aspx?actionName=checkPwd&sid=" + Sys.sid,
        success: function (form, action) {
            //addform.body.unmask();
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {

                //test 打印
                var customerName = customer_f.find("name", "customerName")[0].getValue();
                var giftName = exchangeForm.find("name", "OnlineName")[0].getValue();
                var giftCount = exchangeForm.find("name", "Quantity")[0].getValue();
                var pointCount = exchangeForm.find("name", "TotalCount")[0].getValue();
                //
                document.title = "PrintBill_" + customerName + "_" + giftName + "_" + giftCount + "_" + pointCount;
                setTimeout("document.title = '积分管理系统'",2000);
                exchangeForm.getForm().reset();
                mPwd.hide();
                OrderExchangeWindow.hide();
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
   // }
}


//减积分
function PointExchange() {
/*
    pwdform.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/PointExchange.aspx?actionName=exchangePoint&sid=" + Sys.sid,
            success: function (form, action) {
                //addform.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    pwdform.getForm().reset();
                    mPwd.hide();
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
            }
        });
        */
    if (exchangeForm.getForm().isValid()) {
        var pwd = pwdform.find("name", "pwd")[0].getValue();
        exchangeForm.find("name", "Password")[0].setValue(pwd);
        UpdatebPointExchange();
    }
}

pd_store.on('load', function (store, records) {
    //alert("load...");
    //加载成功后，读取客户信息
    customer_f.load({
        params: pd_top_form.getForm().getValues()
    });
    if (store.getCount() == 0) {
        Ext.MessageBox.alert("提醒", "该用户没有积分兑换信息！");
    };
});

pd_store.on("loadexception", function (mis) {
    Ext.MessageBox.alert("提醒", "无该积分账户！请重新核对身份证或手机号码！");
    pd_store.removeAll();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins:"2 2 2 2",
    border:false,
    selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

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
        items: [pd_top_form, customer_f]
    }, {
        layout:"fit",
        border: false,
        anchor: '-1 -150',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
