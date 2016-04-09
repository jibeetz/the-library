libraryApp.factory('getLibrary', ['$http', function($http){

	return $http.get('data/data.json');
}]);