
var formField = new Ext.FormPanel({
	// height: 190,
	bodyBorder: false,
    border: false,
	// title: '库存查询',
	// padding: 10,
	items: [
		{
			xtype: 'fieldset',
			title: '注意事项',
			layout: 'absolute',
			height: 60,
			style: {
				color: 'red'
			},
			items: [
				{
					xtype: 'label',
					text: '查询条件不能为空，可模糊查询'
				}
			]
		},
		{
			xtype: 'fieldset',
			title: '查询条件',
			layout: 'column',
			items: [
				{
					layout: 'form',
					width: 260,
					labelAlign: 'right',
					labelSeparator: '：',
					items: [
						{
							id: 'pCode',
							xtype: 'combo',
							fieldLabel: '商品编码',
							maxHeight: 105,
							name: 'pCode',
							width: 130,
							// minChars: 1,
							// queryMode: 'local',
							// mode: 'local',
							// store: indexStore,
							// displayField: 'pCode',
							selectOnFocus: true,
							enableKeyEvents: true,
							listeners: {
								// keyup: queryGrid,
								// beforequery: fuzzyQuery
							}
						}
					]
				},
				{
					layout: 'form',
					width: 210,
					labelWidth: 48,
					labelSeparator: '：',
					items: [
						{
							id: 'serial',
							xtype: 'textfield',
							fieldLabel: '序列码',
							width: 130,
							selectOnFocus: true,
							enableKeyEvents: true,
							listeners: {
								// keyup: queryGrid
							}
						}
					]
				},
				{
					layout: 'form',
					width: 230,
					labelWidth: 60,
					labelSeparator: '：',
					items: [
						{
							id: 'pType',
							xtype: 'combo',
							fieldLabel: '商品类型',
							maxHeight: 105,
							name: 'pType',
							width: 130,
							// queryMode: 'local',
							// mode: 'local',
							// store: indexPTypeStore,
							// displayField: 'pType',
							selectOnFocus: true,
							enableKeyEvents: true,
							listeners: {
								// keyup: queryGrid,
								// beforequery: fuzzyQuery
							}
						}
					]
				},
				{
					xtype: 'panel',
					width: 110,
					items: [
						{
							xtype: 'button',
							text: '查询',
							width: 80,
							height: 24
							// handler: queryGrid
						}
					]
				},
				{
					xtype: 'panel',
					items: [
						{
							xtype: 'button',
							text: '清空',
							width: 80,
							height: 24
							// handler: clearCombo
						}
					]
				}
			]
		}
	]
});
var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    heigh: 100,
    //autoWidth:true,
    items: [{
            html: "<font color='red' size='2'>*本功能用作查询和修改当天本店已开户的积分账户的资料!</font>"
    },{
        id: "sw",
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
                xtype: "textfield",
                fieldLabel: "客户姓名",
                name: "customerName",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "身份证号码",
                name: "idNo",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "卡号",
                name: "iCardId",
                anchor: "100%"
            }]
        }, {
            layout: "form",
            columnWidth: 0.4,
            items: [{
                xtype: "textfield",
                fieldLabel: "手机号码",
                name: "mobileNo",
                anchor: "100%"
            }, {
                xtype: "textfield",
                fieldLabel: "电子邮件",
                name: "email",
                anchor: "100%"
            }]
        }, {
            layout: "hbox",
            bodyStyle: "margin:0 5px",
            width: 140,
            items: [{
                xtype: "button",
                boxMinWidth: 40,
                width: 60,
                text: " 查  询",
                handler: function () {
    
                }
            }]
        }]
    }]
});




//定义 勾选框SM
var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: false });

//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default
    },
    columns: [new Ext.grid.RowNumberer(),
		{header: '商品编码', dataIndex: 'pCode', sortable: true},
		{header: '商品名称', dataIndex: 'pName', width: 200, sortable: true},
		{header: '商品类型', dataIndex: 'pType', sortable: true},
		{header: '规格', dataIndex: 'size', sortable: true},
		{header: '单位', dataIndex: 'unit', sortable: true},
		{header: '序列码', dataIndex: 'serial', sortable: true, width: 150},
		{header: '条形码', dataIndex: 'bar', sortable: true},
		{header: '数量', dataIndex: 'count', sortable: true, 
		css: 'text-align: right; padding-right: 10px', renderer:function(value) {
            //格式化数字输出
            return Ext.util.Format.number(value, '0,000');
        },editor: new Ext.form.NumberField({
            allowBlank: false
        })}
	]
});


var pd_grid = new Ext.grid.GridPanel({
    store: [],
    frame: true,
    // margins: "2 2 2 2",
    border: false,
	title: '查询结果',
	cm:cm
	
	//设置单行选中模式, 否则将无法删除数据
    //selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), 
    //sm: sm,
    //loadMask: true
});


//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "anchor",
    items: [
		{
			frame: true,
			// border: false,
			items: [formField]
		}
		, {
			anchor: '-0 -155',
			layout: "fit",
			border: false,
			items: [pd_grid]
		}
	]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();