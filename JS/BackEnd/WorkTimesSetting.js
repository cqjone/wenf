  
  //时间的年份月份
 var queryYear = "";
 var queryMonth = "";
 
   //月份最大值
    var MaxMonthValue=0;
             
             
    //点击获取某列的入职年份和月份
	var EntryYear="";
	var EntryMonth="";
	var WorkMonth="";
   var  WorkYear="";
	var ZWtitle="";
	
  
     //设置显示默认日期
 
	var now = new Date();
	var date = now.format('Y年m月');
	 queryYear = now.getFullYear();
	 var month=now.getMonth()+1;
	 if(month<10)
	 {
	 month+="0";
	 }
     queryMonth = month;
	

          
          
            
            //职位下拉框
      var ZWStore = new Ext.data.ArrayStore({
		fields : ['ID', 'Title'],
		data : [
		    ["1", "实习期"],
			["2", "初级"],
			["3", "中级"],
			["4", "高级"],
			["5", "普通"],
			]
	});
	var RankCom = new Ext.form.ComboBox({
		name : "Rank",
		store : ZWStore,
		id: "zwValue",
		hiddenName : "Rank",
		width : 100,
		margin : '0 0 0 20',
		mode : 'local',
		value:'ID',
		triggerAction : 'all',
		valueField : 'Title',
		displayField : 'Title',
		  triggerAction: 'all',
		editable : false,
		listeners : {									
			'select':function(){

			if(this.getValue()=="普通")
			{
			if(ZWtitle=="收银员")
			{
			 Ext.Msg.show({
    title:'错误提示！',
    msg:'收银员不能选择此级别！请重新选择！',
    buttons:Ext.Msg.YES
});
			Ext.getCmp("zwValue").setValue("");
			}
			}
		
//			var ss= Ext.getCmp("zwValue").Value();
//							alert( this.getValue());
//							  records = pd_grid.getStore().getAt(i);	
							 }
		  }
	});
    



//列表数据
	 var pd_storeList = ["ID","大区","区域","门店","工号","姓名","职务","级别","入职年份","入职月份","工龄年份","工龄月份","备注" ];

        var pd_store = new Ext.data.Store({
			url : '../Apis/WorkTimesSetting.aspx?actionName=getdate&sid=' + Sys.sid,
			reader : new Ext.data.JsonReader({
			        root: "results",
                    id: "ID",
                    totalProperty: "totalCount",
			fields: pd_storeList,
				
			}),
			 groupField: 'ID',
			 sortInfo: { field: 'ID', direction: "ASC" }
		});
	
	
 pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
         var colModel = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
                        new Ext.grid.RowNumberer(),                     //自动编号。
                      //sm,                                                              //复选框。
                       { header: 'ID', align: "center",  dataIndex: 'ID',hidden:true },                     //这个编号是ds中的创建的id。
                       { header: '<font style="font-weight:bold;">大区</font>',width :80,align: "left",  dataIndex: '大区' },
                            { header: '<font style="font-weight:bold;">区域</font>',width :80,align: "left",  dataIndex: '区域',	 },
                                 { header: '<font style="font-weight:bold;">门店</font>',width :80,align: "left",  dataIndex: '门店',
                               },
                                      { header: '<font style="font-weight:bold;">工号</font>',width :80,align: "right",  dataIndex: '工号'},
                                           { header: '<font style="font-weight:bold;">姓名</font>',width :80,align: "left",  dataIndex: '姓名',
                              },
                                                { header: '<font style="font-weight:bold;">职务</font>',width :80,align: "left",  dataIndex: '职务' ,
                               },
                                                     { header: '<font style="font-weight:bold;">级别</font>',width :80,align: "left",  dataIndex: '级别' ,
                              editor:RankCom},
                                                          { header: '<font style="font-weight:bold;">入职年份</font>',width :80,align: "right",  dataIndex: '入职年份',
                                editor : new Ext.form.NumberField({
				                    	regex :/^\d+$/,
				                    	allowNegative:false,
				                    	maxValue:queryYear,
					                    nanText : '只能输入数字!'
				                })},
                                                               { header: '<font style="font-weight:bold;">入职月份</font>',width :80,align: "right",  dataIndex: '入职月份',
                                editor : new Ext.form.NumberField({
				                    	regex :/^\d+$/,
				                    	allowNegative:false,
				                    	maxValue:12,
					                    nanText : '只能输入数字!'
				                })},
				                  { header: '<font style="font-weight:bold;">工龄年份</font>',width :80,align: "right",  dataIndex: '工龄年份',	 },
				                    { header: '<font style="font-weight:bold;">工龄月份</font>',width :80,align: "right",  dataIndex: '工龄月份',	 },
                                                                    { header: '<font style="font-weight:bold;">备注</font>',width :100,align: "left",  dataIndex: '备注' ,editor:true},
                                                                         
                     
            ]);


             
//            //获取月份最大能输入的月份
//            function VerityMonth(year)
//            {
//             var now = new Date();
//                var date = now.format('Y年m月');
//             if(year==now.getFullYear())
//                {
//                MaxMonthValue=now.getMonth()+1;
//                }else
//                {
//                MaxMonthValue=12;
//                }
//            }
            
	

	   pd_grid = new Ext.grid.EditorGridPanel({
                store: pd_store,      //创建GridPanel 并设置store数据。
                cm: colModel,
                stripeRows:true,
                border:true,
                collapsible: true,
                //sm: sm,                                                   //复选框，有了这个可以全选
                autoScroll: true,
                selModel : new Ext.grid.RowSelectionModel({
			singleSelect : false
		}), //设置单行选中模式, 否则将无法删除数据
               
                listeners:{  
                'cellclick'  : function( pd_grid,rowIndex,columnIndex,e ) {  
              EntryYear= pd_grid.getStore().getAt(rowIndex).data.入职年份; 
              EntryMonth= pd_grid.getStore().getAt(rowIndex).data.入职月份; 
             WorkMonth=pd_grid.getStore().getAt(rowIndex).data.工龄月份;
             WorkYear=pd_grid.getStore().getAt(rowIndex).data.工龄年份;
              ZWtitle= pd_grid.getStore().getAt(rowIndex).data.职务;
//              VerityMonth(EntryYear);
                }
                }
            });
            
             
          
            
            
            //最终结果的工龄年月
              var ResultYear=0;
             var ResultMonth=0;
             
            //修改完数据的数据
      pd_grid.on('afteredit', function(e, cell) {
      
      
      var now = new Date();
	var date = now.format('Y年m月');
	 var NowYear = now.getFullYear();
	 var NowMonth=now.getMonth()+1;
	 
	 
       var row = e.row;
      var year=pd_grid.getStore().getAt(row).data.入职年份;
      var month=pd_grid.getStore().getAt(row).data.入职月份;
      
      var Xyear=pd_grid.getStore().getAt(row).data.工龄年份;
      var Xmonth=pd_grid.getStore().getAt(row).data.工龄月份;
      
  
      
   //验证年月份计算-->无bug
     if(EntryYear!="" && EntryYear!=0 && EntryYear!=year)
     {
     ResultYear=0;
     
    if( EntryYear<year){
       ResultYear=EntryYear-year+Xyear;
    pd_grid.getStore().getAt(row).set("工龄年份",ResultYear);
    
     }
     
     if( EntryYear>year) {
   ResultYear=(year-EntryYear)*-1+Xyear;
      pd_grid.getStore().getAt(row).set("工龄年份",ResultYear); 
      
      }
     }
     if(EntryMonth!="" && EntryMonth!=0 && EntryMonth!=month)
    {
    if(EntryYear!= NowYear)
    {
     ResultMonth=0;
     
     if( EntryMonth<month){
     var virify=EntryMonth-month+Xmonth;
     ResultMonth=virify;
     ResultYear=EntryYear;
     if(virify>=12)
     {
     ResultMonth=virify-12;
     WorkYear+=1;
     
     }else{
     if(virify<=0)
     {
     ResultMonth=12-virify*-1;
     if(ResultMonth==12)
     {
     ResultMonth=0;
     }
     else
     {
     WorkYear-=1;
     }
     }
     pd_grid.getStore().getAt(row).set("工龄月份",ResultMonth); 
     pd_grid.getStore().getAt(row).set("工龄年份",WorkYear);
     }
    
     }
     else
      {
      ResultMonth=EntryMonth-month+Xmonth;
    if(ResultMonth>12)
    {
    ResultMonth=(12-ResultMonth)*-1;
    WorkYear+=1;
    }
       pd_grid.getStore().getAt(row).set("工龄月份",ResultMonth); 
        pd_grid.getStore().getAt(row).set("工龄年份",WorkYear);
      }
    }else
    {
    if(month>NowMonth)
    {
     pd_grid.getStore().getAt(row).set("入职月份",EntryMonth);
    }else
    {
     ResultMonth= Xmonth-month+EntryMonth;
    pd_grid.getStore().getAt(row).set("工龄月份",ResultMonth); 
    }
    }
    }
    
      });

//pd_store.load();

//日期数据源
var period_store = new Ext.data.Store({
	autoDestroy : true,
	autoLoad:false,
	url : '../Apis/WorkTimesSetting.aspx?actionName=getPeriod&sid=' + Sys.sid,
	reader : new Ext.data.JsonReader({
		fields : [
				{name : "Title",mapping : "Title"}, 
				{name : "Value",mapping : "Value"}, 
		]
	}),
	sortInfo: {field: 'Value',direction:'desc'}
});
period_store.load();




var pd_top_form = new Ext.form.FormPanel({
		//frame: true,
		bodyBorder : false,
		border : false,
		autoScroll : false,
		heigh : 100,
		//autoWidth:true,
		 autoScroll: true,
		items : [
		
			  {
					xtype : "fieldset",
					title : "注意事项",
					layout : "column",
					labelWidth : 50,
					labelAlign : 'right',
					style : {
						marginLeft : '4px',
						marginTop : '10px'
					},
					items : [//third
								
								{
									items:[
										{
											xtype : "label",
											html : '<font style="color:red;">1、每月5日前为前一个月,只能操作两个月数据.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										},{
											xtype : "label",
											html : '<br><font style="color:red;">&nbsp;2、入职年份最大输入年份为当前年,如果年份为当前年,月份最大输入为当前月,否则无效.</font>',
											style : {
												marginTop : '3px',
												marginLeft : '4px'
											}
										}
									]
								}
						]							
				},
				{
					xtype : "fieldset",
					title : "条件",
					layout : "column",
					labelWidth : 50,
					labelAlign : 'right',
					style : {
						marginLeft : '4px',
						marginTop : '10px'
					},
					items : [
						{
                                xtype: "combo",
                                name: "comboPeriod",
                                store: period_store,
                                hiddenName: "comboPeriod",
                                width: 180,
                                margin: '0 0 0 20',
                                mode: 'local',
                                triggerAction: 'all',
                                valueField: 'Value',
                                displayField: 'Title',
                                editable: false,
					            forceSelection :true,
					            triggerAction: "all",
								listeners : {									
										'select':function(){
							                var period = pd_top_form.getForm().findField("comboPeriod").getValue();
							                if(period!= null && typeof(period)!="undefined"){
								                var arr = period.split("-");
								                 queryYear = arr[0];
								                 queryMonth = arr[1];
								                 
								                  Ext.getCmp("btnSave").setDisabled(false);
								                  var now = new Date();
	                                        var date = now.format('Y年m月');
	                                             var yyear = now.getFullYear();
	                                                 var month=now.getMonth()+1;
	                                                 
                                                        if(month<5)
                                                        {
                                                        if(queryMonth!=month-1 || queryMonth!=month){
                                                         Ext.getCmp("btnSave").setDisabled(true);
                                                        }
                                                        }else{
                                                        if(queryMonth!=month)
                                                        {
                                                         Ext.getCmp("btnSave").setDisabled(true);
                                                        }
                                                        }
//	                                                 if(month<10)
//	                                                    {
//	                                                      month+="0";
//		                                                     }
//  	                                                      var ymonth = month;
//                                                    if(yyear==queryYear &&  ymonth==queryMonth || ymonth-1==queryMonth )
//                                                    {
//                                              
//                                                    }else
//                                                    {
//                                                      Ext.getCmp("btnSave").setDisabled(true);
//                                               
//                                                    }
								                 
								                pd_store.reload({ params: { queryYear: queryYear, queryMonth: queryMonth}});
                								
							                }
										}
									}
							},
				            {
							    xtype : "button",
								boxMinWidth : 40,
								style : "margin-left:20px;margin-Top:-25;",
								width : 60,
								id:"btnSave",
								text : " 保  存",
								handler : function () {
								Save();
								}
								}
					]
				},
			
		]//first

	}); //form


   function Save()
   {
   //补贴标准修改
	var Workyrecords = pd_store.data.items;
	var Workarray = new Array();
	var reg = /^1\d{10}$/;
	for (var y = 0; y < Workyrecords.length; y++) {
		Workarray.push(Workyrecords[y].data);
	}
	Ext.getBody().mask("正在保存！请稍候！");
	var Workdata = Ext.encode(Workarray);
	Ext.Ajax.request({
		url : '../Apis/WorkTimesSetting.aspx?actionName=updateDataWork&sid' + Sys.sid,
		params : {
			Workyrecords : Workdata,
		},
		success : function (response, options) {
			 pd_store.load({ params: { queryYear: queryYear, queryMonth: queryMonth}});     //载入数据。
			Ext.getBody().unmask();
		},
		failure : function (response, options) {
			Ext.getBody().unmask();
		}
	});
   }

//主容器
var pd_main_panel = new Ext.Panel({
		//autotoWidth:true,
		layout : "anchor",
		//anchorSize: { width: 800, height: 600 },
		items : [{
				frame : true,
				border : false,
				items : [pd_top_form]
			}, {
				layout : "fit",
				border : false,
				anchor : '-1 -150',
				items : [pd_grid]
			}
		]
	});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
//设置显示默认日期
var setDefaultValues = function () {
//     Ext.getCmp("hideremark").disabled = true;
	var now = new Date();
	var date = now.format('Y年m月');
	 queryYear = now.getFullYear();
	 var month=now.getMonth()+1;
	 if(month<10)
	 {
	 month+="0";
	 }
     queryMonth = month;
	pd_top_form.find("name", "comboPeriod")[0].setValue(date);
	pd_top_form.show();
};
setDefaultValues();