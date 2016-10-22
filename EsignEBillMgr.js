var eBill;

Ext.Ajax.request({
	url: '../../JSON/EsignEBill.json',
	success: function (data) {
		eBill = Ext.decode(data.responseText).data;
		storeEBill.loadData(eBill);
	}
});

var storeEBill = new Ext.data.JsonStore({
	fields: ['TempNo', 'TempName', 'content'],
	data: [],
    sortInfo: {
    	field: 'TempNo',
    	direction: 'ASC'
    }
});

// 主界面
// ===============================================================================================
var pd_panel = new Ext.Panel({
    bodyBorder: false,
    border: false,
	layout: 'border',
	items: [
		{
			id: 'header',
			xtype: 'panel',
			region: 'north',
			frame: true,
			height: 180,
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
							text: '1、模板编号可修改，但不可重复'
						},
						{
							xtype: 'label',
							y: 20,
							text: '2、增加模板时，模板编号和名称为必填项'
						}
					]
				},
				{
					xtype: 'fieldset',
					title: '模板管理',
					height: 70,
					items: [
						{
							xtype: 'panel',
							layout: 'column',
							style: {
								marginLeft: '40px'
							},
							items: [
								{
									xtype: 'button',
									text: '增加模板',
									width: 80,
									height: 24,
									style: {
										marginRight: '30px'
									},
									handler: function () {
										new Ext.Window({
											id: 'addTemp',
											width: 300,
											height: 190,
											closable: true,
											title: '增加模板',
											modal: true,
											resizable: false,
											items: [
												{
													xtype: 'form',
													frame: true,
													height: 190,
													padding: 10,
													labelSeparator: '：',
													labelWidth: 60,
													items: [
														{
															id: 'newTempNo',
															xtype: 'textfield',
															fieldLabel: '模板编号',
														    selectOnFocus: true,
															enableKeyEvents: true,
															listeners: {
																keyup: function (field) {
																	var newValue = field.getValue();
																	if (newValue == '') {
																		Ext.getCmp('btn_save2').setDisabled(true);
																		return;
																	}
																	for (var i = 0; i < eBill.length; i++) {
																		if (eBill[i].TempNo == newValue) {
																			Ext.getCmp('tip2').setValue('模板编号重复，请重新输入');
																			Ext.getCmp('btn_save2').setDisabled(true);
																			return;
																		}
																	}
																	Ext.getCmp('tip2').setValue('');
																	if (Ext.getCmp('newTempName').getValue() != '') {
																		Ext.getCmp('btn_save2').setDisabled(false);
																	}
																	if (event.keyCode == 13) {
																		Ext.getCmp('newTempName').focus();
																	}
																}
															}
														},
														{
															id: 'tip2',
															xtype: 'displayfield',
															height: 24,
															style: {
																paddingTop: '3px',
																fontSize: '13px',
																fontFamily: 'Microsoft Yahei UI',
																color: 'red'
															}
														},
														{
															id: 'newTempName',
															xtype: 'textfield',
															fieldLabel: '模板名称',
														    selectOnFocus: true,
															enableKeyEvents: true,
															listeners: {
																keyup: function (field) {
																	if (field.getValue() != '') {
																		Ext.getCmp('btn_save2').setDisabled(false);
																	} else {
																		Ext.getCmp('btn_save2').setDisabled(true);
																	}
																	if (event.keyCode == 13 && field.getValue() != '') {
																		var TempNo = Ext.getCmp('newTempNo').getValue();
																		var TempName = Ext.getCmp('newTempName').getValue();
																		var newRecord = new Ext.data.Record({'TempNo': TempNo, 'TempName': TempName, 'content':'' });
																		storeEBill.addSorted(newRecord);
																		Ext.getCmp('addTemp').close();
																	}
																}
															}
														},
														{
															xtype: 'panel',
															layout: 'column',
															items: [
																{
																	id: 'btn_save2',
																	xtype: 'button',
																	text: '确定',
																	width: 80,
																	height: 24,
																	disabled: true,
																	style: {
																		marginTop: '20px',
																		marginLeft: '40px'
																	},
																	handler: function () {
																		var TempNo = Ext.getCmp('newTempNo').getValue();
																		var TempName = Ext.getCmp('newTempName').getValue();
																		var newRecord = new Ext.data.Record({'TempNo': TempNo, 'TempName': TempName, 'content':'' });
																		storeEBill.addSorted(newRecord);
																		Ext.getCmp('addTemp').close();
																	}
																},
																{
																	xtype: 'button',
																	text: '取消',
																	width: 80,
																	height: 24,
																	style: {
																		marginTop: '20px',
																		marginLeft: '20px'
																	},
																	handler: function () {
																		Ext.getCmp('addTemp').close();
																	}
																}
															]
														}
													]
												}
											]
										}).show();
										setTimeout(function () {
											Ext.getCmp('newTempNo').focus();
										}, 10);
									}
								},
								{
									id: 'btn_submit',
									xtype: 'button',
									text: '提交',
									width: 80,
									height: 24,
									handler: function () {
										Ext.getCmp('btn_submit').setDisabled(true);

										var mask = new Ext.LoadMask(Ext.getBody(), { msg: '正在提交，请稍候...' });
										mask.show();

										var data = Ext.pluck(storeEBill.data.items, 'data');
										var temp = {};
										temp.data = data;
										var json = Ext.encode(temp);

										Ext.Ajax.request({
										    url: '...',
										    params: {
										    	data: json
										    },
										    success: function () {
										    	mask.hide();
										    	storeEBill.loadData([]);
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
								}
							]
						}
					]
				}
			]
		},
		{
			id: 'tempList',
			xtype: 'grid',
			region: 'center',
			title: '模板列表',
			frame: true,
			store: storeEBill,
			columns: [
				{ header: '模板编号', dataIndex: 'TempNo', sortable: true },
				{ header: '模板名称', dataIndex: 'TempName', sortable: true, width: 250 },
				{ header: '操作', width: 150,
					renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
			        	window.removeTemp = function(id) {
			        		var record = store.getById(id);
			        		var TempName = record.data.TempName;
			        		var TempNo = record.data.TempNo;
	                    	Ext.Msg.confirm('提示', '确定要删除模板 “' + TempName + ' (' + TempNo + ')” 吗？', function (button) {
	            				if (button == 'yes') {
	                        		store.remove(record);
	                        	}
	                        });
			        	}
			        	window.editTemp = function (id) {
			        		var recordId = id;
			        		var record = store.getById(id);
			        		var TempNo = record.data.TempNo;
			        		var TempName = record.data.TempName;
			        		var content = record.data.content;

			        		var ueHeight = document.documentElement.clientHeight;

			        		// 编辑模板
							new Ext.Window({
								id: 'editTemp',
								width: 1040,
								height: ueHeight-30,
								closable: false,
								modal: true,
								resizable: false,
								layout: 'anchor',
								items: [
									{
										xtype: 'panel',
									    bodyBorder: false,
									    border: false,
										layout: 'column',
										title: '编辑模板',
										anchor: '100%',
										height: 120,
										padding: 10,
										frame: true,
										items: [
											{
												xtype: 'form',
												labelSeparator: '：',
												items: [
													{
														id: 'TempNo',
														xtype: 'textfield',
														fieldLabel: '模板编号',
														selectOnFocus: true,
														enableKeyEvents: true,
														style: {
															marginBottom: '10px'
														},
														listeners: {
															keyup: function (e) {
																if (event.keyCode == 13) {
																	e.blur();
																}
															},
															focus: function () {
																Ext.getCmp('btn_save').setDisabled(true);
															},
															blur: function (field) {
																var newValue = field.getValue();
																for (var i = 0; i < eBill.length; i++) {
																	if (eBill[i].TempNo == newValue && newValue != TempNo) {
																		Ext.getCmp('tip').setValue('模板编号重复，请重新输入');
																		field.focus();
																		return;
																	}
																}
																Ext.getCmp('tip').setValue('');
																Ext.getCmp('btn_save').setDisabled(false);
															}
														}
													},
													{
														id: 'TempName',
														xtype: 'textfield',
														fieldLabel: '模板名称',
														selectOnFocus: true,
														enableKeyEvents: true,
														listeners: {
															keyup: function (e) {
																if (event.keyCode == 13) {
																	e.blur();
																}
															}
														}
													}
												]
											},
											{
												xtype: 'form',
												labelWidth: 10,
												columnWidth: 0.6,
												items: [
													{
														id: 'tip',
														xtype: 'displayfield',
														style: {
															paddingTop: '3px',
															fontSize: '13px',
															fontFamily: 'Microsoft Yahei UI',
															color: 'red'
														}
													}
												]
											},
											{
												id: 'btn_save',
												xtype: 'button',
												text: '保存',
												width: 80,
												height: 30,
												style: {
													marginTop: '30px'
												},
												handler: function () {
													var TempNo = Ext.getCmp('TempNo').getValue();
													var TempName = Ext.getCmp('TempName').getValue();
													var content = ue.getContent();
													storeEBill.getById(recordId).set('TempNo', TempNo);
													storeEBill.getById(recordId).set('TempName', TempName);
													storeEBill.getById(recordId).set('content', content);
													ue.destroy();
													Ext.getCmp('editTemp').close();
												}
											},
											{
												xtype: 'button',
												text: '取消',
												width: 80,
												height: 30,
												style: {
													marginTop: '30px',
													marginLeft: '30px'
												},
												handler: function () {
													ue.destroy();
													Ext.getCmp('editTemp').close();
												}
											}
										]
									},
									{
										xtype: 'panel',
									    bodyBorder: false,
									    border: false,
										anchor: '100% 0',
										html: '<script id="editor" type="text/plain" style="width:1024px;height:' + (ueHeight - 270) + 'px;"></script>'
									}
								]
							}).show();

							var ue = UE.getEditor('editor');
			        		Ext.getCmp('TempNo').setValue(TempNo);
			        		Ext.getCmp('TempName').setValue(TempName);
			        		Ext.getCmp('editTemp').show();
			        		ue.ready(function () {
			        			ue.setContent(content);
			        		});
			        	}
			        	window.previewTemp = function (id) {
			        		var record = store.getById(id);
			        		var TempNo = record.data.TempNo;
			        		var TempName = record.data.TempName;
			        		var content =  record.data.content;

			        		var preview = new Ext.Window({
								width: 1024,
								closable: true,
								title: '预览模板&nbsp;&nbsp;&nbsp;&nbsp;模板编号：' + TempNo + '&nbsp;&nbsp;&nbsp;&nbsp;模板名称：' + TempName,
								modal: true,
								resizable: false,
								items: [
									{
										xtype: 'panel',
									    bodyBorder: false,
									    border: false,
										html: content
									}
								]
							});

			        		preview.show();
			        	}
			            var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="editTemp(\'' + record.id + '\')">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="previewTemp(\'' + record.id + '\')">预览</a>&nbsp;&nbsp;&nbsp;&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="removeTemp(\'' + record.id + '\')">删除</a>';
			            return returnStr;
			        }
			    }
			]
		}
	]
});

// 主界面
var pd_main_panel = new Ext.Panel({
	border: false,
	layout: 'fit',
	items: [pd_panel]
});
centerPanel.add(pd_main_panel);
centerPanel.doLayout();
