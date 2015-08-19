Ext.define('MyCms.view.fieldvalue.Window', {
	extend : 'MyCms.view.ux.MyWindow',
	modal : true,
	width : 850,
	height : 590,
	title : '扩展字段',
	initComponent : function() {
		var me = this;

		me.form = Ext.create('MyCms.view.fieldvalue.Form', {
			from : me
		});
		var btns = [ {
			text : '确定',
			handler : 'onOk',
			scope : me
		}, {
			text : '重置',
			handler : 'okReset',
			scope : me
		} ];
		
		Ext.apply(me,{
			items:[me.form],
			buttons:btns
		});
		
		if(me.document){
			me.initDate();
		}

		me.callParent();
	},
	initDate:function(){
		var me = this,form = me.form.getForm(),fieldValues = me.document.get('fieldValues');
		for(var i=0;i<fieldValues.length;i++){
			var fieldValue = fieldValues[i],formField = form.findField(fieldValue.extField.name);
			formField.setValue(fieldValue.value);
			formField.fvId = fieldValue.id;
		}
		
	},
	onOk:function(){
		var me = this,form = me.form.getForm(),fields = me.channel.get('extFields'),rs = [];
		for(var i=0;i<fields.length;i++){
			var field = fields[i],f = form.findField(field.name);
			rs.push({
				"id":f.fvId,
				"extField.id" : field.id,
				"value" : field.type==4?f.formatDate(f.getValue()):f.getValue()
			});
		}
		me.from.fireEvent('extFieldComplete',me.from,me,rs);
	},
	okReset:function(){
		
	}
});