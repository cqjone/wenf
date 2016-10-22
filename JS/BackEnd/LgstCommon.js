function renameJsonKey(data, param) {
	for (var i = 0, len = data.length; i < len; i++) {
		for (var key in param) {
			data[i][param[key]] = data[i][key];
			delete data[i][key];
		}
	}
}

function formatDigits(value) {
	return Ext.util.Format.number(value, '0,000');
}

function fuzzyQuery(qe) {
	var combo = qe.combo;
    var q = qe.query;
    var forceAll = qe.forceAll;
    if (forceAll === true || (q.length >= this.minChars)) {
        if (this.lastQuery !== q) {
            this.lastQuery = q;
            if (this.mode == 'local') {
                this.selectedIndex = -1;
                if (forceAll) {
                    this.store.clearFilter();
                } else {
                    // 检索的正则
                    var regExp = new RegExp(".*" + q + ".*", "i");
                    // 执行检索
                    this.store.filterBy(function(record, id) {
                        // 得到每个record的项目名称值
                        var text = record.get(combo.displayField);
                        return regExp.test(text);
                    });
                }
                this.onLoad();
            } else {
                this.store.baseParams[this.queryParam] = q;
                this.store.load({
                    params: this.getParams(q)
                });
                this.expand();
            }
        } else {
            this.selectedIndex = -1;
            this.onLoad();
        }
    }
    return false;
}