<?php
$date = date('Y-m-d H:i:s');
$year = date('Y');

$currentYearDir = $modx->getObject('modResource', array(
    'parent' => $ordersLogDirId,
    'alias' => $year
));

// Get parent directory to save order
if ($currentYearDir) {
    $parent = $currentYearDir->get('id');
} else {
    // Create new parent directory for order log by current year
    $object = $modx->newObject('modResource');
    $object->set('pagetitle', $year);
    $object->set('alias', $year);
    $object->set('parent', $ordersLogDirId);
    $object->set('description', 'Год');
    $object->save();

    $parent = $object->get('id');
}

// Create new resource for order log
$pagetitle = "Заказ ".$date;
$alias = "order-".$date;

$object = $modx->newObject('modResource');
$object->set('pagetitle', $pagetitle);
$object->set('alias', $alias);
$object->set('parent', $parent);
$object->set('description', 'Заказ');
$object->setContent($message);
$object->save();

$id = $object->get('id');

$currentYearDir = $modx->getObject('modResource', array(
    'parent' => $ordersLogDirId,
    'alias' => $year
));

return $id;