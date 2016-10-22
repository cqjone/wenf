//补录
//过滤特殊字符

var tar_employee = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/BaseInfoUtil.aspx?actionName=getEmployee&match_all=true&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [
			        {name : "CombineWord",mapping : "CombineWord"}, 
			        {name : "ID",mapping : "ID"},
					{name : "Code",mapping : "Code"}
			]
		}),
		sortInfo: {field: 'CombineWord',direction:'ASC'}
	});
	
	
function CheckHTML(Str) {
    try {
        var S = Str;
        var regS = new RegExp("\\<", "g");
        var regS1 = new RegExp("\\>", "g");
        var regS2 = new RegExp("\r", "g");
        var regS3 = new RegExp("\n", "g");
        S = S.replace(regS, "&lt").replace(regS1, "&gt").replace(regS2, "").replace(regS3, "");
        return S;
    }
    catch (e) {
        return '';
    }
}
//获取当月天数
function getLastDay(year, month) {
    var new_year = year;    //取当前的年份         
    var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）         
    if (month > 12)            //如果当前大于12月，则年份转到下一年         
    {
        new_month -= 12;        //月份减         
        new_year++;            //年份增         
    }
    var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天         
    var date_count = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月的天数       
    return date_count;
}

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
var daylist = [];
var dayCounts = getLastDay(newyear, new Date().getMonth() + 1)
for (var j = 1; j <= dayCounts; j++) {
    daylist.push([j, j]);
}
var dayModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: []
});
this.dayModelStore.loadData(daylist);
var monthModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            ["10", "10"],
            ["11", "11"],
            ["12", "12"]]
});
var hourModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            ["10", "10"],
            ["11", "11"],
            ["12", "12"], 
            ["13", "13"],
            ["14", "14"],
            ["15", "15"],
            ["16", "16"],
            ["17", "17"],
            ["18", "18"],
            ["19", "19"],
            ["20", "20"],
            ["21", "21"],
            ["22", "22"],
            ["23", "23"],
            ["24", "24"]]
});

var minuteModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["0", "0"],
            ["10", "10"],
            ["20", "20"],
            ["30", "30"],
            ["40", "40"],
            ["50", "50"]]
});

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 40,
    labelAlign: 'right',
    heigh: 110,
    autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "考勤补录",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 5 },
        //bodyBorder:false,
        layout: "column",
         items: [{
            layout: "hbox",
            defaults: { margins: '0 5 0 0' },
            columnWidth: 1,
            items: [{
                xtype: "combo",
                name: "comboYear",
                store: yearModelStore,
                hiddenName: "comboYear",
                width:50,
                mode: 'local',
                triggerAction: 'all',
                valueField: 'ID',
                displayField: 'Title',
                editable: false,
                readOnly: true
            } ,{
                xtype: "label",
                html: '年',
                style: {
                    marginTop: '3px',
                    marginLeft: '5px'
                }
            },{
                xtype: "combo",
                hiddenName: "comboMonth",
                store: monthModelStore,
                name: "comboMonth",
                style: {
                    marginLeft: '10px'
                },
                hideLabel: true,
                editable: false,
                width:40,
                mode: 'local',
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all",
                readOnly: true
            },{
                xtype: "label",
                html: '月',
                style: {
                    marginTop: '3px',
                    marginLeft: '15px'
                }
            },{
                xtype: "combo",
                hiddenName: "comboDay",
                store: dayModelStore,
                name: "comboDay",
                editable: false,
                hideLabel: true,
                width:50,
                style: {
                    marginLeft: '20px'
                },
                mode: 'local',
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all"
            },{
                    xtype: "label",
                    html: '日',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
            },{
                xtype: "combo",
                hiddenName: "comboHour",
                store: hourModelStore,
                name: "comboHour",
                editable: false,
                style: {
                    marginLeft: '25px'
                },
                width:50,
                hideLabel: true,
                mode: 'local',
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all"
            },{
                    xtype: "label",
                    html: '时',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
            },{
                xtype: "combo",
                hiddenName: "comboMinute",
                store: minuteModelStore,
                name: "comboMinute", 	
                style: {
                    marginLeft: '40px'
                },
                width:50,
                hideLabel: true,
                mode: 'local',
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all"
            },{
				xtype: "label",
				html: '分',
				style: {
					marginTop: '3px',
					marginLeft: '45px'
				}
            },{
                    xtype: "label",
                    html: '员   工：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '60px'
                    }
            }, {
				xtype : "combo",
				name : "EmployeeCode",
				hiddenName: "EmployeeCode",
				store : tar_employee,
				triggerAction: 'query',
				width : 130,
				border : 1,
				valueField : 'ID',
				displayField : 'CombineWord',
				enableKeyEvents : true,
				selectOnFocus : false,
				allowBlank : true,
				forceSelection : false,
				hideTrigger : true,
				listeners : {									
				  'specialkey' : function (_field, _e) {
						if (_e.getKey() == _e.ENTER) {
							var EmployeeID = pd_top_form.find("name", "EmployeeCode")[0].getValue();
							if(EmployeeID!=null && EmployeeID!=""){
								pd_top_form.find("name", "AuthorCode")[0].focus(false, 100);
							}
							
						}
					},
				   "keyup": function (v) {
						var value = v.getRawValue();
							tar_employee.load({
									params: { key: v.getRawValue() }
								});
								Ext.getCmp('btnAdd').setDisabled(false);
					}
				},
				style : {
					 marginLeft: '65px'

				}
			}]
        }, {
            columnWidth: 1,
            layout:'hbox',
			style: {
				marginTop: '5px'
			},
            items: [
					{
						xtype: "label",
						html: '授权码：',
						style: {
							marginTop: '3px'
						}
					},
					{
						xtype: "textfield",
						name: "AuthorCode",
						width:100,
						listeners : {									
						  'specialkey' : function (_field, _e) {
								if (_e.getKey() == _e.ENTER) {
									pd_top_form.find("name", "Reason")[0].focus(false, 100);
								}
							}
						   
						},
						style: {
							marginLeft: '5px'
						}
					},
					{
						xtype: "label",
						html: '理  由：',
						style: {
							marginTop: '5px',
							marginLeft: '30px'
						}
					},
					{
						xtype: "textfield",
						name: "Reason",
						width:364,
						listeners : {									
						  'specialkey' : function (_field, _e) {
								if (_e.getKey() == _e.ENTER) {
									AddData();
								}
							}
						   
						},
						style: {
							marginLeft: '35px'
						}
					}, 
					{
						xtype: "button",
						boxMinWidth: 40,
						id: 'btnAdd',
						disabled: true,
						style: "margin-left:50px",
						width: 60,
						text: " 添  加",
						handler: function () {
							AddData();
						}
				}]
        }]
    }]
});
pd_top_form.getForm().findField('comboYear').setValue(newyear);
pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);
pd_top_form.getForm().findField('comboDay').setValue(new Date().getDate());
pd_top_form.getForm().findField('comboHour').setValue(new Date().getHours());
pd_top_form.getForm().findField('comboMinute').setValue(0);
var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [new Ext.grid.RowNumberer(), {
        header: 'ID',
        dataIndex: 'ID',
        hidden: true,
        width: 100
    }, {
        header: '日期',
        dataIndex: 'CheckinDate',
        width: 100
       
    }, {
        header: '时间',
        dataIndex: 'CheckinTime',
        width: 100
        
    }, {
        header: "状态",
        dataIndex: "RecordMode",
        width: 120,
        renderer: function (value, metadata, record, rowIndex) {
            if (value == 1) {
                return "手工补录";
            } else if (value == 0) {
                return "拍照签到";
            }
        }
    }, {
        header: "工号",
        dataIndex: "EmployeeCode",
        width: 120
    }, {
        header: "姓名",
        dataIndex: "EmployeeName",
        width: 120
    }, {
        header: "理由",
        dataIndex: "Reason",
        width: 460
    }, {
        header: '操作',
        dataIndex: "RecordModeDel",
        width: 50,
        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 1) {
                return "<a href='#' onclick='RecordModeDel(" + rowIndex + ");'>删除</a> ";
            }
            return "";
        }
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=queryMakeup&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        record: 'MakeupInfo',
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "ID", mapping: "ID" },
                { name: 'CheckinDate', mapping: 'CheckinDate' },
                { name: 'CheckinTime', mapping: 'CheckinTime' },
                { name: 'RecordMode', mapping: 'RecordMode' },
                { name: "EmployeeCode", mapping: "EmployeeCode" },
                { name: "EmployeeName", mapping: "EmployeeName" },
                { name: "Reason", mapping: "Reason" },
                { name: "RecordModeDel", mapping: "RecordModeDel" }
            ]
    })
});


var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    columnLines:true,
    sm: sm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true
    /**bbar: new Ext.PagingToolbar({
        pageSize: 20,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })**/
});


/**pd_store.on('beforeload', function (thiz, options) {
    this.baseParams.start = 0;
    this.baseParams.limit = 20;
});**/

function RecordModeDel(index) {
    var records = pd_grid.getStore().getAt(index);
    var ID = records.get('ID');
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>删除吗？</font>", function (btn) {
        if (btn == 'yes') {
            Ext.Ajax.request({
                url: '../Apis/AttendanceMgr.aspx?actionName=makeupDel&sid=' + Sys.sid,
                params: { ID: ID },
                success: function (response, option) {
                    var rs = Ext.decode(response.responseText);
                    if (rs.success) {
                        pd_store.load();
                    } else {
                        Ext.MessageBox.alert("提示", rs.msg);
                    }
                },
                failure: function () {
                    Ext.MessageBox.alert("提示", "获取员工姓名异常!");
                }
            });
        }
    });
}

function AddData() {
    var EmployeeID = pd_top_form.find("name", "EmployeeCode")[0].getValue();
	var index = tar_employee.find('ID',EmployeeID);
	var record = tar_employee.getAt(index);
	if(record == null || typeof(record)=="undefined"){
		Ext.MessageBox.alert("提示", "请选择员工!");
		return;
	}
	var EmployeeCode = record.data.Code
	var searchYear = pd_top_form.getForm().findField('comboYear').value;
    var searchMonth = pd_top_form.getForm().findField('comboMonth').value;
    var searchDay = pd_top_form.getForm().findField('comboDay').value;
    var searchHour = pd_top_form.getForm().findField('comboHour').value;
    var searchMinute = pd_top_form.getForm().findField('comboMinute').value;
	
    
    var Reason = CheckHTML(Ext.util.Format.trim(pd_top_form.getForm().findField('Reason').getValue()));
	var AuthorCode = CheckHTML(Ext.util.Format.trim(pd_top_form.getForm().findField('AuthorCode').getValue()));
	var reg = /^\d{4}$/;
	if(AuthorCode == "")
	{
		Ext.MessageBox.alert("提示", "请填写验证码!");
		return;
	}
	if(!reg.test(AuthorCode)){
		Ext.MessageBox.alert("提示", "验证码必须为四位数字!");
		return;
	}
	
	
	if(Reason == "")
	{
		Ext.MessageBox.alert("提示", "请填写理由!");
		return;
	}
	
    Ext.Ajax.request({
        url: '../Apis/AttendanceMgr.aspx?actionName=makeupAdd&sid=' + Sys.sid,
        params: { searchYear: searchYear, searchMonth: searchMonth, searchDay: searchDay, searchHour: searchHour, searchMinute: searchMinute,EmployeeCode: EmployeeCode,AuthorCode:AuthorCode, Reason: Reason },
        success: function (response, option) {
            var rs = Ext.decode(response.responseText);
            if (rs.success) {
                pd_store.load();
                pd_top_form.getForm().findField('comboYear').setValue(newyear);
                pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);
                pd_top_form.getForm().findField('comboDay').setValue(new Date().getDate());
                pd_top_form.getForm().findField('comboHour').setValue(new Date().getHours());
                pd_top_form.getForm().findField('comboMinute').setValue(0);
                //pd_top_form.getForm().findField('EmployeeCode').setValue("");
                //pd_top_form.getForm().findField('EmployeeName').setValue("");
				pd_top_form.getForm().findField('EmployeeCode').setValue("");
                pd_top_form.getForm().findField('Reason').setValue("");
				pd_top_form.getForm().findField('AuthorCode').setValue("");
            } else {
                Ext.MessageBox.alert("提示", rs.msg);
            }
        },
        failure: function () {
            Ext.MessageBox.alert("提示", "补录异常!");
        }
    });
}
//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height:115,
        layout: "fit",
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        region:'center',
        border: false,
        anchor: '-1 -140',
        items: [pd_grid]
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();
