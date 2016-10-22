//查卡

//全局变量
var CardCode = "";
var PublishDate = "";
//===================年份和月份Store========================//
var newyear = new Date().getFullYear(); //这是为了取现在的年份数
var yearlist = [];
for (var i = newyear; i >= 1900; i--) {
    yearlist.push([i, i]);
}
var yearModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: []
});
this.yearModelStore.loadData(yearlist);
var monthModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["1", "一月"],
            ["2", "二月"],
            ["3", "三月"],
            ["4", "四月"],
            ["5", "五月"],
            ["6", "六月"],
            ["7", "七月"],
            ["8", "八月"],
            ["9", "九月"],
            ["10", "十月"],
            ["11", "十一月"],
            ["12", "十二月"]]
});
var type_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CardMgr.aspx?actionName=getType&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }
            ]
    }),
    sortInfo: { field: 'ID', direction: 'ASC' }
});

// utilize custom extension for Hybrid Summary
var cardSummary = new Ext.ux.grid.GridSummary();
var jckSummary = new Ext.ux.grid.GridSummary();
var modelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["全部", "全部"],
            ["正常", "正常"],
            ["挂失", "挂失"],
            ["销卡", "销卡"],
            ["未启用", "未启用"]]
});
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
                fieldLabel: "卡类型",
                name: "TypeId",
                hiddenName: "TypeId",
                anchor: "100%",
                triggerAction: 'all',
                store: type_store,
                valueField: 'ID',
                displayField: 'Title',
                enableKeyEvents: true,
                selectOnFocus: true,
                allowBlank: true,
                forceSelection: true,
                listeners: {
                    "keyup": function (v) {
                        type_store.load({
                            params: { tName: v.getRawValue() }
                        });
                    }
                }
            }, {
                xtype: "combo",
                fieldLabel: "卡状态",
                hiddenName: "CardStatus",
                name: "CardStatus",
                editable: false,
                anchor: "100%",
                store: modelStore,
                mode: 'local',
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "卡号[开始]",
                name: "CardNoBegin",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 160,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    searchData();
                }
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "卡号[结束]",
                name: "CardNoEnd",
                anchor: "100%"
            }]
        }]

    }]
});

var fm = Ext.form;
var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [new Ext.grid.RowNumberer(), sm, {
        //id: "Title",
        header: 'ID',
        dataIndex: 'CardID',
        hidden: true,
        width: 100
    }, {
        //id: "Title",
        header: '卡号',
        dataIndex: 'CardNo',
        width: 100
    }, {
        //id: "Title",
        header: '卡状态',
        dataIndex: 'Status',
        width: 100
    }, {
        header: "门店",
        dataIndex: "DeptName",
        //align: 'right',
        width: 120
    }, {
        header: "卡余额",
        dataIndex: "Balance",
        //align: 'right',
        width: 120
    }, {
        header: "卡备注",
        dataIndex: "MemoInfo",
        //align: 'right',
        width: 200
    }, {
        header: "是否删除",
        dataIndex: "IsDeleted",
        //align: 'right',
        width: 60,
        renderer: function (value, metadata, record, rowIndex) {
            if (value == 1) {
                return "已删除";
            } else if (value == 0) {
                return "";
            }
        }
    }, {
        header: '操作',
        width:120,
        renderer: cardDetail

    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    //autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/CardMgr.aspx?actionName=queryCard&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'CardInfo',
        idProperty: 'CardID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "CardID", mapping: "CardID" },
                { name: 'CardNo', mapping: 'CardNo' },
                { name: 'Status', mapping: 'Status' },
                { name: 'DeptName', mapping: 'DeptName' },
                { name: "Balance", mapping: "Balance" },
                { name: "MemoInfo", mapping: "MemoInfo" },
                { name: "IsDeleted", mapping: "IsDeleted" }
            ]
    }),
    listeners: {
	
        load: function (records, options, success) {
            
			if (records.data.length > 0) {
                if (records.data.items[0].json.msg != undefined) {
                    Ext.MessageBox.alert("提示", records.data.items[0].json.msg);
                    pd_store.remove(pd_store.getAt(0));
                    return;
                }
            }
        }
    }
    //sortInfo: { field: 'Code', direction: 'ASC' }
});
//

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    sm: sm,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 40,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});


pd_store.on('beforeload', function (thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    this.baseParams = pd_top_form.getForm().getValues();
    this.baseParams.start = 0;
    this.baseParams.limit = 40;
});

//====================卡弹出框=======================//
var cardRenderSummary = function (o, cs, cm) {
    return '小计：';
}

//定义 勾选框SM
//var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });
//定义列
var cmCard = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    {

        header: '日期',
        dataIndex: 'BillDate',
        width: 170
        
    }, {
        header: '类别',
        dataIndex: 'BillType',
        width: 60
    }, {
        header: '代码',
        dataIndex: 'DetailCode',
        width: 60
    }, {
        header: '门店',
        dataIndex: 'DeptName',
        width: 60
    }, {
        header: '名称',
        dataIndex: 'DetailName',
        width: 90,
        summaryRenderer: cardRenderSummary
    }, {
        header: '数量',
        dataIndex: 'Quantity',
        summaryType: "sum",
        width: 60
    }, {
        header: '单价',
        dataIndex: 'Price',
        summaryType: "sum",
        width: 60
    }, {
        header: '金额',
        dataIndex: 'Amount',
        summaryType: "sum",
        width: 60
    }, {
        header: '折扣率',
        dataIndex: 'Rebate',
        width: 60
    }, {
        header: '主理',
        dataIndex: 'MasterName',
        width: 60
    }, {
        header: '助理',
        dataIndex: 'AsstName',
        width: 60
    }]
});
function formatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

var card_DetailStore = new Ext.data.Store({
	autoLoad:false,
	url: '../Apis/CardMgr.aspx?actionName=queryHistoryCardDetail&sid=' + Sys.sid ,
    reader: new Ext.data.JsonReader({
        record: 'cardInfo',
        root: 'payHistoryResults',
        fields: [
                { name: "BillDate", mapping: "BillDate", type: 'DateTime' },
                { name: "BillType", mapping: "BillType", type: 'string' },
                { name: "DetailCode", mapping: "DetailCode" , type: 'string'},
                { name: "DeptName", mapping: "DeptName" , type: 'string'},
                { name: "DetailName", mapping: "DetailName", type: 'string' },
                { name: 'Quantity', mapping: 'Quantity', type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } },
                { name: 'Price', mapping: 'Price', type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); }},
                { name: "Amount", mapping: "Amount", type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } },
                { name: "Rebate", mapping: "Rebate", type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } },
                { name: "MasterName", mapping: "MasterName", type: 'string'},
                { name: "AsstName", mapping: "AsstName", type: 'string'}
            ]
    })
});
var card_DetailGrid = new Ext.grid.GridPanel({
    store: card_DetailStore,
    cm: cmCard,
    //frame: true,
    margins: "2 2 2 2",
    title:"消费明细",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true,
    plugins: cardSummary
});
//卡信息、顾客资料form
var inform_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    region: 'north',
    height: 400,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "卡信息",
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
                readOnly: true,
                name: "CardCode",
                anchor: "95%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }, {
                xtype: "textfield",
                fieldLabel: "卡状态",
                readOnly: true,
                name: "CardStatus",
                anchor: "95%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }]
        }, {
            layout: "form",
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "卡类别",
                readOnly: true,
                name: "CardType",
                anchor: "98%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }]
        }]
    }, {
        xtype: "fieldset",
        title: "顾客资料",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 80 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "姓名",
                readOnly: true,
                name: "UserName",
                anchor: "95%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }, {
                xtype: "textfield",
                fieldLabel: "身份证号",
                readOnly: true,
                name: "UserID",
                anchor: "95%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }, {
                xtype: "textfield",
                fieldLabel: "固定电话",
                readOnly: true,
                name: "UserTel",
                anchor: "95%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }]
        }, {
            layout: "form",
            columnWidth: 0.45,
            items: [{
                xtype: "textfield",
                fieldLabel: "手机号码",
                readOnly: true,
                name: "UserMobile",
                anchor: "98%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }, {
                xtype: "textfield",
                fieldLabel: "客户住址",
                readOnly: true,
                name: "UserAddress",
                anchor: "98%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }, {
                xtype: "textfield",
                fieldLabel: "备  注",
                readOnly: true,
                name: "UserMemoInfo",
                anchor: "98%",
				labelStyle: 'padding-top:10px',
				style:'margin-top:7px'
            }]
        }]
    },{
        xtype: "fieldset",
        title: "总体分析",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 50 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.3,
            items: [{
                xtype: "textfield",
                fieldLabel: "充值",
                readOnly:true,
                name: "CardRecharge",
                anchor: "95%"
                }]
            },{
            layout: "form",
            columnWidth: 0.3,
            items: [{
                xtype: "textfield",
                fieldLabel: "消费",
                readOnly:true,
                name: "CardConsumption",
                anchor: "95%"
                }]
            },{
            layout: "form",
            columnWidth: 0.3,
            items: [{
                xtype: "textfield",
                fieldLabel: "余额",
                readOnly:true,
                name: "CardBalance",
                anchor: "95%"
            }]
         }]
    }]
});

var search_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
	region:'north',
    height: 75,
    items: [{
        xtype: "fieldset",
        defaults: { labelAlign: "right", width: 40 },
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "combo",
                fieldLabel: "年份",
                name:'comboYear',
                editable: false,
                anchor: "100%",
                store: yearModelStore,
                mode: 'local',
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all"
            }]
        }, {
            layout: "form",
            bodyStyle: "align:right",
            columnWidth: 0.4,
            items: [{
                xtype: "combo",
                fieldLabel: "月份",
                name: 'comboMonth',
                editable: false,
                anchor: "100%",
                store: monthModelStore,
                mode: 'local',
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 100px",
            width: 340,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
                    queryCardDetail();
                }
            }, {
                xtype: "button",
                style:"margin-left:10px",
                boxMinWidth: 40,
                width: 80,
                text: " 查 询 全 部",
                handler: function () {
                    queryAllDetail();
                }
            }]
        }]
    }]
});
var ImageStore = new Ext.data.JsonStore({
    autoload:false,
    url: '../Apis/CardMgr.aspx?sid=' + Sys.sid,
    root: 'result',
	fields: [
			{ name: "src", mapping: "src" },
            { name: "shortName", mapping: "shortName" }
	],
	listeners: {
	    load: function (store, record) {
	        if (record[0].data["src"] == "") {
	            ImageView.tpl = imageTpl1;
	            ImageView.refresh();
	        } else {
	            ImageView.tpl = imageTpl;
	            ImageView.refresh();
	        }
	    }
	}
});
//ImageStore.load();


var imageTpl = new Ext.XTemplate(
    '<tpl for=".">',
        '<div style="margin-bottom: 10px;" class="thumb-wrap">',
          '<img src="../{src}" />',
          '<span style="font-size:20px;color:red;">{shortName}</span></div>',
        '</div>',
    '</tpl>'
);
var imageTpl1 = new Ext.XTemplate(
    '<tpl for=".">',
        '<div style="margin-bottom: 10px;" class="thumb-wrap">',
          '<span style="font-size:20px;color:red;">{shortName}</span></div>',
        '</div>',
    '</tpl>'
);
var ImageView = new Ext.DataView({
    store: ImageStore,
    tpl: imageTpl,
	autoScroll:true,
    itemSelector: 'div.thumb-wrap'
});

var ImageListPanel = new Ext.Panel({
    frame:true,
	region:'center',
    layout:'fit',
    title:'历史记录',
    items: ImageView
});
var lsjl_form = new Ext.form.FormPanel({
    frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    layout: 'border',
    items: [{
        layout: 'hbox',
        region: 'north',
        height: 30,
        items: [{
            xtype: "button",
            boxMinWidth: 60,
            width: 90,
            id: "btnFirst",
            text: " 第一页",
            style: 'padding-left:10px',
            handler: function () {
                QueryAllBillImages();
            }
        }, {
            xtype: "button",
            boxMinWidth: 60,
            width: 90,
            id: "btnPre",
            text: " 上一页",
            style: 'padding-left:10px',
            handler: function () {
                queryPreBillImages();
            }
        }, {
            xtype: "button",
            boxMinWidth: 60,
            width: 90,
            id: "btnNext",
            text: " 下一页",
            style: 'padding-left:10px',
            handler: function () {
                QueryNextBillImages()
            }
        }, {
            xtype: "button",
            boxMinWidth: 60,
            width: 90,
            id: "btnLast",
            text: " 最后一页",
            style: 'padding-left:10px',
            handler: function () {
                QueryLastBillImages();
            }
        }]
    }, ImageListPanel]
});

var cmjckCard = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
    {

        header: 'jckTypeID',
        dataIndex: 'jckTypeID',
        width: 170,
        hidden:true
    }, {
        header: '类型',
        dataIndex: 'jcktypeTitle',
        width: 100
    }, {
        header: '剩余次数',
        dataIndex: 'RemainCount',
        width: 80
    }, {
        header: '总次数',
        dataIndex: 'TotalCount',
        width: 80
    }, {
        header: '套盒金额',
        dataIndex: 'SaleMoney',
        width: 90
    }, {
        header: '单次金额',
        dataIndex: 'SingleCost',
        width: 60
    }, {
        header: '有效期',
        dataIndex: 'ExpireDate',
        width: 200
        
    }]
});

var jckthcard_DetailStore = new Ext.data.Store({
    autoLoad: false,
    url: '../Apis/CardMgr.aspx?actionName=queryJckCardsResults&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        root: 'jckResults',
        totalProperty: 'totalCount',
        fields: [
                { name: "jckTypeID", mapping: "jckTypeID", type: 'int' },
                { name: "jcktypeTitle", mapping: "jcktypeTitle", type: 'string' },
                { name: "RemainCount", mapping: "RemainCount", type: 'int' },
                { name: "TotalCount", mapping: "TotalCount", type: 'int ' },
                { name: 'SaleMoney', mapping: 'SaleMoney', type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } },
                { name: 'SingleCost', mapping: 'SingleCost', type: 'float', convert: function formatFloat(val) { return Number(Number(val).toFixed(2)); } },
                { name: "ExpireDate", mapping: "ExpireDate", type: 'Datetime' }
            ]
    })
});
var jckth_DetailGrid = new Ext.grid.GridPanel({
    store: jckthcard_DetailStore,
    cm: cmjckCard,
    //frame: true,
    margins: "2 2 2 2",
    title: "计次卡套盒明细",
    border: false,
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据 
    //sm: sm,
    loadMask: true
});

var Contenttabs = new Ext.TabPanel({
    activeTab: 0,
	region:'center',
    items: [{
        title: '客户基础资料',
		layout:'fit',
        itemId: 'home',
        items:[inform_form]
    },{
        title: '历史月账单',
		layout:'fit',
        items:[lsjl_form]
    },{
        title: '当月消费明细',
		layout:'fit',
        items:[card_DetailGrid]
    }, {
        title: '计次卡套盒明细',
        layout: 'fit',
        items: [jckth_DetailGrid]
    }]
});

//卡明细
var CardDetailWindow = new Ext.Window({
    layout: 'border',
    width: 900,
    height: 540,
    modal: true,
    plain: true,
    closeAction: 'hide',
    showAction:'show',
    title: "卡明细",
    items: [search_form, Contenttabs]
});
CardDetailWindow.on("hide", function () {
	ImageStore.removeAll();
    Ext.getBody().mask("正在清空图片缓存！请稍候！");
    //清除session and 图片文件夹
    Ext.Ajax.request({
        url: '../Apis/CardMgr.aspx?actionName=cleanSessionAndPic&sid=' + Sys.sid,
        params: {},
        success: function (response, option) {
            Ext.getBody().unmask();
        },
        failure: function () {
            Ext.getBody().unmask();
            //Ext.MessageBox.alert("提示", "清空图片缓存及Session异常!");
        }
    });
})
CardDetailWindow.on("show", function () {
    //创建空图片文件
    Ext.Ajax.request({
        url: '../Apis/CardMgr.aspx?actionName=createPic&sid=' + Sys.sid,
        params: {},
        success: function (response, option) {

        },
        failure: function () {
            Ext.MessageBox.alert("提示", "创建图片文件夹异常!");
        }
    });
})
function queryCardDetail() {
    Ext.getCmp('btnFirst').setDisabled(true);
    Ext.getCmp('btnNext').setDisabled(true);
    Ext.getCmp('btnPre').setDisabled(true);
    Ext.getCmp('btnLast').setDisabled(true);
    var searchYear = search_form.getForm().findField('comboYear').value;
    var searchMonth = search_form.getForm().findField('comboMonth').value;
    ImageStore.removeAll();
    if (!(searchYear == (new Date().getYear() + 1900) && searchMonth == (new Date().getMonth() + 1))) {
        ImageStore.load({
            params: { CardCode: CardCode, SearchYear: searchYear, SearchMonth: searchMonth, actionName: "queryBillImage" }
        });
    } 
    
}

function queryAllDetail() {
    Ext.getCmp('btnFirst').setDisabled(true);
    Ext.getCmp('btnPre').setDisabled(true);
    Ext.getCmp('btnNext').setDisabled(true);
    Ext.getCmp('btnLast').setDisabled(true);
    QueryAllBillImages();
}
//========================卡弹出框结束=========================//

//===================function begin==============================//
/** 
* 查询数据
*/
function searchData() {
    var CardNoBegin = pd_top_form.getForm().findField("CardNoBegin").getValue().trim();
    var CardNoEnd = pd_top_form.getForm().findField("CardNoEnd").getValue().trim();
    if (CardNoBegin == "" && CardNoEnd == "") {
        Ext.MessageBox.alert("提示", "请至少输入一个卡号！");
        return;
    }
    pd_top_form.getForm()
    pd_store.load({
        params: { TypeId: pd_top_form.find('name', 'TypeId')[0].value }
    });
}
function cardDetail(value, metadata, record, rowIndex, columnIndex, store) {
    window.AddCardDetail = function (rowIndex) {
        var record = pd_grid.getStore().getAt(rowIndex);
        CardCode = record.get("CardNo");
        Ext.Ajax.request({
            url: '../Apis/CardMgr.aspx?actionName=queryCardDetail&sid=' + Sys.sid,
            params: { CardCode: CardCode },
            success: function (response, option) {
                var data = Ext.decode(response.responseText);
                inform_form.getForm().findField('CardCode').setValue(data.customerResults[0].Code);
                inform_form.getForm().findField('CardStatus').setValue(data.customerResults[0].Status);
                inform_form.getForm().findField('CardType').setValue(data.customerResults[0].Title1);
                inform_form.getForm().findField('UserName').setValue(data.customerResults[0].Title);
                inform_form.getForm().findField('UserID').setValue(data.customerResults[0].IdNo);
                inform_form.getForm().findField('UserTel').setValue(data.customerResults[0].Tel);
                inform_form.getForm().findField('UserMobile').setValue(data.customerResults[0].Mobile);
                inform_form.getForm().findField('UserAddress').setValue(data.customerResults[0].Address);
                inform_form.getForm().findField('UserMemoInfo').setValue(data.customerResults[0].MemoInfo);
                inform_form.getForm().findField('CardRecharge').setValue(data.customerResults[0].PaySum);
                inform_form.getForm().findField('CardConsumption').setValue(data.customerResults[0].xiaofei);
                inform_form.getForm().findField('CardBalance').setValue(data.customerResults[0].Balance);
                PublishDate = data.customerResults[0].PublishDate;
                var homeTable = Contenttabs.getItem('home');
                CardDetailWindow.show();
                var cardID = data.customerResults[0].cardID;
                var cardTypeCode = data.customerResults[0].cardTypeCode;
                card_DetailStore.load({ params: { CardCode: CardCode, SearchYear: "", SearchMonth: ""} });
                jckthcard_DetailStore.load({ params: { cardID: cardID} });
                search_form.getForm().findField('comboYear').setValue(newyear);
                search_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);
                Ext.getCmp('btnFirst').setDisabled(true);
                Ext.getCmp('btnNext').setDisabled(true);
                Ext.getCmp('btnPre').setDisabled(true);
                Ext.getCmp('btnLast').setDisabled(true);
                Contenttabs.setActiveTab(homeTable);
            },
            failure: function () {
                Ext.MessageBox.alert("提示", "查询失败!");
            }
        });
    };
        var resultStr = "<a href='#' onclick='AddCardDetail(" + rowIndex + ")'>卡明细</a>";
        return resultStr;
    }
    function QueryAllBillImages() {
        ImageStore.removeAll();
        ImageStore.load({
            params: { CardCode: CardCode, PublishDate: PublishDate, actionName: "queryAllBillImages" },
            callback: function (records, options, success) {
                if (success) {
                    if (records[0].data['src'] == "") { // 加载完成，关闭提示框
                        Ext.getCmp('btnFirst').setDisabled(true);
                        Ext.getCmp('btnPre').setDisabled(true);
                        Ext.getCmp('btnNext').setDisabled(true);
                        Ext.getCmp('btnLast').setDisabled(true);
                    } else {
                        Ext.getCmp('btnFirst').setDisabled(true);
                        Ext.getCmp('btnPre').setDisabled(true);
                        Ext.getCmp('btnNext').setDisabled(false);
                        Ext.getCmp('btnLast').setDisabled(false);
                    }
                }
            }
        });
    }
    function queryPreBillImages() {
        ImageStore.removeAll();
        Ext.getCmp('btnPre').setDisabled(true);
        ImageStore.load({
            params: { CardCode: CardCode, PublishDate: PublishDate, actionName: "queryPreBillImages" },
            callback: function (records, options, success) {
                if (success) {
                    if (records[0].data['src'] == "null") { // 加载完成，关闭提示框
                        Ext.getCmp('btnFirst').setDisabled(true);
                        Ext.getCmp('btnPre').setDisabled(true);
                        Ext.getCmp('btnNext').setDisabled(false);
                        Ext.getCmp('btnLast').setDisabled(false);
                    } else if (records[0].data['src'] == "") { } 
                    else{
                        Ext.getCmp('btnFirst').setDisabled(false);
                        Ext.getCmp('btnPre').setDisabled(false);
                        Ext.getCmp('btnNext').setDisabled(false);
                        Ext.getCmp('btnLast').setDisabled(false);
                    }
                }
            }
        });
    }
    function QueryNextBillImages() {
        ImageStore.removeAll();
        Ext.getCmp('btnNext').setDisabled(true);
        ImageStore.load({
            params: { CardCode: CardCode, actionName: "queryNextBillImages" },
            callback: function (records, options, success) {
                if (success) {
                    if (records[0].data['src'] == "null") { // 加载完成，关闭提示框
                        Ext.getCmp('btnNext').setDisabled(true);
                        Ext.getCmp('btnLast').setDisabled(true);
                        Ext.getCmp('btnFirst').setDisabled(false);
                        Ext.getCmp('btnPre').setDisabled(false);
                    } else if (records[0].data['src'] == "") { } 
                    else {
                        Ext.getCmp('btnFirst').setDisabled(false);
                        Ext.getCmp('btnPre').setDisabled(false);
                        Ext.getCmp('btnNext').setDisabled(false);
                        Ext.getCmp('btnLast').setDisabled(false);
                    }
                }
            }
        });
    }
    function QueryLastBillImages() {
        ImageStore.removeAll();
        ImageStore.load({
            params: { CardCode: CardCode, actionName: "queryLastBillImages" },
            callback: function (records, options, success) {
                if (success) {
                    if (records[0].data['src'] == "") { // 加载完成，关闭提示框
                        Ext.getCmp('btnNext').setDisabled(true);
                        Ext.getCmp('btnLast').setDisabled(true);
                        Ext.getCmp('btnFirst').setDisabled(true);
                        Ext.getCmp('btnPre').setDisabled(true);
                    } else {
                        Ext.getCmp('btnNext').setDisabled(true);
                        Ext.getCmp('btnLast').setDisabled(true);
                        Ext.getCmp('btnFirst').setDisabled(false);
                        Ext.getCmp('btnPre').setDisabled(false);
                    }
                }
            }
        });
    }
//===================function end==============================//

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
        anchor: '-1 -140',
        items: [pd_grid]
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();
