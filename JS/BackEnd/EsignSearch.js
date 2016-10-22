
    var pInfo=[];
    var imgurl='';

    //ajax获取data数据
    Ext.Ajax.request({
        url: '../data/EsignClient.json',
        success: function(data) {
            pInfo = Ext.decode(data.responseText).Esign;
        },
        failure:function(){
            alert("数据加载失败哈啊哈哈");
        }
    });

    //读取Json新建store
    var store = new Ext.data.JsonStore({
        //2.用ajax加载数据
        // url: '../../data/EsignClient.json',
        // root: 'Esign',
        // autoLoad: true,

        data:[],//1需用到loadData加载数据

        fields: ['AddTime', 'StoreName', 'CardNumber', 'Customer', 'Mobile', 'CardID','ImgUrl'],
        sortInfo: {
            field: 'AddTime',
            direction: 'desc'
        }
    });

    //头部查询
    var serch = new Ext.FormPanel({
        // title: '查询',
        // frame: true,
        height: 220,
        items: [
        {
            layout: 'form',
            xtype: 'fieldset',
            autoHeight: true,
            title: '注意事项',
            defaultType: 'label',
            style: {
                color: 'red'
            },
            items: [
            {
                text: '1.查询条件不能为空，姓名可模糊查询',
                style: {
                    padding: '5px',
                    display: 'block'
                }
            },{
                xtype: 'label',
                text: '2.查询条件的客户信息包括：会员卡号、客户姓名、客户手机号、客户身份证号',
                style: {
                    padding: '5px',
                    display: 'block'
                }
            }]
        },
        {
            height: 118,
            width: '100%',
            xtype: 'fieldset',
            layout: 'column',
            title: '查询条件',

            items: [
            {
                layout: 'form',
                labelAlign: 'right',
                labelWidth: 120,
                style: 'margin:10px 0px;',
                items: [
                {
                    xtype:"textfield",
                    id:'infor',
                    width: 300,
                    fieldLabel: '查询条件/客户信息',
                    selectOnFocus: true,
                    enableKeyEvents: true,
                    listeners: {
                        'keyup':function(e){
                            Ext.getCmp('tip').setValue("会员卡号/客户姓名/客户手机号/客户身份证号");
                            if (event.keyCode==13) {
                                combserch();
                            };
                        }
                    }
                },{
                    xtype:"displayfield",
                    id:'tip',
                    width: 300,
                    value:'会员卡号/客户姓名/客户手机号/客户身份证号',
                    style: {
                        color: '#1400c5'
                    }
                }]
            },
            {
                layout: 'form',
                labelWidth:10,
                width:180,
                style: 'margin:10px 0px 0px 40px;',
                items: [
                    {
                        width: 120,
                        xtype: 'button',
                        style: 'margin:0px 0px 20px 10px;',
                        text: '查询',
                        handler: combserch
                    },
                    {
                        id:"checkbox",
                        xtype:'checkbox',
                        boxLabel:'只显示100百条',
                        checked: true
                    }
                ]
            }
            ,{
                layout: 'form',
                labelWidth:10,
                width:160,
                style: 'margin:10px 0px 0px 20px;',
                items: [
                    {
                        width: 120,
                        xtype: 'button',
                        style: 'margin:0px 0px 20px 0px;',
                        text: '清空',
                        handler: cleargrid
                    }
                ]
            }]
        }]
    });

    //创建表格行
    var cm = new Ext.grid.ColumnModel({
        defaults: {
            //sortable: true // columns are not sortable by default
        },
        columns: [
		new Ext.grid.RowNumberer(),
        {
            header: '日期时间',
            dataIndex: 'AddTime',
            // sortable: true,
            width:150
        }, {
            header: '门店名称',
            dataIndex: 'StoreName',
            width:90
        }, {
            header: '会员卡号',
            dataIndex: 'CardNumber',
            width:120
        }, {
            header: '客户姓名',
            dataIndex: 'Customer',
            width:80
        }, {
            header: '客户手机号',
            dataIndex: 'Mobile',
            width:110
        }, {
            header: '客户身份证号',
            dataIndex: 'CardID',
            width:180
        },{
            header: '操作',
            renderer:seedetails
        }]
    });

    //创建表格
    var grid = new Ext.grid.GridPanel({
        title: '查询结果',
        store: store,
        columnLines: true,
        frame: true,
        stripeRows: true,
        cm: cm
    });

    //视口
    // var view = new Ext.Viewport({
        // title: '电子签单查询',
        // layout: 'border',
        // items: [
            // serch
            // , grid
        // ]
    // });

	//主容器
	var main_panel = new Ext.Panel({
		border: false,
		layout: "anchor",
		items: [
			{
				frame: true,
				// border: false,
				items: [serch]
			}
			, {
				anchor: '-0 -230',
				layout: "fit",
				border: false,
				items: [grid]
			}
		]
	});

    //查询函数
    function combserch() {
        // var myMask = new Ext.LoadMask(Ext.getBody(), {
        //     msg    : "正在操作,请稍后..."
        // });
        // myMask.show();
        // myMask.hide();
        store.loadData(pInfo);
        var pInfoB;
        var check = Ext.getCmp('checkbox');
        var infor = Ext.getCmp('infor').getValue();
        var regx = new RegExp(infor);
        var inforLen=infor.length;
        // console.log(inforLen);
        var inforField;

        if (infor === '') {
            Ext.getCmp('tip').setValue("查询条件不能为空");
            // console.log("什么都没有");
            inforField = "CardNumber";
            regx = 'lajfkldsjaklhdjklgdfigh';
        } else if (0<inforLen&&inforLen<5) {
            // console.log("名字");
            inforField = "Customer";
        } else if (inforLen==6) {
            // console.log("卡号");
            inforField = "CardNumber";
        } else if (inforLen==11) {
            // console.log("手机");
            inforField = "Mobile";
        } else if (inforLen==18) {
            // console.log("身份证");
            inforField = "CardID";
        } else {
            // console.log("其他乱写的");
            inforField = "CardNumber";
            regx = 'lajfkldsjaklhdjklgd';
        };
        grid.store.filter([{
            property: inforField,
            value: regx
        }]);
        pInfoB = grid.store.data.items;
        //只显示指定的条数
        if (check.checked==true&&pInfoB.length>7) {
            var pInfoD=[];
            for (var i = 0; i < 7; i++) {
                pInfoD.push(pInfoB[i].data);
            };
            store.loadData(pInfoD);
            // console.log("只显示指定的条数");
        }else{
            // console.log("什么都不做");
        };
        Ext.getCmp('infor').focus();
    }


    //清空表格
    function cleargrid(){
        Ext.getCmp('infor').setValue('');
        combserch();
        Ext.getCmp('tip').setValue("会员卡号/客户姓名/客户手机号/客户身份证号");
        Ext.getCmp('infor').focus();
    };
    Ext.getCmp('infor').focus();
    // grid.store.on('load', function() {
    //     //2.表格数据加载完成之后执行过滤
    //     combserch();
    // })

    // //模糊匹配
    // function fuzzyquery(e) {
    //     console.log("gfsdhajk");
    //     var combo = e.combo;
    //     var q = e.query;
    //     var forceAll = e.forceAll;
    //     if (forceAll === true || (q.length >= this.minChars)) {
    //         if (this.lastQuery !== q) {
    //             this.lastQuery = q;
    //             if (this.mode == 'local') {
    //                 this.selectedIndex = -1;
    //                 if (forceAll) {
    //                     this.store.clearFilter();
    //                 } else {
    //                     // 检索的正则
    //                     var regExp = new RegExp(".*" + q + ".*", "i");
    //                     // 执行检索
    //                     this.store.filterBy(function(record, id) {
    //                         // 得到每个record的项目名称值
    //                         var text = record.get(combo.displayField);
    //                         return regExp.test(text);
    //                     });
    //                 }
    //                 this.onLoad();
    //             } else {
    //                 this.store.baseParams[this.queryParam] = q;
    //                 this.store.load({
    //                     params: this.getParams(q)
    //                 });
    //                 this.expand();
    //             }
    //         } else {
    //             this.selectedIndex = -1;
    //             this.onLoad();
    //         }
    //     }
    //     return false;
    // }

    //渲染表格绑定功能
    function seedetails(value, metadata, record, rowIndex, colIndex, store) {
        window.seede = function(e) {
            imgurl='image/'+grid.store.getAt(e).data.ImgUrl;
            console.log(imgurl);
            // console.log(grid.store.getAt(e).data.ImgUrl);
            wind(imgurl);


        }
        var returnStr = "<a style='text-decoration:underline;cursor:pointer;color:#1500ff;' onclick='seede("+rowIndex+")'>查看详情</a>";
        return returnStr;
    }

    function wind(ul){
        var left = document.body.clientWidth/2 - 519;
        // var top = document.body.clientHeight/2 - 300;
        var win = new Ext.Window({
            // layout:'form',
            title:"签名图片1",
            width:1038,
            resizable : false,
			// height:600,
			autoScroll:'true',
            // draggable:false,//是否能拖拽
            modal: true,//设置模态框背后的界面不可操作
            closeAction:'close',
            items:[
                {
                    xtype:'component',
                    name:'infoimg',
                    id:'infoimg',
                    autoEl: {
                        width:'100%',
                        tag: 'img',    //指定为img标签
                        src: ul    //指定url路径 ,一般为相对路径
                    }
                }
            ],
            buttonAlign:'center',
            buttons: [
                // { xtype: "button", text: "确定", handler: function () { win.close(); }},
                // { xtype: "button", text: "取消", handler: function () { win.close(); }}
                { xtype: "button", text: "关闭", handler: function () {
                 win.close(); Ext.getCmp('infor').focus();}}
            ]
        });
        win.setPosition( left, 50);
        win.show();
    }

	centerPanel.add(main_panel);
    centerPanel.doLayout();

