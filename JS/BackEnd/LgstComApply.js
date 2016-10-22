	var productInfo;
	var pName = '';
	var pType = '';
	var spec = '';
	var unit = '';
	var bar = '';
	var pCode = '';
	var s = '';

	// 获取产品信息数据
	Ext.Ajax.request({
	    url: '../Data/LgstProduct.json',
	    // params: {
	    // 	id: 1
	    // }
	    success: function(data) {
	    	productInfo = Ext.decode(data.responseText).data;

	    	renameJsonKey(productInfo, {
	    		code: 'pCode',
	    		name: 'pName',
	    		type: 'pType'
	    	});

	    }
	});

	// 数据
	var pStore = new Ext.data.JsonStore({
		fields: ['pCode', 'pName', 'pType', 'spec', 'unit', 'bar', 'amount'],
		data: [],
	    sortInfo: {
	    	field: 'pCode',
	    	direction: 'ASC'
	    }
	});

	// grid editor
	var editor = new Ext.grid.GridEditor({
		field: {
			xtype: 'numberfield',
			allowBlank: false
		}
	});

	var grid = new Ext.grid.GridPanel({
		id: 'gridDetail',
		xtype: 'editorgrid',
		region: 'center',
		title: '申请明细',
		frame: true,
		store: pStore,
		stripeRows: true,
		columns: [
			new Ext.grid.RowNumberer(),
			{header: '商品编码43R5', dataIndex: 'pCode', sortable: true},
			{header: '商品名称', dataIndex: 'pName', sortable: true},
			{header: '类型', dataIndex: 'pType', sortable: true},
			{header: '规格', dataIndex: 'spec', sortable: true},
			{header: '单位', dataIndex: 'unit', sortable: true},
			{header: '条形码', dataIndex: 'bar', sortable: true},
			{header: '数量', dataIndex: 'amount', sortable: true, width: 90, css: 'text-align: right;'},
			{header: '自有/外购', width: 80},
			{header: '操作', width: 60,
				// 添加删除列
				renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
					window.deleteRecord = function(id) {
						var record = store.getById(id);
						var pName = record.data.pName;
						var pCode = record.data.pCode;
						var win = new Ext.Window({
							title:"提示",
							width:300,
							height:150,
							// draggable:false,//是否能拖拽
							modal: true,//设置模态框背后的界面不可操作
							closeAction:'close',
							items:[
								{
									xtype:"panel",
									padding:10,
									html:'确定要删除 “' + pName + ' (' + pCode + ')” 吗？'
								}
							],
							buttonAlign:'center',
							buttons: [
								{ xtype: "button",
								text: "确定",
								handler: function () {
									win.close();store.remove(record);
								}},
								{ xtype: "button",
								text: "取消",
								handler: function () {
									win.close();
								}}
							]
						});
						win.show();
					}
					var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="deleteRecord(\'' + record.id + '\')">删除</a>';
					return returnStr;
				}
			}
		],
		viewConfig: {
			getRowClass: function(record, i) {
				$('.new-record').toggleClass('new-record');
				var _this = this;
				setTimeout(function () {
					$(_this.scroller.dom).scrollTop(19 * i);
				}, 0);
				return 'new-record';
			}
		}
	})
	var serch = new Ext.FormPanel({
        // title: '查询',
        // frame: true,
        height: 260,
        items: [
        {
            layout: 'form',
            xtype: 'fieldset',
            autoHeight: true,
            title: '注意事项',
            defaultType: 'label',
            style: {
                color: 'red'
            },
            items: [
			{
				text: '1、商品代码包括商品编码、条形码，可手动录入或扫码枪扫描自动录入',
				style: {
					padding: '5px',
					display: 'block'
				}
			},{
				xtype: 'label',
				text: '2、到货日期默认为当前日期，商品数量默认为1',
				style: {
					padding: '5px',
					display: 'block'
				}
			}]
		},
		{
			layout: 'form',
			xtype: 'fieldset',
			height:160,
			title: '申请商品',
			items: [
			{
				xtype: 'panel',
				layout: 'column',
				padding: '10px 0 10px 0',
				style: {
					borderBottom: '1px dashed #bbb'
				},
				items: [
					{
						layout: 'form',
						width: 280,
						labelAlign: 'right',
						labelSeparator: '：',
						items: [
							{
								id: 'arrivalDate',
								xtype: 'datefield',
								fieldLabel: '到货日期',
								width: 130,
								value: new Date(),
								format: 'Y-m-d'
							}
						]
					},
					{
						layout: 'form',
						labelWidth: 40,
						labelAlign: 'right',
						labelSeparator: '：',
						items: [
							{
								id: 'remark',
								xtype: 'textfield',
								fieldLabel: '备注',
								width: 300,
								selectOnFocus: true,
								value: '无'
							}
						]
					},
					{
						xtype: 'panel',
						style: {
							marginLeft: '40px'
						},
						items: [
							{
								id: 'btn_submit',
								xtype: 'button',
								width: 80,
								height: 24,
								text: '提交申请',
								handler: submit
							}
						]
					}
				]
			},
			{
				xtpe: 'panel',
				layout: 'column',
				padding: '20px 0 0 0',
				items: [
					{
						layout: 'form',
						width: 280,
						labelAlign: 'right',
						labelSeparator: '：',
						items: [
							{
								id: 'pCode',
								xtype: 'textfield',
								fieldLabel: '商品代码',
								width: 130,
								selectOnFocus: true,
								enableKeyEvents: true,
								listeners: {
									// 产品代码输入框失去焦点后对输入内容进行判断
									blur: function (e) {
										var value = e.getValue();
										// 输入框有内容才执行产品代码是否存在的判断
										if (value) {
											for (var i = 0, len = productInfo.length; i < len; i++) {
												// 先判断产品编码和条形码
												if (value == productInfo[i].pCode || value == productInfo[i].bar) {
													// 若为产品编码或条形码
													getInfo(i);
													// 找到产品编码或条形码并处理完功能后退出循环
													break;
												}
											}
											// 循环结束后，提示没有找到该产品
											if (i == len) {
												Ext.getCmp('pInfo').setValue('没有找到该商品');
												Ext.getCmp('pCode').focus();
												Ext.getCmp('amount').setValue('');
											}
										} else {
											Ext.getCmp('pInfo').setValue('请输入商品编码 / 条形码');
										}
									},

									keyup: function (e) {
										if (event.keyCode == 13 && e.getValue() != '') {
											Ext.getCmp('amount').setValue(1).focus();
										}
									}
								}
							}
						]
					},
					{
						layout: 'form',
						labelWidth: 40,
						labelAlign: 'right',
						labelSeparator: '：',
						items:[
							{
								id: 'amount',
								xtype: 'numberfield',
								width: 100,
								fieldLabel: '数量',
								minValue: 1,
								allowDecimals: false,
								selectOnFocus: true,
								enableKeyEvents: true,
								listeners: {
									'keyup': function (e) {
										if (event.keyCode == 13 && e.getValue() !== '') {
											addRecord();
										}
									}
								}

							}
						]
					},
					{
						xtype: 'panel',
						style: {
							marginLeft: '40px'
						},
						items: [
							{
								xtype: 'button',
								width: 80,
								height: 24,
								text: '添加记录',
								handler: addRecord
							}
						]
					}
				]
			},
			{
				layout: 'form',
				labelAlign: 'right',
				labelSeparator: '：',
				items: [
					{
						id: 'pInfo',
						xtype: 'displayfield',
						fieldLabel: '商品信息',
						value: '请输入商品编码 / 条形码',
						style: {
							paddingTop: '3px',
							fontSize: '13px',
							fontFamily: 'Microsoft Yahei UI',
							color: 'blue'
						}
					}
				]
			}]
		}]
    });

	//主容器
	var main_panel = new Ext.Panel({
		border: false,
		layout: "anchor",
		items: [
			{
				frame: true,
				// border: false,
				items: [serch]
			}
			, {
				anchor: '-0 -270',
				layout: "fit",
				border: false,
				items: [grid]
			}
		]
	});



	// 自动聚焦
	Ext.getCmp('pCode').focus();

	// 获取产品信息
	function getInfo(i) {
		pCode = productInfo[i].pCode;
		pName = productInfo[i].pName;
		pType = productInfo[i].pType;
		spec = productInfo[i].spec;
		unit = productInfo[i].unit;
		bar = productInfo[i].bar;
		var tip = pName + ' 规格：' + spec;
		Ext.getCmp('pInfo').setValue(tip);
	}

	// 添加按钮：向grid中添加一行数据
	function addRecord() {
		var amount = Ext.getCmp('amount').getValue();
		if (amount < 1) {
			Ext.getCmp('pInfo').setValue('数量不能小于1');
			Ext.getCmp('amount').selectText();
		} else if (pCode != '' && amount !== '') {

			// 同码合并
			for (var j = 0, slen = pStore.data.items.length; j < slen; j++) {
				if (pCode == pStore.getAt(j).get('pCode')) {
					// 若存在重复只修改数量
					var sum = pStore.getAt(j).get('amount') + amount;
					pStore.getAt(j).set('amount', sum);
					break;
				}
			}
			if (j == slen) {
				// 不存在重复则直接添加
				var newRecord = new Ext.data.Record({'pCode': pCode, 'pName': pName, 'pType': pType, 'spec': spec, 'unit': unit, 'bar':bar, 'amount': amount });
				pStore.addSorted(newRecord);
			}

			Ext.getCmp('pCode').setValue('').focus();
			Ext.getCmp('pInfo').setValue('请输入商品编码 / 条形码');
			Ext.getCmp('amount').setValue('');
		} else if (pCode == '') {
			Ext.getCmp('pCode').focus();
		} else {
			Ext.getCmp('amount').focus();
		}
	}

	// 提交按钮
	function submit() {
		if (Ext.getCmp('arrivalDate').getValue() == '') {
			Ext.getCmp('arrivalDate').focus();
			return;
		} else if (Ext.getCmp('remark').getValue() == '') {
			Ext.getCmp('remark').focus();
			return;
		}

		Ext.getCmp('btn_submit').setDisabled(true);

		var mask = new Ext.LoadMask(Ext.getBody(), { msg: '正在提交，请稍候...' });
		mask.show();

		// 数据
		var arrivalDate = Ext.getCmp('arrivalDate').getValue();
		var remark = Ext.getCmp('remark').getValue();

		var data = Ext.pluck(pStore.data.items, 'data');
		var arrPCode = Ext.pluck(data, 'pCode');
		var arrAmount = Ext.pluck(data, 'amount');

		var data = [];

		for (var i = 0; i < arrPCode.length; i++) {
			var temp = {};
			temp.pCode = arrPCode[i];
			temp.amount = arrAmount[i];
			data.push(temp);
		}

		var temp = {};
		temp.arrivalDate = arrivalDate;
		temp.remark = remark;
		temp.data = data;
		var json = Ext.encode(temp);
		console.log(json);

		// 提交到服务器
		// Ext.Ajax.request({
		    // url: '../../Php/LgstTest.php',
		    // params: {
		    	// data: json
		    // },
		    // success: function () {
		    	// mask.hide();
		    	// pStore.loadData([]);
		    	// Ext.Msg.alert('提示', '提交成功，要货申请表已提交！');
		    	// Ext.getCmp('btn_submit').setText('已提交');
		    // },
		    // failure: function () {
		    	// mask.hide();
		    	// Ext.Msg.show({
		    		// title: '提示',
		    		// msg: '<span style="color: red;">提交发生错误，请重新尝试！</span>',
		    		// buttons: Ext.Msg.OK
		    	// });
				// Ext.getCmp('btn_submit').setDisabled(false);
		    // }
		// });
	}


	centerPanel.add(main_panel);
	centerPanel.doLayout();