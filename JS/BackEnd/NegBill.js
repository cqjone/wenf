Ext.onReady(function () {
    Store_GetDept.load();
	Store_GetEmpCode.load();
	
	var Form_Top=new Ext.form.FormPanel({
		items:[
			{
				xtype:'fieldset',
				layout:'column',
				labelWidth:60,
				items:[
					{
						xtype:'button',
						text:'查询',
						style:'margin-left:10px;',
						width:60,
						handler:function(){
							win_Search.show();
						}
					}
				]
			}
		]
	});
	
    var Form_Search=new Ext.form.FormPanel({
        frame:true,
         border: false,
        labelWidth: 60,
        labelAlign:'right',
         items: [
			{
                xtype: 'fieldset',
			    title: '查询条件',
			    layout: 'column',
			    labelAlign: 'right',
			    items: [
                    {
                        columnWidth:0.5,
                        layout:'form',
                        items:[
                            {
                                xtype:'datefield',
                                name:'dtBegin',
                                fieldLabel:'开始日期',
                                value:new Date(),
                                format:'Y-m-d',
                                anchor:'100%'
                            },
                            {
                                xtype:'combo',
                                hiddenName:'DeptId',
								typeAhead:true,
                                fieldLabel:'部门',
								minChars:1,
                                mode:'remote',
                                triggerAction:'all',
                                store:Store_GetDept,
                                valueField: 'myId',
							    displayField: 'displayText',
								allowBlank:false,
                                anchor:'100%'
                            }
                        ]
                    },
                    {
                        columnWidth:0.5,
                        layout:'form',
                        items:[
                            {
                                xtype:'datefield',
                                name:'dtEnd',
                                fieldLabel:'结束日期',
                                value:new Date(),
                                format:'Y-m-d',
                                anchor:'100%'
                            },
                            {
                                xtype:'combo',
                                name:'BillType',
                                fieldLabel:'消费类型',
                                mode:'local',
                                triggerAction:'all',
								editable:false,
                                store: new Ext.data.ArrayStore({
									fields:['myId','displayText'],
									data:[[0,'全部'],[1,'服务'],[2,'产品'],[3,'售卡'],[4,'充值'],[5,'换卡']]
								}),
                                valueField: 'myId',
							    displayField: 'displayText',
                                anchor:'100%'
                            }
                        ]
                    }
                ]
            }
         ]
    });

    var win_Search=new Ext.Window({
        title:'查询条件录入',
        width:'35%',
		height:170,
		modal:true,
		closeActoin:'hide',
		layout: 'fit',
		items:[Form_Search],
        buttons:[
			{
				text:'确定',
				handler:function(){
					if(Form_Search.getForm().isValid()){
					    //var dtBegin=new Date(new Date(Form_Search.find('name','dtBegin')[0].getValue()).format('Y-m-d'));
						var dtBegin=ConvertJSONDateToJSDateObjectTextField(Form_Search.find('name','dtBegin')[0].getValue());
                        //var dtEnd=new Date(new Date(Form_Search.find('name','dtEnd')[0].getValue()).format('Y-m-d'));
						var dtEnd=ConvertJSONDateToJSDateObjectTextField(Form_Search.find('name','dtEnd')[0].getValue());
                        var Time=(dtBegin.getMonth()+1)-(dtEnd.getMonth()+1);
						
                        if((dtEnd.getFullYear()-dtBegin.getFullYear())>1){
                            Ext.Msg.alert('提示','时间相差不能大于两个月！');
                            return;
                        }else if((dtEnd.getFullYear()-dtBegin.getFullYear())==0){
							if(Time>2){
								Ext.Msg.alert('提示','时间相差不能大于两个月！');
								return;
							}
						}else if((dtEnd.getFullYear()-dtBegin.getFullYear())==1){
							Time=(dtBegin.getMonth()+1-12)-(dtEnd.getMonth()+1);
							if(Time<-2){
								Ext.Msg.alert('提示','时间相差不能大于两个月！');
								return;
							}
						}else{
							return;
						}
						Store_NegBill.removeAll();
						Store_NegBill.load({
							waitMsg:'加载中...',
							params: Form_Search.getForm().getValues()
						});
						win_Search.hide();
					}
				}
			},
			{
				text:'关闭',
				handler:function(){
                     var dtBegin=new Date(new Date(Form_Search.find('name','dtBegin')[0].getValue()).format('Y-m-d'));
                     var dtEnd=new Date(new Date(Form_Search.find('name','dtEnd')[0].getValue()).format('Y-m-d'));
					 win_Search.hide();
				}
			}
		],
		listeners:{
			'hide':function(){
				Form_Search.getForm().reset();
				Form_Search.find('xtype','combo')[1].clearValue();
			}
		}
    });
	
	var Store_NegBill=new Ext.data.JsonStore({
		url:'../Apis/NegBill.aspx?actionName=Search&sid='+Sys.sid,
		root:'results',
		totalProperty:'totalCount',
		fields:['deptname','exptime','exptype','id','rebate','itemamount','auditdate'],
	});
	
	var Grid_NegBill=new Ext.grid.GridPanel({
		store:Store_NegBill,
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true,
			},
			columns:[
				new Ext.grid.RowNumberer(),
				{dataIndex:'deptname',header:'分店名称'},
				{dataIndex:'exptime',header:'交易时间'},
				{dataIndex:'exptype',header:'交易类型'},
				{dataIndex:'rebate',header:'折扣率'},
				{dataIndex:'id',header:'服务代码'},
				{dataIndex:'itemamount',header:'金额'},
				{dataIndex:'auditdate',header:'扎帐日期'}
			]
		}),
		loadMask: true
	});
	
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
            items: [Grid_NegBill]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});