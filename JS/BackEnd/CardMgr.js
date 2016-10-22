// JavaScript Document

var pd_top_form = new Ext.form.FormPanel({
    bodyBorder: false,
    border: false,
    autoScroll: true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        defaults: {
            labelAlign: "right"
        },
        layout: "column",
        items: [{
                layout: "form",
                labelWidth: 50,
                columnWidth: 0.4,
                items: [{
                    xtype: 'combo',
                    fieldLabel: '搜索',
                    name: 'SearchType',
                    triggerAction: 'all',
                    editable: false,
                    mode: 'local',
                    store: new Ext.data.ArrayStore({
                        fields: ['myId', 'displayText'],
                        data: [
                            ['卡号', '卡号'],
                            ['客户姓名', '客户姓名'],
                            ['电话', '电话'],
                            ['手机', '手机']
                        ]
                    }),
                    value: "卡号",
                    valueField: 'myId',
                    displayField: 'displayText',
                    anchor: '100%'
                }]
            }, {
                layout: 'form',
                columnWidth: 0.2,
                labelWidth: 10,
                items: [{
                    xtype: 'textfield',
                    name: 'SearchText',
                    anchor: '100%'
                }]
            }, {
                layout: 'hbox',
                columnWidth: 0.15,
                items: [{
                    xtype: 'button',
                    text: '刷新',
                    width: 60,
                    handler: function() {
                        var data = pd_top_form.getForm().getValues();
                        //pd_top_form.getForm().reset();
                        pd_store.load({
                            //params: data,
                            params: {
                                start: 0,
                                limit: 25
                            }
                        });
                    }
                }]
            }

        ]
    }]
});

var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default
    },
    columns: [new Ext.grid.RowNumberer(), {
        header: '卡号',
        dataIndex: 'CardNumber',
        sortable: true,
        width: 150
    }, {
        header: '客户姓名',
        dataIndex: 'Customer',
        sortable: true,
        width: 150
    }, {
        header: '电话',
        dataIndex: 'Mobile',
        sortable: true,
        width: 150
    }, {
        header: '手机',
        dataIndex: 'CardID',
        sortable: true,
        width: 150
    }]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../data/EsignClient.json",
    reader: new Ext.data.JsonReader({
        root: "temp",
        totalProperty: 'totalCount',
        fields: [{
            name: 'CardNumber',
            mapping: 'CardNumber'
        }, {
            name: 'Customer',
            mapping: 'Customer'
        }, {
            name: 'Mobile',
            mapping: 'Mobile'
        }, {
            name: 'CardID',
            mapping: 'CardID'
        }]
    }),
    autoLoad:true
});

pd_store.on('beforeload', function(thiz, options) {
    pd_store.baseParams = pd_top_form.getForm().getValues();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    stripeRows: true,
    loadMask: true
        /*,
            bbar: new Ext.PagingToolbar({
                pageSize: 100,
                store: pd_store,
                displayInfo: true,
                displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
                emptyMsg: "没有记录"
            })*/
});

//卡管理项 中 双击事件
var CardCodeNo = ''; //Icard 的 卡号
var CardId = '';
var CustomerId = ''; //CustomerId
var VCode = ''; //用户输入的正确验证码
var Birthday, IsFace, IsHair, Sex, Work;
pd_grid.on(
    "rowdblclick",
    function(g, rowindex, e) {
        var r = pd_grid.getStore().getAt(rowindex);
        //Ext.Msg.alert(r.get("ID"));
        win_CardCustomerXF.show();
        CardCodeNo = r.get("Code");
        CustomerId = r.get("ID");
        CardId = r.get('CardId');
        mystore.load({
            //url:"../Apis/CardMgr.aspx?actionName=GethCardById&sid=" + Sys.sid,
            params: {
                id: CustomerId
            },
            waitMsg: "加载中....."
        });

        store_history.load({
            //url:"../Apis/CardMgr.aspx?actionName=GethCardById&sid=" + Sys.sid,
            params: {
                id: CustomerId
            },
            waitMsg: "加载中....."
        });

        //mystore.load();
        CodeInfo.load({
            url: "../Apis/CardMgr.aspx?actionName=SearchById&type=CodeInfo&sid=" + Sys.sid,
            params: {
                id: CustomerId
            },
            waitMsg: "加载中.....",
            success: function(form, action) {
                if (CodeInfo.find('name', 'AllowChangeCustomer')[0].getValue() == '否') {
                    Ext.getCmp('AllowChangeCustomerLabel').setText('注意：该卡必须由总部核实客户信息');
                    Ext.getCmp('ActionSave').disable();
                } else {
                    Ext.getCmp('AllowChangeCustomerLabel').setText('');
                    Ext.getCmp('ActionSave').enable();
                }

            }
        });
        KeHuInfo.load({
            url: "../Apis/CardMgr.aspx?actionName=SearchById&type=KeHuInfo&sid=" + Sys.sid,
            params: {
                id: CustomerId
            },
            waitMsg: "加载中.....",
            success: function(form, action) {
                if (KeHuInfo.find('name', 'Birthday')[0].getValue() == null || KeHuInfo.find('name', 'Birthday')[0].getValue() == '') {
                    Birthday = '';
                } else {
                    Birthday = (new Date(KeHuInfo.find('name', 'Birthday')[0].getValue())).format('Y-m-d');
                }
                if (KeHuInfo.find('name', 'IsFace')[0].getValue() == '是') IsFace = 0;
                else if (KeHuInfo.find('name', 'IsFace')[0].getValue() == '否') IsFace = 1;
                if (KeHuInfo.find('name', 'IsHair')[0].getValue() == '是') IsHair = 0;
                else if (KeHuInfo.find('name', 'IsHair')[0].getValue() == '否') IsHair = 1;
                //if(KeHuInfo.find('name','Sex')[0].getValue()=='男') Sex=0; else Sex=1;
                //IsFace=KeHuInfo.find('name','IsFace')[0].getValue();
                //IsHair=KeHuInfo.find('name','IsHair')[0].getValue();
                Sex = KeHuInfo.find('name', 'Sex')[0].getValue();
                Work = KeHuInfo.find('name', 'CustomerWork')[0].getRawValue();
            }
        });
        HireInfo.getForm().reset();
        HireInfo.load({
            url: "../Apis/CardMgr.aspx?actionName=getExtendHireInfoById&sid=" + Sys.sid,
            params: {
                id: CustomerId
            },
            waitMsg: "加载中.....",
            success: function(form, action) {
                Ext.getCmp('AllowChangeCustomerLabel').setText('');
                Ext.getCmp('ActionSave').enable()

            }
        });

        FaceInfo.getForm().reset();
        FaceInfo.load({
            url: "../Apis/CardMgr.aspx?actionName=getExtendFaceInfoById&sid=" + Sys.sid,
            params: {
                id: CustomerId
            },
            waitMsg: "加载中.....",
            success: function(form, action) {
                Ext.getCmp('AllowChangeCustomerLabel').setText('');
                Ext.getCmp('ActionSave').enable()

            }
        });
        //var r=pd_grid.getStore().getAt(rowindex);
    }
);

//=============Window(所有客户信息窗口)===============
var CodesButton = new Ext.form.FormPanel({
    layout: 'column',
    plain: true,
    width: '96%',
    items: [{
        layout: 'hbox',
        width: '96%',
        defaults: {
            width: 80
        },
        border: false,
        style: 'padding:10px;border:0px',
        items: [{
            xtype: 'button',
            text: '挂失',
            handler: function() {
                Ext.MessageBox.confirm("提醒", "确定挂失？", function(btn) {
                    if (btn == "yes") {
                        gq('挂失');
                    }
                });
            }
        }, {
            xtype: 'button',
            text: '启用',
            handler: function() {
                Ext.MessageBox.confirm("提醒", "确定启用？", function(btn) {
                    if (btn == "yes") {
                        gq('正常');
                    }
                });
            }
        }, {
            xtype: 'button',
            text: '修改密码',
            handler: function() {
                UpdatePwdWin.show();
            }
        }, {
            xtype: 'button',
            id: 'ActionSave',
            name: 'ActionSave',
            text: '保存',
            handler: function() {
                ActionSave();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            handler: function() {
                //Pdformedit();
                //if(haveEdit==true){
                //Ext.MessageBox.confirm('Info','确定关闭窗口？',function a(fn){
                //	if(fn=="yes"){
                //ActionSave();
                win_CardCustomerXF.hide(); //关闭窗口
                //	}
                //});
                //}else{
                //	win_CardCustomerXF.hide();//关闭窗口
                //}
            }
        }]
    }, {
        xtype: 'label',
        id: 'AllowChangeCustomerLabel',
        name: 'AllowChangeCustomerLabel',
        text: '',
        style: 'color: red'
    }]
});
var KeHuInfo = new Ext.form.FormPanel({

    reader: new Ext.data.JsonReader({
        fields: [{
            name: 'CreateDate'
        }, {
            name: 'CustomerId',
            mapping: 'CustomerId'
        }, {
            name: 'CustomerName',
            mapping: 'CustomerName'
        }, {
            name: 'Email',
            mapping: 'Email'
        }, {
            name: 'Sex',
            mapping: 'Sex'
        }, {
            name: 'Tel',
            mapping: 'Tel'
        }, {
            name: 'Mobile',
            mapping: 'Mobile'
        }, {
            name: 'IsFace',
            mapping: 'IsFace'
        }, {
            name: 'FaceInfo',
            mapping: 'FaceInfo'
        }, {
            name: 'IsHair',
            mapping: 'IsHair'
        }, {
            name: 'HairInfo1',
            mapping: 'HairInfo'
        }, {
            name: 'CustomerWork',
            mapping: 'CustomerWork'
        }, {
            name: 'IdNo',
            mapping: 'IdNo'
        }, {
            name: 'Address',
            mapping: 'Address'
        }, {
            name: 'Birthday',
            mapping: 'Birthday'
        }, {
            name: 'ZipCode',
            mapping: 'ZipCode'
        }, {
            name: 'MemoInfo',
            mapping: 'MemoInfo'
        }]
    }),

    frame: true,
    border: false,
    autoScroll: true,
    width: '96%',
    items: [{
        xtype: 'fieldset',
        collapsible: true,
        title: '客户信息',
        style: 'margin-left:10px;margin-top:10px;',
        width: '100%',
        height: 250,
        items: [{
            border: false,
            layout: 'column',
            labelWidth: 100,
            items: [{
                xtype: 'hidden',
                name: 'CustomerId'
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    name: 'CreateDate',
                    hidden: true
                }, {
                    xtype: 'textfield',
                    name: 'CustomerName',
                    fieldLabel: '客户姓名',
                    anchor: '100%'
                }, {
                    xtype: 'combo',
                    name: 'Sex',
                    fieldLabel: '性别',
                    triggerAction: 'all',
                    editable: false,
                    mode: 'local',
                    store: new Ext.data.ArrayStore({
                        fields: ['myId', 'displayText'],
                        data: [
                            [0, '男'],
                            [1, '女']
                        ]
                    }),
                    valueField: 'myId',
                    displayField: 'displayText',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'Tel',
                    fieldLabel: '联系电话',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'Mobile',
                    fieldLabel: '手机号码',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'IdNo',
                    fieldLabel: '身份证号码',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'Address',
                    fieldLabel: '地址',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ZipCode',
                    fieldLabel: '邮编',
                    anchor: '100%'
                }, {
                    xtype: 'datefield',
                    width: 130,
                    name: 'Birthday',
                    format: 'Y-m-d',
                    fieldLabel: '出生年月',
                    anchor: '100%'
                }]
            }, {
                columnWidth: .5,
                layout: 'form',
                style: 'margin-left:5px;',
                items: [{
                    xtype: 'textfield',
                    name: 'Email',
                    fieldLabel: '电子邮件',
                    anchor: '100%'
                }, {
                    xtype: 'combo',
                    name: 'CustomerWork',
                    triggerAction: 'all',
                    editable: false,
                    mode: 'remote',
                    store: new Ext.data.ArrayStore({
                        fields: ['myId', 'displayText'],
                        url: "../Apis/CardMgr.aspx?actionName=GetJob&sid=" + Sys.sid
                    }),
                    valueField: 'myId',
                    displayField: 'displayText',
                    fieldLabel: '客户职业',
                    anchor: '100%'
                }, {
                    xtype: 'combo',
                    name: 'IsFace',
                    triggerAction: 'all',
                    editable: false,
                    mode: 'local',
                    store: new Ext.data.ArrayStore({
                        fields: ['MyId', 'displayText'],
                        data: [
                            [0, '是'],
                            [1, '否']
                        ]
                    }),
                    valueField: 'MyId',
                    displayField: 'displayText',
                    fieldLabel: '是否签订美容合同',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'HairInfo1',
                    fieldLabel: '美容合同备注',
                    anchor: '100%'
                }, {
                    xtype: 'combo',
                    name: 'IsHair',
                    triggerAction: 'all',
                    editable: false,
                    mode: 'local',
                    store: new Ext.data.ArrayStore({
                        fields: ['myId', 'displayText'],
                        data: [
                            [0, '是'],
                            [1, '否']
                        ]
                    }),
                    valueField: 'myId',
                    displayField: 'displayText',
                    fieldLabel: '是否签订美发合同',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'HairInfo',
                    fieldLabel: '美发合同备注',
                    anchor: '100%'
                }, {
                    xtype: 'textarea',
                    name: 'MemoInfo',
                    fieldLabel: '备注',
                    anchor: '100%'
                }]
            }]
        }]
    }]
});

// function 各类操作
//保存用户信息
function ActionSave() {
    //Ext.Msg.alert("卡号"+CodeInfo.find("name","Code")[0].getValue());
    //Ext.Msg.alert("CustomerId:"+KeHuInfo.find("name","CustomerId")[0].getValue());
    Pdformedit();
    if (haveEdit == true) {
        //if(JMForGetVCodeOK==true){
        var code = CodeInfo.find("name", "Code")[0].getValue(); //卡号
        var codebz = CodeInfo.find("name", "MemoInfo")[0].getValue(); //卡信息备注
        if (KeHuInfo.getForm().isValid()) {
            try {
                KeHuInfo.getForm().submit({
                    waitMsg: "正在提交，请稍候...",
                    url: "../Apis/CardMgr.aspx?actionName=Update&sid=" + Sys.sid,
                    params: {
                        code: code,
                        codebz: codebz,
                        KeHuEdit: KeHuEdit,
                        CodeInfoMemoInfo: CodeInfoMemoInfo,
                        VCode: VCode,
                        HireInfo: JSON.stringify(jsonHireInfo),
                        FaceInfo: JSON.stringify(jsonFaceInfo)
                    },
                    success: function(form, action) {
                        Ext.Msg.alert("提示", action.result.msg);
                        haveEdit = false;
                        KeHuEdit = '';
                        KeHuEdit = new Array();
                        CodeInfoMemoInfo = '';
                        JMForGetVCodeOK = false;
                        VCode = '';
                        jsonHireInfo = {};
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert("提示", action.result.msg);
                        haveEdit = false;
                    }
                });
            } catch (ex) {
                alert(ex);
            }
        } else {
            Ext.Msg.alert("未执行");
        }
        //}else{
        //JMForGetVCode(ActionSave);
        //}
    } else {
        Ext.Msg.alert("消息", "没有改动内容！");
    }
}

//挂失、启用 客户卡(Icard)
function gq(status) {
    //if(JMForGetVCodeOK==true){
    Ext.Ajax.request({
        url: "../Apis/CardMgr.aspx?actionName=UpdateCardStatus&sid=" + Sys.sid,
        method: 'post',
        params: {
            CardCodeNo: CardCodeNo,
            status: status,
            VCode: VCode
        },
        success: function(response, opts) {
            var obj = Ext.decode(response.responseText);
            Ext.Msg.alert("提示", obj.msg);
            JMForGetVCodeOK = false;
            VCode = '';
            //Ext.getCmp('Status').setValue(status);
            CodeInfo.find('name', 'Status')[0].setValue(status);
        },
        failure: function(response, opts) {
            var obj = Ext.decode(response.responseText);
            Ext.Msg.alert("提示", obj.msg);
        }
    });
    //}else{
    //	JMForGetVCode(gq,status);
    //}
}

//判断是否修改过form内容
var haveEdit = false;
var KeHuEdit = new Array(); //客户信息 被修改的资料（保存在数组中）
var CodeInfoMemoInfo; // 卡信息  备注被修改
var jsonHireInfo = {};
var jsonFaceInfo = {};

function Pdformedit() {
	jsonHireInfo = {};
	jsonFaceInfo = {};
    var KeHuInfoForm = KeHuInfo.getForm();
    if (KeHuInfoForm) {
        var i = 0;
        KeHuInfoForm.items.each(function(item1) {
            var value = item1.value;
            if (value == null) {
                value = '';
            } else {
                value = value.toString().replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
            }
            var getValue = item1.getValue();
            if (getValue != null) {
                getValue = getValue.toString();
                getValue = getValue.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
            }
            if (item1.name == 'Birthday') {
                if (getValue == null || getValue == undefined || getValue == '') {
                    getValue = '';
                } else {
                    getValue = (new Date(getValue)).format('Y-m-d');
                }
                if (Birthday != getValue) {
                    haveEdit = true;
                    KeHuEdit[i] = '{"name":"' + item1.name + '","values":["' + Birthday.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + '","' + getValue + '"]}';
                    Birthday = getValue;
                    i++;
                }
            } else if (item1.name == 'Sex') {
                if (getValue == '0') getValue = '男';
                else if (getValue == '1') getValue = '女';
                if (Sex != getValue) {
                    haveEdit = true;
                    KeHuEdit[i] = '{"name":"' + item1.name + '","values":["' + Sex + '","' + getValue + '"]}';
                    Sex = getValue;
                    i++;
                }
            } else if (item1.name == 'IsFace') {
                if (IsFace != getValue && getValue != '是' && getValue != '否') {
                    haveEdit = true;
                    KeHuEdit[i] = '{"name":"' + item1.name + '","values":["' + IsFace + '","' + getValue + '"]}';
                    IsFace = getValue;
                    i++;
                }
            } else if (item1.name == 'IsHair') {
                if (IsHair != getValue && getValue != '是' && getValue != '否') {
                    haveEdit = true;
                    KeHuEdit[i] = '{"name":"' + item1.name + '","values":["' + IsHair + '","' + getValue + '"]}';
                    IsHair = getValue;
                    i++
                }
            } else if (item1.name == 'CustomerWork') {
                if (Work != item1.getRawValue()) {
                    haveEdit = true;
                    if (Work == undefined || Work == null) {
                        Work = '';
                    }
                    getValue = item1.getRawValue();
                    getValue = getValue.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
                    KeHuEdit[i] = '{"name":"' + item1.name + '","values":["' + Work.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + '","' + getValue + '"]}';
                    Work = getValue;
                    i++;
                }
            } else if (value != getValue) {
                haveEdit = true;
                KeHuEdit[i] = '{"name":"' + item1.name + '","values":["' + value + '","' + getValue + '"]}';
                item1.value = item1.getValue();
                i++;
            }
        });
    }
    if (CodeInfo.find('name', 'MemoInfo')[0].value == null) {
        CodeInfo.find('name', 'MemoInfo')[0].setValue('');
    }
    if (CodeInfo.find('name', 'MemoInfo')[0].value != CodeInfo.find('name', 'MemoInfo')[0].getValue()) {
        haveEdit = true;
        haveEdit = true;
        var noreMemoInfo = CodeInfo.find('name', 'MemoInfo')[0].value;
        if (noreMemoInfo == undefined || noreMemoInfo == null || noreMemoInfo == 'NULL') {
            noreMemoInfo = '';
        }
        var changes = CodeInfo.find('name', 'MemoInfo')[0].getValue();
        changes = changes.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
        CodeInfoMemoInfo = '{"name":"MemoInfo","values":["' + noreMemoInfo.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + '","' + changes + '"]}';
        CodeInfo.find('name', 'MemoInfo')[0].value = CodeInfo.find('name', 'MemoInfo')[0].getValue();
    }
    var HireInfoForm = HireInfo.getForm();

    //jsonFaceInfo
    HireInfoForm.items.each(function(item1) {

        var value = item1.getValue() || "";
        if (item1.name == "ext_hair_2") {
            value = (new Date(value)).format('Y-m-d');
        }
        jsonHireInfo[item1.name] = value;
        haveEdit = true;

    });
    jsonHireInfo = [jsonHireInfo];

    var FaceInfoForm = FaceInfo.getForm();
    FaceInfoForm.items.each(function(item1) {

        var value = item1.getValue() || "";
        if (item1.name == "ext_face_2") {
            value = (new Date(value)).format('Y-m-d');
        }
        jsonFaceInfo[item1.name] = value;
        haveEdit = true;

    });
    jsonFaceInfo = [jsonFaceInfo];
    //alert(haveEdit);
}


var CodeInfo = new Ext.form.FormPanel({
    reader: new Ext.data.JsonReader({
        fields: [{
            name: 'CreateDate'
        }, {
            name: 'Status',
            mapping: 'Status'
        }, {
            name: 'Balance',
            mapping: 'Balance'
        }, {
            name: 'Arrear',
            mapping: 'Arrear'
        }, {
            name: 'Code',
            mapping: 'Code'
        }, {
            name: 'PublishDate',
            mapping: 'PublishDate'
        }, {
            name: 'LastConsumeDate',
            mapping: 'LastConsumeDate'
        }, {
            name: 'PaySum',
            mapping: 'PaySum'
        }, {
            name: 'UsedSum',
            mapping: 'UsedSum'
        }, {
            name: 'CardType',
            mapping: 'CardType'
        }, {
            name: 'AllowChangeCustomer',
            mapping: 'AllowChangeCustomer',
            convert: function(value) {
                if (value == 1) {
                    return "是";
                } else {
                    return "否"
                }
            }
        }, {
            name: 'MemoInfo',
            mapping: 'MemoInfo',
            convert: function(value) {
                if (value == null) {
                    return "";
                } else {
                    return value;
                }
            }
        }]
    }),


    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    width: '96%',
    items: [{
        style: 'margin-top:10px;margin-left:13px;',
        xtype: 'fieldset',
        collapsible: true,
        title: '卡信息',
        width: '100%',
        height: 220,
        labelWidth: 80,
        items: [{
            border: false,
            style: 'margin:10px;margin-top:4px;',
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                defaults: {
                    width: 150
                },
                items: [{
                    xtype: 'textfield',
                    name: 'CreateDate',
                    hidden: true
                }, {
                    xtype: 'textfield',
                    //id:'Status',
                    name: 'Status',
                    readOnly: true,
                    fieldLabel: '状态',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'Code',
                    readOnly: true,
                    fieldLabel: '卡号',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'CardType',
                    readOnly: true,
                    fieldLabel: '卡类型',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'PaySum',
                    readOnly: true,
                    fieldLabel: '已售金额',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'UsedSum',
                    readOnly: true,
                    fieldLabel: '使用金额',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'AllowChangeCustomer',
                    readOnly: true,
                    fieldLabel: '允许修改客户信息',
                    anchor: '100%'
                }]
            }, {
                columnWidth: .5,
                style: 'margin-left:5px',
                layout: 'form',
                defaults: {
                    width: 150
                },
                items: [{
                    xtype: 'textfield',
                    name: 'Balance',
                    readOnly: true,
                    fieldLabel: '可用余额',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'Arrear',
                    readOnly: true,
                    fieldLabel: '欠款',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'PublishDate',
                    readOnly: true,
                    fieldLabel: '发卡日期',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'LastConsumeDate',
                    readOnly: true,
                    fieldLabel: '最后使用日期',
                    anchor: '100%'
                }, {
                    xtype: 'textarea',
                    name: 'MemoInfo',
                    fieldLabel: '备注',
                    anchor: '100%'
                }]
            }]
        }]
    }]
});

//卡消费信息
var mystore = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CardMgr.aspx?actionName=GethCardById&sid=' + Sys.sid,
    remoteSort: true,
    reader: new Ext.data.JsonReader({
        root: 'results',
        fields: [{
            name: 'CardNo',
            mapping: 'CardNo'
        }, {
            name: 'CardType',
            mapping: 'CardType'
        }, {
            name: 'BillDate',
            mapping: 'BillDate'
        }, {
            name: 'BillType',
            mapping: 'BillType'
        }, {
            name: 'DetailCode',
            mapping: 'DetailCode'
        }, {
            name: 'DetailName',
            mapping: 'DetailName'
        }, {
            name: 'Price',
            mapping: 'Price'
        }, {
            name: 'Quantity',
            mapping: 'Quantity'
        }, {
            name: 'Amount',
            mapping: 'Amount'
        }, {
            name: 'Rebate',
            mapping: 'Rebate'
        }, {
            name: 'MasterName',
            mapping: 'MasterName'
        }, {
            name: 'AsstName',
            mapping: 'AsstName'
        }]
    })
});

var tar_employee = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getEmployee&char_length=2&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "CombineWord",
            mapping: "CombineWord"
        }, {
            name: "ID",
            mapping: "ID"
        }, {
            name: "Title",
            mapping: "Title"
        }]
    }),
    sortInfo: {
        field: 'CombineWord',
        direction: 'ASC'
    }
});


var store_history = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/CardMgr.aspx?actionName=getServiceHistoryById&sid=" + Sys.sid,
    //remoteSort: true,
    reader: new Ext.data.JsonReader({
        root: 'results',
        fields: [{
            name: 'id',
            mapping: 'id'
        }, {
            name: 'CreateID',
            mapping: 'CreateID'
        }, {
            name: 'ServiceDate',
            mapping: 'ServiceDate'
        }, {
            name: 'MasterName',
            mapping: 'MasterName'
        }, {
            name: 'ServiceName',
            mapping: 'ServiceName'
        }, {
            name: 'Effect',
            mapping: 'Effect'
        }, {
            name: 'DeleteEnable',
            mapping: 'DeleteEnable'
        }]
    })
});

var cm_history = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
    header: 'id',
    dataIndex: 'id',
    ID: "id",
    hidden: true,
    width: 100
}, {
    header: 'CreateID',
    dataIndex: 'CreateID',
    ID: "CreateID",
    hidden: true,
    width: 100
}, {
    header: 'DeleteEnable',
    dataIndex: 'DeleteEnable',
    ID: "DeleteEnable",
    hidden: true,
    width: 100
}, {
    header: '日期',
    dataIndex: 'ServiceDate',
    align: 'center'
}, {
    header: '主理',
    dataIndex: 'MasterName'
}, {
    header: '项目',
    dataIndex: 'ServiceName',
}, {
    header: '效果记录',
    width: 347,
    dataIndex: 'Effect',
    renderer: function(v, m, r) {　　
        m.attr = "style=\"white-space:normal;\"";　　
        return v;　　
    }
}, { //删除按钮
    header: "操作",
    dataIndex: "button",
    width: 100,
    align: 'center',
    renderer: showbuttonDele

}]);


//mystore.load();

var mycm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
    header: '卡号',
    dataIndex: 'CardNo'
}, {
    header: '卡类别',
    dataIndex: 'CardType'
}, {
    header: '消费时间',
    dataIndex: 'BillDate'
}, {
    header: '消费类型',
    dataIndex: 'BillType'
}, {
    header: '服务代码',
    dataIndex: 'DetailCode'
}, {
    header: '服务名称',
    dataIndex: 'DetailName'
}, {
    header: '单价',
    dataIndex: 'Price'
}, {
    header: '数量',
    dataIndex: 'Quantity'
}, {
    header: '金额',
    dataIndex: 'Amount'
}, {
    header: '折扣率',
    dataIndex: 'Rebate'
}, {
    header: '主理',
    dataIndex: 'MasterName'
}, {
    header: '助理',
    dataIndex: 'AsstName'
}]);

var mygrid = new Ext.grid.GridPanel({
    store: mystore,
    cm: mycm
});

var grid_history = new Ext.grid.GridPanel({
    store: store_history,
    cm: cm_history
});

var CodexfInfo = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    width: '96%',
    items: [{
        xtype: 'fieldset',
        collapsible: true,
        title: '卡消费信息（本机）',
        //id:'showgird',
        style: 'margin-top:10px;margin-left:13px;',
        width: '100%',
        height: 240,
        items: [{
            width: '100%',
            height: 300,
            border: false,
            style: 'margin-left:10px;padding-top:10px;',
            layout: "anchor",
            items: [{
                layout: "fit",
                border: false,
                anchor: '-1 -100',
                items: [mygrid]
            }]
        }]
    }]
});

var today = new Date();
var lastDay = new Date();



var ServiceHistoryInfo = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    width: '96%',
    items: [{
            xtype: 'fieldset',
            collapsible: true,
            title: '服务效果记录',
            //id:'showgird',
            style: 'margin-top:10px;margin-left:13px;',
            width: '100%',
            height: 400,
            items: [{ //first
                    xtype: "fieldset",
                    title: "",
                    style: {
                        marginLeft: '4px',
                        marginTop: '4px'
                    },

                    layout: "column",
                    items:

                        [{
                                layout: "column",
                                columnWidth: 1,
                                style: {
                                    marginLeft: '4px',
                                    marginTop: '5px'
                                },
                                items: [{
                                        xtype: "label",
                                        html: '日期：',

                                        style: {
                                            marginTop: '3px',
                                            marginLeft: '3px'
                                        }
                                    }, {
                                        xtype: "label",
                                        html: '主理：',
                                        style: {
                                            marginTop: '3px',
                                            marginLeft: '132px'
                                        }
                                    }, {
                                        xtype: "label",
                                        html: '项目：',
                                        style: {
                                            marginTop: '3px',
                                            marginLeft: '147px'
                                        }
                                    }

                                ]
                            }, { //second
                                layout: "column",
                                columnWidth: 1,
                                style: {
                                    marginLeft: '4px',
                                    marginTop: '10px'
                                },
                                items: [ //third
                                        {
                                            xtype: "datefield",

                                            editable: false,
                                            fieldLabel: "日期",
                                            name: "ServiceDate",
                                            format: "Y-m-d",
                                            enableKeyEvents: true,
                                            width: 170,
                                            listeners: {
                                                'specialkey': function(_field, _e) {
                                                    if (_e.getKey() == _e.ENTER) {
                                                        ServiceHistoryInfo.find("name", "MasterName")[0].focus(false, 100);
                                                    }
                                                }
                                            }

                                        }, {

                                            xtype: "combo",
                                            name: "MasterName",
                                            hiddenName: "MasterName",
                                            store: tar_employee,
                                            triggerAction: 'all',
                                            width: 180,
                                            border: 1,
                                            valueField: 'Title',
                                            displayField: 'CombineWord',
                                            enableKeyEvents: true,
                                            selectOnFocus: true,
                                            allowBlank: true,
                                            forceSelection: true,
                                            hideTrigger: true,
                                            listeners: {

                                                "keyup": function(v) {
                                                    var value = v.getRawValue();

                                                    if (value != null && value.length >= 1) {
                                                        tar_employee.load({
                                                            params: {
                                                                key: v.getRawValue()
                                                            }
                                                        });

                                                    }
                                                }
                                            },
                                            style: {
                                                marginLeft: '3px'
                                            }
                                        }, {

                                            xtype: "textfield",
                                            fieldLabel: "项目",
                                            name: "ServiceName",
                                            width: 402,
                                            listeners: {
                                                'specialkey': function(_field, _e) {
                                                    if (_e.getKey() == _e.ENTER) {
                                                        ServiceHistoryInfo.find("name", "Effect")[0].focus(false, 100);
                                                    }
                                                }
                                            },
                                            style: {
                                                marginLeft: '3px'
                                            }

                                        }

                                    ] //third
                            }, {
                                layout: "column",
                                columnWidth: 1,
                                style: {
                                    marginLeft: '4px',
                                    marginTop: '5px'
                                },
                                items: [{

                                    xtype: "label",
                                    html: '效果记录：',
                                    style: {
                                        marginTop: '3px',
                                        marginLeft: '4px'
                                    }
                                }]
                            }, {
                                layout: "column",
                                columnWidth: 1,
                                style: {
                                    marginLeft: '4px',
                                    marginTop: '5px'
                                },
                                items: [{

                                    xtype: "textarea",

                                    fieldLabel: "效果记录",
                                    name: "Effect",
                                    width: 750,

                                    listeners: {
                                        'specialkey': function(_field, _e) {
                                            if (_e.getKey() == _e.ENTER) {
                                                Ext.getCmp("btnSave").fireEvent('click');
                                            }
                                        }
                                    }

                                }/*, {
                                    width: 100,
                                    style: {

                                        marginTop: '-7px'
                                    },
                                    buttons: [{
                                        id: "btnSave",
                                        text: "添 加",
                                        listeners: {
                                            click: function() {
                                                id = 0;
                                                AddAction();
                                            }
                                        }

                                    }]
                                }*/]
                            },
                            {
                                layout: "column",
                                columnWidth: 1,
                                style: {
                                    marginLeft: '4px',
                                    marginTop: '5px'
                                },
                                items: [ {
                                    width: 757,
                                    style: {

                                        marginTop: '-2px'

                                    },
                                    buttons: [{
                                        id: "btnSave",
                                        text: "添 加",
                                        listeners: {
                                            click: function() {
                                                id = 0;
                                                AddAction();
                                            }
                                        }

                                    }]
                                }]
                            }

                        ] //second
                },

                {
                    width: '100%',
                    height: 300,
                    border: false,
                    style: 'margin-left:10px;padding-top:10px;',
                    layout: "anchor",
                    items: [{
                        layout: "fit",
                        border: false,
                        anchor: '-1 -100',
                        items: [grid_history]
                    }]
                }

            ]
        }

    ]
});


var HireInfo = new Ext.form.FormPanel({

    reader: new Ext.data.JsonReader({
        fields: [{
            name: 'ext_hair_1',
            mapping: 'ext_hair_1'
        }, {
            name: 'ext_hair_2',
            mapping: 'ext_hair_2'
        }, {
            name: 'ext_hair_3',
            mapping: 'ext_hair_3'
        }, {
            name: 'ext_hair_4',
            mapping: 'ext_hair_4'
        }, {
            name: 'ext_hair_5',
            mapping: 'ext_hair_5'
        }, {
            name: 'ext_hair_6',
            mapping: 'ext_hair_6'
        }, {
            name: 'ext_hair_7',
            mapping: 'ext_hair_7'
        }, {
            name: 'ext_hair_8',
            mapping: 'ext_hair_8'
        }, {
            name: 'ext_hair_9',
            mapping: 'ext_hair_9'
        }, {
            name: 'ext_hair_10',
            mapping: 'ext_hair_10'
        }, {
            name: 'ext_hair_11',
            mapping: 'ext_hair_11'
        }, {
            name: 'ext_hair_12',
            mapping: 'ext_hair_12'
        }, {
            name: 'ext_hair_13',
            mapping: 'ext_hair_13'
        }, {
            name: 'ext_hair_14',
            mapping: 'ext_hair_14'
        }]
    }),

    frame: true,
    border: false,
    autoScroll: true,
    width: '96%',
    items: [{
        xtype: 'fieldset',
        collapsible: true,
        title: '头发问题',
        style: 'margin-left:10px;margin-top:10px;',
        width: '100%',
        height: 250,
        items: [{
            border: false,
            layout: 'column',
            labelWidth: 100,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    name: 'ext_hair_1',
                    fieldLabel: '美发协议编号',
                    anchor: '100%'
                }, {
                    xtype: "datefield",
                    editable: false,
                    fieldLabel: "签订日期",
                    name: "ext_hair_2",
                    format: "Y-m-d",
                    enableKeyEvents: true,
                     width: 130,
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_3',
                    fieldLabel: '头发问题',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_4',
                    fieldLabel: '头皮问题',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_5',
                    fieldLabel: '睡眠质量',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_6',
                    fieldLabel: '过敏史',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_7',
                    fieldLabel: '慢性病史',
                    anchor: '100%'
                }]
            }, {
                columnWidth: .5,
                layout: 'form',
                style: 'margin-left:5px;',
                items: [{
                    xtype: 'textfield',
                    name: 'ext_hair_8',
                    fieldLabel: '常去美发店',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_12',
                    fieldLabel: '美发周期',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_9',
                    fieldLabel: '常做项目',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_10',
                    fieldLabel: '顾问建议发型',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_11',
                    fieldLabel: '建议项目',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_hair_13',
                    fieldLabel: '建议套装',
                    anchor: '100%'
                }, {
                    xtype: 'textarea',
                    name: 'ext_hair_14',
                    fieldLabel: '希望的到什么改变',
                    anchor: '100%'
                }]
            }]
        }]
    }]
});


var FaceInfo = new Ext.form.FormPanel({

    reader: new Ext.data.JsonReader({
        fields: [{
            name: 'ext_face_1',
            mapping: 'ext_face_1'
        }, {
            name: 'ext_face_2',
            mapping: 'ext_face_2'
        }, {
            name: 'ext_face_3',
            mapping: 'ext_face_3'
        }, {
            name: 'ext_face_4',
            mapping: 'ext_face_4'
        }, {
            name: 'ext_face_5',
            mapping: 'ext_face_5'
        }, {
            name: 'ext_face_6',
            mapping: 'ext_face_6'
        }, {
            name: 'ext_face_7',
            mapping: 'ext_face_7'
        }, {
            name: 'ext_face_8',
            mapping: 'ext_face_8'
        }, {
            name: 'ext_face_9',
            mapping: 'ext_face_9'
        }, {
            name: 'ext_face_10',
            mapping: 'ext_face_10'
        }, {
            name: 'ext_face_11',
            mapping: 'ext_face_11'
        }, {
            name: 'ext_face_12',
            mapping: 'ext_face_12'
        }, {
            name: 'ext_face_13',
            mapping: 'ext_face_13'
        }, {
            name: 'ext_face_14',
            mapping: 'ext_face_14'
        }, {
            name: 'ext_face_15',
            mapping: 'ext_face_15'
        }, {
            name: 'ext_face_16',
            mapping: 'ext_face_16'
        }, {
            name: 'ext_face_17',
            mapping: 'ext_face_17'
        }, {
            name: 'ext_face_18',
            mapping: 'ext_face_18'
        }, {
            name: 'ext_face_19',
            mapping: 'ext_face_19'
        }, {
            name: 'ext_face_20',
            mapping: 'ext_face_20'
        }, {
            name: 'ext_face_21',
            mapping: 'ext_face_21'
        }, {
            name: 'ext_face_22',
            mapping: 'ext_face_22'
        }, {
            name: 'ext_face_23',
            mapping: 'ext_face_23'
        }, {
            name: 'ext_face_24',
            mapping: 'ext_face_24'
        }, {
            name: 'ext_face_25',
            mapping: 'ext_face_25'
        }, {
            name: 'ext_face_26',
            mapping: 'ext_face_26'
        }, {
            name: 'ext_face_27',
            mapping: 'ext_face_27'
        }, {
            name: 'ext_face_28',
            mapping: 'ext_face_28'
        }]
    }),

    frame: true,
    border: false,
    autoScroll: true,
    width: '96%',
    items: [{
        xtype: 'fieldset',
        collapsible: true,
        title: '美容详情',
        style: 'margin-left:10px;margin-top:10px;',
        width: '100%',
        height: 400,
        items: [{
            border: false,
            layout: 'column',
            labelWidth: 100,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    name: 'ext_face_1',
                    fieldLabel: '美容协议编号',
                    anchor: '100%'
                }, {
                    xtype: "datefield",
                    editable: false,
                    fieldLabel: "签订日期",
                    name: "ext_face_2",
                    format: "Y-m-d",
                    enableKeyEvents: true,
                    width: 130,
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_3',
                    fieldLabel: '头疼部位',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_4',
                    fieldLabel: '头疼类型',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_5',
                    fieldLabel: '胸腹疼部位',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_6',
                    fieldLabel: '胸腹疼类型',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_7',
                    fieldLabel: '腰疼部位',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_8',
                    fieldLabel: '腰疼类型',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_9',
                    fieldLabel: '背疼部位',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_10',
                    fieldLabel: '背疼类型',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_11',
                    fieldLabel: '四肢疼部位',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_12',
                    fieldLabel: '四肢疼类型',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_13',
                    fieldLabel: '肩颈疼部位',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_14',
                    fieldLabel: '肩颈疼类型',
                    anchor: '100%'
                }]
            }, {
                columnWidth: .5,
                layout: 'form',
                style: 'margin-left:5px;',
                items: [{
                    xtype: 'textfield',
                    name: 'ext_face_15',
                    fieldLabel: '大便情况',
                    anchor: '100%'
                }, {

                    xtype: 'textfield',
                    name: 'ext_face_16',
                    fieldLabel: '小便情况',
                    anchor: '100%'

                }, {
                    xtype: 'textfield',
                    name: 'ext_face_17',
                    fieldLabel: '月经情况',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_18',
                    fieldLabel: '睡眠情况',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_19',
                    fieldLabel: '过敏史',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_20',
                    fieldLabel: '慢性病史',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_21',
                    fieldLabel: '顾问检测结果',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_22',
                    fieldLabel: '皮肤问题',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_23',
                    fieldLabel: '建议面部项目',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_24',
                    fieldLabel: '建议身体项目',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_25',
                    fieldLabel: '内服产品',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_26',
                    fieldLabel: '外用产品',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_27',
                    fieldLabel: '身体状况',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    name: 'ext_face_28',
                    fieldLabel: '建议经络养生',
                    anchor: '100%'
                }]
            }]
        }]
    }]
});


var win_CardCustomerXF = new Ext.Window({
    title: "卡用户信息",
    layout: 'fit',
    width: 900,
    height: 600,
    modal: true,
    closeAction: 'hide',
    plain: true,
    items: [{
        autoScroll: true,
        items: [CodesButton, CodeInfo, KeHuInfo, HireInfo, FaceInfo, CodexfInfo, ServiceHistoryInfo]
    }],
    listeners: {
        hide: function() {
            CardCodeNo = '';
            CustomerId = '';
            CardId = '';
            haveEdit = false;
            CodeInfo.getForm().reset();
            KeHuInfo.getForm().reset();
            HireInfo.getForm().reset();
        }
    }
});

//=============Window(密码修改窗口)===============
var UpdatePwdForm = new Ext.form.FormPanel({
    layout: 'form',
    bodyStyle: 'padding:5px',
    labelAlign: 'right',
    labelWidth: 70,
    height: 70,
    items: [{
        xtype: 'textfield',
        //id:'NewPwd',
        name: 'NewPwd',
        fieldLabel: '新密码',
        allowBlank: false,
        inputType: "password",
        width: 150,
        enableKeyEvents: true,
        listeners: {
            keyup: function(th, e) {
                if (e.keyCode == 13) {
                    document.getElementsByName('reNewPwd')[0].focus();
                }
            }
        }
    }, {
        xtype: 'textfield',
        //id:'reNewPwd',
        name: 'reNewPwd',
        fieldLabel: '重复密码',
        allowBlank: false,
        inputType: "password",
        width: 150,
        enableKeyEvents: true,
        listeners: {
            keyup: function(th, e) {
                if (e.keyCode == 13) {
                    YzNewPwd();
                }
            }
        }
    }]
});

var UpdatePwdWin = new Ext.Window({
    title: '修改密码',
    iconCls: 'find',
    layout: 'fit',
    width: 300,
    heihgt: 450,
    modal: true,
    plain: true,
    closeAction: 'hide',
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: [UpdatePwdForm],
    buttons: [{
        text: '提交',
        handler: function() {
            YzNewPwd();
        }
    }, {
        text: '重置',
        handler: function() {
            UpdatePwdForm.getForm().reset();
        }
    }],
    listeners: {
        hide: function() {
            UpdatePwdForm.getForm().reset();
        }
    }
});

//验证修改密码
function YzNewPwd() {
    var newpwd = UpdatePwdForm.find('name', 'NewPwd')[0].getValue();
    var renewpwd = UpdatePwdForm.find('name', 'reNewPwd')[0].getValue();
    if (newpwd != renewpwd) {
        Ext.Msg.alert('提示', "密码重复不相同", function() {
            UpdatePwdForm.find('name', 'NewPwd')[0].focus();
        });
        UpdatePwdForm.find('name', 'NewPwd')[0].setValue('');
        UpdatePwdForm.find('name', 'reNewPwd')[0].setValue('');
    } else {
        var Code = CodeInfo.find('name', 'Code')[0].getValue();
        if (UpdatePwdForm.getForm().isValid()) {
            UpdatePwd(Code);
        }
    }
}

function UpdatePwd(Code) {
    //if(JMForGetVCodeOK==true){
    UpdatePwdForm.getForm().submit({
        waitMsg: "正在提交，请稍候...",
        params: {
            Code: Code,
            VCode: VCode
        },
        url: "../Apis/CardMgr.aspx?actionName=UpdatePwd&type=CodeInfo&sid=" + Sys.sid,
        success: function(form, action) {
            Ext.Msg.alert('提示', action.result.msg);
            if (action.result.success) {
                UpdatePwdWin.hide();
                UpdatePwdForm.getForm().reset();
                JMForGetVCodeOK = false;
                VCode = '';
            }
        },
        failure: function(form, action) {
            Ext.Msg.alert("提示", action.result.msg);
            JMForGetVCodeOK = false;
        }
    });
    //}else if(JMForGetVCodeOK==false){
    //	JMForGetVCode(UpdatePwd,Code);
    //}
}

//判断卡信息修改时间去数据库拉去验证码
var JMForGetVCodeOK = false; //判断验证码输入是否正确
function JMForGetVCode(fn, txt) {
    Ext.Ajax.request({
        url: '../Apis/CardMgr.aspx?actionName=JMForGetVCode&sid=' + Sys.sid,
        params: {
            CardId: CardId,
            CustomerId: CustomerId
        },
        mothed: 'post',
        success: function(response, opts) {
            var obj = Ext.decode(response.responseText);
            if (obj.ok == false) {
                JudgeVCode(fn, txt);
            } else if (obj.ok == true) {
                JMForGetVCodeOK = true;
                fn(txt);
            }
        },
        failure: function(response, opts) {
            var obj = Ext.decode(response.responseText);
            Ext.Msg.alert('提示', obj.msg);
        }
    });
}

//判断验证码是否正确
function JudgeVCode(fn, txt) {
    if (JMForGetVCodeOK == false) {
        Ext.Msg.prompt('输入框', '请输入验证码', function(btn, text) {
            if (btn == 'ok') {
                if (text != '') {
                    Ext.Ajax.request({
                        url: '../Apis/CardMgr.aspx?actionName=JudgeVCode&sid=' + Sys.sid,
                        params: {
                            VCode: text
                        },
                        success: function(response, opts) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success == true) {
                                JMForGetVCodeOK = obj.msg;
                                VCode = text;
                                fn(txt);
                            } else {
                                Ext.Msg.alert('提示', obj.msg, function() {
                                    JMForGetVCodeOK = false;
                                    JudgeVCode(fn, txt);
                                });
                            }
                        },
                        failure: function(response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert('提示', obj.msg, function() {
                                JMForGetVCodeOK = false;
                                JudgeVCode(fn, txt);
                            });
                        }
                    });
                } else {
                    JudgeVCode(fn, txt);
                }
            }
        });
    } else {
        fn(txt);
    }
}

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
        anchor: '-1 -100',
        items: [pd_grid]
    }]
});

function showbuttonDele(value, metadata, record, rowIndex, columnIndex, store) {
    window.DelInfo = function(rowIndex) {
        var selections = grid_history.selModel.getSelections();
        var id = grid_history.getSelectionModel().getSelected().get("id");

        Ext.Msg.confirm('提示', '确定删除？', function(btn) {
            if (btn == 'yes') {
                Ext.each(selections, function(item) {
                    Ext.Ajax.request({
                        params: {
                            customerId: CustomerId,
                            recordId: id
                        },
                        success: function(form, action) {
                            store_history.reload();
                        },

                        url: '../Apis/CardMgr.aspx?actionName=deleteServiceHistoryItem&sid=' + Sys.sid
                    });

                });
            }
        });
    }

    var resultStr = "";

    if (record.data.DeleteEnable == true) {
        resultStr = "<a href='#' onclick='DelInfo(" + rowIndex + ")'>删除</a> ";
    }
    return resultStr;
}

function AddAction() {

    var serviceDate = Ext.util.Format.date(ServiceHistoryInfo.find("name", "ServiceDate")[0].getValue(), 'Y-m-d');
    var masterName = ServiceHistoryInfo.find("name", "MasterName")[0].getValue();

    var serviceName = ServiceHistoryInfo.find("name", "ServiceName")[0].getRawValue();
    var effect = ServiceHistoryInfo.find("name", "Effect")[0].getValue();

    if (serviceDate == null || serviceDate == "") {
        Ext.MessageBox.alert("提醒", "请选择日期");
        serviceName.find("name", "ServiceDate")[0].focus(false, 100);
        return;
    }

    if (masterName == null || masterName == "") {
        Ext.MessageBox.alert("提醒", "请填写主理");
        ServiceHistoryInfo.find("name", "MasterName")[0].focus(false, 100);
        return;
    }

    if (serviceName == null || serviceName == "") {
        Ext.MessageBox.alert("提醒", "请填写项目");
        ServiceHistoryInfo.find("name", "ServiceName")[0].focus(false, 100);
        return;
    }

    if (effect == null || effect == "") {
        Ext.MessageBox.alert("提醒", "填写效果记录");
        ServiceHistoryInfo.find("name", "Effect")[0].focus(false, 100);
        return;
    }




    if (ServiceHistoryInfo.getForm().isValid()) {

        Ext.Ajax.request({
            url: "../Apis/CardMgr.aspx?actionName=addServiceHistory&DeptID=1&sid=" + Sys.sid, //+"&mydate="+mydate+"&myCode="+mycode+"&mytype="+mytype+"&mycount="+mycount,

            params: {
                id: CustomerId,
                serviceDate: serviceDate,
                masterName: masterName,
                serviceName: serviceName,
                effect: effect
            },
            success: function(form, action) {
                var respText = Ext.util.JSON.decode(form.responseText);
                if (respText.success == false) {
                    Ext.MessageBox.alert("提醒", respText.msg);
                    return false;
                }
                //Ext.MessageBox.alert("提醒", action.result.msg);
                ServiceHistoryInfo.find("name", "ServiceDate")[0].setValue("");
                ServiceHistoryInfo.find("name", "MasterName")[0].setValue("");
                ServiceHistoryInfo.find("name", "ServiceName")[0].setValue("");
                ServiceHistoryInfo.find("name", "Effect")[0].setValue("");
                //操作成功
                //Ext.MessageBox.alert("提醒", "提交成功");
                store_history.reload();

            },
            failure: function(form, action) {

                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
            }
        });

    }
}

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
