var dropbox = {
	"Create Text File": function(data, options) {
		if (options.formData == true) {

		}

		return 1;
	},
	"Add to Existing File": function(data, options) {
		if (options.formData == true) {
			return "Access File"
		}

		return 1;
	},
	name: "Dropbox"
};