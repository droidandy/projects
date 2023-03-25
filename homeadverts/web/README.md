[![CircleCI](https://circleci.com/gh/Homeadverts/web/tree/production.svg?style=svg&circle-token=8ca90dc52538ff52559592e53d767af2f7f88a8c)](https://circleci.com/gh/Homeadverts/web/tree/production)

Approach
-----------------------------------
https://12factor.net/

Environments
-----------------------------------
Dev: http://dev.homeadverts.com
Live: https://luxuryaffairs.co.uk

Supervisor
-----------------------------------
```
[include]
files = /etc/supervisor/conf.d/*.conf
files = /var/www/html/luxuryaffairs.co.uk/current/app/supervisord/supervisord.conf
```

Elastic commands
-----------------------------------
```
http://localhost:9200/_aliases
http://localhost:9200/properties/_search
http://localhost:9200/properties/property/27113

php app/console elasticsearch:mapping:remove
php app/console elasticsearch:mapping:setup
php app/console elasticsearch:mapping:populate

php app/console elasticsearch:mapping:populate tag 
php app/console elasticsearch:mapping:populate article 
php app/console elasticsearch:mapping:populate topic 
php app/console elasticsearch:mapping:populate user
php app/console elasticsearch:mapping:populate property

php -d memory_limit=-1 app/console elasticsearch:mapping:populate
```

Realogy & Import commands
-----------------------------------
```
php app/console hierarchy:setup
 
Request Realogy API:
php app/console datasync:api:request getOfficeById 33649870-B087-48F8-84D4-1084E580F32B --env=prod --pretty-print
php app/console datasync:api:request getCompanyById 454188C0-0ED5-4B22-A128-16BCB2419B9A --env=prod --pretty-print
php app/console datasync:api:request getAgentById B38F9797-5D3E-4E5B-ACF3-003E16CBDB49 --env=prod --pretty-print
php app/console datasync:api:request getListingById 3825c93d-a508-4397-8fbd-42adf1ef65f7 --env=prod --pretty-print

Queque processing:
php app/console resque:perform AppBundle\\Import\\Job\\Deploy '{"jobID":3}' --env=prod
php app/console resque:perform AppBundle\\Import\\Job\\CompanyProcess '{"ref":"0092ba9d-bfd7-4a93-9080-f6b33122ed0b","updated_at":"2019-02-27T21:32:01.230","jobID":2}' --env=prod
php app/console resque:perform AppBundle\\Import\\Job\\OfficeProcess '{"ref":"1a11c0cc-1012-490e-8b6b-80dfc6508206","updated_at":"2019-05-15T11:41:56.363","jobID":2}' --env=prod
php app/console resque:perform AppBundle\\Import\\Job\\UserProcess '{"ref":"082fd62b-8543-4156-b5e7-5ed53d9ccf2d","updated_at":"2019-05-14T15:30:25.200","jobID":3}' --env=prod
php app/console resque:perform AppBundle\\Import\\Job\\Process '{"ref":"3825c93d-a508-4397-8fbd-42adf1ef65f7","updated_at":"2019-05-29T11:11:26.577","jobID":3}' --env=prod

php app/console resque:perform AppBundle\\Import\\Job\\Process '{"ref":"17150fc2-aaa3-4ad6-b798-523de3de1437","updated_at":"2019-06-15 04:45:07","jobID":17}' --env=prod

```

Commands
-----------------------------------
```
php app/console statistics:populate:all-dates --env=prod
php app/console statistics:populate:single-date --env=prod
php app/console statistics:update-summaries --env=prod

php app/console email:database:report --env=prod
php app/console email:messenger:notify --env=prod

php app/console import:run --env=prod
php app/console import:ledger:update --env=prod
php app/console import:cleanup-history --env=prod
```

Cron
-----------------------------------
```
30 */5 * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console statistics:populate:single-date --env=prod
55 */5 * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console statistics:populate:update-summaries --env=prod

*/20 * * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console email:messenger:notify --env=prod

0 0 * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console import:ledger:update --env=prod
0 1 * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console import:run --env=prod

0 20 * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console import:property:soft-delete-outdated --env=prod
0 20 * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console hierarchy:setup --env=prod

0 21 * * * php /var/www/html/luxuryaffairs.co.uk/current/app/console email:database:report --env=prod

```

CS
-----------------------------------
```
php-cs-fixer fix src/ --rules=@Symfony,@PSR1,@PSR2
```

CircleCi
-----------------------------------
```
circleci config validate
circleci local execute
```

Assets
-----------------------------------
```
php app/console assetic:watch
compass watch
```

DB
-----------------------------------
```
php app/console doctrine:database:drop --env=test --force
php app/console doctrine:database:create --env=test
php app/console doctrine:schema:create --env=test

php app/console doctrine:database:drop --env=test --force && php app/console doctrine:database:create --env=test && php app/console doctrine:schema:create --env=test
```

PHPUnit
-----------------------------------
```
php bin/phpunit -c app/
php bin/phpunit -c app/ test/AppBundle/Service/MailerTest.php
```
