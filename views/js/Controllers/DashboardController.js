function DashboardController (UserService) {
	this.email = UserService.getUser().email
}
angular.module('Intercom')
       .controller('DashboardController', DashboardController)