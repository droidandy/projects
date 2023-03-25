insert into rfp_carrier (category, endpoint, carrier_id)
select prod.category, null, c.carrier_id
from carrier c
inner join (
    SELECT 1 as ordinal, CAST('LIFE' AS CHAR) as category
    UNION SELECT 2, 'VOL_LIFE'
    UNION SELECT 3, 'STD' 
    UNION SELECT 4, 'VOL_STD'
    UNION SELECT 5, 'LTD'
    UNION SELECT 6, 'VOL_LTD') prod
left join rfp_carrier rc on rc.carrier_id = c.carrier_id and rc.category = prod.category
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
and rc.rfp_carrier_id is null /* not exists */
order by c.carrier_id, prod.ordinal;

