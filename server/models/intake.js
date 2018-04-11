var mongoose     = require('mongoose');
var moment       = require('moment');
var Schema       = mongoose.Schema;

var IntakeSchema   = new Schema({
    baby: {type: Schema.Types.ObjectId, ref: 'Baby'},
    start_time: {
      type: Date, 
      default: Date.now
    },
    end_time: Date,
    type: {
      type: String,
      enum: ['Breast', 'Bottle'],
      required: true
    },
    breast: {
      type: String,
      enum: ['Left', 'Right'],
    },
    quantity: {
      type: Number,
      default: 0
    }

    
});

module.exports = mongoose.model('Intake', IntakeSchema);
