var list_EditPwd;
var pnl_Fnlist;
Ext.setup({
	onReady: function () {
		var storeList = new Ext.data.Store({
			fields:['Id','Title'],
			data:[
				{'Id':1,'Title':'修改密码'}
			]
		});
		
		list_EditPwd = new Ext.List({
			store:storeList,
			fullscreen:true,
			ui: 'white',
			itemTpl:new Ext.XTemplate('{Title}')
		});
		
		list_EditPwd.on('itemtap',function(th,index,item,e){
			switch(index){
				case 0:
					EditPwdPnl.show(true);
					break;
			}
		});
		
		var EditPwdPnl = new Ext.form.FormPanel({
			id:'formEditPwd',
			modal:true,
			centered:true,
			floating:true,
			url:"../../Apis/ChangePoint.aspx?actionName=updatePwd&sid=" + sid,
			items:[
				{
					xtype:'fieldset',
					id:'pwdFieldSet',
					style:{
						marginBottom:'0px'
					},
					instructions:'&nbsp;',
					autoHeight:true,
					items:[
						{
							xtype:'passwordfield',
							name:'oldpwd',
							label:'原密码'
						},
						{
							xtype:'passwordfield',
							name:'pwd',
							label:'新密码'
						},
						{
							xtype:'passwordfield',
							name:'verifyPwd',
							label:'重复密码'
						}
					]
				},
				{
					xtype:'panel',
					defaults:{
						xtype:'button',
						style:'margin:0.1em',
						flex:1
					},
					layout:'hbox',
					items:[
						{
							xtype:'button',
							text:'确定',
							handler:FnEditPwd
						},
						{
							xtype:'button',
							text:'取消',
							handler:function(){
								Ext.getCmp('formEditPwd').hide();
							}
						}
					]
				}
			]
		});
		
		EditPwdPnl.on('hide',function(){
			EditPwdPnl.reset();
			Ext.getCmp('pwdFieldSet').setInstructions('&nbsp;');
		});
		
		function FnEditPwd(){
			var values = EditPwdPnl.getValues();
			var oldpwd = values.oldpwd;
			var pwd = values.pwd;
			var repwd = values.verifyPwd;
			if(oldpwd.length == 0){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>请输入原密码</font>');
				return;
			}
			if(pwd.length == 0){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>请输入密码</font>');
				return;
			}
			if(repwd.length == 0){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>请输入重复密码</font>');
				return;
			}
			if(pwd != repwd){
				Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>重复密码不正确</font>');
				return;
			}
			Ext.getCmp('pwdFieldSet').setInstructions('&nbsp;');
			EditPwdPnl.submit({
				method:'post',
				waitMsg:'正在更新，请稍候...',
				params:{pwd:oldpwd,newPwd:pwd},
				success:function(form,result){
					var success = result.success;
					if(success == 'True'){
						EditPwdPnl.hide();
						Ext.Msg.alert('提示','密码修改成功');
						
					}else{
						Ext.getCmp('pwdFieldSet').setInstructions('<font color=red>'+result.msg+'</font>');
					}
				},
				failure:function(form,result){
					Ext.getCmp('pwdFieldSet').setInstructions('服务器错误...');
				}
			});
		}

	}
});