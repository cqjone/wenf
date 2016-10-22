

var pd_top_form = new Ext.form.FormPanel({
    height: 120,
	autoScroll:true,
	items:[
	{
		xtype:'fieldset',
		title:'查询条件',
		layout:'column',
		items: [
        {
            layout: 'form',
			columnWidth:0.35,
			labelWidth:90,
            items: [
                {
                    xtype: 'datefield',
                    anchor:'95%',
                    name: 'YMD1',
                    fieldLabel: '选择时间区',
                    value: new Date().add(Date.DAY, -7),
                    format: 'Y-m-d'
                },{
                     xtype: 'timefield',
					 fieldLabel:'时间(时:分:秒)',
                     anchor:'95%',
                     name: 'HIS1',
                     format: 'H:i:s'
				}
            ]
        }, {
            layout: 'form',
			columnWidth:0.25,
			labelWidth:20,
            items: [
				{
				    xtype: 'datefield',
				    anchor:'95%',
				    name: 'YMD2',
				    fieldLabel: '&nbsp;至',
				    value: new Date(),
				    format: 'Y-m-d'
				},{
					xtype: 'timefield',
					anchor:'95%',
					name: 'HIS2',
					format: 'H:i:s'
				}
            ]
        },{
			 layout: 'form',
			 columnWidth:0.3,
			 labelWidth:50,
             items:[
				{
					 xtype: 'combo',
					 name: 'DeptTitle',
					 hiddenName:'DeptId',
					 anchor:'95%',
					 fieldLabel: '门店',
					 triggerAction: 'all',
					 editable: false,
					 mode: 'remote',
					 store: new Ext.data.ArrayStore({
						 fields: ['myId', 'displayText'],
						 url: "../Apis/lookscreenupload.aspx?op=GetDept&sid=" + Sys.sid
					 }),
					 valueField: 'myId',
					 displayField: 'displayText'
				}
			 ],
			 buttons: [
					{
						text: '查询',
						handler: function () {
									/*pd_top_form.getForm().items.each(
									function(item){
									alert(item.getValue());
									}
									)*/
									try {
										//var DeptTitle = pd_top_form.find('name', 'DeptTitle')[0].getRawValue();
										var DeptId = pd_top_form.find('name', 'DeptTitle')[0].getValue();
										var YMD1 = pd_top_form.find('name', 'YMD1')[0].getValue().format('Y-m-d');
										var HIS1 = pd_top_form.find('name', 'HIS1')[0].getValue();
										var YMD2 = pd_top_form.find('name', 'YMD2')[0].getValue().format('Y-m-d');
										var HIS2 = pd_top_form.find('name', 'HIS2')[0].getValue();
										if (HIS2 == '') {
											HIS2 = "23:59:59";
										}
										if (YMD1 != '' && YMD2 != '') {
											pd_store.load({
												params: {DeptId: DeptId, Time1: (YMD1 + " " + HIS1), Time2: (YMD2 + " " + HIS2),start:0,limit:25 },
                                            });
										}
									} catch (e) {
										Ext.Msg.alert("提示", "起始时间或者结束时间可能有误！");
									}
							}
					}
			]
        }
    ]
	}
	]
});

var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true // columns are not sortable by default           
    },
    columns: [new Ext.grid.RowNumberer(),
		 {
			 header: '门店名称',
			 dataIndex: 'DeptTitle',
			 sortable : true,
			 width: 150
		 },
		 {
			header:'文件名称',
			dataIndex:'FileName',
			sortable : true,
			width: 150
		 },
		 {
			header:'文件大小',
			dataIndex:'FileSize',
			sortable : true,
			width: 150,
            renderer:SizeZhToKb
		 },{
			header:'上传时间',
			dataIndex:'ScreenTime',
			sortable : true,
			width: 150
		 },{
			header:'查看图片',
			dataIndex:'FilePath',
			sortable : true,
			width: 150,
			renderer:showbutton
		 }
	 ]
});

//将文件大小转换成Kb值
function SizeZhToKb(value, metadata, record, rowIndex, columnIndex, store) {
    var FileSize = (parseInt(value) / 1024).toString();
    return FileSize.toString().substring(0, FileSize.toString().indexOf(".") + 3) + '  Kb';
}

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: "../Apis/lookscreenupload.aspx?op=Seach&sid=" + Sys.sid,
    reader: new Ext.data.JsonReader({
        root: "results",
        totalProperty: 'totalCount',
        fields: [
			{ name: "FilePath", mapping: "FilePath" },
            { name: 'FileName', mapping: 'FileName' },
			{ name: 'FileSize', mapping: 'FileSize' },
			{ name: 'ScreenTime', mapping: 'ScreenTime', convert: ConvertJSONDateToJSDateObject_DateTime },
			{name: 'DeptTitle', mapping: 'DeptTitle' }
        ]
    })
});

pd_store.on({
    'beforeload':function(thiz,options){
        try {
		    var DeptTitle = pd_top_form.find('name', 'DeptTitle')[0].getRawValue();
		    var DeptId = pd_top_form.find('name', 'DeptTitle')[0].getValue();
		    var YMD1 = pd_top_form.find('name', 'YMD1')[0].getValue().format('Y-m-d');
		    var HIS1 = pd_top_form.find('name', 'HIS1')[0].getValue();
		    var YMD2 = pd_top_form.find('name', 'YMD2')[0].getValue().format('Y-m-d');
		    var HIS2 = pd_top_form.find('name', 'HIS2')[0].getValue();
		    if (HIS2 == '') {
					    HIS2 = "23:59:59";
		    }
		    if (YMD1 != '' && YMD2 != '') {
					pd_store.baseParams.DeptTitle=DeptTitle;
                    pd_store.baseParams.DeptId=DeptId;
                    pd_store.baseParams.Time1=(YMD1 + " " + HIS1);
                    pd_store.baseParams.Time2=(YMD2 + " " + HIS2);
		    }
		} catch (e) {
				Ext.Msg.alert("提示", "起始时间或者结束时间可能有误！");
		}
    }
});

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    margins: "2 2 2 2",
    border: false,
    loadMask: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: pd_store,
        displayInfo: true,
        style:'margin-bottom:40px;',
        displayMsg: '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
        emptyMsg: "没有记录"
    })
});

//添加查看图片按钮
function showbutton(value,metadata,record,rowIndex,columnIndex,store){
    window.StaticConfig = function (rowIndex) {
        var rowNum = store.getAt(rowIndex);
        var FilePath = rowNum.get("FilePath");
        var img = "<img id='img1' src='.." + FilePath + "' width='100%' height='100%' />";
        new Ext.Window({
            title: '图片查看',
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            width: '90%',
            height: 570,
            items: [
                {
                    xtype: 'panel',
                    autoScroll: true,
                    frame: true,
                    html: img
                }
            ]/*,
            tbar: [
                {
                    text: '缩小',
                    handler: function () {
                        document.getElementById("img1").width =  parseInt(parseInt(document.getElementById("img1").width) - 100);
                        document.getElementById("img1")e.height = parseInt(parseInt(document.getElementById("img1").height) - 50);
                    }
                }, {
                    text: '放大',
                    handler: function () {
                        document.getElementById("img1").width = parseInt(parseInt(document.getElementById("img1").width) + 100);
                        document.getElementById("img1").height = parseInt(parseInt(document.getElementById("img1").height) + 50);
                    }
                }
            ]*/
        }).show();
    }
	var returnStr = "<a href='#' onclick='StaticConfig("+rowIndex+")'>查看图片</a>";
	return returnStr;
}

//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "anchor",
    items: [{
        frame: true,
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        border: false,
        anchor: '-1 -100',
        items: [pd_grid]
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();

