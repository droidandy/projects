<?php

namespace AppBundle\Import\Normalizer\Company;

use AppBundle\Entity\User\SourceRef;

class CompanyNormalizer
{
    public function normalize($feedCompany): NormalisedCompany
    {
        $company = new NormalisedCompany();
        $company->name = $feedCompany->companySummary->name ?? null;
        $company->commercialName = $feedCompany->companySummary->commercialName ?? null;
        $company->homepageUrl = $feedCompany->companySummary->websiteURL ?? null;
        $company->sourceRef = $feedCompany->companySummary->id;
        $company->sourceRefType = SourceRef::TYPE_GUID;
        $company->sourceRefs = isset($feedCompany->companySummary->RFGID)
            ? [
                (object) [
                    'ref' => $feedCompany->companySummary->RFGID,
                    'type' => SourceRef::TYPE_KEY,
                ],
            ]
            : []
        ;
        $company->modified = $feedCompany->companySummary->lastUpdateOn ?? null;

        if (isset($feedCompany->media)) {
            $media = array_map(
                function ($media) {
                    return (object) [
                        'mediaId' => $media->mediaId ?? null,
                        'url' => $media->url,
                        'modified' => $media->lastUpdateOn ?? null,
                        'index' => $media->sequenceNumber ?? null,
                        'caption' => $media->caption ?? null,
                        'format' => $media->format ?? null,
                        'category' => $media->category ?? null,
                    ];
                },
                $feedCompany->media
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

            $company->media = $media;
        } else {
            $company->media = [];
        }

        if (isset($feedCompany->addlLanguageNames)) {
            $names = array_map(
                function ($item) {
                    return (object) [
                        'lang' => $item->languageCode ?? 'en',
                        'name' => $item->name ?? null,
                        'commercialName' => $item->commercialName ?? null,
                    ];
                },
                $feedCompany->addlLanguageNames
            );
            usort(
                $names,
                function ($n1, $n2) {
                    foreach (['lang', 'name', 'commercialName'] as $prop) {
                        $r = strcmp($n1->$prop, $n2->$prop);
                        if (0 !== $r) {
                            return $r;
                        }
                    }

                    return 0;
                }
            );
            $company->names = $names;
        } else {
            $company->names = [];
        }

        if (isset($company->sites)) {
            $sites = array_map(
                function ($item) {
                    return (object) [
                        'type' => $item->type ?? null,
                        'name' => $item->name ?? null,
                        'url' => $item->url,
                        'lang' => $item->contentLanguageCode ?? 'en',
                    ];
                },
                $feedCompany->addlWebSites
            );
            usort(
                $sites,
                function ($s1, $s2) {
                    foreach (['lang', 'type', 'name', 'url'] as $prop) {
                        $r = strcmp($s1->$prop, $s2->$prop);
                        if (0 !== $r) {
                            return $r;
                        }
                    }

                    return 0;
                }
            );
            $company->sites = $sites;
        } else {
            $company->sites = null;
        }

        return $company;
    }
}
