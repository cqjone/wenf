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
            title: "用户认证",
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
                    height: 27,
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
                            html: '手机/身份证号码：',
                            style: {
                                marginTop: '3px'

                            }
                        }, {
                            xtype: "textfield",
                            width: 150,
                            name: "key",
                            regex: /^1[3|4|5|7|8]\d{9}$|^(\d{18,18}|\d{15,15}|\d{17,17}(x|X))$/,
                            regexText: '请以正确的格式输入手机号码或身份证号码',
                            style: {
                                marginLeft: '3px'

                            },
                            enableKeyEvents: true,
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        if (vaildateKeyFormat(pd_top_form.find("name", "key")[0].getValue())) {
                                            verifyCustomer("SecretPassword");
                                            //pd_top_form.find("name", "SecretPassword")[0].focus(false, 100);
                                        } else {
                                            pd_top_form.find("name", "key")[0].focus(false, 100);
                                        }

                                    }
                                },
                                change: function(field, newValue, oldValue) {

                                    pd_top_form.getForm().findField('CardNo').setDisabled(true);
                                    pd_top_form.getForm().findField('IdNo').setDisabled(true);
                                    pd_top_form.getForm().findField('CardPwd').setDisabled(true);
                                    pd_top_form.getForm().findField('Title').setDisabled(true);
                                    pd_top_form.getForm().findField('Mobile').setDisabled(true);
                                    pd_top_form.getForm().findField('CardType').setDisabled(true);
                                    pd_top_form.getForm().findField('CardPwd').setDisabled(true);
                                    pd_top_form.getForm().findField('SecretPassword').setValue("");

                                    pd_top_form.getForm().findField('CardNo').setValue("");
                                    pd_top_form.getForm().findField('CardPwd').setValue("");
                                    pd_top_form.getForm().findField('Title').setValue("");
                                    pd_top_form.getForm().findField('Mobile').setValue("");
                                    pd_top_form.getForm().findField('IdNo').setValue("");
                                    pd_top_form.getForm().findField('CardType').setValue("");

                                    
                                    Ext.getCmp('btnSave').setDisabled(true);
                                    pd_store.removeAll()
                                }

                            }
                        }, {
                            xtype: "textfield",
                            name: "CustomerName",
                            width: 100,
                            readOnly: true,
                            style: {
                                marginLeft: '0px',
                                background: "#FFFFC6"
                            },
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        passwordVerify();
                                    }

                                }

                            }
                        }, {
                            xtype: "label",
                            html: '消费密码：',
                            style: {
                                marginTop: '3px',
                                marginLeft: '52px'

                            }
                        }, {
                            xtype: "textfield",
                            name: "SecretPassword",
                            inputType: 'password',
                            width: 128,
                            style: {
                                marginLeft: '54px'

                            },
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        passwordVerify();
                                    }

                                }

                            }
                        }, {
                            xtype: "button",
                            boxMinWidth: 40,
                            style: "margin-left:20px;margin-Top:-25;",
                            width: 60,
                            style: {
                                marginLeft: '95px'

                            },
                            id: "btnPasswrdVerify",
                            text: " 确  定",
                            handler: function() {
                                passwordVerify();
                            }
                        }

                    ]
                }

            ]

        }, {
            xtype: "fieldset",
            title: "添加会员卡绑定",
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
                            html: '卡  号：',
                            style: {
                                marginTop: '3px'

                            }
                        }, {
                            xtype: "textfield",
                            width: 128,
                            disabled: true,
                            background: "#FFFFC6",
                            name: "CardNo",
                            style: {
                                marginLeft: '4px'

                            },

                            enableKeyEvents: true,
                            listeners: {
                                'specialkey': function(_field, _e) {
                                    if (_e.getKey() == _e.ENTER) {
                                        var cardNo = pd_top_form.find("name", "CardNo")[0].getValue();
                                        if (cardNo == "") {
                                            Ext.MessageBox.alert("提示", '请输入卡号！');
                                        }
                                        verifyCardNo("CardPwd");
                                        /*if (verifyCardNo()) {
                                            pd_top_form.find("name", "CardPwd")[0].focus(false, 100);
                                        } else {
                                            Ext.MessageBox.alert("提示", '卡号' + cardNo + '不存在！');
                                            pd_top_form.find("name", "CardNo")[0].focus(false, 100);
                                        }*/
                                    }
                                }
                            }
                        }, {
                            xtype: "label",
                            html: '卡密码：',
                            style: {
                                marginTop: '3px',
                                marginLeft: '25px'
                            }

                        }, {
                            xtype: "textfield",
                            width: 128,
                            disabled: true,
                            inputType: 'password',
                            style: {
                                marginLeft: '25px'
                            },
                            name: "CardPwd",
                            anchor: "100%",
                            enableKeyEvents: true,
                            listeners: {
                                'specialkey': function(_field, _e) {

                                    if (_e.getKey() == _e.ENTER) {
                                        addCardBinding();
                                    }
                                }



                            }
                        }, {
                            xtype: "label",
                            html: '卡类型：',
                            style: {
                                marginTop: '3px',
                                marginLeft: '60px'

                            }
                        }, {
                            xtype: "textfield",
                            width: 128,
                            readOnly: true,
                            disabled: true,
                            name: "CardType",
                            style: {
                                marginLeft: '4px',
                                marginLeft: '61px',
                                background: "#FFFFC6",

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
                            xtype: "button",
                            boxMinWidth: 40,
                            style: "margin-left:20px;margin-Top:-25;",
                            width: 60,
                            style: {
                                marginLeft: '101px'

                            },
                            disabled: true,
                            id: "btnSave",
                            text: "添  加",
                            handler: function() {
                                addCardBinding();
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
                            html: '姓  名：',

                            style: {
                                marginTop: '3px'

                            }
                        }, {
                            xtype: "textfield",
                            name: "Title",
                            readOnly: true,
                            disabled: true,
                            width: 128,

                            style: {
                                marginLeft: '14px',
                                background: "#FFFFC6"

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
                            html: '手机号码：',

                            style: {
                                marginTop: '3px',
                                marginLeft: '35px'
                            }
                        }, {
                            xtype: "textfield",
                            name: "Mobile",
                            width: 128,
                            readOnly: true,
                            disabled: true,
                            style: {
                                marginLeft: '44px',
                                background: "#FFFFC6"

                            }
                        }, {
                            xtype: "label",
                            html: '身份证号码：',

                            style: {
                                marginTop: '3px',
                                marginLeft: '67px'
                            }
                        }, {
                            xtype: "textfield",
                            name: "IdNo",
                            width: 150,
                            readOnly: true,
                            disabled: true,
                            style: {
                                marginLeft: '78px',
                                background: "#FFFFC6"

                            }
                        }


                    ]

                }


            ]

        }


    ]
});



//form








//保存所有选择的ID和名称
var ids = ",";
var titles = "";





//定义列
var cm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false,
        menuDisabled: true,
        multiSelect: true
    },

    columns: [new Ext.grid.RowNumberer(), {
        header: 'ID',
        dataIndex: 'ID',
        ID: "ID",
        hidden: true,
        width: 100
    }, {
        header: '<center>卡号</center>',
        dataIndex: 'Code',
        width: 250,
        align: 'left'
    }, {
        header: "<center>卡类型</center>",
        dataIndex: "CardType",
        width: 250,
        align: 'left'
    }, {
        header: "<center>开卡门店</center>",
        dataIndex: "DeptName",
        width: 210,
        align: 'center'
    }, {
        //删除按钮
        header: "<center>操作</center>",
        dataIndex: "button",
        width: 100,
        align: 'center',
        renderer: showbuttonDele

    }]
});

function showbuttonDele(value, metadata, record, rowIndex, columnIndex, store) {
    window.DelInfo = function(rowIndex) {
        var selections = pd_grid.selModel.getSelections();
        var s = pd_grid.getSelectionModel().getSelected().get("ID");
        debugger;
        Ext.Msg.confirm('提示', '确定解除绑定？', function(btn) {
            if (btn == 'yes') {
                Ext.each(selections, function(item) {
                    var delID = s;
                    Ext.Ajax.request({
                        params: {
                            id: delID
                        },
                        url: '../Apis/CardAuthen.aspx?actionName=unBingdingCard&sid=' + Sys.sid,
                        success: function(form, action) {
                            pd_store.reload({
                                params: {
                                    customerId: cust["ID"]
                                }
                            });
                        }
                        
                    });

                });
            }
        });
    };


    var resultStr = "<a href='#' onclick='DelInfo(" + rowIndex + ")'>解除绑定</a> ";
    return resultStr;
}

var pd_store = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CardAuthen.aspx?actionName=getAuthenCardList&sid=' + Sys.sid,
    autoLoad: false,
    reader: new Ext.data.JsonReader({
        //record: 'plant',
        //root: 'msg',
        //totalProperty: 'results',
        fields: [{
            name: "ID",
            mapping: "ID"
        }, {
            name: "Code",
            mapping: "Code"
        }, {
            name: "CardType",
            mapping: "CardType"
        }, {
            name: "DeptName",
            mapping: "DeptName"
        }]
    }),
});

var defaultShow = function() {
    var curDate = new Date();
    var mydate = Ext.Date.format(curDate, 'Y-m-d');
    pd_top_form.find("name", "date")[0].setValue(mydate);
}
var pd_grid = new Ext.grid.GridPanel({
    store: pd_store,
    cm: cm,
    stripeRows: true,
    //frame: true,
    margins: "2 2 2 2",
    border: false,
    selModel: new Ext.grid.RowSelectionModel({
        singleSelect: false
    }), //设置单行选中模式, 否则将无法删除数据
    //sm: sm,
    loadMask: true
});
//pd_store.load();



var pd_main_panel = new Ext.Panel({
    border: false,
    layout: "border",
    items: [{
        frame: true,
        region: 'north',
        height: 190,
        layout: "fit",
        autoHeight: false,
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

var cust;
var card;
centerPanel.add(pd_main_panel);
centerPanel.doLayout();
pd_top_form.find("name", "key")[0].focus(false, 100);

function vaildateKeyFormat() {
    var key = pd_top_form.find("name", "key")[0].getValue();

    if (key.length == 11) {
        return mobileFormateCheck(key);
    } else if (key.length == 15 || key.length == 18) {
        return checkIdcard(key);
    } else {
        Ext.MessageBox.alert("提示", '请输入正确格式的手机号码/身份证号码！');
        return false;
    }
    return true;
}

function mobileFormateCheck(mobile) {


    var reg = /^1[3|4|5|7|8]\d{9}$/;
    if (mobile != null && mobile != "" && !reg.test(mobile)) {
        Ext.MessageBox.alert("提示", '请输入正确格式的手机号码！');
        return false;
    }
    return true;
}

function passwordVerify() {


    if (!vaildateKeyFormat()) {
        pd_top_form.find("name", "key")[0].focus(false, 100);
        return;
    }
    var key = pd_top_form.getForm().findField('key').getValue();
    var password = pd_top_form.getForm().findField('SecretPassword').getValue();
    if (password == "") {
        Ext.MessageBox.alert("提示", '请输入消费密码');
        pd_top_form.find("name", "SecretPassword")[0].focus(false, 100);
        return false;
    }


    Ext.Ajax.request({
        url: '../Apis/CustomerAuthen.aspx?actionName=passwordVerify&sid=' + Sys.sid,
        params: {
            key: key,
            password: password
        },
        success: function(response, option) {
            var rs = Ext.decode(response.responseText) || {};
            cust = cust || {};
            cust["ID"] = "";

            if (rs.success == true) {
                var msg = rs["msg"] || "";
                if (msg == -1) {
                    var entity = key.length == 11 ? "手机" : "身份证";
                    pd_top_form.getForm().findField('CustomerName').setValue("");
                    Ext.MessageBox.alert("提示", "当前" + entity + '号码【' + key + '】尚未认证！');
                    pd_top_form.find("name", "key")[0].focus(false, 100);

                } else if (msg == -2) {
                    Ext.MessageBox.alert("提示", '消费密码不正确');
                } else if (msg == 1) {
                    pd_top_form.getForm().findField('CardNo').setDisabled(false);
                    pd_top_form.getForm().findField('IdNo').setDisabled(false);
                    pd_top_form.getForm().findField('CardPwd').setDisabled(false);
                    pd_top_form.getForm().findField('Title').setDisabled(false);
                    pd_top_form.getForm().findField('Mobile').setDisabled(false);
                    pd_top_form.getForm().findField('CardType').setDisabled(false);
                    pd_top_form.getForm().findField('CardPwd').setDisabled(false);
                    pd_top_form.getForm().findField('CardNo').focus(false, 100);
                    cust["ID"] = rs["ID"] || "";
                    pd_store.reload({
                        params: {
                            customerId: rs["ID"]
                        }
                    });
                }
            }

        }

    });


}

function verifyCustomer(nextCtr) {
    var key = pd_top_form.getForm().findField('key').getValue();
    Ext.Ajax.request({
        url: '../Apis/CustomerAuthen.aspx?actionName=getAuthenCustomerInfo&sid=' + Sys.sid,
        async: false,
        params: {
            value: key
        },
        success: function(response, option) {
            var rs = Ext.decode(response.responseText) || {};
            var customerId = rs["CustomerID"] || "";
            if (customerId != "") {
                pd_top_form.find("name", "CustomerName")[0].setValue(rs["Title"]);
                if (typeof(nextCtr) != "undefined") {
                    pd_top_form.find("name", nextCtr)[0].focus(false, 100);
                }
            } else {
                pd_top_form.getForm().findField('CustomerName').setValue("");
                var entity = key.length == 11 ? "手机" : "身份证";
                Ext.MessageBox.alert("提示", "当前" + entity + '号码【' + key + '】尚未认证！');
                pd_top_form.find("name", "key")[0].focus(false, 100);
            }

        }

    });
}

function verifyCardNo(nextCtr) {
    var cardno = pd_top_form.getForm().findField('CardNo').getValue();
    Ext.Ajax.request({
        url: '../Apis/CardAuthen.aspx?actionName=getCardInfo&sid=' + Sys.sid,
        async: false,
        params: {
            cardno: cardno
        },
        success: function(response, option) {
            var rs = Ext.decode(response.responseText) || {};

            var msg = rs["msg"] || "";
            if (msg != "") {
                pd_top_form.getForm().findField('Title').setValue(msg["CustomerName"]);
                pd_top_form.getForm().findField('Mobile').setValue(msg["Mobile"]);
                pd_top_form.getForm().findField('IdNo').setValue(msg["IdNo"]);
                pd_top_form.getForm().findField('CardType').setValue(msg["CardType"]);
                if (typeof(nextCtr) != "undefined") {
                    pd_top_form.find("name", nextCtr)[0].focus(false, 100);
                }
                Ext.getCmp('btnSave').setDisabled(false);
            } else {
                pd_top_form.getForm().findField('Title').setValue("");
                pd_top_form.getForm().findField('Mobile').setValue("");
                pd_top_form.getForm().findField('IdNo').setValue("");
                pd_top_form.getForm().findField('CardType').setValue("");
                Ext.MessageBox.alert("提示", '卡号' + cardno + '不存在！');
                pd_top_form.find("name", "CardNo")[0].focus(false, 100);
                Ext.getCmp('btnSave').setDisabled(true);
            }

        }

    });
}

//function cardPwdVerify() {

function addCardBinding() {
    card = {};
    var key = pd_top_form.getForm().findField('key').getValue();
    var cardno = pd_top_form.getForm().findField('CardNo').getValue();
    var password = pd_top_form.getForm().findField('CardPwd').getValue();
    if (cardno == "") {
        Ext.MessageBox.alert("提示", '请输入卡号');
        pd_top_form.find("name", "CardNo")[0].focus(false, 100);
        return false;
    }

    if (password == "") {
        Ext.MessageBox.alert("提示", '请输入卡密码');
        pd_top_form.find("name", "CardPwd")[0].focus(false, 100);
        return false;
    }


    Ext.Ajax.request({
        url: '../Apis/CardAuthen.aspx?actionName=bingdingCard&sid=' + Sys.sid,
        params: {
            cardno: cardno,
            password: password,
            key: key
        },
        success: function(response, option) {
            var rs = Ext.decode(response.responseText) || {};
            if (rs.success == true) {
                var msg = rs["msg"] || "";
                if (msg == -1) {
                    Ext.MessageBox.alert("提示", '卡号【' + key + '】不存在！');
                } else if (msg == -2) {
                    Ext.MessageBox.alert("提示", '卡密码不正确');
                } else if (msg == 1) {
                     pd_top_form.getForm().findField('CardNo').setValue("");
                     pd_top_form.getForm().findField('CardPwd').setValue("");
                     pd_top_form.getForm().findField('Title').setValue("");
                     pd_top_form.getForm().findField('Mobile').setValue("");
                     pd_top_form.getForm().findField('IdNo').setValue("");
                     pd_top_form.getForm().findField('CardType').setValue("");
                     pd_top_form.find("name", "CardNo")[0].focus(false, 100);
                    pd_store.reload({
                        params: {
                            customerId: cust["ID"]
                        }
                    });
                }

            }

        }

    });





}




function checkIdcard(num) {

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
