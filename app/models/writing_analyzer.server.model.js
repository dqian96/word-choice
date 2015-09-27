//use mongoose as ODM 
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
//Schema/layout of document in Articles collection
var StoreArticleSchema = new Schema({
    user: String,
    user_id: String,
    article: String,
    articleData: Array
});

mongoose.model('Articles', StoreArticleSchema);