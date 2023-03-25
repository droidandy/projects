delete rc from rfp_carrier rc   
inner join carrier c on c.carrier_id = rc.carrier_id
where c.name in (
'AETNA',
'AMERITAS',
'ANTHEM_BLUE_CROSS',
'ASSURANT',
'CIGNA',
'COLONIAL_LIFE',
'DEARBORN_NATIONAL',
'GUARDIAN',
'HARTFORD',
'LINCOLN_FINANCIAL',
'METLIFE',
'PRINCIPAL_FINANCIAL_GROUP',
'PRUDENTIAL',
'RELIANCE_STANDARD',
'STANDARD',
'SUN_LIFE',
'UHC',
'UNUM',
'LIBERTY_MUTUAL',
'MUTUAL_OF_OMAHA',
'VOYA',
'OTHER') 
and rc.category in ('LIFE', 'VOL_LIFE', 'STD', 'VOL_STD', 'LTD', 'VOL_LTD');


