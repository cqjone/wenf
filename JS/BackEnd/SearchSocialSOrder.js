var tar_dept = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/BaseInfoUtil.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'}
});

var tar_employee = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/BaseInfoUtil.aspx?char_length=3&actionName=getEmployee&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "CombineWord",mapping : "CombineWord"}, 
				{name : "ID",mapping : "ID"}
		]
	}),
	sortInfo: {field: 'CombineWord',direction:'ASC'}
});

	
var today = new Date();
var lastDay = new Date();
lastDay.setDate(today.getMonth()-1);
/*
var pd_store = new Ext.data.ArrayStore({

    fields: ['ID','EmpId','Name','DeptId','Withhold'],
    data: [
		[1,'00100161','张三','大华店','250'],
		[2,'00100162','李松','静安店','318'],
		[3,'00100163','王五','财大店','250'],
		[4,'00100164','赵六','七宝店','318']
	]
});
*/
//列表数据
var pd_store = new Ext.data.Store({
	autoDestroy : true,
	url : '../Apis/LogisticsManagement.aspx?actionName=getSearchSocialSWithhold&sid=' + Sys.sid,
	autoLoad : true,
	reader : new Ext.data.JsonReader({
		fields : [{
				name : "ID",
				mapping : "ID"
			},
			{
				name : "EmpId",
				mapping : "EmpId"
			},
			{
				name : "Name",
				mapping : "Name"
			}, {
				name : "sCode",
				mapping : "sCode"
			}, {
				name : "Withhold",
				mapping : "Withhold"
			}
		]
	}),
});

/*
var monthStore = new Ext.data.ArrayStore({
   fields: ['ID', 'Title'],
    data: [["2014年8月", "2014年8月"],["2014年9月", "2014年9月"]]
});
*/

//日期数据源
var period_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: false,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getExistPeriod&tableName=iSocialSWithhold&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [
				{ name: "Title", mapping: "Title" },
				{ name: "Value", mapping: "Value" },
		]
    }),
    sortInfo: { field: 'Value', direction: 'desc' }
});
period_store.load();


//物料登记
var id = 0;
var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : false,
		heigh : 100,
		//autoWidth:true,
		
		items : [
				{
					xtype : "fieldset",
					title : "条件",
					layout : "column",
					labelWidth : 50,
					labelAlign : 'right',
					items : [
					 {
						layout : 'form',
						//columnWidth : 0.25,
						items : [{
								xtype : 'combo',
								fieldLabel : '月 份',
								name : 'DataMonth',
								editable : false,
								selectOnFocus : true,
								forceSelection : true,
								mode : 'local',
								store: period_store,
								displayField : "Title",
								valueField : "Value",
								triggerAction : "all",
								anchor : '90%',
								allowBlank : true,
								width:126,
								listeners : {									
										'select':function(){
							                var period = pd_top_form.getForm().findField("DataMonth").getValue();
							                if(period!= null && typeof(period)!="undefined"){
								                var arr = period.split("-");
								                var queryYear = arr[0];
								                var queryMonth = arr[1];
								                pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
							                }
										}
								}
							}
						]
					}
					]
				}
		]//first

	}); //form
//页面加载设置默认值
var setDefaultValues = function () {
	var now = new Date();
	var month = now.getMonth()+1;
	var date = now.getFullYear()+"年"+month+"月";
	pd_top_form.getForm().findField('DataMonth').setValue(date);
	
	
	pd_top_form.show();
};
setDefaultValues();


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
	
	var empValue = pd_top_form.find("name", "EmpId")[0].getRawValue();
	var deptValue = pd_top_form.find("name", "DeptId")[0].getRawValue();
	var WithholdV	= pd_top_form.find("name", "Withhold")[0].getRawValue();
	var arr1 = empValue.split(' ');
	var arr2 = deptValue.split(' ');
	//  fields: ['ID','EmpId','Name','DeptId','Withhold'],
	var record = new Ext.data.Record({
		ID:1,
		EmpId:arr1[0],
		Name:arr1[1],
		DeptId:arr2[0],
		Withhold:WithholdV
	});
	pd_grid.stopEditing();
	pd_store.insert(0,record);//可以自定义在stroe的某个位置插入一行数据。
	pd_grid.startEditing(3, 0);
	//pd_top_form.find("name", "EmployeeCode")[0].setValue("");
	
}
function getId(pd_grid) {
	var s = pd_grid.getSelectionModel().getSelected();
	if (s) {
		return s.id;
	}
	return 0;
}







//======卡类型选择=====






//定义列
var cm = new Ext.grid.ColumnModel({
		defaults : {
			sortable : false,
			menuDisabled : true,
			multiSelect : true
		},
//fields: ['ID','EmpId','Name','DeptId','Withhold'],
		columns : [new Ext.grid.RowNumberer(), {
				header : 'ID',
				dataIndex : 'ID',
				ID : "ID",
				hidden : true,
				width : 125
			}, {
				header : '<center style="font-weight:bold;">工号</center>',
				dataIndex : 'EmpId',
				width : 125,
				align : 'left'
			}, {
				header : '<center style="font-weight:bold;">姓名</center>',
				dataIndex : "Name",
				width : 125,
				align : 'center'
			}, {
				header : '<center style="font-weight:bold;">身份证号</center>',
				dataIndex : "sCode",
				width : 175

			}, {
				header : '<center style="font-weight:bold;">代扣标准</center>',
				dataIndex : "Withhold",
				width : 125

			}
		]
	});




var pd_grid = new Ext.grid.EditorGridPanel({
		store : pd_store,
		cm : cm,
		stripeRows : true,
		//frame: true,
		margins : "2 2 2 2",
		border : false,
		selModel : new Ext.grid.RowSelectionModel({
			singleSelect : false
		}), //设置单行选中模式, 否则将无法删除数据
		//sm: sm,
		loadMask : true
	});


//主容器
var pd_main_panel = new Ext.Panel({
		//autotoWidth:true,
		layout : "anchor",
		//anchorSize: { width: 800, height: 600 },
		items : [{
				frame : true,
				border : false,
				items : [pd_top_form]
			}, {
				layout : "fit",
				border : false,
				anchor : '-1 -150',
				items : [pd_grid]
			}
		]
	});


centerPanel.add(pd_main_panel);
centerPanel.doLayout();