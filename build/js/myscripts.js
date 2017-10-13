function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

$(document).ready(function () {

	var products = [
		{id: 12, qty: 1},
		{id: 13, qty: 1},
		{id: 19, qty: 1},
		{id: 10, qty: 1},
		{id: 15, qty: 10}
	];

	// при изменении массива products

	setCookie('cart', JSON.stringify(products));
	console.log(document.cookie);

	// при выводе на экран

	function getCartTotalQty() {
		var productsRecieved = JSON.parse(getCookie('cart'));
		var totalQty = 0;
		productsRecieved.forEach(function(item) {
			totalQty += item.qty;
		});
		return totalQty;
	}

	$('#cart-total-qty').html(getCartTotalQty());

	var productsRecieved = JSON.parse(getCookie('cart'));


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibXlzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG5cdHZhciBkID0gbmV3IERhdGUoKTtcclxuXHRkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzKjI0KjYwKjYwKjEwMDApKTtcclxuXHR2YXIgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIisgZC50b1VUQ1N0cmluZygpO1xyXG5cdGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtwYXRoPS9cIjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lKSB7XHJcblx0dmFyIG5hbWUgPSBjbmFtZSArIFwiPVwiO1xyXG5cdHZhciBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XHJcblx0dmFyIGNhID0gZGVjb2RlZENvb2tpZS5zcGxpdCgnOycpO1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPGNhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgYyA9IGNhW2ldO1xyXG5cdFx0d2hpbGUgKGMuY2hhckF0KDApID09ICcgJykge1xyXG5cdFx0XHRjID0gYy5zdWJzdHJpbmcoMSk7XHJcblx0XHR9XHJcblx0XHRpZiAoYy5pbmRleE9mKG5hbWUpID09IDApIHtcclxuXHRcdFx0cmV0dXJuIGMuc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjLmxlbmd0aCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBcIlwiO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG5cdHZhciBwcm9kdWN0cyA9IFtcclxuXHRcdHtpZDogMTIsIHF0eTogMX0sXHJcblx0XHR7aWQ6IDEzLCBxdHk6IDF9LFxyXG5cdFx0e2lkOiAxOSwgcXR5OiAxfSxcclxuXHRcdHtpZDogMTAsIHF0eTogMX0sXHJcblx0XHR7aWQ6IDE1LCBxdHk6IDEwfVxyXG5cdF07XHJcblxyXG5cdC8vINC/0YDQuCDQuNC30LzQtdC90LXQvdC40Lgg0LzQsNGB0YHQuNCy0LAgcHJvZHVjdHNcclxuXHJcblx0c2V0Q29va2llKCdjYXJ0JywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG5cclxuXHQvLyDQv9GA0Lgg0LLRi9Cy0L7QtNC1INC90LAg0Y3QutGA0LDQvVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDYXJ0VG90YWxRdHkoKSB7XHJcblx0XHR2YXIgcHJvZHVjdHNSZWNpZXZlZCA9IEpTT04ucGFyc2UoZ2V0Q29va2llKCdjYXJ0JykpO1xyXG5cdFx0dmFyIHRvdGFsUXR5ID0gMDtcclxuXHRcdHByb2R1Y3RzUmVjaWV2ZWQuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHRvdGFsUXR5ICs9IGl0ZW0ucXR5O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdG90YWxRdHk7XHJcblx0fVxyXG5cclxuXHQkKCcjY2FydC10b3RhbC1xdHknKS5odG1sKGdldENhcnRUb3RhbFF0eSgpKTtcclxuXHJcblx0dmFyIHByb2R1Y3RzUmVjaWV2ZWQgPSBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxuXHJcblxyXG59KTsiXX0=
