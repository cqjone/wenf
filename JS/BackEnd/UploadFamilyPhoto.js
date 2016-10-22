            //全局参数，点击获取ID
            var tar_dept = new Ext.data.Store({
            		autoDestroy : true,
            		url : '../Apis/BaseInfoUtil.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
            		reader : new Ext.data.JsonReader({
            			fields : [{
            					name : "CombineWord",
            					mapping : "CombineWord"
            				}, {
            					name : "ID",
            					mapping : "ID"
            				}
            			]
            		}),
            		sortInfo : {
            			field : 'CombineWord',
            			direction : 'ASC'
            		}
            	});
            var ParaID = null;
            var ParaCode = null;
            var PhotoPath = null;
            var ImagesPath = "../Imgs/DeptPhoto/";

            var start = 0 //起始记录
            	var limit = 99999 //每页记录

            	var FieldsList = ["ID", "Code", "Title", "PhotoPath", "UploadTime", "操作"];

            var Body_store = new Ext.data.Store({

            		url : "../Apis/UploadFamilyPhoto.aspx?actionName=uploadGetList",
            		reader : new Ext.data.JsonReader({
            			root : "results",
            			id : "Code",
            			totalProperty : "totalCount",
            			fields : FieldsList,

            		}),
            		groupField : 'Code',
            		sortInfo : {
            			field : 'Code',
            			direction : "ASC"
            		}
            	});

            Body_store.load({
            	params : {
            		start : start,
            		limit : limit
            	}
            }); //载入数据。


            //===================function end==============================//


            var sm = new Ext.grid.CheckboxSelectionModel();

            var cm = new Ext.grid.ColumnModel([//创建GridPanel中的列集合。
            			new Ext.grid.RowNumberer(), //自动编号。


            			//sm,//复选框。
            			{
            				header : 'ID',
            				align : "left",
            				dataIndex : 'ID',
            				hidden : true,
            			}, {
            				header : '<b>门店编号</b>',
            				align : "left",
            				dataIndex : 'Code',
            				sortable : true
            			}, {
            				header : '<b>门店名称</b>',
            				align : "left",
            				dataIndex : 'Title',
            				sortable : true
            			}, {
            				header : '<b>全家福照片</b>',
            				align : "center",
            				dataIndex : 'PhotoPath',
							width:200,
            				menuDisabled : true,

            				renderer : function (value) {
            					var myDate = new Date();
            					var strTime = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + ":" + myDate.getMilliseconds();
            					var path = ImagesPath + value + "?time=" + strTime;

            					return String.format("<image src='" + path + "' width='200px'  style='cursor:pointer'  onclick='showPhoto()'/>");
            					//                    }
            				}
            			}, {
            				header : '<b>最近上传时间</b>',
            				align : "center",
            				dataIndex : 'UploadTime',
            				sortable : true
            			}, {
            				header : '<b>操作</b>',
            				dataIndex : "",
            				menuDisabled : true,
            				align : "center",
            				renderer : function (v) {
            					return "<a  onclick='UploadPhoto()' style='text-decoration:underline;cursor:pointer;color:blue;'>上传</a>";
            				}
            			}

            		]);

            //显示内容
            var Body_grid = new Ext.grid.GridPanel({
            		store : Body_store,
            		cm : cm,
            		sm : sm,
            		region : 'center',
            		stripeRows : true,
            		bodyBorder : true,
            		border : true,
            		margins : "2 2 2 2",
            		border : true,
            		//selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
            		//sm: sm,
            		//			loadMask : true,
            	});

            var pd_top_form = new Ext.form.FormPanel({
            		//frame: true,
            		bodyBorder : false,
            		border : false,
            		autoScroll : false,
            		
            		heigh : 100,
            		items : [{
            				xtype : "fieldset",
            				title : "注意事项",
            				style : {
            					marginLeft : '4px',
            					marginTop : '10px'
            				},
            				items : [//third

            					{
            						items : [{
            								xtype : "label",
            								html : '<font style="color:red;">1、具体标准详见2014年9月23日《关于门店每月定期上传全家福的通知》。</font>',
            								style : {
            									marginTop : '3px',
            									marginLeft : '4px'
            								}
            							}
            						]
            					}, {
            						items : [{
            								xtype : "label",
            								html : '<font style="color:red;">2、照片像素为：2048*1536。</font>',
            								style : {
            									marginTop : '3px',
            									marginLeft : '4px'
            								}
            							}
            						]
            					}, {
            						items : [{
            								xtype : "label",
            								html : '<font style="color:red;">3、文件大小最好为1~3MB。</font>',
            								style : {
            									marginTop : '3px',
            									marginLeft : '4px'
            								}
            							}
            						]
            					}

            				]
            			}, {
            				xtype : "fieldset",
            				title : "条件",
            				layout : "column",
            				labelWidth : 50,
            				labelAlign : 'right',
            				items : [{
            						layout : 'form',
            						columnWidth : 0.23,
            						items : [{
            								xtype : "combo",
            								name : "DeptID",
            								hiddenName : "DeptID",
            								fieldLabel : "门 店",
            								store : tar_dept,
            								triggerAction : 'all',
            								width : 170,
            								border : 1,
            								valueField : 'ID',
            								displayField : 'CombineWord',
            								enableKeyEvents : true,
            								selectOnFocus : true,
            								allowBlank : true,
            								forceSelection : true,
            								hideTrigger : true,
            								listeners : {
            									"keyup" : function (v) {
            										var value = v.getRawValue();
            										if (value != null && value.length >= 1) {
            											tar_dept.load({
            												params : {
            													key : value
            												}
            											});

            										}
            									}
            								},
            								style : {
            									marginLeft : '3px'

            								}
            							}
            						]
            					}, {
            						width : 100,
            						style : {

            							marginTop : '-7px'
            						},
            						buttons : [{
            								id : "btnSel",
            								text : "查 询",
            								listeners : {
            									click : function () {
            										searchData();
            									}
            								}

            							}
            						]
            					}
            				]
            			}
            		]
            		
            	});

            //单击事件
            Body_grid.addListener('rowclick', rowclickFn);

            var rowclickFn = function (pd_main_panel, rowIndex, e) {

            	var selectionModel = Body_grid.getSelectionModel();
            	var record = selectionModel.getSelected();

            	var Code = record.data['Code'];
            	var ID = record.data['ID'];
            	var Path = record.data['PhotoPath'];
            	PhotoPath = Path;
            	ParaID = ID;
            	ParaCode = Code;
            }

            var GetPath = function (pd_main_panel, rowIndex, e) {

            	var selectionModel = Body_grid.getSelectionModel();
            	var record = selectionModel.getSelected();

            	var Path = record.data['PhotoPath'];
            	PhotoPath = Path;

            }

            //显示图片
            function showPhoto() {

            	GetPath();
            	var myDate = new Date();
            	var strTime = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + ":" + myDate.getMilliseconds();
            	var picurl = ImagesPath + PhotoPath + "?time=" + strTime;

            	var panel = new Ext.Panel({
            			width : 880,
            			height : 600,
            			autoScroll : false,
            			html : "<div> <img src=" + picurl + " width='880'> </div>"

            		});

            	var win = new Ext.Window({
            			width : 900,
            			height : 'auto',
            			title : ' 全家福照片浏览',

            			modal : true,
            			autoScroll : false,
            			buttons : [{
            					text : '关闭',
            					handler : function () {
            						win.close();
            					}
            				}
            			],
            			items : panel,
            			closable : false,
            		});

            	win.show();
            }

            //主容器
            var pd_main_panel = new Ext.Panel({

            		border : false,
            		layout : "anchor",

            		items : [{
            				frame : true,
            				region : 'north',
            				height : 190,
            				layout : "fit",
            				border : false,
            				items : [pd_top_form]
            			}, {
            				layout : "fit",
            				border : false,
            				anchor : '-1 -1',
            				items : [Body_grid]
            			}
            		]
            	});

            centerPanel.add(pd_main_panel);
            centerPanel.doLayout();

            //上传图片
            function UploadPhoto() {
            	rowclickFn();
            	var Form_Panel = new Ext.form.FormPanel({
            			height : 200,
            			labelWidth : 70,
            			border : false,
            			layout : 'column',
            			fileUpload : true,
            			frame : true,
            			items : [{
            					layout : 'form',
            					border : false,
            					style : 'padding-left:4em;padding-top:4em;',
            					items : [{
            							xtype : 'textfield',
            							fieldLabel : '文件路径',
            							name : 'File',
            							width : 200,
            							inputType : 'file'
            						}
            					]
            				}
            			]
            		});

            	var win_Upload = new Ext.Window({
            			title : ' 上传文件',
            			width : 400,
            			height : 200,
            			modal : true,
            			items : Form_Panel,
            			buttons : [{
            					text : '上传',
            					handler : function () {
            						if (Form_Panel.getForm().isValid()) {
            							Form_Panel.getForm().submit({
            								waitMsg : "正在提交，请稍候...",
            								url : "../Apis/UploadFamilyPhoto.aspx?ID=" + ParaID + "&Code=" + ParaCode + "&actionName=uploadfile",
            								success : function (from, action) {
            									win_Upload.close();
            									Ext.Msg.alert("提示", action.result.msg);
            									Body_store.load({
            										params : {
            											start : start,
            											limit : limit
            										}
            									});
            								},
            								failure : function (form, action) {
            									Ext.Msg.alert("提示", action.result.msg);
            									Body_store.load({
            										params : {
            											start : start,
            											limit : limit
            										}
            									});
            								}
            							});
            						}
            					}
            				}, {
            					text : '取消',
            					handler : function () {
            						win_Upload.hide();
            					}
            				}
            			]
            		});

            	win_Upload.show();
            }
			
			
function searchData() {
    pd_top_form.getForm()
    Body_store.load({
        params: { DeptID: pd_top_form.find('name', 'DeptID')[0].value }
    });
}