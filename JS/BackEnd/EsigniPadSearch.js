
	// var pInfo = [];
    // var pInfo_store = [];
	// var jsonData = [];
    // var index = '';
    var wina='',deid='',stid='',wid='',atid='',chid='';


	   // //ajax获取模板数据
    // Ext.Ajax.request({
    //     url: '../data/EsignTemplate.json',
    //     success: function(data) {
    //         pInfo = Ext.decode(data.responseText).temp;
    //     },
    //     failure:function(){
    //         alert("数据加载失败哈啊哈哈");
    //     }
    // });

    //        //ajax获取门店数据
    // Ext.Ajax.request({
    //     url: '../data/EsignStore.json',
    //     success: function(data) {
    //         pInfo_store = Ext.decode(data.responseText).allStore;
    //     },
    //     failure:function(){
    //         alert("数据加载失败哈啊哈哈");
    //     }
    // });

		//读取Json新建模板管理store
    var TemplateStore = new Ext.data.JsonStore({
        url: '../data/EsignTemplate.json',
        root: 'temp',
        autoLoad: true,
        fields: ['TempNo', 'TempName','Content','stores'],
        sortInfo: {
            field: 'TempNo',
            direction: 'asc'
        }
    });

            //添加界面的表格store
    var window_store = new Ext.data.JsonStore({
        data:[],//1需用到loadData加载数据
        fields: ['FileNo', 'FileName','ShowTime'],
        sortInfo: {
            field: 'FileNo',
            direction: 'asc'
        }
    });

            //每个模板已选择的门店
    var one_tmp_store = new Ext.data.JsonStore({
        data:[],
        fields: ['StoreName','District','AreaID'],
        sortInfo: {
            field: 'StoreName',
            direction: 'asc'
        }
    });
        //添加界面的表格store
    // var window_add_store = new Ext.data.JsonStore({
    //     data:[],//1需用到loadData加载数据
    //     fields: ['FileNo', 'FileName','ShowTime'],
    //     sortInfo: {
    //         field: 'FileNo',
    //         direction: 'asc'
    //     }
    // });

        //编辑界面的表格store
    // var window_edit_store = new Ext.data.JsonStore({
    //     data:[],//1需用到loadData加载数据
    //     fields: ['FileNo', 'FileName','ShowTime'],
    //     sortInfo: {
    //         field: 'FileNo',
    //         direction: 'asc'
    //     }
    // });

        //所有门店的信息
    var chose_store_all = new Ext.data.JsonStore({
        url: '../data/EsignStore.json',
        root: 'allStore',
        autoLoad: true,
        fields: ['StoreName', 'AreaID', 'TempName','District'],
        sortInfo: {
            field: 'AreaID',
            direction: 'asc'
        }
    });

        //所有的地区
    var chose_District_all = new Ext.data.JsonStore({
        url: '../data/EsignStore.json',
        root: 'District',
        autoLoad: true,
        fields: ['District']
    });

    // var chose_store_all = new Ext.data.JsonStore({
    //     data:[],//1需用到loadData加载数据
    //     fields: ['StoreName', 'AreaID', 'TempName','District'],
    //     sortInfo: {
    //         field: 'AreaID',
    //         direction: 'asc'
    //     }
    // });


        //提示
	var pan_top = new Ext.form.FormPanel({
        height: 100,
        items: [
		{
		    xtype: 'fieldset',
		    title: '提示',
            style: {
                color: 'red'
            },
			height:100,
		    items: [
            {
				xtype: 'label',
                text: '1.模板管理标签页展示模板的名称和编号，若想查看模板内容可点击操作下面的编辑模板',
                style: {
                    padding: '5px',
                    display: 'block'
                }
            }
			,{
                xtype: 'label',
                text: '2.门店模板管理标签页展示了每个门店选择展示的模板的名称及编号',
                style: {
                    padding: '5px',
                    display: 'block'
                }
            }]
		}]
	});

        //模板管理表格
	var grid_iMenuCate = new Ext.grid.GridPanel({
        autoScroll: true,
        frame:true,
		store:TemplateStore,
        stripeRows: true,
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: false
            },
            columns: [
				new Ext.grid.RowNumberer(),
				{ dataIndex: "TempNo", header: "模板编号",sortable: true,width:150},
				{ dataIndex: "TempName", header: "模板名称" ,width:180},
				{ header: '操作',width: 250,
                    renderer: function (value,metadata,record,rowIndex,columnIndex,store){
                            //删除模板
                        window.deleteRecord = function(id) {
                            deid=id;
                            var record = TemplateStore.getById(id);
                            var win = new Ext.Window({
                                title:"删除模板",
                                layout:'fit',
                                buttonAlign:'center',
                                modal: true,
                                items:[
                                new Ext.Panel({
                                    width:300,
                                    padding:'10px 20px',
                                    bodyStyle:'background:#f6f6f6;text-align:center',
                                    border:false,
                                    html:'确认删除'+' “'+record.data.TempName+'” '+"模板?"
                                })],
                                buttons: [
                                {   xtype: "button", text: "确定",
                                    handler: function () {
                                        for (var i=0;i<TemplateStore.getById(deid).data.stores.length; i++) {
                                            for(var j=0;j<chose_store_all.data.items.length; j++){
                                                if (TemplateStore.getById(deid).data.stores[i].StoreName==chose_store_all.data.items[j].data.StoreName) {
                                                    chose_store_all.getById(chose_store_all.data.items[j].id).set("TempName","");
                                                };
                                            }
                                        };
                                        TemplateStore.remove(TemplateStore.getById(id));
                                        win.close(); }},
                                {   xtype: "button",text: "取消",
                                    handler: function () { win.close(); }}
                                ]
                            });
                            win.show();
                        };
                            //选择门店
                        window.chosestore = function(id) {
                            wid = id;
                            one_tmp_store.loadData(TemplateStore.getById(wid).data.stores);
                            var chose_win = new Ext.Window({
                                title:"选择门店",
                                width:800,
                                resizable : false,
                                height:661,
                                autoScroll:'true',
                                frame:true,
                                layout: "anchor",
                                modal: true,//设置模态框背后的界面不可操作
                                closeAction:'close',
                                items:[
                                {
                                    layout:"form",
                                    frame: true,
                                    height: 110,
                                    items: [
                                    {
                                        xtype: 'fieldset',
                                        title: '提示',
                                        style: {
                                            color: 'red'
                                        },
                                        items: [
                                        {
                                            xtype: 'label',
                                            text: '1.通过输入所在地区可筛选出某地区所有的门店，输入门店名称则可搜索到具体的门店',
                                            style: {
                                                padding: '5px',
                                                display: 'block'
                                            }
                                        }
                                        ,{
                                            xtype: 'label',
                                            text: '2.在门店列表中找到门店后点击选择门店即可添加到下面的已选择的门店列表中',
                                            style: {
                                                padding: '5px',
                                                display: 'block'
                                            }
                                        }]
                                    }]
                                },
                                {
                                    frame: true,
                                    layout:'column',
                                    padding:'15px 0px',
                                    items: [
                                    {
                                        xtype:'panel',
                                        layout:'form',
                                        labelAlign: 'right',
                                        labelWidth:100,
                                        border: false,
                                        items:[
                                        {
                                            // xtype: 'textfield',
                                            xtype: 'combo',
                                            id:'District',
                                            enableKeyEvents:true,
                                            maxHeight: 80,
                                            store: chose_District_all,
                                            // hideTrigger : true,
                                            minChars : 0,
                                            displayField: 'District',
                                            mode: 'local',
                                            listeners: {
                                                'beforequery':fuzzyquery,
                                                'select': disquery,
                                                'keyup': disquery},
                                            forceSelection: true,
                                            triggerAction: 'all',
                                            width:180,
                                            fieldLabel:"所在地区",
                                            value:''
                                        }]
                                    },{
                                        xtype:'panel',
                                        layout:'form',
                                        labelAlign: 'right',
                                        labelWidth:100,
                                        border: false,
                                        items:[
                                        {
                                            // xtype: 'textfield',
                                            xtype: 'combo',
                                            id:'StoreName',
                                            hideTrigger : true,
                                            enableKeyEvents:true,
                                            maxHeight: 80,
                                            minChars : 0,
                                            fieldLabel:"门店名称",
                                            store: chose_store_all,
                                            displayField: 'StoreName',
                                            forceSelection: true,
                                            triggerAction: 'all',
                                            mode: 'local',
                                            listeners: {
                                                'beforequery':fuzzyquery
                                            },
                                            width:180,
                                            value:''
                                        }]
                                    },
                                    {
                                        border: false,
                                        items: [{
                                            xtype: 'button',
                                            text: '查看所有门店',
                                            style:{
                                                marginLeft:'40px'
                                            },
                                            handler:function(){
                                                Ext.getCmp('District').setValue("");
                                                Ext.getCmp('StoreName').setValue("");
                                                disquery();
                                            }
                                        }]
                                    }]
                                },
                                    //所有门店列表
                                new Ext.grid.GridPanel({
                                    title:"所有门店列表",
                                    height:210,
                                    autoScroll: true,
                                    frame:true,
                                    store:chose_store_all,
                                    stripeRows: true,
                                    cm: new Ext.grid.ColumnModel({
                                        defaults: {
                                            sortable: false
                                        },
                                        columns: [
                                        new Ext.grid.RowNumberer(),
                                        { dataIndex: "AreaID", header: "地区编号",align: 'center',sortable: true,width:80},
                                        { dataIndex: "District", header: "所在地区",align: 'center',width:100},
                                        { dataIndex: "StoreName", header: "门店名称",width:150},
                                        { dataIndex: "TempName", header: "模板名称",width:150},
                                        { dataIndex: "", header: "操作",sortable: true,width:200,renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
                                                var TmpName = chose_store_all.getById(record.id).data.TempName;
                                                    //选择门店
                                                window.add_To = function(id) {
                                                    chose_store_all.getById(id).set("TempName",TemplateStore.getById(wid).data.TempName);
                                                    var redata = chose_store_all.getById(id).data;
                                                    var recode = new Ext.data.Record({
                                                        AreaID:redata.AreaID,
                                                        District:redata.District,
                                                        StoreName:redata.StoreName
                                                    });
                                                    one_tmp_store.add(recode);
                                                    var one_stores = Ext.pluck(one_tmp_store.data.items,'data');
                                                    TemplateStore.getById(wid).set("stores",one_stores);
                                                };
                                                    //更换并选择门店
                                                window.add_Too = function(id){
                                                    atid = id;
                                                    var name1=chose_store_all.getById(id).data.TempName;
                                                    var name2=TemplateStore.getById(wid).data.TempName;
                                                    var winToo = new Ext.Window({
                                                        title:"更换门店",
                                                        layout:'fit',
                                                        buttonAlign:'center',
                                                        modal: true,
                                                        items:[
                                                        new Ext.Panel({
                                                            width:300,
                                                            padding:'10px 20px',
                                                            bodyStyle:'background:#f6f6f6;text-align:center',
                                                            border:false,
                                                            html:'确认更换此门店的模板?'
                                                        })],
                                                        buttons: [
                                                            {
                                                                xtype: "button", text: "确定",
                                                                handler: function () {
                                                                    var StoreTempNames = TemplateStore.data.items;
                                                                    var StoreTempNamesAllLen = StoreTempNames.length;
                                                                    var ch_TempName = chose_store_all.getById(atid).data.TempName;
                                                                    var ch_StoreName = chose_store_all.getById(atid).data.StoreName;
                                                                    for(var i=0;i<StoreTempNamesAllLen;i++){
                                                                        if (StoreTempNames[i].data.TempName==ch_TempName) {
                                                                            var stores = TemplateStore.getById(StoreTempNames[i].id).data.stores;
                                                                            for (var j=0; j<stores.length;j++) {
                                                                                if (stores[j].StoreName==ch_StoreName) {
                                                                                    stores.splice(j,1);
                                                                                    TemplateStore.getById(StoreTempNames[i].id).set("stores",stores);
                                                                                };
                                                                            };
                                                                            break;
                                                                        };
                                                                    }
                                                                    chose_store_all.getById(id).set("TempName",TemplateStore.getById(wid).data.TempName);
                                                                    var redata = chose_store_all.getById(id).data;
                                                                    var recode = new Ext.data.Record({
                                                                        AreaID:redata.AreaID,
                                                                        District:redata.District,
                                                                        StoreName:redata.StoreName
                                                                    });
                                                                    one_tmp_store.add(recode);
                                                                    var one_stores = Ext.pluck(one_tmp_store.data.items,'data');
                                                                    TemplateStore.getById(wid).set("stores",one_stores);
                                                                    winToo.close();
                                                                    // console.log(TemplateStore.data.items);

                                                                }
                                                            },
                                                            {
                                                                xtype: "button",text: "取消",
                                                                handler: function () { winToo.close(); }}
                                                        ]
                                                    });
                                                    if (name1!=name2) {
                                                        winToo.show();
                                                    }else{
                                                    };
                                                }
                                                if (TmpName.length>0) {
                                                    var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="add_Too(\'' + record.id + '\')" >选择该门店并更换为当前模板</a>';
                                                    return returnStr;
                                                }else{
                                                    var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="add_To(\'' + record.id + '\')" >选择该门店</a>';
                                                    return returnStr;
                                                };
                                            }
                                        }]
                                    })
                                }),////模板已有的门店列表
                                new Ext.grid.GridPanel({
                                    title:"此模板已选择的门店列表",
                                    autoScroll: true,
                                    height:200,
                                    frame:true,
                                    store:one_tmp_store,
                                    stripeRows: true,
                                    cm: new Ext.grid.ColumnModel({
                                        defaults: {
                                            sortable: false
                                        },
                                        columns: [
                                        new Ext.grid.RowNumberer(),
                                        { dataIndex: "AreaID", header: "地区编号",align: 'center',sortable: true,width:80},
                                        { dataIndex: "District", header: "所在地区",align: 'center',width:100},
                                        { dataIndex: "StoreName", header: "门店名称",width:150},
                                        { dataIndex: "", header: "操作",sortable: true,width:200,renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
                                                window.deleteStore = function(id) {
                                                    var record = one_tmp_store.getById(id);
                                                    var Name = record.data.StoreName;
                                                    var StoreNameAll = chose_store_all.data.items;
                                                    var StoreNameAllLen = StoreNameAll.length;
                                                    var win = new Ext.Window({
                                                        title:"删除门店",
                                                        layout:'fit',
                                                        buttonAlign:'center',
                                                        modal: true,
                                                        items:[
                                                        new Ext.Panel({
                                                            width:300,
                                                            padding:'10px 20px',
                                                            bodyStyle:'background:#f6f6f6;text-align:center',
                                                            border:false,
                                                            html:'确认删除'+' "'+record.data.StoreName+'" ?'
                                                        })],
                                                        buttons: [
                                                        {   xtype: "button", text: "确定",
                                                            handler: function () {
                                                                for(var i=0;i<StoreNameAllLen;i++){
                                                                    if (StoreNameAll[i].data.StoreName==Name) {
                                                                        var Nameid = StoreNameAll[i].id;
                                                                        chose_store_all.getById(Nameid).set("TempName","");
                                                                        break;
                                                                    };
                                                                }
                                                                one_tmp_store.remove(record);
                                                                TemplateStore.getById(wid).data.stores = Ext.pluck(one_tmp_store.data.items, 'data');
                                                                win.close(); }},
                                                        {   xtype: "button",text: "取消",
                                                            handler: function () { win.close(); }}
                                                        ]
                                                    });
                                                    win.show();
                                                };
                                                var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="deleteStore(\'' + record.id + '\')">删除此门店</a>';
                                                return returnStr;
                                            }
                                        }]
                                    })
                                })],
                                buttonAlign:'center',
                                buttons: [
                                {
                                    xtype: "button", text: "关闭",
                                    width:120,height:30,
                                    handler: function () { chose_win.close(); }
                                }]
                            })
                            chose_win.show();
                        }
                        window.edittemplate = function(id) {
                            stid = id
                            var record = TemplateStore.getById(id);
                            var index = TemplateStore.indexOf(record);
                            window_store.loadData(record.data.Content);
                            windowShow("编辑模板",record.data.TempNo,record.data.TempName,editTmp,stid);
                        }
                        var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="chosestore(\'' + record.id + '\')">选择门店</a>&nbsp;&nbsp;&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="edittemplate(\'' + record.id + '\')">编辑模板</a>&nbsp;&nbsp;&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="deleteRecord(\'' + record.id + '\')">删除模板</a>';
                        return returnStr;
                    }
				}
			]
        })
    });

        //门店模板管理表格
    var grid_store = new Ext.grid.EditorGridPanel({
        autoScroll: true,
        store:chose_store_all,
        frame:true,
        border:false,
        stripeRows: true,
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: false // columns are not sortable by default
            },
            columns: [
                new Ext.grid.RowNumberer(),
                { dataIndex: "AreaID", header: "地区编号",align: 'center',sortable: true,width:80},
                { dataIndex: "District", header: "所在地区",align: 'center',width:100},
                { dataIndex: "StoreName", header: "门店名称",width:150},
                { dataIndex: "TempName", header: "模板名称",width:150},
                {   header: '操作',width: 180,
                    renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
                         ////选择模板
                        window.choseTmp = function(id) {
                            chid = id;
                            var win = new Ext.Window({
                                title:"选择模板",
                                layout:'fit',
                                buttonAlign:'center',
                                modal: true,
                                height:400,
                                width:600,
                                items:[
                                new Ext.grid.GridPanel({
                                    autoScroll: true,
                                    frame:true,
                                    store:TemplateStore,
                                    stripeRows: true,
                                    cm: new Ext.grid.ColumnModel({
                                        defaults: {
                                            sortable: false
                                        },
                                        columns: [
                                            new Ext.grid.RowNumberer(),
                                            { dataIndex: "TempNo", header: "模板编号",sortable: true,width:150},
                                            { dataIndex: "TempName", header: "模板名称" ,width:180},
                                            { dataIndex: "", header: "操作" ,width:180,
                                                renderer: function (value, metadata, record, rowIndex, columnIndex, store){
                                                        //选择模板
                                                    window.choseTmp1 = function(id) {
                                                        var choseNe = chose_store_all.getById(chid).data.TempName;
                                                        if (choseNe.length>0) {
                                                            var StoreTempNames = TemplateStore.data.items;
                                                            var StoreTempNamesAllLen = StoreTempNames.length;
                                                            for(var i=0;i<StoreTempNamesAllLen;i++){
                                                                if (StoreTempNames[i].data.TempName==choseNe) {
                                                                    var stores = TemplateStore.getById(StoreTempNames[i].id).data.stores;
                                                                    for (var j=0; j<stores.length;j++) {
                                                                        if (stores[j].StoreName==chose_store_all.getById(chid).data.StoreName) {
                                                                            stores.splice(j,1);
                                                                            TemplateStore.getById(StoreTempNames[i].id).set("stores",stores);
                                                                        }
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        chose_store_all.getById(chid).set("TempName",TemplateStore.getById(id).data.TempName);
                                                        var redata = chose_store_all.getById(chid).data;
                                                        var recode = new Ext.data.Record({
                                                            AreaID:redata.AreaID,
                                                            District:redata.District,
                                                            StoreName:redata.StoreName
                                                        });
                                                        one_tmp_store.loadData(TemplateStore.getById(id).data.stores);
                                                        one_tmp_store.add(recode);
                                                        var one_stores = Ext.pluck(one_tmp_store.data.items,'data');
                                                        TemplateStore.getById(id).set("stores",one_stores);
                                                        win.close();
                                                    }
                                                    var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="choseTmp1(\'' + record.id + '\')" >选择此模板</a>';
                                                    return returnStr;
                                                }
                                            }
                                        ]
                                    })
                                })],
                                buttons: [{xtype: "button",text: "关闭",handler: function () { win.close(); }}]
                            });
                            win.show();
                        }
                        window.deleteTmp = function(id) {
                            var deTmpName = chose_store_all.getById(id).data.TempName;
                            var deStoreName = chose_store_all.getById(id).data.StoreName;
                            var StoreTempNames = TemplateStore.data.items;
                            var StoreTempNamesAllLen = StoreTempNames.length;
                            for(var i=0;i<StoreTempNamesAllLen;i++){
                                if (StoreTempNames[i].data.TempName==deTmpName) {
                                    var stores = TemplateStore.getById(StoreTempNames[i].id).data.stores;
                                    for (var j=0; j<stores.length;j++) {
                                        if (stores[j].StoreName==deStoreName) {
                                            stores.splice(j,1);
                                            TemplateStore.getById(StoreTempNames[i].id).set("stores",stores);
                                        };
                                    };
                                    break;
                                }
                            }
                            chose_store_all.getById(id).set("TempName","");
                        }
                        var stTmpName = chose_store_all.getById(record.id).data.TempName;
                        // console.log(stTmpName.length);
                        if (stTmpName.length>0) {
                            var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="choseTmp(\'' + record.id + '\')" >更换模板</a> &nbsp;&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="deleteTmp(\'' + record.id + '\')" >删除门店模板</a>';
                            return returnStr;
                        }else{
                            var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="choseTmp(\'' + record.id + '\')" >选择模板</a> &nbsp;&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="deleteTmp(\'' + record.id + '\')" >删除门店模板</a>';
                            return returnStr;
                        }
                    }
                }
            ]
        })
    });

        //模板管理标签页
    var tab1 = new Ext.form.FormPanel({
        title:"模板管理",
        frame: true,
        layout: "anchor",
        border:false,
        items:[
        {
            frame: true,
            border: false,
            layout: "column",
            items: [{
                border: false,
                items: [{
                    xtype: 'button',
                    text: '增加模板',
                    width:100,
                    height:30,
                    style:{
                        margin:' 20px 100px'
                    },
                     //增加模板
                    handler:addtemplate
                }]
            },{
                border: false,
                items: [{
                    xtype: 'button',
                    text: '提交修改',
                    width:100,
                    height:30,
                    style:{
                        margin:' 20px 100px'
                    },
                     //增加模板
                    handler:sendData
                }]
            }]
        },
        {
            layout: "fit",
            anchor: '0 -85',
            title:'模板列表',
                //模板列表
            items: [grid_iMenuCate]
        }
        ]
    });

        //门店模板管理标签页
    var tab2 = new Ext.form.FormPanel({
        title:"门店模板管理",
        frame: true,
        layout: "anchor",
        border:false,
        items:[
        {
            frame: true,
            layout:'column',
            padding:'25px 0px',
            items: [
            {
                xtype:'panel',
                layout:'form',
                labelAlign: 'right',
                // labelWidth:100,
                border: false,
                items:[
                {
                    // xtype: 'textfield',
                    xtype: 'combo',
                    id:'Districta',
                    enableKeyEvents:true,
                    maxHeight: 80,
                    store: chose_District_all,
                    // hideTrigger : true,
                    minChars : 0,
                    displayField: 'District',
                    mode: 'local',
                    listeners: {
                        'beforequery':fuzzyquery,
                        'select': disquerya,
                        'keyup': disquerya},
                    forceSelection: true,
                    triggerAction: 'all',
                    width:180,
                    fieldLabel:"所在地区",
                    value:''
                }]
            },{
                xtype:'panel',
                layout:'form',
                labelAlign: 'right',
                // labelWidth:100,
                border: false,
                items:[
                {
                    // xtype: 'textfield',
                    xtype: 'combo',
                    id:'StoreNamea',
                    hideTrigger : true,
                    enableKeyEvents:true,
                    maxHeight: 80,
                    minChars : 0,
                    fieldLabel:"门店名称",
                    store: chose_store_all,
                    displayField: 'StoreName',
                    forceSelection: true,
                    triggerAction: 'all',
                    mode: 'local',
                    listeners: {
                        'beforequery':fuzzyquery
                    },
                    width:180,
                    value:''
                }]
            },
            {
                border: false,
                items: [{
                    xtype: 'button',
                    text: '查看所有门店',
                    // width:100,
                    // height:30,
                    style:{
                        margin:' 0px 50px'
                    },
                    handler:function(){
                        Ext.getCmp('Districta').setValue("");
                        Ext.getCmp('StoreNamea').setValue("");
                        disquerya();
                    }
                }]
            },
            {
                border: false,
                items: [{
                    xtype: 'button',
                    text: '确认修改',
                    width:100,
                    // height:30,
                    style:{
                        margin:' 0px 20px'
                    },
                    handler:function(){
                        alert("数据修改成功");
                    }
                }]
            }]
        },
        {
            layout: "fit",
            title:"门店列表",
            anchor: '0 -93',
            items: [grid_store]
        }]
    });
        //整体标签页
    var table = new Ext.TabPanel({
        border:false,
        activeTab: 0, // 默认激活第一个tab页
        items:[tab1,tab2]
    });

        //window弹框
    function windowShow(title,TempNoValue,TempNameValue,handFn,id){
        var TempRecord='',TempIndex='';
        if (id!='') {
            TempRecord = TemplateStore.getById(id);
            TempIndex = TemplateStore.indexOf(TempRecord);
        }
            //window弹框里面的表格
        var window_grid = new Ext.grid.EditorGridPanel({
            autoScroll: true,
            store:window_store,
            frame:true,
            border:false,
            clicksToEdit: 1,
            stripeRows: true,
            enableDragDrop : true,
            cm: new Ext.grid.ColumnModel({
                columns: [
                    { dataIndex: "", header: "",width:20},
                    // new Ext.grid.RowNumberer(),
                    { dataIndex: "FileNo", header: "序号",sortable: true,width:80,align: 'center',editor: new Ext.form.NumberField({
                            allowBlank: false
                    })},
                    { dataIndex: "FileName", header: "内容名称",width:200,align: 'center'},
                    { dataIndex: "ShowTime", header: "显示时长（s）",width:120,align: 'center',
                        editor: new Ext.form.NumberField({
                            allowBlank: false
                    })},
                    {
                        header: '操作',
                        width: 150,
                        renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
                                //删除行
                            window.WdeleteRecord = function(id) {
                                var record = window_store.getById(id);
                                console.log(window_store.getById(id));
                                var win = new Ext.Window({
                                    title:"删除",
                                    layout:'fit',
                                    buttonAlign:'center',
                                    modal: true,
                                    items:[
                                    new Ext.Panel({
                                        width:300,
                                        padding:'10px 20px',
                                        bodyStyle:'background:#f6f6f6;text-align:center',
                                        border:false,
                                        html:'确认删除'+' “'+record.data.FileName+'” '+"文件?"
                                    })],
                                    buttons: [
                                        {
                                            xtype: "button", text: "确定",
                                            handler: function () {
                                                window_store.remove(record);
                                                win.close(); }},
                                        {
                                            xtype: "button",text: "取消",
                                            handler: function () { win.close(); }}
                                    ]
                                });
                                win.show();
                            };
                                //向上移动数据行
                            window.upRow = function(id) {
                                var record = window_store.getById(id);
                                var index = window_store.indexOf(record);
                                var fileN = Number(record.data.FileNo);
                                console.log(record.data);
                                console.log(index);
                                if (index > 0) {
                                    window_store.removeAt(index);
                                    window_store.insert(index - 1, record);
                                    window_store.getAt(index).set('FileNo',fileN);
                                    record.set('FileNo',fileN-1);

                                }
                            };
                                //向下移动数据行
                            window.downRow = function(id) {
                                var record = window_store.getById(id);
                                var index = window_store.indexOf(record);
                                var fileN = Number(record.data.FileNo);
                                console.log(record);
                                console.log(index);
                                if (index < window_store.getCount() - 1) {
                                    window_store.removeAt(index);
                                    window_store.insert(index + 1, record);
                                    window_store.getAt(index).set('FileNo',fileN);
                                    record.set('FileNo',fileN+1);
                                }
                            };

                            var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="upRow(\'' + record.id + '\')" >上移</a>&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="downRow(\'' + record.id + '\')" >下移</a>&nbsp;<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="WdeleteRecord(\'' + record.id + '\')" >删除</a>';
                            return returnStr;
                        }
                    }
                ]
            })
        });
        wina = new Ext.Window({
            title:title,
            width:800,
            height:600,
            // autoScroll:'true',
            frame:true,
            layout: "anchor",
            modal: true,//设置模态框背后的界面不可操作
            closeAction:'close',
            items:[
            {
                layout:"form",
                frame: true,
                // border: false,
                height: 110,
                items: [
                {
                    xtype: 'fieldset',
                    title: '提示',
                    style: {
                        color: 'red'
                    },
                    items: [
                    {
                        xtype: 'label',
                        text: '1.模板编号和模板名称都不得为空',
                        style: {
                            padding: '5px',
                            display: 'block'
                        }
                    }
                    ,{
                        xtype: 'label',
                        text: '2.上传文件时，点击确定上传会在下面表格添加一条数据，一次只能选择上传一个文件',
                        style: {
                            padding: '5px',
                            display: 'block'
                        }
                    }]
                }]
            },
            {
                frame: true,
                layout:'column',
                padding:'15px 0px',
                items: [
                {
                    xtype:'panel',
                    layout:'form',
                    columnWidth:0.5,
                    labelAlign: 'right',
                    labelWidth:140,
                    border: false,
                    items:[
                    {
                        xtype: 'textfield',
                        id:'TempNo',
                        style:{marginBottom:'10px'},
                        fieldLabel:"模板编号",
                        value:TempNoValue
                    },{
                        xtype: 'textfield',
                        id:'uploadF',
                        width:200,
                        inputType: 'file',
                        allowBlank: false,
                        fieldLabel:"上传文件"
                    }]
                },{
                    xtype:'panel',
                    layout:'form',
                    labelAlign: 'right',
                    columnWidth:0.5,
                    border: false,
                    items:[
                    {
                        xtype: 'textfield',
                        id:'TempName',
                        style:{marginBottom:'10px'},
                        fieldLabel:"模板名称",
                        value:TempNameValue
                    },
                    {
                        layout:'column',
                        border: false,
                        items: [
                        {
                            xtype:'panel',
                            layout:'form',
                            labelAlign: 'right',
                            border: false,
                            items:[{
                                xtype: 'numberfield',
                                id:'ShowTime',
                                width:80,
                                selectOnFocus:true,
                                style:{
                                    textAlign:'center',
                                    marginRight:'5px'
                                },
                                allowBlank: false,
                                value:'5',
                                fieldLabel:"显示时长（s）"
                            }]
                        },{
                            xtype: "button",
                            width:80,
                            text: "确定上传",
                            handler: function () {//上传文件获取名称
                                var fielN = Ext.getCmp('uploadF').getValue().split("\\").pop();
                                var showT = Ext.getCmp('ShowTime').getValue();
                                index = window_store.getCount()+1;
                                if (fielN!=""&&showT!="") {
                                    var add_data =  new Ext.data.Record({
                                        'FileNo': index,
                                        'FileName': fielN,
                                        'ShowTime': showT
                                    });
                                    window_store.add(add_data);
                                    Ext.getCmp('uploadF').setValue('');
                                }else{
                                    Ext.getCmp('uploadF').focus();
                                };
                            }
                        }]
                    }]
                }]
            },
            {
                layout: "fit",
                anchor: '-0 -213',
                border: false,
                title:'内容列表',
                items: [window_grid]
            }],
            buttonAlign:'center',
            buttons: [
            {
                xtype: "button", text: "确定",
                width:120,height:30,
                handler: handFn
            },
            {
                xtype: "button",text: "取消",
                width:120,height:30,
                handler: function () {
                window_store.removeAll();
                wina.close(); }}
            ]
        });
        wina.show();
    }

    //向后抬传输数据
    function sendData() {
        console.log("gf3sdkahfjdls111111");
        // Ext.getCmp('btn_submit').setDisabled(true);
        var mask = new Ext.LoadMask(Ext.getBody(), {
            msg: '正在提交，请稍候...'
        });
        mask.show();
        var data = Ext.pluck(TemplateStore.data.items, 'data');
        var temp = {};
        temp.data = data;
        var json = Ext.encode(temp);
        Ext.Ajax.request({
            url: '../js/test.php',
            method : 'POST',
            params: {
                data: json
            },
            success: function() {
                mask.hide();
                console.log(json);
                // storeEBill.loadData([]);
                // Ext.Msg.alert('提示', '提交成功！');
                var win_alert = new Ext.Window({
                    title:"提示",
                    layout:'fit',
                    buttonAlign:'center',
                    modal: true,
                    height:100,
                    width:240,
                    items:[{
                        xtype:'form',
                        html:'提交成功！',
                        bodyStyle:'line-height:30px;background:#f6f6f6;text-align:center'
                    }],
                    buttons: [{xtype: "button",text: "关闭",handler: function () { win_alert.close(); }}]
                });
                win_alert.show();

                // Ext.getCmp('btn_submit').setText('已提交');
            },
            failure: function() {
                mask.hide();
                // Ext.Msg.show({
                //     title: '提示',
                //     msg: '<span style="color: red;">提交发生错误，请重新尝试！</span>',
                //     buttons: Ext.Msg.OK
                // });
                //设置提交按钮为不可用
                //Ext.getCmp('btn_submit').setDisabled(false);
            }
        });
    }



        //显示增加模板弹框
	function addtemplate(){
        windowShow("增加模板","","",addTmp,'');
	}

        //编辑模板
    function editTmp() {
        var TempName = Ext.getCmp('TempName').getValue();
        var TempNo = Ext.getCmp('TempNo').getValue();
        var Content = Ext.pluck(window_store.data.items, 'data');
        if (TempName!=''&&TempNo!=''&&Content.length!=0) {
            TemplateStore.getById(stid).set('TempName', TempName);
            TemplateStore.getById(stid).set('TempNo',TempNo);
            TemplateStore.getById(stid).set('Content',Content);
            window_store.removeAll();
            wina.close();
        }else{
            alert("模板名称、模板编号及内容请填写完整！");
        }
    }

        //添加模板
    function addTmp() {
        var TempName = Ext.getCmp('TempName').getValue();
        var TempNo = Ext.getCmp('TempNo').getValue();
        var Content = Ext.pluck(window_store.data.items, 'data');
        // console.log(Ext.pluck(window_store.data.items, 'data'));
        if (TempName!=''&&TempNo!=''&&Content.length!=0) {
            var record = new Ext.data.Record({
                'TempName': TempName,
                'TempNo': TempNo,
                'Content':Content,
                'stores':[]
            });
            TemplateStore.add(record);
            // console.log(TemplateStore);
            Ext.getCmp('TempName').setValue('');
            Ext.getCmp('TempNo').setValue('');
            window_store.removeAll();
            wina.close();
        }else{
            alert("模板名称、模板编号及内容请填写完整！");
        }
    }


        //模糊匹配
    function fuzzyquery(e, cancel) {
        var combo = e.combo;
        var q = e.query;
        var forceAll = e.forceAll;
        if (forceAll === true || (q.length >= this.minChars)) {
            if (this.lastQuery !== q) {
                this.lastQuery = q;
                if (this.mode == 'local') {
                    this.selectedIndex = -1;
                    if (forceAll) {
                        this.store.clearFilter();
                    } else {
                        // 检索的正则
                        var regExp = new RegExp(".*" + q + ".*", "i");
                        // 执行检索
                        this.store.filterBy(function(record, id) {
                            // 得到每个record的项目名称值
                            var text = record.get(combo.displayField);
                            return regExp.test(text);
                        });
                    }
                    this.onLoad();
                } else {
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            } else {
                this.selectedIndex = -1;
                this.onLoad();
            }
        }
        return false;
    }


    function disquery() {
        var District = Ext.getCmp('District').getValue();
        var recode = new RegExp(District);
        chose_store_all.filter([{
            property: "District",
            value: recode
        }]);
    }

    function disquerya() {
        var District = Ext.getCmp('Districta').getValue();
        var recode = new RegExp(District);
        chose_store_all.filter([{
            property: "District",
            value: recode
        }]);
    }


        //将主窗体加载到首页中
    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [pan_top]
        }
        , {
            layout: "fit",
            border: false,
            anchor: '-1 -110',
            items: [table]
        }]
    });

    ////添加至center窗口
    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
