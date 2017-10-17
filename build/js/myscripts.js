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

function addProductToCart (id, inputQty) {
	let qty = +inputQty;

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
		console.log(document.cookie);
	};

	if (getCookie("cart") !== "") {
		setProductsCookie();
	} else {
		setCookie('cart', JSON.stringify([]));
		setProductsCookie();
	}

	showCartTotalQty();
}




function addProductToCart2 (id, inputQty) {
	let qty = +inputQty;

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
		console.log(document.cookie);
	};

	if (getCookie("cart") !== "") {
		setProductsCookie();
	} else {
		setCookie('cart', JSON.stringify([]));
		setProductsCookie();
	}

	showCartTotalQty();
}







function updateCartItem (id, qty) {
	let products = JSON.parse(getCookie('cart'));
	if (products.length !== 0) {
		let indexToUpdate;
		products.forEach(function(item, index) {
			if (item.id === id) {
				indexToUpdate = index;
			}
		});
		if (qty === 'remove') {
			products.splice(indexToUpdate, 1);
			if (products.length === 0) {
				$('#fc-cart').empty();
				$('#fc-cart-empty').show();
			}
		} else {
			if (Number.isInteger(qty) && qty > 0) {
				products[indexToUpdate] = {id: id, qty: qty};
			}
		}
		indexToUpdate = undefined;
		setCookie('cart', JSON.stringify(products));
		console.log(document.cookie);
		showCartTotalQty();
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

	$('#add-to-cart-btn').click(function () {
		let id = +$(this).attr('data-item_id');
		let qty = +$('#cart-product-qty').val();

		if (Number.isInteger(qty) && qty > 0) {
			addProductToCart(id, qty);
		}
	});

	$('.fc-cart-remove').click(function () {
		let id = +$(this).attr('data-item_id');
		updateCartItem(id, 'remove');
		$(this).closest('tr').remove();
	});

	$('.fc-cart-qty').change(function () {
		let id = +$(this).attr('data-item_id');
		let qty = +$(this).val();

		if (Number.isInteger(qty) && qty > 0) {
			updateCartItem(id, qty);
		} else {
			$(this).val('1');
			updateCartItem(id, 1);
		}
	});

	console.log(document.cookie);
	showCartTotalQty();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb2tpZS1jYXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJteXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzZXRDb29raWUoY25hbWUsIGN2YWx1ZSwgZXhkYXlzKSB7XHJcblx0dmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG5cdGQuc2V0VGltZShkLmdldFRpbWUoKSArIChleGRheXMqMjQqNjAqNjAqMTAwMCkpO1xyXG5cdHZhciBleHBpcmVzID0gXCJleHBpcmVzPVwiKyBkLnRvVVRDU3RyaW5nKCk7XHJcblx0ZG9jdW1lbnQuY29va2llID0gY25hbWUgKyBcIj1cIiArIGN2YWx1ZSArIFwiO1wiICsgZXhwaXJlcyArIFwiO3BhdGg9L1wiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDb29raWUoY25hbWUpIHtcclxuXHR2YXIgbmFtZSA9IGNuYW1lICsgXCI9XCI7XHJcblx0dmFyIGRlY29kZWRDb29raWUgPSBkZWNvZGVVUklDb21wb25lbnQoZG9jdW1lbnQuY29va2llKTtcclxuXHR2YXIgY2EgPSBkZWNvZGVkQ29va2llLnNwbGl0KCc7Jyk7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8Y2EubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBjID0gY2FbaV07XHJcblx0XHR3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSB7XHJcblx0XHRcdGMgPSBjLnN1YnN0cmluZygxKTtcclxuXHRcdH1cclxuXHRcdGlmIChjLmluZGV4T2YobmFtZSkgPT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIFwiXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFByb2R1Y3RUb0NhcnQgKGlkLCBpbnB1dFF0eSkge1xyXG5cdGxldCBxdHkgPSAraW5wdXRRdHk7XHJcblxyXG5cdGxldCBzZXRQcm9kdWN0c0Nvb2tpZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBwcm9kdWN0cyA9IEpTT04ucGFyc2UoZ2V0Q29va2llKCdjYXJ0JykpO1xyXG5cdFx0aWYgKHByb2R1Y3RzLmxlbmd0aCAhPT0gMCkge1xyXG5cdFx0XHRsZXQgaXNUaGVTYW1lUHJvZHVjdCA9IGZhbHNlO1xyXG5cdFx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuXHRcdFx0XHRcdGl0ZW0ucXR5ICs9IHF0eTtcclxuXHRcdFx0XHRcdGlzVGhlU2FtZVByb2R1Y3QgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGlmICghaXNUaGVTYW1lUHJvZHVjdCkge1xyXG5cdFx0XHRcdHByb2R1Y3RzLnB1c2goe2lkOiBpZCwgcXR5OiBxdHl9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJvZHVjdHMucHVzaCh7aWQ6IGlkLCBxdHk6IHF0eX0pO1xyXG5cdFx0fVxyXG5cdFx0c2V0Q29va2llKCdjYXJ0JywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpKTtcclxuXHRcdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcblx0fTtcclxuXHJcblx0aWYgKGdldENvb2tpZShcImNhcnRcIikgIT09IFwiXCIpIHtcclxuXHRcdHNldFByb2R1Y3RzQ29va2llKCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHNldENvb2tpZSgnY2FydCcsIEpTT04uc3RyaW5naWZ5KFtdKSk7XHJcblx0XHRzZXRQcm9kdWN0c0Nvb2tpZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvd0NhcnRUb3RhbFF0eSgpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBhZGRQcm9kdWN0VG9DYXJ0MiAoaWQsIGlucHV0UXR5KSB7XHJcblx0bGV0IHF0eSA9ICtpbnB1dFF0eTtcclxuXHJcblx0bGV0IHNldFByb2R1Y3RzQ29va2llID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHByb2R1Y3RzID0gSlNPTi5wYXJzZShnZXRDb29raWUoJ2NhcnQnKSk7XHJcblx0XHRpZiAocHJvZHVjdHMubGVuZ3RoICE9PSAwKSB7XHJcblx0XHRcdGxldCBpc1RoZVNhbWVQcm9kdWN0ID0gZmFsc2U7XHJcblx0XHRcdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRcdFx0aXRlbS5xdHkgKz0gcXR5O1xyXG5cdFx0XHRcdFx0aXNUaGVTYW1lUHJvZHVjdCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKCFpc1RoZVNhbWVQcm9kdWN0KSB7XHJcblx0XHRcdFx0cHJvZHVjdHMucHVzaCh7aWQ6IGlkLCBxdHk6IHF0eX0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcm9kdWN0cy5wdXNoKHtpZDogaWQsIHF0eTogcXR5fSk7XHJcblx0XHR9XHJcblx0XHRzZXRDb29raWUoJ2NhcnQnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0cykpO1xyXG5cdFx0Y29uc29sZS5sb2coZG9jdW1lbnQuY29va2llKTtcclxuXHR9O1xyXG5cclxuXHRpZiAoZ2V0Q29va2llKFwiY2FydFwiKSAhPT0gXCJcIikge1xyXG5cdFx0c2V0UHJvZHVjdHNDb29raWUoKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2V0Q29va2llKCdjYXJ0JywgSlNPTi5zdHJpbmdpZnkoW10pKTtcclxuXHRcdHNldFByb2R1Y3RzQ29va2llKCk7XHJcblx0fVxyXG5cclxuXHRzaG93Q2FydFRvdGFsUXR5KCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNhcnRJdGVtIChpZCwgcXR5KSB7XHJcblx0bGV0IHByb2R1Y3RzID0gSlNPTi5wYXJzZShnZXRDb29raWUoJ2NhcnQnKSk7XHJcblx0aWYgKHByb2R1Y3RzLmxlbmd0aCAhPT0gMCkge1xyXG5cdFx0bGV0IGluZGV4VG9VcGRhdGU7XHJcblx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRcdGluZGV4VG9VcGRhdGUgPSBpbmRleDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRpZiAocXR5ID09PSAncmVtb3ZlJykge1xyXG5cdFx0XHRwcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1VwZGF0ZSwgMSk7XHJcblx0XHRcdGlmIChwcm9kdWN0cy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHQkKCcjZmMtY2FydCcpLmVtcHR5KCk7XHJcblx0XHRcdFx0JCgnI2ZjLWNhcnQtZW1wdHknKS5zaG93KCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHRcdHByb2R1Y3RzW2luZGV4VG9VcGRhdGVdID0ge2lkOiBpZCwgcXR5OiBxdHl9O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpbmRleFRvVXBkYXRlID0gdW5kZWZpbmVkO1xyXG5cdFx0c2V0Q29va2llKCdjYXJ0JywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpKTtcclxuXHRcdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcblx0XHRzaG93Q2FydFRvdGFsUXR5KCk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0VG90YWxRdHkgKCkge1xyXG5cdGlmIChnZXRDb29raWUoXCJjYXJ0XCIpICE9PSBcIlwiKSB7XHJcblx0XHRsZXQgcHJvZHVjdHMgPSBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxuXHRcdGxldCB0b3RhbFF0eSA9IDA7XHJcblx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dG90YWxRdHkgKz0gaXRlbS5xdHk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0b3RhbFF0eTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93Q2FydFRvdGFsUXR5ICgpIHtcclxuXHQkKCcjY2FydC10b3RhbC1xdHknKS5odG1sKGdldENhcnRUb3RhbFF0eSgpKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuXHQkKCcjYWRkLXRvLWNhcnQtYnRuJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGlkID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRsZXQgcXR5ID0gKyQoJyNjYXJ0LXByb2R1Y3QtcXR5JykudmFsKCk7XHJcblxyXG5cdFx0aWYgKE51bWJlci5pc0ludGVnZXIocXR5KSAmJiBxdHkgPiAwKSB7XHJcblx0XHRcdGFkZFByb2R1Y3RUb0NhcnQoaWQsIHF0eSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoJy5mYy1jYXJ0LXJlbW92ZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICskKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9pZCcpO1xyXG5cdFx0dXBkYXRlQ2FydEl0ZW0oaWQsICdyZW1vdmUnKTtcclxuXHRcdCQodGhpcykuY2xvc2VzdCgndHInKS5yZW1vdmUoKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLmZjLWNhcnQtcXR5JykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICskKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9pZCcpO1xyXG5cdFx0bGV0IHF0eSA9ICskKHRoaXMpLnZhbCgpO1xyXG5cclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgcXR5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykudmFsKCcxJyk7XHJcblx0XHRcdHVwZGF0ZUNhcnRJdGVtKGlkLCAxKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Y29uc29sZS5sb2coZG9jdW1lbnQuY29va2llKTtcclxuXHRzaG93Q2FydFRvdGFsUXR5KCk7XHJcbn0pOyJdfQ==
