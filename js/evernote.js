var evernote = {
	"Create Text Note": function(data, options) {
		if (options.formData == true) {
			return ""
		}

		return 1;
	},
	"Create Image Note": function(data, options) {
		if (options.formData == true) {
			return ""
		}

		return 1;
	},
	"Create Audio Note": function(data, options) {
		if (options.formData == true) {
			return ""
		}

		return 1;
	},
	"Add to Existing Note": function(data, options) {
		if (options.formData == true) {
			return "<input type='text' placeholder='Note name' />"
		}

		return 1;
	},
	name: "Evernote"
};