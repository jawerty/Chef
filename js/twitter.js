var twitter = {
	"Create Tweet": function(data, options) {
		if (options.formData == true) {
			return ""
		}

		return 1;
	},
	"Send Direct Message": function(data, options) {
		if (options.formData == true) {
			return "<input type='text' placeholder='Recipient's username />"
		}

		return 1;
	},
	"Upload Profile Pic": function(data, options) {
		if (options.formData == true) {
			return ""
		}

		return 1;
	},
	"Update Bio": function(data, options) {
		if (options.formData == true) {
			return ""
		}

		return 1;
	},
	name: "Twitter"
};