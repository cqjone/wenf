//分页加载时开始加载的位置
var start = 0;
var limit=25;
var storeDept;
var store_Dept;
var store_Area;
var store_Area1;
var store_SearchDept;
var model_DeptInfo;
var removeDeptInfo;
var ForTimeOut;
var fn_Sort_Home;//点击标题排序
var fn_SearchDeptInMain;
var sortId='asc';
var storeDeptCount;
var SearchValue;
var FieldName;
var addDept=false;//是否加载数据
var AreaIds='';
var tf;
var LView;
var DeptCount;
var hideDept=true;//隐藏已经关闭的门店 true:隐藏、false:显示

var scrollFn = function(e) {    
    var direct = 0,e = e || window.event;        
	var scroller = LView.getScrollable().getScroller();
	//滚轮与拖拽的滚轮定位
	d=(scroller.position.y);
	if (e.wheelDelta) {
		d+=-e.wheelDelta;
    }else if (e.detail) {
		d+=e.detail;
    }
	
	if(!tf){
		loadDataToStoreDept();
	}
	
	if(d<=0){
		d=0;
	}
	
	//防止滚轮滑动的太远
	if(Math.abs(d)>scroller.maxPosition.y){
		d=scroller.maxPosition.y;
	}
	
	scroller.scrollTo(0,d);
};

if(document.attachEvent){

document.attachEvent("onmousewheel",scrollFn);  //IE、 opera

}else if(document.addEventListener && window.navigator.userAgent.toLowerCase().indexOf("firefox") == -1){

document.addEventListener("mousewheel",scrollFn,false);  //chrome,safari

}else if(window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1){

document.addEventListener("DOMMouseScroll",scrollFn,false);  //firefox

}


function ShowImgSize(img){
	var height = img.height;
	var width = img.width;
	var ip = Ext.getCmp("imgPanel");
	ip.setHeight(height);
	ip.setWidth(width);
}
function ShowImg(url) {
	new Ext.Panel({
        //fullscreen:true,
		id:'imgPanel',
        floating: true,
        centered: true,
        modal: true,
        layout: 'fit',
        html: '<img src="' + url + '" onload="ShowImgSize(this);"/>',
        listeners: {
            'show': function () {
                p.editPnl.hide();
            },
            'hide': function () {
                p.editPnl.show();
            }
        }
    }).show();
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

//通过搜索、首页报表点击门店搜索数据&搜索员工
//NoEmpId未在客户端中找到EmpId,从服务器获取数据
function loadAllDataByDeptId_Animate(DeptId,type,EmpId){
	try{
		if(DeptId==Ext.getCmp('sel_Dept').getValue()){
			return;
		}
		
		//门店所属区域Id的父区域Id
		var ParentId;
		//门店所属区域Id
		var AreaId;
		Ext.Ajax.request({
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
							if(store_Area.getCount()>0){
								Ext.getCmp('sel_area').setValue(ParentId);
							}else{
								store_Area.removeListener('load');
								store_Area.on('load',function(){
									Ext.getCmp('sel_area').setValue(ParentId);
								});
							}
							store_Area1.load({
								params:{PId:ParentId},
								callback:function(){
									Ext.getCmp('sel_area1').setValue(AreaId);
								}
							});
						}else{
							Ext.getCmp('sel_area').setValue(AreaId);
						}
						
						store_Dept.load({
							params:{AreaId:AreaId,hideDept:hideDept},
							callback:function(){
								Ext.getCmp('sel_Dept').setValue(DeptId);
							}
						});
					}else{
						Ext.getCmp('sel_Dept').setValue(DeptId);
					}
				}else{
					if(type!='SearchEmp'){
						Ext.Msg.alert('提示','该门店未设置所属区域！');
						return;
					}
				}
				start=0;//问题1
			},
			failure:function(){
				Ext.Msg.alert('提示','该门店未设置所属区域！');
				return;
			}
		});
	}catch(e){alert('Method:loadAllDataByDeptId_Animate_'+e);}
}
function _SearchFn(searValue){
	start=0;
	hideDept = document.getElementById('ckHideClosedDept').checked;
	storeDept.load({
		params:{start:start,limit:limit,DeptName:searValue,AreaIds:AreaIds,hideDept:hideDept},
		callback:function(){
			LView.refresh();
		}
	});
	storeDeptCount.load({
		params:{start:start,limit:limit,DeptName:searValue,AreaIds:AreaIds}
	});
}
function SearchFn(searValue){
	clearTimeout(ForTimeOut);
	ForTimeOut=setTimeout(_SearchFn(searValue),1000);
}
//动态将预加载的数据加载到storedept中
function loadDataToStoreDept(){
	tf=true;
	if(storeAddDept.getCount()>0){
		var scroller = LView.getScrollable().getScroller();
		var top = scroller.maxPosition.y;
		storeDept.add(storeAddDept.data.items);
		storeAddDept.removeAll();
		LView.refresh();
		scroller.scrollTo(0,top);
	}else{return;}
	if(storeDept.getCount()<DeptCount){
		storeAddDept.load({
			params:{start:start,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId,AreaIds:AreaIds,hideDept:hideDept},
			callback:function(){tf=false;}
		});
	}
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

//记录本地配置的区域
function getAreaIds(thStore){
	AreaIds=Ext.getCmp('sel_area').getValue()+',';
	for(var i=0;i<thStore.getCount();i++){
		AreaIds += thStore.getAt(i).get('value') +',';
	}
}

function fnHideDept()
{
	hideDept=document.getElementById('ckHideClosedDept').checked;
	Ext.getCmp('sel_area').reset();
	Ext.getCmp('sel_area').setValue(store_Area.getAt(1).get('value'));
}

var p=function(){}

Ext.setup({
    tabletStartupScreen: '../../JS/touch/resources/img/tablet_startup.png',
    phoneStartupScreen: '../../JS/touch/resources/img/phone_startup.png',
    icon: '../../JS/touch/resources/img/icon.png',
    glossOnIcon: false,

    onReady: function () {
		
		//
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
		
		//
		storeDeptCount=new Ext.data.Store({
			fields:['DeptCount'],
			proxy:{
				type:'ajax',
				url:'../../Apis/PersonMgr.aspx?op=GetDeptCountByArea&sid='+sid,
				reader:{
					type:'json'
				}
			},
			listeners:{
				load:function(thStore){
					DeptCount=thStore.getAt(0).data['DeptCount'];
				}
			}
		});
		
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
            model:model_select,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadArea&PType=deptyj&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });
		store_Area.on('load',function(thStore){
			Ext.getCmp('sel_area').setValue(thStore.getAt(1).get('value'));
		});

        store_Area1 = new Ext.data.Store({
            model: model_select,
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadArea1&PType=deptyj&sid='+sid,
                reader: {
                    type: 'json'
                }
            },
			data: [{ text: '请选择', value: '0'}],
			listeners:{
				load:function(thStore){
					getAreaIds(thStore);
					storeDept.load({
						params:{AreaIds:AreaIds,hideDept:hideDept}
					});
					storeDeptCount.load({
						params:{AreaIds:AreaIds}
					});
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
            },
            data: [{ text: '请选择', value: '0'}]
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
        
		storeDept = new Ext.data.Store({
			model:DeptModel,
			proxy:{
				type:'ajax',
				url:'../../Apis/PersonMgr.aspx?op=GetDeptInfoByArea&sid='+sid,
				reader:{
					type:'json'
				}
			}
		});
		storeDept.on('load',storeDeptLoaded);
		function storeDeptLoaded(thStore){
			if(thStore.getCount()==0){
				document.getElementById('div_TotalMoney').innerHTML='现金合计：0.00 &nbsp; &nbsp;完成度：0.00%';
				return;
			}
			LView.refresh();
			loadTotalMoney();
			var scroller=LView.getScrollable().getScroller();
			scroller.clearListeners();
			if(storeDept.getCount()<limit){
				storeAddDept.removeAll();
				SearchValue='';
				return;
			}
			SearchValue='';
			start+=25;
			//为loadDataToStoreDept方法预加载一次数据
			storeAddDept.load({
				params:{start:start,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId,AreaIds:AreaIds,hideDept:hideDept}
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

		storeAddDept = new Ext.data.Store({
			model:DeptModel,
			proxy:{
				type:'ajax',
				url:'../../Apis/PersonMgr.aspx?op=GetDeptInfoByArea&type=adddept&sid='+sid,
				reader:{
					type:'json'
				}
			},
			listeners:{
				load:function(){
					start+=25;
					if(storeAddDept.getCount()==0){
						DeptCount=storeDept.getCount();
					}
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
					'</div>'
		});
				
		pnl=new Ext.Panel({
			id:'pnl_body',
			scroll:'vertical',
			layout:'fit',
			items:[
				{
					docked:'top',
					items:[
						{
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
						}
					]
				},
				LView,
				{
					docked:'bottom',
					items:[
						{
							xtype:'toolbar',
							style:'color:#FFF;',
							html:'<div id="div_body" class="div_body" style="width:600px;text-align:left;">'+
								"<div id='div_TotalMoney' style='width:100%;'>现金合计：&nbsp &nbsp; 完成度：</div>"+
								'</div>'
						}
					]
				}
			]
		});
				
		//点击标题排序
		fn_Sort_Home=function (ColmunIndex){
			if(storeDept.getCount() ==0 || storeDept.getCount()==1){
				return;
			}
			start=0;
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
		
        //清空所有数据
        function removeall() {
			store_Area1.removeAll();
			store_Area1.insert(0,TOChooseModel);
            remove();
        }
        //清空区域以及其下的所有数据
        function remove() {
			//SearchValue = '';
			chooseDept=false;
			storeDept.on('load',storeDeptLoaded);
			LView.getScrollable().getScroller().scrollTo(0,0);
			store_Dept.removeAll();
			store_Dept.insert(0,TOChooseModel);
        }

		var pnl_DeptSearch=new Ext.Panel({
			width:300,
			height:450,
			floating: true,
            modal: true,
			items:[
				{
					xtype:'toolbar',
					height:50,
					dock:'top',
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
					height:385,
					store:store_SearchDept,
					itemTpl :'{DeptName}',
					listeners:{
						itemtap:function(th,index){
							var re=store_SearchDept.getAt(index);
							pnl_DeptSearch.hide('fade');
							loadAllDataByDeptId_Animate(re.get('DeptID'));
						}
					}
				}
			]
		});
		
        //顶层选择栏
		var chooseDept=false;
        var toolbar = new Ext.Toolbar({
			docked: 'top',
            items: [
            //选择地区
			{
				xtype: 'selectfield',
				id: 'sel_area',
				name: 'sel_area',
				store: store_Area,
				displayField: 'text',
				valueField: 'value',
				width: '20%',
				listeners: {
				    change: function (sel, value) {
				        removeall();
						if (value>0 && !isNaN(value) && value!='') {
							Ext.getCmp('Search_field').setValue('');//清空放大镜门店搜索框
							store_Area1.load({
								params:{PId:value}
							});
				            store_Dept.load({
								params:{AreaId:value,hideDept:hideDept}
							});
							start =0 ;
				        }
				    }
				}
			},
            //选择区域
			{
				xtype: 'selectfield',
				id: 'sel_area1',
				name: 'sel_area1',
				store: store_Area1,
				dispalyField: 'text',
				valueField: 'value',
				width: '20%',
				listeners: {
				    change: function (sel, value) {
				        //remove();
						if (value>0 && !isNaN(value) && value!='') {
							store_Dept.load({
								params:{AreaId:value,hideDept:hideDept}
							});
							start = 0;
							AreaIds=value;
							storeDept.load({
								params:{AreaIds:AreaIds,hideDept:hideDept},
								callback:function(){
									LView.refresh();
								}
							});
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
				dispalyField: 'text',
				valueField: 'value',
				value: 0,
				width: '20%',
				listeners: {
				    change: function (sel, value) {
						LView.deselectAll();
						if (value>0 && !isNaN(value) && value!='') {
							start = 0;
							var mask = Ext.Msg.show({
								title:'',
								message:'加载中...',
								buttons:[]
							});
							try{
								document.getElementById('div_TotalMoney').innerText='现金合计：';
								storeDept.clearListeners();
								storeDept.load({
									params:{DeptName:sel.getRecord().get('text'),hideDept:hideDept},
									callback:function(records){
										storeAddDept.removeAll();
										LView.refresh();
										mask.hide();
										LView.getScrollable().getScroller().removeListener('scrollend');
										document.getElementById('div_TotalMoney').innerText='现金合计：' + records[0].get('TotalCash');
									}
								});
								
								chooseDept=true;
							}catch(e){
								mask.show({
									title:'错误',
									message:e,
									buttons:Ext.MessageBox.OK
								});
								storeDept.on('load',storeDeptLoaded);
							}
						}else if(value == 0){
							if(chooseDept){
								chooseDept=false;
								storeDept.on('load',storeDeptLoaded);
								storeDept.load({
									params:{AreaIds:AreaIds,hideDept:hideDept},
									callback:function(){
										LView.refresh();
									}
								});
							}
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
				html:'<label><font color="white"> 隐藏已关门店 <input id="ckHideClosedDept" type="checkbox" onchange="fnHideDept()" checked /></font></label>',
			},
			{
				xtype: 'spacer'
			}]
        });
		
		//底部选择栏
        tabpnl = new Ext.TabPanel({
            tabBarPosition: 'bottom',
            items: [
				{
				    title: '首页',
				    iconCls: 'home',
					layout:'fit',
					items:[pnl]
				},
				{
					title:'更多',
					id:'more',
					iconCls:'more',
					layout:'fit',
					items:[list_EditPwd]
				}
			],
			listeners:{
				activeitemchange:function(th,newCard,oldCard,e){
					switch(newCard.config.id){
						case 'more':
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
				}
			}
        })
	
		//Ext.Viewport.add(tabpnl);
		//Ext.Viewport.add(toolbar);
		
		new Ext.Panel({
			fullscreen:true,
			layout:'fit',
			items:[toolbar,
			new Ext.Panel({
				layout:'fit',
				items:[tabpnl]
			})]
		});
		
		var pnl_searchDept=new Ext.Panel({
			modal:true,
			hideOnMaskTap:true,
			items:[{
				xtype:'toolbar',
				items:[{
					xtype:'searchfield',
					id:'Search_field',
					listeners:{
						change:function(th,newValue){
							if(th.getValue().replace(/\s+/g,"")!=''){
								AreaIds='';
								SearchValue=newValue;
								SearchFn(SearchValue);
								//loadTotalMoney();
								Ext.getCmp('sel_area').setValue('');
								Ext.getCmp('sel_area1').setValue('');
								Ext.getCmp('sel_Dept').setValue('');
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
	}
});