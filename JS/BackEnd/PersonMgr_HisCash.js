var pnl_HisCash;
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

function AddbbToStorebb(){
	if(storeAddbb.data.items.length>0){
		store_bb.loadData(storeAddbb.data.items,true);
		storeAddbb.removeAll();
		list_HisCash.refresh();
	}else{return;}
	if(store_bb.getCount()==bbCount){
		Ext.getCmp('pnlforloadingbb').getEl().dom.style.display='none';
		return;
	}
	tf=true;
	if(store_bb.getCount()<bbCount){
		storeAddbb.load({
			params:{FieldName:FieldName_HisCash,Sort:Sort_HisCash,BeginTime:BeginTime,EndTime:EndTime,start:start2,limit:limit,Depts:Depts},
			callback:function(){
				tf=false;
			}
		});
	}
}

function loadTotalMoney_HisCash(){
	Ext.Ajax.request({
		url: '../../apis/PersonMgr.aspx?op=loadTotalMoney_HisCash&sid='+sid,
		params:{BeginTime:BeginTime,EndTime:EndTime,Depts:Depts},
		success: function(response, opts) {
		  var re = Ext.decode(response.responseText);
		  document.getElementById('div_TotalMoney_HisCash').innerText='现金合计：'+re.totalmoney;
		}
	});
}

Ext.setup({
	onReady: function () {
		
		var store_FilterDept=new Ext.data.Store({
			model:new Ext.regModel('', {
                fields: ['Id', 'DeptName']
            }),
			autoLoad:true,
			proxy:{
				url: '../../apis/PersonMgr.aspx?op=GetAllDept&sid='+sid,
				type: 'ajax',
				reader:{type:'json'}
			}
		});
		
		//报表_model
		var model_bb=new Ext.regModel('',{
			fields:['rownum','DeptID','DeptName',
				{name:'TargetPesent',convert:function(value){if(value>0){return (value*100).toFixed(2)+'%';}else{return '0.00%'}}},
				{name:'TotalCash',convert:FormatMoney},
				{name:'TargetMoney',convert:FormatMoney}
			]
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
			pnl_HisCash.scroller.clearListeners();
			if(store_bb.getCount()<limit){
				Ext.getCmp('pnlforloadingbb').getEl().dom.style.display='none';
				storeAddbb.removeAll();
				return;
			}
			start2+=25;
			//为AddbbToStorebb方法预加载一次数据
			storeAddbb.load({
				params:{FieldName:FieldName_HisCash,Sort:Sort_HisCash,Depts:Depts,BeginTime:BeginTime,EndTime:EndTime,start:start2,limit:limit}
			});
			//滚轮停止运动时的事件
			pnl_HisCash.scroller.on('scrollend',function(th,offsets){
				if(Math.abs(offsets.y)>=Math.abs(th.offsetBoundary.top)-10){
					if(store_bb.getCount()==bbCount){
						return;
					}
					Ext.getCmp('pnlforloadingbb').getEl().dom.style.display='none';
					//Ext.getCmp('pnlforloadingbb').getEl().dom.style.width=document.width+'px';
					Ext.getCmp('pnlforloadingbb').getEl().dom.style.height='40px';					
				}
			});
			//添加滚轮运动时的事件
			pnl_HisCash.scroller.on('offsetchange',function(th,offset){
				if(store_bb.getCount()==bbCount){
					Ext.getCmp('pnlforloadingbb').getEl().dom.style.display='none';
					return;
				}
				if(Math.abs(offset.y)>=Math.abs(th.offsetBoundary.top)){
					Ext.getCmp('pnlforloadingbb').getEl().dom.style.display='block';
					if(Math.abs(offset.y)<Math.abs(th.offsetBoundary.top-50)){
						Ext.getCmp('pnlforloadingbb').getEl().dom.innerText='下拉可以更新数据...';
					}else{
						Ext.getCmp('pnlforloadingbb').getEl().dom.innerText='松开立即更新...';
					}
				}
			});
			var addbb=false;
			//添加滚轮弹动事件
			pnl_HisCash.scroller.on('bouncestart',function(th,info){
				var y=th.getOffset().y;
				var ToaddDept=y-Math.abs(th.offsetBoundary.top);
				if(ToaddDept>=50){
					AddbbToStorebb();
				}
			});
		});
		
		list_HisCash=new Ext.List({
			store:store_bb,
			scroll:false,
			id:'list_HisCash',
			itemTpl:new Ext.XTemplate(
						'<div class="bb">',
							'<div style="width:70px;">{rownum}</div>',
							'<div style="width:150px;"> {DeptName}</div>',
							'<div style="width:150px;text-align:right;">{TotalCash}</div>',
							'<div style="width:150px;text-align:right;">{TargetMoney}</div>',
							'<div style="width:150px;">{TargetPesent}</div>',
						'</div>'
					)
		});
		
		//门店_list
		list_FilterDept=new Ext.List({
			width:'100%',
			height:'100%',
			id:'list_FilterDept',
			store:store_FilterDept,
			multiSelect:true,
			simpleSelect:true,
			cls: 'checkBtnList',
			itemTpl:'{DeptName}',
			onItemDisclosure:function(){
				//alert();
			}
		})
		
		FilterDept=new Ext.Panel({
			floating:true,
			modal:true,
			width:330,
			height:500,
			items:[list_FilterDept],
			dockedItems:[{
				xtype:'toolbar',
				dock:'top',
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
			}]
		});
		
		pnl_HisCash=new Ext.Panel({
			scroll:'vertical',
			id:'pnl_HisCash',
			items:[
				list_HisCash,
				{id:'pnlforloadingbb',style:'text-align:center;margin-top:15px;width:100%;',html:''}
			],
			dockedItems:[
					{
						xtype:'toolbar',
						dock:'top',
						html:'<div id="div_body" class="div_body">'+
							'<div style="width:70px;">序号</div>'+
							'<div style="width:150px;padding-left:2%;"><label onclick="fu_Sort_HisCash(0)">店名</labe></div>'+
							'<div style="width:150px;text-align:right;"><label onclick="fu_Sort_HisCash(1)">现金合计</label></div>'+
							'<div style="width:150px;text-align:right;"><label onclick="fu_Sort_HisCash(2)">现金指标</label></div>'+
							'<div style="width:150px;"><label onclick="fu_Sort_HisCash(3)">完成度</label></div>'+
							'</div>'
					},
					{
						xtype:'toolbar',
						dock:'bottom',
						items:[
							{
								xtype:'toolbar',
								style:'color:#FFF;',
								html:'<div id="div_body" class="div_body" style="width:400px;text-align:left;">'+
									"<div id='div_TotalMoney_HisCash' style='width:100%;'>现金合计：</div>"+
									'</div>',
							}
						]
					}
				]
		});
		
		fu_Sort_HisCash=function(ColumnIndex){
			d=0;
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
					params:{FieldName:FieldName_HisCash,Sort:Sort_HisCash,Depts:Depts,BeginTime:BeginTime,EndTime:EndTime}
				});
			}
			pnl_HisCash.scroller.setOffset({y:d},true);
		}
		
	}
});