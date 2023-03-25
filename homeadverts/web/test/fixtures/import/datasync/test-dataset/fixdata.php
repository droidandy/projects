<?php

$prefix = 'property';

$aActive = json_decode(file_get_contents($prefix.'/active.json'));
$aDelta = json_decode(file_get_contents($prefix.'/delta.json'));

$aToDelete = array_filter($aDelta[0]->data, function ($el) {
    return 'Delete' == $el->action;
});
//$aToUpsert = array_filter($aDelta[0]->data, function ($el) {
//    return $el->action == 'Upsert';
//});

$aToDeleteGuids = array_map(function ($el) {
    return $el->id;
}, $aToDelete);
//$aToUpsertGuids = array_map(function ($el) {
//    return $el->id;
//}, $aToUpsert);

$aActiveGuids = array_map(function ($el) {
    return $el->entityId;
}, $aActive);

//$aToUnchangeGuids = array_diff($aActiveGuids, $aToDeleteGuids, $aToUpsertGuids);

$files = glob($prefix.'/*');
$files = array_map(function ($el) use ($prefix) {
    return str_replace($prefix.'/', '', $el);
}, $files);
$files = array_filter($files, function ($el) {
    return !in_array($el, [
        'active.json',
        'active_new.json',
        'delta.json',
        'delta_new.json',
    ]);
});
$aGuids = array_map(function ($el) {
    return str_replace('.json', '', $el);
}, $files);

$aToDeleteGuidsNew = array_diff($aGuids, $aActiveGuids);

$aToDeleteMap = array_combine($aToDeleteGuids, $aToDeleteGuidsNew);

$aActive = array_map(function ($el) use ($aToDeleteMap) {
    if (isset($aToDeleteMap[$el->entityId])) {
        $el = clone $el;
        $el->entityId = $aToDeleteMap[$el->entityId];
    }

    return $el;
}, $aActive);

file_put_contents($prefix.'/active_new.json', json_encode($aActive, JSON_PRETTY_PRINT));

$aDelta[0]->data = array_map(function ($el) use ($aToDeleteMap) {
    if (isset($aToDeleteMap[$el->id])) {
        $el = clone $el;
        $el->id = $aToDeleteMap[$el->id];
    }

    return $el;
}, $aDelta[0]->data);

file_put_contents($prefix.'/delta_new.json', json_encode($aDelta, JSON_PRETTY_PRINT));
