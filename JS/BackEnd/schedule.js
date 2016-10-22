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
var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 50,
    labelAlign: 'right',
    heigh: 120,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "排班管理",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 50 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "form",
            columnWidth: 1,
            items: [{
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    padding: '0 0 4 0',
                    pack: 'start'
                },
                items: [
				{
                    xtype: "combo",
                    name: "comboPeriod",
                    store: period_store,
                    hiddenName: "comboPeriod",
                    width: 180,
                    margin: '0 0 0 20',
                    mode: 'local',
                    triggerAction: 'all',
                    valueField: 'Value',
                    displayField: 'Title',
                    editable: false,
					forceSelection :true,
					triggerAction: "all",
                    listeners: {
                        select: function () {
							  
                            var period = pd_top_form.getForm().findField("comboPeriod").getValue();
                            //debugger;
							if(period!= null && typeof(period)!="undefined"){
								var arr = period.split("-");
								var queryYear = arr[0];
								var queryMonth = arr[1];
								pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
								updateWeek();
							}
							
                        }
						
					  
	  
						
                    }
                    
                },
				{
                    xtype: "combo",
                    name: "comboYear",
                    store: yearModelStore,
					hidden:true,
                    hiddenName: "comboYear",
                    width: 80,
                    margin: '0 0 0 20',
                    mode: 'local',
                    triggerAction: 'all',
                    valueField: 'ID',
                    displayField: 'Title',
                    editable: false,
                    listeners: {
                        select: function () {
                            pd_store.reload({ params: { queryYear: pd_top_form.getForm().findField("comboYear").getValue(), queryMonth: pd_top_form.getForm().findField("comboMonth").getValue()} });
							updateWeek();
							}
                    }
                }, {
                    xtype: "label",
                    hidden:true,
					html: '&nbsp;&nbsp;年&nbsp;'
                }, {
                    xtype: "combo",
                    fieldLabel: "",
                    hiddenName: "comboMonth",
					hidden:true,
                    store: monthModelStore,
                    name: "comboMonth",
                    editable: false,
                    hideLabel: true,
                    width: 40,
                    anchor: "100%",
                    mode: 'local',
                    valueField: "ID",
                    displayField: "Title",
                    triggerAction: "all",
                    listeners: {
                        select: function () {
                            pd_store.reload({ params: { queryYear: pd_top_form.getForm().findField("comboYear").getValue(), queryMonth: pd_top_form.getForm().findField("comboMonth").getValue()} });
							updateWeek();
                        }
                    }
                }, {
                    xtype: "label",
                    hidden:true,
					html: '&nbsp;&nbsp;月'
					
                }, 
				
				{
                    xtype: "button",
                    boxMinWidth: 40,
                    id: 'btnUpdate',
                    style: "margin-left:25px;",
                    width: 60,
                    text: " 保  存",
                    handler: function () {
                        UpdateData();
                    }
                }]
            }]
        }, {
            columnWidth: 1,
            layout:'hbox',
            items: [{
                xtype: "label",
                html: '员  工：',
                style: {
                    marginTop: '3px'
                },
            }, 
			
			 {
					xtype : "combo",
					name : "EmployeeCode",
					hiddenName: "ID",
					store : tar_employee,
					triggerAction: 'query',
					width : 130,
					border : 1,
					valueField : 'ID',
					displayField : 'CombineWord',
					enableKeyEvents : true,
					selectOnFocus : true,
					allowBlank : false,
					forceSelection : true,
					hideTrigger : true,
				
					listeners : {									
					  'specialkey' : function (_field, _e) {
							if (_e.getKey() == _e.ENTER) {
								AddData();
							}
						},
					   "keyup": function (v) {
							var value = v.getRawValue();
							
							if(value!= null && value.length>=6) {
								
								tar_employee.load({
									params: { key:value }
								});
								Ext.getCmp('btnAdd').setDisabled(false);
							}
						}
					},
					style : {
						marginLeft : '3px'

					}
				}
			/**{
                xtype: "textfield",
                name: "EmployeeCode",
                enableKeyEvents: true,
                listeners: {
                    "keyup": function (v) {
                        if (Ext.util.Format.trim(v.getRawValue()).length == 8) {
                            Ext.Ajax.request({
                                url: '../Apis/AttendanceMgr.aspx?actionName=queryAllEmployeeName&sid=' + Sys.sid,
                                params: { Code: Ext.util.Format.trim(v.getRawValue()) },
                                success: function (response, option) {
                                    var rs = Ext.decode(response.responseText);
                                    if (rs.success) {
                                        if (rs.msg.length >= 0) {
                                            pd_top_form.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                            pd_top_form.getForm().findField('EmployeeID').setValue(rs.msg[0]["ID"] + ",");
                                            Ext.getCmp('btnAdd').setDisabled(false);
                                        } else {
                                            Ext.getCmp('btnAdd').setDisabled(true);
                                        }

                                    } else {
                                        Ext.MessageBox.alert("提示", rs.msg);
                                        Ext.getCmp('btnAdd').setDisabled(true);
                                    }
                                },
                                failure: function () {
                                    Ext.MessageBox.alert("提示", "获取员工姓名异常!");
                                    Ext.getCmp('btnAdd').setDisabled(true);
                                }
                            });
                        } else {
                            pd_top_form.getForm().findField('EmployeeName').setValue("");
                            Ext.getCmp('btnAdd').setDisabled(true);
                        }
                    }
                }
            } **/
			
			/**,{
                xtype: "label",
                html: '姓  名：',
                style: {
                    marginTop: '3px',
                    marginLeft: '5px'
                },
            }, {
                xtype: "textfield",
                readOnly: true,
                hideLabel: true,
                style: {
                    marginLeft: '10px'
                },
                name: "EmployeeName"
            }**/
			
			, {
                xtype: "textfield",
                readOnly: true,
                hideLabel: true,
                hidden: true,
                style: {
                    marginLeft: '0px'
                },
                name: "EmployeeID",
                anchor: "100%"
            }, {
                    xtype: "button",
                    boxMinWidth: 40,
                    disabled: true,
                    id: 'btnAdd',
                    style: "margin-left:25px;",
                    width: 60,
                    text: " 添  加",
                    handler: function () {
                        AddData();
                    }
            }
			,{
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 5 + ");'/>通  班</div>",
                cls: 'button-hover',
                style: "margin-left:40px;background-color:#CF3;",
                width: 50
            }
		
			,{
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 0 + ");'/>白  班</div>",
                cls: 'button-hover',
                style: "margin-left:50px;background-color:#32A3EB;",
                width: 50
            },
			{
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 6 + ");'/>中  班</div>",
                cls: 'button-hover',
                style: "margin-left:60px;background:#8000FF;",
                width: 50
            },
			{
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 1 + ");'/>晚  班</div>",
                cls: 'button-hover',
                style: "margin-left:70px;background-color:#0Dbb61;",
                width: 50
            }, {
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 2 + ");'/>休  息</div>",
                cls: 'button-hover',
                style: "margin-left:80px;background-color:#F59D56;",
                width: 50
            }, {
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 3 + ");'/>请  假</div>",
                cls: 'button-hover',
                style: "margin-left:90px;background-color:#C05046;",
                width: 50
            },
             {
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 7 + ");'/>培  训</div>",
                cls: 'button-hover',
                style: "margin-left:100px;background-color:#F0F;",
                width: 50
            },
			 {
                xtype: "box",
                boxMinWidth: 40,
                html: "<div style='width:40;height:20px;line-height:20px;text-align:center;border:1px solid #CBCBCB;cursor:pointer;' onclick='BtnUpdateStatus(" + 4 + ");'/>清  空</div>",
                cls: 'button-hover',
                style: "margin-left:110px;background-color:#FFF;",
                width: 50
            }
			
			]
        }]
    }]
});
pd_top_form.getForm().findField('comboYear').setValue(newyear);
pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);
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
    }, {
        header: '删除',
        width: 35,
        align:'center',
		renderer : function (value) {
		//alert (value);
			//var imgUrl=value+"?num="+getTimeStamp();
			var str="";
			if(value!="0"){
				str= "<img style='cursor:pointer;' src='../Imgs/delete.png'  border='0' onclick='deleteRrecord("+value+")'/>"
			}
			return str;
		}
				
        /**items: [{
            icon: '../Imgs/delete.png',  // Use a URL in the icon config
            tooltip: '删除',
            handler: function (grid, rowIndex, colIndex) {
                RecordModeDel(rowIndex);
            }
        }]**/
    }, {
        header: '<font style="font-weight:bold">员工</font>',
        align:'center',
        dataIndex: 'EmpTitle',
        width: 60,
        renderer: function (value, m) {
             m.css = 'x-grid-back-wpb';
             return value;
        }
    }, {
        header: '<font style="font-weight:bold">工号</font>',
        dataIndex: "EmpCode",
        align:'center',
        width: 70,
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
    },{
        header: "培训",
        dataIndex: "VacationDays",
        align:'right',
        width: 50,
        renderer: function (value, m,record) {
             m.css = 'x-grid-back-wpb';
            var data = record.data;
            var days = 0;
            for(var i=1;i<=31;i++){
                if(data["Day"+i+""]==7)
                {
                    days += 1;
                }
            }
            return days;
        }
    }]
});

var oldData;
// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=querySchedule&sid=' + Sys.sid,
    baseParams: { sid: Sys.sid, queryYear: pd_top_form.getForm().findField("comboYear").getValue(), queryMonth: pd_top_form.getForm().findField("comboMonth").getValue() },
    reader: new Ext.data.JsonReader({
        record: 'MakeupInfo',
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "ID", mapping: "ID" },
				{ name: "DeleteEnable", mapping: "DeleteEnable" },
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
var pd_grid = new Ext.grid.EditorGridPanel({
    store: pd_store,
    //selModel:MultiCellSelectionModel,
    columnLines:true,
    selModel: new Ext.grid.CellSelectionModel({
        last: false, // 上一次选中的单元格
        selections: [], // 选择区缓存
        handleMouseDown: function (grid, row, col, event) {
            if (col <= 3 || col > 34) {
                return;
            }
            var cell = this.grid.getView().getCell(row, col);
            if (cell.title == "") {
                cell.title = cell.innerText;
                cell.innerText = "☆";
                cell.style.fontSize = "16px";
                cell.style.color = "#F00";
                cell.style.fontWeight = "bold";
                cell.style.paddingTop = "";
                this.selections.push([row, col]);
            } else {
                cell.innerText = cell.title;
                cell.title = "";
                cell.title = "";
                cell.style.fontSize = "";
                cell.style.paddingTop = "3px";
                cell.style.color = "";
                cell.style.fontWeight = "";
                for (var i = 0; i < this.selections.length; i++) {
                    if (row === this.selections[i][0] && col === this.selections[i][1]) {
                        this.selections.splice(i, 1);
                        break;
                    }
                }
            }
            cell.style.textAlign = "center";
        }
    }),
    cm: cm,
    //sm: sm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true,
    listeners: {
        render: function () {
			updateWeek();
			//debugger;
			
            // var nowyear = pd_top_form.getForm().findField("comboYear").getValue();
            // var nowmonth = pd_top_form.getForm().findField("comboMonth").getValue(); 
            // var nowMonthDays = new Date(nowyear, nowmonth, 0).getDate();
            // var days = 3;
            // //隐藏列
            // if (nowMonthDays < 31) {
                // for (var j = nowMonthDays + 1; j <= 31; j++) {
                    // pd_grid.getColumnModel().setHidden(days + j, true);
                // }
            // }
            // //为列添加星期标志
            // var day = new Array(7)
            // day[0] = "日"
            // day[1] = "一"
            // day[2] = "二"
            // day[3] = "三"
            // day[4] = "四"
            // day[5] = "五"
            // day[6] = "六"
            // for (var i = 1; i <= nowMonthDays; i++) {
                // var newDay = day[new Date(nowyear, nowmonth - 1, i).getDay()];
                // if (newDay == "六" || newDay == "日") {
                    // pd_grid.getColumnModel().setColumnHeader(days + i, '<font style="color:red">' + newDay + '</font><br>' + '<font style="color:red">' + i + '</font>');
                // } else {
                    // pd_grid.getColumnModel().setColumnHeader(days + i, newDay + '<br>' + i);
                // }
            // }
			
			
        }
    }
});



function RecordModeDel(index) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
            pd_store.remove(pd_store.getAt(index));
        }
    });
}

function deleteRrecord(id) {
    Ext.Msg.confirm('警告', "<font style='color:#F00;font-size:20px;font-weight:bold;'>是否确定删除？</font>", function (btn) {
        if (btn == 'yes') {
			//id = id.split(",")[0];
            var index = pd_store.find('ID',id);
			pd_store.remove(pd_store.getAt(index));
        }
    });
}

function AddData() {
    //var EmployeeID = Ext.util.Format.trim(pd_top_form.getForm().findField('EmployeeID').getValue());
	var EmployeeID = pd_top_form.find("name", "EmployeeCode")[0].getValue();

	
	var index = tar_employee.find('ID',EmployeeID);
	var record = tar_employee.getAt(index);

	if(record == null || typeof(record)=="undefined"){
		return;
	}
	var data = record.data.CombineWord;
	var arr = data.split(" ");
	var EmployeeCode = arr[0];
	var EmployeeName = arr[1];
	
	//var EmployeeCode = Ext.util.Format.trim(pd_top_form.getForm().findField('EmployeeCode').getValue());
    //var EmployeeName = Ext.util.Format.trim(pd_top_form.getForm().findField('EmployeeName').getValue
	
	var record = new Ext.data.Record({
	    ID:EmployeeID+",",
		DeleteEnable:EmployeeID,
		EmpTitle:EmployeeName,
		EmpCode:EmployeeCode,
		Day1:'',
		Day2:'',
		Day3:'',
		Day4:'',
		Day5:'',
		Day6:'',
		Day7:'',
		Day8:'',
		Day9:'',
		Day10:'',
		Day11:'',
		Day12:'',
		Day13:'',
		Day14:'',
		Day15:'',
		Day16:'',
		Day17:'',
		Day18:'',
		Day19:'',
		Day20:'',
		Day21:'',
		Day22:'',
		Day23:'',
		Day24:'',
		Day25:'',
		Day26:'',
		Day27:'',
		Day28:'',
		Day29:'',
		Day30:'',
		Day31:'',
		workDays:'0',
		freeDays:'0',
		VacationDays:'0'
		});
        var total = pd_grid.getStore().getCount();
		var records="";
		for(var i = 0;i<total;i++){
		    records = pd_grid.getStore().getAt(i);
			if(EmployeeCode==records.data["EmpCode"]){
				Ext.MessageBox.alert("提示", "不能重复添加!");
				return;
			}
		}
		pd_grid.stopEditing();
		pd_store.insert(0,record);//可以自定义在stroe的某个位置插入一行数据。
		pd_grid.startEditing(3, 0);
		pd_top_form.find("name", "EmployeeCode")[0].setValue("");
}

function UpdateData() {
    Ext.getCmp('btnUpdate').setDisabled(true);
    Ext.getBody().mask("正在加载！请稍候！");
    var store = pd_grid.getStore();
    var my_array = new Array();
    store.each(function (record) {
        my_array.push(record.data);
    });
    var nowData = Ext.encode(my_array);
    var period = pd_top_form.getForm().findField("comboPeriod").getValue();
    if(period.indexOf("-")==-1){
        period = period.replace("年","-");
        period = period.replace("月","");
    }
    var arr = period.split("-");
    var queryYear = arr[0];
    var queryMonth = arr[1];

    
    Ext.Ajax.request({
		timeout: 600000,
        url: '../Apis/AttendanceMgr.aspx?actionName=updateSchedule&sid=' + Sys.sid,
        params: { queryYear: queryYear, queryMonth: queryMonth,oldData:oldData,nowData:nowData },
        success: function (response, option) {
            Ext.getCmp('btnUpdate').setDisabled(false);
            Ext.getBody().unmask();
            var rs = Ext.decode(response.responseText);

            if (rs.success) {
                pd_store.load({ params: { queryYear: queryYear, queryMonth:queryMonth} });
                Ext.MessageBox.alert("提示", rs.msg);
				
				
            } else {
                Ext.MessageBox.alert("提示", rs.msg);
            }
        },
        failure: function () {
            Ext.getCmp('btnUpdate').setDisabled(false);
            Ext.getBody().unmask();	
            Ext.MessageBox.alert("提示", "保存异常!");
        }
    });
}

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
    else if (value == "7") {
        m.css = 'x-grid-back-pei';
        return "培";
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

function updateWeek() {
	
	
    var period = pd_top_form.getForm().findField("comboPeriod").getValue();
    
    var nowyear = pd_top_form.getForm().findField("comboYear").getValue();
    var nowmonth = pd_top_form.getForm().findField("comboMonth").getValue(); 
    var arr = period.split("-");
	
	if (period!= null && period!="" && arr.length==2) {
		nowyear = parseInt(arr[0]);
		nowmonth = parseInt(arr[1]);
	}
	
    var nowMonthDays = new Date(nowyear, nowmonth, 0).getDate();
    var days = 3;

	//显示所有列
	for (var j=1; j<=31; j++) {
		pd_grid.getColumnModel().setHidden(days + j, false);
	}
	
	//隐藏列
    if (nowMonthDays < 31) {
        for (var j = nowMonthDays + 1; j <= 31; j++) {
            pd_grid.getColumnModel().setHidden(days + j, true);
        }
    }

	//为列添加星期标志
            var day = new Array(7)
            day[0] = "日"
            day[1] = "一"
            day[2] = "二"
            day[3] = "三"
            day[4] = "四"
            day[5] = "五"
            day[6] = "六"
            for (var i = 1; i <= nowMonthDays; i++) {
                var newDay = day[new Date(nowyear, nowmonth - 1, i).getDay()];
                if (newDay == "六" || newDay == "日") {
                    pd_grid.getColumnModel().setColumnHeader(days + i, '<font style="color:red">' + newDay + '</font><br>' + '<font style="color:red">' + i + '</font>');
                } else {
                    pd_grid.getColumnModel().setColumnHeader(days + i, newDay + '<br>' + i);
                }
            }
        }


//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 115,
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
var setDefaultValues = function () {
	var now = new Date();
	var date = now.format('Y年m月');
	pd_top_form.find("name", "comboPeriod")[0].setValue(date);
  
	pd_top_form.show();
};

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
setDefaultValues();