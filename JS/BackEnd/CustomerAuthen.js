
var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    fileUpload: true,
    autoScroll: false,
    labelWidth: 40,
    labelAlign: 'right',

    autoWidth: true,
    items: [{
            xtype: "fieldset",
            title: "实名制认证",
            //defaultType: 'textfield',
            defaults: {
                labelAlign: "right",
                width: 5
            },
            //bodyBorder:false,
            layout: "column",
            items: [{
                    xtype: 'box',

                    width: 70,
                    height: 60,
                    style: {
                        marginRight: '15px'

                    }

                }, {
                    layout: "hbox",
                    defaults: {
                        margins: '0 10 0 0'
                    },

                    columnWidth: 1,
                    items: [{
                            xtype: "label",
                            html: '姓  名：',
                            style: {
                                marginTop: '3px'

                            }
                        }, {
                            xtype: "textfield",
                            width: 128,
                            name: "Title",
                            style: {
                                marginLeft: '13px'

                            },

                            enableKeyEvents: true,
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        pd_top_form.find("name", "Mobile")[0].focus(false, 100);
                                    }
                                }
                            }
                        }, {
                            xtype: "label",
                            html: '手机号码：',
                            style: {
                                marginTop: '3px',
                                marginLeft: '25px'
                            }

                        }, {
                            xtype: "textfield",
                            readOnly: false,
                            width: 128,
                            style: {
                                marginLeft: '25px'
                            },
                            regex: /^1[3|4|5|7|8]\d{9}$/,
                            regexText: '请以正确的格式输入手机号码',
                            name: "Mobile",
                            anchor: "100%",
                            enableKeyEvents: true,
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        if (mobileFormateCheck()) {
                                            pd_top_form.find("name", "IdNo")[0].focus(false, 100);
                                        }
                                    }

                                },

                                'blur': function(_field, _e) {
                                    if (mobileFormateCheck()) {
                                    	
                                        oldVerify(pd_top_form.find("name", "Mobile")[0].getValue(), "IdNo","Mobile");

                                    }
                                    else{
                                    	pd_top_form.find("name", "Mobile")[0].focus(false, 100);	
                                    }

                                }

                               
                            }
                        }, {
                            xtype: "label",
                            html: '身份证号码：',
                            style: {
                                marginTop: '3px',
                                marginLeft: '35px'

                            }
                        }, {
                            xtype: "textfield",
                            name: "IdNo",

                            width: 180,
                            regex: /^(\d{18,18}|\d{15,15}|\d{17,17}(x|X))$/,
                            regexText: '请以正确的格式输入身份证号码',
                            style: {
                                marginLeft: '35px'

                            },
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        pd_top_form.find("name", "SecretPassword")[0].focus(false, 100);
                                    }



                                },

                                'blur': function(_field, _e) {
                                    if (checkIdcard()) {
                                        oldVerify(pd_top_form.find("name", "IdNo")[0].getValue(), "SecretPassword","IdNo");
                                    }
                                    else{
                                    	pd_top_form.find("name", "IdNo")[0].focus(false, 100);	
                                    }

                                }

                            }
                        }, {
                            xtype: "button",
                            boxMinWidth: 40,
                            style: "margin-left:20px;margin-Top:-25;",
                            width: 60,
                            style: {
                                marginLeft: '38px'

                            },
                            id: "btnSave",
                            text: " 保  存",
                            handler: function() {
                                save();
                            }
                        }

                    ]
                }, {
                    columnWidth: 1,
                    layout: 'hbox',
                    style: {
                        marginTop: '5px'
                    },
                    items: [{
                            xtype: "label",
                            html: '消费密码：',
                            style: {
                                marginTop: '3px'

                            }
                        }, {
                            xtype: "textfield",
                            name: "SecretPassword",
                            width: 128,
                            inputType: 'password',
                            style: {
                                marginLeft: '4px'

                            },
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        pd_top_form.find("name", "ConfirmPassword")[0].focus(false, 100);
                                    }

                                },

                            }
                        }, {
                            xtype: "label",
                            html: '确认密码：',
                            style: {
                                marginTop: '3px',
                                marginLeft: '25px'
                            }
                        }, {
                            xtype: "textfield",
                            name: "ConfirmPassword",
                            width: 128,
                            inputType: 'password',
                            style: {
                                marginLeft: '35px'

                            },
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        save();
                                    }

                                },

                            }
                        }


                    ]

                }

            ]

        }


    ]
});



var pd_old_form = {
    xtype: "fieldset",
    title: "客户原始信息",
    //defaultType: 'textfield',
    defaults: {
        labelAlign: "right",
        width: 5
    },
    layout: "column",
    items: [{
            xtype: 'box',

            width: 70,
            height: 0,
            style: {
                marginRight: '15px'

            }

        }, {

            layout: "hbox",
            defaults: {
                margins: '3 20 10 0'
            },

            columnWidth: 1,
            items: [{
                xtype: "label",
                //html: '<font style="color:red;font-size:14px;font-weight:bold;">当前客户的认证信息已经存在，如要做更改请输入原始密码</font>',
                name: 'label_notice',
                style: {
                    marginTop: '0px',
                    marginButtom: '10px',
                    marginLeft: '4px',
                    fontSize: "14px",
                    color: 'red'
                }
            }]
        }, {
            layout: "hbox",
            defaults: {
                margins: '0 10 0 0'
            },

            columnWidth: 1,
            items: [{
                    xtype: "label",
                    html: '姓  名：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    readOnly: true,
                    width: 128,
                    name: "Title_old",
                    style: {
                        marginLeft: '13px',
                        background: "#FFFFC6"

                    }


                }, {
                    xtype: "label",
                    html: '手机号码：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    readOnly: true,
                    width: 128,

                    fieldLabel: 'field',
                    style: {
                        marginLeft: '25px',
                        background: "#FFFFC6"
                    },
                    name: "Mobile_old",
                    anchor: "100%",
                    value: "139"
                }, {
                    xtype: "label",
                    html: '身份证号码：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px',

                    }
                }, {
                    xtype: "textfield",
                    readOnly: true,
                    name: "IdNo_old",
                    width: 180,
                    style: {
                        marginLeft: '35px',
                        background: "#FFFFC6"

                    }
                }



            ]
        }, {
            columnWidth: 1,
            layout: 'hbox',
            style: {
                marginTop: '5px'
            },
            items: [{
                    xtype: "label",
                    html: '认证时间：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    readOnly: true,
                    name: "AuthenticateDate",
                    displayField: "Title",
                    width: 128,
                    style: {
                        marginLeft: '4px',
                        background: "#FFFFC6"

                    }
                }, {
                    xtype: "label",
                    html: '原始密码：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    name: "Password_old",
                    inputType: 'password',
                    width: 128,

                    style: {
                        marginLeft: '35px'

                    },
                    listeners: {
                        'specialkey': function(_field, _e) {
                            if (_e.getKey() == _e.ENTER) {
                                oldPwdVerify();
                            }

                        }

                    }

                }, {
                    xtype: "button",
                    boxMinWidth: 40,
                    style: "margin-left:20px;margin-Top:-25;",
                    width: 60,
                    style: {
                        marginLeft: '45px'

                    },
                    id: "btnOldPwdConfirm",
                    text: "确  定",
                    handler: function() {
                        oldPwdVerify();
                    }
                },
                {
                    xtype: "button",
                    boxMinWidth: 40,
                    style: "margin-left:20px;margin-Top:-25;",
                    width: 60,
                    style: {
                        marginLeft: '50px'

                    },
                    id: "btnReturn",
                    text: "返  回",
                    handler: function() {
                            pd_top_form.getForm().findField('Title_old').setValue("");
                            pd_top_form.getForm().findField('Mobile_old').setValue("");
                            pd_top_form.getForm().findField('IdNo_old').setValue("");
                            pd_top_form.getForm().findField('AuthenticateDate').setValue("");
                            pd_top_form.getForm().findField('Password_old').setValue("");
                            pd_top_form.get(0).setVisible(true);
                            pd_top_form.get(1).setVisible(false);
                            if(typeof(crtCtr)!="undefined"){
                                pd_top_form.find("name", crtCtr)[0].setValue("");    
                                pd_top_form.find("name", crtCtr)[0].focus(false, 100);    
                            }
                            verifying = false;
                    }
                }

            ]

        }

    ]

};









//主容器

var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 130,
        layout: "fit",
        autoHeight: false,
        border: false,
        items: [pd_top_form]
    }, {
        layout: "fit",
        region: 'center',
        border: false,
        anchor: '-1 -140',
        items: []
    }]
});

centerPanel.add(pd_main_panel);
centerPanel.doLayout();

var cust = {};
var els = pd_main_panel.get(0);
var focusCtr = {};
var crtCtr ={};
var Ctr = {};
var verifying = false;

pd_top_form.add(pd_old_form);
pd_top_form.get(1).setVisible(false);
pd_top_form.doLayout();
pd_top_form.find("name", "Title")[0].focus(false, 100);



function oldVerify(val, nextCtrl,triggerCtr) {
	if(verifying) return ;

    cust = cust || {};
    focusCtr = nextCtrl;
    crtCtr = triggerCtr;
    var field = val.length == 11 ? "Mobile" : "IdNo";
    if (val == cust[field]) {
       // pd_top_form.find("name", nextCtrl)[0].focus(false, 100);
        return;
    }


    Ext.Ajax.request({
        url: '../Apis/CustomerAuthen.aspx?actionName=getAuthenCustomerInfo&sid=' + Sys.sid,
        params: {
            value: val
        },
        success: function(response, option) {
            var rs = Ext.decode(response.responseText) || {};

            if (typeof(rs.CustomerID) != "undefined") {
                pd_top_form.getForm().findField('Title_old').setValue(rs["Title"]);
                pd_top_form.getForm().findField('Mobile_old').setValue(rs["Mobile"]);
                pd_top_form.getForm().findField('IdNo_old').setValue(rs["IdNo"]);
                pd_top_form.getForm().findField('AuthenticateDate').setValue(rs["AuthenticateDate"]);
                pd_top_form.get(0).setVisible(false);
                pd_top_form.get(1).setVisible(true);

                pd_top_form.find("name", "Password_old")[0].focus(false, 100);
                var els = pd_top_form.find("name", "label_notice")[0];
                if (val.length == 11) {
                    els.setText('手机号码【' + val + '】的认证信息已经存在，如要做修改请先输入原始密码！');
                } else {
                    els.setText('身份证号码【' + val + '】的认证信息已经存在，如要做修改请先输入原始密码！');

                }
                //els.setText('');
                pd_top_form.doLayout();
                cust["Password"] = rs["Password"];
                verifying = true;
            } else if (val != "") {
                //pd_top_form.find("name", nextCtrl)[0].focus(false, 100);
            }

        }

    });




}

function oldPwdVerify() {

    cust = cust || {};
    var oldPwd = cust["Password"] || "";
    if (pd_top_form.find("name", "Password_old")[0].getValue() == oldPwd) {
        
        var title = pd_top_form.find("name", "Title")[0].getValue();;
        var mobile = pd_top_form.find("name", "Mobile")[0].getValue();;
        var idno = pd_top_form.find("name", "IdNo")[0].getValue();
        var password = pd_top_form.find("name", "SecretPassword")[0].getValue();
        
        if(title==""){
        	pd_top_form.getForm().findField('Title').setValue(pd_top_form.find("name", "Title_old")[0].getValue());
        }

        if(password==""){
        	pd_top_form.getForm().findField('SecretPassword').setValue(pd_top_form.find("name", "Password_old")[0].getValue());
        	pd_top_form.getForm().findField('ConfirmPassword').setValue(pd_top_form.find("name", "Password_old")[0].getValue());
        }
        if(mobile!=""){
        	 cust["Mobile"] =mobile;
        }
        else{
        	pd_top_form.getForm().findField('Mobile').setValue(pd_top_form.find("name", "Mobile_old")[0].getValue());
            cust["Mobile"] =pd_top_form.find("name", "Mobile_old")[0].getValue();
        }

        if(idno!=""){
        	 cust["IdNo"] =idno;
        }
        else{
        	pd_top_form.getForm().findField('IdNo').setValue(pd_top_form.find("name", "IdNo_old")[0].getValue());
            cust["IdNo"] =pd_top_form.find("name", "IdNo_old")[0].getValue();
        }

        pd_top_form.getForm().findField('Title_old').setValue("");
        pd_top_form.getForm().findField('Mobile_old').setValue("");
        pd_top_form.getForm().findField('IdNo_old').setValue("");
        pd_top_form.getForm().findField('AuthenticateDate').setValue("");
        pd_top_form.getForm().findField('Password_old').setValue("");

        pd_top_form.get(0).setVisible(true);
        pd_top_form.get(1).setVisible(false);
        pd_top_form.find("name", focusCtr)[0].focus(false, 100);
        verifying = false;
        return true;
    }
    Ext.MessageBox.alert("提示", '原始密码输入不正确');
    pd_top_form.find("name", "Password_old")[0].focus(false, 100);
    return false;
}

function mobileFormateCheck() {

    var mobile = pd_top_form.find("name", "Mobile")[0].getValue();
    var reg = /^1[3|4|5|7|8]\d{9}$/;
    if (mobile != null && mobile != "" && !reg.test(mobile)) {
        pd_top_form.find("name", "Mobile")[0].focus(false, 100);
        return false;
    }
    return true;
}

function save() {
    if (pd_top_form.form.isValid()) {
        var name = pd_top_form.find("name", "Title")[0].getValue();
        var mobile = pd_top_form.find("name", "Mobile")[0].getValue();
        var idno = pd_top_form.find("name", "IdNo")[0].getValue();
        var password = pd_top_form.find("name", "SecretPassword")[0].getValue();
        var passconfirm = pd_top_form.find("name", "ConfirmPassword")[0].getValue();
        if (name == "") {

            pd_top_form.find("name", "Title")[0].focus(false, 100);
            Ext.MessageBox.alert("提示", '请填写姓名');
            return;
        }
        if (mobile == "") {
            Ext.MessageBox.alert("提示", '请填写手机号码');
            pd_top_form.find("name", "Mobile")[0].focus(false, 100);
            return;
        }
        if (idno == "") {
            Ext.MessageBox.alert("提示", '请填写身份证号码');
            pd_top_form.find("name", "IdNo")[0].focus(false, 100);
            return;
        }
        if (password == "") {
            Ext.MessageBox.alert("提示", '请填写消费密码');
            pd_top_form.find("name", "SecretPassword")[0].focus(false, 100);
            return;
        } else if (password.length < 6) {
            Ext.MessageBox.alert("提示", '密码长度不得低于6位');
            pd_top_form.find("name", "SecretPassword")[0].focus(false, 100);
            return;
        }

        if (password != passconfirm) {
            Ext.MessageBox.alert("提示", '两次密码输入不一致');
            pd_top_form.find("name", "ConfirmPassword")[0].focus(false, 100);
            return;
        }
        cust = cust||{};
        var customerId = cust["CustomerID"]||"";
        Ext.Ajax.request({
            url: '../Apis/CustomerAuthen.aspx?actionName=saveAuthenCustomer&sid=' + Sys.sid,
            params: {
                title:name,
                mobile:mobile,
                idno:idno,
                password:password
            },
            success: function(response, option) {
                var rs = Ext.decode(response.responseText) || {};
                if (rs.success == true) {
                	Ext.MessageBox.alert("提示", '保存成功！');
            	    pd_top_form.getForm().findField('Title').setValue("");
			        pd_top_form.getForm().findField('Mobile').setValue("");
			        pd_top_form.getForm().findField('IdNo').setValue("");
			        pd_top_form.getForm().findField('SecretPassword').setValue("");
			        pd_top_form.getForm().findField('ConfirmPassword').setValue("");
			        cust = {};
                    pd_top_form.find("name", "Title")[0].focus(false, 100);
                } else {
                    Ext.MessageBox.alert("提示", '保存失败请重试！');
                }

            }

        });


    }
}

function checkIdcard() {

    var num = pd_top_form.getForm().findField('IdNo').getValue();
    if (num == "")
        return true;
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        Ext.MessageBox.alert("提示", '输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        //        pd_top_form.getForm().findField('IdNo').focus();
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len,
        re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            Ext.MessageBox.alert("提示", '输入的身份证号里出生日期不对！');
            //              pd_top_form.getForm().findField('IdNo').focus();
            return false;
        } else {
            //将15位身份证转成18位
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            //                pd_top_form.getForm().findField('IdNo').focus();
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            Ext.MessageBox.alert("提示", '输入的身份证号里出生日期不对！');
            //            pd_top_form.getForm().findField('IdNo').focus();
            return false;
        } else {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                Ext.MessageBox.alert("提示", '18位身份证的校验码不正确！应该为：' + valnum);
                //            pd_top_form.getForm().findField('IdNo').focus();
                return false;
            }

            return true;

        }
    }
    return false;
}
