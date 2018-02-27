const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GameSchema = new Schema({
	grid: {
		type: [String],
    default: ['','','',
              '','','',
              '','','']
	}
},{timestamps: true}, {collection: 'game-collection'});

module.exports = mongoose.model('Game', GameSchema);
