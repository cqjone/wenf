Ext.onReady(function () {

	var pName = '';
	var pType = '';
	var spec = '';
	var unit = '';
	var bar = '';
	var serial = '';
	var pCode = '';

	var isSerial = false;

	canBeAdded = false;

	// 数据
	var pStore = new Ext.data.JsonStore({
		fields: ['pCode', 'pName', 'pType', 'spec', 'unit', 'bar', 'serial', 'amount'],
		data: [],
	    sortInfo: {
	    	field: 'pCode',
	    	direction: 'ASC'
	    }
	});

	// 盘点表
	var productInfo;
	Ext.Ajax.request({
		url: '../../Data/LgstProduct.json',
		success: function (res) {
			productInfo = Ext.decode(res.responseText).data;

			renameJsonKey(productInfo, {
	    		code: 'pCode',
	    		name: 'pName',
	    		type: 'pType',
	    		seq: 'serial'
	    	});

		}
	});

	// 从服务器获取数据
	Ext.Ajax.request({
	    url: '../../Data/LgstStoreInventory.json',
	    success: function (resData) {
	    	var data = Ext.decode(resData.responseText).data;
	    	for (var i = 0; i < data.length; i++) {
	    		for (var j = 0; j < productInfo.length; j ++) {
	    			if (data[i].pCode == productInfo[j].pCode) {
	    				var newRecord = new Ext.data.Record({
	    					'pCode': data[i].pCode,
	    					'pName': productInfo[j].pName,
	    					'pType': productInfo[j].pType,
	    					'spec': productInfo[j].spec,
	    					'unit': productInfo[j].unit,
	    					'bar': productInfo[j].bar,
	    					'serial': data[i].serial,
	    					'amount': data[i].amount
	    				});
						pStore.addSorted(newRecord);
	    				break;
	    			}
	    		}
	    	}
	    }
	});

	// 布局
	new Ext.Viewport({
		layout: 'border',
		items: [
			{
				xtype: 'panel',
				region: 'north',
				frame: true,
				title: '门店盘点',
				height: 320,
				padding: 10,
				items: [
					{
						xtype: 'fieldset',
						title: '注意事项',
						layout: 'absolute',
						height: 100,
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
								text: '2、盘点数量默认为1，且数量可为零或负数'
							},
							{
								xtype: 'label',
								y: 40,
								text: '3、勾选【只盘点以下商品】后，商品盘点数量为0一定要录入'
							}
						]
					},
					{
						xtype: 'fieldset',
						title: '盘点商品',
						items: [
							{
								xtype: 'panel',
								layout: 'column',
								items: [
									{
										xtype: 'form',
										labelAlign: 'right',
										labelSeparator: '：',
										items: [
											{
												xtype: 'textfield',
												id: 'pCode',
												name: 'code',
												fieldLabel: '商品代码',
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
																		canBeAdded = false;
																	} else {
																		// 没有序列码
																		getInfo(i);
																		canBeAdded = true;
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
																			canBeAdded = false;
																			break;
																		}
																	}
																	if (j == slen) {
																		// 不存在
																		getInfo(i);
																		Ext.getCmp('amount').setValue(1);
																		canBeAdded = true;
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
																canBeAdded = false;
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
										labelWidth: 10,
										items: [
											{
												id: 'pInfo',
												xtype: 'displayfield',
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
							},
							{
								xtype: 'form',
								frame: false,
								labelAlign: 'right',
								labelSeparator: '：',
								items: [
									{
										xtype: 'numberfield',
										id: 'amount',
										name: 'amount',
										fieldLabel: '商品数量',
										allowDecimals: false, 
										selectOnFocus: true,
										enableKeyEvents: true,
										listeners: {
											keyup: function (e) {
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
								layout: 'column',
								items: [
									{
										xtype: 'button',
										text: '添加记录',
										width: 80,
										height: 30,
										style: {
											marginTop: '10px',
											marginLeft: '105px'
										},
										handler: addRecord
									},
									{
										xtype: 'button',
										text: '批量存储',
										width: 80,
										height: 30,
										style: {
											marginTop: '10px',
											marginLeft: '105px'
										},
										handler: bulkStorage
									},
									{
										xtype: 'button',
										text: '暂存清单',
										width: 80,
										height: 30,
										style: {
											marginTop: '10px',
											marginLeft: '100px'
										},
										handler: btnTempSave
									},
									{
										xtype: 'panel',
										style: {
											marginTop: '10px',
											marginLeft: '60px'
										},
										items: [
											{
												id: 'btn_submit',
												xtype: 'button',
												text: '盘点完成',
												width: 80,
												height: 30,
												handler: finishInv
											},
											{
												id: 'only',
												xtype: 'checkbox',
												boxLabel: '只盘点以下商品',
												checked: true
											}
										]
									}
								]
							}							
						]
					}
				]
			},				
			{
				id: 'grid',
				xtype: 'grid',
				region: 'center',
				frame: true,
				title: '盘点清单',
				store: pStore,
				stripeRows: true,
				columns: [
					{header: '商品编码', dataIndex: 'pCode', sortable: true},
					{header: '商品名称', dataIndex: 'pName'},
					{header: '类型', dataIndex: 'pType'},
					{header: '规格', dataIndex: 'spec'},
					{header: '单位', dataIndex: 'unit'},
					{header: '条形码', dataIndex: 'bar'},
					{header: '序列码', dataIndex: 'serial', width: 150},
					{header: '数量', dataIndex: 'amount', width: 90, css: 'text-align: right;', renderer: formatDigits},
					{header: '操作',
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
			        	if (!mase) {
							$('.new-record').toggleClass('new-record');
						}
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
	
	var modal = new Ext.Window({
		width: 500,
		height: 300,
		closable: false,
		header: false,
		modal: true,
		resizable: false,
		items: [
			{
				id: 'tab',
				xtype: 'tabpanel',
				activeTab: 0,
				height: 320,
				style: {
					textAlign: 'center',
					marginTop: '-30px'
				},
				items: [
					{
						id: 'step1',
						title: 'Step1',
						frame: true,
						items: [
							{
								xtype: 'displayfield',
								value: '步骤一：使用扫码枪扫下列条形码转换为【盘点模式】<br>完成后单击下一步',
								style: {
									marginTop: '10px',
									marginBottom: '10px',
									font: '16px 微软雅黑',
									color: 'red'
								}
							},
							{
								xtype: 'panel',
								html: '<img	src="../../Imgs/bc_inventoryMode.jpg" height="120">'
							},
							{
								xtype: 'panel',
								layout: 'column',
								style: {
									marginTop: '10px'
								},
								items: [
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '取消',
										style: {
											marginLeft: '150px'
										},
										handler: cancelBS
									},
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '下一步',
										style: {
											marginLeft: '20px'
										},
										handler: function () {
											Ext.getCmp('tab').setActiveTab(Ext.getCmp('step2'));
										}
									}
								]
							}
						]
					},
					{
						id: 'step2',
						title: 'Step2',
						frame: true,
						items: [
							{
								xtype: 'displayfield',
								value: '步骤二：使用扫码枪扫下列条形码清除存储数据，以确保不影响本次扫码<br>完成后单击下一步',
								style: {
									marginTop: '10px',
									marginBottom: '10px',
									font: '14px 微软雅黑',
									color: 'red'
								}
							},
							{
								xtype: 'panel',
								html: '<img	src="../../Imgs/bc_clear.jpg" height="120">'
							},
							{
								xtype: 'panel',
								layout: 'column',
								style: {
									marginTop: '10px'
								},
								items: [
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '取消',
										style: {
											marginLeft: '150px'
										},
										handler: cancelBS
									},
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '下一步',
										style: {
											marginLeft: '20px'
										},
										handler: function () {
											Ext.getCmp('tab').setActiveTab(Ext.getCmp('step3'));
										}
									}
								]
							}
						]
					},
					{
						id: 'step3',
						title: 'Step3',
						frame: true,
						items: [
							{
								xtype: 'displayfield',
								value: '步骤三：现在可以开始扫商品条码<br>所有商品扫码完成后单击下一步',
								style: {
									marginTop: '80px',
									marginBottom: '10px',
									font: '16px 微软雅黑',
									color: 'red'
								}
							},
							{
								xtype: 'panel',
								height: 52
							},
							{
								xtype: 'panel',
								layout: 'column',
								style: {
									marginTop: '10px'
								},
								items: [
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '取消',
										style: {
											marginLeft: '150px'
										},
										handler: cancelBS
									},
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '下一步',
										style: {
											marginLeft: '20px'
										},
										handler: function () {
											Ext.getCmp('tab').setActiveTab(Ext.getCmp('step4'));
											if (window.addEventListener) {
												window.addEventListener('keyup', keyListener);
											} else {
												document.attachEvent('onkeypress', keyListener);
											}
										}
									}
								]
							}
						]
					},
					{
						id: 'step4',
						title: 'Step4',
						frame: true,
						items: [
							{
								xtype: 'displayfield',
								value: '步骤四：使用扫码枪扫下列条形码上传数据<br>上传数据过程中不要进行任何操作，直到屏幕显示上传完成',
								style: {
									marginTop: '10px',
									marginBottom: '10px',
									font: '16px 微软雅黑',
									color: 'red'
								}
							},
							{
								xtype: 'panel',
								html: '<img	src="../../Imgs/bc_upload.jpg" height="120">'
							},
							{
								id: 'loadTip',
								xtype: 'displayfield',
								value: '等待数据上传',
								style: {
									marginTop: '10px',
									marginBottom: '10px',
									font: '16px 微软雅黑',
									color: 'blue'
								}
							},
							{
								xtype: 'panel',
								layout: 'column',
								style: {
									marginTop: '10px'
								},
								items: [
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '取消',
										style: {
											marginLeft: '150px'
										},
										handler: function() {
											if (window.removeEventListener) {
												window.removeEventListener('keyup', keyListener);
											} else {
												document.detachEvent('onkeyup', keyListener);
											}
											cancelBS();
										}
										
									},
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '添加数据',
										style: {
											marginLeft: '20px'
										},
										handler: function () {
											if (window.removeEventListener) {
												window.removeEventListener('keyup', keyListener);
											} else {
												document.detachEvent('onkeyup', keyListener);
											}
											loadCode();
											Ext.getCmp('tab').setActiveTab(Ext.getCmp('step5'));
										}
									}
								]
							}
						]
					},
					{
						id: 'step5',
						title: 'Step5',
						frame: true,
						items: [
							{
								id: 'tip',
								xtype: 'displayfield',
								value: '',
								style: {
									marginTop: '80px',
									marginBottom: '10px',
									font: '16px 微软雅黑',
									color: 'blue'
								}
							},
							{
								xtype: 'panel',
								height: 52
							},
							{
								xtype: 'button',
								width: 80,
								height: 30,
								text: '确定',
								style: {
									margin: '10px auto'
								},
								handler: function () {
									Ext.getCmp('tab').setActiveTab(Ext.getCmp('step6'));
								}
							}
						]
					},
					{
						id: 'step6',
						title: 'Step6',
						frame: true,
						items: [
							{
								xtype: 'displayfield',
								value: '步骤五：使用扫码枪扫下列条形码清空数据<br>完成后单击下一步',
								style: {
									marginTop: '10px',
									marginBottom: '10px',
									font: '16px 微软雅黑',
									color: 'red'
								}
							},
							{
								xtype: 'panel',
								html: '<img	src="../../Imgs/bc_clear.jpg" height="120">'
							},
							{
								xtype: 'panel',
								layout: 'column',
								style: {
									marginTop: '10px'
								},
								items: [
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '取消',
										style: {
											marginLeft: '150px'
										},
										handler: cancelBS
									},
									{
										xtype: 'button',
										width: 80,
										height: 30,
										text: '下一步',
										style: {
											marginLeft: '20px'
										},
										handler: function () {
											Ext.getCmp('tab').setActiveTab(Ext.getCmp('step7'));
										}
									}
								]
							}
						]
					},
					{
						id: 'step7',
						title: 'Step7',
						frame: true,
						items: [
							{
								xtype: 'displayfield',
								value: '步骤六：使用扫码枪扫下列条形码转换成【普通模式】<br>批量存储完成',
								style: {
									marginTop: '10px',
									marginBottom: '10px',
									font: '16px 微软雅黑',
									color: 'red'
								}
							},
							{
								xtype: 'panel',
								html: '<img	src="../../Imgs/bc_normalMode.jpg" height="120">'
							},
							{
								xtype: 'button',
								width: 80,
								height: 30,
								text: '完成',
								style: {
									margin: '10px auto'
								},
								handler: cancelBS
							}
						]
					}
				]
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
		serial = productInfo[i].serial;
		var tip = pName + ' 规格：' + spec;
		Ext.getCmp('pInfo').setValue(tip);
	}

	// 添加一条记录 需要修改
	function addRecord() {
		var amount = Ext.getCmp('amount').getValue();
		if (pCode != '' && amount !== '' && canBeAdded) {

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
		canBeAdded = false;
	}

	// 手动单击暂存按钮
	function btnTempSave() {
		tempSave();
		Ext.Msg.alert('暂存', '暂存成功！');
	}

	// 批量存储
	function bulkStorage() {
		Ext.getCmp('pCode').setDisabled(true);
		Ext.getCmp('amount').setDisabled(true);
		Ext.getCmp('tab').setActiveTab(Ext.getCmp('step1'));
		modal.show();
	}

	// 取消批量存储
	function cancelBS() {
		Ext.getCmp('pCode').setDisabled(false);
		Ext.getCmp('amount').setDisabled(false);
		arrCode = [];
		modal.hide();
	}

	var code = '';
	var arrCode = [];

	// 监听获取扫码
	function keyListener() {
		var key = String.fromCharCode(event.keyCode);
		var reg = /^[0-9a-zA-Z]$/;
		if (reg.test(key)) {
			code += key;
		} else if (event.keyCode == 13) {
			arrCode.push(code);
			code = '';
		}
	}

	var mase = false;
	// 读取扫码
	function loadCode() {
		Ext.getCmp('pCode').setDisabled(false);
		Ext.getCmp('amount').setDisabled(false);

		var mask = new Ext.LoadMask(Ext.getBody(), { msg: '正在处理数据，请稍候...' });
		mask.show();

		$('.new-record').toggleClass('new-record');
		mase = true;
		var invalid = 0;
		for (var i = 0; i < arrCode.length; i++) {
			Ext.getCmp('pCode').focus().setValue(arrCode[i]);
			Ext.getCmp('amount').focus().setValue(1);
			if (!canBeAdded) {
				invalid++;
			}
			addRecord();
		}

		mase = false;

		Ext.getCmp('pCode').setValue('');
		Ext.getCmp('amount').setValue('');
		Ext.getCmp('pCode').setDisabled(true);
		Ext.getCmp('amount').setDisabled(true);
		arrCode = [];
		mask.hide();

		Ext.getCmp('tab').setActiveTab(Ext.getCmp('step5'));
		Ext.getCmp('tip').setValue('数据添加完成，共添加' + (i - invalid) + '条数据，' + invalid + '条无效数据');
		tempSave();
	}

	// 暂存
	function tempSave() {

		var data = Ext.pluck(pStore.data.items, 'data');
		var arrPCode = Ext.pluck(data, 'pCode');
		var arrAmount = Ext.pluck(data, 'amount');
		var arrSerial = Ext.pluck(data, 'serial');

		var data = [];
		for (var i = 0; i < arrPCode.length; i++) {
			var temp = {};
			temp.pCode = arrPCode[i];
			temp.serial = arrSerial[i];
			temp.amount = arrAmount[i];
			data.push(temp);
		}

		var temp = {};
		temp.submit = false;
		temp.data = data;
		var json = Ext.encode(temp);


		console.log(json)

		// 提交到服务器
		Ext.Ajax.request({
		    url: '../../Php/LgstTest.php',
		    params: {
		    	data: json
		    },
		    success: function(data) {
				console.log('暂存成功！');
		    }
		});
	}

	// 盘点完成
	function finishInv() {
		Ext.getCmp('btn_submit').setDisabled(true);

		var mask = new Ext.LoadMask(Ext.getBody(), { msg: '正在提交，请稍候...' });
		mask.show();

		var data = Ext.pluck(pStore.data.items, 'data');
		var arrPCode = Ext.pluck(data, 'pCode');
		var arrAmount = Ext.pluck(data, 'amount');
		var arrSerial = Ext.pluck(data, 'serial');

		var data = [];
		for (var i = 0; i < arrPCode.length; i++) {
			var temp = {};
			temp.pCode = arrPCode[i];
			temp.serial = arrSerial[i];
			temp.amount = arrAmount[i];
			data.push(temp);
		}

		var temp = {};
		temp.submit = true;
		temp.only = Ext.getCmp('only').checked;
		temp.data = data;
		var json = Ext.encode(temp);

		console.log(json);

		// 清空本地存储
		localStorage.clear(tempSave);

		// 提交到服务器
		Ext.Ajax.request({
		    url: '../../Php/LgstTest.php',
		    params: {
		    	data: json
		    },
		    success: function () {
		    	mask.hide();
		    	pStore.loadData([]);
		    	Ext.Msg.alert('提示', '盘点完成，数据已成功上传！');
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

	var t = 0;
	var diff = 0;

	// 每隔一分钟暂存一次
	setInterval(function () {
		var len = arrCode.length;
		if (len == 0) {
			Ext.getCmp('loadTip').setValue('等待数据上传');
		} else if (diff == len) {
			Ext.getCmp('loadTip').setValue('上传完毕，共' + len + '条数据，单击添加数据');
		} else {
			diff = len;
			Ext.getCmp('loadTip').setValue('正在上传，已上传' + len + '条数据');
		}
		t++;
		if (t % 60 == 0) {
			tempSave();
		}
	
	}, 1000);

});