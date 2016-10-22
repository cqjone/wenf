//部门考勤流水
//===================年份和月份Store========================//

var yearModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["1", "最近30天"]
    ]
});

var monthModelStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["0", "全部"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"],
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"],
        ["12", "12"]
    ]
});
var period_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getPeriod&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "Title",
            mapping: "Title"
        }, {
            name: "Value",
            mapping: "Value"
        }, ]
    }),
    sortInfo: {
        field: 'Value',
        direction: 'desc'
    }
});
period_store.load();

var tar_employee = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getEmployeeWithCheckin&match_all=true&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "CombineWord",
            mapping: "CombineWord"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'CombineWord',
        direction: 'ASC'
    }
});



var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    autoScroll: true,
    labelWidth: 5,
    labelAlign: 'right',
    heigh: 100,
    //autoWidth:true,
    items: [{
        xtype: "fieldset",
        title: "查询条件",
        //defaultType: 'textfield',
        defaults: {
            labelAlign: "right",
            width: 50
        },
        //bodyBorder:false,
        layout: "column",
        items: [{
            layout: "hbox",
            defaults: {
                margins: '0 5 0 0'
            },
            columnWidth: 1,
            items: [{
                    xtype: "label",
                    html: '时    间：',
                    style: {
                        marginTop: '3px'
                    }
                }, {
                    xtype: "combo",
                    name: "comboPeriod",
                    store: yearModelStore,
                    hiddenName: "comboPeriod",
                    width: 180,
                    margin: '0 0 0 20',
                    mode: 'local',
                    triggerAction: 'all',
                    valueField: 'ID',
                    displayField: 'Title',
                    editable: false,
                    forceSelection: true,
                    triggerAction: "all"

                },



                {
                    xtype: "button",
                    boxMinWidth: 40,
                    style: "margin-left:30px",
                    width: 60,
                    text: " 查  询",
                    handler: function() {
                        searchData();
                    }
                }, {
                    xtype: 'button',
                     style: "margin-left:50px",
                    text: " 导出为Excel ",
                    style: "margin-left:30px",
                    width: 90,
                    columnWidth: 0.3,
                    handler: function() {
                        
                       Export2Excel();
                    }
                },{
                    xtype: "button",
                    boxMinWidth: 40,
                    id:"btn-stop",
                    style: "margin-left:30px",
                    width: 60,
                    text: "停用工号",
                    handler: function() {
                        var selection = pd_grid.getSelectionModel().getSelections() || [];
                        if(selection.length==0){
                           Ext.Msg.alert("提示", "请选择需要设置的员工");
                        }
                        else{
                            Ext.MessageBox.confirm('提示', '是否确认要将以上人员全部停用', update2);    
                        }
                        

                    }
                }
                
            ]
        }]

    }]
});
//pd_top_form.getForm().findField('comboYear').setValue(newyear);
//pd_top_form.getForm().findField('comboMonth').setValue(new Date().getMonth() + 1);
var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel({
   
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },
    columns: [sm,
    new Ext.grid.RowNumberer(), {
            header: 'ID',
            dataIndex: 'ID',
            hidden: true,
            width: 100
        },

        {
            header: '<center>工号</center>',
            dataIndex: 'Code',
            sortable:true,
            width: 100

        }, {
            header: '<center>姓名</center>',
            dataIndex: 'Title',
            sortable:true,
            width: 100

        }, {
            header: "<center>门店</center>",
            dataIndex: "Dept",
            sortable:true,
            width: 120,

        }, {
            header: "<center>职务</center>",
            dataIndex: "Duty",
            sortable:true,
            width: 120,
        }, {
            header: "<center>手机号码</center>",
            align: 'center',
            dataIndex: "Mobile",
            width: 120
        }, {
            header: "<center>最近做单日期</center>",
            align: 'center',
            dataIndex: "LastBusinessDate",
            width: 120
        }, {
            header: "<center>最近排班日期</center>",
            align: 'center',
            dataIndex: "LastScheduleDate",
            width: 120
        }, {
            header: "<center>最近拍照日期</center>",
            align: 'center',
            dataIndex: "LastCheckinDate",
            width: 120
        }
    ]
});


// create the Data Store
var pd_store = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/AttendanceMgr.aspx?actionName=queryNoScheduleReport&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        idProperty: 'ID',
        root: 'results',
        totalProperty: 'totalCount',
        fields: [{
            name: "ID",
            mapping: "ID"
        }, {
            name: 'Code',
            mapping: 'Code'
        }, {
            name: 'Title',
            mapping: 'Title'
        }, {
            name: 'Dept',
            mapping: 'Dept'
        }, {
            name: 'Duty',
            mapping: 'Duty'
        }, {
            name: 'Mobile',
            mapping: 'Mobile'
        }, {
            name: "LastBusinessDate",
            mapping: "LastBusinessDate"
        }, {
            name: "LastScheduleDate",
            mapping: "LastScheduleDate"
        }, {
            name: "LastCheckinDate",
            mapping: "LastCheckinDate"
        }]
    })
});
/** 
 * 查询数据
 */
function searchData() {

    pd_top_form.getForm();

    pd_store.load();
}

var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    sm: sm,
    margins: "2 2 2 2",
    border: false,
    columnLines: true,
    selModel:sm,
    rowdeselect:function(sm, rowIndex, r){
        alert(rowIndex)
    },
    loadMask: true
        /**listeners: {
            cellclick: function (grid, row, col, event) {
                alert('click');
                var record = pd_grid.getStore().getAt(row);
                var fieldName = pd_grid.getColumnModel().getDataIndex(col);
                var src = record.get(fieldName);
                if (src.indexOf(".jpg")>0) {
                    src = record.get(fieldName).replace(".jpg4", ".jpg");
                    if(picImageView.getStore()!= null && typeof(picImageView.getStore())!="undefined"){
                        picImageView.getStore().loadData([[src,src]]);
                        pictureWindow.show();
                    }
                 }
            }
        }**/

});

var setDefaultValues = function() {
    pd_top_form.find("name", "comboPeriod")[0].setValue("1");
};


pd_store.on('beforeload', function(thiz, options) {
    if (!pd_top_form.getForm().isValid()) {
        return false;
    }
    this.baseParams = pd_top_form.getForm().getValues();
    this.baseParams.urlName = "dept";
    this.baseParams.start = 0;
    this.baseParams.limit = 20;
});


//主容器
var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 90,
        layout: "fit",
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        region: 'center',
        border: false,
        anchor: '-1 -140',
        items: [pd_grid]
    }]
});



var pictureImageStore = new Ext.data.ArrayStore({
    fields: ['src'],
    data: []
});

var picImageTpl = new Ext.XTemplate(
    '<tpl for=".">',
    '<div style="margin-bottom: 10px;" class="thumb-wrap">',
    '<img width=610px src="..{src}" />',
    '</div>',
    '</tpl>'
);

var picImageView = new Ext.DataView({
    store: pictureImageStore,
    tpl: picImageTpl,
    region: 'center',
    itemSelector: 'div.thumb-wrap'
});


var pictureWindow = new Ext.Window({
    title: ' 图片浏览',
    width: 640,
    height: 545,
    modal: true,
    closable: false,
    items: picImageView,
    layout: 'fit',
    buttons: [{
        text: '关闭',
        handler: function() {
            pictureWindow.hide();
        }
    }]
});


function showPic(value, metadata, record, rowIndex, columnIndex, store) {
    window.ShowPicBox = function(rowIndex) {
        var row = pd_store.getAt(rowIndex);
        var checkDate = row.data["CheckinDate"];
        var photoName = row.data["PhotoFileName"];
        if (photoName != null && photoName != "") {
            var src = "/Imgs/Checkin/" + checkDate + "/" + photoName;
            picImageView.getStore().loadData([
                [src, src]
            ]);
            pictureWindow.show();
        }

        /**src = record.get(fieldName).replace(".jpg4", ".jpg");
                if(picImageView.getStore()!= null && typeof(picImageView.getStore())!="undefined"){
                    picImageView.getStore().loadData([[src,src]]);
                    pictureWindow.show();
                }**/

    };

    if (value != '') {
        return "<a style=\"cursor:pointer;text-decoration:underline;\" onclick=ShowPicBox('" + rowIndex + "') >查看照片</a>"
    } else {
        return '';
    }
}

function update2(btn) {

    if (btn == 'yes') {
         var ids = "";
         var selections = pd_grid.getSelectionModel().getSelections() || [];
         for(var i=0;i<selections.length;i++){
            var selection = selections[i]; 
            var spit = ids==""?"":",";
            ids+=spit + selection.data.ID;
         }
        pd_top_form.getForm().submit({
            waitMsg: "正在提交，请稍候...",
            url: "../Apis/AttendanceMgr.aspx?sid=" + Sys.sid + '&actionName=update2&ids='+ids,
            success: function(from, action) {
                pd_store.load();
                 Ext.Msg.alert("提示", "设置成功");
            },
            failure: function(form, action) {
                if (action.result != null && typeof(action.result) != "undefined") {
                    Ext.Msg.alert("提示", action.result.msg);
                } else {
                    Ext.Msg.alert("提示", "提交失败，请重试");
                }

            }
        });
    }



}

centerPanel.add(pd_main_panel);
centerPanel.doLayout();
setDefaultValues();

pd_grid.on('cellclick', function(grid, row, col, e) { 
    
    if (col == 0) { 
        var selection = grid.getSelectionModel().getSelections() || [];
        if(selection.length>0){
            Ext.getCmp('btn-stop').setText("停用工号（已选择"+selection.length+"人）");    
        }
        else{
              Ext.getCmp('btn-stop').setText("停用工号");    
        }
        
    }
});


window.Export2Excel = function () {
    debugger;
     window.location.href = '../Apis/AttendanceMgr.aspx?actionName=export2Excel&sid=' + Sys.sid ;
    /*Ext.Ajax.request({
        url: '../Apis/LogisticsManagement.aspx?actionName=getLogisticsReport&sid=' + Sys.sid + "&Year=" + year + "&Month=" + month+"&DeptID="+deptId,
      
            var data = Ext.decode(response.responseText);
            var success = data.success;
            if (typeof(data.success)=="undefined") {
                window.location.href = '../Apis/LogisticsManagement.aspx?actionName=export2Excel&sid=' + Sys.sid + "&Year=" + year + "&Month=" + month+"&DeptID="+deptId;
                return false
            } else {
                Ext.MessageBox.alert("提示", data.msg);
            }
            return;
        },
        failure: function () {
            Ext.MessageBox.alert("提示", "下载失败!");
        }
    });*/
};

