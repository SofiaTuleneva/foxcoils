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
	let indexToUpdate = -1;
	products.forEach(function(item, index) {
		if (item.id === id) {
			indexToUpdate = index;
		}
	});
	if (indexToUpdate < 0) return;
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

	if (window.location.hash === '#ordersuccess') {
		$('#fc-cart-empty').hide();
		$('#cart-alert-success').show();
	}

	if (window.location.hash === '#ordererror') {
		$('#cart-alert-error').show();
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
		// update cart totals
		showShippingTotal($(this).val());
		updateCartTotals();
		$('#shipping-method').val($(this).attr('data-name'));

		// clear
		removeCityErrorAlert();
		$('#country-field').hide();
	});

	$('#cdek').change(function () {
		if ($('#city').attr('data-selected') == 0) {
			showCityErrorAlert();
		}
	});

	$('#city').keyup(function (e) {
		// allow key actions
		if (e.which === 13) {
			return false;
		}
		// let keys = [65, 67, 86];
		// if (e.which === 17 && $.inArray(e.which, keys)) {
		// 	return false;
		// }

		$(this).attr('data-selected', 0);
		$('#cdek').val('?');

		if ($('#cdek:checked').length) {
			showCityErrorAlert();

			// update cart totals
			showShippingTotal($('#cdek').val());
			updateCartTotals();
		}
	});

	$('#abroad').change(function () {
		$('#country-field').fadeIn();
	});

	$('#cart-checkout-form').submit(function (e) {
		// cancel submit by enter key
		if (e.which === 13) {
			return false;
		}
		if ($('#cdek:checked').length > 0 && $('#city').attr('data-selected') === '0') {
			return false;
		}
	});

	console.log(document.cookie);

	// update cart totals
	showShippingTotal($('.fc-shipping-method:checked').val());
	$('#shipping-method').val($('.fc-shipping-method:checked').attr('data-name'));
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
							countryId : item.countryId,
							countryName : item.countryName
						}
					}));
				}
			});
		},
		minLength : 1,
		select : function(event, ui) {
			// set flag

			$('#city').attr('data-selected', +ui.item.id);
			$('#country').val(ui.item.countryName);

			removeCityErrorAlert();

			// get price

			let specialPriceRegions = [59, 6, 13, 55];
			const DEFAULT_PRICE = 230;
			const SPECIAL_PRICE = 900;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNldENvb2tpZShjbmFtZSwgY3ZhbHVlLCBleGRheXMpIHtcclxuXHRsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblx0ZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XHJcblx0bGV0IGV4cGlyZXMgPSBcImV4cGlyZXM9XCIrIGQudG9VVENTdHJpbmcoKTtcclxuXHRkb2N1bWVudC5jb29raWUgPSBjbmFtZSArIFwiPVwiICsgY3ZhbHVlICsgXCI7XCIgKyBleHBpcmVzICsgXCI7cGF0aD0vXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvb2tpZShjbmFtZSkge1xyXG5cdGxldCBuYW1lID0gY25hbWUgKyBcIj1cIjtcclxuXHRsZXQgZGVjb2RlZENvb2tpZSA9IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUpO1xyXG5cdGxldCBjYSA9IGRlY29kZWRDb29raWUuc3BsaXQoJzsnKTtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDxjYS5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGMgPSBjYVtpXTtcclxuXHRcdHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XHJcblx0XHRcdGMgPSBjLnN1YnN0cmluZygxKTtcclxuXHRcdH1cclxuXHRcdGlmIChjLmluZGV4T2YobmFtZSkgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIGMuc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjLmxlbmd0aCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBcIlwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRDYXJ0KGN2YWx1ZSkge1xyXG5cdHNldENvb2tpZSgnY2FydCcsIEpTT04uc3RyaW5naWZ5KGN2YWx1ZSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0KCkge1xyXG5cdHJldHVybiBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2FydEl0ZW0gKGlkKSB7XHJcblx0bGV0IHByb2R1Y3RzID0gZ2V0Q2FydCgpO1xyXG5cdGxldCBpbmRleFRvVXBkYXRlO1xyXG5cdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuXHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRpbmRleFRvVXBkYXRlID0gaW5kZXg7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0cHJvZHVjdHMuc3BsaWNlKGluZGV4VG9VcGRhdGUsIDEpO1xyXG5cdHNldENhcnQocHJvZHVjdHMpO1xyXG5cdGlmIChwcm9kdWN0cy5sZW5ndGggPT09IDApIHtcclxuXHRcdCQoJyNmYy1jYXJ0JykuZW1wdHkoKTtcclxuXHRcdCQoJyNmYy1jYXJ0LWVtcHR5Jykuc2hvdygpO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0VG90YWxRdHkgKCkge1xyXG5cdGlmIChnZXRDb29raWUoXCJjYXJ0XCIpICE9PSBcIlwiKSB7XHJcblx0XHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0XHRsZXQgdG90YWxRdHkgPSAwO1xyXG5cdFx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHRvdGFsUXR5ICs9IGl0ZW0ucXR5O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdG90YWxRdHk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd0hlYWRlckNhcnRUb3RhbFF0eSAoKSB7XHJcblx0JCgnI2NhcnQtdG90YWwtcXR5JykuaHRtbChnZXRDYXJ0VG90YWxRdHkoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZENhcnRJdGVtIChpZCwgcHJvZHVjdCwgcXR5LCBvcHRpb25zKSB7XHJcblx0bGV0IHByb2R1Y3RzID0gZ2V0Q2FydCgpO1xyXG5cdGxldCBleGlzdHNJbkNhcnQgPSBmYWxzZTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRpdGVtLnF0eSArPSBxdHk7XHJcblx0XHRcdGV4aXN0c0luQ2FydCA9IHRydWU7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0aWYgKCFleGlzdHNJbkNhcnQpIHtcclxuXHRcdHByb2R1Y3RzLnB1c2goe1xyXG5cdFx0XHRpZDogaWQsXHJcblx0XHRcdHByb2R1Y3Q6IHByb2R1Y3QsXHJcblx0XHRcdHF0eTogcXR5LFxyXG5cdFx0XHRvcHRpb25zOiBvcHRpb25zXHJcblx0XHR9KTtcclxuXHR9XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0Y29uc29sZS5sb2coZG9jdW1lbnQuY29va2llKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2FydEl0ZW0gKGlkLCBxdHkpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGluZGV4VG9VcGRhdGUgPSAtMTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuXHRcdFx0aW5kZXhUb1VwZGF0ZSA9IGluZGV4O1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGlmIChpbmRleFRvVXBkYXRlIDwgMCkgcmV0dXJuO1xyXG5cdHByb2R1Y3RzW2luZGV4VG9VcGRhdGVdLnF0eSA9IHF0eTtcclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0VG90YWxzKCkge1xyXG5cdGxldCB0b3RhbFByaWNlID0gMDtcclxuXHQkKCcuZmMtaXRlbS10b3RhbCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHF0eSA9ICskKHRoaXMpLnBhcmVudHMoJy5mYy1jYXJ0LWl0ZW0nKS5maW5kKCcuZmMtY2FydC1xdHknKS5maXJzdCgpLnZhbCgpO1xyXG5cdFx0bGV0IHByaWNlID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX3ByaWNlJyk7XHJcblx0XHQvLyBpdGVtIHRvdGFsXHJcblx0XHQkKHRoaXMpLmh0bWwocXR5ICogcHJpY2UpO1xyXG5cdFx0dG90YWxQcmljZSArPSArJCh0aGlzKS5odG1sKCk7XHJcblx0fSk7XHJcblx0bGV0IHNoaXBwaW5nUHJpY2UgPSArJCgnI2ZjLWNhcnQtc2hpcHBpbmcnKS5odG1sKCk7XHJcblx0Ly8gdG90YWxcclxuXHQkKCcjZmMtY2FydC10b3RhbCcpLmh0bWwodG90YWxQcmljZSk7XHJcblxyXG5cdC8vIHRvdGFsIHdpdGggc2hpcHBpbmdcclxuXHQkKCcjZmMtY2FydC10b3RhbC13aXRoLXNoaXBwaW5nJykuaHRtbCh0b3RhbFByaWNlICsgc2hpcHBpbmdQcmljZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dTaGlwcGluZ1RvdGFsKHZhbCkge1xyXG5cdCQoJyNmYy1jYXJ0LXNoaXBwaW5nJykuaHRtbCh2YWwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxUb3AoKSB7XHJcblx0JCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbFRvQWRkRnJvbSgpIHtcclxuXHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnI2ZjLXNjcm9sbCcpLm9mZnNldCgpLnRvcCB9LCA1MDApO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0aWYgKGdldENvb2tpZSgnY2FydCcpID09PSBcIlwiKSB7XHJcblx0XHRzZXRDYXJ0KFtdKTtcclxuXHR9XHJcblxyXG5cdGxldCBvcHRpb25zQWxlcnQgPSAkKCcjcHJvZHVjdC1hZGQtb3B0aW9ucy1hbGVydCcpO1xyXG5cdGxldCBhbGVydFN1Y2Nlc3MgPSAkKCcjcHJvZHVjdC1hZGQtYWxlcnQtc3VjY2VzcycpO1xyXG5cclxuXHRpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT09ICcjYWRkdG9jYXJ0Jykge1xyXG5cdFx0JCgnLmZjLWNhcnQtb3B0aW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQodGhpcykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdG9wdGlvbnNBbGVydC5zaG93KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gJyNvcmRlcnN1Y2Nlc3MnKSB7XHJcblx0XHQkKCcjZmMtY2FydC1lbXB0eScpLmhpZGUoKTtcclxuXHRcdCQoJyNjYXJ0LWFsZXJ0LXN1Y2Nlc3MnKS5zaG93KCk7XHJcblx0fVxyXG5cclxuXHRpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT09ICcjb3JkZXJlcnJvcicpIHtcclxuXHRcdCQoJyNjYXJ0LWFsZXJ0LWVycm9yJykuc2hvdygpO1xyXG5cdH1cclxuXHJcblx0Ly8gYWRkIHRvIGNhcnRcclxuXHQkKCcjYWRkLXRvLWNhcnQtYnRuJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0b3B0aW9uc0FsZXJ0LmhpZGUoKTtcclxuXHRcdGFsZXJ0U3VjY2Vzcy5oaWRlKCk7XHJcblx0XHQkKCcuZm9ybS1ncm91cCcpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcclxuXHJcblxyXG5cdFx0bGV0IGVtcHR5T3B0aW9ucyA9ICQoJy5mYy1jYXJ0LW9wdGlvbiBvcHRpb246c2VsZWN0ZWRbdmFsdWU9MF0nKTtcclxuXHRcdGlmIChlbXB0eU9wdGlvbnMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRlbXB0eU9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KCcuZm9ybS1ncm91cCcpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdG9wdGlvbnNBbGVydC5mYWRlSW4oMTAwMCk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0bGV0IHByb2R1Y3QgPSArJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHRcdGxldCBxdHkgPSArJCgnI2NhcnQtcHJvZHVjdC1xdHknKS52YWwoKTtcclxuXHJcblx0XHQvLyBjaGVjayBvcHRpb25zXHJcblx0XHRsZXQgb3B0aW9ucyA9IHt9O1xyXG5cclxuXHRcdCQoJy5mYy1jYXJ0LW9wdGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRsZXQgbmFtZSA9ICQodGhpcykuYXR0cignZGF0YS1vcHRpb25faWQnKTtcclxuXHRcdFx0b3B0aW9uc1tuYW1lXSA9ICskKHRoaXMpLnZhbCgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IGlkID0gcHJvZHVjdDtcclxuXHRcdGZvciAobGV0IGtleSBpbiBvcHRpb25zKSB7XHJcblx0XHRcdGlkICs9ICgnXycgKyBvcHRpb25zW2tleV0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKE51bWJlci5pc0ludGVnZXIocXR5KSAmJiBxdHkgPiAwKSB7XHJcblx0XHRcdGFkZENhcnRJdGVtKGlkLCBwcm9kdWN0LCBxdHksIG9wdGlvbnMpO1xyXG5cdFx0XHRhbGVydFN1Y2Nlc3MuZmFkZUluKDEwMDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNsZWFyIGFkZCBmb3JtXHJcblx0XHQkKCcjY2FydC1wcm9kdWN0LXF0eScpLnZhbCgnMScpO1xyXG5cdFx0c2hvd0hlYWRlckNhcnRUb3RhbFF0eSgpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyByZW1vdmUgaXRlbVxyXG5cdCQoJy5mYy1idG4tcmVtb3ZlJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHRcdHJlbW92ZUNhcnRJdGVtKGlkKTtcclxuXHRcdCQodGhpcykuY2xvc2VzdCgnLmZjLWNhcnQtaXRlbScpLnJlbW92ZSgpO1xyXG5cdFx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdFx0c2hvd0hlYWRlckNhcnRUb3RhbFF0eSgpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyB1cGRhdGUgaXRlbSBxdHlcclxuXHQkKCcuZmMtY2FydC1xdHknKS5rZXl1cChmdW5jdGlvbiAoKSB7XHJcblx0XHRsZXQgaWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9pZCcpO1xyXG5cdFx0bGV0IHF0eSA9ICskKHRoaXMpLnZhbCgpO1xyXG5cdFx0aWYgKE51bWJlci5pc0ludGVnZXIocXR5KSAmJiBxdHkgPiAwKSB7XHJcblx0XHRcdHVwZGF0ZUNhcnRJdGVtKGlkLCBxdHkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCh0aGlzKS52YWwoMSk7XHJcblx0XHRcdHVwZGF0ZUNhcnRJdGVtKGlkLCAxKTtcclxuXHRcdH1cclxuXHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLmZjLXNoaXBwaW5nLW1ldGhvZCcpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHQvLyB1cGRhdGUgY2FydCB0b3RhbHNcclxuXHRcdHNob3dTaGlwcGluZ1RvdGFsKCQodGhpcykudmFsKCkpO1xyXG5cdFx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdFx0JCgnI3NoaXBwaW5nLW1ldGhvZCcpLnZhbCgkKHRoaXMpLmF0dHIoJ2RhdGEtbmFtZScpKTtcclxuXHJcblx0XHQvLyBjbGVhclxyXG5cdFx0cmVtb3ZlQ2l0eUVycm9yQWxlcnQoKTtcclxuXHRcdCQoJyNjb3VudHJ5LWZpZWxkJykuaGlkZSgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcjY2RlaycpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCgnI2NpdHknKS5hdHRyKCdkYXRhLXNlbGVjdGVkJykgPT0gMCkge1xyXG5cdFx0XHRzaG93Q2l0eUVycm9yQWxlcnQoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JCgnI2NpdHknKS5rZXl1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0Ly8gYWxsb3cga2V5IGFjdGlvbnNcclxuXHRcdGlmIChlLndoaWNoID09PSAxMykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyBsZXQga2V5cyA9IFs2NSwgNjcsIDg2XTtcclxuXHRcdC8vIGlmIChlLndoaWNoID09PSAxNyAmJiAkLmluQXJyYXkoZS53aGljaCwga2V5cykpIHtcclxuXHRcdC8vIFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdCQodGhpcykuYXR0cignZGF0YS1zZWxlY3RlZCcsIDApO1xyXG5cdFx0JCgnI2NkZWsnKS52YWwoJz8nKTtcclxuXHJcblx0XHRpZiAoJCgnI2NkZWs6Y2hlY2tlZCcpLmxlbmd0aCkge1xyXG5cdFx0XHRzaG93Q2l0eUVycm9yQWxlcnQoKTtcclxuXHJcblx0XHRcdC8vIHVwZGF0ZSBjYXJ0IHRvdGFsc1xyXG5cdFx0XHRzaG93U2hpcHBpbmdUb3RhbCgkKCcjY2RlaycpLnZhbCgpKTtcclxuXHRcdFx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKCcjYWJyb2FkJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJyNjb3VudHJ5LWZpZWxkJykuZmFkZUluKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJyNjYXJ0LWNoZWNrb3V0LWZvcm0nKS5zdWJtaXQoZnVuY3Rpb24gKGUpIHtcclxuXHRcdC8vIGNhbmNlbCBzdWJtaXQgYnkgZW50ZXIga2V5XHJcblx0XHRpZiAoZS53aGljaCA9PT0gMTMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCQoJyNjZGVrOmNoZWNrZWQnKS5sZW5ndGggPiAwICYmICQoJyNjaXR5JykuYXR0cignZGF0YS1zZWxlY3RlZCcpID09PSAnMCcpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG5cclxuXHQvLyB1cGRhdGUgY2FydCB0b3RhbHNcclxuXHRzaG93U2hpcHBpbmdUb3RhbCgkKCcuZmMtc2hpcHBpbmctbWV0aG9kOmNoZWNrZWQnKS52YWwoKSk7XHJcblx0JCgnI3NoaXBwaW5nLW1ldGhvZCcpLnZhbCgkKCcuZmMtc2hpcHBpbmctbWV0aG9kOmNoZWNrZWQnKS5hdHRyKCdkYXRhLW5hbWUnKSk7XHJcblx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cclxuXHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHNob3dDaXR5RXJyb3JBbGVydCgpIHtcclxuXHQkKCcjY2l0eScpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdCQoJyNjaG9vc2UtY2l0eS1hbGVydCcpLmZhZGVJbigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDaXR5RXJyb3JBbGVydCgpIHtcclxuXHQkKCcjY2l0eScpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdCQoJyNjaG9vc2UtY2l0eS1hbGVydCcpLmhpZGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCw0LLRgtC+0LrQvtC80L/Qu9C40YJcclxuICog0L/QvtC00YLRj9Cz0LjQstCw0LXQvCDRgdC/0LjRgdC+0Log0LPQvtGA0L7QtNC+0LIgYWpheGDQvtC8LCDQtNCw0L3QvdGL0LUganNvbnAg0LIg0LfQsNCy0LjRgdC80L7RgdGC0Lgg0L7RgiDQstCy0LXQtNGR0L3QvdGL0YUg0YHQuNC80LLQvtC70L7QslxyXG4gKi9cclxuJChmdW5jdGlvbigpIHtcclxuXHQkKFwiI2NpdHlcIikuYXV0b2NvbXBsZXRlKHtcclxuXHRcdHNvdXJjZSA6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XHJcblx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0dXJsIDogXCJodHRwOi8vYXBpLmNkZWsucnUvY2l0eS9nZXRMaXN0QnlUZXJtL2pzb25wLnBocD9jYWxsYmFjaz0/XCIsXHJcblx0XHRcdFx0ZGF0YVR5cGUgOiBcImpzb25wXCIsXHJcblx0XHRcdFx0ZGF0YSA6IHtcclxuXHRcdFx0XHRcdHEgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuICQoXCIjY2l0eVwiKS52YWwoKVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdG5hbWVfc3RhcnRzV2l0aCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gJChcIiNjaXR5XCIpLnZhbCgpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0cmVzcG9uc2UoJC5tYXAoZGF0YS5nZW9uYW1lcywgZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0XHRcdGxhYmVsIDogaXRlbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlIDogaXRlbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkIDogaXRlbS5pZCxcclxuXHRcdFx0XHRcdFx0XHRyZWdpb25JZCA6IGl0ZW0ucmVnaW9uSWQsXHJcblx0XHRcdFx0XHRcdFx0Y291bnRyeUlkIDogaXRlbS5jb3VudHJ5SWQsXHJcblx0XHRcdFx0XHRcdFx0Y291bnRyeU5hbWUgOiBpdGVtLmNvdW50cnlOYW1lXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdG1pbkxlbmd0aCA6IDEsXHJcblx0XHRzZWxlY3QgOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuXHRcdFx0Ly8gc2V0IGZsYWdcclxuXHJcblx0XHRcdCQoJyNjaXR5JykuYXR0cignZGF0YS1zZWxlY3RlZCcsICt1aS5pdGVtLmlkKTtcclxuXHRcdFx0JCgnI2NvdW50cnknKS52YWwodWkuaXRlbS5jb3VudHJ5TmFtZSk7XHJcblxyXG5cdFx0XHRyZW1vdmVDaXR5RXJyb3JBbGVydCgpO1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHByaWNlXHJcblxyXG5cdFx0XHRsZXQgc3BlY2lhbFByaWNlUmVnaW9ucyA9IFs1OSwgNiwgMTMsIDU1XTtcclxuXHRcdFx0Y29uc3QgREVGQVVMVF9QUklDRSA9IDIzMDtcclxuXHRcdFx0Y29uc3QgU1BFQ0lBTF9QUklDRSA9IDkwMDtcclxuXHRcdFx0Y29uc3QgQUJST0FEX1BSSUNFID0gMTAwMDtcclxuXHRcdFx0bGV0IHByaWNlO1xyXG5cdFx0XHRpZiAoK3VpLml0ZW0uY291bnRyeUlkICE9PSAxKSB7XHJcblx0XHRcdFx0cHJpY2UgPSBBQlJPQURfUFJJQ0U7XHJcblx0XHRcdH0gZWxzZSBpZiAoc3BlY2lhbFByaWNlUmVnaW9ucy5pbmRleE9mKCt1aS5pdGVtLnJlZ2lvbklkKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRwcmljZSA9IFNQRUNJQUxfUFJJQ0U7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cHJpY2UgPSBERUZBVUxUX1BSSUNFO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBzaG93IHByaWNlXHJcblxyXG5cdFx0XHQkKCcjY2RlaycpLnZhbChwcmljZSk7XHJcblxyXG5cdFx0XHRpZiAoJCgnI2NkZWs6Y2hlY2tlZCcpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHNob3dTaGlwcGluZ1RvdGFsKHByaWNlKTtcclxuXHRcdFx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbi8vXHRcdC8qKlxyXG4vL1x0XHQgKiBhamF4LdC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgCDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC40L3RhNC+0YDQvNCw0YbQuNC4INC/0L4g0LTQvtGB0YLQsNCy0LrQtVxyXG4vL1x0XHQgKi9cclxuLy9cdFx0JCgnI2NkZWsnKS5zdWJtaXQoZnVuY3Rpb24oKSB7XHJcbi8vXHJcbi8vXHRcdFx0dmFyIGZvcm1EYXRhID0gZm9ybTJqcygnY2RlaycsICcuJywgdHJ1ZSwgZnVuY3Rpb24obm9kZSkge1xyXG4vL1x0XHRcdFx0aWYobm9kZS5pZCAmJiBub2RlLmlkLm1hdGNoKC9jYWxsYmFja1Rlc3QvKSkge1xyXG4vL1x0XHRcdFx0XHRyZXR1cm4ge1xyXG4vL1x0XHRcdFx0XHRcdG5hbWUgOiBub2RlLmlkLFxyXG4vL1x0XHRcdFx0XHRcdHZhbHVlIDogbm9kZS5pbm5lckhUTUxcclxuLy9cdFx0XHRcdFx0fTtcclxuLy9cdFx0XHRcdH1cclxuLy9cdFx0XHR9KTtcclxuLy9cdFx0XHR2YXIgZm9ybURhdGFKc29uID0gSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpO1xyXG4vL1x0XHRcdC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhKSk7XHJcbi8vXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3RBcmVhJykuaW5uZXJIVE1MID0gJ9Ce0YLQv9GA0LDQstC70Y/QtdC80YvQtSDQtNCw0L3QvdGL0LU6IDxiciAvPicgKyBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSwgbnVsbCwgJ1xcdCcpO1xyXG4vL1xyXG4vL1x0XHRcdCQuYWpheCh7XHJcbi8vXHRcdFx0XHR1cmwgOiAnaHR0cDovL2FwaS5jZGVrLnJ1L2NhbGN1bGF0b3IvY2FsY3VsYXRlX3ByaWNlX2J5X2pzb25wLnBocCcsXHJcbi8vXHRcdFx0XHRqc29ucCA6ICdjYWxsYmFjaycsXHJcbi8vXHRcdFx0XHRkYXRhIDoge1xyXG4vL1x0XHRcdFx0XHRcImpzb25cIiA6IGZvcm1EYXRhSnNvblxyXG4vL1x0XHRcdFx0fSxcclxuLy9cdFx0XHRcdHR5cGUgOiAnR0VUJyxcclxuLy9cdFx0XHRcdGRhdGFUeXBlIDogXCJqc29ucFwiLFxyXG4vL1x0XHRcdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpIHtcclxuLy9cdFx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcbi8vXHRcdFx0XHRcdGlmKGRhdGEuaGFzT3duUHJvcGVydHkoXCJyZXN1bHRcIikpIHtcclxuLy9cdFx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzQXJlYScpLmlubmVySFRNTCA9ICfQptC10L3QsCDQtNC+0YHRgtCw0LLQutC4OiAnICsgZGF0YS5yZXN1bHQucHJpY2UgKyAnPGJyIC8+0KHRgNC+0Log0LTQvtGB0YLQsNCy0LrQuDogJyArIGRhdGEucmVzdWx0LmRlbGl2ZXJ5UGVyaW9kTWluICsgJyAtICcgKyBkYXRhLnJlc3VsdC5kZWxpdmVyeVBlcmlvZE1heCArICfQtNC9LiAnICsgJzxiciAvPtCf0LvQsNC90LjRgNGD0LXQvNCw0Y8g0LTQsNGC0LAg0LTQvtGB0YLQsNCy0LrQuDogYyAnICsgZGF0YS5yZXN1bHQuZGVsaXZlcnlEYXRlTWluICsgJyDQv9C+ICcgKyBkYXRhLnJlc3VsdC5kZWxpdmVyeURhdGVNYXggKyAnPGJyIC8+aWQg0YLQsNGA0LjRhNCwLCDQv9C+INC60L7RgtC+0YDQvtC80YMg0L/RgNC+0LjQt9Cy0LXQtNGR0L0g0YDQsNGB0YfRkdGCOiAnICsgZGF0YS5yZXN1bHQudGFyaWZmSWQgKyAnPGJyIC8+JztcclxuLy9cdFx0XHRcdFx0XHRpZihkYXRhLnJlc3VsdC5oYXNPd25Qcm9wZXJ0eShcImNhc2hPbkRlbGl2ZXJ5XCIpKSB7XHJcbi8vXHRcdFx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzQXJlYScpLmlubmVySFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MICsgJ9Ce0LPRgNCw0L3QuNGH0LXQvdC40LUg0L7Qv9C70LDRgtGLINC90LDQu9C40YfQvdGL0LzQuCwg0L7RgiAo0YDRg9CxKTogJyArIGRhdGEucmVzdWx0LmNhc2hPbkRlbGl2ZXJ5O1xyXG4vL1x0XHRcdFx0XHRcdH1cclxuLy9cdFx0XHRcdFx0fSBlbHNlIHtcclxuLy9cdFx0XHRcdFx0XHRmb3IodmFyIGtleSBpbiBkYXRhW1wiZXJyb3JcIl0pIHtcclxuLy9cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGtleSk7XHJcbi8vXHRcdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhkYXRhW1wiZXJyb3JcIl1ba2V5XSk7XHJcbi8vXHRcdFx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzQXJlYScpLmlubmVySFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MKyfQmtC+0LQg0L7RiNC40LHQutC4OiAnICsgZGF0YVtcImVycm9yXCJdW2tleV0uY29kZSArICc8YnIgLz7QotC10LrRgdGCINC+0YjQuNCx0LrQuDogJyArIGRhdGFbXCJlcnJvclwiXVtrZXldLnRleHQgKyAnPGJyIC8+PGJyIC8+JztcclxuLy9cdFx0XHRcdFx0XHR9XHJcbi8vXHRcdFx0XHRcdH1cclxuLy9cdFx0XHRcdH1cclxuLy9cdFx0XHR9KTtcclxuLy9cdFx0XHRyZXR1cm4gZmFsc2U7XHJcbi8vXHRcdH0pO1xyXG5cclxuXHJcbn0pO1xyXG4iXX0=
