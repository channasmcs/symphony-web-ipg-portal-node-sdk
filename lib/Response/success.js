function GenericSuccess(data, code) {
	this.type = 'success';
    this.data = data;
	this.responseCode = code;
}

module.exports = GenericSuccess;
