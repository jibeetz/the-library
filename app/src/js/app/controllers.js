var libraryCtrls = angular.module('libraryCtrls', []);

libraryCtrls.controller('booksCtrl', ['$scope', '$http', 'getLibrary', 'langDefault', function($scope, $http, getLibrary, langDefault){

	$scope.pageTitle = 'The Library';

	getLibrary.success(function(d){
		$scope.books = d.books;

		$scope.langsList = d.languages;
		$scope.langsList[langDefault]['selected'] = true;

		$scope.catsList = d.categories;
	});

	$scope.clearSearch = function(){
		$scope.keyword = '';
	}

	// Categories
	$scope.cats = [];
	$scope.inCat = function(cat){
		var i = $scope.cats.indexOf(cat);

		if(i > -1){
			$scope.cats.splice(i, 1);
		}else{
			$scope.cats.push(cat);
		}
	}

	// Langs
	$scope.lgs = [langDefault];
	$scope.inLang = function(lang){
		var i = $scope.lgs.indexOf(lang);
		if(i > -1){
			$scope.lgs.splice(i, 1);
		}else{
			$scope.lgs.push(lang);
		}
	}

	$scope.resetFilters = function(){
		$scope.keyword = '';
		$scope.cats = [];
		angular.forEach($scope.catsList, function (cat) {
			cat.selected = false;
		});
		$scope.lgs = [];
		angular.forEach($scope.langsList, function (lang) {
			lang.selected = false;
		});
	}

	$scope.alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

	$scope.activeLetter = '';
	$scope.setActiveLetter = function(letter){
		$scope.activeLetter = letter;
	}

	// Alphabet disabling
	$scope.letterState = function(letter){

		var lettersList = [];

		angular.forEach($scope.filteredBooks, function(book){
			var firstLetter = book.title.charAt(0).toLowerCase();
			lettersList.push(firstLetter);
		});

		for (var i = 0; i < lettersList.length - 1; i++){
			if(lettersList[i + 1] == lettersList[i]){
				var index = lettersList.indexOf(lettersList[i]);
				if (index > -1)
					lettersList.splice(index, 1);
			}
		}
		if(lettersList.length < 2)
			return true;

		return (lettersList.indexOf(letter) > -1) ? false : true;
	}

	// Category disabling
	$scope.catState = function(cat){

		var booksWithCat = [];
		angular.forEach($scope.books, function(book){
			if(book.cat == cat)
				booksWithCat.push(book);
		});

		if(!booksWithCat.length)
			return true;

		//------------------------------------------------

		var langsCheck = function(booksSrc){
			var langsWithCat = [],
				catBool = true;
			angular.forEach(booksSrc, function(book){
				angular.forEach(book.langs, function(lang){
					langsWithCat.push(lang.name);
				});
			});
			angular.forEach($scope.lgs, function(lang){
				if(langsWithCat.indexOf(lang) > -1){
					catBool =  false;
				}
			});
			return catBool;
		}

		var isCatLangFn = function(){
			return ($scope.lgs.length) ? langsCheck(booksWithCat) : true;
		}

		var isCatLangLetterFn = function(booksWithLetter){
			return (booksWithLetter.length) ? langsCheck(booksWithLetter) : true;
		}

		var isCatLetterFn = function(){
			var isCatLetter = true,
				booksWithLetter = [];
			if($scope.activeLetter.length){
				angular.forEach(booksWithCat, function(book){
					var firstLetter = book.title.charAt(0).toLowerCase();
					if(firstLetter == $scope.activeLetter){
						booksWithLetter.push(book);
						isCatLetter = false;
					}
				});
			}else{
				isCatLetter = false;
			}
			return [isCatLetter, booksWithLetter];
		}

		var lettersLength = $scope.activeLetter.length,
			langsLength = $scope.lgs.length,
			isCat = false;

		if(!lettersLength && langsLength)
			isCat = isCatLangFn();

		if(lettersLength && !langsLength)
			isCat = isCatLetterFn()[0];

		if(lettersLength && langsLength){
			isCat = isCatLangLetterFn(isCatLetterFn()[1]);
		}

		// ------------------------------------------
		// If there is only one result, then disable all.
		$scope.catsList[cat]['disabled'] = (isCat) ? false : true;
		var	enabledCatsLength = 0;
		angular.forEach($scope.catsList, function(catBool){
			if(catBool.disabled == true)
				enabledCatsLength = enabledCatsLength + 1;
		});
		if(enabledCatsLength == 1)
			return true;
		// ------------------------------------------

		return isCat;
	}

	$scope.langState = function(lang){

		var booksWithLang = [];
		angular.forEach($scope.books, function(book){
			angular.forEach(book.langs, function(langItem){
				if(langItem.name == lang){
					booksWithLang.push(book);
				}
			});
		});

		if(!booksWithLang.length)
			return true;

		//-------------------------------------------------

		var isLangCatFn = function(book, langBool){
			if($scope.cats.indexOf(book.cat) > -1)
				langBool = false;

			return langBool;
		}

		var isLangLetterFn = function(book, langBool){
			if($scope.activeLetter == book.title.charAt(0).toLowerCase())
				langBool = false;
			return langBool;
		}

		var isLangFn = function(filter){
			var langBool = true;
			angular.forEach(booksWithLang, function(book){
				langBool = (filter == 'cat') ? isLangCatFn(book, langBool) : isLangLetterFn(book, langBool);
			});
			return langBool;
		}

		var isLangCatLetterFn = function(){
			var langBool = true,
				booksWithLangsLetter = [];
			angular.forEach(booksWithLang, function(book){
				if($scope.activeLetter == book.title.charAt(0).toLowerCase())
					booksWithLangsLetter.push(book);
			});
			angular.forEach(booksWithLangsLetter, function(book){
				if($scope.cats.indexOf(book.cat) > -1)
					langBool = false;
			});
			return langBool;
		}

		var lettersLength = $scope.activeLetter.length,
			catsLength = $scope.cats.length,
			isLang = false;

		if(!lettersLength && catsLength)
			isLang = isLangFn('cat');

		if(lettersLength && !catsLength)
			isLang = isLangFn('letter');

		if(lettersLength && catsLength){
			isLang = isLangCatLetterFn();
		}

		// ------------------------------------------
		// If there is only one result, then disable all.
		$scope.langsList[lang]['disabled'] = (isLang) ? false : true;

		var	enabledLangsLength = 0;

		angular.forEach($scope.langsList, function(langBool){
			if(langBool.disabled == true)
				enabledLangsLength = enabledLangsLength + 1;
		});

		if(enabledLangsLength == 1)
			return true;
		// ------------------------------------------

		return isLang;
	}
}]);