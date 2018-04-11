var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BabySchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Baby', BabySchema);
