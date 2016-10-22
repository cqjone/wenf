Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'under';
    var allData = [];
    var currData = [];
    var arr1
    var count
    var sum
    var sum1
    var xuLie
    var bianma
    var getNumber
    var index1
    var all_value
    

    // 获取发货单数据
    Ext.Ajax.request
    ({
        url: '../../Data/deliver.json',

        success: function (data) 
        {

            // 处理数据
            allData = Ext.decode(data.responseText).invoice;
          
        }
    });

        //发货单详情表格
    var asklist = new Ext.data.JsonStore
    ({
        fields: ['coding','cate', 'name', 'size', 'company', 'number', 'code', 'recode'],
        sortInfo: 
        {
        field: 'coding',
        direction: 'ASC'
        },
        data: []
    });
 
       //入库详情表格
   var detailStore = new Ext.data.JsonStore
    ({
        fields: ['coding','name', 'cate', 'size', 'code', 'recode', 'number', 'renumber', 'company', 'lremark'],
        
        sortInfo: 
        {
        field: 'coding',
        direction: 'ASC'
        },
        data: []

    });
    
    //布局  表头
    var colum1 = new Ext.Panel({
        // width:350,
        columnWidth:0.35,
        layout:'form',
        frame: true,
        height: 260,
        title: '入库产品',
        labelAlign:'right',
        items: [
            {
                xtype: 'datefield',
                id: 'formDate',
                allowBlank:false,
                fieldLabel: '接收日期',
                format: 'Y-m-d',
                value:new Date(),
                enableKeyEvents : true,
                width: 200,
                blankText :'到货日期不能为空',
                listeners: {
                    'keyup':function(t,e){
                        if (event.keyCode=='13') {
                            
                            Ext.getCmp('formCode').focus();
                        };
                    }
                }
            },
            {
                xtype:'textfield',
                id: 'formCode',
                fieldLabel:'商品代码',
                enableKeyEvents : true,
                allowBlank:false,
                blankText:'请输入正确的商品代码',
                width: 200,
                listeners: {
          
            'keyup': function (e, t) 
            {
                if (event.keyCode=='13') 
                {           
                       Ext.getCmp('formNum').focus();         
                }
            },
               //商品代码框失去焦点时
              'blur':function() {
            var value=Ext.getCmp('formCode').getValue();

                //获取发货单数据
                Ext.Ajax.request({       
                    url: '../../Data/deliver.json',
                    success: function(data) 
                    {
                    var valuess,pInfo,valuesss
                    var get=Ext.getCmp('get').getValue();
                    //pInfo为所有发货单
                    pInfo = Ext.decode(data.responseText).invoice;
                    for(var i=0;i<pInfo.length;i++)
                    {
                    //先判断哪个单号
                     if(pInfo[i].no==get)
                     {
                       for(var a=0;a<pInfo[i].data.length;a++)
                       {             
                        valuess=pInfo[i].data[a].code;
                        valuesss=pInfo[i].data[a].recode;
                        valuessss=pInfo[i].data[a].coding;
                        

                    //如果输入为序列码，默认设置数量为1
                    if(value==valuesss)
                    {

                        Ext.getCmp('formNum').focus();
                        Ext.getCmp('formNum').setValue(1);
                        Ext.getCmp('point').setValue('');
                        Ext.getCmp('formNum').selectText();
                        arr1=pInfo[i].data[a].number
                        xuLie=pInfo[i].data[a].recode  
                        bianma=pInfo[i].data[a].coding
                        break;
                    }


                    //如果输入商品编码，如果对应的有序列码则提示输入序列码
                    if(value==valuessss)
                    {
                        
                        arr1=pInfo[i].data[a].number
                        xuLie=pInfo[i].data[a].recode
                        Ext.getCmp('point').setValue('');
                        bianma=pInfo[i].data[a].coding
                        if(xuLie)
                        {
                        all_value=Ext.getCmp('formCode').getValue();
                        Ext.getCmp('formCode').setValue('请输入与下方相对应的序列码');
                        Ext.getCmp('point').setValue(all_value)
                        Ext.getCmp('formCode').focus();
                        Ext.getCmp('formCode').selectText();
                        return
                        }
                        else
                        {
                         Ext.getCmp('formNum').focus();
                         Ext.getCmp('formNum').setValue(1);
                         Ext.getCmp('formNum').selectText();
                         return
                        }

                     }
                    //如果输入条形码，如果对应的有序列码则提示输入序列码
                  if(value==valuess)
                  {  
                    arr1=pInfo[i].data[a].number
                    xuLie=pInfo[i].data[a].recode
                    Ext.getCmp('point').setValue('');
                    bianma=pInfo[i].data[a].coding
                    if(xuLie)
                    {
                    all_value=Ext.getCmp('formCode').getValue();
                    Ext.getCmp('formCode').setValue('请输入与下方相对应的序列码');
                    Ext.getCmp('point').setValue(all_value)
                    Ext.getCmp('formCode').focus();
                    Ext.getCmp('formCode').selectText();
                    return
                    }
                    else
                    {
                    Ext.getCmp('formNum').focus();
                     Ext.getCmp('formNum').setValue(1);
                     
                     Ext.getCmp('formNum').selectText();
                     return
                    }

                  }
                                
                        };//判断产品数量循环结束
                        
                        //如果产品不存在，清除输入值
                      if(a==pInfo[i].data.length)

                    {
                         Ext.getCmp('formCode').setValue('')
                         Ext.getCmp('formCode').focus()    
                    } 
                         }    
                    }//判断单号循环结束 
                }   
            });
        }//失去焦点事件结束
             }

             },
             {
             xtype:'displayfield',
             id:'point',
             readOnly:true,
             style: {
                    background: 'none',
                    border: 'none',
                    color:'red'
                    }
             },
                {
                    xtype:'numberfield',
                    allowDecimals: false,
                    id: 'formNum',
                    fieldLabel:'到货数量',
                    width:200,
                    enableKeyEvents: true,      
         listeners: {
        'keyup':function(e,t){
            var formNum=Ext.getCmp('formNum').getValue() 
            var formCode=Ext.getCmp('formCode').getValue()
             
                //按下回车
              if(event.keyCode=='13')
        {           
              //商品代码和数量输入框不能为空
               if (formCode != '' && formNum !== '') 
          {
              var data=Ext.pluck(detailStore.data.items,'data')

              //遍历入库详情表格
                for (var i = 0; i < detailStore.data.length; i++)
            {           
                     //当输入为商品编码或条形码时，同码合并，数量相加
                  if (formCode == data[i].code||formCode==data[i].coding)
                {
                 
                  sum = detailStore.getAt(i).get('renumber') + formNum;
                  detailStore.getAt(i).set('renumber', sum);
                  count=sum-arr1;                            
                  detailStore.getAt(i).set('lremark', count);
                 
                  getNumber= detailStore.getAt(i).get('number')
                  index1=detailStore.getAt(i)

                  Ext.getCmp('formCode').selectText();
                                Ext.getCmp('formCode').focus();
                                Ext.getCmp('formNum').setValue('');      
                                return;
                  }
                //当输入为序列码时
            if (formCode == data[i].recode)
             {
                        if(formNum==0)
                        {
                            detailStore.getAt(i).set('renumber',0);
                            detailStore.getAt(i).set('lremark', -1);
                                 
                            Ext.getCmp('formCode').selectText();
                            Ext.getCmp('formCode').focus();
                            Ext.getCmp('formNum').setValue('');      
                            return;      
                        }
                        if(formNum!==0)
                        {
                            detailStore.getAt(i).set('renumber',1);
                            detailStore.getAt(i).set('lremark', 0);
                             
                            Ext.getCmp('formCode').selectText();
                            Ext.getCmp('formCode').focus();
                            Ext.getCmp('formNum').setValue('');      
                            return;    
                        }
                             
                    }
            }
                    //获取发货单数据
                    Ext.Ajax.request({
                    url: '../../Data/deliver.json',
                    success: function(data) 
                    {
                    var formNum=Ext.getCmp('formNum').getValue() 
                    var pInfo
                    var get=Ext.getCmp('get').getValue();
                    pInfo = Ext.decode(data.responseText).invoice;
                    for(var b=0;b<pInfo.length;b++)
                {
                       
                        //判断哪个单号
                         if(pInfo[b].no==get)
                    {

                        for(var a=0;a<pInfo[b].data.length;a++)
                        {
                           
            if(formCode==pInfo[b].data[a].coding||formCode==pInfo[b].data[a].code||formCode==pInfo[b].data[a].recode)
                   {    
                    var name=pInfo[b].data[a].name;    
                    var cate=pInfo[b].data[a].cate;
                    var size=pInfo[b].data[a].size;
                    var number=pInfo[b].data[a].number;
                    var renumber=pInfo[b].data[a].renumber;
                    var company=pInfo[b].data[a].company;
                    var lremark=pInfo[b].data[a].lremark;
                    var code=pInfo[b].data[a].code;
                    var recode=pInfo[b].data[a].recode;
                    var coding=pInfo[b].data[a].coding
                   }

                        };
                    }  

                }  
                    //产品第一次入库时执行  
                    var record=new Ext.data.Record({'coding':coding,'name':name, 'cate':cate, 'size':size, 'code':code, 'recode':recode, 'number':number, 'renumber':formNum, 'company':company, 'lremark':formNum-arr1})
                    var record1=new Ext.data.Record({'coding':coding,'name':name, 'cate':cate, 'size':size, 'code':code, 'recode':recode, 'number':number, 'renumber':1, 'company':company, 'lremark':formNum-arr1})
                    //第一次添加为序列码商品时
                    if(formCode==recode)
                    {
                        
                        detailStore.addSorted(record1)

                    }
                    //第一次输入条形码添加
                    if(formCode==code)
                    {
                        detailStore.addSorted(record)
                        
                    }
                    //第一次输入商品编码添加
                   if(formCode==bianma)
                   {  
                        detailStore.addSorted(record)
                        
                   }
                   //如果都不是则清空输入值
                    Ext.getCmp('formCode').selectText();
                    Ext.getCmp('formCode').focus();
                    Ext.getCmp('formNum').setValue('');
                                               
                    }   
                });
            }//不为空
        
            }//button=12
             }
              }
               },

              {
                xtype:'button',
                text:'添加',
                width:50,
                height:30,
                style:{
                    // marginBottom:'10px',
                    marginLeft:'170px',
                    marginTop:'10px'
                }, 
             listeners:{
            'click': function() {
              if (formCode != '' && formNum !== '') 
                    {
               var formNum=Ext.getCmp('formNum').getValue() 
               var formCode=Ext.getCmp('formCode').getValue()
               var data=Ext.pluck(detailStore.data.items,'data')
                for (var i = 0; i < detailStore.data.length; i++)
                 {
                  if (formCode == data[i].code||formCode==data[i].coding)
                  {
                 
                  sum = detailStore.getAt(i).get('renumber') + formNum;
                  detailStore.getAt(i).set('renumber', sum);
                  count=sum-arr1;                            
                  detailStore.getAt(i).set('lremark', count);
                   
                  getNumber= detailStore.getAt(i).get('number')
                  index1=detailStore.getAt(i)
                  Ext.getCmp('formCode').selectText();
                                    Ext.getCmp('formCode').focus();
                                    Ext.getCmp('formNum').setValue('');      
                                    return;      
                  }

                    if (formCode == data[i].recode)
                     {
                    if(formNum==0)
                    {
                        detailStore.getAt(i).set('renumber',0);
                        detailStore.getAt(i).set('lremark', -1);
                        Ext.getCmp('formCode').selectText();
                        Ext.getCmp('formCode').focus();
                        Ext.getCmp('formNum').setValue('');      
                        return;      
                             
                    }
                    if(formNum!==0)
                    {
                        detailStore.getAt(i).set('renumber',1);
                        detailStore.getAt(i).set('lremark', 0);
                        Ext.getCmp('formCode').selectText();
                        Ext.getCmp('formCode').focus();
                        Ext.getCmp('formNum').setValue('');      
                        return;      
                           
                    }
                                     
                    }
                }
                      
                            Ext.Ajax.request({
                            url: '../../Data/deliver.json',
                            success: function(data) 
                            {
                            var pInfo
                            var get=Ext.getCmp('get').getValue();
                            pInfo = Ext.decode(data.responseText).invoice;
                            for(var b=0;b<pInfo.length;b++)
                            {
                                // alert(allData[i].length)
                                //判断哪个单号
                                 if(pInfo[b].no==get)
                                 {

                                for(var a=0;a<pInfo[b].data.length;a++)
                                {
                                   
                         if(formCode==pInfo[b].data[a].coding||formCode==pInfo[b].data[a].code||formCode==pInfo[b].data[a].recode)
                           {
                                var name=pInfo[b].data[a].name;
                                    // alert(name)
                                var cate=pInfo[b].data[a].cate;
                                var size=pInfo[b].data[a].size;
                                var number=pInfo[b].data[a].number;
                                var renumber=pInfo[b].data[a].renumber;
                                var company=pInfo[b].data[a].company;
                                var lremark=pInfo[b].data[a].lremark;
                                var code=pInfo[b].data[a].code;
                                var recode=pInfo[b].data[a].recode;
                                var coding=pInfo[b].data[a].coding
                            }

                                };//循环二

                                 }  //判断哪个单号的if   

                            }//循环一      
                        var record=new Ext.data.Record({'coding':coding,'name':name, 'cate':cate, 'size':size, 'code':code, 'recode':recode, 'number':number, 'renumber':formNum, 'company':company, 'lremark':formNum-arr1})
                        var record1=new Ext.data.Record({'coding':coding,'name':name, 'cate':cate, 'size':size, 'code':code, 'recode':recode, 'number':number, 'renumber':1, 'company':company, 'lremark':formNum-arr1})
                        if(formCode==recode)
                        {                           
                            detailStore.addSorted(record1)                            
                        }
                        if(formCode==code)
                        {
                            detailStore.addSorted(record)                           
                        }
                       if(formCode==bianma)
                       {  
                            detailStore.addSorted(record)                           
                       }
                        Ext.getCmp('formCode').selectText();
                        Ext.getCmp('formCode').focus();
                        Ext.getCmp('formNum').setValue('');
                                                  
                        }   
                    });
                }//不为空

               }
            }

       },
           {
            xtype:'panel',
            layout:'column',
            padding:'10px',
            style:{marginTop:'15px'},
            items: [
            {
                xtype: 'label',
                text: '入库单处理完成，单击提交',
                style: {
                    marginLeft: '20px',
                    marginTop: '8px',
                    color: 'blue',
                    fontSize: '13px'
                }
            },
            {
                xtype: 'button',
                text: '提交',
                width: 80,
                height: 30,
                style: {
                    marginLeft: '10px'
                },
                 handler: 
                          function()
                        {   
                          if(asklist.data.length!=0)//如果入库单为0,不能提交
                          {
                           submit()
                          }
                        }
            }
                   ]
           }
              
        ]
    });
 //布局 入库详情表格
    var colum2 = new Ext.Panel({
        layout:'form',
        title: '发货单详情',
        columnWidth:0.65,
        items:[
    new Ext.grid.EditorGridPanel({
        // columnWidth:0.65,
        // width:'65%',
        height: 235,
        frame: true,
        columnLines: true,
        // title: '发货单详情',
        store: asklist,
        tbar: {
                style: {
                    padding: '8px'
                },
     items: [
                '发货单编号：',
            {
                xtype: 'textfield',
                id:'get',
                emptyText:'请输入单号',
                blankText :'通知单不能为空',
                width: 200,
                floating: true,
                enableKeyEvents : true,

                 listeners: {

                   'keyup': function (e, t) {
                    var value = e.getValue();
                     
                    for (var i = 0; i < allData.length; i++) {
                        //判断单号
                        if (allData[i].no == value) {
                            currData = allData[i].data;
                            asklist.loadData(currData);    
                        }
                    }
                    
                    if (event.keyCode=='13') {
                       Ext.getCmp('formDate').focus();
                    }
            }
        }
                   

                        }
                    ]
                },
        columns: [
            {header: '商品编码', dataIndex: 'coding', align:'center',width: 120},
            {header: '商品名称', dataIndex: 'name', width:120,align:'center'},
            {header: '条形码', dataIndex: 'code', width:135,align:'center'},
            {header: '序列码', dataIndex: 'recode', width:165,align:'center'},
            {header: '商品类别', dataIndex: 'cate', width:100,align:'center'},
            {header: '规格', dataIndex: 'size', width:50,align:'center'},
            {header: '发货数量', dataIndex: 'number', width:80,align:'center',renderer:function(value)
            {
            return Ext.util.Format.number(value,'0,000');//格式化数字输出
            }
            // editor:new Ext.form.TextField({
            // allowBlank: false
            // })
            },
            {header: '单位', dataIndex: 'company', width:50,align:'center'}
            
        ]
    })
]
});
    // var sm = new Ext.grid.CheckboxSelectionModel();
    var lgrid= new Ext.grid.EditorGridPanel({
        // sm:sm,
        // width: '100%',
        // height: '100%',
        region: 'center',
        frame: true,
        columnLines: true,
        title: '入库详情',
        store: detailStore,    
        stripeRows: true,
        viewConfig: {
        getRowClass: function(record, i) 
        {
        $('.new-record').toggleClass('new-record');
        var _this = this;
        setTimeout(function () {
          $(_this.scroller.dom).scrollTop(19 * i);
        }, 0);
          return 'new-record';
        }
                    },
        columns: [
            // sm,
            {header: '商品编码', dataIndex: 'coding', align:'center',width: 120},
            {header: '商品名称', dataIndex: 'name', align:'center',width: 200},
            {header: '条形码', dataIndex: 'code', align:'center',width: 150},
            {header: '序列码', dataIndex: 'recode', align:'center',width: 180},
            {header: '发货数量', dataIndex: 'number', align:'center',width: 100,align:'right',renderer:function(value){
            return Ext.util.Format.number(value,'0,000');//格式化数字输出
            }       
            },
            {header: '到货数量', dataIndex: 'renumber', align:'center',width: 100,align:'right',renderer:function(value){
            return Ext.util.Format.number(value,'0,000');//格式化数字输出
             }
             // editor:new Ext.form.NumberField ({
            //        id:'editor',
            //        listeners:{
            //     'blur':function() {
            //         var formCode=Ext.getCmp('formCode').getValue()
            //         var data=Ext.pluck(detailStore.data.items,'data')
            //         var editor=Ext.getCmp('editor').getValue()
            //         for (var i = 0; i < detailStore.data.length; i++)
            //         {
                        // if (formCode==data[i].code||formCode==data[i].coding)
                        //       {
                        //         alert(i)
                        //       // var editor=Ext.getCmp('editor').getValue()  
                        //       var change=editor-arr1 
                        //       count=editor-arr1;                            
                        //       detailStore.getAt(i).set('lremark', count);

                        //       }
                        // if (formCode==data[i].recode)
                        // {      
                        //       var hehe = detailStore.getAt(i).get('renumber')

                        //       alert(hehe);
                        //       // var haha=data[i].renumber
                        //       if(editor!=hehe)
                        //       {
                                
                        //        detailStore.getAt(i).set('renumber', hehe);
                        //       }
                                    
                        // }      
    
                   // }
                    // var editor=Ext.getCmp('editor').getValue()
                    // var change=editor-getNumber
                    // index1.set('lremark',change)
                   
            //     }
            // },
            // allowBlank: false,
            // })
               },
            {header: '差异情况', dataIndex: 'lremark', align:'center',width: 100,css : 'color: #FF0000;'},
            {header: '商品类别', dataIndex: 'cate', align:'center',width: 100},
            {header: '商品规格', dataIndex: 'size', align:'center',width: 100},
            {header: '单位', dataIndex: 'company', align:'center',width:50}, 
            {header: '操作', width: 100,align:'right',
                // 添加删除列
          renderer: function (value, metadata, record, rowIndex, columnIndex, store) {
          window.deleteRecord = function(id) {
            var record = store.getById(id);
            var pName = record.data.name;
            var pSize = record.data.size;
                  Ext.Msg.confirm('提示', '确定要删除 “'+pName+'” 吗？', function (button) {
                if (button == 'yes') {
                        store.remove(record);
                      }
                    });
          }

            var returnStr = '<a style="color: blue; text-decoration: underline; cursor: pointer;" onclick="deleteRecord(\'' + record.id + '\')">删除</a>';
            return returnStr;
                }
            }
        ]
        
    });

    new Ext.Viewport({
        autoScroll :'true',
        layout: 'border',
        style:{
            backgroundColor:'#dfe9f6'
        },
        
        items: [

            new Ext.FormPanel({
                border:false,
                region: 'north',
                // labelAlign: 'left',
                height:395,
                title:'门店入库',
                frame: true,
                items:
                 [
                    {
                    xtype: 'fieldset',
                    title: '注意事项',
                    style:{color:'red'}, 
                    labelAlign: 'left',
                    labelWidth:500,
                    labelSeparator:'',
                    items: [     
                    {fieldLabel:'1.商品代码包括商品编码、条形码、序列码，可手动录入或扫码枪扫描自动录入'},  
                    {fieldLabel:'2.接收日期默认为当前日期，到货数量默认为1'}                   
                           ]
                    },
                    {
                    xtype: 'panel',
                    layout:'column',
                    items:[colum1,colum2]

                    }
                    
                ]
            }),

            // new Ext.FormPanel({
            //     width:'100%',
            //     border:false,
            //     // height:300,
            //     // layout:'column',
            //     region: 'center',
            //     items:[
                lgrid
            //     ]
            // })
        ]
    });
//删除选中项
function deletelist() {
    var selData = lgrid.getSelectionModel();
    if (selData.hasSelection()) {
        Ext.Msg.confirm('警告', '确定要删除吗？', function (button) {
            if (button == 'yes') {
                var selected = selData.getSelections();
                var ids = []; //要删除的id
                Ext.each(selected, function (item) {
                    ids.push(item.data);
                }),
                detailStore.remove(selected);
            }
        });
    }
    else {
        Ext.Msg.alert('错误', '没有任何行被选中，无法进行删除操作！');
    }
}

// 提交
    function submit() {
        var myMask = new Ext.LoadMask(Ext.getBody(), {//也可以是Ext.getCmp('').getEl()窗口名称
    msg    : "请稍后..."//你要写成Loading...也可以
    
         });
       myMask.show();
       
        Ext.Ajax.request
    ({
        url: '../../Data/LgstTest.php',
        method:'post',
        success: function (data) {
             myMask.hide();
             Ext.Msg.alert('提交','提交成功');
             location.reload();
            // 处理数据
            // allData = Ext.decode(data.responseText).invoice;
           
        },

        failure: function(response, opts) {
             myMask.hide();
            // var obj = Ext.decode(response.responseText);
            Ext.Msg.alert('提示','提交失败');
        }
    });
        

        var jsonData = Ext.encode(Ext.pluck(detailStore.data.items, 'data')); 
       
    }

    var geshi=function(value){
            return Ext.util.Format.number(value,'0,000');//格式化数字输出
                             }

    // 删除某行数据
    function deleteRequest() {
        var selData = lgrid.getSelectionModel();
        if (selData.hasSelection()) {
            Ext.Msg.confirm('警告', '确定要删除吗？', function (button) {
                if (button == 'yes') {
                    var selected = selData.getSelections();
                    var ids = []; //要删除的id
                    Ext.each(selected, function (item) {
                        ids.push(item.data);
                    }),
                   detailStore.remove(selected);
                }
            });
        }
        else {
            Ext.Msg.alert('错误', '没有任何行被选中，无法进行删除操作！');
        }
    }
});