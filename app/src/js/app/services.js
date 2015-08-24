libraryApp.factory('getLibrary', ['$http', function($http){

	return $http.get('http://www.libinst.ch/json/books.php');
}]);