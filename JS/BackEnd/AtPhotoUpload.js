Ext.onReady(function() {
    Ext.QuickTips.init();

});

//门店信息下拉框
var tar_dept = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/CashierSetting.aspx?actionName=getDept&type=1&sid=' + Sys.sid,
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

var tar_duty = new Ext.data.Store({
    autoDestroy: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getDuty&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "Title",
            mapping: "Title"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'Title',
        direction: 'ASC'
    }
});


var CoatSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["150/76A", "150/76A"],
        ["150/78B", "150/78B"],
        ["155/80A", "155/80A"],
        ["155/82B", "155/82B"],
        ["160/84A", "160/84A"],
        ["160/86B", "160/86B"],
        ["165/88A", "165/88A"],
        ["165/88B", "165/88B"],
        ["165/90B", "165/90B"],
        ["170/92A", "170/92A"],
        ["170/92B", "170/92B"],
        ["170/94B", "170/94B"],
        ["175/96A", "175/96A"],
        ["175/96B", "175/96B"],
        ["180/100A", "180/100A"],
        ["180/100B", "180/100B"],
        ["185/104A", "185/104A"],
        ["185/104B", "185/104B"],
        ["190/108A", "190/108A"],
        ["190/108B", "190/108B"]
    ]
});
var ShirtSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["34#", "34#"],
        ["35#", "35#"],
        ["36#", "36#"],
        ["37#", "37#"],
        ["38#", "38#"],
        ["39#", "39#"],
        ["40#", "40#"],
        ["41#", "41#"],
        ["42#", "42#"],
        ["43#", "43#"]
    ]
});

var RankStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"]
    ]

});

var MmStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["中共党员", "中共党员"],
        ["中共预备党员", "中共预备党员"],
        ["共青团员", "共青团员"],
        ["民革党员", "民革党员"],
        ["民盟盟员", "民盟盟员"],
        ["民建会员", "民建会员"],
        ["民进会员", "民进会员"],
        ["农工党党员", "农工党党员"],
        ["致公党党员", "致公党党员"],
        ["九三学社社员", "九三学社社员"],
        ["台盟盟员", "台盟盟员"],
        ["无党派人士", "无党派人士"],
        ["普通居民（群众）", "普通居民（群众）"],
        ["港澳同胞", "港澳同胞"],
        ["叛徒", "叛徒"],
        ["反革命分子", "反革命分子"],
        ["少先队员", "少先队员"]
    ]

});
var hyStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["未婚", "未婚"],
        ["已婚", "已婚"],
        ["离异", "离异"],
        ["丧偶", "丧偶"]
    ]

});
var SexStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["男", "男"],
        ["女", "女"]
    ]

});

var RankDuty = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", "无"],
        ["美发总管", "美发总管"],
        ["美发经理", "美发经理"],
        ["美发总助", "美发总助"],
        ["美发飞虎", "美发飞虎"],
        ["高研班", "高研班"],
        ["空降兵", "空降兵"],
        ["美容总管", "美容总管"],
        ["美容经理", "美容经理"],
        ["片区美容经理", "片区美容经理"],
        ["美容助教", "美容助教"],

        ["美容总助", "美容总助"],
        ["容飞虎", "副经理"],
        ["美发师", "美发师"],
        ["美容师", "美容师"],
        ["足疗", "足疗"],

        ["收银员", "收银员"],
        ["美发总监", "美发总监"],
        ["美容实习生", "美容实习生"],
        ["美容总管", "美容总管"],
        ["特种班", "特种班"],

        ["区域总管", "区域总管"],
        ["大区经理", "大区经理"],
        ["小区经理", "小区经理"],
        ["老板", "老板"]

    ]

});
var tar_duty = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getDuty&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "Title",
            mapping: "Title"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'Title',
        direction: 'ASC'
    }
});

var tar_dutyType = new Ext.data.Store({
    autoDestroy: true,
    autoLoad: true,
    url: '../Apis/BaseInfoUtil.aspx?actionName=getDutyType&sid=' + Sys.sid,
    reader: new Ext.data.JsonReader({
        fields: [{
            name: "Title",
            mapping: "Title"
        }, {
            name: "ID",
            mapping: "ID"
        }]
    }),
    sortInfo: {
        field: 'Title',
        direction: 'ASC'
    }
});

var TrousersSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["26#", "26#"],
        ["27#", "27#"],
        ["28#", "28#"],
        ["29#", "29#"],
        ["30#", "30#"],
        ["31#", "31#"],
        ["32#", "32#"],
        ["33#", "33#"],
        ["34#", "34#"],
        ["35#", "35#"],
        ["36#", "36#"],
        ["37#", "37#"],
        ["38#", "38#"],
        ["39#", "39#"]
    ]
});

var SkirtSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["XS-A", "XS-A"],
        ["S-A", "S-A"],
        ["M-A", "M-A"],
        ["L-A", "L-A"],
        ["XL-A", "XL-A"],
        ["XXL-A", "XXL-A"],
        ["XS-B", "XS-B"],
        ["S-B", "S-B"],
        ["M-B", "M-B"],
        ["L-B", "L-B"],
        ["XL-B", "XL-B"],
        ["XXL-B", "XXL-B"]
    ]
});

var ShoesSizeStore = new Ext.data.ArrayStore({
    fields: ['ID', 'Title'],
    data: [
        ["无", ""],
        ["22.0(34)", "22.0(34)"],
        ["22.5(35)", "22.5(35)"],
        ["23.0(36)", "23.0(36)"],
        ["23.5(37)", "23.5(37)"],
        ["24.0(38)", "24.0(38)"],
        ["24.5(39)", "24.5(39)"],
        ["25.0(40)", "25.0(40)"],
        ["25.5(41)", "25.5(41)"],
        ["26.0(42)", "26.0(42)"],
        ["26.5(43)", "26.5(43)"],
        ["27.0(44)", "27.0(44)"]
    ]
});

function checkIdcard() {
    var num = pd_top_form.getForm().findField('IdNo').getValue();
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
           /* if (valnum % 2 == 0) {
                var sex = pd_top_form.getForm().findField('Sex').getValue();
                if (sex != "男") {
                    Ext.MessageBox.alert("提示", "性别和身份证不符合!");
                    return false;
                }
            } else {
                var sex = pd_top_form.getForm().findField('Sex').getValue();
                if (sex != "女") {
                    Ext.MessageBox.alert("提示", "性别和身份证不符合!");
                    return false;
                }
            }*/
            return true;

        }
    }
    return false;
}

var pd_top_form = new Ext.form.FormPanel({
    //frame: true,
    bodyBorder: false,
    border: false,
    fileUpload: true,
    autoScroll: true,
    labelWidth: 40,
    labelAlign: 'right',
    //		heigh : 500,
    autoWidth: true,
    items: [{
        xtype: "fieldset",
        title: "",
        style: {
            marginLeft: '4px',
            marginTop: '10px'
        },
        items: [ //third

            {
                width: 100,
                style: {
                    marginTop: '-7px'
                },
                buttons: [{
                    id: "btnsearch",
                    text: "保 存",
                    listeners: {
                        click: function() {

                            VerifyAction();
                        }
                    }

                }]
            }
        ]
    }, {
        xtype: "fieldset",
        title: "员工基本信息表",
        //defaultType: 'textfield',
        defaults: {
            labelAlign: "right",
            width: 5
        },
        //bodyBorder:false,
        layout: "column",
        items: [
            //				{
            //						xtype : 'box',
            //						id : 'logoPicid',
            //						fieldLabel : '图片预览',
            //						width : 120,
            //						height : 168,
            //							style : {
            //									marginRight : '15px'

            //								},
            //						autoEl : {
            //							tag : 'img',
            //							width : 120,
            //							height : 168,
            //							id:"photo_area",
            //							src : '../Imgs/bg02.jpg',
            //							style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);'
            //						}

            //					},


            {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:320px;margin-bottom:30px;" ><font size="6">员工基本信息表</font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            },

            //								xtype : "label",
            //								html : '部门：',
            //								style : {
            //									marginTop : '3px',
            //									marginLeft : '55px'

            //								}
            //							}
            //							, {
            //								xtype : "textfield",
            //								readOnly : true,
            //								hideLabel : true,
            //								width:128,
            //								style : {
            //									marginLeft : '55px'
            //								},
            //								name : "Dept",
            //								anchor : "100%"
            //							},
            //							{
            //								xtype : "label",
            //								html : '性别：',
            //								style : {
            //									marginTop : '3px',
            //									marginLeft : '65px'

            //								}
            //							}
            //							, {
            //								xtype : "combo",
            //								name : "Sex",
            //								store : SexStore,
            //								displayField : "Title",
            //								valueField : "ID",
            //								editable : false,
            //								width : 60,
            //								triggerAction : 'all',
            //								mode : 'local',
            //								style : {
            //									marginLeft : '65px'

            //								}
            //							}
            {
                layout: "hbox",
                defaults: {
                    margins: '0 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '工  号：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "textfield",
                    width: 120,
                    name: "EmployeeCode",
                    //                            --------------------------------------------------------------------------------------------->
                    enableKeyEvents: true,
                    listeners: {
                        "keyup": function(v) {
                            if (Ext.util.Format.trim(v.getRawValue()).length == 8) {
                                var code = Ext.util.Format.trim(v.getRawValue());
                                pd_top_form.getForm().reset();
                                Ext.Ajax.request({
                                    url: '../Apis/EmpInfoMgr.aspx?actionName=getNewEmpName&sid=' + Sys.sid,
                                    params: {
                                        Code: code
                                    },
                                    success: function(response, option) {
                                        var rs = Ext.decode(response.responseText);
                                        if (rs.success) {
                                            if (rs.msg.length >= 0) {
                                                debugger;
                                                pd_top_form.getForm().findField('EmployeeCode').setValue(code);
                                                pd_top_form.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                                pd_top_form.getForm().findField('Marriage').setValue(rs.msg[0]["Marriage"]);
                                                //民族
                                                pd_top_form.getForm().findField('Nation').setValue(rs.msg[0]["Nation"]);
                                                //															政治面貌
                                                pd_top_form.getForm().findField('Politics').setValue(rs.msg[0]["Politics"]);
                                                //															贯籍
                                                pd_top_form.getForm().findField('Nvarchar1').setValue(rs.msg[0]["Nvarchar1"]);

                                                //															家庭电话
                                                pd_top_form.getForm().findField('FamilyPhone').setValue(rs.msg[0]["FamilyPhone"]);
                                                //                                                             家庭地址
                                                //pd_top_form.getForm().findField('FamilyAdress').setValue(rs.msg[0]["FamilyAdress"]);
                                                pd_top_form.getForm().findField('ConsortName').setValue(rs.msg[0]["ConsortName"]);
                                                pd_top_form.getForm().findField('ConsortPhone').setValue(rs.msg[0]["ConsortPhone"]);
                                                pd_top_form.getForm().findField('ConsortAddress').setValue(rs.msg[0]["ConsortAddress"]);
                                                pd_top_form.getForm().findField('ParentName').setValue(rs.msg[0]["ParentName"]);
                                                pd_top_form.getForm().findField('ParentPhone').setValue(rs.msg[0]["ParentPhone"]);
                                                pd_top_form.getForm().findField('ParentAddress').setValue(rs.msg[0]["ParentAddress"]);
                                                pd_top_form.getForm().findField('PersonalAddress').setValue(rs.msg[0]["PersonalAddress"]);
                                                pd_top_form.getForm().findField('KinName').setValue(rs.msg[0]["KinName"]);
                                                pd_top_form.getForm().findField('KinPhone').setValue(rs.msg[0]["KinPhone"]);
                                                pd_top_form.getForm().findField('KinAddress').setValue(rs.msg[0]["KinAddress"]);
                                                var edata = rs.msg[0]["HireDate"];
                                                if (edata != "") {
                                                    var ey = edata.split('-');
                                                    pd_top_form.getForm().findField('eyear').setValue(ey[0]);
                                                    pd_top_form.getForm().findField('emonth').setValue(ey[1]);
                                                }
                                                pd_top_form.getForm().findField('syear').setValue(rs.msg[0]["syear"]);
                                                pd_top_form.getForm().findField('smonth').setValue(rs.msg[0]["smonth"]);
                                                pd_top_form.getForm().findField('Height').setValue(rs.msg[0]["Height"]);
                                                pd_top_form.getForm().findField('Weight').setValue(rs.msg[0]["Weight"]);
                                                pd_top_form.getForm().findField('CoatSize').setValue(rs.msg[0]["CoatSize"]);
                                                pd_top_form.getForm().findField('TrousersSize').setValue(rs.msg[0]["TrousersSize"]);
                                                pd_top_form.getForm().findField('ShirtSize').setValue(rs.msg[0]["ShirtSize"]);
                                                pd_top_form.getForm().findField('SkirtSize').setValue(rs.msg[0]["SkirtSize"]);
                                                pd_top_form.getForm().findField('ShoesSize').setValue(rs.msg[0]["ShoesSize"]);
                                                pd_top_form.getForm().findField('CommCardNo').setValue(rs.msg[0]["CommCardNo"]);
                                                pd_top_form.getForm().findField('BocCardNo').setValue(rs.msg[0]["BocCardNo"]);
                                                pd_top_form.getForm().findField('CmbCardNo').setValue(rs.msg[0]["CmbCardNo"]);
                                                pd_top_form.getForm().findField('Sex').setValue(rs.msg[0]["Sex"]);
                                                //pd_top_form.getForm().findField('Duty').setValue(rs.msg[0]["Duty"]);
                                                //pd_top_form.getForm().findField('DutyID').setValue(rs.msg[0]["DutyID"]);
                                                pd_top_form.getForm().findField('Mobile').setValue(rs.msg[0]["Mobile"]);
                                                pd_top_form.getForm().findField('IdNo').setValue(rs.msg[0]["IdNo"]);
                                                pd_top_form.getForm().findField('Rank').setValue(rs.msg[0]["Rank"]);
                                                pd_top_form.getForm().findField('TrainPriod').setValue(rs.msg[0]["TrainPriod"]);

                                                //调动记录
                                                Ext.Ajax.request({
                                                    url: '../Apis/EmpInfoMgr.aspx?actionName=getNewDdData&sid=' + Sys.sid,
                                                    params: {
                                                        Code: code
                                                    },
                                                    success: function(response, option) {
                                                        var rs = Ext.decode(response.responseText);
                                                        if (rs.success) {
                                                            if (rs.msg.length >= 0) {


                                                                //													            pd_top_form.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                                                for (var i = 0; i < rs.msg.length; i++) {
                                                                    var y = i + 1;
                                                                    if (rs.msg[i]["JoinDate"] != null) {
                                                                        var rddata = rs.msg[i]["JoinDate"].split('-');
                                                                        pd_top_form.getForm().findField('rdy' + y).setValue(rddata[0]);
                                                                        pd_top_form.getForm().findField('rdm' + y).setValue(rddata[1]);
                                                                    }
                                                                    if (rs.msg[i]["LeaveDate"] != null) {
                                                                        var lddata = rs.msg[i]["LeaveDate"].split('-');
                                                                        pd_top_form.getForm().findField('ldy' + y).setValue(lddata[0]);
                                                                        pd_top_form.getForm().findField('ldm' + y).setValue(lddata[1]);
                                                                    }
                                                                    //													                       var bj=rs.msg[i]["zz"];
                                                                    var ID = rs.msg[i]["ID"];
                                                                    pd_top_form.getForm().findField('dd' + y).setValue(ID);
                                                                    /*if (rs.msg[i]["Title"] != null) {
																					pd_top_form.getForm().findField('DeptId' + y).setValue(rs.msg[i]["ID"]);
																					
																					pd_top_form.find("hiddenName", 'DeptId' + y)[0].setValue(rs.msg[i]["ID"]);
																					pd_top_form.getForm().findField('DeptId' + y).setText(rs.msg[i]["<Title></Title>"]);
																				}*/

                                                                    if (rs.msg[i]["Title"] != null) {
                                                                        pd_top_form.getForm().findField('DeptId' + y).setValue(rs.msg[i]["Title"]);
                                                                    }
                                                                    if (rs.msg[i]["Duty"] != null) {
                                                                        pd_top_form.getForm().findField('zz' + y).setValue(rs.msg[i]["Duty"]);
                                                                    }

                                                                }
                                                            }
                                                        }
                                                    },
                                                    failure: function() {
                                                        Ext.MessageBox.alert("提示", "获取入学记录异常!");
                                                        Ext.getCmp('btnsearch').setDisabled(true);
                                                    }

                                                });

                                                //培训期数
                                                Ext.Ajax.request({
                                                    url: '../Apis/EmpInfoMgr.aspx?actionName=getNewQsData&sid=' + Sys.sid,
                                                    params: {
                                                        Code: code
                                                    },
                                                    success: function(response, option) {
                                                        var rs = Ext.decode(response.responseText);
                                                        if (rs.success) {
                                                            if (rs.msg.length >= 0) {
                                                                debugger;
                                                                //													            pd_top_form.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                                                for (var i = 0; i < rs.msg.length; i++) {
                                                                    var y = i + 1;
                                                                    var Period = rs.msg[i]["Period"];
                                                                    var ID = rs.msg[i]["ID"];
                                                                    pd_top_form.getForm().findField('tx' + y).setValue(ID);
                                                                    pd_top_form.getForm().findField('px' + y).setValue(Period);
                                                                }
                                                            }
                                                        }
                                                    },
                                                    failure: function() {
                                                        Ext.MessageBox.alert("提示", "获取入学记录异常!");
                                                        Ext.getCmp('btnsearch').setDisabled(true);
                                                    }

                                                });

                                                //入学记录
                                                Ext.Ajax.request({
                                                    url: '../Apis/EmpInfoMgr.aspx?actionName=getNewRxData&sid=' + Sys.sid,
                                                    params: {
                                                        Code: code
                                                    },
                                                    success: function(response, option) {
                                                        var rs = Ext.decode(response.responseText);
                                                        if (rs.success) {
                                                            if (rs.msg.length >= 0) {
                                                                debugger;
                                                                //													            pd_top_form.getForm().findField('EmployeeName').setValue(rs.msg[0]["Title"]);
                                                                for (var i = 0; i < rs.msg.length; i++) {
                                                                    var y = i + 1;
                                                                    if (rs.msg[i]["JoinDate"] != null) {
                                                                        var rxdata = rs.msg[i]["JoinDate"].split('-');
                                                                        pd_top_form.getForm().findField('rxy' + y).setValue(rxdata[0]);
                                                                        pd_top_form.getForm().findField('rxm' + y).setValue(rxdata[1]);
                                                                    }
                                                                    if (rs.msg[i]["GraduateDate"] != null) {
                                                                        var bxdata = rs.msg[i]["GraduateDate"].split('-');
                                                                        pd_top_form.getForm().findField('bxy' + y).setValue(bxdata[0]);
                                                                        pd_top_form.getForm().findField('bxm' + y).setValue(bxdata[1]);
                                                                    }
                                                                    var bj = rs.msg[i]["ClassName"];
                                                                    var ID = rs.msg[i]["ID"];
                                                                    pd_top_form.getForm().findField('xx' + y).setValue(ID);
                                                                    pd_top_form.getForm().findField('bj' + y).setValue(bj);
                                                                }
                                                            }
                                                        }
                                                    },
                                                    failure: function() {
                                                        Ext.MessageBox.alert("提示", "获取入学记录异常!");
                                                        Ext.getCmp('btnsearch').setDisabled(true);
                                                    }

                                                });

                                                Ext.getCmp('btnsearch').setDisabled(false);
                                            } else {
                                                Ext.getCmp('btnsearch').setDisabled(true);
                                            }

                                        } else {
                                            Ext.MessageBox.alert("提示", rs.msg);
                                            Ext.getCmp('btnsearch').setDisabled(true);
                                        }
                                    },
                                    failure: function() {
                                        Ext.MessageBox.alert("提示", "获取员工姓名异常!");
                                        Ext.getCmp('btnsearch').setDisabled(true);
                                    }
                                });
                            } else {
                                //pd_top_form.getForm().findField('EmployeeName').setValue("");
                                Ext.getCmp('btnsearch').setDisabled(true);
                            }
                        }
                    }

                    //								---------------------------------------------------------------------------------------------------->


                }, {
                    xtype: "label",
                    html: '姓  名：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    //								readOnly : true,
                    hideLabel: true,
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "EmployeeName",
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>基本信息</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '0 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">性 别：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "Sex",
                    store: SexStore,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {}
                }, {
                    xtype: "label",
                    html: '<font color="red">贯 籍：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "Nvarchar1",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">婚 姻：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "Marriage",
                    store: hyStore,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {}
                }, {
                    xtype: "label",
                    html: '<font color="red">民 族：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '25px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "Nation",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">身份证号：</font>',
                    style: {
                        marginTop: '3px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "IdNo",
                    triggerAction: 'all',
                    mode: 'local',
                    regex: /^(\d{18,18}|\d{15,15}|\d{17,17}(x|X))$/,
                    //regex : /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/,
                    width: 270,
                    //								validator :checkIdcard,
                    listeners: {
                        blur: function() {
                            //在这里查数据
                            checkIdcard();
                        }
                    }
                    //								enableKeyEvents : true,
                    //								listeners : {
                    //									"keyup" : function (v) {
                    //									debugger;
                    //								            Ext.util.Format.trim(v.getRawValue());
                    //									}
                    //								}


                }, {
                    xtype: "label",
                    html: '<font color="red">政治面貌：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "Politics",
                    store: MmStore,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 125,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        marginLeft: '15px'
                    }
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>服装尺寸</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 10'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">身 高：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "numberfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    minValue: 90,
                    maxValue: 250,
                    width: 90,
                    name: "Height"
                }, {
                    xtype: "label",
                    html: '厘米',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'
                    }
                }, {
                    xtype: "label",
                    html: '<font color="red">体 重：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '10px'
                    }
                }, {
                    xtype: "numberfield",
                    minValue: 30,
                    maxValue: 150,
                    msgTarget: 'under',
                    allowBlank: false,
                    hideLabel: true,
                    width: 90,
                    style: {
                        //									marginLeft : '15px'
                    },
                    name: "Weight",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '公斤',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '西装尺寸：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "CoatSize",
                    store: CoatSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',

                    style: {}
                }, {
                    xtype: "label",
                    html: '衬衫尺寸：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "ShirtSize",
                    store: ShirtSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        marginLeft: '15px'

                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '裤子尺寸：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "TrousersSize",
                    store: TrousersSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        //									marginLeft : '55px'
                    }
                }, {
                    xtype: "label",
                    html: '裙子尺寸：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "combo",
                    msgTarget: 'under',
                    allowBlank: false,
                    name: "SkirtSize",
                    store: SkirtSizeStore,
                    displayField: "ID",
                    valueField: "Title",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',

                    style: {
                        marginLeft: '15px'

                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                        xtype: "label",
                        html: '鞋子尺寸：',
                        style: {
                            marginTop: '3px'

                        }
                    }, {
                        xtype: "combo",
                        msgTarget: 'under',
                        allowBlank: false,
                        name: "ShoesSize",
                        store: ShoesSizeStore,
                        displayField: "ID",
                        valueField: "Title",
                        editable: false,
                        width: 120,
                        triggerAction: 'all',
                        mode: 'local',
                        style: {
                            //									marginLeft : '10px'
                        },

                        anchor: "100%"
                    }

                ]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>联系方式</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">家庭电话：</font>',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    regex: /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/,
                    width: 120,
                    name: "FamilyPhone",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '<font color="red">手机号码：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    name: "Mobile",
                    triggerAction: 'all',
                    msgTarget: 'under',
                    allowBlank: false,
                    regex: /^[1]\d{10}$/,
                    mode: 'local',
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '<font color="red">现住地址：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    minLength: 5,
                    maxLength: 35,
                    allowBlank: false,
                    msgTarget: 'qtip',
                    blankText: '现在实际居住地址，例如：上海市普陀区绥德路650号1号楼8907室',
                    triggerAction: 'all',
                    mode: 'local',
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "PersonalAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '配偶姓名：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    width: 120,
                    name: "ConsortName",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '配偶电话：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    regex: /^\d+(-){0,1}\d+$/,
                    hideLabel: true,
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "ConsortPhone",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '配偶住址：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    minLength: 5,
                    maxLength: 35,
                    //								readOnly : true,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "ConsortAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">父母姓名：</font>',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',

                    allowBlank: true,
                    minlength: 2,
                    maxLength: 9,
                    width: 120,
                    name: "ParentName",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '<font color="red">父母电话：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: true,
                    regex: /^\d+(-){0,1}\d+$/,
                    hideLabel: true,
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "ParentPhone",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '<font color="red">父母地址：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    msgTarget: 'under',
                    allowBlank: true,
                    minLength: 5,
                    maxLength: 35,
                    //								readOnly : true,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "ParentAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">亲属姓名：</font>',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    blankText: '用于紧急联系，请正确填写',

                    msgTarget: 'under',
                    allowBlank: true,
                    width: 120,
                    name: "KinName",
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '<font color="red">亲属电话：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    maxLength: 20,
                    blankText: '用于紧急联系，请正确填写',
                    regex: /^\d+(-){0,1}\d+$/,
                    msgTarget: 'under',
                    allowBlank: true,
                    hideLabel: true,
                    width: 120,
                    style: {
                        marginLeft: '15px'
                    },
                    name: "KinPhone",
                    anchor: "100%"
                }, {
                    xtype: "label",
                    html: '<font color="red">亲属地址：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '35px'
                    }
                }, {
                    xtype: "textfield",
                    minLength: 5,
                    maxLength: 35,
                    msgTarget: 'under',
                    allowBlank: true,
                    //								readOnly : true,
                    hideLabel: true,
                    width: 270,
                    style: {
                        marginLeft: '35px'
                    },
                    name: "KinAddress",
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>银行卡号</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '交通银行：',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "textfield",
                    name: "CommCardNo",
                    triggerAction: 'all',
                    mode: 'local',
                    regex: /^\d{10,22}$/,
                    regexText: '银行卡号必须为10~22的位数字',
                    width: 270,
                    anchor: "100%"

                }, {
                    xtype: "label",
                    html: '中国银行：',
                    style: {
                        marginTop: '3px',
                        marginLeft: '15px'
                    }
                }, {
                    xtype: "textfield",
                    name: "BocCardNo",
                    triggerAction: 'all',
                    regex: /^\d{10,22}$/,
                    regexText: '银行卡号必须为10~22的位数字',
                    mode: 'local',
                    width: 270,
                    style: {
                        marginLeft: '15px'
                    },
                    anchor: "100%"
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '招商银行：',
                    style: {
                        marginTop: '3px'
                    }
                }, {
                    xtype: "textfield",
                    name: "CmbCardNo",
                    triggerAction: 'all',
                    regex: /^\d{10,22}$/,
                    regexText: '银行卡号必须为10~22的位数字',
                    mode: 'local',
                    width: 270,
                    anchor: "100%"
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>职业信息</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">星 级：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '56px'
                    }
                }, {
                    xtype: "combo",
                    name: "Rank",
                    store: RankStore,
                    msgTarget: 'under',
                    allowBlank: false,
                    displayField: "Title",
                    valueField: "ID",
                    editable: false,
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',
                    style: {
                        marginLeft: '56px'

                    }
                }, {
                    xtype: "label",
                    html: '<font color="red">最后特训期数：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '68px'
                    }
                }, {
                    xtype: "numberfield",
                    msgTarget: 'under',
                    allowBlank: false,
                    minValue: 1,
                    maxValue: 999,
                    name: "TrainPriod",
                    width: 120,
                    triggerAction: 'all',
                    mode: 'local',

                    style: {
                        marginLeft: '68px'

                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<font color="red">入文峰学校日期：</font>',
                    style: {
                        marginTop: '3px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "syear"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "smonth",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-40px'

                    }
                }, {
                    xtype: "label",
                    html: '<font color="red">入文峰门店日期：</font>',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-40px'
                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    msgTarget: 'under',
                    allowBlank: false,
                    width: 50,
                    name: "eyear",
                    style: {
                        marginLeft: '-40px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-55px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    msgTarget: 'under',
                    allowBlank: false,
                    width: 30,
                    name: "emonth",
                    style: {
                        marginLeft: '-70px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-80px'

                    }
                }]
            }, {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>学校记录</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<b>入学日期</b>',
                    style: {

                        marginLeft: '30px'
                    }
                }, {
                    xtype: "label",
                    html: '<b>毕业时间</b>',
                    style: {
                        marginLeft: '120px'
                    }
                }, {
                    xtype: "label",
                    html: '<b>班级</b>',
                    style: {
                        marginLeft: '195px'
                    }
                }]
            },

            //					1111111111111111111111111111111111111111111111111111111111111111111111

            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx1"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy1"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm1",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy1",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm1",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj1",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //					22222222222222222222222222222222222222222222222222222222222222
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx2"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy2"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm2",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy2",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm2",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj2",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							3333333333333333333333333333333333333333
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx3"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy3"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm3",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy3",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm3",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj3",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							444444444444444444444444444444444444444444444444444
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx4"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy4"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm4",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy4",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm4",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj4",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							555555555555555555555555555555555555555555555
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx5"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy5"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm5",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy5",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm5",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj5",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							6666666666666666666666666666666666666666666666
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx6"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy6"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm6",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy6",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm6",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj6",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							77777777777777777777777777777777777777777777777
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx7"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy7"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm7",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy7",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm7",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj7",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },

            //							888888888888888888888888888888888888888888888888
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "xx8"
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rxy8"

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rxm8",
                    style: {
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-45px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "bxy8",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "bxm8",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    name: "bj8",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							--------------------------------------------------------------------------------------

            {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>培训记录</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<b>特训期数</b>',
                    style: {

                        marginLeft: '30px'
                    }
                }]
            },

            //							1111111111111111111
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx1"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px1",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },

            //							22222222222222
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx2"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px2",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },

            //							333333333333333333
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx3"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px3",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							44444444444444444444
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx4"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px4",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							555555555555555555555555
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx5"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px5",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							666666666666666666666666

            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx6"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px6",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							7777777777777777777777777777
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx7"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px7",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							888888888888888888
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx8"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px8",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							99999999999999999999
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx9"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px9",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							10
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx10"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px10",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							11
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx11"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px11",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							12
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx12"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px12",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							13
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx13"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px13",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },
            //							14
            {
                layout: "hbox",
                defaults: {
                    margins: '2 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "tx14"
                }, {
                    xtype: "numberfield",
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 110,
                    name: "px14",
                    style: {
                        marginLeft: '10px'

                    }
                }]
            },

            //							-------------------------------------------------------------------------------------------------------------
            {
                layout: "form",
                defaults: {
                    margins: '0 10 0 0'
                },

                columnWidth: 1,
                items: [{
                    xtype: "label",
                    html: '<div style="margin-left:310px;margin-top:20px;margin-bottom:20px;"><font size="4"><b>调动记录</b></font></div>',
                    style: {
                        marginTop: '3px'
                    }
                }]
            }, {
                layout: "hbox",
                defaults: {
                    margins: '5 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd1"
                }, {
                    xtype: "label",
                    html: '<b>门店名称</b>',
                    style: {

                        marginLeft: '30px'
                    }
                }, {
                    xtype: "label",
                    html: '<b>入店日期</b>',
                    style: {
                        marginLeft: '120px'
                    }
                }, {
                    xtype: "label",
                    html: '<b>离店日期</b>',
                    style: {
                        marginLeft: '195px'
                    }
                }, {
                    xtype: "label",
                    html: '<b>职位</b>',
                    style: {
                        marginLeft: '265px'
                    }
                }]
            },

            //							111111111111111111111
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "textfield",
                        readOnly: true,
                        name: "DeptId1",
                        width: 110

                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy1",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm1",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy1",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm1",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    },


                    {
                        xtype: "textfield",
                        name: "zz1",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }
                ]
            },

            //							222222222222222222
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd2"
                }, {
                    xtype: "textfield",
                    name: "DeptId2",
                    width: 110

                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rdy2",
                    style: {
                        marginLeft: '15px'

                    }

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px'
                            //									marginLeft : '30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rdm2",
                    style: {
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "ldy2",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "ldm2",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    name: "zz2",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							3333333333333333333333333333333
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd3"
                }, {
                    xtype: "textfield",
                    name: "DeptId3",
                    width: 110

                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rdy3",
                    style: {
                        marginLeft: '15px'

                    }

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px'
                            //									marginLeft : '30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rdm3",
                    style: {
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "ldy3",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "ldm3",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    name: "zz3",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							444444444444444444444444444444444
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd4"
                    }, {
                        xtype: "textfield",
                        name: "DeptId4",
                        width: 110

                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy4",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm4",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy4",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm4",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        name: "zz4",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }

                ]
            },
            //							55555555555555555555555555
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                        xtype: "numberfield",
                        width: 50,
                        hidden: true,
                        name: "dd5"
                    }, {
                        xtype: "textfield",
                        name: "DeptId5",
                        width: 110

                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "rdy5",
                        style: {
                            marginLeft: '15px'

                        }

                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px'
                                //									marginLeft : '30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "rdm5",
                        style: {
                            marginLeft: '-15px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-30px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 2099,
                        minValue: 1990,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 50,
                        name: "ldy5",
                        style: {
                            marginLeft: '-20px'
                        }
                    }, {
                        xtype: "label",
                        html: '年',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-35px'

                        }
                    }, {
                        xtype: "numberfield",
                        maxValue: 12,
                        minValue: 1,
                        //								msgTarget: 'under',
                        //                                allowBlank: false,
                        width: 30,
                        name: "ldm5",
                        style: {
                            marginLeft: '-50px'

                        }
                    }, {
                        xtype: "label",
                        html: '月',
                        style: {
                            marginTop: '3px',
                            marginLeft: '-65px'

                        }
                    }, {
                        xtype: "textfield",
                        name: "zz5",
                        width: 80,
                        style: {
                            marginLeft: '-50px'

                        }
                    }

                ]
            },
            //							666666666666666666666666666
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd6"
                }, {
                    xtype: "textfield",
                    name: "DeptId6",
                    width: 110

                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rdy6",
                    style: {
                        marginLeft: '15px'

                    }

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px'
                            //									marginLeft : '30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rdm6",
                    style: {
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "ldy6",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "ldm6",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    name: "zz6",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							7777777777777777777777777777777777
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd7"
                }, {
                    xtype: "textfield",
                    name: "DeptId7",
                    width: 110

                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rdy7",
                    style: {
                        marginLeft: '15px'

                    }

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px'
                            //									marginLeft : '30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rdm7",
                    style: {
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "ldy7",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "ldm7",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    name: "zz7",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							888888888888888888888888
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd8"
                }, {
                    xtype: "textfield",
                    name: "DeptId8",
                    width: 110

                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rdy8",
                    style: {
                        marginLeft: '15px'

                    }

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px'
                            //									marginLeft : '30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rdm8",
                    style: {
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "ldy8",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "ldm8",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    name: "zz8",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							9999999999999999999999999999
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd9"
                }, {
                    xtype: "textfield",
                    name: "DeptId9",
                    width: 110

                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rdy9",
                    style: {
                        marginLeft: '15px'

                    }

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px'
                            //									marginLeft : '30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rdm9",
                    style: {
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "ldy9",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "ldm9",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    name: "zz9",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            },
            //							10
            {
                layout: "hbox",
                defaults: {
                    margins: '10 10 0 9'
                },

                columnWidth: 1,
                items: [{
                    xtype: "numberfield",
                    width: 50,
                    hidden: true,
                    name: "dd10"
                }, {
                    xtype: "textfield",
                    name: "DeptId10",
                    width: 110
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "rdy10",
                    style: {
                        marginLeft: '15px'

                    }

                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px'
                            //									marginLeft : '30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "rdm10",
                    style: {
                        marginLeft: '-15px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-30px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 2099,
                    minValue: 1990,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 50,
                    name: "ldy10",
                    style: {
                        marginLeft: '-20px'
                    }
                }, {
                    xtype: "label",
                    html: '年',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-35px'

                    }
                }, {
                    xtype: "numberfield",
                    maxValue: 12,
                    minValue: 1,
                    //								msgTarget: 'under',
                    //                                allowBlank: false,
                    width: 30,
                    name: "ldm10",
                    style: {
                        marginLeft: '-50px'

                    }
                }, {
                    xtype: "label",
                    html: '月',
                    style: {
                        marginTop: '3px',
                        marginLeft: '-65px'

                    }
                }, {
                    xtype: "textfield",
                    name: "zz10",
                    width: 80,
                    style: {
                        marginLeft: '-50px'

                    }
                }]
            }

        ]
    }]

});

//
//    var studentscm = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
////                      new Ext.grid.RowNumberer(),                     //自动编号。
//                     //sm,//复选框。
//                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
//				     { header: '<b>入学日期</b>', align: "center", width:150, dataIndex: 'one' ,editor:true},
//                     { header: '<b>毕业日期</b>', align: "center",width:150, dataIndex: 'two' ,editor:true},
//				     { header: '<b>班级</b>', align: "center",width:200, dataIndex: 'three',editor:true },
//            ]);
//
//      var studentssm = new Ext.grid.CheckboxSelectionModel();
//
//      var students_store = new Ext.data.ArrayStore({
//		fields : ['ID', 'one','two','three'],
//		data : [
//			["1","2014-10-01", "2018-07-01","文峰1号"],
//			["2","2014-10-01", "2018-07-01","文峰2号"],
//			["3","2014-10-01", "2018-07-01","文峰3号"],
//			["4","2014-10-01", "2018-07-01","文峰4号"],
//			["5","2014-10-01", "2018-07-01","文峰5号"],
//			["6","2014-10-01", "2018-07-01","文峰6号"],
//			["7","2014-10-01", "2018-07-01","文峰7号"],
//			["8","2014-10-01", "2018-07-01","文峰8号"]
//		]

//	});
//
//     //显示内容
//    var studentsDetails = new Ext.grid.EditorGridPanel({
//			store : students_store,
//			title:'学校记录',
//			    cm :studentscm,
//				sm : studentssm,
//			  stripeRows:true,
//                border:true,
//                collapsible: true,
//                autoScroll: true,
//                height: 250,
//			//selModel: new Ext.grid.RowSelectionModel({ singleSelect: false }), //设置单行选中模式, 否则将无法删除数据
//			//sm: sm,
////			loadMask : true,
//		});

//
//
//
//	    var peixuncm = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
////                      new Ext.grid.RowNumberer(),                     //自动编号。
//                     //sm,//复选框。
//                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
//				     { header: '<b>特训期数</b>', align: "center", width:150, dataIndex: 'one' ,editor:true }
//            ]);
//
//
//     var peixun_store = new Ext.data.ArrayStore({
//		fields : ['ID', 'one'],
//		data : [
//			["1","2014-10-01" ],
//			["2","2014-10-02" ],
//			["3","2014-10-03" ],
//			["4","2014-10-04" ],
//			["5","2014-10-05" ],
//			["6","2014-10-06" ],
//			["7","2014-10-07" ],
//			["8","2014-10-08"],
//			["9","2014-10-09" ],
//			["10","2014-10-10" ],
//			["11","2014-10-11" ],
//			["12","2014-10-12" ],
//			["13","2014-10-13" ],
//			["14","2014-10-14" ]
//		]

//	});
//
//
//      var peixunsm = new Ext.grid.CheckboxSelectionModel();
//     //显示内容
//    var peixunDetails = new Ext.grid.EditorGridPanel({
//			store : peixun_store,
//			title:'培训记录',
//			    cm : peixuncm,
//				sm : peixunsm,
//			  stripeRows:true,
//                border:true,
//                collapsible: true,
//                autoScroll: true,
//                   height: 380,
//		});
//
//
//
//
//	    var diaodongcm = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
////                      new Ext.grid.RowNumberer(),                     //自动编号。
//                     //sm,//复选框。
//                      { header: 'ID', align: "left", dataIndex: 'ID',hidden: true },
//				     { header: '<b>门店名称</b>', align: "center", width:150, dataIndex: 'one' ,editor : true
//                     },
//
//                     { header: '<b>入店日期</b>', align: "center",width:150, dataIndex: 'two' ,
//                                editor : true},
//
//				                 { header: '<b>离店日期</b>', align: "center",width:150, dataIndex: 'three' ,
//                                editor : true},
//
//				                     { header: '<b>职务</b>', align: "center",width:150, dataIndex: 'four' ,editor : true},
//
//            ]);
//
//      var diaodongsm = new Ext.grid.CheckboxSelectionModel();
//
//      var diaodong_store = new Ext.data.ArrayStore({
//		fields : ['ID', 'one','two','three','four'],
//		data : [
//		    ["1","文峰1号","2014-10-01", "2018-07-01","主管"],
//			["2","文峰2号","2014-10-01", "2018-07-01","主管"],
//			["3","文峰3号","2014-10-01", "2018-07-01","主管"],
//			["4","文峰4号","2014-10-01", "2018-07-01","主管"],
//			["5","文峰5号","2014-10-01", "2018-07-01","主管"],
//			["6","文峰6号","2014-10-01", "2018-07-01","主管"],
//			["7","文峰7号","2014-10-01", "2018-07-01","主管"],
//			["8","文峰8号","2014-10-01", "2018-07-01","主管"],
//			["9","文峰9号","2014-10-01", "2018-07-01","主管"],
//			["10","文峰10号","2014-10-01", "2018-07-01","主管"]
//		]

//	});
//     //显示内容
//    var diaodongDetails = new Ext.grid.EditorGridPanel({
//			store : diaodong_store,
//			title:'调动记录',
//			    cm : diaodongcm,
//				sm : diaodongsm,
//			  stripeRows:true,
//                border:true,
//                collapsible: true,
//                autoScroll: true,
//                   height: 300,
//		});
//

//var sm = new Ext.grid.CheckboxSelectionModel();
//var cm = new Ext.grid.ColumnModel({
//		defaults : {
//			sortable : false,
//			menuDisabled : true,
//			multiSelect : true
//		},
//		columns : [new Ext.grid.RowNumberer(), {
//				header : 'ID',
//				dataIndex : 'ID',
//				hidden : true,
//				width : 100
//			},
//			{
//				header : '<font style="font-weight:bold;">员工照片</font>',
//				dataIndex : 'photo',
//				width : 150,
//				renderer : function (value) {
//					return "<img src='" + value + "' width='150'/>";
//				}
//			},
//			{
//				header : "<font style=\"font-weight:bold;\">工号</font>",
//				dataIndex : "EmployeeCode",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">姓名</font>",
//				dataIndex : "EmployeeName",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">身高（CM）</font>",
//				dataIndex : "Height",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">体重（CM）</font>",
//				dataIndex : "Weight",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">西服</font>",
//				dataIndex : "CoatSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">西裤</font>",
//				dataIndex : "TrousersSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">短袖衫</font>",
//				dataIndex : "ShirtSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">红色裙子</font>",
//				dataIndex : "SkirtSize",
//				width : 120
//			}, {
//				header : "<font style=\"font-weight:bold;\">皮鞋</font>",
//				dataIndex : "ShoesSize",
//				width : 120
//			}

//		]
//	});

// create the Data Store
//var pd_store = new Ext.data.Store({
//		autoDestroy : true,
//		autoLoad : true,
//		url : '../Apis/EmpInfoMgr.aspx?actionName=queryEmployee&sid=' + Sys.sid,
//		reader : new Ext.data.JsonReader({
//			record : 'MakeupInfo',
//			idProperty : 'ID',
//			root : 'results',
//			totalProperty : 'totalCount',
//			fields : [{
//					name : "ID",
//				}, {
//					name : "EmployeeCode"
//				}, {
//					name : "EmployeeName"
//				}, {
//					name : "Height"
//				}, {
//					name : "Weight"
//				}, {
//					name : "CoatSize"
//				}, {
//					name : "TrousersSize"
//				}, {
//					name : "ShirtSize"
//				}, {
//					name : "SkirtSize"
//				}, {
//					name : "ShoesSize"
//				}, {
//					name : "photo"
//				}
//			]
//		})
//	});

//var pd_grid = new Ext.grid.GridPanel({
//		store : pd_store,
//		cm : cm,
//		columnLines : true,
//		sm : sm,
//		margins : "2 2 2 2",
//		border : false,
//		loadMask : true,
//		bbar : new Ext.PagingToolbar({
//			pageSize : 40,
//			store : pd_store,
//			displayInfo : true,
//			displayMsg : '显示第 {0} 条到 {1} 条记录，总共 {2} 条',
//			emptyMsg : "没有记录"
//		})
//	});

//pd_store.on('beforeload', function (thiz, options) {
//	this.baseParams.start = 0;
//	this.baseParams.limit = 40;
//});

function VerifyAction() {

        if (pd_top_form.form.isValid()) {

            if (checkIdcard()) {

                if (pd_top_form.getForm().findField('Marriage').getValue() == "已婚") {
                    if (pd_top_form.getForm().findField('ConsortName').getValue() == "" || pd_top_form.getForm().findField('ConsortPhone').getValue() == "" || pd_top_form.getForm().findField('ConsortAddress').getValue() == "") {
                        Ext.Msg.alert("提示", "请填写配偶信息!");
                        return;
                    }
                }

                pd_top_form.getForm().submit({
                    waitMsg: "正在提交，请稍候...",
                    url: "../Apis/EmpInfoMgr.aspx?sid=" + Sys.sid + '&actionName=newUpload',
                    success: function(from, action) {

                        //			pd_store.load();

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
    }
    //主容器

var pd_main_panel = new Ext.Panel({
    border: false,
    autoScroll: true,
    items: [{
        frame: true,
        region: 'north',
        height: "auto",

        layout: "fit",
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
/**
var photoWindow = new Ext.Window({
layout : 'fit',
width : 1100,
height : 500,
modal : true,
closeAction : 'hide',
title : "填写员工信息",
plain : true,
items : [pd_top_form]
});

function showPhotoWoindow() {
photoWindow.show();
pd_top_form.getForm().isValid();
}**/

var setAttendanceLevel = function() {
    Ext.getCmp('btnsearch').setDisabled(true);
    pd_top_form.getForm().findField('Sex').setValue("男");
    pd_top_form.getForm().findField('Rank').setValue("无");
    pd_top_form.getForm().findField('Marriage').setValue("未婚");
    pd_top_form.getForm().findField('Politics').setValue("普通居民（群众）");

    pd_top_form.getForm().findField('CoatSize').setValue("无");
    pd_top_form.getForm().findField('ShirtSize').setValue("无");
    pd_top_form.getForm().findField('TrousersSize').setValue("无");
    pd_top_form.getForm().findField('SkirtSize').setValue("无");
    pd_top_form.getForm().findField('ShoesSize').setValue("无");

}
setAttendanceLevel();

function getTimeStamp() {
    // 声明变量。
    var d,
        s;
    // 创建 Date 对象。
    d = new Date();
    s = d.getFullYear();
    s += ("0" + (d.getMonth() + 1)).slice(-2);
    s += ("0" + d.getDate()).slice(-2);
    s += ("0" + d.getHours()).slice(-2);
    s += ("0" + d.getMinutes()).slice(-2);
    s += ("0" + d.getSeconds()).slice(-2);
    s += ("00" + d.getMilliseconds()).slice(-3);
    return s;
}
