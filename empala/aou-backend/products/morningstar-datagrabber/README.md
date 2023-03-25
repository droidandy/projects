# Purpose

Microservice MorningStar Datagrabber is designed to get the history of daily bars for a specified set of trading instruments.  



# Details

The set of instruments is determined by the list of exchanges and types of trading instruments.   
Data on daily candles is requested from January 1, 2000 to the current day.  
If there is price information for an instrument up to a certain date, the data is requested starting from the date following it.  



# MorningStar documentation

[Web Services Specification](https://empalagroup.sharepoint.com/:b:/g/ERn01xSUxzJJhoMJEIoCpBkBovKYQF8frtdnEh9GNRfg1Q?e=aqCFxK)

[Morningstar Exchange and Field Code Document](https://empalagroup.sharepoint.com/:b:/g/EfmuDIpxCFtCjFtWWS6V3VUBOU2Cmr7mecZ50P4rE-kFTQ?e=FV1WeV)  - Definitions of the data items contained in the Market Data API.  



# Algorithm

1) Registering new instruments  
a) Get a list (1) of all instruments traded over the last 10 days. This is done via the MorningStar "Symbol Guide" API request  
b) Get a list (2) of all instruments registered by the database in the "MORNING_STAR" stream  
c) Find new instruments as the difference "list 1" minus "list 2".  
d) Save the new instruments to the `instruments.inst` table  

2) As a result, a list of all instruments in the "MORNING_STAR" stream is formed.   
For all instruments from the list, there is the date of the last price, which is received at stage `1b`.  
If the instrument is new, or there are no prices for the instrument in the database, 
then we use the date `January 1, 2000`.  
Instruments that have prices for today are not included in the list.  

3) Fill the BullMQ queue with tasks to get prices for each instrument.  
Prices are requested starting from the date following the last date for which prices are already in the database.  
BullMQ allows us to limit the number of requests per second and the number of simultaneously processed requests, 
in accordance with quotas established under the agreement with MorningStar.  
Also, through the settings, backoff rules are set: how many times to try to request data and what time intervals 
to do between attempts.  

4) Queued jobs are started.  
The service receives prices for each instrument for the period from the first date when there are no prices until today.   
And saves the received data to the `marketdata.stock_prices_daily` table.  

5) In normal mode, the service will wait until the queue is empty, 
   i.e. receiving prices for all instruments from the list, and exits.  
   Also, the service can interrupt work in the following cases:  
   - The downtime has expired. Those the service has been idle for the time specified by the settings (now - 350s)  
   - An error occurred at the stage of forming the list of instruments.  
   - Failed to get prices for one of the instruments in N attempts. N is from the backoff rule.  



# Access to the service from a registered IP

Access to the MorningStar API is limited to IP whitelisting.  
In development mode, a VPN is used to access the MorningStar API.  
[WireGuard](https://www.wireguard.com/install/) is recommended as a VPN utility.  
The configuration file for it is requested from a superior manager.  




# Configuration

The microservice is configured using the npm package [config](https://github.com/lorenwest/node-config/wiki)


##### `log.level`

Log level: error, warn, info ... silly
```
Default: "debug"
ENV: LOG_LEVEL
```

##### `idleTimeLimitSec`

Maximum microservice downtime after which the process is interrupted
```
Default: 350
ENV: IDLE_TIME_LIMIT_SEC
```

##### `morningStar.user`

Username parameter value in MorningStar requests
```
Default: "***"
ENV: MORNING_STAR_USER
```

##### `morningStar.password`

The value of the password parameter in MorningStar requests
```
Default: "***"
ENV: MORNING_STAR_PASSWORD
```

##### `morningStar.protocol`

Protocol used in requests to MorningStar
```
Default: "http"
ENV: MORNING_STAR_PROTOCOL
```

##### `morningStar.host`

MorningStar API host
```
Default: "msuxml.morningstar.com"
ENV: MORNING_STAR_HOST
```

##### `morningStar.defaultTimezone`

Timezone in which we want to receive time in MorningStar responses
```
Default: "UTC+00"
ENV: MORNING_STAR_DEFAULT_TIMEZONE
```

##### `morningStar.quotas.symbolsInRequest`

The maximum number of requests that can be made per second
```
Default: 500
ENV: MORNING_STAR_QUOTAS_SYMBOLS_IN_REQUEST
```

##### `morningStar.quotas.requestsPerSecond`

The maximum number of symbols that can be included in one single request
```
Default: 50
ENV: MORNING_STAR_QUOTAS_REQUESTS_PER_SECOND
```

##### `morningStar.quotas.symbolsPerSecond`

The maximum number of symbols that can be requested per second. Dependent upon the enablement set on the account.
```
Default: 500
ENV: MORNING_STAR_QUOTAS_SYMBOLS_PER_SECOND
```

##### `morningStar.loadPriceFrom`

Minimum date from which prices are loaded
```
Default: "2000-01-01"
ENV: MORNING_STAR_LOAD_PRICE_FROM
```

##### `bullmq.concurrency`

BullMQ concurrency: https://docs.bullmq.io/guide/workers/concurrency
```
Default: 50
ENV: BULLMQ_CONCURRENCY
```

##### `bullmq.attempts`

The number of attempts to perform work in the BullMQ queue
```
Default: 8
ENV: BULLMQ_ATTEMPTS
```

##### `bullmq.backoff.type`

Name of the backoff strategy https://docs.bullmq.io/guide/retrying-failing-jobs
```
Default: "exponential"
ENV: BULLMQ_BACKOFF_TYPE
```

##### `bullmq.backoff.delay`

Delay in milliseconds between attempts
```
Default: 5000
ENV: BULLMQ_BACKOFF_DELAY
```

##### `bullmq.cleanOnStart`

Clear queues when starting microservice
```
Default: true
ENV: BULLMQ_CLEAN_ON_START
```

##### `bullmq.redis.host`

Redis host
```
Default: "0.0.0.0"
ENV: BULLMQ_REDIS_HOST
```

##### `bullmq.redis.port`

Redis port
```
Default: 6379
ENV: BULLMQ_REDIS_PGPORT
```

##### `bullmq.arena.host`

BullMQ Arena host https://github.com/bee-queue/arena#readme
```
Default: "0.0.0.0"
ENV: BULLMQ_ARENA_HOST
```

##### `bullmq.arena.port`

BullMQ Arena port https://github.com/bee-queue/arena#readme
```
Default: 9119
ENV: BULLMQ_ARENA_PORT
```



# Running the microservice in development

1) Place the environment variables in the `products/morningstar-datagrabber/.env` 
file based on the `products/morningstar-datagrabber/.env.example` template.
The values of the environment variables are taken [here](https://empalagroup.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?viewid=5072728f%2Dbec7%2D4e7f%2D97ed%2Dce16949bf779&id=%2FShared%20Documents%2FOperations%2FTechnology%2FSecurity%2FNEW%2DBE%2Dkeys):

2) Run docker containers with `DB` and `Hasura` via `products/core-be/docker-compose.yml`
3) Run docker container with `Redis` via `products/morningstar-datagrabber/docker-compose.yml`
4) Run migrations and Apollo server via npm command "dev" from `products/core-be/package.json`
5) Apply hasura metadata by 
```bash
# npm i -g hasura-cli
hasura metadata apply --endpoint http://localhost:8080 --admin-secret myadminsecretkey --project hasura
```
6) Run microsrvice via npm command "start" from `products/morningstar-datagrabber/package.json` 




# Testing

In test mode `...integration/morningstar.test.ts` is launched.  

The following steps are taken:

1) Data preparation:
   - Symbols 'MSFT', 'QQQ' - fill up with  price data to \<now - 14d\>
   - For the 'GOOG' symbol, prices are completely removed, but the record is left in the table `instruments.inst`
   - Symbols 'AAPL', 'SPY' - delete completely (both prices and instrument records)
2) Checking the correctness of the prepared data
3) Launching the microservice and loading data for the 'MSFT', 'QQQ', 'GOOG', 'AAPL', 'SPY' instruments.
4) Checking the loaded data.

