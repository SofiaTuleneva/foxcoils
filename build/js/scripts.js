function setCookie(cname, cvalue, exdays) {
	let d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCart(cvalue) {
	setCookie('cart', JSON.stringify(cvalue));
}

function getCart() {
	return JSON.parse(getCookie('cart'));
}

function removeCartItem (id) {
	let products = getCart();
	let indexToUpdate;
	products.forEach(function(item, index) {
		if (item.id === id) {
			indexToUpdate = index;
		}
	});
	products.splice(indexToUpdate, 1);
	setCart(products);
	if (products.length === 0) {
		$('#fc-cart').empty();
		$('#fc-cart-empty').show();
	}
	console.log(document.cookie);
}

function getCartTotalQty () {
	if (getCookie("cart") !== "") {
		let products = getCart();
		let totalQty = 0;
		products.forEach(function(item) {
			totalQty += item.qty;
		});
		return totalQty;
	} else {
		return 0;
	}
}

function showHeaderCartTotalQty () {
	$('#cart-total-qty').html(getCartTotalQty());
}

function addCartItem (id, product, qty, options) {
	let products = getCart();
	let existsInCart = false;
	products.forEach(function(item) {
		if (item.id === id) {
			item.qty += qty;
			existsInCart = true;
		}
	});
	if (!existsInCart) {
		products.push({
			id: id,
			product: product,
			qty: qty,
			options: options
		});
	}
	setCart(products);
	console.log(document.cookie);
}

function updateCartItem (id, qty) {
	let products = getCart();
	let indexToUpdate;
	products.forEach(function(item, index) {
		if (item.id === id) {
			indexToUpdate = index;
		}
	});
	products[indexToUpdate].qty = qty;
	setCart(products);
	console.log(document.cookie);
}

function updateCartTotals() {
	let totalPrice = 0;
	$('.fc-item-total').each(function () {
		let qty = +$(this).parents('.fc-cart-item').find('.fc-cart-qty').first().val();
		let price = +$(this).attr('data-item_price');
		// item total
		$(this).html(qty * price);
		totalPrice += +$(this).html();
	});
	let shippingPrice = +$('#fc-cart-shipping').html();
	// total
	$('#fc-cart-total').html(totalPrice);

	// total with shipping
	$('#fc-cart-total-with-shipping').html(totalPrice + shippingPrice);
}

function showShippingTotal(val) {
	$('#fc-cart-shipping').html(val);
}

function scrollTop() {
	$('body, html').animate({scrollTop: 0}, 300);
}

function scrollToAddFrom() {
	$('html, body').animate({ scrollTop: $('#fc-scroll').offset().top }, 500);
}

$(document).ready(function () {
	if (getCookie('cart') === "") {
		setCart([]);
	}

	let optionsAlert = $('#product-add-options-alert');
	let alertSuccess = $('#product-add-alert-success');

	if (window.location.hash === '#addtocart') {
		$('.fc-cart-option').each(function () {
			$(this).closest('.form-group').addClass('has-error');
			optionsAlert.show();
		});
	}

	// add to cart
	$('#add-to-cart-btn').click(function () {
		optionsAlert.hide();
		alertSuccess.hide();
		$('.form-group').removeClass('has-error');


		let emptyOptions = $('.fc-cart-option option:selected[value=0]');
		if (emptyOptions.length > 0) {
			emptyOptions.each(function () {
				$(this).closest('.form-group').addClass('has-error');
			});
			optionsAlert.fadeIn(1000);
			return false;
		}


		let product = +$(this).attr('data-item_id');
		let qty = +$('#cart-product-qty').val();

		// check options
		let options = {};

		$('.fc-cart-option').each(function () {
			let name = $(this).attr('data-option_id');
			options[name] = +$(this).val();
		});

		let id = product;
		for (let key in options) {
			id += ('_' + options[key]);
		}
		if (Number.isInteger(qty) && qty > 0) {
			addCartItem(id, product, qty, options);
			alertSuccess.fadeIn(1000);
		}

		// clear add form
		$('#cart-product-qty').val('1');
		showHeaderCartTotalQty();
	});

	// remove item
	$('.fc-btn-remove').click(function () {
		let id = $(this).attr('data-item_id');
		removeCartItem(id);
		$(this).closest('.fc-cart-item').remove();
		updateCartTotals();
		showHeaderCartTotalQty();
	});

	// update item qty
	$('.fc-cart-qty').keyup(function () {
		let id = $(this).attr('data-item_id');
		let qty = +$(this).val();
		if (Number.isInteger(qty) && qty > 0) {
			updateCartItem(id, qty);
		} else {
			$(this).val(1);
			updateCartItem(id, 1);
		}
		updateCartTotals();
		showHeaderCartTotalQty();
	});

	$('.fc-shipping-method').change(function () {
		showShippingTotal($(this).val());
		updateCartTotals();
		$('#city').parents('.form-group').removeClass('has-error');
		$('#choose-city-alert').hide();
		$('#country-field').hide();
	});

	$('#cdek').change(function () {
		if ($('#city').attr('data-selected') == 0) {
			showCityErrorAlert();
		}
	});

	$('#city').keyup(function () {
		$(this).attr('data-selected', 0);
		$('#cdek').val('?');

		if ($('#cdek:checked').length) {
			showCityErrorAlert();
			showShippingTotal($('#cdek').val());
			updateCartTotals();
		}
	});

	$('#abroad').change(function () {
		$('#country-field').fadeIn();
	});

	console.log(document.cookie);
	showShippingTotal($('.fc-shipping-method:checked').val());
	updateCartTotals();
	showHeaderCartTotalQty();
});


function showCityErrorAlert() {
	$('#city').parents('.form-group').addClass('has-error');
	$('#choose-city-alert').fadeIn();
}

function removeCityErrorAlert() {
	$('#city').parents('.form-group').removeClass('has-error');
	$('#choose-city-alert').hide();
}

/**
 * автокомплит
 * подтягиваем список городов ajax`ом, данные jsonp в зависмости от введённых символов
 */
$(function() {
	$("#city").autocomplete({
		source : function(request, response) {
			$.ajax({
				url : "http://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
				dataType : "jsonp",
				data : {
					q : function() {
						return $("#city").val()
					},
					name_startsWith : function() {
						return $("#city").val()
					}
				},
				success : function(data) {
					response($.map(data.geonames, function(item) {
						return {
							label : item.name,
							value : item.name,
							id : item.id,
							regionId : item.regionId,
							countryId : item.countryId
						}
					}));
				}
			});
		},
		minLength : 1,
		select : function(event, ui) {
			// set flag

			$('#city').attr('data-selected', +ui.item.id);

			removeCityErrorAlert();

			// get price

			let specialPriceRegions = [59, 6, 13, 55];
			const DEFAULT_PRICE = 250;
			const SPECIAL_PRICE = 700;
			const ABROAD_PRICE = 1000;
			let price;
			if (+ui.item.countryId !== 1) {
				price = ABROAD_PRICE;
			} else if (specialPriceRegions.indexOf(+ui.item.regionId) !== -1) {
				price = SPECIAL_PRICE;
			} else {
				price = DEFAULT_PRICE;
			}

			// show price

			$('#cdek').val(price);

			if ($('#cdek:checked').length) {
				showShippingTotal(price);
				updateCartTotals();
			}
		}
	});

//		/**
//		 * ajax-запрос на сервер для получения информации по доставке
//		 */
//		$('#cdek').submit(function() {
//
//			var formData = form2js('cdek', '.', true, function(node) {
//				if(node.id && node.id.match(/callbackTest/)) {
//					return {
//						name : node.id,
//						value : node.innerHTML
//					};
//				}
//			});
//			var formDataJson = JSON.stringify(formData);
//			// console.log(JSON.stringify(formData));
//			document.getElementById('testArea').innerHTML = 'Отправляемые данные: <br />' + JSON.stringify(formData, null, '\t');
//
//			$.ajax({
//				url : 'http://api.cdek.ru/calculator/calculate_price_by_jsonp.php',
//				jsonp : 'callback',
//				data : {
//					"json" : formDataJson
//				},
//				type : 'GET',
//				dataType : "jsonp",
//				success : function(data) {
//					console.log(data);
//					if(data.hasOwnProperty("result")) {
//						document.getElementById('resArea').innerHTML = 'Цена доставки: ' + data.result.price + '<br />Срок доставки: ' + data.result.deliveryPeriodMin + ' - ' + data.result.deliveryPeriodMax + 'дн. ' + '<br />Планируемая дата доставки: c ' + data.result.deliveryDateMin + ' по ' + data.result.deliveryDateMax + '<br />id тарифа, по которому произведён расчёт: ' + data.result.tariffId + '<br />';
//						if(data.result.hasOwnProperty("cashOnDelivery")) {
//							document.getElementById('resArea').innerHTML = document.getElementById('resArea').innerHTML + 'Ограничение оплаты наличными, от (руб): ' + data.result.cashOnDelivery;
//						}
//					} else {
//						for(var key in data["error"]) {
//							// console.log(key);
//							// console.log(data["error"][key]);
//							document.getElementById('resArea').innerHTML = document.getElementById('resArea').innerHTML+'Код ошибки: ' + data["error"][key].code + '<br />Текст ошибки: ' + data["error"][key].text + '<br /><br />';
//						}
//					}
//				}
//			});
//			return false;
//		});


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG5cdGxldCBkID0gbmV3IERhdGUoKTtcclxuXHRkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzKjI0KjYwKjYwKjEwMDApKTtcclxuXHRsZXQgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIisgZC50b1VUQ1N0cmluZygpO1xyXG5cdGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtwYXRoPS9cIjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lKSB7XHJcblx0bGV0IG5hbWUgPSBjbmFtZSArIFwiPVwiO1xyXG5cdGxldCBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XHJcblx0bGV0IGNhID0gZGVjb2RlZENvb2tpZS5zcGxpdCgnOycpO1xyXG5cdGZvcihsZXQgaSA9IDA7IGkgPGNhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsZXQgYyA9IGNhW2ldO1xyXG5cdFx0d2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIHtcclxuXHRcdFx0YyA9IGMuc3Vic3RyaW5nKDEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGMuaW5kZXhPZihuYW1lKSA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIFwiXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldENhcnQoY3ZhbHVlKSB7XHJcblx0c2V0Q29va2llKCdjYXJ0JywgSlNPTi5zdHJpbmdpZnkoY3ZhbHVlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnQoKSB7XHJcblx0cmV0dXJuIEpTT04ucGFyc2UoZ2V0Q29va2llKCdjYXJ0JykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDYXJ0SXRlbSAoaWQpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGluZGV4VG9VcGRhdGU7XHJcblx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGluZGV4VG9VcGRhdGUgPSBpbmRleDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRwcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1VwZGF0ZSwgMSk7XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0aWYgKHByb2R1Y3RzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0JCgnI2ZjLWNhcnQnKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2ZjLWNhcnQtZW1wdHknKS5zaG93KCk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnRUb3RhbFF0eSAoKSB7XHJcblx0aWYgKGdldENvb2tpZShcImNhcnRcIikgIT09IFwiXCIpIHtcclxuXHRcdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRcdGxldCB0b3RhbFF0eSA9IDA7XHJcblx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dG90YWxRdHkgKz0gaXRlbS5xdHk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0b3RhbFF0eTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93SGVhZGVyQ2FydFRvdGFsUXR5ICgpIHtcclxuXHQkKCcjY2FydC10b3RhbC1xdHknKS5odG1sKGdldENhcnRUb3RhbFF0eSgpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ2FydEl0ZW0gKGlkLCBwcm9kdWN0LCBxdHksIG9wdGlvbnMpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGV4aXN0c0luQ2FydCA9IGZhbHNlO1xyXG5cdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGl0ZW0ucXR5ICs9IHF0eTtcclxuXHRcdFx0ZXhpc3RzSW5DYXJ0ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRpZiAoIWV4aXN0c0luQ2FydCkge1xyXG5cdFx0cHJvZHVjdHMucHVzaCh7XHJcblx0XHRcdGlkOiBpZCxcclxuXHRcdFx0cHJvZHVjdDogcHJvZHVjdCxcclxuXHRcdFx0cXR5OiBxdHksXHJcblx0XHRcdG9wdGlvbnM6IG9wdGlvbnNcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0SXRlbSAoaWQsIHF0eSkge1xyXG5cdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRsZXQgaW5kZXhUb1VwZGF0ZTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuXHRcdFx0aW5kZXhUb1VwZGF0ZSA9IGluZGV4O1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHByb2R1Y3RzW2luZGV4VG9VcGRhdGVdLnF0eSA9IHF0eTtcclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0VG90YWxzKCkge1xyXG5cdGxldCB0b3RhbFByaWNlID0gMDtcclxuXHQkKCcuZmMtaXRlbS10b3RhbCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHF0eSA9ICskKHRoaXMpLnBhcmVudHMoJy5mYy1jYXJ0LWl0ZW0nKS5maW5kKCcuZmMtY2FydC1xdHknKS5maXJzdCgpLnZhbCgpO1xyXG5cdFx0bGV0IHByaWNlID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX3ByaWNlJyk7XHJcblx0XHQvLyBpdGVtIHRvdGFsXHJcblx0XHQkKHRoaXMpLmh0bWwocXR5ICogcHJpY2UpO1xyXG5cdFx0dG90YWxQcmljZSArPSArJCh0aGlzKS5odG1sKCk7XHJcblx0fSk7XHJcblx0bGV0IHNoaXBwaW5nUHJpY2UgPSArJCgnI2ZjLWNhcnQtc2hpcHBpbmcnKS5odG1sKCk7XHJcblx0Ly8gdG90YWxcclxuXHQkKCcjZmMtY2FydC10b3RhbCcpLmh0bWwodG90YWxQcmljZSk7XHJcblxyXG5cdC8vIHRvdGFsIHdpdGggc2hpcHBpbmdcclxuXHQkKCcjZmMtY2FydC10b3RhbC13aXRoLXNoaXBwaW5nJykuaHRtbCh0b3RhbFByaWNlICsgc2hpcHBpbmdQcmljZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dTaGlwcGluZ1RvdGFsKHZhbCkge1xyXG5cdCQoJyNmYy1jYXJ0LXNoaXBwaW5nJykuaHRtbCh2YWwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxUb3AoKSB7XHJcblx0JCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbFRvQWRkRnJvbSgpIHtcclxuXHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnI2ZjLXNjcm9sbCcpLm9mZnNldCgpLnRvcCB9LCA1MDApO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0aWYgKGdldENvb2tpZSgnY2FydCcpID09PSBcIlwiKSB7XHJcblx0XHRzZXRDYXJ0KFtdKTtcclxuXHR9XHJcblxyXG5cdGxldCBvcHRpb25zQWxlcnQgPSAkKCcjcHJvZHVjdC1hZGQtb3B0aW9ucy1hbGVydCcpO1xyXG5cdGxldCBhbGVydFN1Y2Nlc3MgPSAkKCcjcHJvZHVjdC1hZGQtYWxlcnQtc3VjY2VzcycpO1xyXG5cclxuXHRpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT09ICcjYWRkdG9jYXJ0Jykge1xyXG5cdFx0JCgnLmZjLWNhcnQtb3B0aW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQodGhpcykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdG9wdGlvbnNBbGVydC5zaG93KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIGFkZCB0byBjYXJ0XHJcblx0JCgnI2FkZC10by1jYXJ0LWJ0bicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdG9wdGlvbnNBbGVydC5oaWRlKCk7XHJcblx0XHRhbGVydFN1Y2Nlc3MuaGlkZSgpO1xyXG5cdFx0JCgnLmZvcm0tZ3JvdXAnKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcblxyXG5cclxuXHRcdGxldCBlbXB0eU9wdGlvbnMgPSAkKCcuZmMtY2FydC1vcHRpb24gb3B0aW9uOnNlbGVjdGVkW3ZhbHVlPTBdJyk7XHJcblx0XHRpZiAoZW1wdHlPcHRpb25zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZW1wdHlPcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdCQodGhpcykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRvcHRpb25zQWxlcnQuZmFkZUluKDEwMDApO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCBwcm9kdWN0ID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRsZXQgcXR5ID0gKyQoJyNjYXJ0LXByb2R1Y3QtcXR5JykudmFsKCk7XHJcblxyXG5cdFx0Ly8gY2hlY2sgb3B0aW9uc1xyXG5cdFx0bGV0IG9wdGlvbnMgPSB7fTtcclxuXHJcblx0XHQkKCcuZmMtY2FydC1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0bGV0IG5hbWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3B0aW9uX2lkJyk7XHJcblx0XHRcdG9wdGlvbnNbbmFtZV0gPSArJCh0aGlzKS52YWwoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGxldCBpZCA9IHByb2R1Y3Q7XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gb3B0aW9ucykge1xyXG5cdFx0XHRpZCArPSAoJ18nICsgb3B0aW9uc1trZXldKTtcclxuXHRcdH1cclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHRhZGRDYXJ0SXRlbShpZCwgcHJvZHVjdCwgcXR5LCBvcHRpb25zKTtcclxuXHRcdFx0YWxlcnRTdWNjZXNzLmZhZGVJbigxMDAwKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjbGVhciBhZGQgZm9ybVxyXG5cdFx0JCgnI2NhcnQtcHJvZHVjdC1xdHknKS52YWwoJzEnKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gcmVtb3ZlIGl0ZW1cclxuXHQkKCcuZmMtYnRuLXJlbW92ZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRyZW1vdmVDYXJ0SXRlbShpZCk7XHJcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5mYy1jYXJ0LWl0ZW0nKS5yZW1vdmUoKTtcclxuXHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gdXBkYXRlIGl0ZW0gcXR5XHJcblx0JCgnLmZjLWNhcnQtcXR5Jykua2V5dXAoZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHRcdGxldCBxdHkgPSArJCh0aGlzKS52YWwoKTtcclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgcXR5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykudmFsKDEpO1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgMSk7XHJcblx0XHR9XHJcblx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0XHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5mYy1zaGlwcGluZy1tZXRob2QnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0c2hvd1NoaXBwaW5nVG90YWwoJCh0aGlzKS52YWwoKSk7XHJcblx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0XHQkKCcjY2l0eScpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0JCgnI2Nob29zZS1jaXR5LWFsZXJ0JykuaGlkZSgpO1xyXG5cdFx0JCgnI2NvdW50cnktZmllbGQnKS5oaWRlKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJyNjZGVrJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKCcjY2l0eScpLmF0dHIoJ2RhdGEtc2VsZWN0ZWQnKSA9PSAwKSB7XHJcblx0XHRcdHNob3dDaXR5RXJyb3JBbGVydCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKCcjY2l0eScpLmtleXVwKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQodGhpcykuYXR0cignZGF0YS1zZWxlY3RlZCcsIDApO1xyXG5cdFx0JCgnI2NkZWsnKS52YWwoJz8nKTtcclxuXHJcblx0XHRpZiAoJCgnI2NkZWs6Y2hlY2tlZCcpLmxlbmd0aCkge1xyXG5cdFx0XHRzaG93Q2l0eUVycm9yQWxlcnQoKTtcclxuXHRcdFx0c2hvd1NoaXBwaW5nVG90YWwoJCgnI2NkZWsnKS52YWwoKSk7XHJcblx0XHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JCgnI2Ficm9hZCcpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHQkKCcjY291bnRyeS1maWVsZCcpLmZhZGVJbigpO1xyXG5cdH0pO1xyXG5cclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG5cdHNob3dTaGlwcGluZ1RvdGFsKCQoJy5mYy1zaGlwcGluZy1tZXRob2Q6Y2hlY2tlZCcpLnZhbCgpKTtcclxuXHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0c2hvd0hlYWRlckNhcnRUb3RhbFF0eSgpO1xyXG59KTtcclxuXHJcblxyXG5mdW5jdGlvbiBzaG93Q2l0eUVycm9yQWxlcnQoKSB7XHJcblx0JCgnI2NpdHknKS5wYXJlbnRzKCcuZm9ybS1ncm91cCcpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuXHQkKCcjY2hvb3NlLWNpdHktYWxlcnQnKS5mYWRlSW4oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2l0eUVycm9yQWxlcnQoKSB7XHJcblx0JCgnI2NpdHknKS5wYXJlbnRzKCcuZm9ybS1ncm91cCcpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcclxuXHQkKCcjY2hvb3NlLWNpdHktYWxlcnQnKS5oaWRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQsNCy0YLQvtC60L7QvNC/0LvQuNGCXHJcbiAqINC/0L7QtNGC0Y/Qs9C40LLQsNC10Lwg0YHQv9C40YHQvtC6INCz0L7RgNC+0LTQvtCyIGFqYXhg0L7QvCwg0LTQsNC90L3Ri9C1IGpzb25wINCyINC30LDQstC40YHQvNC+0YHRgtC4INC+0YIg0LLQstC10LTRkdC90L3Ri9GFINGB0LjQvNCy0L7Qu9C+0LJcclxuICovXHJcbiQoZnVuY3Rpb24oKSB7XHJcblx0JChcIiNjaXR5XCIpLmF1dG9jb21wbGV0ZSh7XHJcblx0XHRzb3VyY2UgOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHVybCA6IFwiaHR0cDovL2FwaS5jZGVrLnJ1L2NpdHkvZ2V0TGlzdEJ5VGVybS9qc29ucC5waHA/Y2FsbGJhY2s9P1wiLFxyXG5cdFx0XHRcdGRhdGFUeXBlIDogXCJqc29ucFwiLFxyXG5cdFx0XHRcdGRhdGEgOiB7XHJcblx0XHRcdFx0XHRxIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiAkKFwiI2NpdHlcIikudmFsKClcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRuYW1lX3N0YXJ0c1dpdGggOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuICQoXCIjY2l0eVwiKS52YWwoKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdHJlc3BvbnNlKCQubWFwKGRhdGEuZ2VvbmFtZXMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHRsYWJlbCA6IGl0ZW0ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZSA6IGl0ZW0ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZCA6IGl0ZW0uaWQsXHJcblx0XHRcdFx0XHRcdFx0cmVnaW9uSWQgOiBpdGVtLnJlZ2lvbklkLFxyXG5cdFx0XHRcdFx0XHRcdGNvdW50cnlJZCA6IGl0ZW0uY291bnRyeUlkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdG1pbkxlbmd0aCA6IDEsXHJcblx0XHRzZWxlY3QgOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuXHRcdFx0Ly8gc2V0IGZsYWdcclxuXHJcblx0XHRcdCQoJyNjaXR5JykuYXR0cignZGF0YS1zZWxlY3RlZCcsICt1aS5pdGVtLmlkKTtcclxuXHJcblx0XHRcdHJlbW92ZUNpdHlFcnJvckFsZXJ0KCk7XHJcblxyXG5cdFx0XHQvLyBnZXQgcHJpY2VcclxuXHJcblx0XHRcdGxldCBzcGVjaWFsUHJpY2VSZWdpb25zID0gWzU5LCA2LCAxMywgNTVdO1xyXG5cdFx0XHRjb25zdCBERUZBVUxUX1BSSUNFID0gMjUwO1xyXG5cdFx0XHRjb25zdCBTUEVDSUFMX1BSSUNFID0gNzAwO1xyXG5cdFx0XHRjb25zdCBBQlJPQURfUFJJQ0UgPSAxMDAwO1xyXG5cdFx0XHRsZXQgcHJpY2U7XHJcblx0XHRcdGlmICgrdWkuaXRlbS5jb3VudHJ5SWQgIT09IDEpIHtcclxuXHRcdFx0XHRwcmljZSA9IEFCUk9BRF9QUklDRTtcclxuXHRcdFx0fSBlbHNlIGlmIChzcGVjaWFsUHJpY2VSZWdpb25zLmluZGV4T2YoK3VpLml0ZW0ucmVnaW9uSWQpICE9PSAtMSkge1xyXG5cdFx0XHRcdHByaWNlID0gU1BFQ0lBTF9QUklDRTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwcmljZSA9IERFRkFVTFRfUFJJQ0U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHNob3cgcHJpY2VcclxuXHJcblx0XHRcdCQoJyNjZGVrJykudmFsKHByaWNlKTtcclxuXHJcblx0XHRcdGlmICgkKCcjY2RlazpjaGVja2VkJykubGVuZ3RoKSB7XHJcblx0XHRcdFx0c2hvd1NoaXBwaW5nVG90YWwocHJpY2UpO1xyXG5cdFx0XHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuLy9cdFx0LyoqXHJcbi8vXHRcdCAqIGFqYXgt0LfQsNC/0YDQvtGBINC90LAg0YHQtdGA0LLQtdGAINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LjQvdGE0L7RgNC80LDRhtC40Lgg0L/QviDQtNC+0YHRgtCw0LLQutC1XHJcbi8vXHRcdCAqL1xyXG4vL1x0XHQkKCcjY2RlaycpLnN1Ym1pdChmdW5jdGlvbigpIHtcclxuLy9cclxuLy9cdFx0XHR2YXIgZm9ybURhdGEgPSBmb3JtMmpzKCdjZGVrJywgJy4nLCB0cnVlLCBmdW5jdGlvbihub2RlKSB7XHJcbi8vXHRcdFx0XHRpZihub2RlLmlkICYmIG5vZGUuaWQubWF0Y2goL2NhbGxiYWNrVGVzdC8pKSB7XHJcbi8vXHRcdFx0XHRcdHJldHVybiB7XHJcbi8vXHRcdFx0XHRcdFx0bmFtZSA6IG5vZGUuaWQsXHJcbi8vXHRcdFx0XHRcdFx0dmFsdWUgOiBub2RlLmlubmVySFRNTFxyXG4vL1x0XHRcdFx0XHR9O1xyXG4vL1x0XHRcdFx0fVxyXG4vL1x0XHRcdH0pO1xyXG4vL1x0XHRcdHZhciBmb3JtRGF0YUpzb24gPSBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSk7XHJcbi8vXHRcdFx0Ly8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpKTtcclxuLy9cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdEFyZWEnKS5pbm5lckhUTUwgPSAn0J7RgtC/0YDQsNCy0LvRj9C10LzRi9C1INC00LDQvdC90YvQtTogPGJyIC8+JyArIEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhLCBudWxsLCAnXFx0Jyk7XHJcbi8vXHJcbi8vXHRcdFx0JC5hamF4KHtcclxuLy9cdFx0XHRcdHVybCA6ICdodHRwOi8vYXBpLmNkZWsucnUvY2FsY3VsYXRvci9jYWxjdWxhdGVfcHJpY2VfYnlfanNvbnAucGhwJyxcclxuLy9cdFx0XHRcdGpzb25wIDogJ2NhbGxiYWNrJyxcclxuLy9cdFx0XHRcdGRhdGEgOiB7XHJcbi8vXHRcdFx0XHRcdFwianNvblwiIDogZm9ybURhdGFKc29uXHJcbi8vXHRcdFx0XHR9LFxyXG4vL1x0XHRcdFx0dHlwZSA6ICdHRVQnLFxyXG4vL1x0XHRcdFx0ZGF0YVR5cGUgOiBcImpzb25wXCIsXHJcbi8vXHRcdFx0XHRzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSkge1xyXG4vL1x0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcclxuLy9cdFx0XHRcdFx0aWYoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInJlc3VsdFwiKSkge1xyXG4vL1x0XHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MID0gJ9Cm0LXQvdCwINC00L7RgdGC0LDQstC60Lg6ICcgKyBkYXRhLnJlc3VsdC5wcmljZSArICc8YnIgLz7QodGA0L7QuiDQtNC+0YHRgtCw0LLQutC4OiAnICsgZGF0YS5yZXN1bHQuZGVsaXZlcnlQZXJpb2RNaW4gKyAnIC0gJyArIGRhdGEucmVzdWx0LmRlbGl2ZXJ5UGVyaW9kTWF4ICsgJ9C00L0uICcgKyAnPGJyIC8+0J/Qu9Cw0L3QuNGA0YPQtdC80LDRjyDQtNCw0YLQsCDQtNC+0YHRgtCw0LLQutC4OiBjICcgKyBkYXRhLnJlc3VsdC5kZWxpdmVyeURhdGVNaW4gKyAnINC/0L4gJyArIGRhdGEucmVzdWx0LmRlbGl2ZXJ5RGF0ZU1heCArICc8YnIgLz5pZCDRgtCw0YDQuNGE0LAsINC/0L4g0LrQvtGC0L7RgNC+0LzRgyDQv9GA0L7QuNC30LLQtdC00ZHQvSDRgNCw0YHRh9GR0YI6ICcgKyBkYXRhLnJlc3VsdC50YXJpZmZJZCArICc8YnIgLz4nO1xyXG4vL1x0XHRcdFx0XHRcdGlmKGRhdGEucmVzdWx0Lmhhc093blByb3BlcnR5KFwiY2FzaE9uRGVsaXZlcnlcIikpIHtcclxuLy9cdFx0XHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc0FyZWEnKS5pbm5lckhUTUwgKyAn0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQvtC/0LvQsNGC0Ysg0L3QsNC70LjRh9C90YvQvNC4LCDQvtGCICjRgNGD0LEpOiAnICsgZGF0YS5yZXN1bHQuY2FzaE9uRGVsaXZlcnk7XHJcbi8vXHRcdFx0XHRcdFx0fVxyXG4vL1x0XHRcdFx0XHR9IGVsc2Uge1xyXG4vL1x0XHRcdFx0XHRcdGZvcih2YXIga2V5IGluIGRhdGFbXCJlcnJvclwiXSkge1xyXG4vL1x0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coa2V5KTtcclxuLy9cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGRhdGFbXCJlcnJvclwiXVtrZXldKTtcclxuLy9cdFx0XHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc0FyZWEnKS5pbm5lckhUTUwrJ9Ca0L7QtCDQvtGI0LjQsdC60Lg6ICcgKyBkYXRhW1wiZXJyb3JcIl1ba2V5XS5jb2RlICsgJzxiciAvPtCi0LXQutGB0YIg0L7RiNC40LHQutC4OiAnICsgZGF0YVtcImVycm9yXCJdW2tleV0udGV4dCArICc8YnIgLz48YnIgLz4nO1xyXG4vL1x0XHRcdFx0XHRcdH1cclxuLy9cdFx0XHRcdFx0fVxyXG4vL1x0XHRcdFx0fVxyXG4vL1x0XHRcdH0pO1xyXG4vL1x0XHRcdHJldHVybiBmYWxzZTtcclxuLy9cdFx0fSk7XHJcblxyXG5cclxufSk7Il19
