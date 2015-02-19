function DashboardController (UserService, API) {
	this.email = UserService.getUser().email
	var vm = this
	API.User.query(function (response) {
		vm.friends = response.friends
	})

	this.setFriend = UserService.setFriend
}
angular.module('Intercom')
       .controller('DashboardController', DashboardController)