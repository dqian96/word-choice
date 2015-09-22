var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var StoreArticleSchema = new Schema({
    analyzed_article: String
});

mongoose.model('Articles', StoreArticleSchema);