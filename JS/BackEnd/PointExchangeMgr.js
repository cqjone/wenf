//积分兑换管理

//单据的ID
var id = 0;

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
            columnWidth: 0.4,
            items: [{
                xtype: "combo",
                fieldLabel: "兑换目标类型",
                hiddenName: "ExchangeTargetType",
                anchor: "100%",
                triggerAction: 'all',
                editable: false,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: [
            'myId',
            'displayText'
        ],
                    data: ExchangeTargetTypeDataWithAll
                }),
                valueField: 'myId',
                displayField: 'displayText'

            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "datefield",
                fieldLabel: "有效日期[开始]",
                //emptyText: new Date().toLocaleDateString(),
                name: "ValidDateBegin",
                anchor: "100%",
                format: "Y-m-d"
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
                    seacrhData();
                }
            }, {
                xtype: "button",
                boxMinWidth: 60,
                width: 80,
                margins: "0 0 0 5",
                bodyStyle: "margin:0 5px",
                text: "添加兑换规则",
                handler: function () {
                    id = 0;
                    AddExchangeForm.getForm().reset();
                    AddExchangeWindow.show();
                }
            }]
        }, {
            layout: "column",
            columnWidth: 1,
            items: [{
                layout: "form",
                columnWidth: 0.4,
                items:[{
                    xtype: "datefield",
                    fieldLabel: "有效日期[结束]",
                    //emptyText: new Date().toLocaleDateString(),
                    name: "ValidDateEnd",
                    anchor: "100%",
                    format: "Y-m-d"
                }]
            }]
    }]

}]
});

//添加积分兑换规则
function AddAction() {
    if(AddExchangeForm.getForm().isValid()){
        //提交数据
        //AddExchangeForm.body.mask("正在提交，请稍候...");
        AddExchangeForm.getForm().submit({
            params:{id:id},
            waitMsg:"正在提交，请稍候...",
            url:"../Apis/PointRules.aspx?actionName=submitRule&sid="+Sys.sid,
            success: function (form, action) {
                //AddExchangeForm.body.unmask();
                Ext.MessageBox.alert("提醒", action.result.msg);
                if (action.result.success) {
                    if(id ==0){
                        AddExchangeForm.getForm().reset();
                    }
                } 
                //操作成功
            },
            failure: function (form, action) {
                if(action != undefined && action.result!=undefined){
                    Ext.MessageBox.alert("提醒", action.result.msg);
                }else{
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
                //AddExchangeForm.body.unmask();
            }
        });
    }
}

//删除
function DelAction(id) {
    //return;
    AddExchangeForm.getForm().submit({
        params: { id: id,IsDeleted:1 },
        waitMsg: "正在提交，请稍候...",
        url: "../Apis/PointRules.aspx?actionName=submitRule&sid=" + Sys.sid,
        success: function (form, action) {
            //AddExchangeForm.body.unmask();
            Ext.MessageBox.alert("提醒", action.result.msg);
            if (action.result.success) {
                AddExchangeForm.getForm().reset();
                AddExchangeWindow.hide();
                seacrhData();
                //}
            }
            //操作成功
        },
        failure: function (form, action) {
            if (action != undefined && action.result != undefined) {
                Ext.MessageBox.alert("提醒", action.result.msg);
            } else {
                Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
            }
            //AddExchangeForm.body.unmask();
        }
    });
}

function seacrhData() {
    //store.loadData(myData);
    var data = pd_top_form.getForm().getValues();
    //alert(data);
    pd_store.load({params:data});
}


var tar_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed

    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointRules.aspx?actionName=getTarget&sid=' + Sys.sid,

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
                { name: "Title", mapping: "Title" }
            ]
    }),

    sortInfo: { field: 'ID', direction: 'ASC' }
});

//根据规则显示 目标
function showTarget(v, record) {
    //var vid = 1;
    if(record.ExcTargetType == 1){
        //1：服务
        AddExchangeForm.find("hiddenName", "TargetID")[0].store = tar_service_store;
    } else if (record.ExcTargetType == 2) {
        AddExchangeForm.find("hiddenName", "TargetID")[0].store = tar_product_store;
    } else if (record.ExcTargetType == 3) {
        AddExchangeForm.find("hiddenName", "TargetID")[0].store = tar_goods_store;
    }
    return v;
}
//增加积分兑换规则
var AddExchangeForm = new Ext.form.FormPanel({
    //xtype: "form",
    autoScroll: true,
    labelWidth: 100, // label settings here cascade unless overridden
    //url: '../Apis/Treatment.aspx?sid=' + Sys.sid,
    frame: true,
    //title: 'Simple Form',
    bodyStyle: 'padding:5px 5px 0',
    width: 700,
    height: 400,
    reader: new Ext.data.JsonReader({
        //root: "data",
        fields: [{
            name: "ExcTargetType", mapping: "ExcTargetType"
        }, { name: "PointCountUse", mapping: "PointCountUse" },
        { name: "OnlineFormat", mapping: "OnlineFormat" },
        { name: "TargetID", convert: showTarget },
        { name: "ExcUnlimited" },
        { name: "ExcMaxCount" },
        { name: "ValidDateBegin", type: "date", convert: ConvertJSONDateToJSDateObject, format: "Y-m-d" },
        { name: "ValidDateEnd", type: "date", convert: ConvertJSONDateToJSDateObject, format: "Y-m-d" },
        { name: "MustReservation" },
        { name: "ShopExchangeable" },
        { name: "OnlineName" },
        { name: "OnlinePrice" },
        { name: "OnlineOffsell" },
        { name: "OnlineRecommended" },
        { name: "OnlineRecommendedOrder" },
        { name: "OnlineDescription" },
        { name: "PicFile" },
        { name: "SmallPicFile" },
        { name: "PhonePicFile" }, { name: "EmpDeduct" }, { name: "OtherCost"}]
    }),
    items: [{
        layout: 'column',
        xtype: "fieldset",
        title: "基本信息",
        //defaults: { width: 210 },
        items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: "combo",
                        fieldLabel: "兑换目标类型",
                        hiddenName: "ExcTargetType",
                        anchor: "95%",
                        triggerAction: 'all',
                        editable: false,
                        mode: 'local',
                        store: ExchangeTargetTypeDataStore,
                        valueField: 'id',
                        displayField: 'name',
                        allowBlank: false,
                        listeners: {
                            "select": function (cb, record, index) {
                                AddExchangeForm.find("hiddenName", "TargetID")[0].setValue("");
                                AddExchangeForm.find("hiddenName", "TargetID")[0].store = tar_store;
                                //根据兑换目标判断是否可快递
                                if (AddExchangeForm.find("hiddenName", "ExcTargetType")[0].getValue() == '1') {
                                    AddExchangeForm.find("hiddenName", "Sendable")[0].setValue("0");
                                    AddExchangeForm.find("hiddenName", "Sendable")[0].disabled = true;
                                } else {
                                    AddExchangeForm.find("hiddenName", "Sendable")[0].store = ifStore;
                                    AddExchangeForm.find("hiddenName", "Sendable")[0].disabled = false;
                                }
                                /*tar_store.load({
                                params: { id: record.get("id") }
                                });*/
                            }
                        }

                    }, {
                        xtype: "combo",
                        fieldLabel: "兑换目标",
                        hiddenName: "TargetID",
                        anchor: "95%",
                        triggerAction: 'all',
                        editable: false,
                        //mode: 'remote',
                        /*store: new Ext.data.ArrayStore({
                        id: 0,
                        fields: [
                        'myId',
                        'displayText'
                        ],
                        data: [[1, 'XXX'], [2, 'AA'], [3, 'BB'], [4, 'CC'], [5, 'DD'], [6, 'FF']]
                        }),*/
                        store: tar_store,
                        valueField: 'ID',
                        displayField: 'Title',
                        allowBlank: false,
                        listeners: {
                            "focus": function () {
                                AddExchangeForm.find("hiddenName", "TargetID")[0].store = tar_store;
                                tar_store.load({
                                    params: { id: (AddExchangeForm.find("hiddenName", "ExcTargetType")[0].getValue()) }
                                });
                            }
                        }
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '兑换积分',
                        name: "PointCountUse",
                        anchor: '95%',
                        allowBlank: false,
                        decimalPrecision: 0,
                        emptyText: "0"
                    }, {
                        xtype: 'combo',
                        fieldLabel: '是否无限兑换',
                        hiddenName: 'ExcUnlimited',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        //emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "name",
                        valueField: "id",
                        triggerAction: "all",
                        anchor: '95%',
                        allowBlank: false
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '最大可兑换数量',
                        name: "ExcMaxCount",
                        anchor: '95%',
                        allowBlank: false,
                        decimalPrecision: 0,
                        emptyText: "0"
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '员工提成',
                        name: "EmpDeduct",
                        anchor: '95%',
                        //allowBlank: false,
                        decimalPrecision: 6,
                        emptyText: "0"
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'datefield',
                        fieldLabel: '有效开始时间',
                        name: "ValidDateBegin",
                        anchor: '95%',
                        allowBlank: false,
                        format: "Y-m-d"
                    }, {
                        xtype: 'datefield',
                        fieldLabel: '有效结束时间(含)',
                        name: "ValidDateEnd",
                        anchor: '95%',
                        allowBlank: false,
                        format: "Y-m-d"
                    }, {
                        xtype: 'combo',
                        fieldLabel: '是否必须预约',
                        hiddenName: 'MustReservation',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        //emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "name",
                        triggerAction: "all",
                        valueField: "id",
                        anchor: '95%',
                        allowBlank: false
                    }, {
                        xtype: 'combo',
                        fieldLabel: '是否可门店兑换',
                        hiddenName: 'ShopExchangeable',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        //emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "name",
                        triggerAction: "all",
                        valueField: "id",
                        anchor: '95%',
                        allowBlank: false
                    }, {
                        xtype: 'combo',
                        fieldLabel: '是否可快递',
                        hiddenName: 'Sendable',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        store: ifStore,
                        displayField: "name",
                        triggerAction: "all",
                        valueField: "id",
                        anchor: '95%',
                        allowBlank: false
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '其他成本',
                        name: "OtherCost",
                        anchor: '95%',
                        //allowBlank: false,
                        decimalPrecision: 6,
                        emptyText: "0"
                    }]
                }]
    },
            {
                layout: "column",
                xtype: "fieldset",
                title: "网页信息",
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '名称',
                        name: "OnlineName",
                        anchor: '95%'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '市场参考价',
                        name: "OnlinePrice",
                        anchor: '95%',
                        decimalPrecision: 4,
                        emptyText: "0"
                    }, {
                        xtype: 'combo',
                        fieldLabel: '是否下架',
                        hiddenName: 'OnlineOffsell',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        //emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "name",
                        triggerAction: "all",
                        valueField: "id",
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'combo',
                        fieldLabel: '是否推荐',
                        hiddenName: 'OnlineRecommended',
                        editable: false,
                        forceSelection: true,
                        valueField: "id",
                        mode: 'local',
                        //emptyText: 'Select a model...',
                        store: ifStore,
                        displayField: "name",
                        triggerAction: "all",
                        anchor: '95%'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '推荐顺序',
                        name: "OnlineRecommendedOrder",
                        anchor: '95%',
                        emptyText: "0",
                        decimalPrecision: 0
                    }
                    //                    , {
                    //                        xtype: 'textfield',
                    //                        fieldLabel: '产品图片',
                    //                        name: "pic",
                    //                        anchor: '95%'
                    //                    }
                    ]
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    defaults: { width: 280 },
                    items: [{
                        xtype: 'htmleditor',
                        hegiht: 100,
                        fieldLabel: '规格参数',
                        name: "OnlineFormat",
                        anchor: '97.5%'
                    }, {
                        xtype: 'htmleditor',
                        hegiht: 100,
                        fieldLabel: '产品说明',
                        name: "OnlineDescription",
                        anchor: '97.5%'
                    }, {
                        xtype: 'textfield',
                        hidden: true,
                        fieldLabel: '产品图片',
                        name: "PicFile",
                        anchor: '97.5%'
                    }, {
                        xtype: 'textfield',
                        hidden: true,
                        fieldLabel: '产品缩略图',
                        name: "SmallPicFile",
                        anchor: '97.5%'
                    }, {
                        xtype: 'textfield',
                        hidden: true,
                        fieldLabel: '手机使用',
                        name: "PhonePicFile",
                        anchor: '97.5%'
                    }]
                }]
            }
    , {
        buttons: [{
            text: '上传图片',
            handler: function () {
                uploadPic_win.show();
                pic_form.getForm().reset();
                small_form.getForm().reset();
                mobile_form.getForm().reset();
                if (AddExchangeForm.find("name", "PicFile")[0].getValue() != "") {
                    ReadPic(AddExchangeForm.find("name", "PicFile")[0].getValue());
                } else {
                    pic_form.find("name", "picPath")[0].getEl().dom.src = '../Imgs/blank.jpg';
                }
                if (AddExchangeForm.find("name", "SmallPicFile")[0].getValue() != "") {
                    ReadSmallPic(AddExchangeForm.find("name", "SmallPicFile")[0].getValue());
                } else {
                    small_form.find("name", "picPath")[0].getEl().dom.src = '../Imgs/blank.jpg';
                }
                if (AddExchangeForm.find("name", "PhonePicFile")[0].getValue() != "") {
                    ReadPhonePic(AddExchangeForm.find("name", "SmallPicFile")[0].getValue());
                } else {
                    mobile_form.find("name", "picPath")[0].getEl().dom.src = '../Imgs/blank.jpg';
                }
            }
        }, {
            text: '保  存',
            handler: function () {
                AddAction();
            }
        }, {
            text: "删  除",
            handler: function () {
                if (id == 0) { return; }
                Ext.MessageBox.confirm("提示", "是否确定删除？", function (btn) {
                    if (btn == "yes") {
                        DelAction(id);
                    }
                });
            }
        }, {
            text: '取  消',
            handler: function () {
                AddExchangeForm.getForm().reset();
                AddExchangeWindow.hide();
            }
        }]
    }
    ]
});

//读取图片
function ReadPic(filePath) {
    var temp = pic_form.find("name", "picPath")[0].getEl().dom.src;
    var newSrc = '../Uploads/' + filePath;
    //alert(newSrc);
    pic_form.find("name", "picPath")[0].getEl().dom.src = newSrc;
}

function ReadSmallPic(filePath) {
    var temp = small_form.find("name", "picPath")[0].getEl().dom.src;
    var newSrc = '../Uploads/' + filePath;
    //alert(newSrc);
    small_form.find("name", "picPath")[0].getEl().dom.src = newSrc;
}

function ReadPhonePic(filePath) {
    var temp = mobile_form.find("name", "picPath")[0].getEl().dom.src;
    var newSrc = '../Uploads/' + filePath;
    //alert(newSrc);
    mobile_form.find("name", "picPath")[0].getEl().dom.src = newSrc;
}


//大图form
var pic_form = new Ext.form.FormPanel({
    xtype: "form",
    labelWidth: 100,
    width:1200,
    frame: true,
    fileUpload: true,
    bodyStyle: 'padding:5px 5px 0',
    items: [{
        layout: 'column',
        items: [
                {
                    columnWidth: .33,
                    layout: 'form',
                    defaults: { width: 200 },
                    items: [
                    {
                        xtype: 'displayfield',
                        //id: 'form-file',
                        fieldLabel: '上传大图',
                        width: 150
                    }, {
                        xtype: 'box', //或者xtype: 'component',      
                        width: 300, //图片宽度      
                        height: 300, //图片高度  
                        name: 'picPath',
                        autoEl: {
                            tag: 'img',    //指定为img标签      
                            src: '../Imgs/blank.jpg'    //指定url路径 
                        }
                    }, {
                        xtype: 'fileuploadfield',
                        //id: 'form-file',
                        emptyText: '上传图片',
                        fieldLabel: '文件',
                        name: 'filePath',
                        buttonText: "...",
                        width: 100
                        //                        ,
                        //                        allowBlank: false
                    }, {
                        buttons: [{
                            text: '上  传',
                            handler: function () {
                                pic_form.getForm().submit({
                                    waitMsg: "正在提交，请稍候...",
                                    url: "../Apis/FileUpload.aspx?actionName=doUpload&sid=" + Sys.sid,
                                    success: function (form, action) {
                                        //addform.body.unmask();
                                        Ext.MessageBox.alert("提醒", "上传图片成功！");
                                        if (action.result.success) {
                                            ShowPic(action.result.msg);
                                        }
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
                        }, {
                            text: '清  空',
                            handler: function () {
                                pic_form.getForm().reset();
                                var picName = DelPic("PicFile");
                                //alert(picName == "undefined");
                                if (picName != "undefined") {
                                    pic_form.getForm().submit({
                                        waitMsg: "正在提交，请稍候...",
                                        url: "../Apis/FileUpload.aspx?actionName=delPic&sid=" + Sys.sid,
                                        params: { PicName: picName },
                                        success: function (form, action) {
                                            //addform.body.unmask();
                                            Ext.MessageBox.alert("提醒", "删除图片成功！");
                                            if (action.result.success) {
                                                pic_form.find("name", "picPath")[0].getEl().dom.src = "../Imgs/blank.jpg";
                                            }
                                        },
                                        failure: function (form, action) {
                                            if (action != undefined && action.result != undefined) {
                                                Ext.MessageBox.alert("提醒", action.result.msg);
                                            } else {
                                                Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                                            }
                                        }
                                    });
                                } else {
                                    Ext.Msg.alert("提示", "无清空图片！");
                                    return;
                                }
                            }
                        }]
                    }]
                }]
    }]
});

//缩略图form
var small_form = new Ext.form.FormPanel({
    xtype: "form",
    labelWidth: 100,
    width: 1000,
    frame: true,
    fileUpload: true,
    bodyStyle: 'padding:5px 5px 0',
    items: [{
        layout: 'column',
        items: [
        {
            columnWidth: .33,
            layout: 'form',
            defaults: { width: 200 },
            items: [{
                xtype: 'displayfield',
                //id: 'form-file',
                fieldLabel: '上传缩略图',
                width: 150
            }, {
                xtype: 'box', //或者xtype: 'component',      
                width: 100, //图片宽度      
                height: 100, //图片高度  
                name: 'picPath',
                autoEl: {
                    tag: 'img',    //指定为img标签      
                    src: '../Imgs/blank.jpg'    //指定url路径 
                }
            }, {
                xtype: 'fileuploadfield',
                //id: 'form-file',
                emptyText: '上传图片',
                fieldLabel: '文件',
                name: 'filePath',
                buttonText: "...",
                width: 100
                //allowBlank: false
            }, {
                buttons: [{
                    text: '上  传',
                    handler: function () {
                        small_form.getForm().submit({
                            waitMsg: "正在提交，请稍候...",
                            url: "../Apis/FileUpload.aspx?actionName=doUpload&sid=" + Sys.sid,
                            success: function (form, action) {
                                //addform.body.unmask();
                                Ext.MessageBox.alert("提醒", "上传图片成功！");
                                if (action.result.success) {
                                    ShowSmallPic(action.result.msg);
                                }
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
                }, {
                    text: '清  空',
                    handler: function () {
                        small_form.getForm().reset();
                        var picName = DelPic("SmallPicFile");
                        alert(picName);
                        //alert(picName == "undefined");
                        if (picName != "undefined") {
                            small_form.getForm().submit({
                                waitMsg: "正在提交，请稍候...",
                                url: "../Apis/FileUpload.aspx?actionName=delPic&sid=" + Sys.sid,
                                params: { PicName: picName },
                                success: function (form, action) {
                                    //addform.body.unmask();
                                    Ext.MessageBox.alert("提醒", "删除图片成功！");
                                    if (action.result.success) {
                                        small_form.find("name", "picPath")[0].getEl().dom.src = "../Imgs/blank.jpg";
                                    }
                                },
                                failure: function (form, action) {
                                    alert("a");
                                    if (action != undefined && action.result != undefined) {
                                        Ext.MessageBox.alert("提醒", action.result.msg);
                                    } else {
                                        Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                                    }
                                }
                            });
                        } else {
                            Ext.Msg.alert("提示", "无清空图片！");
                            return;
                        }
                    }
                }]
            }]
        }]
    }]
});

//手机图form
var mobile_form = new Ext.form.FormPanel({
    xtype: "form",
    labelWidth: 100,
    width: 800,
    frame: true,
    fileUpload: true,
    bodyStyle: 'padding:5px 5px 0',
    items: [{
        layout: 'column',
        items: [
        {
            columnWidth: .33,
            layout: 'form',
            defaults: { width: 200 },
            items: [{
                xtype: 'displayfield',
                //id: 'form-file',
                fieldLabel: '上传手机图',
                width: 150
            }, {
                xtype: 'box', //或者xtype: 'component',      
                width: 150, //图片宽度      
                height: 150, //图片高度  
                name: 'picPath',
                autoEl: {
                    tag: 'img',    //指定为img标签      
                    src: '../Imgs/blank.jpg'    //指定url路径 
                }
            }, {
                xtype: 'fileuploadfield',
                //id: 'form-file',
                emptyText: '上传图片',
                fieldLabel: '文件',
                name: 'filePath',
                buttonText: "...",
                width: 100
                //allowBlank: false
            }, {
                buttons: [{
                    text: '上  传',
                    handler: function () {
                        mobile_form.getForm().submit({
                            waitMsg: "正在提交，请稍候...",
                            url: "../Apis/FileUpload.aspx?actionName=doUpload&sid=" + Sys.sid,
                            success: function (form, action) {
                                //addform.body.unmask();
                                Ext.MessageBox.alert("提醒", "上传图片成功！");
                                if (action.result.success) {
                                    ShowMobilePic(action.result.msg);
                                }
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
                }, {
                    text: '清  空',
                    handler: function () {
                        mobile_form.getForm().reset();
                        var picName = DelPic("PhonePicFile");
                        //alert(picName == "undefined");
                        if (picName != "undefined") {
                            mobile_form.getForm().submit({
                                waitMsg: "正在提交，请稍候...",
                                url: "../Apis/FileUpload.aspx?actionName=delPic&sid=" + Sys.sid,
                                params: { PicName: picName },
                                success: function (form, action) {
                                    //addform.body.unmask();
                                    Ext.MessageBox.alert("提醒", "删除图片成功！");
                                    if (action.result.success) {
                                        mobile_form.find("name", "picPath")[0].getEl().dom.src = "../Imgs/blank.jpg";
                                    }
                                },
                                failure: function (form, action) {
                                    if (action != undefined && action.result != undefined) {
                                        Ext.MessageBox.alert("提醒", action.result.msg);
                                    } else {
                                        Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                                    }
                                }
                            });
                        } else {
                            Ext.Msg.alert("提示", "无清空图片！");
                            return;
                        }
                    }
                }]
            }]
        }]
    }]
});





//上传完之后预览图片
function ShowPic(filePath) {
    //alert(filePath);
    var temp = pic_form.find("name", "picPath")[0].getEl().dom.src;
    var newSrc = '../Uploads/' + filePath;
    //alert(newSrc);
    pic_form.find("name", "picPath")[0].getEl().dom.src = newSrc;
    AddExchangeForm.find("name", "PicFile")[0].setValue(filePath);
}

function ShowSmallPic(filePath) {
    //alert(filePath);
    var temp = small_form.find("name", "picPath")[0].getEl().dom.src;
    var newSrc = '../Uploads/' + filePath;
    //alert(newSrc);
    small_form.find("name", "picPath")[0].getEl().dom.src = newSrc;
    AddExchangeForm.find("name", "SmallPicFile")[0].setValue(filePath);
}

function ShowMobilePic(filePath) {
    //alert(filePath);
    var temp = mobile_form.find("name", "picPath")[0].getEl().dom.src;
    var newSrc = '../Uploads/' + filePath;
    //alert(newSrc);
    mobile_form.find("name", "picPath")[0].getEl().dom.src = newSrc;
    AddExchangeForm.find("name", "PhonePicFile")[0].setValue(filePath);
}


//清空图片
function DelPic(picType) {
    var picName = AddExchangeForm.find("name", picType)[0].getValue();
    //alert(picName);
    if (picName != "") {
        //删除图片
        //DoDel(formName, picName);
        return picName;
    } else {
        Ext.Msg.alert("提示", "无清空图片！");
        return;
    }
}

//上传图片panel
var uploadPic_panel = new Ext.Panel({
    //autoScroll: true,
    border: false,
    //autoWidth:true,
    layout: "column",
    //anchorSize: { width: 800, height: 600 },
    items: [{
        frame: true,
        //layout: "fit",
        border: false,
        columnWidth:.4,
        items: [pic_form]
    }, {
        frame: true,
        layout: "auto",
        border: false,
        columnWidth: .3,
        items: [small_form]
    }, {
        frame: true,
        layout: "auto",
        border: false,
        columnWidth: .3,
        items: [mobile_form]
    }]
});


//图片上传窗口
var uploadPic_win = new Ext.Window({
    title: '上传图片',
    layout: 'fit',
    width: 800,
    height: 450,
    labelWidth: 80,
    labelAlign: 'right',
    buttonAlign: 'center',
    closeAction:"hide",
    modal: true,
    resizable: false,
    frame: true,
    animal: true,
    items: [uploadPic_panel]
    //items: [pic_form, small_form]
    /*
    ,
    buttons: [{
        text: '确 认',
        handler: function () {
            var temp = pic_form.find("name", "picPath")[0].getEl().dom.src;
            var newSrc = 'D:/logo.jpg';
            //alert(temp);
            pic_form.find("name", "picPath")[0].getEl().dom.src = newSrc;
        }
    }, {
        text: '取 消',
        handler: function () {
            uploadPic_win.hide();
            pic_form.getForm().reset();
        }
    }]*/
});

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
        items: [AddExchangeForm]
    }]
});

//新增活动窗口
var AddExchangeWindow = new Ext.Window({
    layout: 'fit',
    width: 700,
    height: 500,
    modal: true,
    closeAction: 'hide',
    title: "积分兑换规则定义",
    plain: true,
    items: [AddExchangeForm]
});

var fm = Ext.form;

var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true,
        menuDisabled: true
    },
    columns: [new Ext.grid.RowNumberer(), {
        //id: "Title",
        header: '兑换目标类型',
        dataIndex: 'ExcTargetType',
        width: 100,
        renderer: function (v, mdata, record) {
            return ExchangeTargetTypeDataStore.getById(v).get("name");
        }
    }, {
        //id: "Title",
        header: '兑换目标',
        dataIndex: 'TargetID',
        width: 120,
        renderer: function (v, mdata, record) {
            if (record.get("ExcTargetType") == 1) {
                if (tar_service_store.getById(v) != null && tar_service_store.getById(v) != undefined) {
                    return tar_service_store.getById(v).get("Title");
                } else {
                    return v;
                }
            } else if (record.get("ExcTargetType") == 2) {
                try {
                    if (tar_product_store.getById(v) != null && tar_product_store.getById(v) != undefined) {
                        return tar_product_store.getById(v).get("Title");
                    } else {
                        return v;
                    }
                } catch (e) { }
            } else if (record.get("ExcTargetType") == 3) {
                try {
                    if (tar_goods_store.getById(v) != null && tar_goods_store.getById(v) != undefined) {
                        return tar_goods_store.getById(v).get("Title");
                    } else {
                        return v;
                    }
                } catch (e) { }
            }
            return "";
        }
    }, {
        //id: "ExchangeNum",
        header: "兑换积分",
        dataIndex: "PointCountUse",
        align: 'right',
        width: 100
    }, {
        //id: "NeedPoint",
        header: "是否无限兑换",
        dataIndex: "ExcUnlimited",
        width: 100,
        renderer: function (v) {
            if (ifStore.getById(v) != null && ifStore.getById(v) != undefined) {
                return ifStore.getById(v).get("name");
            } else {
                return v;
            }
        }
    }, {
        //id: "NeedPoint",
        header: "最大可兑换数量",
        dataIndex: "ExcMaxCount",
        width: 100
    }, {
        //id: "NeedPoint",
        header: "有效开始时间",
        dataIndex: "ValidDateBegin",
        width: 120
        
    }, {
        //id: "NeedPoint",
        header: "有效结束时间(含)",
        dataIndex: "ValidDateEnd",
        width: 120
       
    }, {
        //id: "NeedPoint",
        header: "是否下架",
		
        dataIndex: "OnlineOffsell",
        width: 120,
        renderer: function (v) {
            if (ifStore.getById(v) != null && ifStore.getById(v) != undefined) {
                return ifStore.getById(v).get("name");
            } else {
                return v;
            }
        }
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed

    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointRules.aspx?actionName=getData&sid='+Sys.sid,

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
                { name: 'ExcTargetType', mapping: 'ExcTargetType' },
        // map Record's 'job' field to data object's 'occupation' key
                {name: 'TargetID', mapping: 'TargetID' },
                { name: "PointCountUse", mapping: "PointCountUse" },
                { name: "ExcUnlimited", mapping: "ExcUnlimited" },
                { name: "ExcMaxCount", mapping: "ExcMaxCount" },
                { name: "ValidDateBegin", mapping: "ValidDateBegin" },
                { name: "ValidDateEnd", mapping: "ValidDateEnd" },
                { name: "OnlineOffsell", mapping: "OnlineOffsell" }
            ]
    }),

    sortInfo: { field: 'ExcTargetType', direction: 'ASC' }
});
//
var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

//===========================双击获取该单据 开始======================================//
pd_grid.on("rowdblclick", function (g, rowindex, e) {
    var r = pd_grid.getStore().getAt(rowindex);
    //alert(r.get("ID"));
    id = r.get("ID");
    AddExchangeWindow.show();
    AddExchangeForm.load({
        url:"../Apis/PointRules.aspx?actionName=getDataById&sid="+Sys.sid,
        params:{id:id},
        waitMsg:"加载中....."
    });
    // AddActionForm.find("name", "ID")[0].setValue(r.get("ID"));
});

//===========================双击获取该单据 开始======================================//

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
        anchor: '-1 -120',
        items: [pd_grid]
    }]
});



centerPanel.add(pd_main_panel);
centerPanel.doLayout();
