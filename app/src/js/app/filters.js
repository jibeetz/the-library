libraryApp.filter('startsWithLetter', function(){
	return function (items, letter){

		var filtered = [],
			letterMatch = letter.toLowerCase();

		angular.forEach(items, function(item){
			if(!letterMatch || item.title.charAt(0).toLowerCase() == letterMatch)
				filtered.push(item);
		});
		return filtered;
	};
});

libraryApp.filter('languages', function(){

	return function(input, lgs){
		var out = [];
		angular.forEach(input, function(book){
			if(lgs.length > 0){
				for (var i = 0, len = book.langs.length; i < len; i++) {
					if(lgs.indexOf(book.langs[i].name) > -1){
						out.push(book);
						if(len > 1)
							break;
					}
				};
			}else{
				out.push(book);
			}
		});
		return out;
	}
});

libraryApp.filter('categories', function(){

	return function(input, cats){
		var out = [];
		angular.forEach(input, function(book){
			if(cats.length > 0){
				if(cats.indexOf(book.cat) > -1)
					out.push(book);
			}else{
				out.push(book);
			}
		});
		return out;
	}
});