Ext.onReady(function () {
    var HId = 0;
    var id = 0;

    var store_VerifyCode = new Ext.data.JsonStore({
        url: '../apis/VerifyCode.aspx?actionName=GetVCode&sid=' + Sys.sid,
        fields: ['Id', 'DeptId', 'CreateTime', 'LimitItems', 'DeptName', 'FromCard', 'ToCard', 'TransferMoney', 'Cash', 'VerifyCode']
    });

    var form_search = new Ext.form.FormPanel({
        labelAlign: 'right',
        items: [
			{
			    xtype: 'fieldset',
			    title: '查询',
			    layout: 'column',
			    items: [
					{
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							{
							    xtype: 'combo',
							    fieldLabel: '门店名称',
							    hiddenName: 'DeptId',
							    typeAhead: true,
							    minChars: 1,
							    triggerAction: 'all',
							    mode: 'remote',
							    store: Store_GetDept,
							    valueField: 'myId',
							    displayField: 'displayText',
							    anchor: '100%'
							}
						]
					},
					{
					    layout: 'form',
					    columnWidth: 0.4,
					    items: [
							{
							    xtype: 'button',
							    text: '查询',
							    anchor: '20%',
							    style: 'margin-left:15px;',
							    handler: function () {
							        var DeptId = form_search.find('hiddenName', 'DeptId')[0].value;
							        if (isNaN(DeptId) || DeptId=="") {
							            Ext.Msg.alert('提示', '请选择门店！');
							            return;
							        };
							        store_VerifyCode.load({
							            params: { DeptId: DeptId, start: 0, limit: 25 }
							        });
							    }
							}
						]
					}
				]
			}
		]
    });

    //门店
    var tar_store = new Ext.data.Store({
        autoDestroy: true,
        autoLoad: true,
        url: '../Apis/VerifyCode.aspx?actionName=getDept&sid=' + Sys.sid,
        reader: new Ext.data.JsonReader({
            fields: [
					{ name: "ID", mapping: "ID" },
					{ name: "Title", mapping: "Title" }
				]
        }),
        sortInfo: { field: 'ID', direction: 'ASC' }
    });
    //添加Form窗口
    var AddForm = new Ext.form.FormPanel({
        frame: true,
        labelWidth: 130,
        layout: "column",
        labelAlign: 'right',
        bodyStyle: "margin:0 -40px",
        items: [
		{
		    layout: "form",
		    columnWidth: 0.48,
		    items: [{
		        xtype: "combo",
		        fieldLabel: "门店",
		        hiddenName: "DeptID",
		        anchor: "95%",
		        triggerAction: 'all',
		        readOnly: true,
		        store: tar_store,
		        valueField: 'ID',
		        displayField: 'Title',
		        enableKeyEvents: true,
		        selectOnFocus: true,
		        allowBlank: false,
		        listeners: {
		            "keyup": function (v) {
		                tar_store.load({
		                    params: { dName: v.getRawValue() }
		                });
		            }
		        }
		    }]
		}, {
		    columnWidth: 0.965,
		    layout: 'form',
		    items: [{
		        xtype: 'textfield',
		        fieldLabel: '转出卡号',
		        readOnly: true,
		        allowBlank: false,
		        name: 'SrcCardNo',
		        anchor: '97%'
		    }]
		}, {
		    columnWidth: 0.965,
		    layout: 'form',
		    items: [{
		        xtype: 'textfield',
		        fieldLabel: '转入卡号',
		        readOnly: true,
		        name: 'DstCardNo',
		        allowBlank: false,
		        anchor: '97%'
		    }]
		}, {
		    layout: "form",
		    columnWidth: 0.48,
		    //bodyStyle: "margin:0 -5px",
		    items: [{
		        xtype: "numberfield",
		        fieldLabel: "转卡金额",
		        name: "TransferMoney",
		        readOnly: true,
		        allowBlank: false,
		        value: "0",
		        anchor: "93%"
		    }]
		}, {
		    layout: "form",
		    columnWidth: 0.49,
		    // bodyStyle: "margin:0 -5px",
		    items: [{
		        xtype: "numberfield",
		        fieldLabel: "充值金额",
		        name: "Cash1",
		        readOnly: true,
		        allowBlank: false,
		        value: "0",
		        anchor: "93%"
		    }]
		}, {
		    layout: "form",
		    columnWidth: 0.48,
		    //bodyStyle: "margin:0 -5px",
		    items: [{
		        xtype: "numberfield",
		        fieldLabel: "验证码转卡金额",
		        name: "TransferAmount",
		        allowBlank: false,
		        value: "0",
		        anchor: "93%"
		    }]
		}, {
		    layout: "form",
		    columnWidth: 0.49,
		    // bodyStyle: "margin:0 -5px",
		    items: [{
		        xtype: "numberfield",
		        fieldLabel: "验证码充值金额",
		        name: "Cash",
		        allowBlank: false,
		        value: "0",
		        anchor: "93%"
		    }]
		},
        {
            columnWidth: 0.965,
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: '限制条件',
				readOnly:true,
                name: 'LimitItems',
                anchor: '97%'
            }]
        },
		{
		    columnWidth: 0.965,
		    layout: 'form',
		    items: [{
		        xtype: 'textfield',
		        fieldLabel: '备 注',
		        name: 'MemoInfo',
		        anchor: '97%'
		    }]
		},
		{
		    columnWidth: 0.495,
		    layout: 'form',
		    items: [{
		        readOnly: true,
		        xtype: 'textfield',
		        fieldLabel: '验证码',
		        name: 'Code',
		        anchor: '92%'
		    }]
		}, 
		{
		    columnWidth: 0.965,
		    layout: 'form',
		    items: [{
		        xtype: 'textfield',
		        fieldLabel: '手机号',
		        readOnly: true,
		        name: 'MobileNo',
		        anchor: '97%'
		    }],
		    html: '<font color=red size=2>11111(多张卡号用逗号隔开。多个手机号码用逗号隔开)</font>'
		}],
        buttons: [
		{
		    text: '生成验证码',
		    id: "btn1",
		    handler: function () {
		        chenck();
		    }
		}, 
		{
		    text: '发送验证码',
		    id: "btn2",
		    disabled: true,
		    handler: function () {
		        UpdateAction();
		    }
		}]
    });
    function chenck() {
        var deptid = AddForm.find("hiddenName", "DeptID")[0].getValue();

        if (isNaN(deptid) || deptid == "") {
            Ext.MessageBox.alert("提醒", "请选择或输入正确的门店");
            return false;
        }
        //转卡金额
        var money = AddForm.find("name", "TransferAmount")[0].getValue();
        if (money < 0) {
            Ext.MessageBox.alert("提醒", "转卡金额必须大于0");
            return false;
        }
        //充值金额
        var cash = AddForm.find("name", "Cash")[0].getValue();
        //var srcCard
        var dstcardno = AddForm.find("name", "DstCardNo")[0].getValue();
        if (isNaN(dstcardno)) {
            Ext.MessageBox.alert("提醒", "请输入正确的转入卡号！");
            return false;
        }
        var srcCardno = AddForm.find("name", "SrcCardNo")[0].getValue();

        var cs = srcCardno.split(",");
        for (var i = 0; i < cs.length; i++) {
            if (isNaN(cs[i])) {

                Ext.MessageBox.alert("提醒", "请输入正确的转出卡号！");
                return false;
            }
        }

        //    if (Math.round(money / 100) > 999) {
        //        Ext.MessageBox.alert("提醒", "限制金额不能大于三位！");
        //        return false;
        //    };

        if (AddForm.getForm().isValid()) {
            AddForm.getForm().submit({
                params: { did: AddForm.find("hiddenName", "DeptID")[0].getValue() },
                url: "../Apis/VerifyCode.aspx?actionName=getDid&sid=" + Sys.sid,
                success: function (form, action) {
                    //Ext.MessageBox.alert("提醒", action.result.msg);
                    GetCode();
                },
                failure: function (form, action) {
                    if (action != undefined && action.result != undefined) {
                        Ext.MessageBox.alert("提醒", action.result.msg);
                    } else {
                        Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                    }
                }
            })
        }
    }

    //获取验证码
    function GetCode() {
        var deptid = AddForm.find("hiddenName", "DeptID")[0].getValue();
        var money = AddForm.find("name", "TransferAmount")[0].getValue();
        AddForm.getForm().submit({
            params: { dempID: AddForm.find("hiddenName", "DeptID")[0].getValue(), money: money },
            url: "../Apis/VerifyCode.aspx?actionName=getVerifyCodeByParms&sid=" + Sys.sid,
            success: function (form, action) {
                id = 0;
                AddForm.find("name", "Code")[0].setValue(action.result.msg);
                AddForm.getForm().findField('DeptID').el.dom.disabled = true; //门店不能修改

                AddForm.getForm().findField('TransferAmount').el.dom.readOnly = true; //限制金额能修改
                AddForm.getForm().findField('Cash').el.dom.readOnly = true; //限制金额能修改
                AddForm.getForm().findField('SrcCardNo').el.dom.readOnly = true; //限制金额能修改
                AddForm.getForm().findField('DstCardNo').el.dom.readOnly = true; //限制金额能修改
                updatecode_h(action.result.msg, HId);
                AddAction();
                Ext.getCmp('btn1').setDisabled(true); //把生成验证码变成不可用
                Ext.getCmp('btn2').setDisabled(false); //把发送验证码变成可用
                AddForm.getForm().findField('MobileNo').el.dom.readOnly = false; //手机号文本框变成可用


                var DeptId = form_search.find('hiddenName', 'DeptId')[0].value;
                store_VerifyCode.load({
                    params: { DeptId: DeptId, start: 0, limit: 25 }
                });
            }
        })
    }

    //更新hVerifyCode
    function updatecode_h(Code, HId) {
		var TransferAmount=AddForm.find('name','TransferAmount')[0].getValue();
		var Cash=AddForm.find('name','Cash')[0].getValue();
        Ext.Ajax.request({
            url: '../Apis/VerifyCode.aspx?actionName=UpdateVCode&sid=' + Sys.sid,
            method: 'post',
            params: { HId: HId, Code: Code,TransferAmount:TransferAmount, Cash:Cash},
            success: function (response, opts) {
				
            },
            failure: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                Ext.Msg.alert("提示", obj.msg);
            }
        });
    }

    //添加
    function AddAction() {
        AddForm.getForm().submit({
            params: { id: id },
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/VerifyCode.aspx?actionName=submitVerifyCode&sid=" + Sys.sid,
            success: function (form, action) {
                //Ext.MessageBox.alert("提醒", action.result.msg);
            },
            failure: function (form, action) {
                if (action != undefined && action.result != undefined) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                } else {
                    Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                }
            }
        });
    }

    //修改(手机号和备注)
    function UpdateAction() {
        var code = AddForm.find("name", "Code")[0].getValue();
        var mobile = AddForm.find("name", "MobileNo")[0].getValue();
        if (mobile == "") {
            Ext.MessageBox.alert("提醒", "手机号码不能为空!");
            return false;
        }
        var memoInfo = AddForm.find("name", "MemoInfo")[0].getValue();
        if (AddForm.getForm().isValid()) {
            AddForm.getForm().submit({
                params: { ucode: code, umobile: mobile, umemoInfo: memoInfo },
                waitMsg: "正在提交，请稍候...",
                url: "../Apis/VerifyCode.aspx?actionName=updateVerifyByCode&sid=" + Sys.sid,
                success: function (form, action) {
                    Ext.MessageBox.alert("提醒", action.result.msg);
                    //alert("1");
                },
                failure: function (form, action) {
                    if (action != undefined && action.result != undefined) {
                        Ext.MessageBox.alert("提醒", action.result.msg);
                    } else {
                        Ext.MessageBox.alert("提醒", "提交失败！请稍候重试！");
                    }
                }
            });
        };
    }

    var AddWindow = new Ext.Window({
        width: 550,
        minWidth: 400,
        autoScroll: true,
        modal: true,
        closeAction: 'hide',
        title: "生成验证码",
        plain: true,
        items: [AddForm],
        listeners: {
            hide: function () {
                tar_store.load(); //门店重新加载
				AddForm.getForm().findField('TransferAmount').el.dom.readOnly = false; //限制金额能修改
                AddForm.getForm().findField('Cash').el.dom.readOnly = false; //限制金额能修改
                Ext.getCmp('btn1').setDisabled(false); //把生成验证码变成可用
                Ext.getCmp('btn2').setDisabled(true); //把发送验证码变成不可用
                AddForm.getForm().findField('MobileNo').el.dom.readOnly = true; //手机号文本框变成不可用
                AddForm.getForm().reset();
            }
        }
    });

    var grid_VerifyCode = new Ext.grid.GridPanel({
        store: store_VerifyCode,
        loadMask: '加载中...',
        stripeRows: true,
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
				new Ext.grid.RowNumberer(),
				{ dataIndex: 'CreateTime', header: '请求时间', width: 125, renderer: ConvertJSONDateToJSDateObject_DateTime },
				{ dataIndex: 'DeptName', header: '门店名称' },
				{ dataIndex: 'FromCard', header: '转出卡号' },
				{ dataIndex: 'ToCard', header: '转入卡号' },
				{ dataIndex: 'TransferMoney', header: '转卡金额' },
				{ dataIndex: 'Cash', header: '充值金额' },
                { dataIndex: 'LimitItems', header: '限制条件' },
				{ dataIndex: 'VerifyCode', header: '验证码' },
				{
					header:'操作',
					renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
						window.showaf=function(rowIndex){
							var recode = grid_VerifyCode.getStore().getAt(rowIndex);
							HId = recode.get('Id');
							AddForm.find('hiddenName', 'DeptID')[0].setValue(recode.get('DeptId'));
							AddForm.find('name', 'SrcCardNo')[0].setValue(recode.get('FromCard'));
							AddForm.find('name', 'DstCardNo')[0].setValue(recode.get('ToCard'));
							AddForm.find('name', 'TransferAmount')[0].setValue(recode.get('TransferMoney'));
							AddForm.find('name', 'TransferMoney')[0].setValue(recode.get('TransferMoney'));
							AddForm.find('name', 'Cash')[0].setValue(recode.get('Cash'));
							AddForm.find('name', 'Cash1')[0].setValue(recode.get('Cash'));
							AddForm.find('name', 'LimitItems')[0].setValue(recode.get('LimitItems'));
							
							//AddForm.find('name','VerifyCode')[0].setValue(recode.get('VerifyCode'));
							AddWindow.show();
						};
						return "<a href='#' onclick='showaf("+rowIndex+")'>生成验证码</a>";
					}
				}
			]
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: store_VerifyCode,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
            emptyMsg: "没有记录"
        })
    });

    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [form_search]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -90',
            items: [grid_VerifyCode]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();

});