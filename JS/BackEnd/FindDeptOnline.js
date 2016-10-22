// 在线门店查询

var form_FindPosDept=new Ext.form.FormPanel({
	frame:true,
	labelAlign:'right',
	labelWidth:60,
	items:[{
		xtype:'fieldset',
		title: "查询条件",
		layout: "column",
		items:[
			{
				columnWidth:0.2,
				layout:'form',
				items:[{
						xtype:'combo',
						fieldLabel:'在线状态',
						hiddenName:'IsOnline',
						triggerAction: 'all',
						editable: false,
						mode: 'local',
						store: new Ext.data.ArrayStore({
							fields: ['myId', 'displayText'],
							data: [[0, '全部'], [1, '在线'],[2,'不在线']]
						}),
						value:1,
						valueField: 'myId',
						displayField: 'displayText',
						anchor:'100%'
				}]
			},
			{
				columnWidth:0.2,
				layout:'form',
				items:[combo_DeptStatus]
			},
			{
				columnWidth:0.3,
				layout:'form',
				items:[{
					xtype:'textfield',
					fieldLabel:'门店名称',
					name:'DeptName',
					anchor:'100%'
				}]
			},
			{
				columnWidth:0.1,
				items:[{
					xtype:'button',
					text:'查询',
					width:'80%',
					style:'margin-left:10px;',
					handler:function(){
						sotre_FindPosDept.removeAll();
						sotre_FindPosDept.load();
						PosIds = [];
						document.getElementById('checkedDeptCount').innerHTML = 0;
					}
				}]
			},
			{
				columnWidth:0.1,
				items:[{
					xtype:'button',
					text:'截屏',
					width:'80%',
					handler:ScreenShot
				}]
			},
			{
				columnWidth:0.1,
				items:[{
					xtype:'button',
					text:'截屏图片',
					width:'80%',
					handler:function(){
						win_Imgs.show();
					}
				}]
			}
		]
	}]
});

var PosIds=[];
function ScreenShot(thBtn){
	try{
		if(sm.getCount()==0){
			Ext.Msg.alert('提示','请选择Pos机后再点击截屏...');
			return false;
		}

		sm.each(function(record){
			PosIds.push(record.get('PosId'));
		});
		thBtn.setText('请稍候...');
		thBtn.setDisabled(true);
		Ext.Ajax.request({
			url:'../Apis/FindDeptOnline.aspx?actionName=isScreenShot&sid='+Sys.sid,
			params:{PosIds:PosIds},
			success:function(response,opts){
				var record = Ext.decode(response.responseText);
				if(record.success){
					Ext.Msg.alert('提示',record.msg);
					sotre_FindPosDept.load();
				}
			},
			callback:function(){
				PosIds=[];
				document.getElementById('checkedDeptCount').innerHTML = 0;
				thBtn.setText('截屏');
				thBtn.setDisabled(false);
			}
		});
	}catch(e){
		thBtn.setText('截屏');
		thBtn.setDisabled(false);
	}
}

var sotre_FindPosDept = new Ext.data.JsonStore({
    url: '../Apis/FindDeptOnline.aspx?actionName=findDept&sid=' + Sys.sid,
    root: "results",
    totalProperty: 'totalCount',
    fields: [
		'DeptId', 'PosId', 'DeptCode', 'DeptName', 'Tel', 'PosCode', 'PosName', 'CameraVersion',
		{
			name:'LastIp',
			convert:ToEmpty
		},
		{
			name:'realname',
			convert:ToEmpty
		},
		{
			name:'lastusetime',
			convert:function(time){
				if(time!=null){
					//return ConvertJSONDateToJSDateObject_DateTime(time);
					return time;
				}else{
					return '';
				}
			}
		},
		{
			name:'DeptStatus',
			convert:DeptStatus
		},
		{
		    name: 'IsOnline',
		    convert: function (value) {
				/*var balanceTime = ConvertJSONDateToJSDateObject(date)-(new Date());
				balanceTime = balanceTime/1000/60;//折算成分钟
				if(Math.abs(balanceTime) > 5){
					return '不在线';
				}else{
					return '在线';
				}*/
				if(value==0){
					return "不在线";
				}else{
					return "在线";
				}
		    }
		},
		{
		    name: 'LastTime'
		    //convert: ConvertJSONDateToJSDateObject_DateTime
		},
		{
		    name: 'ScreenShot',
		    convert: function (value) {
		        if (value == '0') {
		            return '否';
		        } else {
		            return '是';
		        }
		    }
		}
	],
    listeners: {
        'beforeload': function (thStore) {
            thStore.baseParams = form_FindPosDept.getForm().getValues();
            thStore.baseParams.start = 0;
            thStore.baseParams.limit = 200;
			//thStore.baseParams.diffSecond = 5*60;//在线时间差(秒)
        }
    }
});

//复选框
var sm = new Ext.grid.CheckboxSelectionModel({ handleMouseDown: Ext.emptyFn });
sm.on('rowselect',function(th,rowIndex,record){
	var PosId = record.get('PosId');
	for(var i=0;i<PosIds.length;i++){
		if(PosIds[i] == PosId){
			return;
		}
	}
	PosIds[PosIds.length] = PosId;
	document.getElementById('checkedDeptCount').innerHTML = PosIds.length;
});
sm.on('rowdeselect',function(th,rowIndex,record){
	for(var i=0;i<=PosIds.length;i++){
		if(PosIds[i] == record.get('PosId')){
			PosIds.splice(i,1);
			break;
		}
	}
	document.getElementById('checkedDeptCount').innerHTML = PosIds.length;
});

var cm=new Ext.grid.ColumnModel({
	defaults: {
		sortable: true
	},
	columns:[
		new Ext.grid.RowNumberer({width:30}),
		sm,
		{header:'门店编号',dataIndex:'DeptCode',width:60},
		{header:'门店名称',dataIndex:'DeptName',width:80},
		{header:'门店电话',dataIndex:'Tel',width:100},
		{header:'门店状态',dataIndex:'DeptStatus',width:60},
		{header:'Pos编号',dataIndex:'PosCode',width:60},
		{header:'Pos名称',dataIndex:'PosName',width:100},
		{header:'当前收银员',dataIndex:'realname',width:70},
		{header:'刷卡时间',dataIndex:'lastusetime',width:140},
		{header:'Ip地址',dataIndex:'LastIp',width:120,
			editor: new Ext.form.TextField({
			   readOnly:true
            })
		},
		{header:'最后访问时间',dataIndex:'LastTime',width:130},
		{header:'是否在线',dataIndex:'IsOnline',width:60},
		{header:'是否截屏',dataIndex:'ScreenShot',width:60},
		{header:'考勤程序版本',dataIndex:'CameraVersion',width:60},
		{header:'查询截屏图片',width:90,renderer:setBtnToCM}
		
	]
});

var DeptId = 0;
var PosId = 0;
function setBtnToCM(value, cellmeta, record, rowIndex, columnIndex, store){
	window.LookPics=function(rowIndex){
		DeptId = sotre_FindPosDept.getAt(rowIndex).get('DeptId');
		PosId = sotre_FindPosDept.getAt(rowIndex).get('PosId');
		store_FindPics.load();
		win_LookPics.show();
	}
	var resultStr="<a href='#' onclick='LookPics(" + rowIndex + ")'>查看</a>";
	return resultStr;
}

var grid_PosDepts=new Ext.grid.EditorGridPanel({
	cm:cm,
	sm:sm,
	stripeRows:true,
	clicksToEdit:1,
	store:sotre_FindPosDept,
	loadMask:true,
	tbar:new Ext.Panel({
		frame:true,
		html:'<span>您已经选择了 <label id="checkedDeptCount" style="color:red;">0</label> 个门店</span>'
	}),
	bbar: new Ext.PagingToolbar({
        pageSize: 200,
        store: sotre_FindPosDept,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录",
		listeners:{
			'beforechange':function(th,pageData){
				sm.suspendEvents(false);
			},
			'change':function(){
				if(PosIds.length>0){
					var index = 0;
					sotre_FindPosDept.each(function(record){
						for(var i=0;i<PosIds.length;i++){
							if(record.get('PosId')==PosIds[i]){
								sm.selectRow(index,true);
								break;
							}
						}
						index++;
					});
				}
				sm.resumeEvents();
			}
		}
    })
});
grid_PosDepts.on('rowdblclick',function(thGrid,rowIndex,e){
	LookPics(rowIndex);
});

var form_FindPics=new Ext.form.FormPanel({
	frame:true,
	labelAlign:'right',
	items:[{
		layout: "column",
		items:[
			{
				layout:'form',
				columnWidth:.4,
				labelWidth:60,
				items:[{
					xtype:'datefield',
					fieldLabel:'截屏时间',
					name:'dateBegin',
					value:(new Date().format('Y-m-d')) + ' 00:00:00',
					format:'Y-m-d H:i:s',
					allowBlank:false,
					anchor:'100%'
				}]
			},
			{
				layout:'form',
				columnWidth:.4,
				labelWidth:30,
				items:[{
					xtype:'datefield',
					fieldLabel:'至',
					name:'dateEnd',
					value:(new Date().format('Y-m-d')) + ' 23:59:59',
					format:'Y-m-d H:i:s',
					allowBlank:false,
					anchor:'100%'
				}]
			},
			{
				layout:'form',
				columnWidth:.1,
				labelWidth:30,
				items:[{
					xtype:'button',
					text:'查询',
					anchor:'100%',
					handler:function(){
						if(form_FindPics.getForm().isValid()){
							var dateBegin = form_FindPics.find('name','dateBegin')[0].getValue();
							var dateEnd =  form_FindPics.find('name','dateEnd')[0].getValue();
							store_FindPics.load({
								params:{dateBegin:dateBegin,dateEnd:dateEnd}
							});
						}
					}
				}]
			}
		]
	}]
});

var store_FindPics=new Ext.data.JsonStore({
	url:'../Apis/FindDeptOnline.aspx?actionName=findPics&sid='+Sys.sid,
	root: "results",
    totalProperty: 'totalCount',
	fields:[
		'Id','FilePath','FileName','IpAddr',
		{
			name:'FileSize',
			convert:function(value){return (parseFloat(value)/1024).toFixed(2);}
		},
		{
			name:'ScreenTime'
			//convert:ConvertJSONDateToJSDateObject_DateTime
		}
	],
	listeners:{
		'beforeload':function(thStore){
			try{
				thStore.baseParams = form_FindPics.getForm().getValues();
			}catch(e){
				thStore.baseParams.dateBegin=(new Date()).format('Y-m-d') + ' 00:00:00';
				thStore.baseParams.dateEnd=(new Date()).format('Y-m-d') + ' 23:59:59';
			}
			thStore.baseParams.start = 0;
			thStore.baseParams.limit = 25;
			thStore.baseParams.DeptId = DeptId;
			thStore.baseParams.PosId = PosId;
		}
	}
});

var grid_Pics=new Ext.grid.GridPanel({
	store:store_FindPics,
	height:430,
	cm:new Ext.grid.ColumnModel({
		defaults: {
			sortable: true
		},
		columns:[
			new Ext.grid.RowNumberer(),
			{hidden:true,dataIndex:'FilePath'},
			{header:'截图时间',dataIndex:'ScreenTime',width:135},
			{header:'图片大小 (KB)',dataIndex:'FileSize'},
			{header:'图片名称',dataIndex:'FileName',width:150},
			{header:'IP地址',dataIndex:'IpAddr'},
			{header:'查看图片',renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
				window.lookPic=function(rowIndex){
					var FileName = store_FindPics.getAt(rowIndex).get('FileName');
					var FilePath = store_FindPics.getAt(rowIndex).get('FilePath');
					LookPic(FileName,FilePath);
				}
				return "<a href='#' onclick='lookPic("+rowIndex+")'>查看图片</a>";
			}}
		]
	}),
	loadMask:true,
	bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: store_FindPics,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});
grid_Pics.on('rowdblclick',function(thGrid,rowIndex,e){
	var FileName = store_FindPics.getAt(rowIndex).get('FileName');
	var FilePath = store_FindPics.getAt(rowIndex).get('FilePath');
	LookPic(FileName,FilePath);
});

var win_LookPics=new Ext.Window({
	title:'查看图片',
	width:700,
	height:500,
	closeAction:'hide',
	modal:true,
	//layout:'fit',
	items:[form_FindPics,grid_Pics],
	listeners:{
		'hide':function(){
			form_FindPics.getForm().reset();
			store_FindPics.removeAll();
		}
	}
});

//查看选中图片
var shotTime;
var imgIndex;
var pages;
var activePage;
var win_LookPic=new Ext.Window({
	width:1000,
	height:600,
	autoDestroy:true,
	maximized:true,
	modal:true,
	closeAction:'hide',
	autoScroll:true,
	layout:'fit',
	style:'text-align:center;',
	html:"<img id='shotimg' src='' />",
	buttons:[
		{
			text:'上一张',
			id:'btnUpImg',
			handler:function(){
				imgIndex = imgIndex-1;
				if(imgIndex<0 && activePage>1){
					Ext.getCmp('pagerForwin_Imgs').on('change',function(){
						if(store_Imgs.getCount()>0){
							imgIndex=store_Imgs.getCount()-1;
							reSetLookImg();
							Ext.getCmp('pagerForwin_Imgs').removeListener('change');
						}
					});
					Ext.getCmp('pagerForwin_Imgs').movePrevious();
					return false;
				}
				reSetLookImg();
				btnImgDisabled();
			}
		},
		{
			text:'下一张',
			id:'btnNextImg',
			handler:function(){
				if(imgIndex>=store_Imgs.getCount()-1 && activePage<pages){
					Ext.getCmp('pagerForwin_Imgs').on('change',function(){
						imgIndex=0;
						if(store_Imgs.getCount()>0){
							reSetLookImg();
							Ext.getCmp('pagerForwin_Imgs').removeListener('change');
						}
					});
					Ext.getCmp('pagerForwin_Imgs').moveNext();
					return false;
				}
				imgIndex = imgIndex+1;
				reSetLookImg();
				btnImgDisabled();
			}
		}
	],
	listeners:{
		'show':function(){
			if(shotTime==0){
				Ext.getCmp('btnUpImg').hide();
				Ext.getCmp('btnNextImg').hide();
			}else{
				btnImgDisabled();
			}
		}
	}
});
function LookPic(deptName,filePath,th){
	if(th!=undefined){
		shotTime = th.alt.substring(th.alt.indexOf('_ ')+2);
		imgIndex = store_Imgs.find('ScreenTime',shotTime);
	}else{
		shotTime=0;
	}
	win_LookPic.show();
	win_LookPic.setTitle(deptName);
	document.getElementById('shotimg').src='../'+filePath;
}

var form_FindImgs=new Ext.form.FormPanel({
	frame:true,
	labelAlign:'right',
	items:[{
		layout: "column",
		items:[
			{
				layout:'form',
				columnWidth:.4,
				labelWidth:60,
				items:[{
					xtype:'datefield',
					fieldLabel:'截屏时间',
					name:'dateBegin',
					value:(new Date().format('Y-m-d')) + ' 00:00:00',
					format:'Y-m-d H:i:s',
					allowBlank:false,
					anchor:'100%'
				}]
			},
			{
				layout:'form',
				columnWidth:.4,
				labelWidth:30,
				items:[{
					xtype:'datefield',
					fieldLabel:'至',
					name:'dateEnd',
					value:(new Date().format('Y-m-d')) + ' 23:59:59',
					format:'Y-m-d H:i:s',
					allowBlank:false,
					anchor:'100%'
				}]
			},
			{
				layout:'form',
				columnWidth:.1,
				labelWidth:30,
				items:[{
					xtype:'button',
					text:'查询',
					anchor:'100%',
					handler:function(thBtn){
						if(form_FindImgs.getForm().isValid()){
							store_Imgs.removeAll();
							var dateBegin = form_FindImgs.find('name','dateBegin')[0].getValue();
							var dateEnd =  form_FindImgs.find('name','dateEnd')[0].getValue();
							store_Imgs.load({
								params:{dateBegin:dateBegin,dateEnd:dateEnd}
							});
						}
					}
				}]
			}
		]
	}]
});
//Remote - 截屏图片
var store_Imgs = new Ext.data.JsonStore({
	url: '../Apis/FindDeptOnline.aspx?actionName=showShotImgs&sid=' + Sys.sid,
	autoLoad:true,
	root: "results",
    totalProperty: 'totalCount',
	fields:['Id','FilePath','DeptName',
		{
			name:'ScreenTime'
			//convert:ConvertJSONDateToJSDateObject_DateTime
		}
	],
	listeners: {
		'beforeload':function(thStore){
			try{
				thStore.baseParams = form_FindImgs.getForm().getValues();
			}catch(e){
				thStore.baseParams.dateBegin=(new Date()).format('Y-m-d') + ' 00:00:00';
				thStore.baseParams.dateEnd=(new Date()).format('Y-m-d') + ' 23:59:59';
			}
			thStore.baseParams.start = 0;
            thStore.baseParams.limit = 60;
		}
	}
});
//模版 - 显示图片
var tplImgs = new Ext.XTemplate(
    '<div id="shotimgs" style="text-align:center;"><tpl for=".">',
		"<div style='display:inline-table;padding:3px;margin:3px;text-align:center;width:136px;height:110px;'>",
			'<img src="../{FilePath}" width="136" height="100" alt="{DeptName} _ {ScreenTime}" title="{DeptName} _ {ScreenTime}"  style="border:1px gray solid;" ondblclick="LookPic(\'{DeptName}\',\'{FilePath}\',this)" />',
			"<br/><span>{DeptName}</span>",
		"</div>",
    '</tpl></div>'
);
var dataViewImgs=new Ext.DataView({
	store:store_Imgs,
	tpl: tplImgs,
	multiSelect: false,
	emptyText: '没有图片'
});
//查看截屏图片窗口
var win_Imgs=new Ext.Window({
	title:'截屏图片',
	width:950,
	height:600,
	closeAction:'hide',
	maximized:true,
	modal:true,
	items: new Ext.Panel({
		frame:true,
		height:570,
		items:[form_FindImgs,new Ext.Panel({
			frame:true,
			height:490,
			autoScroll:true,
			items:dataViewImgs
		})]
	}),
	bbar:new Ext.PagingToolbar({
		id:'pagerForwin_Imgs',
		pageSize: 60,
		store: store_Imgs,
		displayInfo: true,
		displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
		emptyMsg: "没有记录",
		listeners:{
			'change':function(th,pageData){
				pages = pageData.pages;
				activePage = pageData.activePage;
				btnImgDisabled();
			}
		}
	})
});
function reSetLookImg(){
	var deptName = store_Imgs.getAt(imgIndex).get('DeptName');
	var filePath = store_Imgs.getAt(imgIndex).get('FilePath');
	document.getElementById('shotimg').src='../'+filePath;
	win_LookPic.setTitle(deptName);
}
function btnImgDisabled(){
	if(activePage == 1 && activePage == pages){
		if(imgIndex==0){
			Ext.getCmp('btnUpImg').hide();
		}
	}else{
		if(imgIndex>0 || activePage>1){
			Ext.getCmp('btnUpImg').show();
		}
	}
	if(activePage == pages && imgIndex==store_Imgs.getCount()-1){
		Ext.getCmp('btnNextImg').hide();
	}else{
		Ext.getCmp('btnNextImg').show();
	}
}

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "anchor",
    items: [{
        frame: true,
        border: false,
        items: [form_FindPosDept]
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -100',
        items: [grid_PosDepts]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();