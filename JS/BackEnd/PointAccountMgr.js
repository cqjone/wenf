/**
 *	积分账户管理
 */
Ext.onReady(function () {

    var fm = Ext.form;

    //构建列
    var cm = new Ext.grid.ColumnModel({
        // specify any defaults for each column
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns: [{
            id: 'id',
            header: 'ID',
            dataIndex: 'ID',
            width: 220,
            hidden: true
        }, {
            id: "PointCode",
            header: '积分协议编号',
            dataIndex: 'PointCode',
            width: 110
        }, {
            id: "UserName",
            header: '客户姓名',
            dataIndex: 'UserName',
            width: 70
        }, {
            id: "IDCard",
            header: '身份证号码',
            dataIndex: 'IDCard',
            width: 120
        }, {
            id: "Mobile",
            header: '手机号码',
            dataIndex: 'Mobile',
            width: 90
        }, {
            id: "ContactAddress",
            header: '联系地址',
            dataIndex: 'ContactAddress',
            width: 80
        }, {
            id: "PostCode",
            header: '邮编',
            dataIndex: 'PostCode',
            width: 70
        }, {
            id: "Email",
            header: '电子邮件',
            dataIndex: 'Email',
            width: 80
        }, {
            id: "OtherContactType",
            header: '其他联系方式',
            dataIndex: 'OtherContactType',
            width: 80
        }, {
            id: "MemoInfo",
            header: '备注',
            dataIndex: 'MemoInfo',
            width: 100
        }]

    });

    // create the Data Store
    var pam_store = new Ext.data.Store({
        // destroy the store if the grid is destroyed
        autoDestroy: true,
        //autoLoad: true,
        //url: '../Apis/BaseData.aspx?actionName=getTermiteType',
        // load remote data using HTTP
        //url: '../Apis/BaseData.aspx?actionName=getTermiteType',

        // specify a XmlReader (coincides with the XML format of the returned data)
        reader: new Ext.data.JsonReader({
            // records will have a 'plant' tag
            record: 'plant',
            // use an Array of field definition objects to implicitly create a Record constructor
            idProperty: 'ID',
            root: 'rows',
            totalProperty: 'results',
            fields: [
                { name: "ID", mapping: "ID" }
            ]
        })

    });

    var myData = [
        ['P001', "tommy", "320102195606084821", "13813812345", "南京市xxxxxx", '210000', "tommy@sina.com", "15684526", "client"],
        ['P001', "lisa", "320102195606084821", "13813812345", "南京市xxxxxx", '210000', "lisa@sina.com", "15684526", "client"],
        ['P002', "vivian", "320102195606084821", "13813812345", "南京市xxxxxx", '210000', "vivian@sina.com", "15684526", "client"],
        ['P002', "wade", "320102195606084821", "13813812345", "南京市xxxxxx", '210000', "wade@sina.com", "15684526", "client"]
    ];

    // create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           { name: 'PointCode' },
           { name: 'UserName' },
           { name: 'IDCard' },
           { name: 'Mobile' },
           { name: 'ContactAddress' },
           { name: 'PostCode' },
           { name: 'Email' },
           { name: 'OtherContactType' },
           { name: 'MemoInfo' }
        ]
    });
    // create the editor grid
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        frame: true,
        selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
        //clicksToEdit: 2,
        loadMask: true,
        tbar: [{
            iconCls: 'silk-add',
            text: '积分账户开户',
            handler: function () {
                addUserWindow.show();
            }
        }
		, {
		    text: '查询积分账户',
		    iconCls: "silk-book",
		    handler: function () {
		        searchUserWindow.show();
		    }
		}
		, {
		    text: '修改积分账户',
		    iconCls: "silk-cog",
		    handler: function () {
		        var rows = grid.getSelectionModel().getSelections();
		        //alert(rows[0].get("id"));
		        if (rows.length == 0) {
		            Ext.MessageBox.alert('警告', '最少选择一条信息，进行修改!');
		        } else {
		            var r = grid.getSelectionModel().getSelected();
		            //var node = model.getSelectedNode();
		            //alert(model.get("loginName"));
		            addUserWindow.show();
		            addform.find("name", "ID")[0].setValue(r.get("ID"));
		            addform.find("name", "PointCode")[0].setValue(r.get("PointCode"));
		            addform.find("name", "UserName")[0].setValue(r.get("UserName"));
		            addform.find("name", "IDCard")[0].setValue(r.get("IDCard"));
		            addform.find("name", "Mobile")[0].setValue(r.get("Mobile"));
		            addform.find("name", "ContactAddress")[0].setValue(r.get("ContactAddress"));
		            addform.find("name", "PostCode")[0].setValue(r.get("PostCode"));
		            addform.find("name", "Email")[0].setValue(r.get("Email"));
		            addform.find("name", "OtherContactType")[0].setValue(r.get("OtherContactType"));
		            addform.find("name", "MemoInfo")[0].setValue(r.get("MemoInfo"));
		        }
		    }
		},
         {
             text: '会员卡绑定',
             iconCls: "silk-add",
             handler: function () {
                 MemberBindingWindow.show();
             }
         },
         {
             text: '查询积分账户余额及有效期',
             iconCls: "silk-book",
             handler: function () {
                 var rows = grid.getSelectionModel().getSelections();
                 //alert(rows[0].get("id"));
                 if (rows.length == 0) {
                     Ext.MessageBox.alert('警告', '最少选择一条信息，进行查询!');
                 } else {
                     BalanceWindow.show();
                 }
             }
         }
        //        , {
        //            iconCls: 'silk-delete',
        //            text: '删  除',
        //            handler: function() {
        //                var rows = grid.getSelectionModel().getSelections();
        //                //alert(rows[0].get("ID"));
        //                
        //                if(rows.length==0){ 
        //                    Ext.MessageBox.alert('警告', '最少选择一条信息，进行删除!'); 
        //                }else{ 
        //                
        //                Ext.Msg.confirm("提示框","您确定要进行该操作？",function(btn){
        //                    if(btn == "yes"){
        //                        deleteData(rows);
        //                    }
        //                })

        //            }}
        //}
]
    });


    //===========================双击获取该单据 开始======================================//
    grid.on("rowdblclick", function (g, rowindex, e) {
        var r = grid.getStore().getAt(rowindex);
        addUserWindow.show();
        addform.find("name", "ID")[0].setValue(r.get("ID"));
        addform.find("name", "PointCode")[0].setValue(r.get("PointCode"));
        addform.find("name", "UserName")[0].setValue(r.get("UserName"));
        addform.find("name", "IDCard")[0].setValue(r.get("IDCard"));
        addform.find("name", "Mobile")[0].setValue(r.get("Mobile"));
        addform.find("name", "ContactAddress")[0].setValue(r.get("ContactAddress"));
        addform.find("name", "PostCode")[0].setValue(r.get("PostCode"));
        addform.find("name", "Email")[0].setValue(r.get("Email"));
        addform.find("name", "OtherContactType")[0].setValue(r.get("OtherContactType"));
        addform.find("name", "MemoInfo")[0].setValue(r.get("MemoInfo"));
    });

    //===========================双击获取该单据 开始======================================//


    //查询窗口
    var searchUserWindow = new Ext.Window({
        layout: 'fit',
        width: 400,
        height: 150,
        modal: true,
        closeAction: 'hide',
        title: "查询积分用户",
        plain: true,
        items: [{
            id: "sw",
            xtype: "form",
            labelWidth: 100, // label settings here cascade unless overridden
            //url: 'save-form.php',
            frame: true,
            //title: 'Simple Form',
            bodyStyle: 'padding:5px 5px 0',
            width: 350,
            defaults: { width: 250 },
            defaultType: 'textfield',
            items: [{
                fieldLabel: '身份证号码',
                name: 'FileNo'
            }, {
                fieldLabel: '手机号码',
                name: 'UserName'
            }
        ]

        }],
        buttons: [{
            text: '确  定',
            handler: function () {
                seacrhReservation();
                searchUserWindow.hide();
            }
        }, {
            text: '取  消',
            handler: function () {
                searchUserWindow.hide();
            }
        }]

    });

    function seacrhReservation() {
        store.loadData(myData);
    }

    //添加窗口
    var addform = new Ext.FormPanel({
        labelAlign: 'right',
        frame: true,
        bodyStyle: 'padding:5px',
        labelWidth: 80,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [{
                    //id:'loginName',
                    xtype: 'hidden',
                    fieldLabel: 'ID',
                    name: 'ID',
                    anchor: '96%'
                }, {
                    //id:'loginName',
                    xtype: 'textfield',
                    fieldLabel: '积分协议编号',
                    name: 'PointCode',
                    allowBlank: false,
                    anchor: '96%'
                }, {
                    //id:'id',
                    xtype: 'textfield',
                    fieldLabel: '客户姓名',
                    name: 'UserName',
                    anchor: '95%'
                }, {
                    //id:'name',
                    xtype: 'textfield',
                    fieldLabel: '身份证号码',
                    name: 'IDCard',
                    allowBlank: false,
                    anchor: '95%'
                },
                {
                    //id:'mobile',
                    xtype: 'textfield',
                    fieldLabel: '手机号码',
                    name: 'Mobile',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [{
                    id: 'org1',
                    layout: "column"
                }, {
                    //id:'tel',
                    xtype: 'textfield',
                    fieldLabel: '联系地址',
                    name: 'ContactAddress',
                    anchor: '96%'
                },
                {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '邮编',
                    name: 'PostCode',
                    allowBlank: false,
                    anchor: '96%'
                }, {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '电子邮件',
                    name: 'Email',
                    allowBlank: false,
                    anchor: '96%',
                    vtype: "email"
                }, {
                    //id:'email',
                    xtype: 'textfield',
                    fieldLabel: '其他联系方式',
                    name: 'OtherContactType',
                    allowBlank: false,
                    anchor: '96%'
                }]
            },
            {
                columnWidth: 1,
                layout: 'form',
                items: [{
                    //id:'memoinfo',
                    xtype: 'textfield',
                    fieldLabel: '备注',
                    name: 'MemoInfo',
                    anchor: '98%'
                }]
            }
            ]
        }]
    });

    //storeCurrentOrgUsers.load();


    //添加 修改 窗口
    var addUserWindow = new Ext.Window({
        layout: 'fit',
        width: 600,
        height: 240,
        modal: true,
        closeAction: 'hide',
        title: "积分账户开户",
        plain: true,
        items: [addform],

        buttons: [{
            text: '保存',
            handler: function () {
                if (addform.find("name", "ID")[0].getValue() != 0) {
                    doExchange();
                } else {
                    AddUser();
                }
            }
        }, {
            text: '取消',
            handler: function () {
                addUserWindow.hide();
            }
        }]
    });

    function doExchange() {
        End.Msg.password("密码", "请输入密码:", function (btn, text) {
            if (btn == "ok") {
                Ext.Msg.alert("ok...", "验证密码。。。 " + text);
            }
        });
    }

    function AddUser() {
        alert("save");
    }

    var form = new Ext.form.FormPanel({
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
                columnWidth: 0.4,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "卡号",
                    name: "CardNo",
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                columnWidth: 0.4,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "密码",
                    name: "Password",
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
                    text: " 绑  定",
                    handler: function () {
                        //seacrhReservation();
                    }
                }, {
                    xtype: "button",
                    boxMinWidth: 40,
                    width: 60,
                    margins: "0 0 0 5",
                    bodyStyle: "margin:0 5px",
                    text: "解除绑定",
                    handler: function () {
                        //seacrhReservation();
                        doExchange();
                    }
                }]
            }]

        }]
    });


    //查询预约
    function seacrhReservation() {
        store.loadData(myData);
    }

    //定义 勾选框SM
    var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
    //定义列
    var membercm = new Ext.grid.ColumnModel({
        // specify any defaults for each column
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns: [{
            id: 'id',
            header: 'ID',
            dataIndex: 'ID',
            width: 220,
            hidden: true
        }, {
            id: "CardNo",
            header: '卡号',
            dataIndex: 'CardNo',
            width: 110
        }, {
            id: "UserName",
            header: '客户姓名',
            dataIndex: 'UserName',
            width: 70
        }, {
            id: "Mobile",
            header: '手机号码',
            dataIndex: 'Mobile',
            width: 90
        }, {
            id: "ContactAddress",
            header: '联系地址',
            dataIndex: 'ContactAddress',
            width: 80
        }, {
            id: "MemoInfo",
            header: '备注',
            dataIndex: 'MemoInfo',
            width: 100
        }]

    });
    // create the Data Store
    var pd_store = new Ext.data.Store({
        // destroy the store if the grid is destroyed

        autoDestroy: true,
        //autoLoad: true,
        // load remote data using HTTP
        //url: '../Apis/BaseData.aspx?actionName=GetiBaitStationType',

        // specify a XmlReader (coincides with the XML format of the returned data)
        reader: new Ext.data.JsonReader({
            // records will have a 'plant' tag
            record: 'plant',
            // use an Array of field definition objects to implicitly create a Record constructor
            idProperty: 'ID',
            root: 'rows',
            totalProperty: 'results',
            fields: [
                { name: "ID", mapping: "ID" },
                { name: 'Code', mapping: 'Code' },
            // map Record's 'job' field to data object's 'occupation' key
                {name: 'Title', mapping: 'Title' },
                { name: "MemoInfo", mapping: "MemoInfo" }
            ]
        }),

        sortInfo: { field: 'Code', direction: 'ASC' }
    });

    var membergrid = new Ext.grid.GridPanel({
        store: store,
        cm: membercm,
        //frame: true,
        margins: "2 2 2 2",
        border: false,
        //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
        sm: sm,
        loadMask: true
    });

    //主容器
    var panel = new Ext.Panel({
        //autoScroll: true,
        border: false,
        //autoWidth:true,
        layout: "anchor",
        //anchorSize: { width: 800, height: 600 },
        items: [{
            frame: true,
            border: false,
            items: [form]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -100',
            items: [membergrid]
        }]
    });

    var MemberBindingWindow = new Ext.Window({
        layout: 'fit',
        //layout: "anchor",
        width: 800,
        height: 400,
        modal: true,
        closeAction: 'hide',
        title: "会员卡绑定",
        plain: true,
        items: [panel]
    });

    //定义查询余额列
    var balancecm = new Ext.grid.ColumnModel({
        // specify any defaults for each column
        defaults: {
            sortable: true,
            menuDisabled: true
        },
        columns: [{
            id: "UserName",
            header: '客户姓名',
            dataIndex: 'UserName',
            width: 70
        }, {
            id: "Balance",
            header: '积分账户余额',
            dataIndex: 'Balance',
            width: 110
        }, {
            id: "Period",
            header: '有效期',
            dataIndex: 'Period',
            width: 120
        }]
    });

    var balance_store = new Ext.data.Store({
        // destroy the store if the grid is destroyed

        autoDestroy: true,
        //autoLoad: true,
        // load remote data using HTTP
        //url: '../Apis/BaseData.aspx?actionName=GetiBaitStationType',

        // specify a XmlReader (coincides with the XML format of the returned data)
        reader: new Ext.data.JsonReader({
            // records will have a 'plant' tag
            record: 'plant',
            // use an Array of field definition objects to implicitly create a Record constructor
            idProperty: 'ID',
            root: 'rows',
            totalProperty: 'results',
            fields: [
                { name: "ID", mapping: "ID" },
                { name: 'Code', mapping: 'Code' },
            // map Record's 'job' field to data object's 'occupation' key
                {name: 'Title', mapping: 'Title' },
                { name: "MemoInfo", mapping: "MemoInfo" }
            ]
        }),

        sortInfo: { field: 'Code', direction: 'ASC' }
    });

    var balancegrid = new Ext.grid.GridPanel({
        store: balance_store,
        cm: balancecm,
        //frame: true,
        margins: "2 2 2 2",
        border: false,
        //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
        sm: sm,
        loadMask: true
    });

    //查询积分账户余额及有效期窗口
    var BalanceWindow = new Ext.Window({
        layout: 'fit',
        width: 400,
        height: 200,
        modal: true,
        closeAction: 'hide',
        title: "查询积分账户余额及有效期",
        plain: true,
        items: [balancegrid]
    });

    //读取数据
    //store.load();
    centerPanel.add(grid);
    centerPanel.doLayout();
})
