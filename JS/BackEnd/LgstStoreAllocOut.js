Ext.onReady(function () {

	var productInfo;
	var pName = '';
	var pType = '';
	var spec = '';
	var unit = '';
	var bar = '';
	var serial = '';
	var pCode = '';

	var isSerial = false;

    Ext.Ajax.request({
        url: '../../Data/iDept.json',
        // params: {
        // 	id: 1
        // }
        success: function (data) {
            var storeData = Ext.decode(data.responseText).iDept;
            var storeInfo = [];
            for (var i = 0, len = storeData.length; i < len; i++) {
                var temp = {};
                temp.store = storeData[i].Code + ' ' + storeData[i].Title + ' ' + storeData[i].KeyCode;
                storeInfo.push(temp);
            }
            storeS.loadData(storeInfo);
        }
    });

    var storeS = new Ext.data.JsonStore({
        fields: ['store'],
        data: []
    });

	// 获取产品信息数据
	Ext.Ajax.request({
	    url: '../../Data/LgstProduct.json',
	    // params: {
	    // 	id: 1
	    // }
	    success: function(data) {
	    	productInfo = Ext.decode(data.responseText).data;

	    	renameJsonKey(productInfo, {
	    		code: 'pCode',
	    		name: 'pName',
	    		type: 'pType',
	    		seq: 'serial'
	    	});

	    }   
	});

	// 数据
	var pStore = new Ext.data.JsonStore({
		fields: ['pCode', 'pName', 'pType', 'spec', 'unit', 'bar', 'serial', 'amount'],
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

	// 布局
	new Ext.Viewport({
		layout: 'border',
		items: [
			{
				xtype: 'panel',
				region: 'north',
				height: 300,
				padding: 10,
				title: '门店调拨出库',
				frame: true,
				items: [
					{
						xtype: 'fieldset',
						title: '注意事项',
						layout: 'absolute',
						height: 80,
						style: {
							color: 'red'
						},
						items: [
							{
								xtype: 'label',
								text: '1、商品代码包括商品编码、条形码、序列码，可手动录入或扫码枪扫描自动录入'
							},
							{
								xtype: 'label',
								y: 20,
								text: '2、选择门店为选择出库货物送至的门店，商品数量默认为1'
							}
						]
					},
					{
						xtype: 'fieldset',
						title: '调拨商品',
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
										xtype: 'form',
										width: 330,
										labelAlign: 'right',
										labelSeparator: '：',
										items: [
											{
												id: 'arrivalDate',
												xtype: 'combo',
                                                fieldLabel: '调出门店',
									    		hideTrigger: true,
                                                width: 180,
                                                maxHeight: 105,
                                                minChars: 1,
                                                queryMode: 'local',
                                                mode: 'local',
                                                store: storeS,
                                                displayField: 'store',
                                                selectOnFocus: true,
                                                enableKeyEvents: true,
                                                listeners: {
                                                    'beforequery': fuzzyQuery,
                                                    'keyup': function () {
                                                    	if (event.keyCode == 13) {
                                                    		Ext.getCmp('pCode').focus();
                                                    	}
                                                    }
                                                }
											}
										]
									},
									// {
									// 	xtype: 'form',
									// 	labelWidth: 40,
									// 	labelAlign: 'right',
									// 	labelSeparator: '：',
									// 	items: [
									// 		{
									// 			id: 'remark',
									// 			xtype: 'textfield',
									// 			fieldLabel: '备注',
									// 			width: 300,
									// 			selectOnFocus: true,
									// 			value: '无'
									// 		}
									// 	]
									// },
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
												text: '提交表单',
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
										xtype: 'form',
										width: 330,
										labelAlign: 'right',
										labelSeparator: '：',
										items: [
											{
												id: 'pCode',
												xtype: 'textfield',
												fieldLabel: '商品代码',
												width: 180,
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
																	if (productInfo[i].serial) {
																		// 有序列码，提示必须输入序列码
																		Ext.getCmp('pInfo').setValue('该商品必须输入序列码');
																		Ext.getCmp('pCode').focus();
																		Ext.getCmp('amount').setValue('');
																	} else {
																		// 没有序列码
																		getInfo(i);
																	}
																	// 找到产品编码或条形码并处理完功能后退出循环
																	break;
																} else if (value == productInfo[i].serial) {
																	// 若为序列码，判断是否已经添加
																	isSerial = true;
																	for (var j = 0, slen = pStore.data.items.length; j < slen; j++) {
																		if (value == pStore.data.items[j].data.serial) {
																			// 若存在，提示不可重复添加
																			isSerial = false;
																			Ext.getCmp('pInfo').setValue('已存在，不能重复添加');
																			Ext.getCmp('pCode').focus();
																			Ext.getCmp('amount').setValue('');
																			break;
																		}
																	}
																	if (j == slen) {
																		// 不存在
																		getInfo(i);
																		Ext.getCmp('amount').setValue(1);
																		addRecord();
																	}
																	// 找到序列码并处理完功能后退出循环
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
															Ext.getCmp('pInfo').setValue('请输入商品编码 / 条形码 / 序列码');
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
										xtype: 'form',
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
								xtype: 'form',
								labelAlign: 'right',
								labelSeparator: '：',
								items: [
									{
										id: 'pInfo',
										xtype: 'displayfield',
										fieldLabel: '商品信息',
										value: '请输入商品编码 / 条形码 / 序列码',
										style: {
											paddingTop: '3px',
											fontSize: '13px',
											fontFamily: 'Microsoft Yahei UI',
											color: 'blue'
										}
									}
								]
							}
						]
					}
				]
			},
			{
				id: 'gridDetail',
				xtype: 'editorgrid',
				region: 'center',
				title: '调拨出库明细',
				frame: true,
				store: pStore,
				stripeRows: true,
				columns: [
					{header: '商品编码', dataIndex: 'pCode', sortable: true},
					{header: '商品名称', dataIndex: 'pName', sortable: true},
					{header: '类型', dataIndex: 'pType', sortable: true},
					{header: '规格', dataIndex: 'spec', sortable: true},
					{header: '单位', dataIndex: 'unit', sortable: true},
					{header: '条形码', dataIndex: 'bar', sortable: true},
					{header: '序列码', dataIndex: 'serial', sortable: true, width: 150},
					{header: '数量', dataIndex: 'amount', sortable: true, width: 90, css: 'text-align: right;', renderer: formatDigits},
					{header: '操作', width: 60,
				        // 添加删除列
				        renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
				        	window.deleteRecord = function(id) {
				        		var record = store.getById(id);
				        		var pName = record.data.pName;
				        		var pCode = record.data.pCode;
		                    	Ext.Msg.confirm('提示', '确定要删除 “' + pName + ' (' + pCode + ')” 吗？', function (button) {
		            				if (button == 'yes') {
		                        		store.remove(record);
		                        	}
		                        });
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
			}
		]
	});

	setTimeout(function () {
		Ext.getCmp('arrivalDate').focus();
	}, 0);

	// 获取产品信息
	function getInfo(i) {
		pCode = productInfo[i].pCode;
		pName = productInfo[i].pName;
		pType = productInfo[i].pType;
		spec = productInfo[i].spec;
		unit = productInfo[i].unit;
		bar = productInfo[i].bar;
		serial = productInfo[i].serial;
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
			if (isSerial) {
				// 序列码
				var newRecord = new Ext.data.Record({'pCode': pCode, 'pName': pName, 'pType': pType, 'spec': spec, 'unit': unit, 'bar':bar, 'serial': serial, 'amount': amount });
				pStore.addSorted(newRecord);
			} else {
				// 不是序列码
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
					var newRecord = new Ext.data.Record({'pCode': pCode, 'pName': pName, 'pType': pType, 'spec': spec, 'unit': unit, 'bar':bar, 'serial': serial, 'amount': amount });
					pStore.addSorted(newRecord);
				}
			}

			Ext.getCmp('pCode').setValue('').focus();
			Ext.getCmp('pInfo').setValue('请输入商品编码 / 条形码 / 序列码');
			Ext.getCmp('amount').setValue('');
		} else if (pCode == '') {
			Ext.getCmp('pCode').focus();
		} else {
			Ext.getCmp('amount').focus();
		}
		isSerial = false;
	}

	// 提交按钮
	function submit() {
		if (Ext.getCmp('arrivalDate').getValue() == '') {
			Ext.getCmp('arrivalDate').focus();
			return;
		}
		Ext.getCmp('btn_submit').setDisabled(true);

		var mask = new Ext.LoadMask(Ext.getBody(), { msg: '正在提交，请稍候...' });
		mask.show();

		// 数据
		var arrivalDate = Ext.getCmp('arrivalDate').getValue();
		// var remark = Ext.getCmp('remark').getValue();

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
		temp.store = arrivalDate;
		// temp.remark = remark;
		temp.data = data;
		var json = Ext.encode(temp);
		console.log(json);

		// 提交到服务器
		Ext.Ajax.request({
		    url: '../../Php/LgstTest.php',
		    params: {
		    	data: json
		    },
		    success: function () {
		    	mask.hide();
		    	pStore.loadData([]);
		    	Ext.Msg.alert('提示', '提交成功，要货申请表已提交！');
		    	Ext.getCmp('btn_submit').setText('已提交');
		    },
		    failure: function () {
		    	mask.hide();
		    	Ext.Msg.show({
		    		title: '提示',
		    		msg: '<span style="color: red;">提交发生错误，请重新尝试！</span>',
		    		buttons: Ext.Msg.OK
		    	});
				Ext.getCmp('btn_submit').setDisabled(false);
		    }
		});
	}

});