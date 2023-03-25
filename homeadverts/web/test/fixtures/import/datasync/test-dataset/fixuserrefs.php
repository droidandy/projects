<?php

$pActive = json_decode(file_get_contents('property/active.json'));
$pDelta = json_decode(file_get_contents('property/delta.json'));

$pToDelete = array_values(array_filter($pDelta[0]->data, function ($el) {
    return 'Delete' == $el->action;
}));
$pToDeleteGuids = array_map(function ($el) {
    return $el->id;
}, $pToDelete);

$pToUpsert = array_values(array_filter($pDelta[0]->data, function ($el) {
    return 'Upsert' == $el->action;
}));
$pToUpsertGuids = array_map(function ($el) {
    return $el->id;
}, $pToUpsert);

$pActiveGuids = array_map(function ($el) {
    return $el->entityId;
}, $pActive);

$pUnchangedGuids = array_values(array_diff($pActiveGuids, $pToDeleteGuids, $pToUpsertGuids));

$aActive = json_decode(file_get_contents('agent/active.json'));
$aDelta = json_decode(file_get_contents('agent/delta.json'));

$aToDelete = array_values(array_filter($aDelta[0]->data, function ($el) {
    return 'Delete' == $el->action;
}));
$aToDeleteGuids = array_map(function ($el) {
    return $el->id;
}, $aToDelete);

$aToUpsert = array_values(array_filter($aDelta[0]->data, function ($el) {
    return 'Upsert' == $el->action;
}));
$aToUpsertGuids = array_map(function ($el) {
    return $el->id;
}, $aToUpsert);

$aActiveGuids = array_map(function ($el) {
    return $el->entityId;
}, $aActive);

$aUnchangedGuids = array_values(array_diff($aActiveGuids, $aToDeleteGuids, $aToUpsertGuids));

$aUnchangedGuids[1] = $aUnchangedGuids[0];
$aToDeleteGuids[1] = $aToDeleteGuids[0];
$aToUpsertGuids[1] = $aToUpsertGuids[0];

$pGuids = [];
for ($i = 0; $i < 5; ++$i) {
    $pGuids[] = $pToDeleteGuids[$i];

    $pGuids[] = $pGuid = $pToUpsertGuids[$i];
    $p[$pGuid] = $pToUpsert[$i];

    $pGuids[] = $pUnchangedGuids[$i];
}

foreach (
    array_merge(array_values($aToDeleteGuids), array_values($aToUpsertGuids), array_values($aUnchangedGuids)) as $i => $aGuid
) {
    $pGuid = $pGuids[$i];

    $agent = getAgent($aGuid);
    if (isset($p[$pGuid])) {
        $primary = primaryAgent($p[$pGuid]->entityDetail);
        foreach (get_object_vars($primary) as $attr => $_) {
            $primary->$attr = isset($agent->agentSummary->$attr)
                ? $agent->agentSummary->$attr
                : $primary->$attr
            ;
        }
    }
    $property = getProperty($pGuid);
    $primary = primaryAgent($property);
//    var_dump(get_object_vars($primary));exit;
    foreach (get_object_vars($primary) as $attr => $_) {
        $primary->$attr = isset($agent->agentSummary->$attr)
            ? $agent->agentSummary->$attr
            : $primary->$attr
        ;
    }

    file_put_contents('property/'.$pGuid.'_m.json', json_encode($property, JSON_PRETTY_PRINT));
}

file_put_contents('property/delta_m.json', json_encode($pDelta, JSON_PRETTY_PRINT));

function primaryAgent($p)
{
    $agents = $p->listingSummary->agents;
    $fAgents = array_filter($agents, function ($el) {
        return $el->isPrimary;
    });

    return $fAgents ? current($fAgents) : $agents[0];
}

function getAgent($aGuid)
{
    return json_decode(file_get_contents('agent/'.$aGuid.'.json'));
}

function getProperty($pGuid)
{
    return json_decode(file_get_contents('property/'.$pGuid.'.json'));
}
