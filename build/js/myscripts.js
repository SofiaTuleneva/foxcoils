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



function addProductToCart (id, qty) {

	let setProductsCookie = function () {
		let products = JSON.parse(getCookie('cart'));
		if (products.length !== 0) {
			let isTheSameProduct = false;
			products.forEach(function(item) {
				if (item.id === id) {
					item.qty += qty;
					isTheSameProduct = true;
				}
			});
			if (!isTheSameProduct) {
				products.push({id: id, qty: qty});
			}
		} else {
			products.push({id: id, qty: qty});
		}
		setCookie('cart', JSON.stringify(products));
	};

	if (getCookie("cart") !== "") {
		setProductsCookie();
	} else {
		setCookie('cart', JSON.stringify([]));
		setProductsCookie();
	}

	showCartTotalQty();
}


function getCartProducts () {
	if (getCookie("cart") !== "") {
		return JSON.parse(getCookie('cart'));
	}
}


function getCartTotalQty () {
	if (getCookie("cart") !== "") {
		let products = JSON.parse(getCookie('cart'));
		let totalQty = 0;
		products.forEach(function(item) {
			totalQty += item.qty;
		});
		return totalQty;
	} else {
		return 0;
	}
}

function showCartTotalQty () {
	$('#cart-total-qty').html(getCartTotalQty());
}


$(document).ready(function () {
	console.log(document.cookie);
	showCartTotalQty();
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibXlzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG5cdHZhciBkID0gbmV3IERhdGUoKTtcclxuXHRkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzKjI0KjYwKjYwKjEwMDApKTtcclxuXHR2YXIgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIisgZC50b1VUQ1N0cmluZygpO1xyXG5cdGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtwYXRoPS9cIjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lKSB7XHJcblx0dmFyIG5hbWUgPSBjbmFtZSArIFwiPVwiO1xyXG5cdHZhciBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XHJcblx0dmFyIGNhID0gZGVjb2RlZENvb2tpZS5zcGxpdCgnOycpO1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPGNhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgYyA9IGNhW2ldO1xyXG5cdFx0d2hpbGUgKGMuY2hhckF0KDApID09ICcgJykge1xyXG5cdFx0XHRjID0gYy5zdWJzdHJpbmcoMSk7XHJcblx0XHR9XHJcblx0XHRpZiAoYy5pbmRleE9mKG5hbWUpID09IDApIHtcclxuXHRcdFx0cmV0dXJuIGMuc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjLmxlbmd0aCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBcIlwiO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZFByb2R1Y3RUb0NhcnQgKGlkLCBxdHkpIHtcclxuXHJcblx0bGV0IHNldFByb2R1Y3RzQ29va2llID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHByb2R1Y3RzID0gSlNPTi5wYXJzZShnZXRDb29raWUoJ2NhcnQnKSk7XHJcblx0XHRpZiAocHJvZHVjdHMubGVuZ3RoICE9PSAwKSB7XHJcblx0XHRcdGxldCBpc1RoZVNhbWVQcm9kdWN0ID0gZmFsc2U7XHJcblx0XHRcdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRcdFx0aXRlbS5xdHkgKz0gcXR5O1xyXG5cdFx0XHRcdFx0aXNUaGVTYW1lUHJvZHVjdCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKCFpc1RoZVNhbWVQcm9kdWN0KSB7XHJcblx0XHRcdFx0cHJvZHVjdHMucHVzaCh7aWQ6IGlkLCBxdHk6IHF0eX0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcm9kdWN0cy5wdXNoKHtpZDogaWQsIHF0eTogcXR5fSk7XHJcblx0XHR9XHJcblx0XHRzZXRDb29raWUoJ2NhcnQnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0cykpO1xyXG5cdH07XHJcblxyXG5cdGlmIChnZXRDb29raWUoXCJjYXJ0XCIpICE9PSBcIlwiKSB7XHJcblx0XHRzZXRQcm9kdWN0c0Nvb2tpZSgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzZXRDb29raWUoJ2NhcnQnLCBKU09OLnN0cmluZ2lmeShbXSkpO1xyXG5cdFx0c2V0UHJvZHVjdHNDb29raWUoKTtcclxuXHR9XHJcblxyXG5cdHNob3dDYXJ0VG90YWxRdHkoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldENhcnRQcm9kdWN0cyAoKSB7XHJcblx0aWYgKGdldENvb2tpZShcImNhcnRcIikgIT09IFwiXCIpIHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0VG90YWxRdHkgKCkge1xyXG5cdGlmIChnZXRDb29raWUoXCJjYXJ0XCIpICE9PSBcIlwiKSB7XHJcblx0XHRsZXQgcHJvZHVjdHMgPSBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxuXHRcdGxldCB0b3RhbFF0eSA9IDA7XHJcblx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dG90YWxRdHkgKz0gaXRlbS5xdHk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0b3RhbFF0eTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93Q2FydFRvdGFsUXR5ICgpIHtcclxuXHQkKCcjY2FydC10b3RhbC1xdHknKS5odG1sKGdldENhcnRUb3RhbFF0eSgpKTtcclxufVxyXG5cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG5cdHNob3dDYXJ0VG90YWxRdHkoKTtcclxufSk7XHJcblxyXG4iXX0=
