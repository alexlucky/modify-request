var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var MRequestSchema = new Schema({
	req_id:String,
	owner_name: String,
	store_quota: Number,
	run_quota: Number,

	vm_name:String,
	vm_cpu:Number,
	vm_memory:Number,
	vm_disk_count:Number,
	vm_disks:[{disk_id:String,disk_size:String}],

	desc:String,
	req_timeframe:Number,
	submit_date: {type:Date,default:Date.now},
	approve_date: {type:Date,default:Date.now},
	restore_date: {type:Date,default:Date.now}

});
var MRequest = mongodb.mongoose.model("MRequest",MRequestSchema);
var MRequestDAP = function(){};
module.exports = new MovieDAO();