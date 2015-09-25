var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var StoreArticleSchema = new Schema({
    user: String,
    user_id: String,
    article: String,
    articleData: Array
});

mongoose.model('Articles', StoreArticleSchema);