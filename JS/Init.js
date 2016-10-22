/**
 *	初始化界面。首页
 */
Ext.onReady(function () {

    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    //菜单树
    var menuTree = new Ext.tree.TreePanel({
        region: 'west',
        id: 'west-panel', // see Ext.getCmp() below
        contentEl: "west",
        title: '功能菜单',
        split: true,
        width: 200,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
        xtype: 'treepanel',
        useArrows: true,
        autoScroll: true,
        margins: '5 0 0 5',
        animate: true,
        //enableDD: true,
        loader: new Ext.tree.TreeLoader(),

        /*//dataUrl: '../Apis/Auth.aspx?actionName=getUserMenu&sid=' + Sys.sid,
        //dataUrl:"../Default.aspx",
        root: {
        nodeType: 'async',
        text: 'Ext JS',
        draggable: false,
        collapsible: true,
        id: 'source',
        leaf: false,
        expended: true,
        children: [{
        text:"te"
        }]
        },*/

        root: new Ext.tree.AsyncTreeNode(
        {
            expanded: true,
            children: [
            {
                text: "物流模块",
                leaf: false,
                expanded: true,
                children: [
				{
                    text: "库存查询",
                    leaf: true,
                    showType: "panel",
                    url: "../Pages/BackEnd/LgstStockSearch.htm"
                }, {
                    text: "要货申请",
                    leaf: true,
                    showType: "panel",
                    url: "../Pages/BackEnd/LgstComApply.htm"
                }, {
                    text: "iPad展示模板管理",
                    leaf: true,
                    showType: "panel",
                    url: "../Pages/BackEnd/EsigniPadSearch.htm"
                }, {
                    text: "电子签单查询",
                    leaf: true,
                    showType: "panel",
                    url: "../Pages/BackEnd/EsignSearch.htm"
                }]
            },{
                text: 'Text',
                leaf: false,
                expanded: true,
                children: [
				{
                    text: '卡管理',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/CardMgr.htm'
                },{
                    text: '首次实名制认证',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/CustomerAuthen.htm'
                },{
                    text: '会员卡认证',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/CardAuthen.htm'
                },{
                    text: '在线门店查询',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/FindDeptOnline.htm'
                },{
                    text: '门店信息',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/StoreExInfo.htm'
                },{
                    text:'上传文件',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/UploadFile.htm'
                },{
                    text:'查看上传文件',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/lookscreenupload.htm'
                },{
                    text:'权限维护',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/AuthMgr.htm'
                },{
                    text:'权限组',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/AuthGroup.htm'
                },{
                    text:'报表查询',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/oBulletinMgr.htm'
                },{
                    text:'财务报表查询',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/CWOBulletinMgr.htm'
                },{
                   text:'物流报表查询',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/WLOBulletinMgr.htm'
                },{
                   text:'人事报表查询',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/RSOBulletinMgr.htm'
                },{
                    text:'每月报表上传',
                    leaf:true,
                    showType:'panel',
                    url:'../Pages/BackEnd/UploadMonthlyReport.htm'
                },{
                    text: '锁卡',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/LockCard.htm'
                },{
                    text: '解卡',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/UnLockCard.htm'
                },{
                    text: '查卡',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/SearchCard.htm'
                },{
                    text: '文峰卡余额',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/SearchCompanyBalance.htm'
                },{
                    text: '个体卡余额',
                    leaf: true,
                    showType: 'panel',
                    url: '../Pages/BackEnd/SearchUnitBalance.htm'
                }]
			}]
        }),
		rootVisible: false,
        listeners: {
            click: function (node, e) {
                //alert(node.attributes.leaf);
                onMenuClick(node);
            }
        }
    });

    //menuTree.expandAll();

    var south = new Ext.Panel({
        region: 'south',
        contentEl: 'south',
        split: true,
        height: 0, //30,
        frame: false,
        margins: '0'
    });

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
            new Ext.BoxComponent({
                region: 'north',
                height: 0//64
            }), south, menuTree, centerPanel, east]
    })

    /*////加载首页开始
    Ext.getBody().mask("正在加载！请稍候！");

    east.load({
    url: "../Pages/content.htm", //+ Math.random(),
    scripts: true, //一定要设置成 true，否则 里面的脚本不执行
    callback: function (el, success, response) {
    Ext.getBody().unmask();
    }
    });*/
})

//==========中间的panel============
var centerPanel = new Ext.Panel({
    region: 'center',
    contentEl: "center",
    margins: '5 5 0 0',
    title: "首页",
    autoScroll:true,
    layout:"fit"
});

//=========隐藏的panel，用来加载其他页面=============
var east = new Ext.Panel({
    region: "east",
    contentEl: "east",
    border: false,
    width:0
});

//=========修改密码窗口============
var win_modifyPwd = new Ext.Window({
    title:"修改密码",
    modal: true,
    layout: 'fit',
    width: 300,
    height: 180,
    closeAction: 'hide',
    items: [{
        id:"pwdForm",
        xtype: "form",
        labelWidth: 80, // label settings here cascade unless overridden
        //url: 'save-form.php',
        frame: true,
        //title: 'Simple Form',
        bodyStyle: 'padding:5px 5px 0',
        width: 180,
        defaults: { width: 150 },
        defaultType: 'textfield',
        items: [{
            fieldLabel: '原密码',
            inputType: "password",
            name: 'oldPwd'
        }, {
            fieldLabel: '新密码',
            inputType: "password",
            name: 'newPwd'
        }, {
            fieldLabel: '确定新密码',
            inputType: "password",
            name: 'reNewPwd'
        }
        ]

	}],
    buttons:[
	{
        text:"确定",
        handler:function(){
            win_modifyPwd.body.mask("正在提交，请稍等。。。");
            win_modifyPwd.get("pwdForm").getForm().submit({
                url:"../Apis/UserMgr.aspx?actionName=ModifyPwd&sid=" + Sys.sid,
                success: function(form, action) {
                    //alert(action.result);
                    win_modifyPwd.body.unmask();
                    if (action.result.success) {
                        Ext.Msg.alert("提示", "提交成功！");
                        win_modifyPwd.get("pwdForm").getForm().reset();
                        win_modifyPwd.hide();
                    } else {
                        Ext.Msg.alert("提示", "提交失败！" + action.result.msg);
                    }
                },
                failure: function(form, action) {
                    win_modifyPwd.body.unmask();
                    Ext.Msg.alert("提示", "提交失败！" + action.result.msg);
                }
            });
        }
    },{
        text:"取消",
        handler:function(){
            win_modifyPwd.get("pwdForm").getForm().reset();
            win_modifyPwd.hide();
        }
    }]
});


//菜单点击事件
function onMenuClick(node){
	if(node.attributes.leaf == true){
		//Ext.Msg.alert('Navigation Tree Click', 'You clicked: "' + node.attributes.url + '"');
		//==========加载 中间的 panel内容
	    if (node.attributes.showType == "panel") {
	        centerPanel.setTitle(node.attributes.text);
		    Ext.getBody().mask("正在加载！请稍候！");
		    centerPanel.removeAll(true);

			east.load({
				url:node.attributes.url + "?" + Math.random(),
			    //url: "../JS/TermiteType.js",
				scripts:true,//一定要设置成 true，否则 里面的脚本不执行
				callback:function(el,success,response){
				    Ext.getBody().unmask();
				}
			});
        } else if (node.attributes.showType == "logout") {
            Ext.Msg.confirm("提示框", "您是否确定要退出系统？", function(btn) {
                if (btn == "yes") {
                    this.location = "LoginPage.htm";
                    Ext.Ajax.request({
                        url: "../Apis/Auth.aspx?actionName=logout&sid=" + Sys.sid,
                        //params: "data=" + ids,
                        method: "POST",
                        success: function (response) {

                        },
                        failure: function(response) {
                        }
                    });
                }
            })
			//Ext.Msg.alert("退出系统显示");
        } else if (node.attributes.showType == "modifyPwd") {
                win_modifyPwd.show();
        }else if (node.attributes.showType == "window"){
            eval(node.attributes.url);
        }
        //alert(centerPanel.findById("FileNo"));
	}else{
		//centerPanel.body.unmask();
	}
}
