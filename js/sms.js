var sms = {
	"Send SMS": function(data, options) {
		if (options.formData == true) {
			return "Phone Number"
		}

		return 1;
	},
	name: "SMS"
}