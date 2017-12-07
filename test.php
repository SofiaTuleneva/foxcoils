<?php
// get customer form
$fields = [
    'shipping_method',
    'customer_firstname',
    'customer_lastname',
    'customer_phone',
    'customer_email',
    'customer_country',
    'customer_city',
    'customer_postcode',
    'customer_address',
    'customer_comment'
];

$properties = array();
foreach ($fields as $field) {
    $properties[$field] = htmlspecialchars($_POST[$field]);
}

// *** redirect error
if (!filter_var($properties['customer_email'], FILTER_VALIDATE_EMAIL)) {
    $resource = $modx->getObject('modResource', 130);
    $location = $resource->get('alias');
    header("Location: {$location}.html");
    return;
}



// get cart
$cart_all = json_decode($_COOKIE['cart'], true);

// *** redirect error
if (empty($cart_all)) {
    $resource = $modx->getObject('modResource', 130);
    $location = $resource->get('alias');
    header("Location: {$location}.html");
    return;
}

$cartTotal = 0;
foreach ($cart_all as $i => $val) {
    $resource = $modx->getObject('modResource', $val['product']);
    $itemTotal =  $resource->getTVValue('price') * $val['qty'];
    $cartTotal += $itemTotal;
}

$properties['cart-total'] = $cartTotal;
$properties['cart-shipping'] = $properties['shipping_method'];
$properties['cart-total-with-shipping'] = $properties['cart-total'] + $properties['cart-shipping'];
$properties['cart_items'] = $modx->runSnippet('getCartItemsTpl', array(
    'tpl' => 'cart-email-item'
));

$properties['date'] = date('Y-m-d H:i:s');

// get mail template
$messageTpl = $modx->getChunk('cart-email', $properties);

// clear cookie
setcookie('cart', '');

// add order to log and get order id
$orderId = $modx->runSnippet('createNewOrdersLogResource', array(
    'message' => $messageTpl,
    'ordersLogDirId' => 23
));

// *** redirect success
$resource = $modx->getObject('modResource', 127);
$location = $resource->get('alias');
header("Location: {$location}.html");

// get mail template
$properties['orderId'] = $orderId;
$messageTpl = $modx->getChunk('cart-email', $properties);

// mail to admin
$modx->runSnippet('sendMail', array(
    'message' => $messageTpl,
    'mailTo' => $modx->getChunk('cart-email-admin')
));

// mail to customer
$modx->runSnippet('sendMail', array(
    'message' => $messageTpl,
    'mailTo' => $properties['customer_email']
));