insert into network (carrier_id, name, type, tier)
select c.carrier_id, net.name, net.type, 'TIER_1_FULL'
from carrier c
inner join (
    SELECT 1 as ordinal, 'Life/AD&D Network' as name, CAST('LIFE' AS CHAR) as type
    UNION SELECT 2 as ordinal, 'Voluntary Life/AD&D Network', 'VOL_LIFE'
    UNION SELECT 3 as ordinal, 'Short Term Disability Network', 'STD' 
    UNION SELECT 4 as ordinal, 'Voluntary STD Network', 'VOL_STD'
    UNION SELECT 5 as ordinal, 'Long Term Disability Network', 'LTD'
    UNION SELECT 6 as ordinal, 'Voluntary LTD Network', 'VOL_LTD') net
left join network n on n.carrier_id = c.carrier_id and n.type = net.type
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
and n.network_id is null /* not exists */
order by c.carrier_id, net.ordinal;

