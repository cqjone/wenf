Ext.onReady(function () {
    var DeptID = 0;
    var Month = 0;
    var rs_store = new Ext.data.Store({
        autoDestroy: true,
        url: '../Apis/VerifyCode.aspx?actionName=getDept&sid=' + Sys.sid,
        reader: new Ext.data.JsonReader({
            fields: [
                { name: "ID", mapping: "ID" },
                { name: "Title", mapping: "Title" }
            ]
        }),
        sortInfo: { field: 'ID', direction: 'ASC' }
    });

    var rsMonthStore = new Ext.data.ArrayStore({
        fields: ['ID', 'Title'],
        data: [["1", "一月"],
            ["2", "二月"],
            ["3", "三月"],
            ["4", "四月"],
            ["5", "五月"],
            ["6", "六月"],
            ["7", "七月"],
            ["8", "八月"],
            ["9", "九月"],
            ["10", "十月"],
            ["11", "十一月"],
            ["12", "十二月"]]
    });
    var Form_RSOBullentinGroup = new Ext.form.FormPanel({

        height: 70,
        labelWidth: 50,
        labelAlign: 'right',
        items: [
            {
                xtype: 'fieldset',
                title: '查询条件',
                layout: 'column',
                items: [
                    {
                        layout: 'form',
                        columnWidth: 0.35,
                        items: [
                            {
                                xtype: "combo",
                                fieldLabel: "门 店",
                                name: "DeptID",
                                anchor: "93%",
                                triggerAction: 'all',
                                store: rs_store,
                                valueField: 'ID',
                                displayField: 'Title',
                                enableKeyEvents: true,
                                selectOnFocus: true,
                                allowBlank: true,
                                listeners: {
                                    "keyup": function (v) {
                                        rs_store.load({
                                            params: { dName: v.getRawValue() }
                                        });
                                    }
                                }
                            }
                         ]
                    }, {
                        layout: 'form',
                        columnWidth: 0.35,
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: '月 份',
                                name: 'Month',
                                editable: false,
                                selectOnFocus: true,
                                forceSelection: true,
                                mode: 'local',
                                store: rsMonthStore,
                                displayField: "Title",
                                valueField: "ID",
                                mode: "local",
                                triggerAction: "all",
                                anchor: '93%',
                                allowBlank: true,
                                value: new Date().getMonth()
                            }
                         ]
                    }, {
                        columnWidth: 0.25,
                        style: 'margin-left:1em;',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'button',
                                text: '查询',
                                width: 70,
                                columnWidth: 0.25,
                                listeners: {
                                    'click': function () {
                                        DeptID = Form_RSOBullentinGroup.find('name', 'DeptID')[0].value;
                                        Month = Form_RSOBullentinGroup.find('name', 'Month')[0].value;
                                        store_RSOBullentinGroup.load({
                                            params: { DeptID: DeptID, Month: Month, ReportType: 2 }
                                        });
                                    }
                                }
                            }
                         ]
                    }
                ]
            }
         ]
    });

    var store_RSOBullentinGroup = new Ext.data.JsonStore({
        url: '../Apis/OBullentinMgr.aspx?ActionName=ShowOBullentin&sid=' + Sys.sid,
        root: 'results',
        totalProperty: 'totalCount',
        fields: [
			{ name: 'Id', mapping: 'Id' },
            { name: 'BMonth', mapping: 'BMonth' },
            { name: 'FileName', mapping: 'FileName' },
            { name: 'DeptTitle', mapping: 'DeptTitle' },
            { name: 'RealFileName', mapping: 'RealFileName' },
			{ name: 'FileSize', mapping: 'FileSize' },
            { name: 'CreateDate', mapping: 'CreateDate' },
            { name: 'FileDir', mapping: 'FileDir' }
		]
    });

    var grid_RSOBullentinGroup = new Ext.grid.GridPanel({
        store: store_RSOBullentinGroup,
        stripeRows: true,
        id: 'RSOBullentinGrid',
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
                new Ext.grid.RowNumberer({
                    header: "序号",
                    width: 40
                }),
                { dataIndex: 'Id', header: 'Id', hidden: true },
                { dataIndex: 'BMonth', header: '月份' },
                { dataIndex: 'FileName', header: '文件名', hidden: true },
                { dataIndex: 'DeptTitle', header: '门店' },
                { dataIndex: 'RealFileName', header: '文件名', width: 250 },
                { dataIndex: 'FileSize', header: '大小', renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    return (parseFloat(value) / 1024).toFixed(2) + "kb"
                }
                },
                { dataIndex: 'CreateDate', header: '上传时间', width: 150 },
                { dataIndex: 'FileDir', header: '目录', hidden: true },
                {
                    header: '操作',
                    renderer: showbutton_RSOBullentinGroup
                }
            ]
        })
    });



    function showbutton_RSOBullentinGroup(value, metadata, record, rowIndex, columnIndex, store) {
        window.DownLoadRSOBullentin = function (rowIndex) {
            var record = Ext.getCmp("RSOBullentinGrid").getStore().getAt(rowIndex);
            Ext.Ajax.request({
                url: '../Apis/OBullentinMgr.aspx?ActionName=IsExistFile&sid=' + Sys.sid + '&fileName=' + record.get("FileName"),
                param: { fileName: record.get("FileName") },
                success: function (response, option) {
                    var data = Ext.decode(response.responseText);
                    if (data.success == 'true') {
                        window.location.href = '../Apis/OBullentinMgr.aspx?ActionName=DownFile&sid=' + Sys.sid + "&fileName=" + record.get("RealFileName") + "&filePath=" + record.get("FileName");
                    } else {
                        Ext.MessageBox.alert("提示", data.msg);
                    }
                    return;
                },
                failure: function () {
                    Ext.MessageBox.alert("提示", "下载失败!");
                }
            });
        };
        var resultStr = "<a href='#' onclick='DownLoadRSOBullentin(" + rowIndex + ")'>下载</a>";
        return resultStr;
    }




    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_RSOBullentinGroup]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -100',
            items: [grid_RSOBullentinGroup]
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});