
//全局变量
   
 
	var NowYear = "";
	var NowMonth ="";
	var NowDepID="";
    var NowEmpID="";
    
  
    
//补录
var tar_employee = new Ext.data.Store({
		autoDestroy : true,
		autoLoad:false,
		url : '../Apis/BaseInfoUtil.aspx?actionName=getEmployee&match_all=true&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [
			        {name : "CombineWord",mapping : "CombineWord"}, 
			        {name : "ID",mapping : "ID"}
			]
		}),
		sortInfo: {field: 'CombineWord',direction:'ASC'}
	});

var period_store = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:false,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getPeriod&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
		]
	}),
	sortInfo: {field: 'Value',direction:'desc'}
});
period_store.load();
	
function arrayToJson(o) {
    var r = [];
    if (typeof o == "string") return "\'" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\'";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push(i + ":" + arrayToJson(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(arrayToJson(o[i]));
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
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


var dayStatusStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [["1", "上班"],
            ["2", "休息"],
            ["3", "请假"]]
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

 //门店信息下拉框
  var tar_dept = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/CashierSetting.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'}
});
//员工信息下拉数据
var tar_employee = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/CashierSetting.aspx?char_length=3&actionName=getEmployee&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'}
});

var period_store = new Ext.data.Store({
	autoDestroy : true,
	 url : '../Apis/AttendanceMgr.aspx?actionName=getsixDate&sid=' + Sys.sid,
	    reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
	        	]
	        }),
	        sortInfo: {field: 'Value',direction:'desc'}
        });
    period_store.load();
    
    

    
var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 50,
    labelAlign: 'right',

    //autoWidth:true,
    items: [ {
		         

					xtype : "fieldset",
					title : "注意事项",
					style : {
						marginLeft : '4px',
						marginTop : '10px'
					},
					items : [//third
								
								{
									items:[
										{
											xtype : "label",
											html : '<font style="color:red;">1、日期为必选项,选择日期后，查询按钮自动显示可用.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										},	{
											xtype : "label",
											html : '<br><font style="color:red;">&nbsp;2、日期为当前月的前5个月.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								}
							
						]							
				},{
        xtype: "fieldset",
        title: "门店查询",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 50 },
        //bodyBorder:false,
        layout: "column",
       items : [                             {
            	                        layout : 'form',
            						    columnWidth : 0.23,
            						    items : [{
                                xtype: "combo",
                             fieldLabel : "日 期",
                                name: "comboPeriod",
                                store: period_store,
                                id:"comboPeriod",
                                hiddenName: "comboPeriod",
                                width: 150,
                                margin: '0 0 0 20',
                                mode: 'local',
//                              mode: 'remote',
                                triggerAction: 'all',
                                valueField: 'Value',
                                displayField: 'Title',
                                editable: false,
					            forceSelection :true,
					            triggerAction: "all",
								listeners : {									
										'select':function(){
										 var period = pd_top_form.find("name", "comboPeriod")[0].getValue();
							                if(period!= null && typeof(period)!="undefined"){
								                var arr = period.split("-");
								                 NowYear = arr[0];
								                 NowMonth = arr[1];
								              Ext.getCmp("btnSel").setDisabled(false);
							              	}
										}
									},
								style : {
												marginLeft : '3px'
										}
							}
							]
							}
							,{
            	                        layout : 'form',
            						    columnWidth : 0.23,
            						    items : [{
            								xtype : "combo",
            								name : "DeptID",
            								hiddenName : "DeptID",
            								fieldLabel : "门 店",
            								store : tar_dept,
            								triggerAction : 'all',
            								width : 170,
            								border : 1,
            								valueField : 'ID',
            								displayField : 'CombineWord',
            								enableKeyEvents : true,
            								selectOnFocus : true,
            								allowBlank : true,
            								forceSelection : true,
            								hideTrigger : true,
            								listeners : {
            									"keyup" : function (v) {
            										var value = v.getRawValue();
            										if (value != null && value.length >= 1) {
            											tar_dept.load({
            												params : {
            													key : value
            												}
            											});

            										}
            									}
            								},
            								style : {
            									marginLeft : '3px'

            								}
            							}
            						]
            					},{
            	                    layout : 'form',
            						columnWidth : 0.23,
            						items : [{
            								xtype : "combo",
            								name : "EmpID",
            								hiddenName : "EmpID",
            								fieldLabel : "员 工",
            								store : tar_employee,
            								triggerAction : 'all',
            								width : 170,
            								border : 1,
            								valueField : 'ID',
            								displayField : 'CombineWord',
            								enableKeyEvents : true,
            								selectOnFocus : true,
            								allowBlank : true,
            								forceSelection : true,
            								hideTrigger : true,
            								listeners : {
            									"keyup" : function (v) {
            										var value = v.getRawValue();
            										if (value != null && value.length >= 1) {
            											tar_dept.load({
            												params : {
            													key : value
            												}
            											});

            										}
            									}
            								},
            								style : {
            									marginLeft : '3px'

            								}
            							}
            						]
            					}, {
            						width : 100,
            						style : {

            							marginTop : '-7px'
            						},
            						buttons : [{
            								id : "btnSel",
            								text : "查 询",
            								listeners : {
            									click : function () {
            										searchData();
            									}
            								}

            							}
            						]
            					}
            				]
    }]
});


function searchData()
{

        NowDepID=pd_top_form.find("name", "DeptID")[0].getValue();
        NowEmpID=pd_top_form.find("name", "EmpID")[0].getValue();
	 	pd_store.load({params: { sid: Sys.sid, queryYear: NowYear, queryMonth: NowMonth ,querydepID: NowDepID ,queryempID: NowEmpID }});  //载入数据。
        debugger; 
	 
}


var dayStatusCombobox = new Ext.form.ComboBox({
    store: dayStatusStore,
    editable: false,
    anchor: "100%",
    mode: 'local',
    valueField: "ID",
    displayField: "Title",
    triggerAction: "all"
})

//var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [{
        header: 'ID',
        dataIndex: 'DeleteEnable',
        hidden: true,
        width: 100
    },
    {
        header: '<font style="font-weight:bold">门店编码</font>',
        dataIndex: "DepCode",
        align:'center',
        width: 70,
        renderer: function (value, m) {
             m.css = 'x-grid-back-wpb';
             return value;
        }
    },{
        header: '<font style="font-weight:bold">门店</font>',
        align:'center',
        dataIndex: 'DepTitle',
        width: 60,
        renderer: function (value, m) {
             m.css = 'x-grid-back-wpb';
             return value;
        }
    },   {
        header: '<font style="font-weight:bold">工号</font>',
        dataIndex: "EmpCode",
        align:'center',
        width: 70,
        renderer: function (value, m) {
             m.css = 'x-grid-back-wpb';
             return value;
        }
    },{
        header: '<font style="font-weight:bold">员工</font>',
        align:'center',
        dataIndex: 'EmpTitle',
        width: 60,
        renderer: function (value, m) {
             m.css = 'x-grid-back-wpb';
             return value;
        }
    }, {
        header: "1",
        dataIndex: "Day1",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "2",
        dataIndex: "Day2",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "3",
        dataIndex: "Day3",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "4",
        dataIndex: "Day4",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "5",
        dataIndex: "Day5",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "6",
        dataIndex: "Day6",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "7",
        dataIndex: "Day7",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "8",
        dataIndex: "Day8",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "9",
        dataIndex: "Day9",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "10",
        dataIndex: "Day10",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "11",
        dataIndex: "Day11",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "12",
        dataIndex: "Day12",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "13",
        dataIndex: "Day13",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "14",
        dataIndex: "Day14",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "15",
        dataIndex: "Day15",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "16",
        dataIndex: "Day16",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "17",
        dataIndex: "Day17",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "18",
        dataIndex: "Day18",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "19",
        dataIndex: "Day19",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "20",
        dataIndex: "Day20",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "21",
        dataIndex: "Day21",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "22",
        dataIndex: "Day22",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "23",
        dataIndex: "Day23",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "24",
        dataIndex: "Day24",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "25",
        dataIndex: "Day25",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "26",
        dataIndex: "Day26",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "27",
        dataIndex: "Day27",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "28",
        dataIndex: "Day28",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "29",
        dataIndex: "Day29",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "30",
        dataIndex: "Day30",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, {
        header: "31",
        dataIndex: "Day31",
        width: 25,
        renderer: function (value, m) {
            return RenderDayStatus(value, m);
        }
    }, 
	{
        header: "通班",
        dataIndex: "tongWorkDays",
        align:'right',
        width: 50,
        renderer: function (value, m,record) {
             m.css = 'x-grid-back-wpb';
			var data = record.data;
			var days = 0;
			for(var i=1;i<=31;i++){
				if(data["Day"+i+""]==5)
				{
					days += 1;
				}
			}
			return days;
		}
    }, 
	{
        header: "白班",
        dataIndex: "baiWorkDays",
        align:'right',
        width: 50,
        renderer: function (value, m,record) {
             m.css = 'x-grid-back-wpb';
			var data = record.data;
			var days = 0;
			for(var i=1;i<=31;i++){
				if(data["Day"+i+""]==0)
				{
					days += 1;
				}
			}
			
			return days;
		}
    }, 
	{
        header: "中班",
        dataIndex: "zhongWorkDays",
        align:'right',
        width: 50,
        renderer: function (value, m,record) {
             m.css = 'x-grid-back-wpb';
			var data = record.data;
			var days = 0;
			for(var i=1;i<=31;i++){
				if(data["Day"+i+""]==6)
				{
					days += 1;
				}
			}
			return days;
		}
    }, 
	
	{
        header: "晚班",
        dataIndex: "wanWorkDays",
        align:'right',
        width: 50,
        renderer: function (value, m,record) {
             m.css = 'x-grid-back-wpb';
			var data = record.data;
			var days = 0;
			for(var i=1;i<=31;i++){
				if(data["Day"+i+""]==1)
				{
					days += 1;
				}
			}
			
			return days;
		}
    }, {
        header: "休息",
        dataIndex: "freeDays",
        align:'right',
        width: 50,
        renderer: function (value, m,record) {
             m.css = 'x-grid-back-wpb';
			var data = record.data;
			var days = 0;
			for(var i=1;i<=31;i++){
				if(data["Day"+i+""]==2)
				{
					days += 1;
				}
			}
			return days;
		}
    }, {
        header: "请假",
        dataIndex: "VacationDays",
        align:'right',
        width: 50,
		renderer: function (value, m,record) {
             m.css = 'x-grid-back-wpb';
			var data = record.data;
			var days = 0;
			for(var i=1;i<=31;i++){
				if(data["Day"+i+""]==3)
				{
					days += 1;
				}
			}
			return days;
		}
    }]
});


debugger;
var oldData;
// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
//    autoLoad: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=getQdepSchedule&sid=' + Sys.sid,
    baseParams: { sid: Sys.sid, queryYear: NowYear, queryMonth: NowMonth,querydepID:NowDepID,queryempID:NowEmpID },
    reader: new Ext.data.JsonReader({
        record: 'MakeupInfo',
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "ID", mapping: "ID" },
				{ name: "DeleteEnable", mapping: "DeleteEnable" },
				{ name: 'DepTitle', mapping: 'DepTitle' },
                { name: 'DepCode', mapping: 'DepCode' },
                { name: 'EmpTitle', mapping: 'EmpTitle' },
                { name: 'EmpCode', mapping: 'EmpCode' },
                { name: 'Day1', mapping: 'Day1' },
                { name: "Day2", mapping: "Day2" },
                { name: "Day3", mapping: "Day3" },
                { name: 'Day4', mapping: 'Day4' },
                { name: "Day5", mapping: "Day5" },
                { name: "Day6", mapping: "Day6" },
                { name: 'Day7', mapping: 'Day7' },
                { name: "Day8", mapping: "Day8" },
                { name: "Day9", mapping: "Day9" },
                { name: "Day10", mapping: "Day10" },
                { name: 'Day11', mapping: 'Day11' },
                { name: "Day12", mapping: "Day12" },
                { name: "Day13", mapping: "Day13" },
                { name: 'Day14', mapping: 'Day14' },
                { name: "Day15", mapping: "Day15" },
                { name: "Day16", mapping: "Day16" },
                { name: 'Day17', mapping: 'Day17' },
                { name: "Day18", mapping: "Day18" },
                { name: "Day19", mapping: "Day19" },
                { name: "Day20", mapping: "Day20" },
                { name: 'Day21', mapping: 'Day21' },
                { name: "Day22", mapping: "Day22" },
                { name: "Day23", mapping: "Day23" },
                { name: 'Day24', mapping: 'Day24' },
                { name: "Day25", mapping: "Day25" },
                { name: "Day26", mapping: "Day26" },
                { name: 'Day27', mapping: 'Day27' },
                { name: "Day28", mapping: "Day28" },
                { name: "Day29", mapping: "Day29" },
                { name: "Day30", mapping: "Day30" },
                { name: "Day31", mapping: "Day31" },
                { name: "workDays", mapping: "workDays" },
                { name: "freeDays", mapping: "freeDays" },
                { name: "VacationDays", mapping: "VacationDays" }
            ]
    }),
    listeners: {
        load: function (com, records, options) {
            //获取初始数据源 并且添加到全局变量的数组中
            oldData = records;
            var old_array = new Array();
            for (var i = 0; i < oldData.length; i++) {
                old_array.push(oldData[i].data);
            }
            oldData = Ext.encode(old_array);
        }
    }
});
var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    stripeRows : false,
    //selModel:MultiCellSelectionModel,
//    columnLines:true,
//    selModel: new Ext.grid.CellSelectionModel({
//        last: false, // 上一次选中的单元格
//        selections: [], // 选择区缓存
//        handleMouseDown: function (grid, row, col, event) {
//            if (col <= 3 || col > 34) {
//                return;
//            }
//            var cell = this.grid.getView().getCell(row, col);
//            if (cell.title == "") {
//                cell.title = cell.innerText;
//                cell.innerText = "☆";
//                cell.style.fontSize = "16px";
//                cell.style.color = "#F00";
//                cell.style.fontWeight = "bold";
//                cell.style.paddingTop = "";
//                this.selections.push([row, col]);
//            } else {
//                cell.innerText = cell.title;
//                cell.title = "";
//                cell.title = "";
//                cell.style.fontSize = "";
//                cell.style.paddingTop = "3px";
//                cell.style.color = "";
//                cell.style.fontWeight = "";
//                for (var i = 0; i < this.selections.length; i++) {
//                    if (row === this.selections[i][0] && col === this.selections[i][1]) {
//                        this.selections.splice(i, 1);
//                        break;
//                    }
//                }
//            }
//            cell.style.textAlign = "center";
//        }
//    }),
    cm: cm,
    //sm: sm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true,
//    listeners: {
//        render: function () {
//            var nowyear = pd_top_form.getForm().findField("comboYear").getValue();
//            var nowmonth = pd_top_form.getForm().findField("comboMonth").getValue(); 
//            var nowMonthDays = new Date(nowyear, nowmonth, 0).getDate();
//            var days = 2;
//            //隐藏列
//            if (nowMonthDays < 31) {
//                for (var j = nowMonthDays + 1; j <= 31; j++) {
//                    pd_grid.getColumnModel().setHidden(days + j, true);
//                }
//            }
//            //为列添加星期标志
//            var day = new Array(7)
//            day[0] = "日"
//            day[1] = "一"
//            day[2] = "二"
//            day[3] = "三"
//            day[4] = "四"
//            day[5] = "五"
//            day[6] = "六"
//            for (var i = 1; i <= nowMonthDays; i++) {
//                var newDay = day[new Date(nowyear, nowmonth - 1, i).getDay()];
//                if (newDay == "六" || newDay == "日") {
//                    pd_grid.getColumnModel().setColumnHeader(days + i, '<font style="color:red">' + newDay + '</font><br>' + '<font style="color:red">' + i + '</font>');
//                } else {
//                    pd_grid.getColumnModel().setColumnHeader(days + i, newDay + '<br>' + i);
//                }
//            }
//        }
//    }
});


function RenderDayStatus(value, m) {
    if (value == "0") {
        m.css = 'x-grid-back-bai';
        return "白";
    }
    else if(value == "1") {
        m.css = 'x-grid-back-ban';
        return "晚";
    } else if (value == "2") {
        m.css = 'x-grid-back-xiu';
        return "休";
    } else if (value == "3") {
        m.css = 'x-grid-back-jia';
        return "假";
    }
	else if (value == "5") {
        m.css = 'x-grid-back-tong';
        return "通";
    }
	else if (value == "6") {
        m.css = 'x-grid-back-zhong';
        return "中";
    }
}

function BtnUpdateStatus(Status) {
    for (var i = 0; i < pd_grid.selModel.selections.length; i++) {
        var cell = pd_grid.selModel.selections[i];
        pd_grid.getStore().getAt(cell[0]).set("Day" + (cell[1] - 3), 4);
        pd_grid.getStore().getAt(cell[0]).set("Day" + (cell[1] - 3), Status);
    }
    pd_grid.selModel.selections = [];
}

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 180,
        layout: "fit",
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        region: 'center',
        border: false,
        anchor: '-1 -140',
        items: [pd_grid]
    }]
});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();
//设置显示默认日期
var setDefaultValues = function () {

//     Ext.getCmp("btnSel").disabled = true;
  Ext.getCmp("btnSel").setDisabled(true);
	
};
setDefaultValues();