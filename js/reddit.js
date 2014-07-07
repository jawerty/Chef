var reddit = {
	"Submit Text Post": function(data, options) {
		if (options.formData == true) {
			return "<input type='text' placeholder='Subreddit' />"
		}

		return 1;
	},
	"Submit Link Post": function(data, options) {
		if (options.formData == true) {
			return "<input type='text' placeholder='Subreddit' />"
		}
		
		return 1;
	},
	name: "Reddit"
}
