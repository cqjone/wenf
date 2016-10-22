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
var wheelObj;

var scrollFn = function(e) {    
    var direct = 0,e = e || window.event;        
	
	//滚轮与拖拽的滚轮定位
	d=-(wheelObj.scroller.getOffset().y);
	if (e.wheelDelta) {
		d+=e.wheelDelta;
    }else if (e.detail) {
		d+=e.detail;
    }

	scrollHeig=wheelObj.scroller.offsetBoundary.top;

	//document.title=scrollHeig;
	if(scrollHeig!=(-30) && scrollHeig!=0 && Math.abs(d)>=Math.abs(scrollHeig)){
		d=scrollHeig;
	}

	if(!tf){
		switch(wheelObj){
			case pnl://首页报表
				loadDataToStoreDept();
				break;
			case pnl_HisCash://历史现金报表
				AddbbToStorebb();
				break;
			case list_Emps:
				LoadEmps();
				break;
		}
	}
	if(d>=0){
		d=0;
	}
	
	//document.title=d;
	//防止滚轮滑动的太远（未获得滑轮scroller.offsetBoundary.top的情况下）
	if(wheelObj.id.indexOf('list')>=0){
		if(Math.abs(d)>wheelObj.getEl().dom.children[0].offsetHeight-330){
			d=-(wheelObj.getEl().dom.children[0].offsetHeight-350);
		}
	}else{
		if(Math.abs(d)>wheelObj.getEl().dom.children[2].children[0].offsetHeight-330){
			d=-(wheelObj.getEl().dom.children[2].children[0].offsetHeight-350);
		}
	}
	wheelObj.scroller.setOffset({y:d});
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
		params:{DeptName:SearchValue,AreaIds:AreaIds},
		success: function(response, opts) {
			SearchValue='';
			var re = Ext.decode(response.responseText);
			document.getElementById('div_TotalMoney').innerText='现金合计：'+re.totalmoney;
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
		//storeDept.load({});
	}catch(e){alert('loadAllDataByDeptId_Animate_'+e);}
}
function _SearchFn(value){
	start=0;
	storeDept.load({
		params:{start:start,limit:limit,DeptName:value,AreaIds:AreaIds}
	});
	storeDeptCount.load({
		params:{start:start,limit:limit,DeptName:value,AreaIds:AreaIds}
	});
}
function SearchFn(value){
	clearTimeout(ForTimeOut);
	ForTimeOut=setTimeout(_SearchFn(value),1000);
}
//动态将预加载的数据加载到storedept中
function loadDataToStoreDept(){
	tf=true;
	if(storeAddDept.data.items.length>0){
		storeDept.loadData(storeAddDept.data.items,true);
	}else{return;}
	if(storeDept.getCount()<DeptCount){
		storeAddDept.load({
			params:{start:start,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId,AreaIds:AreaIds},
			callback:function(){tf=false;}
		});
	}
	if(storeDept.getCount()==DeptCount){
		Ext.getCmp('pnlforloading').getEl().dom.style.display='none';
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

var p=function(){}

Ext.setup({
    tabletStartupScreen: '../../JS/touch/resources/img/tablet_startup.png',
    phoneStartupScreen: '../../JS/touch/resources/img/phone_startup.png',
    icon: '../../JS/touch/resources/img/icon.png',
    glossOnIcon: false,

    onReady: function () {
		storeDeptCount=new Ext.data.Store({
			autoLoad:true,
			model:new Ext.regModel('',{
				fields:['DeptCount']
			}),
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
		storeDeptCount.load({
			params:{AreaIds:AreaIds}
		});
		
        var model_select = new Ext.regModel('model_select', { fields: ['value', 'text'] });
		var TOChooseModel = new  Ext.ModelMgr.create({
			text:'请选择',
			value:'ToChoose'
		}, model_select);
		
        store_Area = new Ext.data.Store({
            model: new Ext.regModel('', { fields: ['value', 'text'] }),
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadArea&PType=deptyj&sid='+sid,
                reader: {
                    type: 'json'
                }
            },
        });
		store_Area.on('load',function(thStore){
			AreaIds = thStore.getAt(1).get('value');
			Ext.getCmp('sel_area').setValue(AreaIds);
			store_Area1.load({
				params:{PId:AreaIds}
			});
			store_Area1.on('load',function(thStore){
				if(thStore.getCount()==1){
					storeDept.load({
						params:{AreaIds:AreaIds}
					});
				}
				store_Area1.clearListeners();
				//重写store_Area1的load事件
				store_Area1.on('load',function(thStore){
					getAreaIds(thStore);
					if(AreaIds=='0,'){
						AreaIds=Ext.getCmp('sel_area').getValue();
					}
					storeDept.load({
						params:{AreaIds:AreaIds}
					});
				});
			});
			store_Dept.load({
				params:{AreaId:AreaIds}
			});
		});

        store_Area1 = new Ext.data.Store({
            model: model_select,
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadArea1&PType=deptyj&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });
		store_Area1.on('load',function(thStore){
			getAreaIds(thStore);
			if(AreaIds=='0,'){
				AreaIds=Ext.getCmp('sel_area').getValue();
			}
			storeDept.load({
				params:{AreaIds:AreaIds}
			});
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
			data: [{ text: '请选择', value: '0'}],
            listeners: {
                load: function (thStore) {
					var ListPanel=Ext.getCmp('sel_Dept').getListPanel();
					var SelId=ListPanel.id;
					if(Ext.getCmp(SelId)!=null){
						var height=thStore.getCount()*47;
						Ext.getCmp(SelId).setHeight(height+12);
					}
                }
            }
        });
		
		var DeptModel=new Ext.regModel('',{
			fields: ['rownum','DeptID','DeptName',
				{name:'TargetPesent',convert:function(value){if(value>0){return (value*100).toFixed(2)+'%';}else{return '0.00%'}}},
				{name:'TargetMoney',convert:FormatMoney},
				{name:'TotalCash',convert:FormatMoney},
				{name:'mrs',type:'int',convert:FormatCount},
				{name:'mfs',type:'int',convert:FormatCount}
			]
		});
        storeDept = new Ext.data.Store({
			model:DeptModel,
			proxy:{
				type:'ajax',
				url:'../../Apis/PersonMgr.aspx?op=GetDeptInfoByArea&sid='+sid,
				reader:{
					type:'json'
				}
			},
			listeners:{
				load :function(){
					wheelObj = pnl;
					loadTotalMoney();
					pnl.scroller.clearListeners();
					if(storeDept.getCount()<limit){
						Ext.getCmp('pnlforloading').getEl().dom.style.display='none';
						storeAddDept.removeAll();
						return;
					}
					start+=25;
					//为loadDataToStoreDept方法预加载一次数据
					storeAddDept.load({
						params:{start:start,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId,AreaIds:AreaIds}
					});
					//滚轮停止运动时的事件
					pnl.scroller.on('scrollend',function(th,offsets){
						if(Math.abs(offsets.y)>=Math.abs(th.offsetBoundary.top)-10){
							if(storeDept.getCount()==DeptCount){
								return;
							}
							Ext.getCmp('pnlforloading').getEl().dom.style.display='none';
							Ext.getCmp('pnlforloading').getEl().dom.style.width=document.width+'px';
							Ext.getCmp('pnlforloading').getEl().dom.style.height='40px';
							if(addDept){
								addDept=false;
								loadDataToStoreDept();
							}
						}
					else if(offsets.y>=0){
							Ext.getCmp('pnlReFresh').getEl().dom.style.display='none';
						}
					});
					//添加滚轮运动时的事件
					pnl.scroller.on('offsetchange',function(th,offset){
						if(storeDept.getCount()==DeptCount){
							Ext.getCmp('pnlforloading').getEl().dom.style.display='none';
						return;
						}
						if(Math.abs(offset.y)>=Math.abs(th.offsetBoundary.top)){
							Ext.getCmp('pnlforloading').getEl().dom.style.display='block';
							if(Math.abs(offset.y)<Math.abs(th.offsetBoundary.top-50)){
								Ext.getCmp('pnlforloading').getEl().dom.innerText='下拉可以更新数据...';
									}else{
										Ext.getCmp('pnlforloading').getEl().dom.innerText='松开立即更新...';
									}
								}else if(offset.y>50){
									Ext.getCmp('pnlReFresh').getEl().dom.style.display='block';
								}
							});
					//添加滚轮弹动事件
					pnl.scroller.on('bouncestart',function(th,info){
								var y=th.getOffset().y;
								var ToaddDept=y-Math.abs(th.offsetBoundary.top);
								if(ToaddDept>=50){
									addDept=true;
								}
					});
				}
			}
		});

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
			model:new Ext.regModel('',{
				fields: ['DeptID', 'DeptName']
			}),
			proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=searchdept&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
		});

		var LView=new Ext.List({
			store:storeDept,
			scroll:false,
			emptyText:'没有数据',
			itemTpl:new Ext.XTemplate(
				'<div class="bb">',
					'<div style="width:8%;">{rownum}</div>',
					'<div style="width:19%;">{DeptName}</div>',
					'<div style="width:15%;text-align:right;">{TotalCash}</div>',
					'<div style="width:15%;text-align:right;">{TargetMoney}</div>',
					'<div style="width:15%;">{TargetPesent}</div>',
					'<div style="width:14%;">{mrs}</div>',
					'<div style="width:14%;">{mfs}</div>',
				'</div>'
			),
			listeners:{
				itemtap:function(th,index){
					//var re=storeDept.getAt(index);
					//loadAllDataByDeptId_Animate(re.get('DeptID'));
				}
			}
		});
				
		pnl=new Ext.Panel({
					id:'pnl_body',
					scroll:'vertical',
					items:[
						{id:'pnlReFresh',style:'text-align:center;',html:'松开立即刷新...',hidden:true},
						LView,
						{id:'pnlforloading',style:'text-align:center;margin-top:15px;',html:''}
					],
					dockedItems:[
						{
							dock:'top',
							id:'tool',
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
						{
							dock:'bottom',
							items:[
								{
									xtype:'toolbar',
									style:'color:#FFF;',
									html:'<div id="div_body" class="div_body" style="width:400px;text-align:left;">'+
										"<div id='div_TotalMoney' style='width:100%;'>现金合计：</div>"+
										'</div>'
								}
							]
						}
					],
					listeners:{
						orientationchange:function(th){
							th.doLayout();
							LView.width=th.width;
						},
						afterlayout:function(th){
							LView.width=th.width;
							Ext.getCmp('tool').doLayout();
						},
						added:function(){loadTotalMoney();}
					}
				});
				
		//点击标题排序
		fn_Sort_Home=function (ColmunIndex){
			if(storeDept.getCount() ==0 || storeDept.getCount()==1){
				return;
			}
			d=0;
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
				storeDept.load({
					params:{FieldName:FieldName,Sort:sortId,AreaIds:AreaIds}
				});
				loadTotalMoney();
			}
			pnl.scroller.setOffset({y:0},true);
		}
		
        //清空所有数据
        function removeall() {
			store_Area1.removeAll();
			Ext.getCmp('sel_area1').setValue('请选择');
            remove();
        }
        //清空区域以及其下的所有数据
        function remove() {
            store_Dept.removeAll();
			var ListPanel=Ext.getCmp('sel_Dept').getListPanel();
			if(Ext.getCmp(ListPanel.id)!=null){
				ListPanel.setHeight(60);
			}
			Ext.getCmp('sel_Dept').setValue('请选择');
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
        var toolbar = new Ext.Toolbar({
			dock: 'top',
            ui: 'dark',
            layout: {
                type: 'hbox',
                align: 'center'
            },
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
				        removeall();
						if (value>0 && !isNaN(value) && value!='') {
				            store_Area1.load({
								params:{PId:value}
							});
				            store_Dept.load({
								params:{AreaId:value}
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
				dispalyTextField: 'text',
				valueField: 'value',
				value: '请选择',
				width: '20%',
				listeners: {
				    change: function (sel, value) {
				        remove();
				        if (value > 0) {
				            store_Dept.load({
								params:{AreaId:value}
							});
							start = 0;
							AreaIds=value;
							storeDept.load({
								params:{AreaIds:AreaIds}
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
				dispalyTextField: 'text',
				valueField: 'value',
				value: '请选择',
				width: '20%',
				listeners: {
				    change: function (sel, value) {
				        if (value>0 && !isNaN(value) && value!='') {
							var record;
							for(var i=0;i<store_Dept.getCount();i++){
								record = store_Dept.getAt(i);
								if(record.get('value')==value){
									SearchValue = record.get('text');
									break;
								}
							}
							storeDept.load({
								params:{start:0,limit:2,DeptName:SearchValue}
							});
						}
				    }
				}
			}
			]
        });

		//底部选择栏
        tabpnl = new Ext.TabPanel({
            fullscreen: true,
			width:'100%',
			height:'100%',
            tabBar: {
                dock: 'bottom',
                ui: 'dark',
				defaults:{
					width:80
				},
                layout: {
                    pack: 'center'
                }
            },
            cardSwitchAnimation: {
                type: 'fade'
            },
            items: [
				{
				    title: '首页',
				    iconCls: 'home',
					layout:'fit',
					items:[pnl]
				},
				{
					title:'更多',
					iconCls:'more',
					items:[list_EditPwd]
				}
			],
			listeners:{
				cardswitch :function(th,newCard,oldCard,index,animated){
					switch(index){
						case tabpnl.items.length-1:
							for(var i=0;i<toolbar.items.length;i++){
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
		
        var mainpnl = new Ext.Panel({
            fullscreen: true,
            layout: 'fit',
            items: [tabpnl],
            dockedItems: [{
				dock:'top',
				items:[toolbar]
			}],
            listeners: {
                orientationchange: function (th, orientation, width, height) {
					/*var width=0;
					var height=0;
					if(Ext.is.iPhone){
						if (orientation == 'portrait') {
							p.editPnl.setHeight(380);
						} else {
							p.editPnl.setHeight(300);
						}
					}else{
						if (orientation == 'portrait') {
							p.editPnl.setHeight(700);
						} else {
							p.editPnl.setHeight(520);
						}
					}*/
                }
            }
        });
		
		var pnl_searchDept=new Ext.Panel({
					floating:true,
					modal:true,
					items:[{
						xtype:'toolbar',
						items:[{
							xtype:'searchfield',
							id:'Search_field',
							listeners:{
								change:function(th,e){
									if(th.getValue().replace(/\s+/g,"")!=''){
										SearchValue=th.getValue();
										SearchFn(SearchValue,e);
									}else{
										SearchValue='';
										SearchFn(SearchValue);
									}
									getAreaIds(store_Area1);
									loadTotalMoney();
									pnl_searchDept.hide();
								}
							}
						}]
					}],
					listeners:{
						show:function(){
							Ext.getCmp('Search_field').focus();
						},
						hide:function(){
							Ext.getCmp('Search_field').setValue('');
						}
					}
		});
		fn_SearchDeptInMain=function(){
			pnl_searchDept.showBy(Ext.get('img_SearchDeptInMain'),'fade');
		}
	}
});