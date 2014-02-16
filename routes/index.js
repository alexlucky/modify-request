
/*
 * GET home page.
 */
//var logger = require('../app').logger('index');

exports.index = function(req, res){
//logger.info("This is an index page!");
  res.render('index', { title: 'Modify Request' });
};
exports.login = function(req, res){
res.render('login', { title: 'login'});
};
exports.doLogin = function(req, res){
var user={
username:'admin',
password:'admin',
store_quota:4,
run_quota:3
}

//we can get the credential from ldap db
if(req.body.username===user.username && req.body.password===user.password){
	req.session.user=user;
	return res.redirect('/modify-request');
}else {
	req.session.error='User Name or Password is incorrect!';
	return res.redirect('/login');
}

};
exports.logout = function(req, res){
	req.session.user=null; //clear all session data
res.redirect('/');
};
exports.mrequest = function(req, res){
	var quota={
	store_quota:4,
	store_vm:4,
	run_quota:3,
	run_vm:2
	}
	var disk1 ={
		disk_id:2,
		disk_size:100
	}
	var disk2 = {
		disk_id:3,
		disk_size:120
	}
	var vm1 = {
		vm_id:1,
		vm_name:"vm_test1",
		vm_cpu:1,
		vm_memory:10,
		vm_disk_count:2,
		vm_disks:[disk1,disk2],
	}
	var vm2 = {
		vm_id:2,
		vm_name:"vm_test2",
		vm_cpu:1,
		vm_memory:10,
		vm_disk_count:2,
		vm_disks:[disk1,disk2],
	}
	var vm_array = new Array(quota.store_vm - quota.run_vm);
	vm_array[0] = vm1;
	vm_array[1] = vm2;

res.render('Modify-Request', { title: 'Modify Request',quota:quota,vm_array:vm_array});
};
