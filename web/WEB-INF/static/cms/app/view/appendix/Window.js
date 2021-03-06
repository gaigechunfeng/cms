Ext.define('MyCms.view.appendix.Window',{
	extend:'MyCms.view.ux.MyWindow',
	uses:['Ext.form.Panel',
	      'Ext.tab.Panel',
	      'MyCms.model.Appendix',
	      'Ext.grid.plugin.CellEditing',
	      'Ext.grid.plugin.RowEditing',
	      'Ext.resizer.Resizer',
	      'MyCms.view.ux.MyMenu'],
	modal:true,
	width:900,
	height:615,
	title:'附件管理',
	initComponent:function(){
		var me = this;
		
		me.addPanel = Ext.create('Ext.form.Panel',{
			title:'添加附件',
			flex:2,
			border:true,
			margin:'5px 5px',
			layout:'anchor',
			defaults:{
				anchor: '100%',
		        margin:'10px auto',
				allowBlank:false
			},
			items:[{
				xtype:'textfield',
				fieldLabel:'附件描述',
				name:'addition'
			},{
				xtype:'combobox',
				fieldLabel: '附件类型',
				name:'type',
				forceSelection:true,
			    store: Ext.create('Ext.data.Store', {
			        fields: ['value', 'name'],
			        data : me.formatTypeForCombo()
			    }),
			    queryMode: 'local',
			    displayField: 'name',
			    valueField: 'value'
			},{
				xtype: 'filefield',
		        name: 'f',
		        fieldLabel: '文件',
		        buttonText: '选择文件'
			},{
				xtype:'button',
				text:'上传',
				handler:'onUpload',
				scope:me
			}]
		});
		
		
		me.showPanel = Ext.create('Ext.tab.Panel',{
			flex:3,
			margin:'5px 5px',
			items:me.getAppendixGrids()
		});
		
		Ext.apply(me,{
			layout:{
				type: 'vbox',
    	        align: 'stretch'
			},
			items:[me.addPanel,{
				xtype:'panel',
				flex:3,
				border:true,
				margin:'5px 5px',
				title:'已添加附件',
				layout:{
					type: 'hbox',
	    	        align: 'stretch'
				},
				items:[me.showPanel]
			}],
			buttons:[{
				text:'确定',
				handler:'onOk',
				scope:me
			},{
				text:'取消',
				handler:'onCancel',
				scope:me
			}]
		});
	
		me.on('beforedestroy','onDestroy',me);
		me.callParent();
	},
	insertApp2Doc:function(record){
		var me = this;
		
		var conField = me.view.down('form').getForm().findField('content');
		conField.setValue(conField.getValue()+'<img src="'+RootPath+'/file/app/'+record.get('fileId')+'" />');
	},
	updateApp:function(_this){
		var me = this;
		
		var form = _this.up('form');
		form.getForm().submit({
    		clientValidation: true,
    	    url: appendix_update,
            success: 'onSuccess',
            failure: function(form, action) {
               Ext.Msg.alert('失败', action.result ? action.result.message : 'No response');
            },
            scope:me
        });
	},
	onSuccess:function(form, action){
		var fileType = action.result.obj.type;
    	var app = new MyCms.model.Appendix(action.result.obj);
    	var store = Ext.getCmp('appendix-tabgrid-'+fileType).getStore();
    	if(store.getById(app.get('id'))){
    		store.remove(store.getById(app.get('id')));
    	}
    	store.add(app);
	},
	onUpload:function(){
		var me = this;
		
		me.addPanel.getForm().submit({
    		clientValidation: true,
    	    url: appendix_save,
            success: 'onSuccess',
            failure: function(form, action) {
               Ext.Msg.alert('失败', action.result ? action.result.message : 'No response');
            },
            scope:me
        });
	},
	onDestroy:function(){
		var me = this;
		
		me.view.appWin = null;
	},
	onOk:function(){
		var me = this;
		
		var appIds = [];
		me.getAllRecords().forEach(function(r){
			appIds.push(r.get('id'));
		});
		me.view.form.getForm().findField('appIds').setValue(appIds.join(','));
		me.close();
	},
	onCancel:function(){
		this.close();
	},
	formatTypeForCombo:function(){
		var me = this;
		
		var items = []
		for( var t in MyCms.model.Appendix.TypeMapping){
			items.push({
				name:MyCms.model.Appendix.TypeMapping[t],
				value:t
			});
		}
		return items;
	},
	getAllRecords:function(){
		var me = this;
		
		var rs = [];
		for( var t in MyCms.model.Appendix.TypeMapping){
			
			Ext.getCmp('appendix-tabgrid-'+t).getStore().each(function(r){
				rs.push(r);
			});
		}
		return rs;
	},
	getAppendixGrids:function(){
		var me = this;
		
		var items = [];
		for( var t in MyCms.model.Appendix.TypeMapping){
			items.push({
				xtype:'grid',
				id:'appendix-tabgrid-'+t,
				title:MyCms.model.Appendix.TypeMapping[t],
			    _type:t,
				multiSelect : true,
				plugins:Ext.create('Ext.grid.plugin.RowEditing',{
					clicksToMoveEditor: 2
				}),
				viewConfig : {
					trackOver : false,
					emptyText : '<h1 style="margin:20px">未找到任何记录！！！</h1>'
				},
				store: Ext.create('Ext.data.Store', {
					model : 'MyCms.model.Appendix',
					data : []
				}),
				columns : [ {
					xtype : 'rownumberer',
					width : 50,
					sortable : false
				},{
					text : "附件名称",
					dataIndex : 'name',
					flex : 3,
					sortable : false,
					editor: {
		                allowBlank: false
		            }
				}, {
					text : "附件说明",
					dataIndex : 'addition',
					flex : 3,
					sortable : false,
					editor: {
		                allowBlank: false
		            }
				},{
					text : "大小（Byte）",
					dataIndex : 'fileSize',
					flex : 1,
					sortable : false
				}, {
					text : "创建人",
					dataIndex : 'crUser',
					flex : 1,
					sortable : false
				}, {
					text : "创建时间",
					dataIndex : 'crTime',
					align : 'center',
					flex : 2,
					sortable : false
				} ],
				listeners:{
					"edit":function(editor,e){
						var record = e.record;
						if(record.dirty){
							Ext.Ajax.request({
								url : appendix_update,
								params : {
									id:record.get('id'),
									name:record.get('name'),
									addition:record.get('addition')
								},
								success : function(response, opts) {
									var obj = Ext.decode(response.responseText);
									if(obj.success){
										e.record.commit();
									}
									
								},
								failure : function(response, opts) {
									console.log('server-side failure with status code '
											+ response.status);
								}
							});
						}
						
					},
					"afterrender":function(){
						var grid = this;
						if(me.document&&!grid.hasLoadData){
							Ext.Ajax.request({
								url : appendix_list,
								params : {
									documentId : me.document.get('id'),
									type:grid._type
								},
								success : function(response, opts) {
									grid.hasLoadData = true;
									var obj = Ext.decode(response.responseText);
									if(obj&&obj.list){
										grid.getStore().add(obj.list);
									}
									
								},
								failure : function(response, opts) {
									grid.hasLoadData = true;
									console.log('server-side failure with status code '
											+ response.status);
								}
							});
						}
					},
					"itemcontextmenu":function( _this, record, item, index, e, eOpts){
						
						Ext.create('MyCms.view.ux.MyMenu',{
							items:[{
								text:'下载附件',
								handler:function(){
									me.download(record);
								},
								scope:me
							},{
								text:'删除',
								handler:function(){
									me.deleteApp(_this,record);
								},
								scope:me
							},{
								text:'插入到正文',
								handler:function(){
									me.insertApp2Doc(record);
								},
								scope:me
							}]
						}).showAt(e.getXY());
						
						e.stopEvent();
						e.stopPropagation();
					},
					"itemmouseenter":function(_this, record, item, index, e, eOpts){
						me.preview(record, e);
					},
					"itemmouseleave":function(){
						var appPreviewMenu = Ext.getCmp('app-preview-menu');
						if(appPreviewMenu){
							Ext.destroy(appPreviewMenu);
						}
					}
				}
			});
		}
		
		return items;
	},
	preview:function(record,e){
		var appPreviewMenu = Ext.getCmp('app-preview-menu');
		if(!appPreviewMenu){
			appPreviewMenu = Ext.create('MyCms.view.ux.MyMenu',{
				id:'app-preview-menu',
				items:[{
					xtype:'panel',
					width:272,
					height:212,
					title:'图片-'+record.get('fileName'),
					html:'<img id="picApp" src="'+RootPath+'/file/app/'+record.get('fileId')+'" width="272" />'
				}]
			}).showAt(e.getXY());
		}
		
	},
	download:function(record){
		window.open(RootPath+'/file/app/'+record.get('fileId'));
	},
	deleteApp:function(grid,record){
		var me = this;
		
		Ext.Msg.confirm('警告','你确定要删除此条记录？',function(m){
			if(m=='yes'){
				Ext.Ajax.request({
					url : appendix_delete,
					params : {
						id:record.get('id')
					},
					success : function(response, opts) {
						var obj = Ext.decode(response.responseText);
						if (!obj.success) {
							Ext.Msg.alert('错误', obj.message);
							return;
						}
						Ext.Msg.alert('提示', obj.message, function() {
							//me.fireEvent('refresh', me);
							grid.getStore().remove(record);
						});
					},
					failure : function(response, opts) {
						console.log('server-side failure with status code '
								+ response.status);
					}
				});
			}
		});
	}
	
	
});