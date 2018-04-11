var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OutputSchema   = new Schema({
    baby: {type: Schema.Types.ObjectId, ref: 'Baby'},
    time: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['Poo', 'Pee', 'Both'],
      required: true
    },
    remarks: String

    
});

module.exports = mongoose.model('Output', OutputSchema);
