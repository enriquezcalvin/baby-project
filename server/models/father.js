var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FatherSchema   = new Schema({
    name: String,
    baby: {type: Schema.Types.ObjectId, ref: 'Baby'}
    
});

module.exports = mongoose.model('Father', FatherSchema);
