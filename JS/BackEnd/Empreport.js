
/*        员工调动报到        */


Ext.onReady(function () {

    var Form_Top = new Ext.form.FormPanel({
		
		reader:new Ext.data.JsonReader({
			fields:[
				{name:'EmpId'},
				{name:'EmpCode'},
				{name:'EmpTitle'},
				{name:'BaxaDate',convert:ConvertJSONDateToJSDateObjectTextField}
			]
		}),
	
		labelAlign:'right',
        items: [
			{
			    xtype: 'fieldset',
			    title: '员工调动报到',
			    layout: 'anchor',
			    items: [
					{
						layout:'column',
						items:[
					      {
							layout: 'form',
							labelWidth: 60,
							columnWidth: 0.4,
							items: [
								{
									xtype: 'combo',
									name:'EmpCode',
									typeAhead:true,
									minChars:2,
									fieldLabel: '员工工号',
									mode:'remote',
									triggerAction:'all',
									store:Store_GetEmpCode,
									valueField:'myId',
									displayField:'displayText',
									allowBlank:false,
									anchor: '100%',
									enableKeyEvents:true,
									listeners:{
										'select':function(){
											var Id=this.getValue();//iEmployee _ Id
											GetEmpInfo(13,'Id',Id);
										},
										'keypress':function(thi,e){
											GetEmpInfo(e.keyCode,'Code',this.getRawValue());
										}
									}
							}
                        ]
					},
                    {
                        layout: 'form',
                        labelWidth: 0.1,
                        columnWidth: 0.4,
                        items: [
                            {
                                xtype: 'textfield',
								name:'EmpTitle',
								disabled: true,
                                allowBlank:false,
                                anchor: '100%'
                            }
                        ]
                    }
				]
			},
					{
						layout:'column',
						items:[
							 {
								layout: 'form',
								labelWidth: 60,
								columnWidth: 0.4,
								items: [
									{
										xtype: 'datefield',
										name:'BaxaDate',
										fieldLabel: '报到日期',
										value: new Date(),
										format: 'Y-m-d',
										anchor: '100%'
									},
									{
										xtype:'textfield',
										name:'EmpId',
										hidden:true
									}
								]
							},
							 {
								layout: 'form',
								columnWidth: 0.4,
								buttons:[
									{
										text:'报到',
										anchor:'20%',
										handler:function(){
											var EmpTitle=Form_Top.find('name','EmpTitle')[0].getValue();
											Form_Top.getForm().submit({
												url:'../Apis/Empreport.aspx?actionName=report&sid='+Sys.sid,
												params:{EmpTitle:EmpTitle},
												success:function(form,action){
													Ext.Msg.alert('提示',action.result.msg);
													Form_Top.getForm().reset();
												},
												failure:function(form,action){
													if(action.result!=null && action.result.msg!=null){
														Ext.Msg.alert('提示',action.result.msg);
													}
												}
											});
										}
									}	 
								]
							}
						]
					}
				]
			}
		]
    });

	function GetEmpInfo(e,type,txt){
		try
		{
			if(e==13 && (txt.length>0 || parseInt(txt)>0)){
				Form_Top.getForm().reset();
				Form_Top.load({
					url:'../Apis/Empreport.aspx?actionName=GetEmpInfo&sid='+Sys.sid,
					waitMsg:'正在搜素，请稍候...',
					params:{type:type,txt:txt}
				});
			}
		}catch(e)
		{}
	}
	
    var pd_main_panel = new Ext.Panel({
        border: false,
        layout: "anchor",
        items: [{
            frame: true,
            border: false,
            items: [Form_Top]
        }, {
            layout: "fit",
            border: false,
            anchor: '-1 -100',
            items: []
        }]
    });

    centerPanel.add(pd_main_panel);
    centerPanel.doLayout();
});