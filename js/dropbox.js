var dropbox = {
	"Create Text File": function(data, options) {
		if (options.formData == true) {
			return ""
		}

		return 1;
	},
	"Add to Existing File": function(data, options) {
		if (options.formData == true) {
			return "<input type='text' placeholder='File Name (from root)'/>"
		}

		return 1;
	},
	name: "Dropbox"
};