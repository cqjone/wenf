//部门考勤流水


//过滤特殊字符
function CheckHTML(Str) {
    try {
        var S = Str;
        var regS = new RegExp("\\<", "g");
        var regS1 = new RegExp("\\>", "g");
        var regS2 = new RegExp("\r", "g");
        var regS3 = new RegExp("\n", "g");
        S = S.replace(regS, "&lt").replace(regS1, "&gt").replace(regS2, "").replace(regS3, "");
        return S;
    } catch (e) {
        return '';
    }
}

function HTMLBackUp(Str) {
    try {
        var S = Str;
        var regS = new RegExp("\\&lt", "g");
        var regS1 = new RegExp("\\&gt", "g");
        S = S.replace(regS, "<").replace(regS1, ">");
        return S;
    } catch (e) {
        return '';
    }
}

//===================年份和月份Store========================//
var newyear = new Date().getFullYear(); //这是为了取现在的年份数
Ext.QuickTips.init(); //初始化错误信息提示函数
Ext.form.Field.prototype.msgTarget = 'qtip'; //设置错误信息显示方式
var zodiacStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["鼠", "鼠"],
        ["牛", "牛"],
        ["虎", "虎"],
        ["兔", "兔"],
        ["龙", "龙"],
        ["蛇", "蛇"],
        ["马", "马"],
        ["羊", "羊"],
        ["猴", "猴"],
        ["鸡", "鸡"],
        ["狗", "狗"],
        ["猪", "猪"]
    ]
});

var zodiacCom = new Ext.form.ComboBox({
    name: "comboZodiacCom",
    store: zodiacStore,
    hiddenName: "comboZodiacCom",
    width: 80,
    margin: '0 0 0 20',
    mode: 'local',
    triggerAction: 'all',
    valueField: 'ID',
    displayField: 'Title',
    editable: false
});

var CoatSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["150/76A", "150/76A"],
        ["150/78B", "150/78B"],
        ["155/80A", "155/80A"],
        ["155/82B", "155/82B"],
        ["160/84A", "160/84A"],
        ["160/86B", "160/86B"],
        ["165/88A", "165/88A"],
        ["165/88B", "165/88B"],
        ["165/90B", "165/90B"],
        ["170/92A", "170/92A"],
        ["170/92B", "170/92B"],
        ["170/94B", "170/94B"],
        ["175/96A", "175/96A"],
        ["175/96B", "175/96B"],
        ["180/100A", "180/100A"],
        ["180/100B", "180/100B"],
        ["185/104A", "185/104A"],
        ["185/104B", "185/104B"],
        ["190/108A", "190/108A"],
        ["190/108B", "190/108B"]
    ]
});

var CoatSizeCom = new Ext.form.ComboBox({
    name: "CoatSizeCom",
    store: CoatSizeStore,
    hiddenName: "CoatSizeCom",
    width: 80,
    margin: '0 0 0 20',
    mode: 'local',
    triggerAction: 'all',
    valueField: 'ID',
    displayField: 'Title',
    editable: false
});

var ShirtSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["34#", "34#"],
        ["35#", "35#"],
        ["36#", "36#"],
        ["37#", "37#"],
        ["38#", "38#"],
        ["39#", "39#"],
        ["40#", "40#"],
        ["41#", "41#"],
        ["42#", "42#"],
        ["43#", "43#"]
    ]
});

var ShirtSizeCom = new Ext.form.ComboBox({
    name: "ShirtSizeCom",
    store: ShirtSizeStore,
    hiddenName: "ShirtSizeCom",
    width: 80,
    margin: '0 0 0 20',
    mode: 'local',
    triggerAction: 'all',
    valueField: 'ID',
    displayField: 'Title',
    editable: false
});

var TrousersSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["26#", "26#"],
        ["27#", "27#"],
        ["28#", "28#"],
        ["29#", "29#"],
        ["30#", "30#"],
        ["31#", "31#"],
        ["32#", "32#"],
        ["33#", "33#"],
        ["34#", "34#"],
        ["35#", "35#"],
        ["36#", "36#"],
        ["37#", "37#"],
        ["38#", "38#"],
        ["39#", "39#"]
    ]
});

var TrousersSizeCom = new Ext.form.ComboBox({
    name: "TrousersSizeCom",
    store: TrousersSizeStore,
    hiddenName: "TrousersSizeCom",
    width: 80,
    margin: '0 0 0 20',
    mode: 'local',
    triggerAction: 'all',
    valueField: 'ID',
    displayField: 'Title',
    editable: false
});

var SkirtSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["XS-A", "XS-A"],
        ["S-A", "S-A"],
        ["M-A", "M-A"],
        ["L-A", "L-A"],
        ["XL-A", "XL-A"],
        ["XXL-A", "XXL-A"],
        ["XS-B", "XS-B"],
        ["S-B", "S-B"],
        ["M-B", "M-B"],
        ["L-B", "L-B"],
        ["XL-B", "XL-B"],
        ["XXL-B", "XXL-B"]
    ]
});
var SkirtSizeCom = new Ext.form.ComboBox({
    name: "SkirtSizeCom",
    store: SkirtSizeStore,
    hiddenName: "SkirtSizeCom",
    width: 80,
    margin: '0 0 0 20',
    mode: 'local',
    triggerAction: 'all',
    valueField: 'ID',
    displayField: 'Title',
    editable: false
});

var ShoesSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["22.0(34)", "22.0(34)"],
        ["22.5(35)", "22.5(35)"],
        ["23.0(36)", "23.0(36)"],
        ["23.5(37)", "23.5(37)"],
        ["24.0(38)", "24.0(38)"],
        ["24.5(39)", "24.5(39)"],
        ["25.0(40)", "25.0(40)"],
        ["25.5(41)", "25.5(41)"],
        ["26.0(42)", "26.0(42)"],
        ["26.5(43)", "26.5(43)"],
        ["27.0(44)", "27.0(44)"]
    ]
});

var RankStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"]
    ]

});

var RankCom = new Ext.form.ComboBox({
    name: "Rank",
    store: RankStore,
    hiddenName: "Rank",
    width: 100,
    margin: '0 0 0 20',
    mode: 'local',
    value: '无',
    triggerAction: 'all',
    valueField: 'ID',
    displayField: 'Title',
    editable: false
});

var ShoesSizeCom = new Ext.form.ComboBox({
    name: "ShoesSizeCom",
    store: ShoesSizeStore,
    hiddenName: "ShoesSizeCom",
    width: 100,
    margin: '0 0 0 20',
    mode: 'local',
    triggerAction: 'all',
    valueField: 'ID',
    displayField: 'Title',
    editable: false
});

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    //	    hidden:true,
    labelWidth: 5,
    labelAlign: 'right',
    heigh: 65,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "员工基本信息填报",
        //defaultType: 'textfield',
        defaults: {
            labelAlign: "right",
            width: 50
        },
        height: 65,
        //bodyBorder:false,
        layout: "column",
        /**{items : [
        layout : "hbox",
        defaults : {
        margins : '0 5 0 0'
        },
        columnWidth : 1,
        items : [
        //						    {
        //								xtype : "button",
        //								boxMinWidth : 40,
        //								style : "margin-left:30px",
        //								width : 60,
        //								text : " 保  存",
        //								handler : function () {
        //
        //									updateData();
        //								}
        //							},{
        xtype : "label",
        html : '<font style="font-weight:bold;color:font-size:14px;">注：</font><font style="color:red;">点击编辑修改</font>',
        style : {
        //									marginTop : '3px',
        marginLeft : '15px'
        }

        }

        ]
        }
        ]**/

    }]
});

var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true

    },
    clicksToEdit: 1,

    columns: [{
            header: 'ID',
            dataIndex: 'ID',
            hidden: true,
            width: 0,
            clicksToEdit: 1
        }, {
            header: '<font style="font-weight:bold;">员工照片</font>',
            dataIndex: 'photo',

            renderer: function(value) {
                var imgUrl = value + "?num=" + getTimeStamp();
                return "<img src='" + imgUrl + "' width='89' style='width:89px' border='0'/>";
            }
        }, {
            header: '<font style="font-weight:bold;">工号</font>',
            dataIndex: 'Code',
            width: 100

        }, {
            header: '<font style="font-weight:bold;">姓名</font>',
            dataIndex: 'Title',
            width: 100
        }
        //			  {
        //                header :  '<font style="font-weight:bold;">操作</font>',
        //    				dataIndex : "",
        //    				width : 100,
        //    				menuDisabled : true,
        //    				align : "center",
        //    				renderer : function (v) {
        //    				debugger;
        //    					return "<a  onclick='newUpdateWindow()' style='text-decoration:underline;cursor:pointer;color:blue;'>编辑</a>";
        //    				}
        //    			}
        //
        //			{
        //				header : '<font style="font-weight:bold;">身份证</font>',
        //				dataIndex : 'IdNo',
        //				width : 150
        //			},
        //			{
        //				header : '<font style="font-weight:bold;">手机号码</font>',
        //				dataIndex : 'Tel',
        //				width : 100,
        //				editor : new Ext.form.NumberField({
        //					regex : /^1\d{10}$/, //超过最大值时候的提示信息,配合minValue 一起使用
        //					regexText : '请输入正确手机号码!'
        //				})
        //			}, {
        //				header : '<font style="font-weight:bold;">期数</font>',
        //				dataIndex : 'TrainPriod',
        //				width : 100,
        //				align : 'right',
        //				editor : new Ext.form.NumberField({
        //					allowDecimals : false,
        //					allowNegative : false,
        //
        //					maxValue : 999, //最大可输入的数值
        //					maxText : '期数不能超过999!', //超过最大值时候的提示信息,配合maxValue 一起使用
        //					minValue : 0, //最小可输入的数值
        //					minText : '期数不能小于0!', //超过最大值时候的提示信息,配合minValue 一起使用
        //					nanText : '请输入0-999之间的整数!'
        //				})
        //			},
        //			{
        //				header : '<font style="font-weight:bold;">星级</font>',
        //				dataIndex : 'Rank',
        //				width : 100,
        //				editor:RankCom
        //
        //			},
        //			{
        //				header : '<font style="font-weight:bold;">交通银行卡号</font>',
        //				dataIndex : 'CommCardNo',
        //				width : 150
        //				/**editor : new Ext.form.NumberField({
        //					regex : /^\d{16}$/,
        //					nanText : '银行卡号必须为16位数字!'
        //				})**/
        //
        //
        //			},
        //			{
        //				header : '<font style="font-weight:bold;">中国银行卡号</font>',
        //				dataIndex : 'BocCardNo',
        //				width : 150
        //				/**editor : new Ext.form.NumberField({
        //					regex : /^\d{16}$/,
        //					nanText : '银行卡号必须为16位数字!'
        //				})**/
        //
        //
        //			},
        //			{
        //				header : '<font style="font-weight:bold;">招商银行卡号</font>',
        //				dataIndex : 'CmbCardNo',
        //				width : 150
        //				/**editor : new Ext.form.NumberField({
        //					regex : /^\d{16}$/,
        //					nanText : '银行卡号必须为16位数字!'
        //				})**/
        //
        //			},
        //			/**
        //			{
        //				header : '<font style="font-weight:bold;">个人电话</font>',
        //				dataIndex : 'PersonalPhone',
        //				width : 150,
        //				editor : new Ext.form.TextField({
        //					maxLength:50,
        //					masLengthText:"个人电话不得超过50个字符"
        //				})
        //			},
        //
        //			{
        //				header : '<font style="font-weight:bold;">现住址</font>',
        //				dataIndex : 'PersonalAddress',
        //				width : 400,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"现住址不得超过100个字符"
        //				})

        //			},
        //
        //
        //			{
        //				header : '<font style="font-weight:bold;"> 配偶姓名</font>',
        //				dataIndex : 'ConsortName',
        //				width : 150,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:" 配偶姓名不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">配偶电话</font>',
        //				dataIndex : 'ConsortPhone',
        //				width : 150,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"配偶电话不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">配偶住址</font>',
        //				dataIndex : 'ConsortAddress',
        //				width : 400,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"配偶住址不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">父母姓名</font>',
        //				dataIndex : 'ParentName',
        //				width : 150,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"父母姓名不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">父母电话</font>',
        //				dataIndex : 'ParentPhone',
        //				width : 150,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"父母电话不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">父母住址</font>',
        //				dataIndex : 'ParentAddress',
        //				width : 400,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"父母住址不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">亲属姓名</font>',
        //				dataIndex : 'KinName',
        //				width : 150,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"亲属姓名不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">亲属电话</font>',
        //				dataIndex : 'KinPhone',
        //				width : 150,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"亲属电话不得超过100个字符"
        //				})

        //			},
        //			{
        //				header : '<font style="font-weight:bold;">亲属地址</font>',
        //				dataIndex : 'KinAddress',
        //				width : 400,
        //				editor : new Ext.form.TextField({
        //					maxLength:100,
        //					masLengthText:"亲属地址不得超过100个字符"
        //				})

        //			},
        //			**/
        //
        //			{
        //				header : '<font style="font-weight:bold;">身高(CM)</font>',
        //				dataIndex : 'Height',
        //				align : 'right',
        //				width : 100,
        //				editor : new Ext.form.NumberField({
        //					allowDecimals : false,
        //					allowNegative : false,
        //					maxValue : 250, //最大可输入的数值
        //					maxText : '身高不能超过250 CM!', //超过最大值时候的提示信息,配合maxValue 一起使用
        //					minValue : 120, //最小可输入的数值
        //					minText : '身高不能小于120 CM!', //超过最大值时候的提示信息,配合minValue 一起使用
        //					nanText : '请输入正数!'
        //				}),
        //				renderer : function (value, cellmeta, record, rowIndex, columnIndex, store) {
        //					if (value == '0') {
        //						return "";
        //					} else {
        //						return value;
        //					}
        //				}
        //			}, {
        //				header : '<font style="font-weight:bold;">体重(Kg)</font>',
        //				dataIndex : 'Weight',
        //				width : 100,
        //				align : 'right',
        //				editor : new Ext.form.NumberField({
        //					allowDecimals : true,
        //					allowNegative : false,
        //					maxValue : 200.0, //最大可输入的数值
        //					decimalPrecision : 1,
        //					maxText : '体重不能超过200.0 Kg', //超过最大值时候的提示信息,配合maxValue 一起使用
        //					minValue : 20.0, //最小可输入的数值
        //					minText : '体重不能小于20.0 Kg', //超过最大值时候的提示信息,配合minValue 一起使用
        //					nanText : '请输入数字格式！'
        //				}),
        //				renderer : function (value, cellmeta, record, rowIndex, columnIndex, store) {
        //					if (value == '0') {
        //						return "";
        //					} else {
        //						return value;
        //					}
        //				}
        //			},
        //			{
        //				header : '<font style="font-weight:bold;">西服</font>',
        //				dataIndex : 'CoatSize',
        //				width : 100,
        //				editor : CoatSizeCom
        //			}, {
        //				header : '<font style="font-weight:bold;">短衬衫</font>',
        //				dataIndex : 'ShirtSize',
        //				width : 100,
        //				editor : ShirtSizeCom
        //			}, {
        //				header : '<font style="font-weight:bold;">西裤</font>',
        //				dataIndex : 'TrousersSize',
        //				width : 100,
        //				editor : TrousersSizeCom
        //			}, {
        //				header : '<font style="font-weight:bold;">红色裙子</font>',
        //				dataIndex : 'SkirtSize',
        //				width : 100,
        //				editor : SkirtSizeCom
        //			}, {
        //				header : '<font style="font-weight:bold;">皮鞋</font>',
        //				dataIndex : 'ShoesSize',
        //				width : 100,
        //				editor : ShoesSizeCom
        //			}

    ]
});

// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/ClothingSizesFill.aspx?actionName=getAllEmp&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        idProperty: 'ID',
        root: 'results',
        fields: [{
                name: "ID",
                mapping: "ID"
            }, {
                name: 'Title',
                mapping: 'Title'
            }, {
                name: 'photo',
                mapping: 'photo'
            }, {
                name: 'Code',
                mapping: 'Code'
            }
            //	                 {
            //					name : 'IdNo',
            //					mapping : 'IdNo'
            //				},
            //				{
            //					name : 'Tel',
            //					mapping : 'Tel'
            //				}, {
            //					name : "TrainPriod",
            //					mapping : "TrainPriod"
            //				},
            //
            //				{
            //					name : "Rank",
            //					mapping : "Rank"
            //				},
            //
            //				{
            //					name : 'Height',
            //					mapping : 'Height'
            //				}, {
            //					name : "Weight",
            //					mapping : "Weight"
            //				}, {
            //					name : "CoatSize",
            //					mapping : "CoatSize"
            //				}, {
            //					name : 'ShirtSize',
            //					mapping : 'ShirtSize'
            //				}, {
            //					name : 'TrousersSize',
            //					mapping : 'TrousersSize'
            //				}, {
            //					name : "SkirtSize",
            //					mapping : "SkirtSize"
            //				}, {
            //					name : "ShoesSize",
            //					mapping : "ShoesSize"
            //				}, {
            //					name : "Memo",
            //					mapping : "Memo"
            //				}, {
            //					name : "CommCardNo",
            //					mapping : "CommCardNo"
            //				},{
            //					name : "CmbCardNo",
            //					mapping : "CmbCardNo"
            //				},{
            //					name : "BocCardNo",
            //					mapping : "BocCardNo"
            //				},{
            //					name : "FamilyAdress",
            //					mapping : "FamilyAdress"
            //				},
            //
            //
            //				{
            //					name : "PersonalPhone",
            //					mapping : "PersonalPhone"
            //				},
            //				{
            //					name : "PersonalAddress",
            //					mapping : "PersonalAddress"
            //				},
            //				{
            //					name : "ConsortName",
            //					mapping : "ConsortName"
            //				},
            //				{
            //					name : "ConsortPhone",
            //					mapping : "ConsortPhone"
            //				},
            //				{
            //					name : "ConsortAddress",
            //					mapping : "ConsortAddress"
            //				},
            //				{
            //					name : "ParentName",
            //					mapping : "ParentName"
            //				},
            //				{
            //					name : "ParentAddress",
            //					mapping : "ParentAddress"
            //				},
            //				{
            //					name : "KinName",
            //					mapping : "KinName"
            //				},
            //				{
            //					name : "KinPhone",
            //					mapping : "KinPhone"
            //				},
            //				{
            //					name : "KinAddress",
            //					mapping : "KinAddress"
            //				}
            //

        ]
    })
});
/**
 * 查询数据
 */
function updateData() {
    var records = pd_store.data.items;
    var array = new Array();
    //var reg = /^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/;
    var reg = /^1\d{10}$/;
    for (var i = 0; i < records.length; i++) {
        //if (!(records[i].data["ShirtSize"] == "" || records[i].data["ShirtSize"] == null)) {
        var tel = records[i].data["Tel"];

        if (tel != null && tel != "" && tel != "null" && !reg.test(tel)) {
            alert("手机号码:" + tel + "格式不正确!");
            Ext.getCmp("editGrid").startEditing(i, 3);
            return;
        }
        //}
        array.push(records[i].data);
    }
    Ext.getBody().mask("正在保存！请稍候！");
    var data = Ext.encode(array);
    Ext.Ajax.request({
        url: '../Apis/ClothingSizesFill.aspx?actionName=updateData&sid=' + Sys.sid,
        params: {
            records: data
        },
        success: function(response, options) {
            pd_store.reload();
            Ext.getBody().unmask();
        },
        failure: function(response, options) {
            Ext.getBody().unmask();
        }
    });
}

/**
var pd_grid = new Ext.grid.EditorGridPanel({
store : pd_store,
cm : cm,
id : 'editGrid',
isEditor : true,
clicksToEdit : 1,
region : 'center',
margins : "2 2 2 2",
border : false,
columnLines : true,
loadMask : true

});**/

var pd_grid = new Ext.grid.EditorGridPanel({
    store: pd_store,
    id: 'editGrid',
    isEditor: true,
    clicksToEdit: 1,
    region: 'center',
    margins: "2 2 2 2",
    border: false,
    columnLines: true,
    loadMask: true,
    cm: new Ext.ux.grid.LockingColumnModel(
        [{
                header: '<font style="font-weight:bold;">姓名</font>',
                width: 100,
                height: 124,
                dataIndex: 'Title',
                locked: true,
                hidden: true,
                id: 'Title',
                renderer: function(value) {
                    return "<div style='width:89px;height:124px;vertical-align:middle'>" + value + "</div>";
                }
            }, {
                header: 'ID',
                dataIndex: 'ID',
                hidden: true,
                width: 0,
                clicksToEdit: 1
            }, {
                header: '<font style="font-weight:bold;">员工照片</font>',
                dataIndex: 'photo',
                height: 124,

                renderer: function(value) {
                    var imgUrl = value + "?num=" + getTimeStamp();
                    return "<img src='" + imgUrl + "' width='89' style='width:89px;height:124px' border='0'/>";
                }
            }, {
                header: '<font style="font-weight:bold;">工号</font>',
                dataIndex: 'Code',
                width: 100

            }, {
                header: '<font style="font-weight:bold;">姓名</font>',
                dataIndex: 'Title',
                width: 100
            }, {
                header: '<font style="font-weight:bold;">操作</font>',
                dataIndex: "Code",
                menuDisabled: true,
                align: "center",
                width: 100,

                renderer: function(v) {

                    return "<a id=" + v.toString() + " onclick=\"newUpdateWindow(this)\" style=\"text-decoration:underline;cursor:pointer;color:blue;\">编辑</a>";
                }
            }
            //			{
            //				header : '<font style="font-weight:bold;">身份证</font>',
            //				dataIndex : 'IdNo',
            //				width : 150
            //			},
            //			{
            //				header : '<font style="font-weight:bold;">手机号码</font>',
            //				dataIndex : 'Tel',
            //				width : 100,
            //				editor : new Ext.form.NumberField({
            //					regex : /^1\d{10}$/, //超过最大值时候的提示信息,配合minValue 一起使用
            //					regexText : '请输入正确手机号码!'
            //				})
            //			}, {
            //				header : '<font style="font-weight:bold;">期数</font>',
            //				dataIndex : 'TrainPriod',
            //				width : 100,
            //				align : 'right',
            //				editor : new Ext.form.NumberField({
            //					allowDecimals : false,
            //					allowNegative : false,
            //
            //					maxValue : 999, //最大可输入的数值
            //					maxText : '期数不能超过999!', //超过最大值时候的提示信息,配合maxValue 一起使用
            //					minValue : 0, //最小可输入的数值
            //					minText : '期数不能小于0!', //超过最大值时候的提示信息,配合minValue 一起使用
            //					nanText : '请输入0-999之间的整数!'
            //				})
            //			},
            //			{
            //				header : '<font style="font-weight:bold;">星级</font>',
            //				dataIndex : 'Rank',
            //				width : 100,
            //				editor:RankCom
            //
            //			},
            //			{
            //				header : '<font style="font-weight:bold;">交通银行卡号</font>',
            //				dataIndex : 'CommCardNo',
            //				width : 150
            //				/**editor : new Ext.form.NumberField({
            //					regex : /^\d{16}$/,
            //					nanText : '银行卡号必须为16位数字!'
            //				})**/
            //
            //
            //			},
            //			{
            //				header : '<font style="font-weight:bold;">中国银行卡号</font>',
            //				dataIndex : 'BocCardNo',
            //				width : 150
            //				/**editor : new Ext.form.NumberField({
            //					regex : /^\d{16}$/,
            //					nanText : '银行卡号必须为16位数字!'
            //				})**/
            //
            //
            //			},
            //			{
            //				header : '<font style="font-weight:bold;">招商银行卡号</font>',
            //				dataIndex : 'CmbCardNo',
            //				width : 150
            //				/**editor : new Ext.form.NumberField({
            //					regex : /^\d{16}$/,
            //					nanText : '银行卡号必须为16位数字!'
            //				})**/
            //
            //			},
            //
            //			{
            //				header : '<font style="font-weight:bold;">家庭电话</font>',
            //				dataIndex : 'FamilyPhone',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:50,
            //					masLengthText:"家庭电话不得超过50个字符"
            //				})
            //			},
            //
            //			{
            //				header : '<font style="font-weight:bold;">家庭住址</font>',
            //				dataIndex : 'FamilyAdress',
            //				width : 400,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"家庭住址不得超过100个字符"
            //				})

            //			},
            //
            //			{
            //				header : '<font style="font-weight:bold;">个人电话</font>',
            //				dataIndex : 'PersonalPhone',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:50,
            //					masLengthText:"个人电话不得超过50个字符"
            //				})
            //			},
            //
            //			{
            //				header : '<font style="font-weight:bold;">现住址</font>',
            //				dataIndex : 'PersonalAddress',
            //				width : 400,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"现住址不得超过100个字符"
            //				})

            //			},
            //
            //
            //			{
            //				header : '<font style="font-weight:bold;"> 配偶姓名</font>',
            //				dataIndex : 'ConsortName',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:" 配偶姓名不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">配偶电话</font>',
            //				dataIndex : 'ConsortPhone',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"配偶电话不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">配偶住址</font>',
            //				dataIndex : 'ConsortAddress',
            //				width : 400,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"配偶住址不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">父母姓名</font>',
            //				dataIndex : 'ParentName',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"父母姓名不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">父母电话</font>',
            //				dataIndex : 'ParentPhone',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"父母电话不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">父母住址</font>',
            //				dataIndex : 'ParentAddress',
            //				width : 400,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"父母住址不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">亲属姓名</font>',
            //				dataIndex : 'KinName',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"亲属姓名不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">亲属电话</font>',
            //				dataIndex : 'KinPhone',
            //				width : 150,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"亲属电话不得超过100个字符"
            //				})

            //			},
            //			{
            //				header : '<font style="font-weight:bold;">亲属地址</font>',
            //				dataIndex : 'KinAddress',
            //				width : 400,
            //				editor : new Ext.form.TextField({
            //					maxLength:100,
            //					masLengthText:"亲属地址不得超过100个字符"
            //				})

            //			},
            //
            //			{
            //				header : '<font style="font-weight:bold;">身高(CM)</font>',
            //				dataIndex : 'Height',
            //				align : 'right',
            //				width : 100,
            //				editor : new Ext.form.NumberField({
            //					allowDecimals : false,
            //					allowNegative : false,
            //					maxValue : 250, //最大可输入的数值
            //					maxText : '身高不能超过250 CM!', //超过最大值时候的提示信息,配合maxValue 一起使用
            //					minValue : 120, //最小可输入的数值
            //					minText : '身高不能小于120 CM!', //超过最大值时候的提示信息,配合minValue 一起使用
            //					nanText : '请输入正数!'
            //				}),
            //				renderer : function (value, cellmeta, record, rowIndex, columnIndex, store) {
            //					if (value == '0') {
            //						return "";
            //					} else {
            //						return value;
            //					}
            //				}
            //			}, {
            //				header : '<font style="font-weight:bold;">体重(Kg)</font>',
            //				dataIndex : 'Weight',
            //				width : 100,
            //				align : 'right',
            //				editor : new Ext.form.NumberField({
            //					allowDecimals : true,
            //					allowNegative : false,
            //					maxValue : 200.0, //最大可输入的数值
            //					decimalPrecision : 1,
            //					maxText : '体重不能超过200.0 Kg', //超过最大值时候的提示信息,配合maxValue 一起使用
            //					minValue : 20.0, //最小可输入的数值
            //					minText : '体重不能小于20.0 Kg', //超过最大值时候的提示信息,配合minValue 一起使用
            //					nanText : '请输入数字格式！'
            //				}),
            //				renderer : function (value, cellmeta, record, rowIndex, columnIndex, store) {
            //					if (value == '0') {
            //						return "";
            //					} else {
            //						return value;
            //					}
            //				}
            //			},
            //			{
            //				header : '<font style="font-weight:bold;">西服</font>',
            //				dataIndex : 'CoatSize',
            //				width : 100,
            //				editor : CoatSizeCom
            //			}, {
            //				header : '<font style="font-weight:bold;">短衬衫</font>',
            //				dataIndex : 'ShirtSize',
            //				width : 100,
            //				editor : ShirtSizeCom
            //			}, {
            //				header : '<font style="font-weight:bold;">西裤</font>',
            //				dataIndex : 'TrousersSize',
            //				width : 100,
            //				editor : TrousersSizeCom
            //			}, {
            //				header : '<font style="font-weight:bold;">红色裙子</font>',
            //				dataIndex : 'SkirtSize',
            //				width : 100,
            //				editor : SkirtSizeCom
            //			}, {
            //				header : '<font style="font-weight:bold;">皮鞋</font>',
            //				dataIndex : 'ShoesSize',
            //				width : 100,
            //				editor : ShoesSizeCom
            //			}
        ]),
    stripeRows: true,

    view: new Ext.ux.grid.LockingGridView()

});

function newUpdateWindow(thisLine) {

    var win = new Ext.Window({
        width: 900,
        height: 'auto',
        title: ' 员工信息修改',
        height: 600,
        modal: true,
        closeAction: "hide",
        draggable: false, //拖动
        autoScroll: true,
        buttons: [{
            id: "btnsearch",
            text: "保 存",
            listeners: {
                click: function() {

                    VerifyAction();
                }
            }
        }, {
            text: '关闭',
            handler: function() {
                win.hide();
            }
        }],
        items: pd_main_panel2,
        closable: false
    });

    win.show();

    pd_top_form2.getForm().reset();
    pd_top_form2.getForm().findField('EmployeeCode').setValue(thisLine.id);
    var code = thisLine.id;
    Ext.Ajax.request({
        url: '../Apis/EmpInfoMgr.aspx?actionName=getNewEmpName&sid=' + Sys.sid,
        params: {
            Code: code
        },
        success: function(response, option) {
            var rs = Ext.decode(response.responseText);
            if (rs.success) {
                if (rs.msg.length >= 0) {

                    pd_top_form2.getForm().findField('EmployeeCode').setValue(code);
                    pd_top_form2.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                    pd_top_form2.getForm().findField('Marriage').setValue(rs.msg[0]["Marriage"]);
                    //民族
                    pd_top_form2.getForm().findField('Nation').setValue(rs.msg[0]["Nation"]);
                    //															政治面貌
                    pd_top_form2.getForm().findField('Politics').setValue(rs.msg[0]["Politics"]);
                    //															贯籍
                    pd_top_form2.getForm().findField('Nvarchar1').setValue(rs.msg[0]["Nvarchar1"]);

                    //															家庭电话
                    pd_top_form2.getForm().findField('FamilyPhone').setValue(rs.msg[0]["FamilyPhone"]);
                    //                                                             家庭地址
                    pd_top_form2.getForm().findField('PersonalAddress').setValue(rs.msg[0]["PersonalAddress"]);
                    pd_top_form2.getForm().findField('ConsortName').setValue(rs.msg[0]["ConsortName"]);
                    pd_top_form2.getForm().findField('ConsortPhone').setValue(rs.msg[0]["ConsortPhone"]);
                    pd_top_form2.getForm().findField('ConsortAddress').setValue(rs.msg[0]["ConsortAddress"]);
                    pd_top_form2.getForm().findField('PersonalAddress').setValue(rs.msg[0]["PersonalAddress"]);
                    
                    pd_top_form2.getForm().findField('ParentName').setValue(rs.msg[0]["ParentName"]);
                    pd_top_form2.getForm().findField('ParentPhone').setValue(rs.msg[0]["ParentPhone"]);
                    pd_top_form2.getForm().findField('ParentAddress').setValue(rs.msg[0]["ParentAddress"]);
                    pd_top_form2.getForm().findField('KinName').setValue(rs.msg[0]["KinName"]);
                    pd_top_form2.getForm().findField('KinPhone').setValue(rs.msg[0]["KinPhone"]);
                    pd_top_form2.getForm().findField('KinAddress').setValue(rs.msg[0]["KinAddress"]);
                    var edata = rs.msg[0]["HireDate"];
                    if (edata != "") {
                        var ey = edata.split('-');
                        pd_top_form2.getForm().findField('eyear').setValue(ey[0]);
                        pd_top_form2.getForm().findField('emonth').setValue(ey[1]);
                    }
                    pd_top_form2.getForm().findField('Height').setValue(rs.msg[0]["Height"]);
                    pd_top_form2.getForm().findField('syear').setValue(rs.msg[0]["syear"]);
                    pd_top_form2.getForm().findField('smonth').setValue(rs.msg[0]["smonth"]);

                    pd_top_form2.getForm().findField('Weight').setValue(rs.msg[0]["Weight"]);
                    pd_top_form2.getForm().findField('CoatSize').setValue(rs.msg[0]["CoatSize"]);
                    pd_top_form2.getForm().findField('TrousersSize').setValue(rs.msg[0]["TrousersSize"]);
                    pd_top_form2.getForm().findField('ShirtSize').setValue(rs.msg[0]["ShirtSize"]);
                    pd_top_form2.getForm().findField('SkirtSize').setValue(rs.msg[0]["SkirtSize"]);
                    pd_top_form2.getForm().findField('ShoesSize').setValue(rs.msg[0]["ShoesSize"]);
                    pd_top_form2.getForm().findField('CommCardNo').setValue(rs.msg[0]["CommCardNo"]);
                    pd_top_form2.getForm().findField('BocCardNo').setValue(rs.msg[0]["BocCardNo"]);
                    pd_top_form2.getForm().findField('CmbCardNo').setValue(rs.msg[0]["CmbCardNo"]);
                    pd_top_form2.getForm().findField('Sex').setValue(rs.msg[0]["Sex"]);
                    //pd_top_form2.getForm().findField('Duty').setValue(rs.msg[0]["Duty"]);
                    //pd_top_form2.getForm().findField('DutyID').setValue(rs.msg[0]["DutyID"]);
                    pd_top_form2.getForm().findField('Mobile').setValue(rs.msg[0]["Mobile"]);
                    pd_top_form2.getForm().findField('IdNo').setValue(rs.msg[0]["IdNo"]);
                    pd_top_form2.getForm().findField('Rank').setValue(rs.msg[0]["Rank"]);
                    pd_top_form2.getForm().findField('TrainPriod').setValue(rs.msg[0]["TrainPriod"]);

                    //调动记录
                    Ext.Ajax.request({
                        url: '../Apis/EmpInfoMgr.aspx?actionName=getNewDdData&sid=' + Sys.sid,
                        params: {
                            Code: code
                        },
                        success: function(response, option) {
                            var rs = Ext.decode(response.responseText);
                            if (rs.success) {
                                if (rs.msg.length >= 0) {

                                    //													            pd_top_form2.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                    for (var i = 0; i < rs.msg.length; i++) {
                                        var y = i + 1;
                                        if (rs.msg[i]["JoinDate"] != null) {
                                            var rddata = rs.msg[i]["JoinDate"].split('-');
                                            pd_top_form2.getForm().findField('rdy' + y).setValue(rddata[0]);
                                            pd_top_form2.getForm().findField('rdm' + y).setValue(rddata[1]);
                                        }
                                        if (rs.msg[i]["LeaveDate"] != null) {
                                            var lddata = rs.msg[i]["LeaveDate"].split('-');
                                            pd_top_form2.getForm().findField('ldy' + y).setValue(lddata[0]);
                                            pd_top_form2.getForm().findField('ldm' + y).setValue(lddata[1]);
                                        }
                                        //													                       var bj=rs.msg[i]["zz"];

                                        var ID = rs.msg[i]["ID"];
                                        pd_top_form2.getForm().findField('dd' + y).setValue(ID);
                                        if (rs.msg[i]["Title"] != null) {
                                            pd_top_form2.getForm().findField('DeptId' + y).setValue(rs.msg[i]["Title"]);
                                        }
                                        if (rs.msg[i]["Duty"] != null) {
                                            pd_top_form2.getForm().findField('zz' + y).setValue(rs.msg[i]["Duty"]);
                                        }
                                    }
                                }
                            }
                        },
                        failure: function() {
                            Ext.MessageBox.alert("提示", "获取调动记录异常!");
                            Ext.getCmp('btnsearch').setDisabled(true);
                        }

                    });

                    //培训期数
                    Ext.Ajax.request({
                        url: '../Apis/EmpInfoMgr.aspx?actionName=getNewQsData&sid=' + Sys.sid,
                        params: {
                            Code: code
                        },
                        success: function(response, option) {
                            var rs = Ext.decode(response.responseText);
                            if (rs.success) {
                                if (rs.msg.length >= 0) {

                                    //													            pd_top_form2.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                    for (var i = 0; i < rs.msg.length; i++) {
                                        var y = i + 1;
                                        var Period = rs.msg[i]["Period"];
                                        var ID = rs.msg[i]["ID"];
                                        pd_top_form2.getForm().findField('tx' + y).setValue(ID);
                                        pd_top_form2.getForm().findField('px' + y).setValue(Period);
                                    }
                                }
                            }
                        },
                        failure: function() {
                            Ext.MessageBox.alert("提示", "获取培训记录异常!");
                            Ext.getCmp('btnsearch').setDisabled(true);
                        }

                    });

                    //入学记录
                    Ext.Ajax.request({
                        url: '../Apis/EmpInfoMgr.aspx?actionName=getNewRxData&sid=' + Sys.sid,
                        params: {
                            Code: code
                        },
                        success: function(response, option) {
                            var rs = Ext.decode(response.responseText);
                            if (rs.success) {
                                if (rs.msg.length >= 0) {
                                    //pd_top_form2.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                    for (var i = 0; i < rs.msg.length; i++) {
                                        var y = i + 1;
                                        if (rs.msg[i]["JoinDate"] != null) {
                                            var rxdata = rs.msg[i]["JoinDate"].split('-');
                                            pd_top_form2.getForm().findField('rxy' + y).setValue(rxdata[0]);
                                            pd_top_form2.getForm().findField('rxm' + y).setValue(rxdata[1]);
                                        }
                                        if (rs.msg[i]["GraduateDate"] != null) {
                                            var bxdata = rs.msg[i]["GraduateDate"].split('-');
                                            pd_top_form2.getForm().findField('bxy' + y).setValue(bxdata[0]);
                                            pd_top_form2.getForm().findField('bxm' + y).setValue(bxdata[1]);
                                        }
                                        var bj = rs.msg[i]["ClassName"];
                                        var ID = rs.msg[i]["ID"];
                                        pd_top_form2.getForm().findField('xx' + y).setValue(ID);
                                        pd_top_form2.getForm().findField('bj' + y).setValue(bj);
                                    }
                                }
                            }
                        },
                        failure: function() {
                            Ext.MessageBox.alert("提示", "获取入学记录异常!");
                            Ext.getCmp('btnsearch').setDisabled(true);
                        }
                    });

                }
            }

        },
        failure: function() {
            Ext.MessageBox.alert("提示", "获取员工姓名异常!");
            Ext.getCmp('btnsearch').setDisabled(true);
        }
    });

    Ext.getCmp('btnsearch').setDisabled(false);
}

pd_store.on('beforeload', function(thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    this.baseParams = pd_top_form.getForm().getValues();
    this.baseParams.urlName = "dept";
    this.baseParams.start = 0;
    this.baseParams.limit = 20;
});

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 90,
        layout: "fit",
        border: false,
        items: [pd_top_form]
    }, {
        layout: "border",
        region: 'center',
        border: false,
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();

function getTimeStamp() {
    // 声明变量。
    var d,
        s;
    // 创建 Date 对象。
    d = new Date();
    s = d.getFullYear();
    s += ("0" + (d.getMonth() + 1)).slice(-2);
    s += ("0" + d.getDate()).slice(-2);
    s += ("0" + d.getHours()).slice(-2);
    s += ("0" + d.getMinutes()).slice(-2);
    s += ("0" + d.getSeconds()).slice(-2);
    s += ("00" + d.getMilliseconds()).slice(-3);
    return s;
}

Ext.onReady(function() {
    Ext.QuickTips.init();

});

//门店信息下拉框
var tar_dept = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CashierSetting.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "CombineWord",
            mapping: "CombineWord"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'CombineWord',
        direction: 'ASC'
    }
});

var CoatSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["150/76A", "150/76A"],
        ["150/78B", "150/78B"],
        ["155/80A", "155/80A"],
        ["155/82B", "155/82B"],
        ["160/84A", "160/84A"],
        ["160/86B", "160/86B"],
        ["165/88A", "165/88A"],
        ["165/88B", "165/88B"],
        ["165/90B", "165/90B"],
        ["170/92A", "170/92A"],
        ["170/92B", "170/92B"],
        ["170/94B", "170/94B"],
        ["175/96A", "175/96A"],
        ["175/96B", "175/96B"],
        ["180/100A", "180/100A"],
        ["180/100B", "180/100B"],
        ["185/104A", "185/104A"],
        ["185/104B", "185/104B"],
        ["190/108A", "190/108A"],
        ["190/108B", "190/108B"]
    ]
});
var ShirtSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["34#", "34#"],
        ["35#", "35#"],
        ["36#", "36#"],
        ["37#", "37#"],
        ["38#", "38#"],
        ["39#", "39#"],
        ["40#", "40#"],
        ["41#", "41#"],
        ["42#", "42#"],
        ["43#", "43#"]
    ]
});

var RankStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"]
    ]

});

var MmStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["中共党员", "中共党员"],
        ["中共预备党员", "中共预备党员"],
        ["共青团员", "共青团员"],
        ["民革党员", "民革党员"],
        ["民盟盟员", "民盟盟员"],
        ["民建会员", "民建会员"],
        ["民进会员", "民进会员"],
        ["农工党党员", "农工党党员"],
        ["致公党党员", "致公党党员"],
        ["九三学社社员", "九三学社社员"],
        ["台盟盟员", "台盟盟员"],
        ["无党派人士", "无党派人士"],
        ["普通居民（群众）", "普通居民（群众）"],
        ["港澳同胞", "港澳同胞"],
        ["叛徒", "叛徒"],
        ["反革命分子", "反革命分子"],
        ["少先队员", "少先队员"]
    ]

});
var hyStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["未婚", "未婚"],
        ["已婚", "已婚"],
        ["离异", "离异"],
        ["丧偶", "丧偶"]
    ]

});
var SexStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["男", "男"],
        ["女", "女"]
    ]

});

var RankDuty = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["美发总管", "美发总管"],
        ["美发经理", "美发经理"],
        ["美发总助", "美发总助"],
        ["美发飞虎", "美发飞虎"],
        ["高研班", "高研班"],
        ["空降兵", "空降兵"],
        ["美容总管", "美容总管"],
        ["美容经理", "美容经理"],
        ["片区美容经理", "片区美容经理"],
        ["美容助教", "美容助教"],

        ["美容总助", "美容总助"],
        ["容飞虎", "副经理"],
        ["美发师", "美发师"],
        ["美容师", "美容师"],
        ["足疗", "足疗"],

        ["收银员", "收银员"],
        ["美发总监", "美发总监"],
        ["美容实习生", "美容实习生"],
        ["美容总管", "美容总管"],
        ["特种班", "特种班"],

        ["区域总管", "区域总管"],
        ["大区经理", "大区经理"],
        ["小区经理", "小区经理"],
        ["老板", "老板"]

    ]

});
var tar_duty = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getDuty&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "Title",
            mapping: "Title"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'Title',
        direction: 'ASC'
    }
});

var tar_dutyType = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getDutyType&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "Title",
            mapping: "Title"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'Title',
        direction: 'ASC'
    }
});

var TrousersSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["26#", "26#"],
        ["27#", "27#"],
        ["28#", "28#"],
        ["29#", "29#"],
        ["30#", "30#"],
        ["31#", "31#"],
        ["32#", "32#"],
        ["33#", "33#"],
        ["34#", "34#"],
        ["35#", "35#"],
        ["36#", "36#"],
        ["37#", "37#"],
        ["38#", "38#"],
        ["39#", "39#"]
    ]
});

var SkirtSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["XS-A", "XS-A"],
        ["S-A", "S-A"],
        ["M-A", "M-A"],
        ["L-A", "L-A"],
        ["XL-A", "XL-A"],
        ["XXL-A", "XXL-A"],
        ["XS-B", "XS-B"],
        ["S-B", "S-B"],
        ["M-B", "M-B"],
        ["L-B", "L-B"],
        ["XL-B", "XL-B"],
        ["XXL-B", "XXL-B"]
    ]
});

var ShoesSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["22.0(34)", "22.0(34)"],
        ["22.5(35)", "22.5(35)"],
        ["23.0(36)", "23.0(36)"],
        ["23.5(37)", "23.5(37)"],
        ["24.0(38)", "24.0(38)"],
        ["24.5(39)", "24.5(39)"],
        ["25.0(40)", "25.0(40)"],
        ["25.5(41)", "25.5(41)"],
        ["26.0(42)", "26.0(42)"],
        ["26.5(43)", "26.5(43)"],
        ["27.0(44)", "27.0(44)"]
    ]
});

function checkIdcard() {
    var num = pd_top_form2.getForm().findField('IdNo').getValue();

    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(num))) {
        Ext.MessageBox.alert("提示", '输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        //        pd_top_form2.getForm().findField('IdNo').focus();
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len,
        re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            Ext.MessageBox.alert("提示", '输入的身份证号里出生日期不对！');
            //              pd_top_form2.getForm().findField('IdNo').focus();
            return false;
        } else {
            //将15位身份证转成18位
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            //                pd_top_form2.getForm().findField('IdNo').focus();
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            Ext.MessageBox.alert("提示", '输入的身份证号里出生日期不对！');
            //            pd_top_form2.getForm().findField('IdNo').focus();
            return false;
        } else {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                Ext.MessageBox.alert("提示", '18位身份证的校验码不正确！应该为：' + valnum);
                //           pd_top_form2.getForm().findField('IdNo').focus();
                return false;
            }
            //        if(valnum%2==0)
            //        {
            //         var sex=pd_top_form2.getForm().findField('Sex').getValue();
            //        if(sex!="男")
            //        {
            //          Ext.MessageBox.alert("提示", "性别和身份证不符合!");
            //           return false;
            //        }
            //        }else
            //        {
            //          var sex=pd_top_form2.getForm().findField('Sex').getValue();
            //        if(sex!="女")
            //        {
            //        Ext.MessageBox.alert("提示", "性别和身份证不符合!");
            //         return false;
            //        }
            //        }
            return true;

        }
    }
    return false;
}

var pd_top_form2 = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    fileUpload: true,
    autoScroll: true,
    labelWidth: 40,
    labelAlign: 'right',
    //		heigh : 500,
    autoWidth: true,
    items: [{
        xtype: "fieldset",
        title: "",
        style: {
            marginLeft: '4px',
            marginTop: '10px'
        },
        items: [ //third

            {
                width: 100,
                style: {
                    marginTop: '-7px'
                },
                buttons: [
                    /**{
                    							id : "btnsearch",
                    							text : "保 存",
                    							listeners : {
                    							click : function () {

                    							VerifyAction();
                    							}
                    							}

                    							}**/
                ]
            }
        ]
    }, {
        xtype: "fieldset",
        title: "员工基本信息表",
        //defaultType: 'textfield',
        defaults: {
            labelAlign: "right",
            width: 5
        },
        //bodyBorder:false,
        layout: "column",
        items: [
            //				{
            //						xtype : 'box',
            //						id : 'logoPicid',
            //						fieldLabel : '图片预览',
            //						width : 120,
            //						height : 168,
            //							style : {
            //									marginRight : '15px'

            //								},
            //						autoEl : {
            //							tag : 'img',
            //							width : 120,
            //							height : 168,
            //							id:"photo_area",
            //							src : '../Imgs/bg02.jpg',
            //							style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);'
            //						}

            //					},


            {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:320px;margin-bottom:30px;" ><font size="6">员工基本信息表</font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            },

            //								xtype : "label",
            //								html : '部门：',
            //								style : {
            //									marginTop : '3px',
            //									marginLeft : '55px'

            //								}
            //							}
            //							, {
            //								xtype : "textfield",
            //								readOnly : true,
            //								hideLabel : true,
            //								width:128,
            //								style : {
            //									marginLeft : '55px'
            //								},
            //								name : "Dept",
            //								anchor : "100%"
            //							},
            //							{
            //								xtype : "label",
            //								html : '性别：',
            //								style : {
            //									marginTop : '3px',
            //									marginLeft : '65px'

            //								}
            //							}
            //							, {
            //								xtype : "combo",
            //								name : "Sex",
            //								store : SexStore,
            //								displayField : "Title",
            //								valueField : "ID",
            //								editable : false,
            //								width : 60,
            //								triggerAction : 'all',
            //								mode : 'local',
            //								style : {
            //									marginLeft : '65px'

            //								}
            //							}
            {
                layout: "hbox",
                defaults: {
                    margins: '0 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '工  号：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "textfield",
                    width: 120,
                    readOnly: true,
                    name: "EmployeeCode",
                    //                            --------------------------------------------------------------------------------------------->
                    enableKeyEvents: true,
                    listeners: {
                        "keyup": function(v) {
                            if (Ext.util.Format.trim(v.getRawValue()).length == 8) {
                                var code = Ext.util.Format.trim(v.getRawValue());
                                pd_top_form2.getForm().reset();

                            } else {
                                //pd_top_form2.getForm().findField('EmployeeName').setValue("");
                                Ext.getCmp('btnsearch').setDisabled(true);
                            }
                        }
                    }

                    //								---------------------------------------------------------------------------------------------------->


                }, {
                    xtype: "label",
                    html: '姓  名：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    //								readOnly : true,
                    hideLabel: true,
                    width: 120,
                    readOnly: true,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "EmployeeName",
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>基本信息</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '0 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">性 别：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "Sex",
                    store: SexStore,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {}
                }, {
                    xtype: "label",
                    html: '<font color="red">籍 贯：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "Nvarchar1",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">婚 姻：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "Marriage",
                    store: hyStore,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {}
                }, {
                    xtype: "label",
                    html: '<font color="red">民 族：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "Nation",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">身份证号：</font>',
                    style: {
                        marginTop: '3px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "IdNo",
                    triggerAction: 'all',
                    mode: 'local',
                    //								regex:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    regex: /^(\d{18,18}|\d{15,15}|\d{17,17}(x|X))$/,
                    width: 270,
                    //								validator :checkIdcard,
                    listeners: {
                        blur: function() {
                            //在这里查数据
                            checkIdcard();
                        }
                    }
                    //								enableKeyEvents : true,
                    //								listeners : {
                    //									"keyup" : function (v) {
                    //									debugger;
                    //								            Ext.util.Format.trim(v.getRawValue());
                    //									}
                    //								}


                }, {
                    xtype: "label",
                    html: '<font color="red">政治面貌：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "Politics",
                    store: MmStore,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 125,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        marginLeft: '15px'
                    }
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>服装尺寸</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">身 高：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "numberfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    minValue: 90,
                    maxValue: 250,
                    width: 90,
                    name: "Height"
                }, {
                    xtype: "label",
                    html: '厘米',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'
                    }
                }, {
                    xtype: "label",
                    html: '<font color="red">体 重：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "numberfield",
                    minValue: 30,
                    maxValue: 150,
                    msgTarget: 'under',
                    allowBlank: false,
                    hideLabel: true,
                    width: 90,
                    style: {
                        //									marginLeft : '15px'
                    },
                    name: "Weight",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '公斤',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '西装尺寸：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "CoatSize",
                    store: CoatSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',

                    style: {}
                }, {
                    xtype: "label",
                    html: '衬衫尺寸：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "ShirtSize",
                    store: ShirtSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        marginLeft: '15px'

                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '裤子尺寸：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "TrousersSize",
                    store: TrousersSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        //									marginLeft : '55px'
                    }
                }, {
                    xtype: "label",
                    html: '裙子尺寸：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "SkirtSize",
                    store: SkirtSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',

                    style: {
                        marginLeft: '15px'

                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                        xtype: "label",
                        html: '鞋子尺寸：',
                        style: {
                            marginTop: '3px'

                        }
                    }, {
                        xtype: "combo",
                        msgTarget: 'under',
                        allowBlank: false,
                        name: "ShoesSize",
                        store: ShoesSizeStore,
                        displayField: "ID",
                        valueField: "Title",
                        editable: false,
                        width: 120,
                        triggerAction: 'all',
                        mode: 'local',
                        style: {
                            //									marginLeft : '10px'
                        },

                        anchor: "100%"
                    }

                ]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>联系方式</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">家庭电话：</font>',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    regex: /^\d+(-){0,1}\d+$/,
                    width: 120,
                    name: "FamilyPhone",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '<font color="red">手机号码：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    name: "Mobile",
                    triggerAction: 'all',
                    msgTarget: 'under',
                    allowBlank: false,
                    regex: /^[1]\d{10}$/,
                    mode: 'local',
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '<font color="red">现住地址：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    minLength: 5,
                    maxLength: 35,
                    allowBlank: false,
                    msgTarget: 'qtip',
                    blankText: '现在实际居住地址，例如：上海市普陀区绥德路650号1号楼8907室',
                    triggerAction: 'all',
                    mode: 'local',
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "PersonalAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '配偶姓名：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    width: 120,
                    name: "ConsortName",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '配偶电话：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    regex: /^\d+(-){0,1}\d+$/,
                    minlength: 8,
                    maxLength: 20,
                    hideLabel: true,
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "ConsortPhone",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '配偶住址：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    minLength: 5,
                    maxLength: 35,
                    //								readOnly : true,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "ConsortAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '父母姓名：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',

                    allowBlank: true,
                    minlength: 2,
                    maxLength: 9,
                    width: 120,
                    name: "ParentName",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '父母电话：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: true,
                    regex: /^\d+(-){0,1}\d+$/,
                    minlength: 8,
                    maxLength: 20,
                    hideLabel: true,
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "ParentPhone",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '父母地址：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: true,
                    minLength: 5,
                    maxLength: 35,
                    //								readOnly : true,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "ParentAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '亲属姓名：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    blankText: '用于紧急联系，请正确填写',

                    msgTarget: 'under',
                    allowBlank: true,
                    width: 120,
                    name: "KinName",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '亲属电话：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    blankText: '用于紧急联系，请正确填写',
                    regex: /^\d+(-){0,1}\d+$/,
                    minlength: 8,
                    maxLength: 20,
                    msgTarget: 'under',
                    allowBlank: true,
                    hideLabel: true,
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "KinPhone",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '亲属地址：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    minLength: 5,
                    maxLength: 35,
                    msgTarget: 'under',
                    allowBlank: true,
                    //	readOnly : true,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "KinAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>银行卡号</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '交通银行：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    name: "CommCardNo",
                    triggerAction: 'all',
                    mode: 'local',
                    regex: /^\d{10,22}$/,
                    regexText: '银行卡号必须为10~22的位数字',
                    width: 270,
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '中国银行：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    name: "BocCardNo",
                    triggerAction: 'all',
                    regex: /^\d{10,22}$/,
                    regexText: '银行卡号必须为10~22的位数字',
                    mode: 'local',
                    width: 270,
                    style: {
                        marginLeft: '15px'
                    },
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '招商银行：',
                    style: {
                        marginTop: '3px'
                    }
                }, {
                    xtype: "textfield",
                    name: "CmbCardNo",
                    triggerAction: 'all',
                    regex: /^\d{10,22}$/,
                    regexText: '银行卡号必须为10~22的位数字',
                    mode: 'local',
                    width: 270,
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>职业信息</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">星 级：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '56px'
                    }
                }, {
                    xtype: "combo",
                    name: "Rank",
                    store: RankStore,
                    msgTarget: 'under',
                    allowBlank: false,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        marginLeft: '56px'

                    }
                }, {
                    xtype: "label",
                    html: '最后特训期数：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '68px'
                    }
                }, {
                    xtype: "numberfield",
                    msgTarget: 'under',
                    allowBlank: true,
                    minValue: 1,
                    maxValue: 999,
                    name: "TrainPriod",
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',

                    style: {
                        marginLeft: '68px'

                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '入文峰学校日期：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //	msgTarget: 'under',
                    //  allowBlank: false,
                    width: 50,
                    name: "syear"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "smonth",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-40px'

                    }
                }, {
                    xtype: "label",
                    html: '<font color="red">入文峰门店日期：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-40px'
                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    msgTarget: 'under',
                    allowBlank: false,
                    width: 50,
                    name: "eyear",
                    style: {
                        marginLeft: '-40px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-55px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    msgTarget: 'under',
                    allowBlank: false,
                    width: 30,
                    name: "emonth",
                    style: {
                        marginLeft: '-70px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-80px'

                    }
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>学校记录</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<b>入学日期</b>',
                    style: {

                        marginLeft: '30px'
                    }
                }, {
                    xtype: "label",
                    html: '<b>毕业时间</b>',
                    style: {
                        marginLeft: '120px'
                    }
                }, {
                    xtype: "label",
                    html: '<b>班级</b>',
                    style: {
                        marginLeft: '195px'
                    }
                }]
            },

            //					1111111111111111111111111111111111111111111111111111111111111111111111

            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx1"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy1"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm1",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy1",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm1",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj1",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //					22222222222222222222222222222222222222222222222222222222222222
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx2"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy2"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm2",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy2",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm2",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj2",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							3333333333333333333333333333333333333333
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx3"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy3"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm3",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy3",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm3",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj3",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							444444444444444444444444444444444444444444444444444
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx4"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy4"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm4",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy4",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm4",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj4",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							555555555555555555555555555555555555555555555
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx5"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy5"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm5",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy5",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm5",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj5",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							6666666666666666666666666666666666666666666666
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx6"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy6"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm6",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy6",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm6",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj6",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							77777777777777777777777777777777777777777777777
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx7"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy7"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm7",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy7",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm7",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj7",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							888888888888888888888888888888888888888888888888
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx8"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy8"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm8",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy8",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm8",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj8",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							--------------------------------------------------------------------------------------

            {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>培训记录</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<b>特训期数</b>',
                    style: {

                        marginLeft: '30px'
                    }
                }]
            },

            //							1111111111111111111
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx1"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px1",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },

            //							22222222222222
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx2"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px2",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },

            //							333333333333333333
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx3"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px3",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							44444444444444444444
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx4"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px4",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							555555555555555555555555
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx5"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px5",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							666666666666666666666666

            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx6"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px6",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							7777777777777777777777777777
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx7"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px7",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							888888888888888888
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx8"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px8",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							99999999999999999999
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx9"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px9",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							10
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx10"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px10",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							11
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx11"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px11",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							12
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx12"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px12",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							13
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx13"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px13",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							14
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx14"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px14",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },

            //							-------------------------------------------------------------------------------------------------------------
            {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>调动记录</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [
                    //						 {
                    //								xtype : "numberfield",
                    //								width : 50,
                    //								hidden:true,
                    //								name : "dd1"
                    //							},
                    {
                        xtype: "label",
                        html: '<b>门店名称</b>',
                        style: {

                            marginLeft: '30px'
                        }
                    }, {
                        xtype: "label",
                        html: '<b>入店日期</b>',
                        style: {
                            marginLeft: '120px'
                        }
                    }, {
                        xtype: "label",
                        html: '<b>离店日期</b>',
                        style: {
                            marginLeft: '195px'
                        }
                    }, {
                        xtype: "label",
                        html: '<b>职位</b>',
                        style: {
                            marginLeft: '265px'
                        }
                    }
                ]
            },

            //							111111111111111111111
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd1"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId1",
                        width: 110

                    },
                    //						{
                    //									xtype : "combo",
                    //									name : "DeptId1",
                    //									hiddenName: "DeptId1",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    //										debugger;
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy1",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm1",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy1",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm1",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz1",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },

            //							222222222222222222
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd2"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId2",
                        width: 110

                    },
                    //						 {
                    //									xtype : "combo",
                    //									name : "DeptId2",
                    //									hiddenName: "DeptId2",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy2",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm2",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy2",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm2",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz2",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							3333333333333333333333333333333
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd3"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId3",
                        width: 110

                    },
                    //						 {
                    //									xtype : "combo",
                    //									name : "DeptId3",
                    //									hiddenName: "DeptId3",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy3",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm3",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy3",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm3",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz3",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							444444444444444444444444444444444
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd4"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId4",
                        width: 110

                    },
                    //						 {
                    //									xtype : "combo",
                    //									name : "DeptId4",
                    //									hiddenName: "DeptId4",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy4",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm4",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy4",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm4",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz4",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							55555555555555555555555555
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd5"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId5",
                        width: 110

                    },
                    //						{
                    //									xtype : "combo",
                    //									name : "DeptId5",
                    //									hiddenName: "DeptId5",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy5",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm5",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy5",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm5",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz5",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							666666666666666666666666666
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd6"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId6",
                        width: 110

                    },
                    //						{
                    //									xtype : "combo",
                    //									name : "DeptId6",
                    //									hiddenName: "DeptId6",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy6",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm6",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy6",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm6",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz6",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							7777777777777777777777777777777777
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd7"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId7",
                        width: 110

                    },
                    //						 {
                    //									xtype : "combo",
                    //									name : "DeptId7",
                    //									hiddenName: "DeptId7",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy7",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm7",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy7",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm7",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz7",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							888888888888888888888888
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd8"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId8",
                        width: 110

                    },
                    //						{
                    //									xtype : "combo",
                    //									name : "DeptId8",
                    //									hiddenName: "DeptId8",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy8",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm8",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy8",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm8",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        name: "zz8",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							9999999999999999999999999999
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd9"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId9",
                        width: 110

                    },
                    //						 {
                    //									xtype : "combo",
                    //									name : "DeptId9",
                    //									hiddenName: "DeptId9",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //								},
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy9",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm9",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy9",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm9",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                                 readOnly:true,
                        name: "zz9",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },
            //							10
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd10"
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "DeptId10",
                        width: 110

                    },
                    //						 {
                    //									xtype : "combo",
                    //									name : "DeptId10",
                    //									hiddenName: "DeptId10",
                    //									store : tar_dept,
                    //									triggerAction: 'all',
                    //									width : 110,
                    //									border : 1,
                    //									valueField : 'ID',
                    //									displayField : 'CombineWord',
                    //									enableKeyEvents : true,
                    //									selectOnFocus : true,
                    //									allowBlank : true,
                    //									forceSelection : true,
                    //									hideTrigger : true,
                    //									listeners : {
                    //										'select':function(){
                    ////										++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //										},
                    //
                    //									   "keyup": function (v) {
                    //											var value = v.getRawValue();
                    //											if(value!= null && value.length >=1) {
                    //												tar_dept.load({
                    //
                    //													params: { key: v.getRawValue() }
                    //												});
                    //											}
                    //										},
                    //										'specialkey' : function (_field, _e) {
                    //
                    //											if (_e.getKey() == _e.ENTER) {
                    //
                    //											}
                    //										}
                    //									}
                    //					            },
                    {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy10",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm10",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy10",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm10",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        //                               readOnly:true,
                        name: "zz10",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            }

        ]
    }]

});

//
//    var studentscm = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
////                      new Ext.grid.RowNumberer(),                     //自动编号。
//                     //sm,//复选框。
//                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
//				     { header: '<b>入学日期</b>', align: "center", width:150, dataIndex: 'one' ,editor:true},
//                     { header: '<b>毕业日期</b>', align: "center",width:150, dataIndex: 'two' ,editor:true},
//				     { header: '<b>班级</b>', align: "center",width:200, dataIndex: 'three',editor:true },
//            ]);
//
//      var studentssm = new Ext.grid.CheckboxSelectionModel();
//
//      var students_store = new Ext.data.ArrayStore({
//		fields : ['ID', 'one','two','three'],
//		data : [
//			["1","2014-10-01", "2018-07-01","文峰1号"],
//			["2","2014-10-01", "2018-07-01","文峰2号"],
//			["3","2014-10-01", "2018-07-01","文峰3号"],
//			["4","2014-10-01", "2018-07-01","文峰4号"],
//			["5","2014-10-01", "2018-07-01","文峰5号"],
//			["6","2014-10-01", "2018-07-01","文峰6号"],
//			["7","2014-10-01", "2018-07-01","文峰7号"],
//			["8","2014-10-01", "2018-07-01","文峰8号"]
//		]

//	});
//
//     //显示内容
//    var studentsDetails = new Ext.grid.EditorGridPanel({
//			store : students_store,
//			title:'学校记录',
//			    cm :studentscm,
//				sm : studentssm,
//			  stripeRows:true,
//                border:true,
//                collapsible: true,
//                autoScroll: true,
//                height: 250,
//			//selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
//			//sm: sm,
////			loadMask : true,
//		});

//
//
//
//	    var peixuncm = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
////                      new Ext.grid.RowNumberer(),                     //自动编号。
//                     //sm,//复选框。
//                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
//				     { header: '<b>特训期数</b>', align: "center", width:150, dataIndex: 'one' ,editor:true }
//            ]);
//
//
//     var peixun_store = new Ext.data.ArrayStore({
//		fields : ['ID', 'one'],
//		data : [
//			["1","2014-10-01" ],
//			["2","2014-10-02" ],
//			["3","2014-10-03" ],
//			["4","2014-10-04" ],
//			["5","2014-10-05" ],
//			["6","2014-10-06" ],
//			["7","2014-10-07" ],
//			["8","2014-10-08"],
//			["9","2014-10-09" ],
//			["10","2014-10-10" ],
//			["11","2014-10-11" ],
//			["12","2014-10-12" ],
//			["13","2014-10-13" ],
//			["14","2014-10-14" ]
//		]

//	});
//
//
//      var peixunsm = new Ext.grid.CheckboxSelectionModel();
//     //显示内容
//    var peixunDetails = new Ext.grid.EditorGridPanel({
//			store : peixun_store,
//			title:'培训记录',
//			    cm : peixuncm,
//				sm : peixunsm,
//			  stripeRows:true,
//                border:true,
//                collapsible: true,
//                autoScroll: true,
//                   height: 380,
//		});
//
//
//
//
//	    var diaodongcm = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
////                      new Ext.grid.RowNumberer(),                     //自动编号。
//                     //sm,//复选框。
//                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
//				     { header: '<b>门店名称</b>', align: "center", width:150, dataIndex: 'one' ,editor : true
//                     },
//
//                     { header: '<b>入店日期</b>', align: "center",width:150, dataIndex: 'two' ,
//                                editor : true},
//
//				                 { header: '<b>离店日期</b>', align: "center",width:150, dataIndex: 'three' ,
//                                editor : true},
//
//				                     { header: '<b>职务</b>', align: "center",width:150, dataIndex: 'four' ,editor : true},
//
//            ]);
//
//      var diaodongsm = new Ext.grid.CheckboxSelectionModel();
//
//      var diaodong_store = new Ext.data.ArrayStore({
//		fields : ['ID', 'one','two','three','four'],
//		data : [
//		    ["1","文峰1号","2014-10-01", "2018-07-01","主管"],
//			["2","文峰2号","2014-10-01", "2018-07-01","主管"],
//			["3","文峰3号","2014-10-01", "2018-07-01","主管"],
//			["4","文峰4号","2014-10-01", "2018-07-01","主管"],
//			["5","文峰5号","2014-10-01", "2018-07-01","主管"],
//			["6","文峰6号","2014-10-01", "2018-07-01","主管"],
//			["7","文峰7号","2014-10-01", "2018-07-01","主管"],
//			["8","文峰8号","2014-10-01", "2018-07-01","主管"],
//			["9","文峰9号","2014-10-01", "2018-07-01","主管"],
//			["10","文峰10号","2014-10-01", "2018-07-01","主管"]
//		]

//	});
//     //显示内容
//    var diaodongDetails = new Ext.grid.EditorGridPanel({
//			store : diaodong_store,
//			title:'调动记录',
//			    cm : diaodongcm,
//				sm : diaodongsm,
//			  stripeRows:true,
//                border:true,
//                collapsible: true,
//                autoScroll: true,
//                   height: 300,
//		});
//

//var sm = new Ext.grid.CheckboxSelectionModel();
//var cm = new Ext.grid.ColumnModel({
//		defaults : {
//			sortable : false,
//			menuDisabled : true,
//			multiSelect : true
//		},
//		columns : [new Ext.grid.RowNumberer(), {
//				header : 'ID',
//				dataIndex : 'ID',
//				hidden : true,
//				width : 100
//			},
//			{
//				header : '<font style="font-weight:bold;">员工照片</font>',
//				dataIndex : 'photo',
//				width : 150,
//				renderer : function (value) {
//					return "<img src='" + value + "' width='150'/>";
//				}
//			},
//			{
//				header : "<font style=\"font-weight:bold;\">工号</font>",
//				dataIndex : "EmployeeCode",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">姓名</font>",
//				dataIndex : "EmployeeName",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">身高（CM）</font>",
//				dataIndex : "Height",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">体重（CM）</font>",
//				dataIndex : "Weight",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">西服</font>",
//				dataIndex : "CoatSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">西裤</font>",
//				dataIndex : "TrousersSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">短袖衫</font>",
//				dataIndex : "ShirtSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">红色裙子</font>",
//				dataIndex : "SkirtSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">皮鞋</font>",
//				dataIndex : "ShoesSize",
//				width : 120
//			}

//		]
//	});

// create the Data Store
//var pd_store = new Ext.data.Store({
//		autoDestroy : true,
//		autoLoad : true,
//		url : '../Apis/EmpInfoMgr.aspx?actionName=queryEmployee&sid=' + Sys.sid,
//		reader : new Ext.data.JsonReader({
//			record : 'MakeupInfo',
//			idProperty : 'ID',
//			root : 'results',
//			totalProperty : 'totalCount',
//			fields : [{
//					name : "ID",
//				}, {
//					name : "EmployeeCode"
//				}, {
//					name : "EmployeeName"
//				}, {
//					name : "Height"
//				}, {
//					name : "Weight"
//				}, {
//					name : "CoatSize"
//				}, {
//					name : "TrousersSize"
//				}, {
//					name : "ShirtSize"
//				}, {
//					name : "SkirtSize"
//				}, {
//					name : "ShoesSize"
//				}, {
//					name : "photo"
//				}
//			]
//		})
//	});

//var pd_grid = new Ext.grid.GridPanel({
//		store : pd_store,
//		cm : cm,
//		columnLines : true,
//		sm : sm,
//		margins : "2 2 2 2",
//		border : false,
//		loadMask : true,
//		bbar : new Ext.PagingToolbar({
//			pageSize : 40,
//			store : pd_store,
//			displayInfo : true,
//			displayMsg : '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
//			emptyMsg : "没有记录"
//		})
//	});

//pd_store.on('beforeload', function (thiz, options) {
//	this.baseParams.start = 0;
//	this.baseParams.limit = 40;
//});

function VerifyAction() {

        var 姓名 = pd_top_form2.getForm().findField('EmployeeName').getValue();
        var 民族 = pd_top_form2.getForm().findField('Nation').getValue();
        var 籍贯 = pd_top_form2.getForm().findField('Nvarchar1').getValue();
        var 身份证号 = pd_top_form2.getForm().findField('IdNo').getValue();
        var 身高 = pd_top_form2.getForm().findField('Height').getValue();
        var 体重 = pd_top_form2.getForm().findField('Weight').getValue();
        var 家庭电话 = pd_top_form2.getForm().findField('FamilyPhone').getValue();
        var 手机号码 = pd_top_form2.getForm().findField('Mobile').getValue();
        var 现住地址 = pd_top_form2.getForm().findField('PersonalAddress').getValue();
        var 父母姓名 = pd_top_form2.getForm().findField('ParentName').getValue();
        var 父母电话 = pd_top_form2.getForm().findField('ParentPhone').getValue();
        var 父母地址 = pd_top_form2.getForm().findField('ParentAddress').getValue();
        var 亲属姓名 = pd_top_form2.getForm().findField('KinName').getValue();
        var 亲属电话 = pd_top_form2.getForm().findField('KinPhone').getValue();
        var 亲属地址 = pd_top_form2.getForm().findField('KinAddress').getValue();
        var 最后特训期数 = pd_top_form2.getForm().findField('TrainPriod').getValue();
        var 入文峰门店年 = pd_top_form2.getForm().findField('eyear').getValue();
        var 入文峰门店月 = pd_top_form2.getForm().findField('emonth').getValue();

        if (姓名 == null || 姓名 == "") {
            Ext.Msg.alert("提示", "请填写姓名!");
            return;
        }
        if (籍贯 == null || 籍贯 == "") {
            Ext.Msg.alert("提示", "请填写籍贯!");
            return;
        }
        if (民族 == null || 民族 == "") {
            Ext.Msg.alert("提示", "请填写民族!");
            return;
        }
        if (身份证号 == null || 身份证号 == "") {
            Ext.Msg.alert("提示", "请填写身份证号!");
            return;
        }
        if (身高 == null || 身高 == "") {
            Ext.Msg.alert("提示", "请填写身高!");
            return;
        }

        if (体重 == null || 体重 == "") {
            Ext.Msg.alert("提示", "请填写体重!");
            return;
        }
        if (家庭电话 == null || 家庭电话 == "") {
            Ext.Msg.alert("提示", "请填写家庭电话!");
            return;
        }
        if (手机号码 == null || 手机号码 == "") {
            Ext.Msg.alert("提示", "请填写手机号码!");
            return;
        }
        if (现住地址 == null || 现住地址 == "") {
            Ext.Msg.alert("提示", "请填写现住地址!");
            return;
        }
        if (父母姓名 == null || 父母姓名 == "") {
            //Ext.Msg.alert("提示", "请填写父母姓名!");
            //return;
        }
        if (父母电话 == null || 父母电话 == "") {
            //Ext.Msg.alert("提示", "请填写父母电话!");
            //return;
        }
        if (父母地址 == null || 父母地址 == "") {
            //Ext.Msg.alert("提示", "请填写父母地址!");
            //return;
        }
        if (亲属姓名 == null || 亲属姓名 == "") {
            //Ext.Msg.alert("提示", "请填写亲属姓名!");
            ///return;
        }
        if (亲属电话 == null || 亲属电话 == "") {
            //Ext.Msg.alert("提示", "请填写亲属电话!");
            //return;
        }
        if (亲属地址 == null || 亲属地址 == "") {
            //Ext.Msg.alert("提示", "请填写亲属地址!");
            //return;
        }
        if (最后特训期数 == null || 最后特训期数 == "") {
            //Ext.Msg.alert("提示", "请填写最后特训期数!");
            //return;
        }
        if (入文峰门店年 == null || 入文峰门店年 == "") {
            Ext.Msg.alert("提示", "请填写入文峰门店年!");
            return;
        }
        if (入文峰门店月 == null || 入文峰门店月 == "") {
            Ext.Msg.alert("提示", "请填写入文峰门店月!");
            return;
        }

        //                                                            pd_top_form2.getForm().findField('Marriage').getValue();
        //															pd_top_form2.getForm().findField('Politics').getValue();
        //													        pd_top_form2.getForm().findField('ConsortName').getValue();
        //                                                            pd_top_form2.getForm().findField('ConsortPhone').getValue();
        //                                                            pd_top_form2.getForm().findField('ConsortAddress').getValue();
        //															pd_top_form2.getForm().findField('CoatSize').getValue();
        //															pd_top_form2.getForm().findField('TrousersSize').getValue();
        //															pd_top_form2.getForm().findField('ShirtSize').getValue();
        //															pd_top_form2.getForm().findField('SkirtSize').getValue();
        //															pd_top_form2.getForm().findField('ShoesSize').getValue();
        //															pd_top_form2.getForm().findField('CommCardNo').getValue();
        //															pd_top_form2.getForm().findField('BocCardNo').getValue();
        //															pd_top_form2.getForm().findField('CmbCardNo').getValue();
        //															pd_top_form2.getForm().findField('Sex').getValue();
        //
        //															pd_top_form2.getForm().findField('Rank').getValue();


        if (pd_top_form2.form.isValid()) {

            if (checkIdcard()) {

                if (pd_top_form2.getForm().findField('Marriage').getValue() == "已婚") {
                    if (pd_top_form2.getForm().findField('ConsortName').getValue() == "" || pd_top_form2.getForm().findField('ConsortPhone').getValue() == "" || pd_top_form2.getForm().findField('ConsortAddress').getValue() == "") {
                        Ext.Msg.alert("提示", "请填写配偶信息!");
                        return;
                    }
                }

                pd_top_form2.getForm().submit({
                    waitMsg: "正在提交，请稍候...",
                    url: "../Apis/EmpInfoMgr.aspx?sid=" + Sys.sid + '&actionName=newUpload',
                    success: function(from, action) {

                        //			pd_store.load();

                    },
                    failure: function(form, action) {
                        if (action.result != null && typeof(action.result) != "undefined") {
                            Ext.Msg.alert("提示", action.result.msg);
                        } else {
                            Ext.Msg.alert("提示", "提交失败，请重试");
                        }

                    }
                });
            }
        }
    }
    //主容器

var pd_main_panel2 = new Ext.Panel({
    border: false,
    autoScroll: true,
    items: [{
        frame: true,
        region: 'north',
        height: "auto",

        layout: "fit",
        border: false,
        items: [pd_top_form2]
    }, {
        layout: "fit",
        region: 'center',
        border: false,
        anchor: '-1 -140',
        items: []
    }]
});

//centerPanel.add(pd_main_panel2);
//centerPanel.doLayout();
/**
var photoWindow = new Ext.Window({
layout : 'fit',
width : 1100,
height : 500,
modal : true,
closeAction : 'hide',
title : "填写员工信息",
plain : true,
items : [pd_top_form2]
});

function showPhotoWoindow() {
photoWindow.show();
pd_top_form2.getForm().isValid();
}**/

var setAttendanceLevel = function() {
    //Ext.getCmp('btnsearch').setDisabled(true);
    pd_top_form2.getForm().findField('Sex').setValue("男");
    pd_top_form2.getForm().findField('Rank').setValue("无");
    pd_top_form2.getForm().findField('Marriage').setValue("未婚");
    pd_top_form2.getForm().findField('Politics').setValue("普通居民（群众）");

    pd_top_form2.getForm().findField('CoatSize').setValue("无");
    pd_top_form2.getForm().findField('ShirtSize').setValue("无");
    pd_top_form2.getForm().findField('TrousersSize').setValue("无");
    pd_top_form2.getForm().findField('SkirtSize').setValue("无");
    pd_top_form2.getForm().findField('ShoesSize').setValue("无");

}
setAttendanceLevel();

function getTimeStamp() {
    // 声明变量。
    var d,
        s;
    // 创建 Date 对象。
    d = new Date();
    s = d.getFullYear();
    s += ("0" + (d.getMonth() + 1)).slice(-2);
    s += ("0" + d.getDate()).slice(-2);
    s += ("0" + d.getHours()).slice(-2);
    s += ("0" + d.getMinutes()).slice(-2);
    s += ("0" + d.getSeconds()).slice(-2);
    s += ("00" + d.getMilliseconds()).slice(-3);
    return s;
}
