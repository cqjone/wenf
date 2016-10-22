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

function DeptSelected(value,type,EmpId){
try{
	if (value > 0) {
			tabpnl.setActiveItem('tab3', 'fade');	
			model_DeptInfo.proxy.url = '../../apis/PersonMgr.aspx?op=loaddeptinfo&sid='+sid+'&DeptId=' + value;
			var ei = Ext.ModelMgr.getModel(model_DeptInfo);
			ei.load('', {
				success: function (DeptInfo,operation) {
					Ext.getCmp('Form_DeptInfo').load(DeptInfo);
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
				   //params: { start: start, limit1: limit1,DeptId:value },
				   params:{EmpId:EmpId,start:start,limit1:limit1,DeptId:value}
				   /*callback:function(){
						if(type=='SearchEmp'){
							SetPointForSelectedEmp(EmpId);
						}
				   }*/
				});
			}
	});
}

//定位员工在列表中的位置
function SetPointForSelectedEmp(EmpId,type,DeptId){
	try{
		var index=list_Emps.getStore().find('id',EmpId);
		if(index== -1 ){
			loadEmp(DeptId,type,EmpId);
		}else{
			list_Emps.select(index);
			var top=-(list_Emps.getNode('Emp_'+EmpId).offsetParent.offsetTop);
			list_Emps.scroller.setOffset({x:0,y:top},true);
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
        params: { start: start, limit1: limit1},
        callback: function () {
            store_Emp_Add.each(function (fn) {
                store_Emp.add([{ id: fn.get('id'), imgurl: fn.get('imgurl'), title: fn.get('title'), mobile: fn.get('mobile'), duty: fn.get('duty')}]);
             });
        }
    });
}

var p=function(){}

Ext.setup({
    tabletStartupScreen: '../../JS/touch/resources/img/tablet_startup.png',
    phoneStartupScreen: '../../JS/touch/resources/img/phone_startup.png',
    icon: '../../JS/touch/resources/img/icon.png',
    glossOnIcon: false,

    onReady: function() {

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
                url: '../../apis/PersonMgr.aspx?op=loadArea&sid='+sid,
                reader: {
                    type: 'json'
                }
            },
			listeners:{
				load:function(thStore){
					var ListPanel=Ext.getCmp('sel_area').getListPanel();
					var SelId=ListPanel.id;
					if(Ext.getCmp(SelId)!=null){
						var height=thStore.getCount()*47;
						Ext.getCmp(SelId).setHeight(height+12);
					}
				}
			}
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
            data: [{ text: '请选择', value: '0'}],
			listeners:{
				load:function(thStore){
					if(thStore.getCount()==1){
						var AreaId=Ext.getCmp('sel_area').getValue();
						storeDept.load({
							params:{AreaId:AreaId}
						});
					}
					var ListPanel=Ext.getCmp('sel_area1').getListPanel();
					var SelId=ListPanel.id;
					if(Ext.getCmp(SelId)!=null){
						var height=thStore.getCount()*47;
						Ext.getCmp(SelId).setHeight(height+12);
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
            },
            data: [{ text: '请选择', value: '0'}],
            listeners: {
                load: function (thStore) {
					//将请选择选项放在第一位
					store_Dept.insert(0,TOChooseModel);
					var ListPanel=Ext.getCmp('sel_Dept').getListPanel();
					var SelId=ListPanel.id;
					if(Ext.getCmp(SelId)!=null){
						var height=thStore.getCount()*47;
						Ext.getCmp(SelId).setHeight(height+12);
					}
                }
            }
        });

        var store_worked = new Ext.data.Store({
            model: Ext.regModel('', {
                fields: ['DeptName', 'WorkedTime', 'DutyName', 'dy']
            }),
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadWorked&sid='+sid,
                reader: {
                    type: 'json',
                    root: 'items'
                }
            }
        });

		store_EmpCount = new Ext.data.Store({
            model: new Ext.regModel('', {
                fields: ['EmpCount']
            }),
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
            model: new Ext.regModel('', {
                fields: ['id', 'imgurl', 'title', 'mobile', 'duty']
            }),
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadEmp',
                reader: {
                    type: 'json'
                }
            },
			listeners:{
				beforeload:function(){
					store_Emp_Add.proxy.url = '../../apis/PersonMgr.aspx?op=loadEmp&sid='+sid+'&DeptId='+Ext.getCmp('sel_Dept').getValue();
				}
			}
        });

        store_Emp = new Ext.data.Store({
            model: new Ext.regModel('', {
                fields: ['id', 'imgurl', 'title', 'mobile', 'duty']
            }),
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadEmp&sid='+sid,
                reader: {
                    type: 'json'
                }
            },
            listeners: {
                load: function () {
					if(list_Emps.scroller.hasListener('scrollend')){
                    list_Emps.scroller.on('scrollend', function (th, offset) {
                        if (Math.abs(offset.y) >= Math.abs(th.offsetBoundary.top + 10)) {
							if(store_Emp.getCount()==EmpCount){
								return ;
							}
							offset.y=offset.y-100;
							
                            LoadEmps();
                        }
                    });
					}
					list_Emps.scroller.setOffset({y:0},true);
                }
            }
        });

        store_Mgr_yx = new Ext.data.Store({
            model: new Ext.regModel('', {
                fields: ['id', 'imgurl', 'title', 'mobile', 'duty']
            }),
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadMgr&duty=yxjl&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

        store_Mgr_xq = new Ext.data.Store({
            model: new Ext.regModel('', {
                fields: ['id', 'imgurl', 'title', 'mobile', 'duty']
            }),
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadMgr&duty=xqjl&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
        });

        var store_Imgurl = new Ext.data.Store({
            model: Ext.regModel('', {
                fields: ['Id', 'FileName', 'FilePath']
            }),
            proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=loadImg&sid='+sid,
                reader: {
                    type: 'json'
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
		
		store_SearchEmp=new Ext.data.Store({
			model:new Ext.regModel('',{
				fields: ['EmpId','DeptId','EmpName', 'DeptName']
			}),
			proxy: {
                type: 'ajax',
                url: '../../apis/PersonMgr.aspx?op=searchemp&sid='+sid,
                reader: {
                    type: 'json'
                }
            }
		});
		
        model_DeptInfo = new Ext.regModel('model_DeptInfo', {
            fields: ['Title', 'LandLord', 'BusinessLic', 'LordTel', 'Rental', 'LegalPerson', 'Rent',
                { name: 'Rental', convert: function (value) { if (value != '') { return value + ' 万/年' } } },
                { name: 'Area', convert: function (value) { if (value != '') { return value + ' 平方米' } } }
            ],
            proxy: {
                type: 'rest',
                url: '../../apis/PersonMgr.aspx?op=loaddeptinfo&sid='+sid
            }
        });

        var empinfo = new Ext.regModel('empinfo', {
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
        });

        //清空所有数据
        function removeall() {
            store_Area1.removeAll();
			var ListPanel=Ext.getCmp('sel_area1').getListPanel();
			if(Ext.getCmp(ListPanel.id)!=null){
				ListPanel.setHeight(60);
			}
			Ext.getCmp('sel_area1').setValue('请选择');
            remove();
            //Ext.getCmp('Form_DeptInfo').removeAll();
        }
        //清空区域以及其下的所有数据
        function remove() {
            store_Dept.removeAll();
            store_Mgr_yx.removeAll();
            store_Mgr_xq.removeAll();
			var ListPanel=Ext.getCmp('sel_Dept').getListPanel();
			if(Ext.getCmp(ListPanel.id)!=null){
				ListPanel.setHeight(60);
			}
			Ext.getCmp('sel_Dept').setValue('请选择');
            remove1();
        }
        //清空门店以及其下的所有数据
        function remove1() {
            store_Emp.removeAll();
            store_Imgurl.removeAll();
			removeDeptInfo();
            var aa = Ext.ModelMgr.create({}, model_DeptInfo);
            Ext.getCmp('Form_DeptInfo').load(aa);
			start=0;
        }

        p.editPnl = new Ext.Panel({
            floating: true,
            centered: true,
            modal: true,
            width: Ext.is.iPhone ? (Ext.getOrientation() == 'portrait' ? 300 : 380) : (Ext.getOrientation() == 'portrait' ? 520 : 700),
            height: Ext.is.iPhone ? (Ext.getOrientation() == 'portrait' ? 380 : 300) : (Ext.getOrientation() == 'portrait' ? 700 : 520),
            layout: 'fit',
            items: [
        new Ext.Panel({
            layout: 'card',
            items: [
                {
                    xtype: 'form',
                    id: 'Form_EmpInfo',
                    scroll: 'vertical',
                    items: [
                      {
                          xtype: 'fieldset',
                          title: '基本信息',
                          defaults: {
                              labelWidth: '120px',
                              style: 'font-size:1.2em;',
                              disabledCls: ""
                          },
                          items: [
									{
									    xtype: 'textfield',
									    name: 'EmpName',
									    label: '姓名',
									    //value:'王三',
									    disabledCls: '',
									    disabled: true
									},
									{
									    xtype: 'textfield',
									    name: 'height',
									    label: '身高',
									    //value:'168CM',
									    disabledCls: '',
									    disabled: true
									},
									{
									    xtype: 'textfield',
									    name: 'weight',
									    label: '体重',
									    //value:'78KG',
									    disabled: true
									},
									{
									    xtype: 'textfield',
									    name: 'Zodiac',
									    label: '属相',
									    //value:'猪',
									    disabled: true
									},
									{
									    xtype: 'textfield',
									    name: 'Degree',
									    label: '学历',
									    //value:'本科',
									    disabled: true
									},
									{
									    xtype: 'textfield',
									    name: 'Birthday',
									    label: '出生年月',
									    //value:'1988-1-1',
									    disabled: true
									},
									{
									    xtype: 'textfield',
									    name: 'Nation',
									    label: '民族',
									    //value:'汉',
									    disabled: true
									},
									{
									    xtype: 'textfield',
									    name: 'Language',
									    label: '语言',
									    //value:'中文',
									    disabled: true
									},
                            {
                                xtype: 'textfield',
                                name: 'PepTalent',
                                label: '特长',
                                disabled: true
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
										    //value:'主管',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'Mobile',
										    label: '电话',
										    //value:'123123123',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'Term',
										    label: '培训期数',
										    //value:'12期',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'HireDate',
										    label: '入职时间',
										    //value:'2004-1-1',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'Salary',
										    label: '薪资待遇',
										    //value:'5000',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'Share',
										    label: '股份',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'WorkContract',
										    label: '劳动合同',
										    //value:'√',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'EmployContract',
										    label: '聘用合同',
										    //value:'√',
										    disabled: true
										},
										{
										    xtype: 'textfield',
										    name: 'Address',
										    label: '家庭地址',
										    //value:'未知',
										    disabled: true
										},
										{
										    xtype: 'textareafield',
										    name: 'MemoInfo',
										    label: '其他',
										    disabled: true
										}
							]
					  }
					]
                },
				{
				    id: 'panle_Worked',
				    hidden: true,
				    xtype: 'list',
					style:'height:100%;',
				    store: store_worked,
				    itemTpl: new Ext.XTemplate('<div class="workeddiv" style="color:Black;">',
						'<div style="float:left;width:180px;"><div>店名：{DeptName}</div><div>职务：{DutyName}</div></div>',
						'<div style="float:left;width:350px;"><div>时间：{WorkedTime}</div><div">待遇：{dy}</div></div>',
						'</div><p/>')
				},
				{
				    xtype: 'dataview',
				    hidden: true,
				    style: 'width:100%;height:100%;',
				    id: 'panle_EmpPhoto',
				    store: store_Imgurl,
				    tpl: new Ext.XTemplate('<div class="div_img" style="width:100%;overflow:auto;" ><tpl for="."><div  title="{FileName}" style="float:left;margin-top:10px;margin-left:43px;text-align:center;"><img src="../../Imgs/EmpImgs/{FilePath}" onError="this.src=\'../../Imgs/DefaultImg.jpg\'" width="145" height="200" onclick="ShowImg(\'../../Imgs/EmpImgs/{FilePath}\')" /><br/><span>{FileName}</span></div></tpl><div>'),
				    itemSelector: 'div_img',
				    emptyText: '没有图片'
				}
            ]
        })
    ],
            dockedItems: [
			{
				xtype: 'toolbar',
				layout: {
					pack: 'center'
				},
		    items: [
				{
				    xtype: 'segmentedbutton',
				    items: [
						{
						    text: '员工信息',
						    width: 80,
						    pressed: true,
						    handler: function () {
						        Ext.getCmp('panle_EmpPhoto').hide();
						        Ext.getCmp('panle_Worked').hide();
						        Ext.getCmp('Form_EmpInfo').show();
						    }
						},
						{
						    text: '工作记录',
						    width: 80,
						    handler: function () {
						        Ext.getCmp('panle_EmpPhoto').hide();
						        Ext.getCmp('Form_EmpInfo').hide();
						        Ext.getCmp('panle_Worked').show();
						    }
						},
						{
						    text: '照片',
						    width: 80,
						    handler: function () {
						        Ext.getCmp('Form_EmpInfo').hide();
						        Ext.getCmp('panle_Worked').hide();
						        Ext.getCmp('panle_EmpPhoto').show();
						    }
						}
					]
				}
			]

		}
	]
        });
		
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
		
		var pnl_EmpSearch=new Ext.Panel({
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
							/*keyup:function(th,e){
								var value=th.getValue();
								value=value.replace(/\s+/g,"");
								if(value.length>0){
									findEmp(value);
								}
							},*/
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
					height:385,
					store:store_SearchEmp,
					itemTpl :'{EmpName} - 店名:{DeptName}',
					listeners:{
						itemtap:function(th,index){
							var re=store_SearchEmp.getAt(index);
							var EmpId=re.get('EmpId');
							var DeptId=re.get('DeptId');
							loadAllDataByDeptId_Animate(DeptId,'SearchEmp',EmpId);
							pnl_EmpSearch.hide('fade');
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
				value: '请选择',
				width: '20%',
				listeners: {
				    change: function (sel, value) {
				        removeall();
				        if (value>0 && !isNaN(value) && value!='') {
				            store_Area1.proxy.url = '../../apis/PersonMgr.aspx?op=loadArea1&sid='+sid+'&PId=' + value;
				            store_Area1.load();
				            store_Dept.proxy.url = '../../apis/PersonMgr.aspx?op=loaddept&sid='+sid+'&AreaId=' + value;
				            store_Dept.load();
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
				            store_Dept.proxy.url = '../../apis/PersonMgr.aspx?op=loadDept&sid='+sid+'&AreaId=' + value;
				            store_Dept.load();
				            store_Mgr_yx.proxy.url = '../../apis/PersonMgr.aspx?op=loadMgr&sid='+sid+'&AreaId=' + value + '&Duty=yxjl';
				            store_Mgr_yx.load();
				            store_Mgr_xq.proxy.url = '../../apis/PersonMgr.aspx?op=loadMgr&sid='+sid+'&AreaId=' + value + '&Duty=xqjl';
				            store_Mgr_xq.load();
							start1=0;
							AreaId=value;
							storeDept.load({
								params:{AreaId:AreaId}
							});
							loadTotalMoney('');
				            //tabpnl.setActiveItem('tab1', 'fade');
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
				        remove1();
				        DeptSelected(value);
						removeDeptInfo();
				    }
				}
},
				{
				    xtype: 'spacer'
				},
            //搜索栏
				{
					text:'门店搜索',
					id:'btn_DeptSearch',
					handler:function(){
						pnl_DeptSearch.showBy(Ext.getCmp('btn_DeptSearch').getEl(), 'fade');
					}
				},
				{
					text:'员工搜索',
					id:'btn_EmpSearch',
					handler:function(){
						pnl_EmpSearch.showBy(Ext.getCmp('btn_EmpSearch').getEl(), 'fade');
					}
				}
			]

        });
		
		////顶层选择栏for历史现金查询
		var toolbar_HisCash = new Ext.Toolbar({
			dock: 'top',
			//hidden:true,
			style:'display:none;',
            ui: 'dark',
            layout: {
                type: 'hbox',
                align: 'center'
            },
					items:[
						{
							text:'筛选门店',
							id:'a',
							handler:function(){
								FilterDept.showBy(this.getEl(),'fade');
							}
						},
						{
							xtype:'panel',
							id:'b',
							style:'color:#fff',
							html:' &nbsp; &nbsp; &nbsp; 开始时间'
						},
						{
							xtype:'datepickerfield',
							id:'BeginTime',
							name:'BeginTime',
							width:'21%',
							value:{year: (new Date()).getFullYear(), day: 1, month: (new Date()).getMonth()+1},
							picker:{height:300}
						},
						{
							xtype:'panel',
							style:'color:#fff',
							html:' &nbsp;结束时间'
						},
						{
							xtype:'datepickerfield',
							id:'EndTime',
							name:'EndTime',
							width:'21%',
							value:new Date(),
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
								var Records=list_FilterDept.getSelectedRecords();
								for(var i=0;i<Records.length;i++){
									Depts+=Records[i].get('Id');
									if(i<Records.length-1){
										Depts+=',';
									}
								}
								BeginTime=Ext.getCmp('BeginTime').getValue();
								EndTime=Ext.getCmp('EndTime').getValue();
								store_bb.load({
									params:{Depts:Depts,BeginTime:BeginTime,EndTime:EndTime,start:start2,limit:limit}
								});
								loadTotalMoney_HisCash();
							}
						}
					]
			
		});
		
        function showEmpInfo(subList, subIdx, el, e) {
            var store = subList.getStore();
            var record = store.getAt(subIdx);
            empinfo.proxy.url = '../../apis/PersonMgr.aspx?op=loadEmpInfo&sid='+sid+'&EmpId=' + record.get('id');
            var ei = Ext.ModelMgr.getModel(empinfo);
            ei.load('', {
                success: function (emp) {
                    Ext.getCmp('Form_EmpInfo').load(emp);
                }
            });
            store_worked.proxy.url = '../../apis/PersonMgr.aspx?op=loadWorked&sid='+sid+'&EmpId=' + record.get('id');
            store_worked.load();
            store_Imgurl.proxy.url = "../../apis/PersonMgr.aspx?op=loadImg&sid="+sid+"&EmpId=" + record.get('id');
            store_Imgurl.load();
            p.editPnl.show();
            p.editPnl.doLayout();
        }

        list_Emps = new Ext.List({
            //xtype: 'list',
            id: 'list_Emps',
            emptyText: '没有数据',
            store: store_Emp,
            itemTpl: new Ext.XTemplate(
									"<div id='Emp_{id}' style='height:120px;padding:10px;'>",
									"<div style='float:left;'><img src='../../Imgs/EmpImgs/{imgurl}' onError='this.src=\"../../Imgs/DefaultImg.jpg\";' width='75px' height='100px' /></div>",
									"<div style='float:left;margin-left:10px;width:68%;'>",
										"<div style='float:left;'>",
											"<div style='float:left;width:220px;'>姓名：{title}</div>",
											"<div style='float:left;width:220px;'>联系电话：<a href='tel:{mobile}'>{mobile}</a></div>",
										"</div><br/><br/><br/>",
										"<div style='float:left;'>职位：{duty}</div>",
									"</div>",
									"</div>"
							),
            listeners: {
                itemtap: showEmpInfo
            }
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
				    /*html: '<div>'+
						  '<table style="width:100%;height:100%;vertical-align:middle;text-align:center;position:absolute;z-index:2;"><tr><td><img src="../../Imgs/index2.png" /></td></tr></table>'+
						  '<img src="../../Imgs/index1.jpg" style="width:100%;height:100%;position:absolute;z-index:0;">'+
						  '</div>'*/
				},
				{
				    title: '营销经理',
				    id: 'tab1',
				    iconCls: 'user',
				    xtype: 'panel',
				    layout: 'fit',
				    items: [
						{
						    xtype: 'list',
							id:'list_yxjl',
						    fullscreen: true,
						    emptyText: '没有数据',
						    store: store_Mgr_yx,
						    itemTpl: new Ext.XTemplate(
									"<div style='height:100px;'>",
									"<div style='float:left;'><img src='../../Imgs/EmpImgs/{imgurl}' width='75px' height='100px' onError='this.src=\"../../Imgs/DefaultImg.jpg\";' /></div>",
									"<div style='float:left;margin-left:10px;width:68%;'>",
										"<div style='float:left;'>",
											"<div style='float:left;width:220px;'>姓名：{title}</div>",
											"<div style='float:left;width:220px;'>联系电话：<a href='tel:{mobile}'>{mobile}</a></div>",
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
				    xtype: 'panel',
				    layout: 'fit',
				    items: [
						{
						    xtype: 'list',
							id:'list_xqjl',
						    fullscreen: true,
						    emptyText: '没有数据',
						    store: store_Mgr_xq,
						    itemTpl: new Ext.XTemplate(
									"<div style='height:120px;padding:10px;'>",
									"<div style='float:left;'><img src='../../Imgs/EmpImgs/{imgurl}' width='75px' height='100px' onError='this.src=\"../../Imgs/DefaultImg.jpg\";' /></div>",
									"<div style='float:left;margin-left:10px;width:68%;'>",
										"<div style='float:left;'>",
											"<div style='float:left;width:220px;'>姓名：{title}</div>",
											"<div style='float:left;width:220px;'>联系电话：<a href='tel:{mobile}'>{mobile}</a></div>",
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
				    xtype: 'panel',
				    layout: 'fit',
				    items: [
						list_Emps
					]
				},
				{
				    title: '门店信息',
				    iconCls: 'info',
				    xtype: 'panel',
				    layout: 'fit',
				    items: [{
				        xtype: 'form',
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
									    disabled: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_LandLord',
									    label: '房东姓名',
									    name: 'LandLord',
									    disabled: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_LordTel',
									    label: '电话',
									    name: 'LordTel',
									    disabled: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_Rent',
									    label: '租赁期限',
									    name: 'Rent',
									    disabled: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_Rental',
									    label: '租金',
									    name: 'Rental',
									    disabled: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_Area',
									    label: '面积',
									    name: 'Area',
									    disabled: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_BusinessLic',
									    label: '营业执照',
									    name: 'BusinessLic',
									    disabled: true
									},
									{
									    xtype: 'textfield',
										id:'DInfo_LegalPerson',
									    label: '法人',
									    name: 'LegalPerson',
									    disabled: true
									}
								]
							}
						]
				    }]
				},
				{
					title:'历史现金查询',
					iconCls:'bookmarks',
					layout:'fit',
					items:[pnl_HisCash]
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
					if(index==5){//历史现金报表
						toolbar.hide('fade');
						toolbar_HisCash.getEl().dom.style.display='block';
						toolbar_HisCash.doLayout();
						wheelObj=pnl_HisCash;
					}else{
						switch(index){
							case 0://首页报表
								wheelObj=pnl;
							break;
							case 1://营销经理
								wheelObj=Ext.getCmp('list_yxjl');
							break;
							case 2://区域经理
								wheelObj=Ext.getCmp('list_xqjl');
							break;
							case 3://员工列表 
								wheelObj=list_Emps;
							break;
						}
						toolbar_HisCash.getEl().dom.style.display='none';
						toolbar_HisCash.doLayout();
						toolbar.show('fade');
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

        var mainpnl = new Ext.Panel({
            fullscreen: true,
            layout: 'fit',
            items: [tabpnl],
            dockedItems: [{
				dock:'top',
				items:[toolbar,toolbar_HisCash]
			}],
            listeners: {
                orientationchange: function (th, orientation, width, height) {
					var width=0;
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
					}
                }
            }
        });
    }
});