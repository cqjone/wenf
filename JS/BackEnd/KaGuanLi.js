// JavaScript Document

var pd_top_form=new Ext.form.FormPanel({
	bodyBorder: false,
    border: false,
    autoScroll: true,
	items:[
		{
			xtype: "fieldset",
			title: "查询条件",
			defaults: { labelAlign: "right"},
			layout: "column",
			items:[
				{
					layout: "form",
					labelWidth:50,
            		columnWidth: 0.4,
            		items: [{
						xtype: 'combo',
						fieldLabel:'搜索',
						name:'SearchType',
						triggerAction: 'all',
						editable: false,
						mode: 'local',
						store: new Ext.data.ArrayStore({
							fields: ['myId', 'displayText'],
							data: [['卡号', '卡号'], ['客户姓名', '客户姓名'], ['电话', '电话'],['手机','手机']]
						}),
						value:"卡号",
						valueField: 'myId',
						displayField: 'displayText',
						anchor:'100%'
					}]
				},{
					layout:'form',
					columnWidth: 0.2,
					labelWidth:10,
					items:[{xtype:'textfield',name:'SearchText',anchor:'100%'}],
				} ,{
					layout:'hbox',
					columnWidth: 0.15,
					items:[
						{
							xtype:'button',
							text:'刷新',
							width:60,
							handler:function(){
								var data = pd_top_form.getForm().getValues();
								//pd_top_form.getForm().reset();
								pd_store.load({
									 //params: data,
                                     params:{start:0,limit:25}
								});
							}
						}
					]
				}
				
			]
		}   
	]
});

var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
		 {
			 header: '卡号',
			 dataIndex: 'Code',
			 sortable : true,
			 width: 150
		 },
		 {
			header:'客户姓名',
			dataIndex:'EmpName',
			sortable : true,
			width: 150
		 },
		 {
			header:'电话',
			dataIndex:'EmpTel',
			sortable : true,
			width: 150
		 },{
			header:'手机',
			dataIndex:'EmpMobile',
			sortable : true,
			width: 150
		 }
	 ]
});

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/KaGuanLi.aspx?op=Search&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        root: "results",
        totalProperty: 'totalCount',
        fields: [
			{ name: "ID", mapping: "ID" },
            {name:'Code',mapping:'Code'},
			{name:'EmpName',mapping:'EmpName'},
			{name:'EmpTel',mapping:'EmpTel'},
			{name:'EmpMobile',mapping:'EmpMobile'}
        ]
    })
});

pd_store.on('beforeload',function(thiz,options){
    pd_store.baseParams= pd_top_form.getForm().getValues();
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: pd_store,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});

//卡管理项 中 双击事件
var CardCodeNo=0;//Icard 的 卡号
var Birthday,IsFace,IsHair,Sex,Work;
pd_grid.on(
	"rowdblclick",
	function(g, rowindex, e){
		var r = pd_grid.getStore().getAt(rowindex);
		//Ext.Msg.alert(r.get("ID"));
		win_CardCustomerXF.show();
		CardCodeNo=r.get("Code");
		var CustomerId=r.get("ID");
		mystore.load({
			 //url:"../Apis/KaGuanLi.aspx?op=GethCardById&sid=" + Sys.sid,
			 params: { id: CustomerId },
			 waitMsg: "加载中....."
		});
		//mystore.load();
		CodeInfo.load({
			 url:"../Apis/KaGuanLi.aspx?op=SearchById&type=CodeInfo&sid=" + Sys.sid,
			 params: { id: CustomerId },
			 waitMsg: "加载中....."
		});
		KeHuInfo.load({
			 url:"../Apis/KaGuanLi.aspx?op=SearchById&type=KeHuInfo&sid=" + Sys.sid,
			 params: { id: CustomerId },
			 waitMsg: "加载中.....",
			 success:function(form,action){
				 Birthday=(new Date(KeHuInfo.find('name','Birthday')[0].getValue())).format('Y-m-d');
				 if(KeHuInfo.find('name','IsFace')[0].getValue()=='是') IsFace=0; else if(KeHuInfo.find('name','IsFace')[0].getValue()=='否') IsFace=1;
				 if(KeHuInfo.find('name','IsHair')[0].getValue()=='是') IsHair=0; else if(KeHuInfo.find('name','IsHair')[0].getValue()=='否') IsHair=1;
				 //if(KeHuInfo.find('name','Sex')[0].getValue()=='男') Sex=0; else Sex=1;
				 //IsFace=KeHuInfo.find('name','IsFace')[0].getValue();
				 //IsHair=KeHuInfo.find('name','IsHair')[0].getValue();
				 Sex=KeHuInfo.find('name','Sex')[0].getValue();
				 Work=KeHuInfo.find('name','CustomerWork')[0].getValue();
			 }
		});
		//var r=pd_grid.getStore().getAt(rowindex);
	}
);

//=============Window(所有客户信息窗口)===============
var CodesButton=new Ext.form.FormPanel({
	layout:'column',
	plain:true,
	autoScroll: true,
	items:[
		{
			layout:'hbox',
			width:700,
			defaults:{width:90},
			border:false,
			style:'padding:10px;border:0px',
			items:[
				{
					xtype:'button',
					text:'挂失',
					handler:function(){
						Ext.MessageBox.confirm("提醒","确定挂失？",function(btn){
							if(btn=="yes"){
								gq('挂失');
							}
						});
					}
				},{
					xtype:'button',
					text:'启用',
					handler:function(){
						Ext.MessageBox.confirm("提醒","确定启用？",function(btn){
								if(btn=="yes"){
									gq('正常');
								}
						});
					}
				},{
					xtype:'button',
					text:'修改密码',
					handler:function(){
						UpdatePwdWin.show();
					}
				},{
					xtype:'button',
					text:'保存',
					handler:function(){
							ActionSave();
					}
				},{
					xtype:'button',
					text:'关闭',
					handler:function(){
						Ext.MessageBox.confirm('Info','是否保存',a);
						function a(fn){
							if(fn=="yes"){
								ActionSave();
							}
						};
						win_CardCustomerXF.hide();//关闭窗口
						//Pdformedit();
					}
				}
			]
		}
		]
});

// function 各类操作
//保存用户信息
function ActionSave(){
	//Ext.Msg.alert("卡号"+CodeInfo.find("name","Code")[0].getValue());
	//Ext.Msg.alert("CustomerId:"+KeHuInfo.find("name","CustomerId")[0].getValue());
	Pdformedit();
	if(haveEdit==true){
		var code=CodeInfo.find("name","Code")[0].getValue();//卡号
		var codebz=CodeInfo.find("name","MemoInfo")[0].getValue();//卡信息备注
		if (KeHuInfo.getForm().isValid()) {
				KeHuInfo.getForm().submit({
					waitMsg: "正在提交，请稍候...",
					url: "../Apis/KaGuanLi.aspx?op=Update&sid=" + Sys.sid,
					params:{code:code,codebz:codebz,KeHuEdit:KeHuEdit,CodeInfoMemoInfo:CodeInfoMemoInfo},
					success: function (form, action) {
						   Ext.Msg.alert("提示",action.result.msg);
						   haveEdit=false;
					},
					failure: function (form, action) {
						   Ext.Msg.alert("提示",action.result.msg);
						   haveEdit=false;
					}
				});
		}else {
			Ext.Msg.alert("未执行");
		}
	}else{
		Ext.Msg.alert("消息","没有改动内容！");
	}
}

//挂失、启用 客户卡(Icard)
function gq(status){
	Ext.Ajax.request({
		url: "../Apis/KaGuanLi.aspx?op=UpdateCardStatus&sid=" + Sys.sid,
		method:'post',
		params:{CardCodeNo:CardCodeNo,status:status},
		success:function(response,opts){
			var obj = Ext.decode(response.responseText);
			Ext.Msg.alert("提示",obj.msg);
		},
		failure:function(response,opts){
			var obj = Ext.decode(response.responseText);
			Ext.Msg.alert("提示",obj.msg);
		}
	});
}

//判断是否修改过form内容
var haveEdit=false;
var KeHuEdit=new Array();//客户信息 被修改的资料（保存在数组中）
var CodeInfoMemoInfo;// 卡信息  备注被修改
function Pdformedit(){
	var KeHuInfoForm=KeHuInfo.getForm();
		if(KeHuInfoForm){
			var i=0;
			KeHuInfoForm.items.each(function(item1){
				var value=item1.value;
				var getValue=item1.getValue();
				if(item1.name=='Birthday'){
					getValue=(new Date(getValue)).format('Y-m-d');
					if(Birthday!=getValue){
						haveEdit=true;
						KeHuEdit[i]='"'+item1.name+'":["'+Birthday+'","'+getValue+'"]';
						Birthday=getValue;
						i++;
					}
				}
				else if(item1.name=='Sex'){
					if(getValue=='0') getValue='男';
					else if(getValue=='1') getValue='女';
					if(Sex!=getValue){
						haveEdit=true;
						KeHuEdit[i]='"'+item1.name+'":["'+Sex+'","'+getValue+'"]';
						Sex=getValue;
						i++;
					}
				}
				else if(item1.name=='IsFace'){
					if(IsFace!=getValue && getValue!='是' && getValue!='否'){
						haveEdit=true;
						KeHuEdit[i]='"'+item1.name+'":["'+IsFace+'","'+getValue+"']";
						IsFace=getValue;
						i++;
					}
				}
				else if(item1.name=='IsHair'){
					if(IsHair!=getValue && getValue!='是' && getValue!='否'){
						haveEdit=true;
						KeHuEdit[i]='"'+item1.name+'":["'+IsHair+'","'+getValue+'"]';
						IsHair=getValue;
						i++
					}
				}
				else if(item1.name=='CustomerWork'){
					if(Work!=getValue){
						haveEdit=true;
						KeHuEdit[i]='"'+item1.name+'":["'+Work+'","'+getValue+'"]';
						Work=getValue;
						i++;
					}
				}
				else if(item1.value!=item1.getValue() && item1.value!=null){
					//a+="{'"+item1.name+"':['"+item1.value+"','"+item1.getValue()+"']}\n";
					haveEdit=true;
					KeHuEdit[i]='"'+item1.name+'":["'+item1.value+'","'+item1.getValue()+'"]';
					item1.value=item1.getValue();
					i++;
				}				
			});
	}
	if(CodeInfo.find('name','MemoInfo')[0].value != CodeInfo.find('name','MemoInfo')[0].getValue()){
		haveEdit=true;
		CodeInfoMemoInfo='{"MemoInfo":["'+CodeInfo.find('name','MemoInfo')[0].value+'","'+CodeInfo.find('name','MemoInfo')[0].getValue()+'"]}';
		CodeInfo.find('name','MemoInfo')[0].value=CodeInfo.find('name','MemoInfo')[0].getValue();
	}
}

var CodeInfo=new Ext.form.FormPanel({
	reader: new Ext.data.JsonReader({
		 fields:[
			{name:'IsDeleted',mapping:'IsDeleted'},
			{name:'Balance',mapping:'Balance'},
			{name:'Arrear',mapping:'Arrear'},
			{name:'Code',mapping:'Code'},
			{name:'PublishDate',mapping:'PublishDate',convert: ConvertJSONDateToJSDateObjectTextField},
			{name:'LastConsumeDate',mapping:'LastConsumeDate',convert: ConvertJSONDateToJSDateObjectTextField},
			{name:'PaySum',mapping:'PaySum'},
			{name:'UsedSum',mapping:'UsedSum'},
			{name:'CardType',mapping:'CardType'},
			{name:'MemoInfo',mapping:'MemoInfo'}
		]
	}),
									
									
	frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
	width:'100%',
	items:[
		{
			style:'margin-top:10px;margin-left:13px;',
			xtype:'fieldset',
			collapsible: true,
			title:'卡信息',
			width:'100%',
			height:200,
			labelWidth:80,
			items:[
				{
					border:false,
					style:'margin:10px;margin-top:4px;',
					layout:'column',
					items:[
						 {
							 columnWidth:.5,
							 layout:'form',
							 defaults:{width:150},
							 items:[
									{
										xtype:'textfield',
										name:'IsDeleted',
										readOnly:true,
										fieldLabel:'是否可用',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'Code',
										readOnly:true,
										fieldLabel:'卡号',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'CardType',
										readOnly:true,
										fieldLabel:'卡类型',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'PaySum',
										readOnly:true,
										fieldLabel:'已售金额',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'UsedSum',
										readOnly:true,
										fieldLabel:'使用金额',
										anchor:'100%'
									}															
								]
						},
						 {
							columnWidth:.5,
							style:'margin-left:5px',
							layout:'form',
							defaults:{width:150},
							 items:[
									{
										xtype:'textfield',
										name:'Balance',
										readOnly:true,
										fieldLabel:'可用余额',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'Arrear',
										readOnly:true,
										fieldLabel:'欠款',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'PublishDate',
										readOnly:true,
										fieldLabel:'发卡日期',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'LastConsumeDate',
										readOnly:true,
										fieldLabel:'最后使用日期',
										anchor:'100%'
									},{
										xtype:'textarea',
										name:'MemoInfo',
										fieldLabel:'备注',
										anchor:'100%'
									}
							  ]
						}
					]
				}]
		}
	]
});

var KeHuInfo=new Ext.form.FormPanel({
	
	reader:new Ext.data.JsonReader({
			fields:[
				{name:'CustomerId',mapping:'CustomerId'},
				{name:'CustomerName',mapping:'CustomerName'},
				{name:'Email',mapping:'Email'},
				{name:'Sex',mapping:'Sex'},
				{name:'Tel',mapping:'Tel'},
				{name:'Mobile',mapping:'Mobile'},
				{name:'IsFace',mapping:'IsFace'},
				{name:'FaceInfo',mapping:'FaceInfo'},
				{name:'IsHair',mapping:'IsHair'},
				{name:'HairInfo',mapping:'HairInfo'},
				{name:'CustomerWork',mapping:'CustomerWork'},
				{name:'IdNo',mapping:'IdNo'},
				{name:'Address',mapping:'Address'},
				{name:'Birthday',mapping:'Birthday',convert: ConvertJSONDateToJSDateObjectTextField},
				{name:'ZipCode',mapping:'ZipCode'},
				{name:'MemoInfo',mapping:'MemoInfo'}
			]
	}),
	
	frame: true,
    border: false,
    autoScroll: true,
	width:'100%',
	items:[
		{
			xtype:'fieldset',
			collapsible: true,
			title:'客户信息',
			style:'margin-left:10px;margin-top:10px;',
			width:'100%',
			height:250,
			items:[
				{
					border:false,
					layout:'column',
					labelWidth:100,
					items:[
						   {xtype:'hidden',name:'CustomerId'},
						   {
							   columnWidth:.5,
							   layout:'form',
							   items:[
									{
										xtype:'textfield',
										name:'CustomerName',
										fieldLabel:'客户姓名',
										anchor:'100%'
									},{
										xtype:'combo',
										name:'Sex',
										fieldLabel:'性别',
										triggerAction:'all',
										editable: false,
										mode:'local',
										store:new Ext.data.ArrayStore({
											  fields:['myId','displayText'],
											  data:[[0,'男'],[1,'女']]
										}),
										valueField: 'myId',
										displayField: 'displayText',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'Tel',
										fieldLabel:'联系电话',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'Mobile',
										fieldLabel:'手机号码',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'IdNo',
										fieldLabel:'身份证号码',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'Address',
										fieldLabel:'地址',
										anchor:'100%'
									},{
										xtype:'textfield',
										name:'ZipCode',
										fieldLabel:'邮编',
										anchor:'100%'
									},{
										xtype:'datefield',
										width:130,
										name:'Birthday',
										format:'Y-m-d',
										fieldLabel:'出生年月',
										anchor:'100%'
									}
								]
						   },{
							    columnWidth:.5,
							   layout:'form',
							   style:'margin-left:5px;',
							   items:[{
							xtype:'textfield',
							name:'Email',
							fieldLabel:'电子邮件',
										anchor:'100%'
						},{
							xtype:'combo',
							name:'CustomerWork',
							triggerAction:'all',
							editable:false,
							mode:'remote',
							store:new Ext.data.ArrayStore({
								  fields:['myId','displayText'],
								  url:"../Apis/KaGuanLi.aspx?op=GetJob&sid=" + Sys.sid
							}),
							valueField:'myId',
							displayField:'displayText',
							fieldLabel:'客户职业',
							anchor:'100%'
						},{
							xtype:'combo',
							name:'IsFace',
							triggerAction: 'all',
							editable: false,
							mode: 'local',
							store:new Ext.data.ArrayStore({
								fields:['MyId','displayText'],
								data:[[0,'是'],[1,'否']]
							}),
							valueField: 'MyId',
    						displayField: 'displayText',
							fieldLabel:'是否签订美容合同',
							anchor:'100%'
						},{
							xtype:'textfield',
							name:'FaceInfo',
							fieldLabel:'美容合同备注',
							anchor:'100%'
						},{
							xtype:'combo',
							name:'IsHair',
							triggerAction: 'all',
							editable: false,
							mode:'local',
							store: new Ext.data.ArrayStore({
								fields: ['myId', 'displayText'],
								data: [[0,'是'],[1,'否']]
							}),
							valueField: 'myId',
    						displayField: 'displayText',
							fieldLabel:'是否签订美发合同',
							anchor:'100%'
						},{
							xtype:'textfield',
							name:'HairInfo',
							fieldLabel:'美发合同备注',
										anchor:'100%'
						},{
							xtype:'textarea',
							name:'MemoInfo',
							fieldLabel:'备注',
										anchor:'100%'
						}]
						   }
					]
				}
			]
		}
	]
});

//卡消费信息
var mystore=new Ext.data.Store({
		autoDestroy: true,
		url:'../Apis/KaGuanLi.aspx?op=GethCardById&sid='+ Sys.sid,
		remoteSort: true,
		reader:new Ext.data.JsonReader({
			root:'results',
			fields:[
				{name:'CardNo',mapping:'CardNo'},
				{name:'CardType',mapping:'CardType'},
				{name:'BillDate',mapping:'BillDate',convert: ConvertJSONDateToJSDateObjectTextField},
				{name:'BillType',mapping:'BillType'},
				{name:'DetailCode',mapping:'DetailCode'},
				{name:'DetailName',mapping:'DetailName'},
				{name:'Price',mapping:'Price'},
				{name:'Quantity',mapping:'Quantity'},
				{name:'Amount',mapping:'Amount'},
				{name:'Rebate',mapping:'Rebate'},
				{name:'MasterName',mapping:'MasterName'},
				{name:'AsstName',mapping:'AsstName'}
			]
		})
});
	
//mystore.load();
	
var mycm=new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
		{header:'卡号',dataIndex:'CardNo'},
		{header:'卡类别',dataIndex:'CardType'},
		{header:'消费时间',dataIndex:'BillDate'},
		{header:'消费类型',dataIndex:'BillType'},
		{header:'服务代码',dataIndex:'DetailCode'},
		{header:'服务名称',dataIndex:'DetailName'},
		{header:'单价',dataIndex:'Price'},
		{header:'数量',dataIndex:'Quantity'},
		{header:'金额',dataIndex:'Amount'},
		{header:'折扣率',dataIndex:'Rebate'},
		{header:'主理',dataIndex:'MasterName'},
		{header:'助理',dataIndex:'AsstName'}
	]
);

var mygrid=new Ext.grid.GridPanel({
		store:mystore,
		cm:mycm
});
var CodexfInfo=new Ext.form.FormPanel({
	frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
	width:'100%',
	items:[
		{
			xtype:'fieldset',
			collapsible: true,
			title:'卡消费信息（本机）',
			id:'showgird',
			style:'margin-top:10px;margin-left:13px;',
			width:'100%',
			height:240,
			items:[
				{
					width:'100%',
					height:300,
					border:false,
					style:'margin-left:10px;padding-top:10px;',
					layout: "anchor",
					items:[{
						layout: "fit",
						border: false,
						anchor: '-1 -100',
						items: [mygrid]
					}]
				}
			]
		}
	]
});

var win_CardCustomerXF=new Ext.Window({
	title: "卡用户信息",
	layout: 'fit',
    width: 670,
    height: 600,
	modal: true,
    closeAction: 'hide',
	plain:true,
	autoScroll: true,
	items:[{
		   autoScroll: true,
		   items:[CodesButton,CodeInfo,KeHuInfo,CodexfInfo]
		  }]
});

//=============Window(密码修改窗口)===============
var UpdatePwdForm=new Ext.form.FormPanel({
		layout:'form',
		bodyStyle: 'padding:5px',
		labelAlign: 'right',
		labelWidth: 70,
		height:70,
		items:[
			{
				xtype:'textfield',
				name:'NewPwd',
				fieldLabel:'新密码',
				allowBlank: false,
				inputType: "password",
				width:150
			},
			{
				xtype:'textfield',
				name:'reNewPwd',
				fieldLabel:'重复密码',
				allowBlank: false,
				inputType: "password",
				width:150
			}
		]
});

var UpdatePwdWin=new Ext.Window({
	title:'修改密码',
	iconCls: 'find',
	layout:'fit',
	width:300,
	heihgt:450,
	modal:true,
	plain:true,
	closeAction: 'hide',
	bodyStyle: 'padding:5px;',
	buttonAlign:'center',
	items:[UpdatePwdForm],
	buttons:[
		{
			text:'提交',
			handler:function(){
				Ext.MessageBox.confirm("提示框", "您确定要修改密码吗？",function(btn){
						if(btn=="yes"){
							var newpwd=UpdatePwdForm.find('name','NewPwd')[0].getValue();
							var renewpwd=UpdatePwdForm.find('name','reNewPwd')[0].getValue();
							if(newpwd!=renewpwd){
								Ext.Msg.alert("密码重复不相同");
							}else{
								var Code=CodeInfo.find('name','Code')[0].getValue();
								if (UpdatePwdForm.getForm().isValid()) {
									UpdatePwdForm.getForm().submit({
											waitMsg: "正在提交，请稍候...",
											params:{Code:Code},
											url:"../Apis/KaGuanLi.aspx?op=UpdatePwd&type=CodeInfo&sid=" + Sys.sid,
											success:function(form,action){
												Ext.Msg.alert('提示',action.result.msg);
												if(action.result.success){
													UpdatePwdWin.hide();
													UpdatePwdForm.getForm().reset();
												}
											},
											failure:function(form,action){
												Ext.Msg.alert("提示",action.result.msg);
											}
									 });
								}
							}
						}
				});
			}
		},
		{
			text:'重置',
			handler:function(){
				UpdatePwdForm.getForm().reset();
			}
		} 
	]
});

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "anchor",
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -100',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();