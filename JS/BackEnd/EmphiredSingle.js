
/*    员工录入(收银员类)       */

Ext.onReady(function () {

    var dotype = -1; // 操作类型, 0:修改 , 1:新建
    Store_GetDept.load();

    var Form_Top = new Ext.form.FormPanel({
        items: [
			{
			    xtype: 'fieldset',
			    //height:60,
			    layout: 'column',
			    items: [
					{
					    xtype: 'button',
					    width: 70,
					    text: '查询',
					    style: 'margin-left:2em;',
					    handler: function () {
					        win_Search.show();
					    }
					},
					{
					    xtype: 'button',
					    width: 70,
					    text: '新建单据',
					    style: 'margin-left:1em;',
					    handler: function () {
					        win_newEmphiredSingle.show();
							Form_newEmphiredSingle.getForm().isValid();
					    }
					}
				]
			}
		]
    });

    var Form_Search = new Ext.form.FormPanel({
        frame: true,
        border: false,
        labelWidth: 80,
        items: [
			{
			    xtype: 'fieldset',
			    title: '查询条件',
			    layout: 'column',
			    labelAlign: 'right',
			    items: [
					{
					    columnWidth: 0.5,
					    layout: 'form',
					    items: [
							{
							    xtype: 'datefield',
							    name: 'HireDate',
							    fieldLabel: '录用开始日期',
							    value: new Date(),
							    format: 'Y-m-d',
							    anchor: '100%'
							},
							{
							    xtype: 'combo',
							    name: 'DeptName',
							    hiddenName: 'DeptId',
							    fieldLabel: '部门',
							    mode: 'remote',
							    triggerAction: 'all',
								typeAhead:true,
							    minChars:1,
							    store: Store_GetDept,
							    valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '100%'
							},
							{
							    xtype: 'textfield',
							    name: 'EmpCode',
							    fieldLabel: '员工编号',
							    anchor: '100%'
							},
							{
							    xtype: 'combo',
							    hiddenName: 'FromDeptId',
							    fieldLabel: '来源部门',
							    mode: 'remote',
							    triggerAction: 'all',
							    typeAhead: true,
							    minChars: 1,
							    store: Store_GetDept,
							    valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '100%'
							},
							{
							    xtype: 'textfield',
							    name: 'Tel_Mobile',
							    fieldLabel: '座机或手机',
							    anchor: '100%'
							}
						]
					},
					{
					    columnWidth: 0.5,
					    layout: 'form',
					    items: [
							{
							    xtype: 'datefield',
							    name: 'FireDate',
							    fieldLabel: '录用结束日期',
							    value: new Date(),
							    format: 'Y-m-d',
							    anchor: '100%'
							},
							{
							    xtype: 'textfield',
							    name: 'DutyTitle',
							    fieldLabel: '职位',
							    anchor: '100%'
							},
							{
							    xtype: 'textfield',
							    name: 'EmpTitle',
							    fieldLabel: '员工姓名',
							    anchor: '100%'
							},
							{
							    xtype: 'combo',
							    name: 'GroupState',
							    fieldLabel: '组状态',
							    mode: 'local',
							    triggerAction: 'all',
							    editable: false,
							    store: GpStateStore,
							    valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '100%'
							}
						]
					}
				]
			}
		]
    });
    var Form_Values_Search;
    var win_Search = new Ext.Window({
        title: '查询',
        width: 500,
        height: 250,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        items: [Form_Search],
        buttons: [
			{
			    text: '确定',
			    handler: function () {
			        //Store_EmphiredSingle.load({
			        //	params:Form_Search.getForm().getValues()
			        //});
			        Form_Values_Search = Form_Search.getForm().getValues();
			        Store_EmphiredSingle.load({
			            params: Form_Values_Search
			        });
			        win_Search.hide();
			    }
			},
			{
			    text: '取消',
			    handler: function () {
			        win_Search.hide();
			    }
			}
		],
        listeners: {
            'hide': function () {
                Form_Search.getForm().reset();
                Form_Search.find('name', 'GroupState')[0].clearValue();
            }
        }
    });

    var Store_EmphiredSingle = new Ext.data.JsonStore({
        url: '../Apis/EmphiredSingle.aspx?actionName=Search&sid=' + Sys.sid,
        totalProperty: 'totalCount',
        root: 'results',
        fields: ['Id', 'CreateDate', 'EmpCode', 'EmpTitle', 'DeptName', 'FromDeptTitle', 'DutyName', 'GroupType', 'HireDate', 'Nvarchar2', 'Sex', 'Age', 'Degree', 'Tel', 'Mobile', 'Nvarchar1', 'MemoInfo'],
        listeners: {
            'beforeload': function () {
                Store_EmphiredSingle.baseParams = Form_Values_Search;
                Store_EmphiredSingle.baseParams.start = 0;
                Store_EmphiredSingle.baseParams.limit = 25;
            }
        }
    });

    var Grid_EmphiredSingle = new Ext.grid.GridPanel({
        store: Store_EmphiredSingle,
        stripeRows: true,
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
				new Ext.grid.RowNumberer(),
				{ dataIndex: 'CreateDate', header: '单据日期' },
				{ dataIndex: 'EmpCode', header: '工号' },
				{ dataIndex: 'EmpTitle', header: '姓名' },
				{ dataIndex: 'DeptName', header: '部门' },
				{ dataIndex: 'FromDeptTitle', header: '来源部门' },
				{ dataIndex: 'DutyName', header: '职位' },
				{ dataIndex: 'GroupType', header: '组状态' },
				{ dataIndex: 'HireDate', header: '录用日期' },
				{ dataIndex: 'Nvarchar2', header: '聘用方式' },
				{ dataIndex: 'Sex', header: '性别' },
				{ dataIndex: 'Age', header: '年龄' },
				{ dataIndex: 'Degree', header: '学历' },
				{ dataIndex: 'Tel', header: '座机' },
				{ dataIndex: 'Mobile', header: '手机' },
				{ dataIndex: 'Nvarchar1', header: '籍贯' },
				{ dataIndex: 'MemoInfo', header: '备注' }
			]
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: Store_EmphiredSingle,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
            emptyMsg: "没有记录"
        }),
        listeners: {
            'rowdblclick': function (g, rowIndex, e) {
                win_newEmphiredSingle.show();
                win_newEmphiredSingle.buttons[1].setDisabled(true);
                var FNew_items = Form_newEmphiredSingle.getForm();
                FNew_items.items.each(function (cc) {
                    cc.setDisabled(true);
                });
                var a = g.getStore().getAt(rowIndex);
                Form_newEmphiredSingle.load({
                    url: '../Apis/EmphiredSingle.aspx?actionName=ShowhireSingleById&sid=' + Sys.sid,
                    params: { Id: a.data.Id },
                    success: function () {
                        Form_newEmphiredSingle.getForm().items.each(function (single) {
                            if (single.xtype == 'combo') {
                                if (single.getValue().length <= 0) {
                                    single.clearValue();
                                }
                            }
                        });
                    }
                });

            }
        }
    });

    var Form_newEmphiredSingle = new Ext.form.FormPanel({

        reader: new Ext.data.JsonReader({
            fields: [
				{ name: 'Id' },
				{ name: 'EmpCode' },
				{ name: 'EmpTitle' },
				{ name: 'State' },
				{ name: 'DetpName' },
				{ name: 'DeptId', mapping: 'DeptID' },
                { name: 'FromDeptId', mapping: 'FormDeptID' },
				{ name: 'DutyName', mapping: 'DutyName' },
				{ name: 'DutyId', mapping: 'DutyID' },
				{ name: 'IsGlobal', mapping: 'IsGlobal' },
				{ name: 'Sex' },
				{ name: 'IdNo' },
				{ name: 'HireDate' },
				{ name: 'FireDate'  },
				{ name: 'Birthday' },
				{ name: 'Degree' },
				{ name: 'Politics' },
				{ name: 'Tel' },
				{ name: 'Nvarchar2' },
				{ name: 'Marriage' },
				{ name: 'FromDeptId', mapping: 'FromDeptID', convert: function (v) {
				    if (v == '0') {
				        return '';
				    } else {
				        return v;
				    }
				}
				},
				{ name: 'BaseWage' },
				{ name: 'BaseWageInfo' },
				{ name: 'Age' },
				{ name: 'Rank' },
				{ name: 'Nvarchar1' },
				{ name: 'Nation' },
				{ name: 'Nvarchar3' },
				{ name: 'GroupType' },
				{ name: 'Mobile' },
				{ name: 'PepTalent' },
				{ name: 'PepNotes' },
				{ name: 'TrainRecords' },
				{ name: 'SocRelations' },
				{ name: 'MemoInfo' },
				{ name: 'UnitInfo' },
				{ name: 'IdentInfo' },
				{ name: 'PermInfo' }
			]
        }),

        frame: true,
        border: false,
        labelWidth: 80,
        labelAlign: 'right',
        autoScroll: true,
        items: [
			{
			    xtype: 'fieldset',
			    title: '单据信息',
			    layout: 'column',
			    style: 'margin-top:5px;',
			    items: [
					{
					    layout: 'column',
					    columnWidth: 0.5,
					    items: [
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'EmpCode',
									    fieldLabel: '工号',
									    value: '自动编号',
									    disabled: true,
									    enableKeyEvents: true,
									    anchor: '100%',
									    listeners:
										{
										    'keypress': function (thi, e) {
										        if (e.getKey() == 13) {
										            GetPerson_rehab('Code', this.getValue());
										        }
										    }
										}
									},
									{
									    xtype: 'combo',
									    name: 'DutyName',
									    hiddenName: 'DutyId',
									    fieldLabel: '职位',
									    allowBlank: false,
									    mode: 'remote',
									    triggerAction: 'all',
									    editable: false,
									    store: Store_GetDuty,
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									},
									{
									    xtype: 'datefield',
									    name: 'HireDate',
									    fieldLabel: '录用时间',
									    value: new Date(),
									    format: 'Y-m-d',
									    allowBlank: false,
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    name: 'Politics',
									    fieldLabel: '政治面貌',
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: new Ext.data.ArrayStore({
									        fields: ['myId', 'displayText'],
									        data: [[0, '少先队员'], [1, '党员'], [2, '团员'], [3, '群众']]
									    }),
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    hiddenName: 'FromDeptId',
									    fieldLabel: '来源部门',
									    mode: 'remote',
									    triggerAction: 'all',
									    typeAhead:true,
										minChars:1,
									    store: Store_GetDept,
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Age',
									    fieldLabel: '年龄',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Nvarchar3',
									    fieldLabel: '户籍所在地',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'EmpTitle',
									    enableKeyEvents: true,
									    fieldLabel: '姓名',
									    allowBlank: false,
									    anchor: '100%',
									    listeners:
										{
										    'keypress': function (thi, e) {
										        if (e.getKey() == 13) {
										            GetPerson_rehab('Title', this.getValue());
										        }
										    }
										}
									},
									{
									    xtype: 'combo',
									    hiddenName: 'IsGlobal',
									    fieldLabel: '全局做单',
										value:'0',
									    allowBlank: false,
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: ifStore,
									    valueField: 'id',
									    displayField: 'name',
									    anchor: '100%'
									},
									{
									    xtype: 'datefield',
									    name: 'FireDate',
									    fieldLabel: '离职时间',
									    value: '2999-12-31',
									    format: 'Y-m-d',
									    allowBlank: false,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Tel',
									    fieldLabel: '座机',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'BaseWage',
									    fieldLabel: '补贴',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Rank',
									    fieldLabel: '星级',
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    name: 'GroupType',
									    fieldLabel: '组状态',
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: GpStateStore,
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
									    name: 'PepNotes',
									    fieldLabel: '个人简历',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
									    name: 'SocRelations',
									    fieldLabel: '社会关系',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    name: 'UnitInfo',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
									    name: 'UnitInfo',
									    fieldLabel: '用人单位意见',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
									    name: 'PermInfo',
									    fieldLabel: '人事审批意见',
									    anchor: '100%'
									}
								]
							}
						]
					},
					{
					    layout: 'column',
					    columnWidth: 0.5,
					    items: [
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'combo',
									    name: 'State',
									    fieldLabel: '在岗状态',
									    allowBlank: false,
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: PostStateStore,
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    name: 'Sex',
									    fieldLabel: '性别',
									    allowBlank: false,
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: new Ext.data.ArrayStore({
									        fields: ['myId', 'displayText'],
									        data: [[0, '男'], [1, '女']]
									    }),
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									},
									{
									    xtype: 'datefield',
									    name: 'Birthday',
									    fieldLabel: '出生日期',
									    value: new Date(),
									    format: 'Y-m-d',
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    name: 'Nvarchar2',
									    fieldLabel: '聘用方式',
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: new Ext.data.ArrayStore({
									        fields: ['myId', 'displayText'],
									        data: [[0, '社会招聘'], [1, '学校分配'], [2, '复职']]
									    }),
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%',
									    listeners: {
									        'select': function () {
									            if (this.getValue() == 2) {
									                Form_newEmphiredSingle.find('name', 'EmpCode')[0].setDisabled(false);
									                Form_newEmphiredSingle.find('name', 'EmpCode')[0].setValue('');
									            } else {
									                var selectedIndex = Form_newEmphiredSingle.find('name', 'Nvarchar2')[0].getValue();
									                Form_newEmphiredSingle.getForm().reset();
									                Form_newEmphiredSingle.find('name', 'Nvarchar2')[0].setValue(selectedIndex);
									                Form_newEmphiredSingle.find('name', 'EmpCode')[0].setDisabled(true);
									                Form_newEmphiredSingle.find('name', 'EmpCode')[0].setValue('自动编号');
									            }
									        }
									    }
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'combo',
									    name: 'DeptName',
									    hiddenName: 'DeptId',
										typeAhead:true,
									    fieldLabel: '部门',
									    allowBlank: false,
									    mode: 'remote',
									    triggerAction: 'all',
									    store: Store_GetDept,
									    valueField: 'myId',
									    displayField: 'displayText',
										minChars:1,
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'IdNo',
									    fieldLabel: '身份证号',
									    allowBlank: false,
									    enableKeyEvents: true,
									    anchor: '100%',
									    listeners: {
									        'keypress': function (thi, e) {
									            if (e.getKey() == 13) {
									                //判断格式
									                var idno = thi.getValue();
									                //alert(idno.length);
									                if (idno.length != 15 && idno.length != 18) {
									                    Ext.Msg.alert("提示", "身份证号码格式不正确！");
									                    return;
									                }
									                //截取
									                //alert(getAgeByIdNO(idno));
									                //return;
									                //显示年龄
									                Form_newEmphiredSingle.find('name', 'Age')[0].setValue(getAgeByIdNO(idno));

									                //显示生日
									                Form_newEmphiredSingle.find('name', 'Birthday')[0].setValue(getBirthdayByIdNo(idno));
									                GetPerson_rehab('IdNo', this.getValue());
									            }
									        }
									    }
									},
									{
									    xtype: 'combo',
									    name: 'Degree',
									    fieldLabel: '学历',
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: new Ext.data.ArrayStore({
									        fields: ['myId', 'displayText'],
									        data: [[0, '小学'], [1, '初中'], [2, '高中'], [3, '中专'], [4, '大专'], [5, '本科'], [6, '硕士'], [6, '博士']]
									    }),
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									},
									{
									    xtype: 'combo',
									    name: 'Marriage',
									    fieldLabel: '婚姻状况',
									    mode: 'local',
									    triggerAction: 'all',
									    editable: false,
									    store: new Ext.data.ArrayStore({
									        fields: ['myId', 'displayText'],
									        data: [[0, '未婚'], [1, '已婚'], [2, '离婚'], [3, '复婚'], [4, '未知']]
									    }),
									    valueField: 'myId',
									    displayField: 'displayText',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'BaseWageInfo',
									    fieldLabel: '补贴条件',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'Nvarchar1',
									    fieldLabel: '籍贯',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'Mobile',
									    fieldLabel: '手机',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 0.5,
							    items: [
									{
									    xtype: 'textfield',
									    name: 'Nation',
									    fieldLabel: '民族',
									    anchor: '100%'
									},
									{
									    xtype: 'textfield',
									    name: 'PepTalent',
									    fieldLabel: '特长',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
									    name: 'TrainRecords',
									    fieldLabel: '岗位培训记录',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
									    name: 'MemoInfo',
									    fieldLabel: '备注',
									    anchor: '100%'
									}
								]
							},
							{
							    layout: 'form',
							    columnWidth: 1,
							    items: [
									{
									    xtype: 'textarea',
									    name: 'IdentInfo',
									    fieldLabel: '技术鉴定意见',
									    anchor: '100%'
									}
								]
							}
						]
					}
				]
			}
		]

    });

    var win_newEmphiredSingle = new Ext.Window({
        title: '员工录用单',
        width: '80%',
        height: 560,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        items: [Form_newEmphiredSingle],
        buttons: [
			{
			    text: '新建',
			    handler: clear_Form_newEmphiredSingle

			},
			{
			    text: '保存',
			    name: 'Btn_Save',
			    handler: function () {
			        if (!Form_newEmphiredSingle.getForm().isValid()) {
			            Ext.Msg.alert("提示", "请输入相关数据！");
			            return;
			        }
			        var DeptName = Form_newEmphiredSingle.find('name', 'DeptName')[0].getRawValue();
					var DeptId= Form_newEmphiredSingle.find('name', 'DeptName')[0].getValue();
			        var DutyName = Form_newEmphiredSingle.find('name', 'DutyName')[0].getRawValue();
					if(!isNaN(DeptId) && isNaN(DeptName) && DeptName!=DeptId){
						Form_newEmphiredSingle.getForm().submit({
							url: '../Apis/EmphiredSingle.aspx?actionName=NewhireSingle&sid=' + Sys.sid,
							params: { type: dotype, DeptName: DeptName, DutyName: DutyName },
							waitMsg: "正在提交，请稍候...",
							success: function (form, action) {
								try {
									Ext.Msg.alert('提示', action.result.msg);
									Form_newEmphiredSingle.getForm().reset();
									clear_Form_newEmphiredSingle();
									win_newEmphiredSingle.hide();
									Store_EmphiredSingle.load();
								} catch (e) {
								}
							},
							failure: function (form, action) {
								if (action.result != null) {
									Ext.Msg.alert('提示', action.result.msg);
								}
							}
						});
					}
			    }
			},
			{
			    text: '退出',
			    handler: function () {
			        clear_Form_newEmphiredSingle();
			        win_newEmphiredSingle.hide();
			    }
			}
		],
        listeners: {
            'hide': clear_Form_newEmphiredSingle
        }
    });
    //通过条件搜索离职的员工
    function GetPerson_rehab(type, txt) {
        var Nvarchar2 = Form_newEmphiredSingle.find('name', 'Nvarchar2')[0].getRawValue(); //聘用方式
        if (Nvarchar2 == "复职" && txt.length > 0) {
            Form_newEmphiredSingle.getForm().load({
                url: '../Apis/EmphiredSingle.aspx?actionName=GetPerson_rehab&sid=' + Sys.sid,
                waitMsg: '正在搜索中,请稍候...',
                params: { type: type, txt: txt },
                success: function () {
                    //alert("true");
                    Form_newEmphiredSingle.find('name', 'State')[0].setValue(0);
                    Form_newEmphiredSingle.find('name', 'Nvarchar2')[0].setValue(2);
                    Form_newEmphiredSingle.find('name', 'EmpCode')[0].setDisabled(false);
                },
                failure: function () {
                    //alert("asdf");
                    Ext.Msg.alert("提示", "预复职的员工不存在，请确认正确！");
                    clear_Form_newEmphiredSingle();
                    Form_newEmphiredSingle.find('name', 'EmpCode')[0].setValue('');
                    Form_newEmphiredSingle.find('name', 'Nvarchar2')[0].setValue(2);
                    Form_newEmphiredSingle.find('name', 'EmpCode')[0].setDisabled(false);
                }
            });
        }
    }

    //清空Form_newEmphiredSingle数据
    function clear_Form_newEmphiredSingle() {
        Form_newEmphiredSingle.getForm().reset();
        var FNew_items = Form_newEmphiredSingle.getForm();
        FNew_items.items.each(function (cc) {
            if (cc.name != 'EmpCode') {
                cc.setDisabled(false);
                if (cc.xtype == 'combo') {
                    cc.clearValue();
                }
            }
        });
        Form_newEmphiredSingle.find('name', 'EmpCode')[0].setDisabled(true);
        win_newEmphiredSingle.buttons[1].setDisabled(false);
    }

    //格式化时间(适用于renderer)
    function FormatDate(value) {
        return ConvertJSONDateToJSDateObjectTextField(value);
    }

    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_Top]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -69',
            items: [Grid_EmphiredSingle]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});