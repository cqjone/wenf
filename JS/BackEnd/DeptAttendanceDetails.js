//部门考勤流水
//===================年份和月份Store========================//
var newyear = new Date().getFullYear(); //这是为了取现在的年份数
var yearlist = [["0","全部"]];
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
    data: [["0","全部"],
            ["1", "1"],
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
var period_store = new Ext.data.Store({
	autoDestroy : true,
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

var tar_employee = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/BaseInfoUtil.aspx?actionName=getEmployeeWithCheckin&match_all=true&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [
			        {name : "CombineWord",mapping : "CombineWord"}, 
			        {name : "ID",mapping : "ID"}
			]
		}),
		sortInfo: {field: 'CombineWord',direction:'ASC'}
	});
	
	

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 5,
    labelAlign: 'right',
    heigh: 100,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        //defaultType: 'textfield',
        defaults: { labelAlign: "right", width: 50 },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "hbox",
            defaults: { margins: '0 5 0 0' },
            columnWidth: 1,
            items: [
				 {
					xtype: "label",
					html: '时	间：',
					style: {
						marginTop: '3px'
					}
				}, {
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
					triggerAction: "all"
                      
                },
				{
					xtype: "label",
					html: '员  工：',
					style: {
						marginTop: '3px'
					}
				}, 
				{
					xtype : "combo",
					name : "Employee",
					hiddenName: "ID",
					store : tar_employee,
					triggerAction: 'query',
					width : 130,
					border : 1,
					valueField : 'ID',
					displayField : 'CombineWord',
					enableKeyEvents : true,
					selectOnFocus : true,
					allowBlank : true,
					forceSelection : false,
					hideTrigger : true,
					listeners : {									
					  'specialkey' : function (_field, _e) {
							if (_e.getKey() == _e.ENTER) {
								searchData();
							}
						},
					   "keyup": function (v) {
							
							var value = v.getRawValue();
							
							tar_employee.load({
									params: { key: pd_top_form.find("name", "Employee")[0].getRawValue() }
								});
						}
					},
					style : {
						marginLeft : '3px'

					}
				},
			/**{
                xtype: "combo",
                name: "comboYear",
                store: yearModelStore,
                mode: 'local',
                hideLabel: true,
                width: 60,
                hiddenName: "comboYear",
                anchor: "100%",
                triggerAction: 'all',
                valueField: 'ID',
                displayField: 'Title',
                editable: false
            }, 
			
			{
                xtype: "label",
                html: '年',
                style: {
                    marginTop: '3px',
                }
            }, {
                xtype: "combo",
                hiddenName: "comboMonth",
                store: monthModelStore,
                name: "comboMonth",
                editable: false,
                hideLabel: true,
                anchor: "100%",
                mode: 'local',
                width: 60,
                valueField: "ID",
                displayField: "Title",
                triggerAction: "all"
            }, {
                xtype: "label",
                html: '月',
                style: {
                    marginTop: '3px',
                }
            }, **/
			
			{
                xtype: "button",
                boxMinWidth: 40,
                style: "margin-left:30px",
                width: 60,
                text: " 查  询",
                handler: function () {
                    searchData();
                }
            }]
        }]

    }]
});
//pd_top_form.getForm().findField('comboYear').setValue(newyear);
//pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);
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
    }, 
	{
        header: '操作',
        dataIndex: 'PhotoFileName',
        width: 100,
		align : 'center',
		renderer:showPic
		
       
    },
	
	{
        header: "当日排班",
        dataIndex: "WorkMode",
        width: 120,
        renderer: function (value, metadata, record, rowIndex) {
            if (value == 0) {
                return "白班";
            } else if (value == 1) {
                return "晚班";
            } else if (value == 5) {
                return "通班";
            } else if (value ==6 ) {
                return "中班";
            } else if (value == 4) {
                return "未排班";
            }else if (value == 2) {
                return "休息";
            }
			else if (value == 3) {
                return "请假";
            }
            else if (value == 7) {
                return "培训";
            }
            return "";
        }
    },
	{
        header: '日期',
        dataIndex: 'CheckinDate',
        width: 100
       
    }, {
        header: '时间',
        dataIndex: 'DisplayCheckinTime',
        width: 100
      
    }, {
        header: "时间来源",
        dataIndex: "TimeSource",
        width: 120,
        renderer: function (value, metadata, record, rowIndex) {
            if (value == 0) {
                return "未知";
            } else if (value == 1) {
                return "电脑本机时间";
            } else if (value == 2) {
                return "服务器时间";
            } else if (value == 3) {
                return "百度时间";
            } else if (value == 4) {
                return "手工补录";
            }
            return "";
        }
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
        header: "补录理由",
        dataIndex: "Reason",
        width: 440
    }]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=queryDeptAttendanceDetails&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
                { name: "ID", mapping: "ID" },
			   { name: 'WorkMode', mapping: 'WorkMode' },
			   { name: 'CheckinDate', mapping: 'CheckinDate' },
                { name: 'CheckinTime', mapping: 'CheckinTime' },
                { name: 'TimeSource', mapping: 'TimeSource' },
                { name: 'RecordMode', mapping: 'RecordMode' },
                { name: "EmployeeCode", mapping: "EmployeeCode" },
                { name: "EmployeeName", mapping: "EmployeeName" },
				{ name: "PhotoFileName", mapping: "PhotoFileName" },
                { name: "Reason", mapping: "Reason" },
				{ name: "DisplayCheckinTime", mapping: "DisplayCheckinTime" }

				
            ]
    })
});
/** 
* 查询数据
*/
function searchData() {

    pd_top_form.getForm();
		var period = pd_top_form.find("name","comboPeriod")[0].getValue();
		var queryYear="";
		var queryMonth = "";
		var arr;
		
		if(period!= null && typeof(period)!="undefined"){
			 arr = period.split("-");
			 if(arr.length>1){
				queryYear = arr[0];
				queryMonth = arr[1];
			 }
			 else if(period.split("年").length>1){
				arr = period.split("年");
				queryYear  = arr[0];
				queryMonth = arr[1].replace("月","");
			 }
			 
			 
			 
		}
		var id = pd_top_form.find("name", "Employee")[0].getValue();
		
	pd_store.load({
        //params: { searchYear: pd_top_form.find('name', 'comboYear')[0].value, searchMonth: pd_top_form.find('name', 'comboMonth')[0].value,urlName:"dept" }
		params: { searchYear:queryYear, searchMonth: queryMonth,urlName:"dept",EmployeeID:id }
		
							
    });
}

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    sm: sm,
    margins: "2 2 2 2",
    border: false,
    columnLines: true,
    loadMask: true
	/**listeners: {
        cellclick: function (grid, row, col, event) {
            alert('click');
			var record = pd_grid.getStore().getAt(row);
            var fieldName = pd_grid.getColumnModel().getDataIndex(col);
            var src = record.get(fieldName);
            if (src.indexOf(".jpg")>0) {
                src = record.get(fieldName).replace(".jpg4", ".jpg");
				if(picImageView.getStore()!= null && typeof(picImageView.getStore())!="undefined"){
					picImageView.getStore().loadData([[src,src]]);
					pictureWindow.show();
				}
	         }
        }
    }**/
  
});

var setDefaultValues = function () {
	var now = new Date();
	var date = now.format('Y年m月');
	pd_top_form.find("name", "comboPeriod")[0].setValue(date);
	pd_top_form.show();
};


pd_store.on('beforeload', function (thiz, options) {
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
        layout: "fit",
        region: 'center',
        border: false,
        anchor: '-1 -140',
        items: [pd_grid]
    }]
});



var pictureImageStore = new Ext.data.ArrayStore({
    fields: ['src'],
    data: []
});

var picImageTpl = new Ext.XTemplate(
    '<tpl for=".">',
        '<div style="margin-bottom: 10px;" class="thumb-wrap">',
          '<img width=610px src="..{src}" />',
        '</div>',
    '</tpl>'
);

var picImageView = new Ext.DataView({
    store: pictureImageStore,
    tpl: picImageTpl,
    region: 'center',
    itemSelector: 'div.thumb-wrap'
});


var pictureWindow = new Ext.Window({
    title: ' 图片浏览',
    width: 640,
    height: 545,
    modal: true,
	closable:false,
    items: picImageView,
    layout: 'fit',
    buttons: [
        {
            text: '关闭',
            handler: function () {
                pictureWindow.hide();
            }
        }
    ]
});


function showPic(value, metadata, record, rowIndex, columnIndex, store) {
	window.ShowPicBox = function (rowIndex) {
		var row = pd_store.getAt(rowIndex);
		var checkDate = row.data["CheckinDate"];
		var photoName = row.data["PhotoFileName"];
		if(photoName!=null && photoName!=""){
			var src ="/Imgs/Checkin/"+checkDate+"/"+photoName;
			picImageView.getStore().loadData([[src,src]]);
			pictureWindow.show();
		}
		
		/**src = record.get(fieldName).replace(".jpg4", ".jpg");
				if(picImageView.getStore()!= null && typeof(picImageView.getStore())!="undefined"){
					picImageView.getStore().loadData([[src,src]]);
					pictureWindow.show();
				}**/
				
	};
	
	if(value!=''){
		return "<a style=\"cursor:pointer;text-decoration:underline;\" onclick=ShowPicBox('"+rowIndex+"') >查看照片</a>"
	}
	else {
		return '';
	}
}
centerPanel.add(pd_main_panel);
centerPanel.doLayout();
setDefaultValues();
