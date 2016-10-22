var hideDept=true;//隐藏已经关闭的门店 true:隐藏、false:显示
var hideDept1=true;//(历史查询)隐藏已经关闭的门店 true:隐藏、false:显示
function fnHideDept()
{
	hideDept=document.getElementById('ckHideClosedDept').checked;
	Ext.getCmp('sel_area').reset();
	Ext.getCmp('sel_area').setValue(store_Area.getAt(1).get('value'));
	tabpnl.setActiveItem(0);
}
function fnHideDept1()
{
	hideDept1=document.getElementById('ckHideClosedDept1').checked;
	store_FilterDept.each(function(record){
		list_FilterDept.deselect(record,false);
	})
	store_FilterDept.load({
		params:{hideDept:hideDept1}
	});
}


function ConvertJSONDateToJSDateObjectTextField(JSONDateString) {
    try {
        var date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10));
        return date.format('Y年m月d日');
    } catch (e) {
        return JSONDateString;
    }
}

function ShowImgSize(img){
	var height = img.height;
	var width = img.width;
	//var ip = Ext.getCmp("imgPanel");
	//ip.setHeight(height);
	//ip.setWidth(width);
}
function ShowImg(url) {
	var imgpnl=new Ext.Panel({
        fullscreen:true,
		id:'imgPanel',
        hideOnMaskTap:true,
        centered: true,
        modal: true,
        layout: 'fit',
        html: '<div style="background:#242E3A;width:100%;height:100%;"><img src="' + url + '" /></div>',
        listeners: {
            'hide': function () {
				imgpnl.destroy();
            }
        }
    });
}

function DeptSelected(value,type,EmpId){
try{
	if (value > 0) {
		tabpnl.setActiveItem(3);	
		var ei = Ext.ModelMgr.getModel(model_DeptInfo);
		ei.load('', {
			params:{DeptId:value},
			success: function (DeptInfo,operation) {
				Ext.getCmp('Form_DeptInfo').setRecord(DeptInfo);
			}
		});
		loadEmp(value,type,EmpId);
	}
}catch(e){alert(e);}
}

function loadEmp(value,type,EmpId){
	store_EmpCount.load({
		params: {DeptId:value},
		callback:function(){
			if(type=='SearchEmp'){
				limit1=1;
			}else{
				limit1=15;
			}
			store_Emp.load({
			   params:{EmpId:EmpId,start:start,limit1:limit1,DeptId:value}
			});
		}
	});
}

//定位员工在列表中的位置
function SetPointForSelectedEmp(EmpId,type,DeptId){
	try{
		var index=list_Emps.getStore().find('id',EmpId);
		if(index == -1 ){
			loadEmp(DeptId,type,EmpId);
		}else{
			list_Emps.select(index);
			var top=document.getElementById('Emp_'+EmpId).offsetParent.offsetTop;
			list_Emps.getScrollable().getScroller().scrollTo(0,top,true);
		}
	}catch(e){
		loadEmp(DeptId,type,EmpId);
	}
}

//分页加载时开始加载的位置
var start = 0;
var limit1=15;
var store_EmpCount;
var EmpCount=0;
var store_Emp;
var list_Emps;
var store_Dept;
var store_Area;
var store_Area1;
var store_SearchDept;
var store_SearchEmp;
var store_Mgr_yx;
var store_Mgr_xq;
var model_DeptInfo;
var removeDeptInfo;
var tabpnl;
var ForTimeOut;
var store_Emp_Add;

function _findEmp(EmpName){
	store_SearchEmp.load({
		params:{EmpName:EmpName}
	});	
}
function findEmp(EmpName){
	clearTimeout(ForTimeOut);
	ForTimeOut=setTimeout('_findEmp("'+EmpName+'")',1000);
}

function _findDept(DeptName){
	store_SearchDept.load({
		params:{DeptName:DeptName}
	});
}
function findDept(DeptName){
	clearTimeout(ForTimeOut);
	ForTimeOut=setTimeout('_findDept("'+DeptName+'")',1000);
}

function LoadEmps(){
	start += 15;
	if(store_Emp.getCount()>=EmpCount){return;}
	store_Emp_Add.load({
        params: { start: start, limit1: limit1,DeptId:Ext.getCmp('sel_Dept').getValue()},
        callback: function () {
            store_Emp_Add.each(function (fn) {
                store_Emp.add([{ id: fn.get('id'), imgurl: fn.get('imgurl'), title: fn.get('title'), mobile: fn.get('mobile'), duty: fn.get('duty')}]);
				//store_Emp.add(record);
			});
        }
    });
}


//首页现金报表
var start1=0;
var limit=25;
var DeptCount=0;
var LView;
var storeDept;
var storeAddDept;
var storeDeptCount;
var addDept=false;//是否加载数据
var ForTimeOut;//控制搜索框与服务器连接时间
var SearchValue='';//搜索字符串
var pnl;
var AreaId=0;
var fn_SearchDeptInMain;
var fn_Sort_Home;
var sortId='asc';
var FieldName='';

function _SearchFn(value){
	start1=0;
	storeDept.load({
		params:{start:start1,limit:limit,AreaIds:AreaIds,DeptName:value,hideDept:hideDept}
	});
	storeDeptCount.load({
		params:{start:start1,limit:limit,AreaIds:AreaIds,DeptName:value}
	});
}
function SearchFn(value){
	clearTimeout(ForTimeOut);
	ForTimeOut=setTimeout(_SearchFn(value),1000);
}

function loadTotalMoney(){
	Ext.Ajax.request({
		url: '../../apis/PersonMgr.aspx?op=loadTotalMoney&sid='+sid,
		params:{DeptName:SearchValue,AreaIds:AreaIds,hideDept:hideDept},
		success: function(response, opts) {
		  try{
			var re = Ext.decode(response.responseText);
			document.getElementById('div_TotalMoney').innerHTML='现金合计：'+re.totalmoney+' &nbsp; &nbsp;完成度：'+ (re.TargetPesent*100).toFixed(2) +'%';
		  }catch(e){
			document.getElementById('div_TotalMoney').innerHTML='现金合计：0.00 &nbsp; &nbsp;完成度：0.00%';
		  }
		}
	});
}

//动态将预加载的数据加载到storedept中
function loadDataToStoreDept(){
	tf=true;
	if(storeAddDept.data.items.length>0){
		storeDept.add(storeAddDept.data.items);
	}else{return;}
	if(storeDept.getCount()<DeptCount){
		storeAddDept.load({
			params:{start:start1,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId,AreaIds:AreaIds,hideDept:hideDept},
			callback:function(){tf=false;}
		});
	}
}

//格式化人数
function FormatCount(Count){
	if(Count!=0 && Count!=undefined && Count!=null){
		return Count;
	}else{
		return 0;
	}
}

function FormatMoney(Money){
	if(Money!=0 && Money!=undefined && Money!=null){
		if(Money.toString().indexOf('.')>0){
			return Money.toFixed(2).toString();
			//return Number(Money.toFixed(2));
		}else{
			return Money+'.00';
		}
	}else{
		return '0.00';
	}
}

//通过搜索、首页报表点击门店搜索数据&搜索员工
//NoEmpId未在客户端中找到EmpId,从服务器获取数据
function loadAllDataByDeptId_Animate(DeptId,type,EmpId,deptName){
try{
	tabpnl.setActiveItem(3);	
	var scroller = list_Emps.getScrollable().getScroller();
	if(scroller!=undefined && type!='SearchEmp'){
		scroller.scrollTo(0,0);
	}
	if(type=='SearchEmp'){
		Ext.getCmp('sel_area').setValue('');
		Ext.getCmp('sel_area1').setValue('');
		store_Dept.removeAll();
		var dept=new Ext.ModelMgr.create({
			text:deptName,
			value:-1
		},store_Dept.getModel());
		store_Dept.insert(0,dept);
		Ext.getCmp('sel_Dept').setValue(-1);
		
		SetPointForSelectedEmp(EmpId,type,DeptId);
		return;
	}
	if(DeptId==Ext.getCmp('sel_Dept').getValue()){
		return;
	}else{
		var record;
		for(var i=0;i<store_Dept.getCount();i++){
			record = store_Dept.getAt(i);
			if(DeptId == record.get('value')){
				Ext.getCmp('sel_Dept').setValue(DeptId);
				return;
			}
		}
		
	}

	if(store_Emp!=null && store_Emp.getCount()>0){
		store_Emp.removeAll();
	}
	removeDeptInfo();
	//门店所属区域Id的父区域Id
	var ParentId;
	//门店所属区域Id
	var AreaId;
	/*Ext.Ajax.request({
		method:'post',
		url:'../../apis/PersonMgr.aspx?op=loadDept_Animate&sid='+sid,
		params:{DeptId:DeptId},
		success:function(response, opts){
			var re = Ext.decode(response.responseText);
			if(re.success){
				ParentId=re.results[0].ParentId;
				AreaId=re.results[0].AreaId;
				if(AreaId!=Ext.getCmp('sel_area1').getValue()){
					if(ParentId!=1){
						if(store_Area.getCount()<=0){
							store_Area.removeListener('load');
							store_Area.on('load',function(){
								Ext.getCmp('sel_area').setValue(ParentId);
							});
						}
					}
					
					store_Dept.load({
						params:{AreaId:AreaId},
						callback:function(){
							Ext.getCmp('sel_Dept').setValue(DeptId);
						}
					});
				}else{
					Ext.getCmp('sel_Dept').setValue(DeptId);
				}
			}else{
				if(type!='SearchEmp'){
					Ext.getCmp('sel_Dept').setValue(0);
					Ext.Msg.alert('提示','该门店未设置所属区域！');
					return;
				}
			}
			start=0;
			if(type=='SearchEmp'){
				DeptSelected(DeptId,type,EmpId);
			}else{
				//DeptSelected(DeptId);
			}
		},
		failure:function(){
			Ext.Msg.alert('提示','该门店未设置所属区域！');
			return;
		}
	});*/
	
	//搜索门店
	if(type=='searDept'){
		Ext.getCmp('sel_area').setValue('');
		Ext.getCmp('sel_area1').setValue('');
		store_Dept.removeAll();
	}
	var dept=new Ext.ModelMgr.create({
		text:deptName,
		value:DeptId
	},store_Dept.getModel());
	store_Dept.insert(0,dept);
	Ext.getCmp('sel_Dept').setValue(DeptId);
	
}catch(e){alert('loadAllDataByDeptId_Animate_'+e);}
}

//历史现金
var pnl_HisCash;
var store_FilterDept;
var BeginTime;//开始时间
var EndTime;//结束时间
var Depts='';//需要生成报表的门店
var bbCount;//生成的报表数量
var fu_Sort_HisCash;//排序方法
var start2=0;
var Sort_HisCash='asc';
var FieldName_HisCash='';
var FilterDept;
var list_FilterDept;
var store_bb;
var storeAddbb;
var list_HisCash;
var wheelObj; //滚轮的对象
var d=0;
var tf=false;//防止滚轮到底不停地向后台索取数据
var scrollHeig;//滚动条高度
var scrollFn = function(e) {    
    var direct = 0,e = e || window.event;        

	var scroller = wheelObj.getScrollable().getScroller();

	//滚轮与拖拽的滚轮定位
	d = scroller.position.y;
	if (e.wheelDelta) {
		d+=-e.wheelDelta;
    }else if (e.detail) {
		d+=e.detail;
    }
	
	if(!tf){
		switch(wheelObj){
			case LView://首页报表
				loadDataToStoreDept();
				break;
			case list_HisCash://历史现金报表
				AddbbToStorebb();
				break;
			case list_Emps:
				LoadEmps();
				break;
		}
	}
	if(d<=0){
		d=0;
	}
	
	//防止滚轮滑动的太远
	if(Math.abs(d)>scroller.maxPosition.y){
		d=scroller.maxPosition.y;
	}
	
	scroller.scrollTo(0,d,true);
};

if(document.attachEvent){

document.attachEvent("onmousewheel",scrollFn);  //IE、 opera

}else if(document.addEventListener && window.navigator.userAgent.toLowerCase().indexOf("firefox") == -1){

document.addEventListener("mousewheel",scrollFn,false);  //chrome,safari

}else if(window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1){

document.addEventListener("DOMMouseScroll",scrollFn,false);  //firefox

}

function AddbbToStorebb(){
	if(storeAddbb.data.items.length>0){
		store_bb.add(storeAddbb.data.items);
		storeAddbb.removeAll();
	}else{return;}
	if(store_bb.getCount()==bbCount){
		Ext.getCmp('pnlforloadingbb').getEl().dom.style.display='none';
		return;
	}
	tf=true;
	if(store_bb.getCount()<bbCount){
		storeAddbb.load({
			params:{FieldName:FieldName_HisCash,Sort:Sort_HisCash,BeginTime:BeginTime,EndTime:EndTime,start:start2,limit:limit,Depts:Depts,hideDept:hideDept1},
			callback:function(){
				tf=false;
			}
		});
	}
}

function loadTotalMoney_HisCash(){
	Ext.Ajax.request({
		url: '../../apis/PersonMgr.aspx?op=loadTotalMoney_HisCash&sid='+sid,
		params:{BeginTime:BeginTime,EndTime:EndTime,Depts:Depts,hideDept:hideDept1},
		success: function(response, opts) {
			try{
				var re = Ext.decode(response.responseText);
				document.getElementById('div_TotalMoney_HisCash').innerHTML='现金合计：'+re.totalmoney+' &nbsp; &nbsp;完成度：'+ (re.TargetPesent*100).toFixed(2) +'%';
			}catch(e){
				document.getElementById('div_TotalMoney_HisCash').innerHTML='现金合计：0.00 &nbsp; &nbsp;完成度：0.00%';
			}
		}
	});
}

var ToAddDept_Sel=false;
var AreaIds='';
function getAreaIds(thStore){
	for(var i = 0;i<thStore.getCount();i++){
		AreaIds += thStore.getAt(i).get('value')+',';
	}
}

var p=function(){}

Ext.setup({
    //tabletStartupScreen: '../../JS/touch/resources/img/tablet_startup.png',
    //phoneStartupScreen: '../../JS/touch/resources/img/phone_startup.png',
    //icon: '../../JS/touch/resources/img/icon.png',
    //glossOnIcon: false,

    onReady: function() {
		if (Sys.sid == undefined || Sys.sid == "") {
	            Ext.Msg.alert("请先登录！", '', function (btn) {
	            document.location = "../../BasePages/login_pad.htm";
	        });
	    }
		Ext.Date.monthNames=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
		
		//修改密码
		var storeList = new Ext.data.Store({
			fields:['Id','Title'],
			data:[
				{'Id':1,'Title':'修改密码'}
			]
		});
		
		var list_EditPwd = new Ext.List({
			store:storeList,
			itemTpl:'{Title}'
		});
		
		list_EditPwd.on('itemtap',function(th,index,item,e){
			switch(index){
				case 0:
					EditPwdPnl.show(true);
					break;
			}
		});
		
		var EditPwdPnl = new Ext.form.FormPanel({
			id:'formEditPwd',
			modal:true,
			centered:true,
			fullscreen:true,
			width:350,
			height:280,
			url:"../../Apis/ChangePoint.aspx?actionName=updatePwd&sid=" + sid,
			items:[
				{
					xtype:'fieldset',
					id:'pwdFieldSet',
					style:{
						marginBottom:'0px'
					},
					instructions:'&nbsp;',
					autoHeight:true,
					items:[
						{
							xtype:'passwordfield',
							name:'oldpwd',
							label:'原密码'
						},
						{
							xtype:'passwordfield',
							name:'pwd',
							label:'新密码'
						},
						{
							xtype:'passwordfield',
							name:'verifyPwd',
							label:'重复密码'
						}
					]
				},
				{
					xtype:'panel',
					defaults:{
						xtype:'button',
						style:'margin:0.1em',
						flex:1
					},
					layout:'hbox',
					items:[
						{
							xtype:'button',
							id:'ToEPwd',
							text:'确定',
							handler:FnEditPwd
						},
						{
							xtype:'button',
							id:'CloseEPwd',
							text:'取消',
							handler:function(){
								Ext.getCmp('formEditPwd').hide();
							}
						}
					]
				}
			]
		}).hide();
		
		EditPwdPnl.on('hide',function(){
			EditPwdPnl.reset();
			Ext.getCmp('pwdFieldSet').setInstructions('&nbsp;');
		});
		
		function FnEditPwd(){
			var values = EditPwdPnl.getValues();
			var oldpwd = values.oldpwd;
			var pwd = values.pwd;
			var repwd = values.verifyPwd;
			if(oldpwd.length == 0){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>请输入原密码</font>');
				return;
			}
			if(pwd.length == 0){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>请输入密码</font>');
				return;
			}
			if(repwd.length == 0){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>请输入重复密码</font>');
				return;
			}
			if(pwd != repwd){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>重复密码不正确</font>');
				return;
			}
			Ext.getCmp('pwdFieldSet').setInstructions('&nbsp;');
			Ext.getCmp('ToEPwd').setDisabled(true);
			Ext.getCmp('ToEPwd').setText('正在提交...');
			Ext.getCmp('CloseEPwd').setDisabled(true);
			EditPwdPnl.submit({
				method:'post',
				//waitMsg:'正在更新，请稍候...',
				params:{pwd:oldpwd,newPwd:pwd},
				success:function(form,result){
					var success = result.success;
					if(success == 'True'){
						EditPwdPnl.hide();
						ResumeEPwdBtn();
						Ext.Msg.alert('提示','密码修改成功');
					}else{
						Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>'+result.msg+'</font>');
						ResumeEPwdBtn();
					}
				},
				failure:function(form,result){
					Ext.getCmp('pwdFieldSet').setInstructions('服务器错误...');
					ResumeEPwdBtn();
				}
			});
		}
		function ResumeEPwdBtn(){
			Ext.getCmp('ToEPwd').setDisabled(false);
			Ext.getCmp('ToEPwd').setText('确定');
			Ext.getCmp('CloseEPwd').setDisabled(false);
		}
		
		//首页现金报表
		storeDeptCount=new Ext.data.Store({
			fields:['DeptCount'],
			proxy:{
				type:'ajax',
				url:'../../Apis/PersonMgr.aspx?op=GetDeptCount&sid='+sid,
				reader:{
					type:'json'
				}
			},
			listeners:{
				load:function(thStore){
					DeptCount=thStore.getAt(0).get('DeptCount');
				}
			}
		});
		var DeptModel=new Ext.define('',{
			extend:'Ext.data.Model',
			config:{
				fields: ['rownum','DeptID','DeptName',
					{name:'TargetPesent',convert:function(value){if(value>0){return (value*100).toFixed(2)+'%';}else{return '0.00%'}}},
					{name:'TargetMoney',convert:FormatMoney},
					{name:'TotalCash',convert:FormatMoney},
					{name:'mrs',type:'int',convert:FormatCount},
					{name:'mfs',type:'int',convert:FormatCount}
				]
			}
		});
		storeAddDept = new Ext.data.Store({
			model:DeptModel,
			proxy:{
				type:'ajax',
				url:'../../Apis/PersonMgr.aspx?op=GetDeptInfo&type=adddept&sid='+sid,
				reader:{
					type:'json'
				}
			},
			listeners:{
				load:function(){
					start1+=25;
					if(storeAddDept.getCount()==0){
						DeptCount=storeDept.getCount();
					}
				}
			}
		});
		
		storeDept = new Ext.data.Store({
			model:DeptModel,
			proxy:{
				type:'ajax',
				url:'../../Apis/PersonMgr.aspx?op=GetDeptInfo&sid='+sid,
				reader:{
					type:'json'
				}
			},
			listeners:{
				load :function(thStore){
					var scroller = LView.getScrollable().getScroller();
					scroller.clearListeners();
					if(storeDept.getCount()<limit){
						storeAddDept.removeAll();
						return;
					}
					start1+=25;
					//为loadDataToStoreDept方法预加载一次数据
					storeAddDept.load({
						params:{start:start1,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId,AreaIds:AreaIds,hideDept:hideDept}
					});
					//滚轮停止运动时的事件
					scroller.on('scrollend',function(th,x,y,e){
						if(Math.abs(y)>=Math.abs(th.maxPosition.y)-10){
							if(storeDept.getCount()==DeptCount){
								return;
							}
							loadDataToStoreDept();
						}
					});
				}
			}
		});
		storeDept.on('clear',function(){
			if(storeAddDept!=null && storeAddDept.getCount()>0){
				storeAddDept.removeAll();
			}
		})

		LView=new Ext.List({
			store:storeDept,
			emptyText:'没有数据',
			itemTpl:'<div class="bb">'+
					'<div style="width:8%;">{rownum}</div>'+
					'<div style="width:19%;">{DeptName}</div>'+
					'<div style="width:15%;text-align:right;">{TotalCash}</div>'+
					'<div style="width:15%;text-align:right;">{TargetMoney}</div>'+
					'<div style="width:15%;">{TargetPesent}</div>'+
					'<div style="width:14%;">{mrs}</div>'+
					'<div style="width:14%;">{mfs}</div>'+
					'</div>',
			listeners:{
				itemtap:function(th,index){
					var re=storeDept.getAt(index);
					loadAllDataByDeptId_Animate(re.get('DeptID'),null,null,re.get('DeptName'));
				}
			}
		});
		
		pnl=new Ext.Panel({
			id:'pnl_body',
			layout:'fit',
			items:[
				{
					docked:'top',
					items:[{
						xtype:'toolbar',
						style:'color:#FFF;',
						html:'<div id="div_body" class="div_body">'+
								'<div style="width:8%;margin-left:10px;">序号</div>' +
								'<div style="width:18%;"><label onclick="fn_Sort_Home(0)"> &nbsp; &nbsp; &nbsp;店名</label> &nbsp; <img id="img_SearchDeptInMain" src="../../Imgs/find.png" onclick="fn_SearchDeptInMain()" style="border:0px;" width=20 height=20 /> </div>' +
								'<div style="width:15%;text-align:right;"><label onclick="fn_Sort_Home(1)">现金合计</label></div>' +
								'<div style="width:15%;text-align:right;"><label onclick="fn_Sort_Home(2)">现金指标</label></div>' +
								'<div style="width:15%;"><label onclick="fn_Sort_Home(5)">完成度</label></div>' +
								'<div style="width:14%;"><label onclick="fn_Sort_Home(3)">店内美容师数量</label></div>' +
								'<div style="width:14%;"><labe onclick="fn_Sort_Home(4)">店内美发师数量</label></div>' +
							 '</div>'
					}]
				},
				LView,
				{
					docked:'bottom',
					items:[{
						xtype:'toolbar',
						style:'color:#FFF;',
						html:'<div id="div_body" class="div_body" style="width:400px;text-align:left;">'+
							 "<div id='div_TotalMoney' style='width:100%;'>现金合计：&nbsp; &nbsp; 完成度：</div>"+
							 '</div>'
					}]
				}
			]
		});
		
		//点击标题排序
		fn_Sort_Home=function (ColmunIndex){
			start1=0;
			if(sortId=='asc'){
				sortId='desc';
			}else{
				sortId='asc';
			}
			switch(ColmunIndex){
				case 0:
					FieldName='DeptName';
					break;
				case 1:
					FieldName='TotalCash';
					break;
				case 2:
					FieldName='TargetMoney';
					break;
				case 3:
					FieldName='mrs';
					break;
				case 4:
					FieldName='mfs';
					break;
				case 5:
					FieldName='TargetPesent';
					break;
				default:
					FieldName='';
					break;
			}
			if(FieldName.length>0){
				SearchValue = Ext.getCmp('Search_field').getValue();
				storeDept.load({
					params:{FieldName:FieldName,Sort:sortId,DeptName:SearchValue,AreaIds:AreaIds,hideDept:hideDept}
				});
			}
			LView.getScrollable().getScroller().scrollTo(0,0);
		}
		
		var pnl_searchDept=new Ext.Panel({
			modal:true,
			hideOnMaskTap:true,
			items:[{
				xtype:'toolbar',
				items:[{
					xtype:'searchfield',
					id:'Search_field',
					listeners:{
						change:function(th,e){
							AreaIds = '';
							if(th.getValue().replace(/\s+/g,"")!=''){
								AreaIds='';
								SearchValue=th.getValue();
								SearchFn(SearchValue,e);
								loadTotalMoney();
								Ext.getCmp('sel_area').setValue('');
								Ext.getCmp('sel_area1').setValue('');
							}
							
							pnl_searchDept.hide();
						}
					}
				}]
			}]
		});
		
		fn_SearchDeptInMain=function(){
			pnl_searchDept.showBy(Ext.get('img_SearchDeptInMain'));
		}

		//历史现金
		store_FilterDept=new Ext.data.Store({
			fields: ['Id', 'DeptName'],
			proxy:{
				url: '../../apis/PersonMgr.aspx?op=GetAllDept&sid='+sid,
				type: 'ajax',
				reader:{type:'json'}
			}
		});
		store_FilterDept.load({
			params:{hideDept:hideDept1}
		});
		
		//报表_model
		var model_bb=new Ext.define('',{
			extend:'Ext.data.Model',
			config:{
				fields:['rownum','DeptID','DeptName',
					{name:'TargetPesent',convert:function(value){if(value>0){return (value*100).toFixed(2)+'%';}else{return '0.00%'}}},
					{name:'TotalCash',convert:FormatMoney},
					{name:'TargetMoney',convert:FormatMoney}
				]
			}
		});
		
		//报表Store
		store_bb=new Ext.data.Store({
			model:model_bb,
			proxy:{
				url: '../../apis/PersonMgr.aspx?op=GetDeptBb&sid='+sid,
				type:'ajax',
				reader:{
					type:'json'
				}
			}
		});
		
		//预加载报表_Store
		storeAddbb = new Ext.data.Store({
			model:model_bb,
			proxy:{
				type:'ajax',
				url:'../../apis/PersonMgr.aspx?op=GetDeptBb&type=addbb&sid='+sid,
				reader:{
					type:'json'
				}
			},
			listeners:{
				load:function(){
					start2+=25;
					if(storeAddbb.getCount()==0){
						bbCount=store_bb.getCount();
					}
				}
			}
		});
		
		store_bb.on('load',function(){
			var scroller = list_HisCash.getScrollable().getScroller();
			scroller.clearListeners();
			if(store_bb.getCount()<limit){
				storeAddbb.removeAll();
				return;
			}
			start2+=25;
			//为AddbbToStorebb方法预加载一次数据
			storeAddbb.load({
				params:{FieldName:FieldName_HisCash,Sort:Sort_HisCash,Depts:Depts,BeginTime:BeginTime,EndTime:EndTime,start:start2,limit:limit,hideDept:hideDept1}
			});
			//滚轮停止运动时的事件
			scroller.on('scrollend',function(th,x,y,e){
				if(Math.abs(y)>=Math.abs(th.maxPosition.y)-10){
					if(store_bb.getCount()==bbCount){
						return;
					}
					AddbbToStorebb();
				}
			});
		});
		
		list_HisCash=new Ext.List({
			store:store_bb,
			id:'list_HisCash',
			emptyText:'没有数据',
			itemTpl:'<div class="bb">'+
						'<div style="width:70px;">{rownum}</div>'+
						'<div style="width:150px;"> {DeptName}</div>'+
						'<div style="width:150px;text-align:right;">{TotalCash}</div>'+
						'<div style="width:150px;text-align:right;">{TargetMoney}</div>'+
						'<div style="width:150px;">{TargetPesent}</div>'+
					'</div>'
		});
		
		//门店_list
		list_FilterDept=new Ext.List({
			id:'list_FilterDept',
			store:store_FilterDept,
			allowDeselect:true,
			mode:'MULTI',
			itemTpl:'{DeptName}'
		})
		
		FilterDept=new Ext.Panel({
			modal:true,
			hideOnMaskTap:true,
			width:330,
			height:'80%',
			layout:'fit',
			items:[
				{
					xtype:'toolbar',
					docked:'top',
					items:[
						{
							text:'全选',
							handler:function(){
								store_FilterDept.each(function(record){
									list_FilterDept.select(record,true,false);
								})
							}
						},
						{
							text:'撤销全选',
							handler:function(){
								store_FilterDept.each(function(record){
									list_FilterDept.deselect(record,false);
								})
							}
						}
					]
				},
				list_FilterDept
			]
		});
		
		pnl_HisCash=new Ext.Panel({
			id:'pnl_HisCash',
			layout:'fit',
			items:[
				{
					xtype:'toolbar',
					docked:'top',
					html:'<div id="div_body" class="div_body">'+
						'<div style="width:70px;">序号</div>'+
						'<div style="width:150px;padding-left:2%;"><label onclick="fu_Sort_HisCash(0)">店名</labe></div>'+
						'<div style="width:150px;text-align:right;"><label onclick="fu_Sort_HisCash(1)">现金合计</label></div>'+
						'<div style="width:150px;text-align:right;"><label onclick="fu_Sort_HisCash(2)">现金指标</label></div>'+
						'<div style="width:150px;"><label onclick="fu_Sort_HisCash(3)">完成度</label></div>'+
						'</div>'
				},
				list_HisCash,
				{
					xtype:'toolbar',
					docked:'bottom',
					items:[
						{
							xtype:'toolbar',
							style:'color:#FFF;',
							html:'<div id="div_body" class="div_body" style="width:400px;text-align:left;">'+
								"<div id='div_TotalMoney_HisCash' style='width:100%;'>现金合计：&nbsp; &nbsp; 完成度：</div>"+
								'</div>',
						}
					]
				}
			]
		});
		
		fu_Sort_HisCash=function(ColumnIndex){
			if(Depts.length==0){return;}
			start2=0;
			if(Sort_HisCash=='asc'){
				Sort_HisCash='desc';
			}else{
				Sort_HisCash='asc';
			}
			switch(ColumnIndex){
				case 0:
					FieldName_HisCash='DeptName';
					break;
				case 1:
					FieldName_HisCash='TotalCash';
					break;
				case 2:
					FieldName_HisCash='TargetMoney';
					break;
				case 3:
					FieldName_HisCash='TargetPesent';
					break;
				default:
					FieldName_HisCash='';
					break;
			}
			if(FieldName_HisCash.length>0){
				store_bb.load({
					params:{FieldName:FieldName_HisCash,Sort:Sort_HisCash,Depts:Depts,BeginTime:BeginTime,EndTime:EndTime,hideDept:hideDept1}
				});
			}
		}
		
		//
        var model_select = new Ext.define('model_select', {
			extend:'Ext.data.Model',
			config:{
				fields: ['value', 'text']
			}
		});
		var TOChooseModel = new  Ext.ModelMgr.create({
			text:'请选择',
			value:'ToChoose'
		}, model_select);
		
        store_Area = new Ext.data.Store({
            fields: ['value', 'text'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadArea&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });
		store_Area.on('load',function(thStore){
			wheelObj = LView;
			Ext.getCmp('sel_area').setValue(thStore.getAt(1).get('value'));
		});

        store_Area1 = new Ext.data.Store({
            model: model_select,
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadArea1&sid='+sid,
                reader: {
                    type: 'json'
                }
            },
			listeners:{
				load:function(thStore){
					if(thStore.getCount()>=1){
						getAreaIds(thStore);
						AreaIds += Ext.getCmp('sel_area').getValue();
						loadTotalMoney();
						storeDeptCount.load({
							params:{AreaIds:AreaIds}
						});
						storeDept.load({
							params:{AreaIds:AreaIds,hideDept:hideDept}
						});
					}
				}
			}
        });

        store_Dept = new Ext.data.Store({
            model: model_select,
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadDept&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

        var store_worked = new Ext.data.Store({
            fields: ['DeptName', 'WorkedTime','DutyName', 'dy'],
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadWorked&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

		store_EmpCount = new Ext.data.Store({
            fields: ['EmpCount'],
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadEmpCount&sid='+sid,
                reader: {
                    type: 'json'
                }
            },
			listeners:{
				load:function(){
					EmpCount=store_EmpCount.getAt(0).get('EmpCount');
				}
			}
		});
		
        //当滚轮滑动到底端时；动态加载数据
        store_Emp_Add = new Ext.data.Store({
            fields: ['id', 'imgurl', 'title', 'mobile', 'duty'],
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadEmp&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

        store_Emp = new Ext.data.Store({
            fields: ['id', 'imgurl', 'title', 'mobile', 'duty'],
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadEmp&sid='+sid,
                reader: {
                    type: 'json'
                }
            },
            listeners: {
                load: function () {
					var scroller = list_Emps.getScrollable().getScroller();
					scroller.clearListeners();
					scroller.on('scrollend', function (th,x,y,e) {
						if(Math.abs(y)>=Math.abs(th.maxPosition.y) - 10){
							if(store_Emp.getCount()==EmpCount){
								return;
							}
							LoadEmps();
						}
					});
					scroller.scrollTo(0,0);
                }
            }
        });

        store_Mgr_yx = new Ext.data.Store({
           fields: ['id', 'imgurl', 'title', 'mobile', 'duty'],
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadMgr&duty=yxjl&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

        store_Mgr_xq = new Ext.data.Store({
            fields: ['id', 'imgurl', 'title', 'mobile', 'duty'],
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadMgr&duty=xqjl&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

        var store_Imgurl = new Ext.data.Store({
            fields: ['Id', 'FileName', 'FilePath'],
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadImg&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

		store_SearchDept=new Ext.data.Store({
			fields: ['DeptID', 'DeptName'],
			proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=searchdept&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
		});
		
		store_SearchEmp=new Ext.data.Store({
			fields: ['EmpId','DeptId','EmpName', 'DeptName'],
			proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=searchemp&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
		});
		
        model_DeptInfo = new Ext.define('model_DeptInfo', {
			extend:'Ext.data.Model',
			config:{
				fields: ['Title', 'LandLord', 'BusinessLic', 'LordTel', 'Rental', 'LegalPerson', 'Rent',
					{ name: 'Rental', convert: function(val){
						if(val != '' && val != undefined && val != null){
							return val + '  万/年';
						}else{
							return '';
						}
					}},
					{ name: 'Area', convert: function(val){
						if(val != '' && val != undefined && val != null){
							return val + '  平方米';
						}else{
							return '';
						}
					}}
				],
				proxy: {
					type: 'rest',
					url: '../../apis/PersonMgr.aspx?op=loaddeptinfo&sid='+sid
				}
			}
        });

        var empinfo = new Ext.define('empinfo', {
            extend:'Ext.data.Model',
			config:{
				fields: ['EmpName', 'Zodiac', 'Degree', 'Share', 'Term', 'Address', 'MemoInfo',
						'Nation', 'Language', 'PepTalent', 'Duty', 'Mobile',
						{name:'Salary',convert:FormatMoney},
						{ name: 'weight', convert: function (txt) { if (txt != undefined && txt != "") { return txt + "kg" } else { return txt; } } },
						{ name: 'height', convert: function (txt) { if (txt != undefined && txt != "") { return txt + "cm" } else { return txt; } } },
						{ name: 'Birthday', convert: function (txt) { if (txt != undefined && txt != '') { return ConvertJSONDateToJSDateObjectTextField(txt) }  } },
						{ name: 'HireDate', convert: function (txt) { if (txt != undefined && txt != '') { return ConvertJSONDateToJSDateObjectTextField(txt) }  } },
						{ name: 'WorkContract', convert: function (txt) { if (txt == 0) { return '√' }else{return '×'} } },
						{ name: 'EmployContract', convert: function (txt) { if (txt == 0) { return '√' }else{return '×'} } }
				],
				proxy: {
					type: 'rest',
					url: '../../apis/PersonMgr.aspx?op=loadEmpInfo&sid='+sid
				}
			}
        });

        //清空所有数据
        function removeall() {
			ToAddDept_Sel=false;
			if(storeDept!=null && storeDept.getCount()>0){
				storeDept.removeAll();
			}
			if(store_Area1!=null && store_Area1.getCount()>0){
				store_Area1.removeAll();
			}
			document.getElementById('div_TotalMoney').innerHTML='现金合计：&nbsp; &nbsp; 完成度：';
			remove();
        }
        //清空区域以及其下的所有数据
        function remove() {
			start1 = 0;
			AreaIds = '';
			if(store_Dept!=null && store_Dept.getCount()>0){
				store_Dept.removeAll();
            }
			if(store_Emp!=null && store_Emp.getCount()>0){
				store_Emp.removeAll();
            }
			if(store_Mgr_yx!=null && store_Mgr_yx.getCount()>0){
				store_Mgr_yx.removeAll();
            }
			if(store_Mgr_xq!=null && store_Mgr_xq.getCount()>0){
				store_Mgr_xq.removeAll();
            }
			remove1();
        }
        //清空门店以及其下的所有数据
        function remove1() {
			start = 0;
			SearchValue = '';
			if(store_Emp!=null && store_Emp.getCount()>0){
				store_Emp.removeAll();
			}
			if(store_Emp!=null && store_Emp.getCount()>0){
				store_Imgurl.removeAll();
			}
			removeDeptInfo();
            var aa = Ext.ModelMgr.create({}, model_DeptInfo);
            Ext.getCmp('Form_DeptInfo').setRecord(aa);
        }

        p.editPnl = new Ext.Panel({
            fullscreen: true,
            centered: true,
            modal: true,
			hideOnMaskTap:true,
			hidden:true,
            width:700,
			height:500,
			layout: 'fit',
            items: [
				{
					docked:'top',
					xtype:'toolbar',
					layout:{
						pack:'center'
					},
					items:[
						{
						xtype:'segmentedbutton',
						id:'segmentedbtns',
						allowDepress:true,
						items:[
						{
						    id:'empInfobtn',
							text: '员工信息',
						    width: 100,
						    pressed: true,
						    handler: function () {
						        Ext.getCmp('panle_EmpPhoto').hide();
						        Ext.getCmp('panle_Worked').hide();
						        Ext.getCmp('Form_EmpInfo').show();
						    }
						},
						{
						    text: '工作记录',
						    width: 100,
						    handler: function () {
						        Ext.getCmp('panle_EmpPhoto').hide();
						        Ext.getCmp('Form_EmpInfo').hide();
						        Ext.getCmp('panle_Worked').show();
						    }
						},
						{
						    text: '照片',
						    width: 100,
						    handler: function () {
						        Ext.getCmp('Form_EmpInfo').hide();
						        Ext.getCmp('panle_Worked').hide();
						        Ext.getCmp('panle_EmpPhoto').show();
						    }
						}
						]
					}]
				},
				new Ext.Panel({
					layout: 'card',
					items: [
						{
							xtype: 'formpanel',
							id: 'Form_EmpInfo',
							masked: {
								xtype: 'loadmask',
								message: 'loading...'
							},
							items: [
								{
								  xtype: 'fieldset',
								  title: '基本信息',
								  defaults: {
									  labelWidth: '120px',
									  style: 'font-size:1.2em;'
								  },
								items: [
									{
										xtype: 'textfield',
										name: 'EmpName',
										label: '姓名',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'height',
										label: '身高',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'weight',
										label: '体重',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'Zodiac',
										label: '属相',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'Degree',
										label: '学历',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'Birthday',
										label: '出生年月',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'Nation',
										label: '民族',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'Language',
										label: '语言',
										readOnly: true
									},
									{
										xtype: 'textfield',
										name: 'PepTalent',
										label: '特长',
										readOnly: true
									}
								]
								},
								{
									xtype: 'fieldset',
									title: '综合信息',
									defaults: {
										labelWidth: '120px',
										style: 'font-size:1.2em;',
										disabledCls: 'aa'
									},
									items: [
										{
											xtype: 'textfield',
											name: 'Duty',
											label: '职位',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'Mobile',
											label: '电话',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'Term',
											label: '培训期数',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'HireDate',
											label: '入职时间',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'Salary',
											label: '薪资待遇',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'Share',
											label: '股份',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'WorkContract',
											label: '劳动合同',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'EmployContract',
											label: '聘用合同',
											readOnly: true
										},
										{
											xtype: 'textfield',
											name: 'Address',
											label: '家庭地址',
											readOnly: true
										},
										{
											xtype: 'textareafield',
											name: 'MemoInfo',
											label: '其他',
											readOnly: true
										}
									]
								}
							]
						},
						{
							id: 'panle_Worked',
							hidden: true,
							xtype: 'list',
							store: store_worked,
							itemTpl:'<div style="color:Black;height:40px;">'+
								'<div style="float:left;width:230px;"><div>店名：{DeptName}</div><div>职务：{DutyName}</div></div>'+
								'<div style="float:left;"><div>时间：{WorkedTime}</div><div">待遇：{dy}</div></div>'+
								'</div>'
						},
						{
							xtype: 'dataview',
							hidden: true,
							//style: 'width:100%;height:100%;',
							id: 'panle_EmpPhoto',
							store: store_Imgurl,
							itemTpl:'<div class="div_img" >'+
								'<tpl for="."><div  title="{FileName}" style="float:left;margin-top:10px;margin-left:43px;text-align:center;">'+
								'<img src="../../Imgs/EmpImgs/{FilePath}" onError="this.src=\'../../Imgs/DefaultImg.jpg\'" width="145" height="200" onclick="ShowImg(\'../../Imgs/EmpImgs/{FilePath}\')" /><br/>'+
								'<span>{FileName}</span></div></tpl><div>',
							emptyText: '没有图片'
						}
					]
				})
			]
		});
		p.editPnl.on('hide',function(){
			Ext.getCmp('Form_EmpInfo').getScrollable().getScroller().scrollTo(0,0);
			Ext.getCmp('panle_Worked').getScrollable().getScroller().scrollTo(0,0);
			Ext.getCmp('panle_EmpPhoto').getScrollable().getScroller().scrollTo(0,0);
			Ext.getCmp('panle_EmpPhoto').hide();
			Ext.getCmp('panle_Worked').hide();
			Ext.getCmp('Form_EmpInfo').show();
			var btns = [];
			btns.push(Ext.getCmp('empInfobtn'));
			Ext.getCmp('segmentedbtns').setPressedButtons(btns);
		});
		
		var pnl_DeptSearch=new Ext.Panel({
			width:300,
			height:'80%',
			floating: true,
            modal: true,
			hideOnMaskTap:true,
			layout:'fit',
			items:[
				{
					xtype:'toolbar',
					docked:'top',
					items:[{
						xtype:'searchfield',
						listeners:{
							change:function(th,e){
								var value=th.getValue();
								value=value.replace(/\s+/g,"");
								if(value.length!=0){
									findDept(value);
								}
							}
						}
					}]
				},
				{
					xtype:'list',
					store:store_SearchDept,
					itemTpl :'{DeptName}',
					listeners:{
						itemtap:function(th,index){
							var re=store_SearchDept.getAt(index);
							pnl_DeptSearch.hide('fade');
							loadAllDataByDeptId_Animate(re.get('DeptID'),'searDept',null,re.get('DeptName'));
						}
					}
				}
			]
		});
		
		var pnl_EmpSearch=new Ext.Panel({
			width:300,
			height:'80%',
            modal: true,
			hideOnMaskTap:true,
			layout:'fit',
			items:[
				{
					xtype:'toolbar',
					docked:'top',
					items:[{
						xtype:'searchfield',
						listeners:{
							change:function(th,newValue,oldValue){
								var value=newValue.replace(/\s+/g,"");
								if(newValue.length>0){
									_findEmp(value);
								}else{
									store_SearchEmp.removeAll();
									start=0;
									var DeptId=Ext.getCmp('sel_Dept').getValue();
									if(!isNaN(DeptId) && store_Dept.getCount()>0){
										loadEmp(DeptId);
									}
								}
							}
						}
					}]
				},
				{
					xtype:'list',
					store:store_SearchEmp,
					itemTpl :'{EmpName} - 店名:{DeptName}',
					listeners:{
						itemtap:function(th,index){
							var re=store_SearchEmp.getAt(index);
							var EmpId=re.get('EmpId');
							var DeptId=re.get('DeptId');
							pnl_EmpSearch.hide();
							start = 0;
							loadAllDataByDeptId_Animate(DeptId,'SearchEmp',EmpId,re.get('DeptName'));
						}
					}
				}
			]
		});
		
        //顶层选择栏
        var toolbar = new Ext.Toolbar({
            docked: 'top',
            items: [
            //选择地区
				{
					xtype: 'selectfield',
					id: 'sel_area',
					name: 'sel_area',
					store: store_Area,
					displayTextField: 'text',
					valueField: 'value',
					width: '20%',
					listeners: {
						change: function (sel, value) {
							if (value>0 && !isNaN(value) && value!='') {
								removeall();
								tabpnl.setActiveItem(0);
								Ext.getCmp('Search_field').setValue('');//清空放大镜门店搜索框
								AreaId = value;
								store_Area1.load({
									params:{PId:value}
								});
								store_Dept.load({
									params:{AreaId:AreaId,hideDept:hideDept}
								});
							}else if(value==0){removeall();}
						}
					}
				},
            //选择区域
				{
					xtype: 'selectfield',
					id: 'sel_area1',
					name: 'sel_area1',
					store: store_Area1,
					dispalyTextField: 'text',
					valueField: 'value',
					width: '20%',
					listeners: {
						change: function (sel, value) {
							if (value>0 && !isNaN(value) && value!='') {
								remove();
								start1=0;
								AreaIds=value;
								loadTotalMoney();
								storeDept.load({
									params:{AreaIds:AreaIds,hideDept:hideDept}
								});
								store_Dept.load({
									params:{AreaId:value,hideDept:hideDept}
								});
								store_Mgr_yx.load({
									params:{AreaId:value}
								});
								store_Mgr_xq.load({
									params:{AreaId:value}
								});
								
							}else if(value==0){
								remove();
							}
						}
					}
				},
            //选择门店
				{
					xtype: 'selectfield',
					id: 'sel_Dept',
					name: 'sel_Dept',
					store: store_Dept,
					dispalyTextField: 'text',
					valueField: 'value',
					width: '20%',
					listeners: {
						change: function (sel, value) {
							if (value>0 && !isNaN(value) && value!='') {
								remove1();
								DeptSelected(value);
							}
						}
					}
				},
				{
				    xtype: 'spacer'
				},
			//显示、隐藏已关门店
				{
					xtype:'panel',
					html:'<label><font color="white"> 隐藏已关门店 <input id="ckHideClosedDept" type="checkbox" onchange="fnHideDept()"  checked/></font></label>',
				},
				{
				    xtype: 'spacer'
				},
            //搜索栏
				{
					text:'门店搜索',
					id:'btn_DeptSearch',
					handler:function(){
						list_Emps.getScrollable().getScroller().scrollTo(0,0,true);
						pnl_DeptSearch.showBy(this);
					}
				},
				{
					text:'员工搜索',
					id:'btn_EmpSearch',
					handler:function(){
						pnl_EmpSearch.showBy(this);
					}
				}
			]

        });
		
		////顶层选择栏for历史现金查询
		var toolbar_HisCash = new Ext.Toolbar({
			docked: 'top',
			hidden:true,
            ui: 'dark',
			items:[
				{
					text:'筛选门店',
					id:'a',
					handler:function(){
						FilterDept.showBy(this);
					}
				},
				{
					xtype:'panel',
					id:'b',
					style:'color:#fff;',
					html:' &nbsp; &nbsp; &nbsp; 开始时间'
				},
				{
					xtype:'datepickerfield',
					id:'BeginTime',
					name:'BeginTime',
					width:'21%',
					value:new Date(),
					dateFormat:'Y-m-d',
					picker:{height:300}
				},
				{
					xtype:'panel',
					style:'color:#fff;',
					html:' &nbsp;结束时间'
				},
				{
					xtype:'datepickerfield',
					id:'EndTime',
					name:'EndTime',
					width:'21%',
					value:new Date(),
					dateFormat:'Y-m-d',
					picker:{height:300}
				},
				{
					text:'计算',
					handler:function(){
						start2=0;
						bbCount=list_FilterDept.getSelectionCount();
						if(bbCount==0){
							Ext.Msg.alert('提示','请选择门店！');
							return;
						}
						Depts='';
						var Records=list_FilterDept.getSelection();
						for(var i=0;i<Records.length;i++){
							Depts+=Records[i].get('Id');
							if(i<Records.length-1){
								Depts+=',';
							}
						}
						BeginTime=Ext.getCmp('BeginTime').getValue();
						EndTime=Ext.getCmp('EndTime').getValue();
						store_bb.load({
							params:{Depts:Depts,BeginTime:BeginTime,EndTime:EndTime,start:start2,limit:limit,hideDept:hideDept1}
						});
						loadTotalMoney_HisCash();
					}
				},
				{
				    xtype: 'spacer'
				},
				//显示、隐藏已关门店
				{
					xtype:'panel',
					html:'<label><font color="white"> 隐藏已关门店 <input id="ckHideClosedDept1" type="checkbox" onchange="fnHideDept1()"  checked/></font></label>',
				},
				{
				    xtype: 'spacer'
				}
			]
			
		});
		
        function showEmpInfo(subList, subIdx, el, e) {
            var store = subList.getStore();
            var record = store.getAt(subIdx);
            var ei = Ext.ModelMgr.getModel(empinfo);
            ei.load('', {
                params:{EmpId:record.get('id')},
				success: function (emp) {
					emp.set('Birthday',DateToString(ConvertJSONDateToJSDateObject(emp.get('Birthday'))));
					emp.set('HireDate',DateToString(ConvertJSONDateToJSDateObject(emp.get('HireDate'))));
					Ext.getCmp('Form_EmpInfo').setRecord(emp);
					Ext.getCmp('Form_EmpInfo').setMasked(false);
                }
            });
            store_worked.load({
				params:{EmpId:record.get('id')}
			});
            store_Imgurl.load({
				params:{EmpId:record.get('id')}
			});
            p.editPnl.show();
        }

        list_Emps = new Ext.List({
            id: 'list_Emps',
            emptyText: '没有数据',
            store: store_Emp,
            itemTpl:"<div id='Emp_{id}' style='height:120px;padding:10px;'>"+
					"<div style='float:left;'><img src='../../Imgs/EmpImgs/{imgurl}' onError='this.src=\"../../Imgs/DefaultImg.jpg\";' width='75px' height='100px' /></div>"+
					"<div style='float:left;margin-left:10px;width:68%;'>"+
					"<div style='float:left;'>"+
					"<div style='float:left;width:220px;'>姓名：{title}</div>"+
					"<div style='float:left;width:220px;'>联系电话：{mobile}</div>"+
					"</div><br/><br/><br/>"+
					"<div style='float:left;'>职位：{duty}</div>"+
					"</div>"+
					"</div>",
            listeners: {
                itemtap: showEmpInfo
            }
        });

        //底部选择栏
        tabpnl = new Ext.TabPanel({
            tabBarPosition: 'bottom',
			tabBar:{
				defaults:{width:70}
			},
			items: [
				{
				    title: '首页',
				    id:'btmHome',
					iconCls: 'home',
					layout:'fit',
					items:[pnl]
				},
				{
				    title: '营销经理',
				    id: 'tab1',
				    iconCls: 'user',
				    layout:'fit',
				    items: [
						{
						    xtype: 'list',
							id:'list_yxjl',
						    emptyText: '没有数据',
						    store: store_Mgr_yx,
						    itemTpl: new Ext.XTemplate(
									"<div style='height:100px;'>",
									"<div style='float:left;'><img src='../../Imgs/EmpImgs/{imgurl}' width='75px' height='100px' onError='this.src=\"../../Imgs/DefaultImg.jpg\";' /></div>",
									"<div style='float:left;margin-left:10px;width:68%;'>",
										"<div style='float:left;'>",
											"<div style='float:left;width:220px;'>姓名：{title}</div>",
											"<div style='float:left;width:220px;'>联系电话：{mobile}</div>",
										"</div><br/><br/><br/>",
										"<div style='float:left;'>职位：{duty}</div>",
									"</div>",
									"</div>"
							),
						    listeners: {
						        itemtap: showEmpInfo
						    }
						}
					]
				},
				{
				    title: '小区经理',
				    id: 'tab2',
				    iconCls: 'user',
				    layout: 'fit',
				    items: [
						{
						    xtype: 'list',
							id:'list_xqjl',
						    emptyText: '没有数据',
						    store: store_Mgr_xq,
						    itemTpl: new Ext.XTemplate(
									"<div style='height:120px;padding:10px;'>",
									"<div style='float:left;'><img src='../../Imgs/EmpImgs/{imgurl}' width='75px' height='100px' onError='this.src=\"../../Imgs/DefaultImg.jpg\";' /></div>",
									"<div style='float:left;margin-left:10px;width:68%;'>",
										"<div style='float:left;'>",
											"<div style='float:left;width:220px;'>姓名：{title}</div>",
											"<div style='float:left;width:220px;'>联系电话：{mobile}</div>",
										"</div><br/><br/><br/>",
										"<div style='float:left;'>职位：{duty}</div>",
									"</div>",
									"</div>"
							),
						    listeners: {
						        itemtap: showEmpInfo
						    }
						}
					]
				},
				{
				    title: '员工列表',
				    id: 'tab3',
				    iconCls: 'team',
				    layout: 'fit',
				    items: [list_Emps]
				},
				{
				    title: '门店信息',
				    iconCls: 'info',
				    layout: 'fit',
				    items: [{
				        xtype: 'formpanel',
				        id: 'Form_DeptInfo',
				        scroll: 'vertical',
				        items: [
							{
							    xtype: 'fieldset',
							    title: '门店信息',
							    defaults: {
							        labelWidth: 130,
							        style: 'font-size:1.2em;'
							    },
							    items: [
									{
									    xtype: 'textfield',
										id:'DInfo_Title',
									    name: 'Title',
									    label: '门店',
									    readOnly: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_LandLord',
									    label: '房东姓名',
									    name: 'LandLord',
									    readOnly: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_LordTel',
									    label: '电话',
									    name: 'LordTel',
									    readOnly: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_Rent',
									    label: '租赁期限',
									    name: 'Rent',
									    readOnly: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_Rental',
									    label: '租金',
									    name: 'Rental',
									    readOnly: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_Area',
									    label: '面积',
									    name: 'Area',
									    readOnly: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_BusinessLic',
									    label: '营业执照',
									    name: 'BusinessLic',
									    readOnly: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_LegalPerson',
									    label: '法人',
									    name: 'LegalPerson',
									    readOnly: true
									}
								]
							}
						]
				    }]
				},
				{
					title:'历史现金查询',
					id:'btmHistoryCash',
					iconCls:'bookmarks',
					layout:'fit',
					items:[pnl_HisCash]
				},
				{
					title:'更多',
					id:'btmMore',
					iconCls:'more',
					layout:'fit',
					items:[list_EditPwd]
				}
			],
			listeners:{
				activeitemchange:function(th,Value,oldValue,e){
					var id = Value.config.id;
					switch(id){
						case 'btmMore':
							for(var i=0;i<toolbar.items.length;i++){
								if(toolbar.items.get(i).getXTypes().indexOf('title')>=0){continue;}
								toolbar.items.get(i).hide('fade');
							}
							toolbar.setTitle('更多');
							break;
						default:
							toolbar.setTitle('');
							for(var i=0;i<toolbar.items.length;i++){
								toolbar.items.get(i).show('fade');
							}
					}
					if(id=='btmHistoryCash'){//历史现金报表
						toolbar.hide();
						toolbar_HisCash.show();
						wheelObj=list_HisCash;
					}else{
						toolbar.show();
						toolbar_HisCash.hide();
						switch(id){
							case 'btmHome'://首页报表
								wheelObj=LView;
							break;
							case 'tab1'://营销经理
								wheelObj=Ext.getCmp('list_yxjl');
							break;
							case 'tab2'://区域经理
								wheelObj=Ext.getCmp('list_xqjl');
							break;
							case 'tab3'://员工列表 
								wheelObj=list_Emps;
							break;
						}
					}
				} 
			}
        })
		
		removeDeptInfo=function(){
			Ext.getCmp('DInfo_Title').setValue('');
			Ext.getCmp('DInfo_LandLord').setValue('');
			Ext.getCmp('DInfo_LordTel').setValue('');
			Ext.getCmp('DInfo_Rent').setValue('');
			Ext.getCmp('DInfo_Rental').setValue('');
			Ext.getCmp('DInfo_Area').setValue('');
			Ext.getCmp('DInfo_BusinessLic').setValue('');
			Ext.getCmp('DInfo_LegalPerson').setValue('');
		}
		
		//Ext.Viewport.add(toolbar);
		//Ext.Viewport.add(toolbar_HisCash);
		//Ext.Viewport.add(tabpnl);
		
		new Ext.Panel({
			fullscreen:true,
			layout:'fit',
			items:[toolbar,toolbar_HisCash,
				new Ext.Panel({
					layout:'fit',
					items:[tabpnl]
				})
			]
		});
	}
});