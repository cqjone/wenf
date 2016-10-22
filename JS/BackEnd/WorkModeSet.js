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


	var WorkMode = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
			
			["0", "白班"],
			["6", "中班"],
			["1", "晚班"],
			["5", "通班"]
			]
			
			
	});

	

var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : true,
		labelWidth : 5,
		labelAlign : 'right',
		heigh : 100,
		//autoWidth:true,
		items : [{
				xtype : "fieldset",
				title : "班次时间设定",
				//defaultType: 'textfield',
				defaults : {
					labelAlign : "right",
					width : 50
				},
				height : 75,
				//bodyBorder:false,
				layout : "column",
				items : [{
						layout : "hbox",
						defaults : {
							margins : '0 5 0 0'
						},
						columnWidth : 1,
						items : [{
								xtype : "button",
								boxMinWidth : 40,
								style : "margin-left:30px",
								width : 60,
								text : " 保  存",
								handler : function () {
									
									updateData();
								}
							}

						]
					}
				]

			}
		]
	});


		
var cm = new Ext.grid.ColumnModel({
		defaults : {
			sortable : false,
			menuDisabled : true,
			multiSelect : true,
			
			
		},
		clicksToEdit:1,

		columns : [{
				header : 'ID',
				dataIndex : 'ID',
				hidden : true,
				width : 0,
				clicksToEdit:1,
			}, 
			
			
			
			{
				header : '<font style="font-weight:bold;">班次</font>',
				dataIndex : 'WorkMode',
				width : 100,
				editor : WorkMode
				
			}, {
				header : '<font style="font-weight:bold;">开始小时</font>',
				dataIndex : 'BeginHour',
				width : 100,
				align : 'right',
				editor : new Ext.form.NumberField({
					allowDecimals : false,
					allowNegative : false,
					maxValue : 23, //最大可输入的数值
					maxText : '小时数不能大于59!', //超过最大值时候的提示信息,配合maxValue 一起使用
					minValue : 0, //最小可输入的数值
					minText : '小时数不能小于0!', //超过最大值时候的提示信息,配合minValue 一起使用
					nanText : '请输入0-23之间的整数!'
				})
				
			},
			{
				header : '<font style="font-weight:bold;">开始分钟</font>',
				dataIndex : 'BeginMinute',
				width : 150,
				align : 'right',
				editor : new Ext.form.NumberField({
					allowDecimals : false,
					allowNegative : false,
					
					maxValue : 59, //最大可输入的数值
					maxText : '分钟数不能大于59!', //超过最大值时候的提示信息,配合maxValue 一起使用
					minValue : 0, //最小可输入的数值
					minText : '分钟数不能小于0!', //超过最大值时候的提示信息,配合minValue 一起使用
					nanText : '请输入0-59之间的整数!'
				})
			},
			{
				header : '<font style="font-weight:bold;">结束小时</font>',
				dataIndex : 'EndHour',
				width : 100,
				align : 'right',
				editor : new Ext.form.NumberField({
					allowDecimals : false,
					allowNegative : false,
					maxValue : 23, //最大可输入的数值
					maxText : '小时数不能大于59!', //超过最大值时候的提示信息,配合maxValue 一起使用
					minValue : 0, //最小可输入的数值
					minText : '小时数不能小于0!', //超过最大值时候的提示信息,配合minValue 一起使用
					nanText : '请输入0-23之间的整数!'
				})
				
			}, {
				header : '<font style="font-weight:bold;">结束分钟</font>',
				dataIndex : 'EndMinute',
				width : 100,
				align : 'right',
				editor : new Ext.form.NumberField({
					allowDecimals : false,
					allowNegative : false,
					
					maxValue : 59, //最大可输入的数值
					maxText : '分钟数不能大于59!', //超过最大值时候的提示信息,配合maxValue 一起使用
					minValue : 0, //最小可输入的数值
					minText : '分钟数不能小于0!', //超过最大值时候的提示信息,配合minValue 一起使用
					nanText : '请输入0-59之间的整数!'
				})
			},
			

		]
	});

// create the Data Store
var pd_store = new Ext.data.Store({
		autoDestroy : true,
		autoLoad : true,
		url : '../Apis/AttendanceMgr.aspx?actionName=getWorkModeSet&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			idProperty : 'ID',
			root : 'results',
			fields : [{
					name : "ID",
					mapping : "ID"
				},
				{
					name : 'WorkMode',
					mapping : 'WorkMode'
				},
				{
					name : 'BeginHour',
					mapping : 'BeginHour'
				},
				{
					name : 'BeginMinute',
					mapping : 'BeginMinute'
				},  {
					name : 'EndHour',
					mapping : 'EndHour'
				},
				{
					name : 'EndMinute',
					mapping : 'EndMinute'
				}

			]
		})
	});
/**
 * 查询数据
 */
function updateData() {
	var records = pd_store.data.items;
	var array = new Array();
	
	var reg = /^1\d{10}$/;
	for (var i = 0; i < records.length; i++) {
		array.push(records[i].data);
	}
	Ext.getBody().mask("正在保存！请稍候！");
	var data = Ext.encode(array);
	
	Ext.Ajax.request({
		url : '../Apis/ClothingSizesFill.aspx?actionName=updateData&sid=' + Sys.sid,
		params : {
			records : data
		},
		success : function (response, options) {
			pd_store.reload();
			Ext.getBody().unmask();
		},
		failure : function (response, options) {
			Ext.getBody().unmask();
		}
	});
}



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
		
	});

	
	
	
	
		
	


	


//主容器
var pd_main_panel = new Ext.Panel({
		border : false,
		layout : "border",
		items : [{
				frame : true,
				region : 'north',
				height : 100,
				layout : "fit",
				border : false,
				items : [pd_top_form]
			}, 
			
			{
				layout : "border",
				region : 'center',
				border : false,
				
				items : [pd_grid]
			}
		]
	});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();


function getTimeStamp()
{
    // 声明变量。
    var d, s;
    // 创建 Date 对象。
    d = new Date();
    s = d.getFullYear() ;
    s += ("0"+(d.getMonth()+1)).slice(-2) ;
    s += ("0"+d.getDate()).slice(-2) ;
    s += ("0"+d.getHours()).slice(-2) ;
    s += ("0"+d.getMinutes()).slice(-2) ;
    s += ("0"+d.getSeconds()).slice(-2) ;
    s += ("00"+d.getMilliseconds()).slice(-3);
    return s;
}

