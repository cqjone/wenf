		var start1=0;
		var limit=25;
		var DeptCount=0;
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
				params:{start:start1,limit:limit,DeptName:value}
			});
			storeDeptCount.load({
				params:{start:start1,limit:limit,DeptName:value}
			});
		}
		function SearchFn(value){
			clearTimeout(ForTimeOut);
			ForTimeOut=setTimeout('_SearchFn("'+value+'")',1000);
		}

		function loadTotalMoney(DeptName){
			Ext.Ajax.request({
				url: '../../apis/PersonMgr.aspx?op=loadTotalMoney&sid='+sid,
				params:{DeptName:DeptName,AreaId:AreaId},
				success: function(response, opts) {
				  var re = Ext.decode(response.responseText);
				  document.getElementById('div_TotalMoney').innerText='现金合计：'+re.totalmoney;
				}
			});
		}
		
		//动态将预加载的数据加载到storedept中
		function loadDataToStoreDept(){
			tf=true;
			if(storeAddDept.data.items.length>0){
				storeDept.loadData(storeAddDept.data.items,true);
			}else{return;}
			if(storeDept.getCount()<DeptCount){
				storeAddDept.load({
					params:{start:start1,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId},
					callback:function(){tf=false;}
				});
			}
			if(storeDept.getCount()==DeptCount){
				Ext.getCmp('pnlforloading').getEl().dom.style.display='none';
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
		function loadAllDataByDeptId_Animate(DeptId,type,EmpId){
		try{
							tabpnl.setActiveItem('tab3', 'fade');	
							if(list_Emps.scroller!=undefined && type!='SearchEmp'){
								list_Emps.scroller.setOffset({y:0},true);
							}
							if(type=='SearchEmp' && DeptId==Ext.getCmp('sel_Dept').getValue()){
								SetPointForSelectedEmp(EmpId,type,DeptId);
								return;
							}
							if(DeptId==Ext.getCmp('sel_Dept').getValue()){
								return;
							}
							store_Emp.removeAll();
							removeDeptInfo();
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
											
											store_Mgr_yx.load({
												params:{AreaId:AreaId}
											});
											store_Mgr_xq.load({
												params:{AreaId:AreaId}
											});
											
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
									if(type=='SearchEmp'){
										DeptSelected(DeptId,type,EmpId);
									}else{
										DeptSelected(DeptId);
									}
								},
								failure:function(){
									Ext.Msg.alert('提示','该门店未设置所属区域！');
									return;
								}
							});
		}catch(e){alert('loadAllDataByDeptId_Animate_'+e);}
		}
		
        Ext.setup({
            onReady: function () {
				storeDeptCount=new Ext.data.Store({
					autoLoad:true,
					model:new Ext.regModel('',{
						fields:['DeptCount']
					}),
					proxy:{
						type:'ajax',
						url:'../../Apis/PersonMgr.aspx?op=GetDeptCount&sid='+sid,
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
				var DeptModel=new Ext.regModel('',{
					fields: ['rownum','DeptID','DeptName',
						{name:'TargetPesent',convert:function(value){if(value>0){return (value*100).toFixed(2)+'%';}else{return '0.00%'}}},
						{name:'TargetMoney',convert:FormatMoney},
						{name:'TotalCash',convert:FormatMoney},
						{name:'mrs',type:'int',convert:FormatCount},
						{name:'mfs',type:'int',convert:FormatCount}
					]
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
					autoLoad:true,
					proxy:{
						type:'ajax',
						url:'../../Apis/PersonMgr.aspx?op=GetDeptInfo&sid='+sid,
						reader:{
							type:'json'
						}
					},
					listeners:{
						load :function(thStore){
							wheelObj = pnl;
							pnl.scroller.clearListeners();
							if(storeDept.getCount()<limit){
								Ext.getCmp('pnlforloading').getEl().dom.style.display='none';
								storeAddDept.removeAll();
								return;
							}
							start1+=25;
							//为loadDataToStoreDept方法预加载一次数据
							storeAddDept.load({
								params:{start:start1,limit:limit,DeptName:SearchValue,FieldName:FieldName,Sort:sortId,AreaId:AreaId}
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
							var re=storeDept.getAt(index);
							loadAllDataByDeptId_Animate(re.get('DeptID'));
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
					d=0;
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
						storeDept.load({
							params:{FieldName:FieldName,Sort:sortId}
						});
					}
					pnl.scroller.setOffset({y:0},true);
				}
				
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
									loadTotalMoney(SearchValue);
									pnl_searchDept.hide();
								}
							}
						}]
					}],
					listeners:{
						show:function(){
							Ext.getCmp('Search_field').focus();
						}
					}
				});
				
				fn_SearchDeptInMain=function(){
					pnl_searchDept.showBy(Ext.get('img_SearchDeptInMain'),'fade');
				}
			}
		});
