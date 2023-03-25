<?php

namespace AppBundle\Import\Normalizer\Office;

use AppBundle\Entity\User\SourceRef;

class OfficeNormalizer
{
    public function normalize($officeDoc): NormalisedOffice
    {
        $office = new NormalisedOffice();
        $office->sourceRef = $officeDoc->officeSummary->officeId;
        $office->sourceRefType = SourceRef::TYPE_GUID;
        $office->sourceRefs = isset($officeDoc->RFGOfficeId)
            ? [
                (object) [
                    'ref' => $officeDoc->RFGOfficeId,
                    'type' => SourceRef::TYPE_KEY,
                ],
            ]
            : []
        ;
        if (isset($officeDoc->officeSummary->companyId)) {
            $office->companySourceRef = $officeDoc->officeSummary->companyId;
            $office->companySourceRefType = SourceRef::TYPE_GUID;
        }

        $office->name = $officeDoc->officeSummary->name ?? null;
        $office->companyName = $officeDoc->officeSummary->companyName ?? null;

        $office->type = $officeDoc->officeSummary->type ?? null;
        $office->email = $officeDoc->officeSummary->emailAddress ?? null;
        $office->leadEmail = $officeDoc->officeSummary->leadEmailAddress ?? null;

        $office->phone = $officeDoc->officeSummary->phoneNumber ?? null;
        $office->phones = $this->getPhones($officeDoc);

        $office->homePageUrl = $officeDoc->websiteURL ?? null;
        $office->avatarUrl = $officeDoc->defaultPhotoURL ?? null;

        $office->modified = $officeDoc->lastUpdateOn ?? null;

        $office->descriptions = $this->getDescriptions($officeDoc);
        $office->langs = $this->getLangs($officeDoc);
        $office->media = $this->getMedia($officeDoc);
        $office->sites = $this->getSites($officeDoc);

        $office->street = $officeDoc->officeSummary->officeAddress->streetAddress ?? null;
        $office->aptBldg = null;
        $office->townCity = $officeDoc->officeSummary->officeAddress->city ?? null;
        $office->country = $officeDoc->officeSummary->officeAddress->countryCode ?? null;
        $office->zip = $officeDoc->officeSummary->officeAddress->postalCode ?? null;
        $office->stateCounty = $officeDoc->officeSummary->officeAddress->stateProvinceCode ?? null;
        $office->lat = $officeDoc->officeSummary->officeAddress->latitude ?? null;
        $office->lng = $officeDoc->officeSummary->officeAddress->longitude ?? null;

        return $office;
    }

    private function getPhones($officeDoc)
    {
        if (!isset($officeDoc->addlPhoneNumbers)) {
            return null;
        }

        $phones = $officeDoc->addlPhoneNumbers;
        $phones = array_map(
            function ($phone) {
                return (object) [
                    'type' => $phone->type ?? null,
                    'number' => $phone->number ?? null,
                    'prefix' => $phone->prefix ?? null,
                    'suffix' => $phone->suffix ?? null,
                ];
            },
            $phones
        );

        usort($phones, function ($p1, $p2) {
            foreach (['type', 'number', 'prefix', 'suffix'] as $prop) {
                $r = strcmp($p1->$prop, $p2->$prop);
                if (0 !== $r) {
                    return $r;
                }
            }

            return 0;
        });
    }

    private function getDescriptions($officeDoc)
    {
        if (!isset($officeDoc->remarks)) {
            return null;
        }

        $remarks = array_map(
            function ($remark) {
                return (object) [
                    'locale' => $remark->languageCode ?? 'en',
                    'type' => $remark->type ?? 'intro',
                    'remark' => $remark->remark ?? null,
                ];
            },
            $officeDoc->remarks
        );

        usort($remarks, function ($rm1, $rm2) {
            foreach (['locale', 'type', 'remark'] as $prop) {
                $r = strcmp($rm1->$prop, $rm2->$prop);
                if (0 !== $r) {
                    return $r;
                }
            }

            return 0;
        });

        return $remarks;
    }

    private function getLangs($officeDoc)
    {
        if (!isset($officeDoc->languagesSpoken)) {
            return null;
        }

        $langs = array_map(
            function ($lang) {
                return (object) [
                    'code' => $lang->code ?? null,
                    'name' => $lang->name ?? null,
                ];
            },
            $officeDoc->languagesSpoken
        );

        usort($langs, function ($l1, $l2) {
            foreach (['code', 'name'] as $prop) {
                $r = strcmp($l1->$prop, $l2->$prop);
                if (0 !== $r) {
                    return $r;
                }
            }

            return 0;
        });

        return $langs;
    }

    private function getMedia($officeDoc)
    {
        if (!isset($officeDoc->media)) {
            return null;
        }

        $media = array_map(
            function ($media) {
                return (object) [
                    'mediaId' => $media->mediaId ?? null,
                    'url' => $media->url,
                    'modified' => $media->lastUpdateOn ?? null,
                    'index' => $media->sequenceNumber ?? null,
                    'caption' => isset($media->caption) ? $media->caption : null,
                    'format' => $media->format ?? null,
                    'category' => $media->category ?? null,
                ];
            },
            $officeDoc->media
        );

        usort($media, function ($m1, $m2) {
            foreach (['mediaId', 'url'] as $prop) {
                $r = strcmp($m1->$prop, $m2->$prop);
                if (0 !== $r) {
                    return $r;
                }
            }

            return 0;
        });

        return $media;
    }

    public function getSites($officeDoc)
    {
        if (!isset($officeDoc->addlWebSites)) {
            return null;
        }

        $sites = array_map(
            function ($item) {
                return (object) [
                    'type' => $item->type ?? null,
                    'name' => $item->name ?? null,
                    'url' => $item->url,
                    'lang' => $item->contentLanguageCode ?? 'en',
                ];
            },
            $officeDoc->addlWebSites
        );

        usort($sites, function ($s1, $s2) {
            foreach (['lang', 'type', 'name', 'url'] as $prop) {
                $r = strcmp($s1->$prop, $s2->$prop);
                if (0 !== $r) {
                    return $r;
                }
            }

            return 0;
        });

        return $sites;
    }
}
