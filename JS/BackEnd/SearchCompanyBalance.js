//查卡

//全局变量
var CardCode = "";
var PublishDate = "";

var dept_store = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/VerifyCode.aspx?actionName=GetDeptNamelist&type=1&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [{
					name : "DeptName",
					mapping : "DeptName"
				}
			]
		}),
		sortInfo : {
			field : 'DeptName',
			direction : 'ASC'
		}
	});

function formatMoney(s, type) {
	if (/[^0-9\.]/.test(s))
		return "0";
	if (s == null || s == "")
		return "0";
	s = s.toString().replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
		s = s.replace(re, "$1,$2");
	s = s.replace(/,(\d\d)$/, ".$1");
	if (type == 0) { // 不带小数位(默认是有小数位)
		var a = s.split(".");
		s = a[0];
	}
	return s;
}


var type_store = new Ext.data.Store({
		autoDestroy : true,
		url : '../Apis/CardMgr.aspx?actionName=getType&sid=' + Sys.sid,
		reader : new Ext.data.JsonReader({
			fields : [{
					name : "ID",
					mapping : "ID"
				}, {
					name : "Title",
					mapping : "Title"
				}
			]
		}),
		sortInfo : {
			field : 'ID',
			direction : 'ASC'
		}
	});

// utilize custom extension for Hybrid Summary
var cardSummary = new Ext.ux.grid.GridSummary();
var jckSummary = new Ext.ux.grid.GridSummary();


var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : true,
		heigh : 100,
		items: [
            {
                xtype: 'fieldset',
                title: '查询条件',
                layout: 'column',
                items: [
                    {
                        layout: 'form',
                        columnWidth: 0.35,
                        items: [
                            {
                                xtype: "combo",
                                fieldLabel: "门 店",
                                name: "DeptName",
                                anchor: "93%",
                                triggerAction: 'all',
                                store: dept_store,
                                valueField: 'DeptName',
                                displayField: 'DeptName',
                                enableKeyEvents: true,
                                selectOnFocus: true,
                                allowBlank: true,
                                listeners: {
                                    "keyup": function (v) {
                                        tar_store.load({
                                            params: { dName: v.getRawValue() }
                                        });
                                    }
                                }
                            }
                         ]
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
                    }
                ]
            }
         ]
});

	var fm = Ext.form;
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
			// specify any defaults for each column
			defaults : {
				sortable : false,
				menuDisabled : true,
				multiSelect : true
			},
			columns : [new Ext.grid.RowNumberer(), {
					dataIndex : 'DeptName',
					header : '店名',
				}, {
					dataIndex : 'DisplayBalance',
					header : '卡余额',
					align :'right'

				}
			]

		});

	// create the Data Store
	var pd_store = new Ext.data.Store({
			autoDestroy : true,
			//autoLoad: true,
			// load remote data using HTTP
			url: '../Apis/CardMgr.aspx?actionName=balanceQuery&sid=' + Sys.sid,
			reader : new Ext.data.JsonReader({
				record : 'CardInfo',
				idProperty : 'DeptName',
				root : 'results',
				totalProperty : 'totalCount',
				fields : [{
						name : "DeptName",
						mapping : "DeptName"
					}, {
						name : 'CardBalance',
						mapping : 'CardBalance'
					},
					 {
						name : 'DisplayBalance',
						mapping : 'DisplayBalance'
					},
				]
			}),
			listeners : {

				load : function (records, options, success) {

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
			store : pd_store,
			cm : cm,
			sm : sm,
			//frame: true,
			margins : "2 2 2 2",
			border : false,
			//selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
			//sm: sm,
			loadMask : true,
			bbar : new Ext.PagingToolbar({
				pageSize : 40,
				store : pd_store,
				displayInfo : true,
				displayMsg : '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
				emptyMsg : "没有记录"
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

	
	
	function searchData() {
		pd_top_form.getForm()
		pd_store.load({
			params : {
				dName : pd_top_form.find('name', 'DeptName')[0].value
			}
		});
	}
	
	//===================function end==============================//

	//主容器
	var pd_main_panel = new Ext.Panel({
			//autoScroll: true,
			border : false,
			//autoWidth:true,
			layout : "anchor",
			//anchorSize: { width: 800, height: 600 },
			items : [{
					frame : true,
					border : false,
					items : [pd_top_form]
				}, {
					layout : "fit",
					border : false,
					anchor : '-1 -140',
					items : [pd_grid]
				}
			]
		});

	centerPanel.add(pd_main_panel);
	centerPanel.doLayout();