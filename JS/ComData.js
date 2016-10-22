//公共数据

var ifData = [
    [1, '是'],
    [0, '否']
];

//规则store
var ifStore = new Ext.data.ArrayStore({
    idIndex: 0,
    fields: [
            { name: "id" },
           { name: 'name' }
        ],
    data: ifData
});

//=====取货方式===
var getTypeData = [
    [0, '自取'],
    [1, '快递']
];

//规则store
var getTypeStore = new Ext.data.ArrayStore({
    idIndex: 0,
    fields: [
            { name: "id" },
           { name: 'name' }
        ],
    data: getTypeData
});

//==================== 积分兑换 ==========================//
var type_data = [['CountLimitPerCard', '单卡限制'], ['CountLimitPerDay', '单天限制'],
['PublishDate', '发卡日期限制'], ['MoneyLimitPerDay', '转卡金额限制'], ['ChainTransferLimit', '连续转卡限制'],
['MaxSaleLimit','充值上限'],['MinSaleLimit','充值下限']];

var type_Alldata = [['全部', '全部'], ['CountLimitPerCard', '单卡限制'], ['CountLimitPerDay', '单天限制'], ['PublishDate', '发卡日期限制'],
['MoneyLimitPerDay', '转卡金额限制'], ['ChainTransferLimit', '连续转卡限制'],
['MaxSaleLimit','充值上限'],['MinSaleLimit','充值下限']];
function rtype(str) {
    for (i = 0; i < type_data.length;i++) {
        if (str == type_data[i][0]) {
            return type_data[i][1];
        }
    }
}

var ExchangeTargetTypeData = [[1, '文峰服务'], [2, '文峰产品'],[3,'商品']]; //[3, '卡'], [4, '卡充值'], [5, '优惠券']
var ExchangeTargetTypeDataWithAll = [[0, '全部'], [1, '文峰服务'], [2, '文峰产品'],[3,'商品']]; //, [3, '卡'], [4, '卡充值'], [5, '优惠券']

var ExchangeTargetTypeDataStore = new Ext.data.ArrayStore({
    idIndex: 0,
    fields: [
            { name: "id" },
            { name: 'name' }
        ],
    data: ExchangeTargetTypeData
});

//兑换 服务
var tar_service_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointRules.aspx?actionName=getTarget&id=1&sid=' + Sys.sid,

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

//兑换产品
var tar_product_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed
    //autoDestroy: true,
    autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointRules.aspx?actionName=getTarget&id=2&sid=' + Sys.sid ,

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

//兑换商品
var tar_goods_store = new Ext.data.Store({
    // destroy the store if the grid is destroyed
    //autoDestroy: true,
    autoLoad: true,
    // load remote data using HTTP
    url: '../Apis/PointRules.aspx?actionName=getTarget&id=3&sid=' + Sys.sid,

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


//组状态(GroupState)
var GpStateStore = new Ext.data.ArrayStore({
    fields: ['myId', 'displayText'],
    data: [[0, '组长'], [1, '组员'], [2, '一般']]
});

//在岗状态(PostState)
var PostStateStore = new Ext.data.ArrayStore({
    fields: ['myId', 'displayText'],
    data: [[0, '在岗'], [1, '休假'], [2, '请假'], [3, '待报到'], [4, '离职']]
});

//获得职位(收银员类)
var Store_GetDuty = new Ext.data.JsonStore({
    autoLoad:true,
    url: '../Apis/aboutEmp.aspx?actionName=GetDuty&sid=' + Sys.sid,
    fields: ['myId', 'displayText']
});

//获得部门
var Store_GetDept = new Ext.data.JsonStore({
    url: '../Apis/aboutEmp.aspx?actionName=GetDept&sid=' + Sys.sid,
    fields: ['myId', 'displayText']
});

//获得员工编号
var Store_GetEmpCode = new Ext.data.JsonStore({
    url: '../Apis/aboutEmp.aspx?actionName=GetEmpCode&sid=' + Sys.sid,
    fields: ['myId', 'displayText']
});

var Store_Sex = new Ext.data.ArrayStore({
    fields: ['myId', 'displayText'],
    data: [[0, '男'], [1, '女']]
});

//***************** 门店状态 ***********************//
var combo_DeptStatus = {
    xtype: 'combo',
    fieldLabel: '门店状态',
    hiddenName: 'DeptStatus',
    mode: 'local',
    triggerAction: 'all',
    editable: false,
    store: new Ext.data.ArrayStore({
        fields: ['myId', 'displayText'],
        data: [[0, '全部'], [1, '停业'], [2, '正常营业'], [3, '装修']]
    }),
    value: 2,
    valueField: 'myId',
    displayField: 'displayText',
    anchor: '100%'
};
//格式化门店状态
function DeptStatus(status) {
    if (status == 0) {
        return '停业';
    } else if (status == 1) {
        return '正常营业';
    } else if (status == 2) {
        return '装修';
    } else {return '';}
}
//如果String类型的列值为Null则返回Empty
function ToEmpty(value) {
    if (value != null) {
        return value;
    } else { return ''; }
}
