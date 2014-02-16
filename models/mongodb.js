var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mrequests');
exports.mongoose = mongoose;
