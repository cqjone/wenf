var  Form_Panel = new Ext.form.FormPanel({
    height: 200,
    labelWidth: 70,
    border: false,
    layout: 'column',
    fileUpload:true,
	frame:true,
    items: [
          
           {
           	layout : 'form',
           	border : false,
           	style : 'padding-left:4em;padding-top:4em;',
           	items : [
			
		   
				{
           			xtype : 'textfield',
           			fieldLabel : '文件路径',
           			name : 'File',
           			width : 200,
           			inputType : 'file'
           		}
           	]
           }
       ]
});

var win_Upload = new Ext.Window({
    title: ' 上传文件',
    width: 400,
    height: 200,
    modal: true,
    items: Form_Panel,
    buttons: [
        {
            text: 'Submit',
            handler: function () {
                if (Form_Panel.getForm().isValid()) {
                    Form_Panel.getForm().submit({
                        waitMsg: "正在提交，请稍候...",
                        url: "../Apis/Uploadfile.aspx?sid=" + Sys.sid+'&actionName=upload',
                        success: function (from, action) {
                            Ext.Msg.alert("提示", action.result.msg);
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert("提示", action.result.msg);
                        }
                    });
                }
            }
        },
        {
            text: 'Cancel',
            handler: function () {
                win_Upload.hide();
            }
        }
    ]
});

win_Upload.show();