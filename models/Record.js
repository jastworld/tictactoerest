const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RecordSchema = new Schema({
  userId:{
       type: Schema.ObjectId
  },
  recordId: {
    type: Number,
    default: 0
  },
	grid: {
		type: [String],
	},
  winner:{
    type: String,
  }
},{timestamps: true}, {collection: 'game-collection'});

module.exports = mongoose.model('Record', RecordSchema);
