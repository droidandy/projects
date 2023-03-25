/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class instruments1637229999887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO instruments.exchange (id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'AMEX');
      INSERT INTO instruments.exchange (id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'NYSE');
      INSERT INTO instruments.exchange (id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'ARCA');
      INSERT INTO instruments.exchange (id, name) OVERRIDING SYSTEM VALUE VALUES (4, 'NMS');


      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11, 'XXII', '90137F103', NULL, 1, 'STOCK', '22ND CENTURY GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (55, 'ISDR', '46520M204', NULL, 1, 'STOCK', 'ISSUER DIRECT CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (74, 'GSAT', '378973408', NULL, 1, 'STOCK', 'GLOBALSTAR INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (242, 'SENS', '81727U105', NULL, 1, 'STOCK', 'SENSEONICS HOLDINGS INC
      COMMON STOCK $0.001 PAR VALUE
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (262, 'LNG', '16411R208', NULL, 1, 'STOCK', 'CHENIERE ENERGY INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (294, 'BLOK', '032108607', NULL, 3, 'ETF', 'AMPLIFY ETF TRUST
      AMPLIFY TRANSFORMATIONAL DATA
      SHARING ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (366, 'UBOT', '25460G823', NULL, 3, 'ETF', 'DIREXION SHARES ETF TRUST
      DIREXION DLY RBTCS ARTIFICIAL
      INTLLGNC & ATMTN IDX BULL 2X');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (456, 'TECB', '46436E502', NULL, 3, 'ETF', 'ISHARES TRUST
      ISHARES U S TECH BREAKTHROUGH
      MULTISECTOR ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (523, 'FLTR', '92189F486', NULL, 3, 'ETF', 'VANECK VECTORS ETF TR
      INVT GRADE FLTG RATE ETF
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (639, 'XLY', '81369Y407', NULL, 3, 'ETF', 'SELECT SECTOR SPDR FUND
      SHS BEN CONSUMER DISCRETIONARY
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (698, 'ROBO', '301505707', NULL, 3, 'ETF', 'ROBO GLOBAL ROBOTICS AND
      AUTOMATION INDEX ETF
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (753, 'CWEB', '25460E505', NULL, 3, 'ETF', 'DIREXION SHARES ETF TRUST
      DIREXION DAILY CSI CHINA
      INTERNET INDEX BULL 2X SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (779, 'IRBO', '46435U556', NULL, 3, 'ETF', 'ISHARES TRUST
      ISHARES ROBOTICS & ARTIFICIAL
      INTELLIGENCE MULTISECTOR ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (830, 'KARS', '500767827', NULL, 3, 'ETF', 'KRANESHARES TRUST
      KRANESHARES ELECTRIC VEHICLES
      AND FUTURE MOBILITY INDEX ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1137, 'THNQ', '301505731', NULL, 3, 'ETF', 'EXCHANGE TRADED CONCEPTS TRUST
      ROBO GLOBAL ARTIFICIAL
      INTELLIGENCE ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1245, 'AIEQ', '26924G813', NULL, 3, 'ETF', 'ETF MANAGERS TRUST
      AI POWERED EQUITY ETF
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1365, 'LRNZ', '53656F821', NULL, 3, 'ETF', 'LISTED FUNDS TRUST
      TRUESHARES TECHNOLOGY AI &
      DEEP LEARNING ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1413, 'BUZZ', '92189H839', NULL, 3, 'ETF', 'VANECK VECTORS ETF TRUST
      VANECK VECTORS SOCIAL
      SENTIMENT ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1623, 'IDRV', '46435U366', NULL, 3, 'ETF', 'ISHARES TRUST
      ISHARES SELF DRIVING EV AND
      TECH ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1664, 'ROKT', '78468R630', NULL, 3, 'ETF', 'SPDR SERIES TRUST
      SPDR S&P KENSHO FINAL
      FRONTIERS ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1714, 'LOUP', '45782C862', NULL, 3, 'ETF', 'INNOVATOR ETFS TRUST
      INNOVATOR LOUP FRONTIER TECH
      ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1980, 'LI', '50202M102', NULL, 4, 'STOCK', 'LI AUTO INC
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (1989, 'PLUG', '72919P202', NULL, 4, 'STOCK', 'PLUG POWER INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2006, 'ZNGA', '98986T108', NULL, 4, 'STOCK', 'ZYNGA INC
      CLASS A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2015, 'MVIS', '594960304', NULL, 4, 'STOCK', 'MICROVISION INC DEL

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2024, 'ENPH', '29355A107', NULL, 4, 'STOCK', 'ENPHASE ENERGY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2078, 'EA', '285512109', NULL, 4, 'STOCK', 'ELECTRONIC ARTS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2116, 'GRWG', '39986L109', NULL, 4, 'STOCK', 'GROWGENERATION CORP
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2144, 'RDI', '755408101', NULL, 4, 'STOCK', 'READING INTL INC CL A

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2179, 'TAST', '14574X104', NULL, 4, 'STOCK', 'CARROLS RESTAURANT GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2198, 'FSLR', '336433107', NULL, 4, 'STOCK', 'FIRST SOLAR INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2279, 'SRPT', '803607100', NULL, 4, 'STOCK', 'SAREPTA THERAPEUTICS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2297, 'HCIC', '42589T107', NULL, 4, 'STOCK', 'HENNESSY CAPITAL INVESTMENT
      CORP V CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2312, 'DLO', 'G29018101', NULL, 4, 'STOCK', 'DLOCAL LIMITED
      CLASS A COMMON SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2393, 'COST', '22160K105', NULL, 4, 'STOCK', 'COSTCO WHOLESALE CORP-NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2395, 'RIDE', '54405Q100', NULL, 4, 'STOCK', 'LORDSTOWN MOTORS CORP
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2400, 'RXRX', '75629V104', NULL, 4, 'STOCK', 'RECURSION PHARMACEUTICALS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2430, 'MIME', 'G14838109', NULL, 4, 'STOCK', 'MIMECAST LIMITED
      ORD SHS
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2442, 'ENDP', 'G30401106', NULL, 4, 'STOCK', 'ENDO INTERNATIONAL PLC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2443, 'TLRY', '88688T100', NULL, 4, 'STOCK', 'TILRAY INC
      CLASS 2 COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2489, 'LIVX', '53839L208', NULL, 4, 'STOCK', 'LIVEXLIVE MEDIA INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2536, 'REGN', '75886F107', NULL, 4, 'STOCK', 'REGENERON PHARMACEUTICALS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2546, 'NUAN', '67020Y100', NULL, 4, 'STOCK', 'NUANCE COMMUNICATIONS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2554, 'NWS', '65249B208', NULL, 4, 'STOCK', 'NEWS CORPORATION
      CLASS B
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2567, 'FRGI', '31660B101', NULL, 4, 'STOCK', 'FIESTA RESTAURANT GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2582, 'ALHC', '01625V104', NULL, 4, 'STOCK', 'ALIGNMENT HEALTHCARE INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2599, 'PRVA', '74276R102', NULL, 4, 'STOCK', 'PRIVIA HEALTH GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2662, 'AAPL', '037833100', NULL, 4, 'STOCK', 'APPLE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2751, 'CAR', '053774105', NULL, 4, 'STOCK', 'AVIS BUDGET GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2840, 'DDOG', '23804L103', NULL, 4, 'STOCK', 'DATADOG INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2843, 'IPWR', '451622203', NULL, 4, 'STOCK', 'IDEAL POWER INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (2902, 'KHC', '500754106', NULL, 4, 'STOCK', 'KRAFT HEINZ COMPANY (THE)
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3034, 'CPSH', '12619F104', NULL, 4, 'STOCK', 'CPS TECHNOLOGIES CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3061, 'DENN', '24869P104', NULL, 4, 'STOCK', 'DENNYS CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3141, 'DBX', '26210C104', NULL, 4, 'STOCK', 'DROPBOX INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3146, 'CBAT', '14986C102', NULL, 4, 'STOCK', 'CBAK ENERGY TECHNOLOGY INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3166, 'ANSS', '03662Q105', NULL, 4, 'STOCK', 'ANSYS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3189, 'SHEN', '82312B106', NULL, 4, 'STOCK', 'SHENANDOAH TELECOMMUNICATIONS
      CO
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3217, 'APPN', '03782L101', NULL, 4, 'STOCK', 'APPIAN CORPORATION
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3239, 'ADSK', '052769106', NULL, 4, 'STOCK', 'AUTODESK INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3246, 'DISCA', '25470F104', NULL, 4, 'STOCK', 'DISCOVERY INC
      SERIES A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3259, 'MGTI', '55302P202', NULL, 4, 'STOCK', 'MGT CAPITAL INVESTMENTS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3318, 'AVGO', '11135F101', NULL, 4, 'STOCK', 'BROADCOM INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3339, 'OGI', '68620P101', NULL, 4, 'STOCK', 'ORGANIGRAM HOLDINGS INC
      COMMON
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3361, 'BLCN', '829658202', NULL, 4, 'ETF', 'SIREN ETF TRUST
      SIREN NASDAQ NEXGEN ECONOMY
      ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3452, 'CHUY', '171604101', NULL, 4, 'STOCK', 'CHUY S HOLDINGS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3453, 'BZ', '48553T106', NULL, 4, 'STOCK', 'KANZHUN LIMITED
      AMERICAN DEPOSITORY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3464, 'GRPN', '399473206', NULL, 4, 'STOCK', 'GROUPON INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3472, 'GDEN', '381013101', NULL, 4, 'STOCK', 'GOLDEN ENTERTAINMENT INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3474, 'RUTH', '783332109', NULL, 4, 'STOCK', 'RUTHS HOSPITALITY GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3495, 'INVA', '45781M101', NULL, 4, 'STOCK', 'INNOVIVA INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3542, 'VRTX', '92532F100', NULL, 4, 'STOCK', 'VERTEX PHARMACEUTICALS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3572, 'CLOV', '18914F103', NULL, 4, 'STOCK', 'CLOVER HEALTH INVESTMENTS CORP
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3584, 'FITB', '316773100', NULL, 4, 'STOCK', 'FIFTH THIRD BANCORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3697, 'WDAY', '98138H101', NULL, 4, 'STOCK', 'WORKDAY INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3922, 'NTES', '64110W102', NULL, 4, 'STOCK', 'NETEASE INC
      SPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (3991, 'WBA', '931427108', NULL, 4, 'STOCK', 'WALGREEN BOOTS ALLIANCE INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4020, 'GH', '40131M109', NULL, 4, 'STOCK', 'GUARDANT HEALTH INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4048, 'BGNE', '07725L102', NULL, 4, 'STOCK', 'BEIGENE LTD
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4065, 'LAUR', '518613203', NULL, 4, 'STOCK', 'LAUREATE EDUCATION INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4069, 'TXN', '882508104', NULL, 4, 'STOCK', 'TEXAS INSTRUMENTS INCORPORATED

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4127, 'LRCX', '512807108', NULL, 4, 'STOCK', 'LAM RESEARCH CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4174, 'HEAR', '900450206', NULL, 4, 'STOCK', 'TURTLE BEACH CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4176, 'MAXN', 'Y58473102', NULL, 4, 'STOCK', 'MAXEON SOLAR TECHNOLOGIES
      LTD ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4182, 'ATEX', '03676C100', NULL, 4, 'STOCK', 'ANTERIX INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4209, 'HYFM', '44888K209', NULL, 4, 'STOCK', 'HYDROFARM HOLDINGS GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4210, 'AIQ', '37954Y632', NULL, 4, 'ETF', 'GLOBAL X FUNDS
      GLOBAL X ARTIFICIAL
      INTELLIGENCE & TECHNOLOGY ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4244, 'ASO', '00402L107', NULL, 4, 'STOCK', 'ACADEMY SPORTS AND OUTDOORS
      INC COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4336, 'RETA', '75615P103', NULL, 4, 'STOCK', 'REATA PHARMACEUTICALS INC
      CL A COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4351, 'ROBT', '33738R720', NULL, 4, 'ETF', 'FIRST TR EXCHANGE TRADED FD VI
      NASDAQ ARTIFICIAL INTELLIGENCE
      AND ROBOTICS ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4403, 'MRNA', '60770K107', NULL, 4, 'STOCK', 'MODERNA INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4500, 'BBKCF', '089804108', NULL, 4, 'STOCK', 'BIGG DIGITAL ASSETS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4544, 'GTIM', '382140879', NULL, 4, 'STOCK', 'GOOD TIMES RESTAURANTS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4683, 'QRTEA', '74915M100', NULL, 4, 'STOCK', 'QURATE RETAIL INC
      SERIES A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4704, 'ZYNE', '98986X109', NULL, 4, 'STOCK', 'ZYNERBA PHARMACEUTICALS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4716, 'OMAB', '400501102', NULL, 4, 'STOCK', 'GRUPO AEROPORTUARIO DEL
      CENTRO NORTE SASPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4802, 'ULTA', '90384S303', NULL, 4, 'STOCK', 'ULTA BEAUTY INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4842, 'PCTY', '70438V106', NULL, 4, 'STOCK', 'PAYLOCITY HOLDING CORPORATION
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4909, 'CSCO', '17275R102', NULL, 4, 'STOCK', 'CISCO SYSTEMS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4910, 'ADP', '053015103', NULL, 4, 'STOCK', 'AUTOMATIC DATA PROCESSING INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4945, 'LBTYK', 'G5480U120', NULL, 4, 'STOCK', 'LIBERTY GLOBAL PLC
      CLASS C
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4953, 'IAC', '44891N208', NULL, 4, 'STOCK', 'IAC INTERACTIVECORP
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4971, 'DTMXF', '23809L108', NULL, 4, 'STOCK', 'DATAMETREX AI LTD
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (4973, 'NXST', '65336K103', NULL, 4, 'STOCK', 'NEXSTAR MEDIA GROUP INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5008, 'EDTK', 'G8211A108', NULL, 4, 'STOCK', 'SKILLFUL CRAFTSMAN EDCATION
      TECHNOLOGY LIMITED ORDINARY
      SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5033, 'CORT', '218352102', NULL, 4, 'STOCK', 'CORCEPT THERAPEUTICS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5099, 'MDLZ', '609207105', NULL, 4, 'STOCK', 'MONDELEZ INTERNATIONAL INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5123, 'TA', '89421B109', NULL, 4, 'STOCK', 'TRAVELCENTERS OF AMERICA INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5146, 'EXPE', '30212P303', NULL, 4, 'STOCK', 'EXPEDIA GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5151, 'RNLX', '75973T101', NULL, 4, 'STOCK', 'RENALYTIX PLC
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5163, 'JBHT', '445658107', NULL, 4, 'STOCK', 'JB HUNT TRANSPORT SERVICES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5220, 'CTRE', '14174T107', NULL, 4, 'STOCK', 'CARETRUST REIT INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5362, 'ZS', '98980G102', NULL, 4, 'STOCK', 'ZSCALER INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5370, 'GBTC', '389637109', NULL, 4, 'STOCK', 'GRAYSCALE BITCOIN TRUST
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5398, 'HST', '44107P104', NULL, 4, 'STOCK', 'HOST HOTELS & RESORTS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5401, 'NXPI', 'N6596X109', NULL, 4, 'STOCK', 'NXP SEMICONDUCTORS N V

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5408, 'INTC', '458140100', NULL, 4, 'STOCK', 'INTEL CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5487, 'CLNE', '184499101', NULL, 4, 'STOCK', 'CLEAN ENERGY FUELS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5541, 'SRNG', 'G8354H126', NULL, 4, 'STOCK', 'SOARING EAGLE ACQUISITION
      CORP CLASS A ORDINARY SHARE
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5558, 'AAL', '02376R102', NULL, 4, 'STOCK', 'AMERICAN AIRLINES GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5565, 'PTON', '70614W100', NULL, 4, 'STOCK', 'PELOTON INTERACTIVE INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5574, 'SPWR', '867652406', NULL, 4, 'STOCK', 'SUNPOWER CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5611, 'INSE', '45782N108', NULL, 4, 'STOCK', 'INSPIRED ENTERTAINMENT INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5621, 'DMGGF', '23345B200', NULL, 4, 'STOCK', 'DMG BLOCKCHAIN SOLUTIONS
      INC COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5716, 'ADBE', '00724F101', NULL, 4, 'STOCK', 'ADOBE INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5745, 'MAPS', '92971A109', NULL, 4, 'STOCK', 'WM TECHNOLOGY INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5750, 'XLNX', '983919101', NULL, 4, 'STOCK', 'XILINX INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5790, 'SIRI', '82968B103', NULL, 4, 'STOCK', 'SIRIUS XM HOLDINGS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5813, 'BLMN', '094235108', NULL, 4, 'STOCK', 'BLOOMIN BRANDS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5821, 'OTLY', '67421J108', NULL, 4, 'STOCK', 'OATLY GROUP AB
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5831, 'MNDY', 'M7S64H106', NULL, 4, 'STOCK', 'MONDAY.COM LTD
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5851, 'CDXC', '171077407', NULL, 4, 'STOCK', 'CHROMADEX CORPORATION
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5872, 'HAPP', 'G4289N114', NULL, 4, 'STOCK', 'HAPPINESS BIOTECH GROUP
      LIMITED ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5934, 'GLBE', 'M5216V106', NULL, 4, 'STOCK', 'GLOBAL E ONLINE LTD
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (5984, 'SMPL', '82900L102', NULL, 4, 'STOCK', 'SIMPLY GOOD FOODS COMPANY
      (THE) COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6158, 'CNTY', '156492100', NULL, 4, 'STOCK', 'CENTURY CASINOS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6174, 'REG', '758849103', NULL, 4, 'STOCK', 'REGENCY CENTERS CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6181, 'CZR', '12769G100', NULL, 4, 'STOCK', 'CAESARS ENTERTAINMENT INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6216, 'WKHS', '98138J206', NULL, 4, 'STOCK', 'WORKHORSE GROUP INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6227, 'APA', '03743Q108', NULL, 4, 'STOCK', 'APA CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6250, 'AMCX', '00164V103', NULL, 4, 'STOCK', 'AMC NETWORKS INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6258, 'SWKS', '83088M102', NULL, 4, 'STOCK', 'SKYWORKS SOLUTIONS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6266, 'FUV', '039587100', NULL, 4, 'STOCK', 'ARCIMOTO INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6274, 'ZGNX', '98978L204', NULL, 4, 'STOCK', 'ZOGENIX INC
      COM NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6290, 'RIBT', '762831204', NULL, 4, 'STOCK', 'RICEBRAN TECHNOLOGIES

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6345, 'SIGI', '816300107', NULL, 4, 'STOCK', 'SELECTIVE INSURANCE GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6355, 'PYPL', '70450Y103', NULL, 4, 'STOCK', 'PAYPAL HOLDINGS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6411, 'FLWS', '68243Q106', NULL, 4, 'STOCK', '1800 FLOWERS.COM INC CL A

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6529, 'SALM', '794093104', NULL, 4, 'STOCK', 'SALEM MEDIA GROUP INC
      CLASS A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6532, 'NTRS', '665859104', NULL, 4, 'STOCK', 'NORTHERN TRUST CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6541, 'VIAC', '92556H206', NULL, 4, 'STOCK', 'VIACOMCBS INC
      CLASS B COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6580, 'ATSG', '00922R105', NULL, 4, 'STOCK', 'AIR TRANSPORT SERVICES GROUP
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6631, 'LX', '528877103', NULL, 4, 'STOCK', 'LEXINFINTECH HOLDINGS LTD
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6665, 'VERV', '92539P101', NULL, 4, 'STOCK', 'VERVE THERAPEUTICS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6669, 'RIOT', '767292105', NULL, 4, 'STOCK', 'RIOT BLOCKCHAIN INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6683, 'MARA', '565788106', NULL, 4, 'STOCK', 'MARATHON DIGITAL HLDGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6701, 'CHRW', '12541W209', NULL, 4, 'STOCK', 'C H ROBINSON WORLDWIDE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6729, 'PT', '72352G107', NULL, 4, 'STOCK', 'PINTEC TECHNOLOGY HOLDINGS
      LIMITED AMERICAN DEPOSITARY
      SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6734, 'VTRS', '92556V106', NULL, 4, 'STOCK', 'VIATRIS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6897, 'CHTR', '16119P108', NULL, 4, 'STOCK', 'CHARTER COMMUNICATIONS INC
      NEW CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (6970, 'ALZN', '02262M308', NULL, 4, 'STOCK', 'ALZAMEND NEURO INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7002, 'ACB', '05156X884', NULL, 4, 'STOCK', 'AURORA CANNABIS INC
      COM NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7008, 'PLAY', '238337109', NULL, 4, 'STOCK', 'DAVE & BUSTERS ENTERTAINMENT
      INC COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7012, 'IONS', '462222100', NULL, 4, 'STOCK', 'IONIS PHARMACEUTICALS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7024, 'TACO', '245496104', NULL, 4, 'STOCK', 'DEL TACO RESTAURANTS INC NEW
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7053, 'GRIL', '627333107', NULL, 4, 'STOCK', 'MUSCLE MAKER INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7096, 'KALU', '483007704', NULL, 4, 'STOCK', 'KAISER ALUMINUM CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7108, 'OSTK', '690370101', NULL, 4, 'STOCK', 'OVERSTOCK.COM INC
      DEL
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7259, 'RRGB', '75689M101', NULL, 4, 'STOCK', 'RED ROBIN GOURMET BURGERS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7288, 'BCPC', '057665200', NULL, 4, 'STOCK', 'BALCHEM CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7353, 'CSGP', '22160N109', NULL, 4, 'STOCK', 'COSTAR GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7379, 'CSIQ', '136635109', NULL, 4, 'STOCK', 'CANADIAN SOLAR INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7505, 'HSSHF', '25381D107', NULL, 4, 'STOCK', 'DIGIHOST TECHNOLOGY INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7509, 'VIH', 'G9441E100', NULL, 4, 'STOCK', 'VPC IMPACT ACQUISITION
      HOLDINGS CLASS A ORDINARY
      SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7549, 'DLTR', '256746108', NULL, 4, 'STOCK', 'DOLLAR TREE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7585, 'NVDA', '67066G104', NULL, 4, 'STOCK', 'NVIDIA CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7673, 'AY', 'G0751N103', NULL, 4, 'STOCK', 'ATLANTICA SUSTAINABLE
      INFRASTRUCTURE PLC ORDINARY
      SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7701, 'EXPD', '302130109', NULL, 4, 'STOCK', 'EXPEDITORS INTERNATIONAL OF
      WASHINGTON INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7843, 'AVAV', '008073108', NULL, 4, 'STOCK', 'AEROVIRONMENT INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7858, 'ZY', '98985X100', NULL, 4, 'STOCK', 'ZYMERGEN INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (7925, 'ILMN', '452327109', NULL, 4, 'STOCK', 'ILLUMINA INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8000, 'SWIM', '51819L107', NULL, 4, 'STOCK', 'LATHAM GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8081, 'PBPB', '73754Y100', NULL, 4, 'STOCK', 'POTBELLY CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8143, 'NDLS', '65540B105', NULL, 4, 'STOCK', 'NOODLES & COMPANY
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8181, 'TROW', '74144T108', NULL, 4, 'STOCK', 'PRICE T ROWE GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8216, 'MAR', '571903202', NULL, 4, 'STOCK', 'MARRIOTT INTERNATIONAL
      CLASS A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8227, 'FAT', '30258N105', NULL, 4, 'STOCK', 'FAT BRANDS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8301, 'STKS', '88338K103', NULL, 4, 'STOCK', 'ONE GROUP HOSPITALITY INC
      (THE)
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8391, 'KNDI', '483709101', NULL, 4, 'STOCK', 'KANDI TECHNOLGIES GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8397, 'UAL', '910047109', NULL, 4, 'STOCK', 'UNITED AIRLINES HOLDINGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8564, 'STLD', '858119100', NULL, 4, 'STOCK', 'STEEL DYNAMICS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8632, 'CSX', '126408103', NULL, 4, 'STOCK', 'CSX CORPORATION
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8690, 'COUP', '22266L106', NULL, 4, 'STOCK', 'COUPA SOFTWARE INCORPORATED
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8783, 'LSTR', '515098101', NULL, 4, 'STOCK', 'LANDSTAR SYSTEMS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8853, 'TTD', '88339J105', NULL, 4, 'STOCK', 'TRADE DESK INC (THE)
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8956, 'BKLLF', '19200Q209', NULL, 4, 'STOCK', 'CODEBASE VENTURES INC
      COM NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8957, 'DISCK', '25470F302', NULL, 4, 'STOCK', 'DISCOVERY INC
      SERIES C COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (8972, 'FLYW', '302492103', NULL, 4, 'STOCK', 'FLYWIRE CORPORATION VOTING
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9009, 'BIIB', '09062X103', NULL, 4, 'STOCK', 'BIOGEN INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9048, 'SGMS', '80874P109', NULL, 4, 'STOCK', 'SCIENTIFIC GAMES CORP
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9109, 'AMAT', '038222105', NULL, 4, 'STOCK', 'APPLIED MATERIALS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9150, 'BOWX', '103085106', NULL, 4, 'STOCK', 'BOWX ACQUISITION CORP
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9170, 'PENN', '707569109', NULL, 4, 'STOCK', 'PENN NATIONAL GAMING INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9271, 'STMP', '852857200', NULL, 4, 'STOCK', 'STAMPS.COM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9275, 'TPIC', '87266J104', NULL, 4, 'STOCK', 'TPI COMPOSITES INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9285, 'LYFT', '55087P104', NULL, 4, 'STOCK', 'LYFT INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9318, 'SCR', '80919D202', NULL, 4, 'STOCK', 'SCORE MEDIA & GAMING INC
      CL A SUB VTG SHS NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9327, 'RPRX', 'G7709Q104', NULL, 4, 'STOCK', 'ROYALTY PHARMA PLC
      CLASS A ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9334, 'INCY', '45337C102', NULL, 4, 'STOCK', 'INCYTE CORPORATION
      FORMERLY INCYTE GENOMICS INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9338, 'PETS', '716382106', NULL, 4, 'STOCK', 'PETMED EXPRESS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9346, 'NPCE', '641288105', NULL, 4, 'STOCK', 'NEUROPACE INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9357, 'JAKK', '47012E403', NULL, 4, 'STOCK', 'JAKKS PACIFIC INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9420, 'CINF', '172062101', NULL, 4, 'STOCK', 'CINCINNATI FINANCIAL CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9458, 'GAHC', '37951M102', NULL, 4, 'STOCK', 'GLOBAL ARENA HOLDING INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9533, 'JCOM', '48123V102', NULL, 4, 'STOCK', 'J2 GLOBAL INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9545, 'ITRI', '465741106', NULL, 4, 'STOCK', 'ITRON INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9617, 'ILPT', '456237106', NULL, 4, 'STOCK', 'INDUSTRIAL LOGISTICS
      PROPERTIES TRUST COMMON SHARES
      OF BENEFICIAL INTEREST');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9620, 'EBET', '29667L106', NULL, 4, 'STOCK', 'ESPORTS TECHNOLOGIES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9667, 'ODFL', '679580100', NULL, 4, 'STOCK', 'OLD DOMINION FREIGHT LINES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9679, 'IRDM', '46269C102', NULL, 4, 'STOCK', 'IRIDIUM COMMUNICATIONS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9686, 'NVVE', '67079Y100', NULL, 4, 'STOCK', 'NUVVE HOLDING CORP
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9708, 'BKNG', '09857L108', NULL, 4, 'STOCK', 'BOOKING HOLDINGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9736, 'LFST', '53228F101', NULL, 4, 'STOCK', 'LIFESTANCE HEALTH GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9742, 'SBUX', '855244109', NULL, 4, 'STOCK', 'STARBUCKS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9772, 'FATE', '31189P102', NULL, 4, 'STOCK', 'FATE THERAPEUTICS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9776, 'IPW', '46265P107', NULL, 4, 'STOCK', 'IPOWER INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9793, 'EBAY', '278642103', NULL, 4, 'STOCK', 'EBAY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9828, 'QCOM', '747525103', NULL, 4, 'STOCK', 'QUALCOMM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9833, 'CRSR', '22041X102', NULL, 4, 'STOCK', 'CORSAIR GAMING INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9902, 'KRUS', '501270102', NULL, 4, 'STOCK', 'KURA SUSHI USA INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9921, 'CENX', '156431108', NULL, 4, 'STOCK', 'CENTURY ALUMINUM CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9950, 'DRIV', '37954Y624', NULL, 4, 'ETF', 'GLOBAL X FDS
      GLOBAL X AUTONOMOUS & ELECTRIC
      VEHICLES ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9971, 'DKNG', '26142R104', NULL, 4, 'STOCK', 'DRAFTKINGS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9980, 'AMRN', '023111206', NULL, 4, 'STOCK', 'AMARIN CORPORATION PLC
      SPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (9986, 'AMD', '007903107', NULL, 4, 'STOCK', 'ADVANCED MICRO DEVICES INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10009, 'CRWD', '22788C105', NULL, 4, 'STOCK', 'CROWDSTRIKE HOLDINGS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10025, 'MNTV', '60878Y108', NULL, 4, 'STOCK', 'MOMENTIVE GLOBAL INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10032, 'TSLA', '88160R101', NULL, 4, 'STOCK', 'TESLA INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10055, 'QLYS', '74758T303', NULL, 4, 'STOCK', 'QUALYS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10058, 'MTCH', '57667L107', NULL, 4, 'STOCK', 'MATCH GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10083, 'MU', '595112103', NULL, 4, 'STOCK', 'MICRON TECHNOLOGY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10090, 'SCHN', '806882106', NULL, 4, 'STOCK', 'SCHNITZER STEEL INDUSTRIES INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10118, 'GRUB', '48214T305', NULL, 4, 'STOCK', 'JUST EAT TAKEAWAY.COM N V
      AMERICAN DEPOSITARY RECEIPTS
      SPONSORED');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10232, 'ALGT', '01748X102', NULL, 4, 'STOCK', 'ALLEGIANT TRAVEL CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10235, 'MGPI', '55303J106', NULL, 4, 'STOCK', 'MGP INGREDIENTS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10297, 'NFLX', '64110L106', NULL, 4, 'STOCK', 'NETFLIX COM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10368, 'TREE', '52603B107', NULL, 4, 'STOCK', 'LENDINGTREE INC NEW
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10373, 'TSCO', '892356106', NULL, 4, 'STOCK', 'TRACTOR SUPPLY CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10426, 'DOCU', '256163106', NULL, 4, 'STOCK', 'DOCUSIGN INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10451, 'CHDN', '171484108', NULL, 4, 'STOCK', 'CHURCHILL DOWNS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10453, 'DOYU', '25985W105', NULL, 4, 'STOCK', 'DOUYU INTERNATIONAL
      HOLDINGS LIMITED ADS
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10465, 'NEPT', '64079L105', NULL, 4, 'STOCK', 'NEPTUNE WELLNESS SOLUTIONS
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10486, 'KTPPF', '48600A100', NULL, 4, 'STOCK', 'KATIPULT TECHNOLOGY CORP
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10561, 'ATNI', '00215F107', NULL, 4, 'STOCK', 'ATN INTL INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10581, 'AKAM', '00971T101', NULL, 4, 'STOCK', 'AKAMAI TECHNOLOGIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10613, 'MUDS', '62477L107', NULL, 4, 'STOCK', 'MUDRICK CAPITAL ACQUISITION
      CORPORATION II CLASS A COMMON
      STOCK');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10663, 'GT', '382550101', NULL, 4, 'STOCK', 'GOODYEAR TIRE & RUBBER CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10725, 'CRON', '22717L101', NULL, 4, 'STOCK', 'CRONOS GROUP INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10835, 'CLVR', '186760104', NULL, 4, 'STOCK', 'CLEVER LEAVES HLDGS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10848, 'CNSL', '209034107', NULL, 4, 'STOCK', 'CONSOLIDATED COMMUNICATIONS
      HLDGS INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10879, 'GILD', '375558103', NULL, 4, 'STOCK', 'GILEAD SCIENCES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10888, 'YQ', '81807M106', NULL, 4, 'STOCK', '17 EDUCATION & TECHNOLOGY
      GROUP INC AMERICAN DEPOSITARY
      SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (10914, 'ETSY', '29786A106', NULL, 4, 'STOCK', 'ETSY INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11001, 'VIRT', '928254101', NULL, 4, 'STOCK', 'VIRTU FINANCIAL INC
      CLASS A COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11019, 'BCII', '09368L100', NULL, 4, 'STOCK', 'BCII ENTERPRISES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11099, 'LITE', '55024U109', NULL, 4, 'STOCK', 'LUMENTUM HOLDINGS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11125, 'SIVB', '78486Q101', NULL, 4, 'STOCK', 'SVB FINANCIAL GROUP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11270, 'BMRN', '09061G101', NULL, 4, 'STOCK', 'BIOMARIN PHARMACEUTICAL INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11294, 'PEP', '713448108', NULL, 4, 'STOCK', 'PEPSICO INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11298, 'PFPT', '743424103', NULL, 4, 'STOCK', 'PROOFPOINT INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11321, 'AMZN', '023135106', NULL, 4, 'STOCK', 'AMAZON.COM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11376, 'HIBB', '428567101', NULL, 4, 'STOCK', 'HIBBETT INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11413, 'APPF', '03783C100', NULL, 4, 'STOCK', 'APPFOLIO INC
      CLASS A COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11426, 'MCHP', '595017104', NULL, 4, 'STOCK', 'MICROCHIP TECHNOLOGY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11434, 'ADI', '032654105', NULL, 4, 'STOCK', 'ANALOG DEVICES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11526, 'SCPL', '809087109', NULL, 4, 'STOCK', 'SCIPLAY CORPORATION
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11561, 'REGI', '75972A301', NULL, 4, 'STOCK', 'RENEWABLE ENERGY GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11729, 'AMSC', '030111207', NULL, 4, 'STOCK', 'AMERICAN SUPERCONDUCTOR
      CORPORATION
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11787, 'NBDR', '65486W105', NULL, 4, 'STOCK', 'NO BORDERS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11809, 'ROST', '778296103', NULL, 4, 'STOCK', 'ROSS STORES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11846, 'BJRI', '09180C106', NULL, 4, 'STOCK', 'BJS RESTAURANTS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (11941, 'POLA', '73102V105', NULL, 4, 'STOCK', 'POLAR POWER INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12046, 'FOXA', '35137L105', NULL, 4, 'STOCK', 'FOX CORPORATION
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12062, 'HZNP', 'G46188101', NULL, 4, 'STOCK', 'HORIZON THERAPEUTICS PUBLIC
      LIMITED COMPANY ORDINARY
      SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12069, 'SFIX', '860897107', NULL, 4, 'STOCK', 'STITCH FIX INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12107, 'TXRH', '882681109', NULL, 4, 'STOCK', 'TEXAS ROADHOUSE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12125, 'ACGL', 'G0450A105', NULL, 4, 'STOCK', 'ARCH CAPITAL GROUP LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12158, 'ZM', '98980L101', NULL, 4, 'STOCK', 'ZOOM VIDEO COMMUNICATIONS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12184, 'CME', '12572Q105', NULL, 4, 'STOCK', 'CME GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12246, 'GOOG', '02079K107', NULL, 4, 'STOCK', 'ALPHABET INC
      CLASS C CAPITAL STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12278, 'VFF', '92707Y108', NULL, 4, 'STOCK', 'VILLAGE FARMS INTERNATIONAL
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12286, 'UTME', 'G9411M108', NULL, 4, 'STOCK', 'UTIME LIMITED
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12302, 'BBQ', '05551A109', NULL, 4, 'STOCK', 'BBQ HOLDINGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12305, 'ARKR', '040712101', NULL, 4, 'STOCK', 'ARK RESTAURANTS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12315, 'FB', '30303M102', NULL, 4, 'STOCK', 'FACEBOOK INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12334, 'ESCA', '296056104', NULL, 4, 'STOCK', 'ESCALADE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12433, 'BILI', '090040106', NULL, 4, 'STOCK', 'BILIBILI INC
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12475, 'AZPN', '045327103', NULL, 4, 'STOCK', 'ASPEN TECHNOLOGY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12482, 'GAN', 'G3728V109', NULL, 4, 'STOCK', 'GAN LIMITED
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12519, 'PFG', '74251V102', NULL, 4, 'STOCK', 'PRINCIPAL FINANCIAL GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12533, 'CIDM', '172406209', NULL, 4, 'STOCK', 'CINEDIGM CORP
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12569, 'BEEM', '07373B109', NULL, 4, 'STOCK', 'BEAM GLOBAL
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12570, 'LULU', '550021109', NULL, 4, 'STOCK', 'LULULEMON ATHLETICA INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12612, 'TTWO', '874054109', NULL, 4, 'STOCK', 'TAKE TWO INTERACTIVE SOFTWARE
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12628, 'CBRL', '22410J106', NULL, 4, 'STOCK', 'CRACKER BARREL OLD COUNTRY
      STORE INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12629, 'REAL', '88339P101', NULL, 4, 'STOCK', 'REALREAL INC (THE)
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12633, 'ZLAB', '98887Q104', NULL, 4, 'STOCK', 'ZAI LAB LIMITED
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12692, 'BRCN', '120831102', NULL, 4, 'STOCK', 'BURCON NUTRASCIENCE
      CORPORATION
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12727, 'ALNY', '02043Q107', NULL, 4, 'STOCK', 'ALNYLAM PHARMACEUTICALS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12738, 'LILAK', 'G9001E128', NULL, 4, 'STOCK', 'LIBERTY LATIN AMERICA LTD
      CLASS C COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12788, 'CRBP', '21833P103', NULL, 4, 'STOCK', 'CORBUS PHARMACEUTICALS
      HOLDINGS INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12802, 'DUOT', '266042407', NULL, 4, 'STOCK', 'DUOS TECHNOLOGIES GROUP INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12848, 'ELYS', '290734102', NULL, 4, 'STOCK', 'ELYS GAME TECHNOLOGY CORP
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12864, 'ARNA', '040047607', NULL, 4, 'STOCK', 'ARENA PHARMACEUTICALS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12867, 'FCEL', '35952H601', NULL, 4, 'STOCK', 'FUELCELL ENERGY INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12894, 'AMGN', '031162100', NULL, 4, 'STOCK', 'AMGEN INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12928, 'OLED', '91347P105', NULL, 4, 'STOCK', 'UNIVERSAL DISPLAY CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12939, 'CMCSA', '20030N101', NULL, 4, 'STOCK', 'COMCAST CORP
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (12960, 'BGFV', '08915P101', NULL, 4, 'STOCK', 'BIG 5 SPORTING GOODS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13042, 'TMCI', '89455T109', NULL, 4, 'STOCK', 'TREACE MEDICAL CONCEPTS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13051, 'CSCW', 'G2287A100', NULL, 4, 'STOCK', 'COLOR STAR TECHNOLOGY CO
      LTD ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13052, 'ORBC', '68555P100', NULL, 4, 'STOCK', 'ORBCOMM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13092, 'JAZZ', 'G50871105', NULL, 4, 'STOCK', 'JAZZ PHARMACEUTICALS PLC
      US LISTED
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13172, 'VSQTF', '92650P104', NULL, 4, 'STOCK', 'VICTORY SQUARE TECHNOLOGIES
      INC COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13190, 'TMUS', '872590104', NULL, 4, 'STOCK', 'T MOBILE US INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13195, 'SAFM', '800013104', NULL, 4, 'STOCK', 'SANDERSON FARMS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13211, 'KNBE', '49926T104', NULL, 4, 'STOCK', 'KNOWBE4 INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13219, 'RUN', '86771W105', NULL, 4, 'STOCK', 'SUNRUN INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13252, 'MSFT', '594918104', NULL, 4, 'STOCK', 'MICROSOFT CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13283, 'BLNK', '09354A100', NULL, 4, 'STOCK', 'BLINK CHARGING CO
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13293, 'PCRX', '695127100', NULL, 4, 'STOCK', 'PACIRA BIOSCIENCES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13308, 'JACK', '466367109', NULL, 4, 'STOCK', 'JACK IN THE BOX INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13343, 'BTWN', 'G1355U113', NULL, 4, 'STOCK', 'BRIDGETOWN HOLDINGS LIMITED
      CLASS A ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13350, 'ARVL', 'L0423Q108', NULL, 4, 'STOCK', 'ARRIVAL
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13377, 'RICK', '74934Q108', NULL, 4, 'STOCK', 'RCI HOSPITALITY HOLDINGS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13392, 'TEAM', 'G06242104', NULL, 4, 'STOCK', 'ATLASSIAN CORPORATION PLC
      CLASS A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13554, 'UTHR', '91307C102', NULL, 4, 'STOCK', 'UNITED THERAPEUTICS CORP DEL

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13566, 'SKYT', '83089J108', NULL, 4, 'STOCK', 'SKYWATER TECHNOLOGY INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13580, 'JBLU', '477143101', NULL, 4, 'STOCK', 'JETBLUE AIRWAYS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13718, 'BLDP', '058586108', NULL, 4, 'STOCK', 'BALLARD POWER SYSTEMS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13721, 'NHTC', '63888P406', NULL, 4, 'STOCK', 'NATURAL HEALTH TRENDS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13849, 'TDUP', '88556E102', NULL, 4, 'STOCK', 'THREDUP INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13887, 'GOOGL', '02079K305', NULL, 4, 'STOCK', 'ALPHABET INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13943, 'PRPL', '74640Y106', NULL, 4, 'STOCK', 'PURPLE INNOVATION INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13951, 'ORLY', '67103H107', NULL, 4, 'STOCK', 'O REILLY AUTOMOTIVE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13953, 'MNST', '61174X109', NULL, 4, 'STOCK', 'MONSTER BEVERAGE CORPORATION
      NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (13959, 'NWSA', '65249B109', NULL, 4, 'STOCK', 'NEWS CORPORATION
      CLASS A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14039, 'SEDG', '83417M104', NULL, 4, 'STOCK', 'SOLAREDGE TECHNOLOGIES INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14042, 'SBGI', '829226109', NULL, 4, 'STOCK', 'SINCLAIR BROADCAST GROUP INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14050, 'CAKE', '163072101', NULL, 4, 'STOCK', 'CHEESECAKE FACTORY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14066, 'CRNC', '156727109', NULL, 4, 'STOCK', 'CERENCE INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14087, 'EWTX', '28036F105', NULL, 4, 'STOCK', 'EDGEWISE THERAPEUTICS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14133, 'BLPFF', '09370Q105', NULL, 4, 'STOCK', 'BLOK TECHNOLOGIES INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14144, 'BOTZ', '37954Y715', NULL, 4, 'ETF', 'GLOBAL X FUNDS
      GLOBAL X ROBOTICS & ARTIFICIAL
      INTELLIGENCE ETF');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14149, 'ARVN', '04335A105', NULL, 4, 'STOCK', 'ARVINAS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14207, 'ATVI', '00507V109', NULL, 4, 'STOCK', 'ACTIVISION BLIZZARD INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14211, 'BL', '09239B109', NULL, 4, 'STOCK', 'BLACKLINE INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14345, 'SKYW', '830879102', NULL, 4, 'STOCK', 'SKYWEST INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14403, 'DCRC', '24279D105', NULL, 4, 'STOCK', 'DECARBONIZATION PLUS
      ACQUISITION CORPORATION III
      CLASS A COMMON STOCK');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14424, 'TWOU', '90214J101', NULL, 4, 'STOCK', '2U INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14426, 'FFIV', '315616102', NULL, 4, 'STOCK', 'F5 NETWORKS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14441, 'GOEV', '13803R102', NULL, 4, 'STOCK', 'CANOO INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14443, 'FIVN', '338307101', NULL, 4, 'STOCK', 'FIVE9 INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14454, 'LOCO', '268603107', NULL, 4, 'STOCK', 'EL POLLO LOCO HOLDINGS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14482, 'REDU', '76761L102', NULL, 4, 'STOCK', 'RISE EDUCATION CAYMAN LTD
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14501, 'FANG', '25278X109', NULL, 4, 'STOCK', 'DIAMONDBACK ENERGY INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14523, 'PZZA', '698813102', NULL, 4, 'STOCK', 'PAPA JOHNS INTERNATIONAL INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14566, 'NATH', '632347100', NULL, 4, 'STOCK', 'NATHANS FAMOUS INC NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14587, 'CINGF', 'G22564101', NULL, 4, 'STOCK', 'COINSILIUM GROUP LTD
      ORDINARY SHS
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14629, 'BFI', '12122L101', NULL, 4, 'STOCK', 'BURGERFI INTERNATIONAL INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14651, 'OKTA', '679295105', NULL, 4, 'STOCK', 'OKTA INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14674, 'CARA', '140755109', NULL, 4, 'STOCK', 'CARA THERAPEUTICS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14702, 'GHACU', '364681205', NULL, 4, 'STOCK', 'UTS GAMING & HOSPITALITY
      ACQUISITION CORP UNIT
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14706, 'MTEX', '563771203', NULL, 4, 'STOCK', 'MANNATECH INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14711, 'FSR', '33813J106', NULL, 2, 'STOCK', 'FISKER INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14712, 'HES', '42809H107', NULL, 2, 'STOCK', 'HESS CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14719, 'MPC', '56585A102', NULL, 2, 'STOCK', 'MARATHON PETE CORP
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14729, 'LYV', '538034109', NULL, 2, 'STOCK', 'LIVE NATION ENTERTAINMENT INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14739, 'DOW', '260557103', NULL, 2, 'STOCK', 'DOW INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14740, 'AIO', '92838Y100', NULL, 2, 'ETF', 'VIRTUS ALLIANZGI ARTIFICIAL
      INTELLIGENCE & TECH OPP FD COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14759, 'SOL', '75971T301', NULL, 2, 'STOCK', 'RENESOLA LTD
      AMERICAN DEPOSITARY ON EACH
      REPRESENTING TEN SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14762, 'NYT', '650111107', NULL, 2, 'STOCK', 'NEW YORK TIMES CO-CL A

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14773, 'FIGS', '30260D103', NULL, 2, 'STOCK', 'FIGS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14782, 'MATX', '57686G105', NULL, 2, 'STOCK', 'MATSON INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14796, 'MS', '617446448', NULL, 2, 'STOCK', 'MORGAN STANLEY

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14797, 'RS', '759509102', NULL, 2, 'STOCK', 'RELIANCE STEEL & ALUMINUM CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14807, 'ETWO', '29788T103', NULL, 2, 'STOCK', 'E2OPEN PARENT HOLDINGS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14830, 'DFS', '254709108', NULL, 2, 'STOCK', 'DISCOVER FINANCIAL SERVICES

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14834, 'H', '448579102', NULL, 2, 'STOCK', 'HYATT HOTELS CORP
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14835, 'IT', '366651107', NULL, 2, 'STOCK', 'GARTNER INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14836, 'BRO', '115236101', NULL, 2, 'STOCK', 'BROWN & BROWN INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14845, 'NUS', '67018T105', NULL, 2, 'STOCK', 'NU SKIN ENTERPRISES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14859, 'JNPR', '48203R104', NULL, 2, 'STOCK', 'JUNIPER NETWORKS

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14863, 'J', '469814107', NULL, 2, 'STOCK', 'JACOBS ENGINEERING GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14878, 'JCI', 'G51502105', NULL, 2, 'STOCK', 'JOHNSON CONTROLS
      INTERNATIONAL PLC ORDINARY
      SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14883, 'TSN', '902494103', NULL, 2, 'STOCK', 'TYSON FOODS INC-CL A

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14900, 'MCO', '615369105', NULL, 2, 'STOCK', 'MOODYS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14907, 'SF', '860630102', NULL, 2, 'STOCK', 'STIFEL FINANCIAL CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14910, 'BHP', '088606108', NULL, 2, 'STOCK', 'BHP GROUP LIMITED
      AMERICAN DEPOSITARY SHARES ON
      ECH RPSNTNG TWO ORD SHS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14921, 'NUE', '670346105', NULL, 2, 'STOCK', 'NUCOR CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14925, 'VFC', '918204108', NULL, 2, 'STOCK', 'VF CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14927, 'COG', '127097103', NULL, 2, 'STOCK', 'CABOT OIL AND GAS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14929, 'AA', '013872106', NULL, 2, 'STOCK', 'ALCOA CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14937, 'ESS', '297178105', NULL, 2, 'STOCK', 'ESSEX PROPERTY TRUST INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14946, 'ABBV', '00287Y109', NULL, 2, 'STOCK', 'ABBVIE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14963, 'SWM', '808541106', NULL, 2, 'STOCK', 'SCHWEITZER MAUDUIT
      INTERNATIONAL INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14968, 'SLB', '806857108', NULL, 2, 'STOCK', 'SCHLUMBERGER LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (14987, 'HLF', 'G4412G101', NULL, 2, 'STOCK', 'HERBALIFE NUTRITION LTD
      COMMON SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15002, 'F', '345370860', NULL, 2, 'STOCK', 'FORD MOTOR CO
      PAR $0.01
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15019, 'SMG', '810186106', NULL, 2, 'STOCK', 'SCOTTS MIRACLE GRO CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15023, 'BMY', '110122108', NULL, 2, 'STOCK', 'BRISTOL MYERS SQUIBB CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15031, 'NSC', '655844108', NULL, 2, 'STOCK', 'NORFOLK SOUTHERN CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15044, 'VTR', '92276F100', NULL, 2, 'STOCK', 'VENTAS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15059, 'AGS', '72814N104', NULL, 2, 'STOCK', 'PLAYAGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15060, 'PSB', '69360J107', NULL, 2, 'STOCK', 'PS BUSINESS PARKS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15082, 'AVLR', '05338G106', NULL, 2, 'STOCK', 'AVALARA INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15108, 'ATH', 'G0684D107', NULL, 2, 'STOCK', 'ATHENE HOLDING LTD
      CLASS A COMMON SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15139, 'CMP', '20451N101', NULL, 2, 'STOCK', 'COMPASS MINERALS INTL INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15150, 'VMW', '928563402', NULL, 2, 'STOCK', 'VMWARE INC CL A

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15159, 'CNHI', 'N20944109', NULL, 2, 'STOCK', 'CNH INDUSTRIAL NV

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15162, 'K', '487836108', NULL, 2, 'STOCK', 'KELLOGG CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15167, 'AIG', '026874784', NULL, 2, 'STOCK', 'AMERICAN INTERNATIONAL GROUP
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15168, 'MSC', '86389T106', NULL, 2, 'STOCK', 'STUDIO CITY INTERNATIONAL
      HOLDINGS LIMITED AMERICAN DEP
      SHS EACH RPSTNG FOUR CL A ORD');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15170, 'SHOP', '82509L107', NULL, 2, 'STOCK', 'SHOPIFY INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15180, 'NKE', '654106103', NULL, 2, 'STOCK', 'NIKE INC
      CLASS B COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15186, 'ELAN', '28414H103', NULL, 2, 'STOCK', 'ELANCO ANIMAL HEALTH
      INCORPORATED COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15187, 'HEXO', '428304307', NULL, 2, 'STOCK', 'HEXO CORP
      COM NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15205, 'A', '00846U101', NULL, 2, 'STOCK', 'AGILENT TECHNOLOGIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15208, 'PXD', '723787107', NULL, 2, 'STOCK', 'PIONEER NATURAL RESOURCES
      COMPANY COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15221, 'RNR', 'G7496G103', NULL, 2, 'STOCK', 'RENAISSANCERE HOLDINGS LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15229, 'LXP', '529043101', NULL, 2, 'STOCK', 'LEXINGTON REALTY TRUST

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15270, 'X', '912909108', NULL, 2, 'STOCK', 'UNITED STATES STL CORP NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15276, 'BABA', '01609W102', NULL, 2, 'STOCK', 'ALIBABA GROUP HOLDING LTD
      SPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15289, 'SWK', '854502101', NULL, 2, 'STOCK', 'STANLEY BLACK & DECKER INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15293, 'WOR', '981811102', NULL, 2, 'STOCK', 'WORTHINGTON INDUSTRIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15313, 'ORCL', '68389X105', NULL, 2, 'STOCK', 'ORACLE CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15319, 'TWLO', '90138F102', NULL, 2, 'STOCK', 'TWILIO INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15435, 'CVX', '166764100', NULL, 2, 'STOCK', 'CHEVRON CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15439, 'FMC', '302491303', NULL, 2, 'STOCK', 'FMC CORP NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15460, 'MCY', '589400100', NULL, 2, 'STOCK', 'MERCURY GENERAL CORP NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15468, 'DKS', '253393102', NULL, 2, 'STOCK', 'DICKS SPORTING GOODS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15483, 'VZ', '92343V104', NULL, 2, 'STOCK', 'VERIZON COMMUNICATIONS

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15488, 'BOX', '10316T104', NULL, 2, 'STOCK', 'BOX INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15507, 'HUYA', '44852D108', NULL, 2, 'STOCK', 'HUYA INC
      AMERICAN DEPOSITARY SHARES
      ECH REPRSNTNG ONE CL A ORD SHS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15518, 'CMC', '201723103', NULL, 2, 'STOCK', 'COMMERCIAL METALS CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15525, 'INGR', '457187102', NULL, 2, 'STOCK', 'INGREDION INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15529, 'VLRS', '21240E105', NULL, 2, 'STOCK', 'CONTROLADORA VUELA COMPANIA
      DE AVIACION S A B DE C V
      SPONSORED ADR REPSTG 10 CPOS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15546, 'MRK', '58933Y105', NULL, 2, 'STOCK', 'MERCK & CO INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15548, 'CHGG', '163092109', NULL, 2, 'STOCK', 'CHEGG INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15555, 'SQM', '833635105', NULL, 2, 'STOCK', 'SOCIEDAD QUIMICA MINERA DE
      CHILE S A SPONSORED ADR REPSTG
      SER B');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15566, 'UNP', '907818108', NULL, 2, 'STOCK', 'UNION PACIFIC CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15586, 'NOVA', '86745K104', NULL, 2, 'STOCK', 'SUNNOVA ENERGY INTERNATIONAL
      INC COMMON STOCK $0.01 PAR
      VALUE PER SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15597, 'BLX', 'P16994132', NULL, 2, 'STOCK', 'BANCO LATINOAMERICANO DE
      COMERCIO EXTERIOR S.A CL E
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15599, 'TPC', '901109108', NULL, 2, 'STOCK', 'TUTOR PERINI CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15608, 'L', '540424108', NULL, 2, 'STOCK', 'LOEWS CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15619, 'ZUO', '98983V106', NULL, 2, 'STOCK', 'ZUORA INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15620, 'BNED', '06777U101', NULL, 2, 'STOCK', 'BARNES & NOBLE EDUCATION INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15626, 'DY', '267475101', NULL, 2, 'STOCK', 'DYCOM INDUSTRIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15644, 'FDX', '31428X106', NULL, 2, 'STOCK', 'FEDEX CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15645, 'SSTK', '825690100', NULL, 2, 'STOCK', 'SHUTTERSTOCK INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15669, 'W', '94419L101', NULL, 2, 'STOCK', 'WAYFAIR INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15808, 'NEM', '651639106', NULL, 2, 'STOCK', 'NEWMONT CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15671, 'PEAK', '42250P103', NULL, 2, 'STOCK', 'HEALTHPEAK PROPERTIES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15675, 'PCOR', '74275K108', NULL, 2, 'STOCK', 'PROCORE TECHNOLOGIES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15683, 'EQR', '29476L107', NULL, 2, 'STOCK', 'EQUITY RESIDENTIAL

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15685, 'RE', 'G3223R108', NULL, 2, 'STOCK', 'EVEREST RE GROUP LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15696, 'PAYC', '70432V102', NULL, 2, 'STOCK', 'PAYCOM SOFTWARE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15707, 'EQT', '26884L109', NULL, 2, 'STOCK', 'EQT CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15711, 'DQ', '23703Q203', NULL, 2, 'STOCK', 'DAQO NEW ENERGY CORP
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15744, 'COE', '16954L105', NULL, 2, 'STOCK', 'CHINA ONLINE EDUCATION GRP
      SPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15765, 'DVD', '260174107', NULL, 2, 'STOCK', 'DOVER MOTORSPORTS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15774, 'MTZ', '576323109', NULL, 2, 'STOCK', 'MASTEC INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15779, 'NOW', '81762P102', NULL, 2, 'STOCK', 'SERVICENOW INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15782, 'GS', '38141G104', NULL, 2, 'STOCK', 'GOLDMAN SACHS GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15788, 'GHG', '39579V100', NULL, 2, 'STOCK', 'GREENTREE HOSPITALITY GROUP
      LTD AMERICAN DEPOSITARY SHARES
      EACH RPRSNTNG ONE CL A ORD SHS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15793, 'PG', '742718109', NULL, 2, 'STOCK', 'PROCTER & GAMBLE CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15795, 'PLTR', '69608A108', NULL, 2, 'STOCK', 'PALANTIR TECHNOLOGIES INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15798, 'S', '81730H109', NULL, 2, 'STOCK', 'SENTINELONE INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15803, 'VLO', '91913Y100', NULL, 2, 'STOCK', 'VALERO ENERGY CORP NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15816, 'FCX', '35671D857', NULL, 2, 'STOCK', 'FREEPORT MCMORAN INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15826, 'CTVA', '22052L104', NULL, 2, 'STOCK', 'CORTEVA INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15828, 'CUBE', '229663109', NULL, 2, 'STOCK', 'CUBESMART

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15833, 'ARE', '015271109', NULL, 2, 'STOCK', 'ALEXANDRIA REAL ESTATE
      EQUITIES INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15844, 'GME', '36467W109', NULL, 2, 'STOCK', 'GAMESTOP CORP
      CLASS A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15845, 'TDS', '879433829', NULL, 2, 'STOCK', 'TELEPHONE & DATA SYSTEM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15854, 'USNA', '90328M107', NULL, 2, 'STOCK', 'USANA HEALTH SCIENCES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15862, 'BBY', '086516101', NULL, 2, 'STOCK', 'BEST BUY COMPANY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15874, 'CHH', '169905106', NULL, 2, 'STOCK', 'CHOICE HOTELS INTERNATIONAL
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15886, 'EL', '518439104', NULL, 2, 'STOCK', 'ESTEE LAUDER COMPANIES INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15888, 'NET', '18915M107', NULL, 2, 'STOCK', 'CLOUDFLARE INC
      CLASS A COMMON STOCK PAR
      VALUE $0.001 PER SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15896, 'BE', '093712107', NULL, 2, 'STOCK', 'BLOOM ENERGY CORPORATION
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15898, 'GIS', '370334104', NULL, 2, 'STOCK', 'GENERAL MILLS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15907, 'IVAN', 'G4R87P114', NULL, 2, 'STOCK', 'IVANHOE CAP ACQUISITION
      CORP CLASS A ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15914, 'DIS', '254687106', NULL, 2, 'STOCK', 'WALT DISNEY CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15924, 'KKR', '48251W104', NULL, 2, 'STOCK', 'KKR & CO INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15932, 'PNC', '693475105', NULL, 2, 'STOCK', 'PNC FINANCIAL SVCS GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15946, 'GPS', '364760108', NULL, 2, 'STOCK', 'GAP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15973, 'OVV', '69047Q102', NULL, 2, 'STOCK', 'OVINTIV INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15974, 'SPGI', '78409V104', NULL, 2, 'STOCK', 'S&P GLOBAL INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15980, 'CL', '194162103', NULL, 2, 'STOCK', 'COLGATE PALMOLIVE COMPANY

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15990, 'DLX', '248019101', NULL, 2, 'STOCK', 'DELUXE CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (15996, 'IPOF', 'G8251L105', NULL, 2, 'STOCK', 'SOCIAL CAPITAL HEDOSOPHIA
      HOLDINGS CORP VI CLASS A
      ORDINARY SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16003, 'XPEV', '98422D105', NULL, 2, 'STOCK', 'XPENG INC
      ADS EACH REPRESENTING TWO
      CLASS A ORDINARY SHARES');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16005, 'TGNA', '87901J105', NULL, 2, 'STOCK', 'TEGNA INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16010, 'HSY', '427866108', NULL, 2, 'STOCK', 'HERSHEY COMPANY (THE)

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16027, 'MRO', '565849106', NULL, 2, 'STOCK', 'MARATHON OIL CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16037, 'KR', '501044101', NULL, 2, 'STOCK', 'KROGER CO (THE)

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16044, 'DVN', '25179M103', NULL, 2, 'STOCK', 'DEVON ENERGY CORPORATION NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16045, 'SA', '811916105', NULL, 2, 'STOCK', 'SEABRIDGE GOLD INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16057, 'IBM', '459200101', NULL, 2, 'STOCK', 'INTERNATIONAL BUSINESS
      MACHINES CORP
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16064, 'PLD', '74340W103', NULL, 2, 'STOCK', 'PROLOGIS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16070, 'CHWY', '16679L109', NULL, 2, 'STOCK', 'CHEWY INC
      CLASS A COMMON STOCK PAR VALUE
      $0.01 PER SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16071, 'DHI', '23331A109', NULL, 2, 'STOCK', 'D R HORTON INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16073, 'RLI', '749607107', NULL, 2, 'STOCK', 'RLI CORP
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16075, 'NRG', '629377508', NULL, 2, 'STOCK', 'NRG ENERGY INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16098, 'ELAT', '28414H202', NULL, 2, 'STOCK', 'UTS ELANCO ANIMAL HEALTH
      INCORPORATED 5.00% TANGIBLE
      EQUITY UNITS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16101, 'HLT', '43300A203', NULL, 2, 'STOCK', 'HILTON WORLDWIDE HOLDINGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16102, 'LUMN', '550241103', NULL, 2, 'STOCK', 'LUMEN TECHNOLOGIES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16104, 'KMB', '494368103', NULL, 2, 'STOCK', 'KIMBERLY CLARK CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16108, 'YUM', '988498101', NULL, 2, 'STOCK', 'YUM BRANDS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16110, 'CCL', '143658300', NULL, 2, 'STOCK', 'CARNIVAL CORP
      COMMON PAIRED STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16116, 'MNR', '609720107', NULL, 2, 'STOCK', 'MONMOUTH REAL ESTATE INVT CORP
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16126, 'LTC', '502175102', NULL, 2, 'STOCK', 'LTC PROPERTIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16135, 'SHO', '867892101', NULL, 2, 'STOCK', 'SUNSTONE HOTEL INVS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16137, 'KMI', '49456B101', NULL, 2, 'STOCK', 'KINDER MORGAN INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16152, 'TTC', '891092108', NULL, 2, 'STOCK', 'TORO CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16153, 'GSAH', '36258Q105', NULL, 2, 'STOCK', 'GS ACQUISITION HOLDINGS CORP
      II CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16154, 'AZUL', '05501U106', NULL, 2, 'STOCK', 'AZUL S A
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16158, 'PM', '718172109', NULL, 2, 'STOCK', 'PHILIP MORRIS INTERNATIONAL
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16160, 'BKR', '05722G100', NULL, 2, 'STOCK', 'BAKER HUGHES COMPANY

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16163, 'WELL', '95040Q104', NULL, 2, 'STOCK', 'WELLTOWER INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16173, 'APTV', 'G6095L109', NULL, 2, 'STOCK', 'APTIV PLC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16176, 'ORA', '686688102', NULL, 2, 'STOCK', 'ORMAT TECHNOLOGIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16177, 'CRL', '159864107', NULL, 2, 'STOCK', 'CHARLES RIVER LABORATORIES
      INTERNATIONAL INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16185, 'WMB', '969457100', NULL, 2, 'STOCK', 'WILLIAMS COMPANIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16211, 'BAC', '060505104', NULL, 2, 'STOCK', 'BANK OF AMERICA CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16224, 'BALY', '05875B106', NULL, 2, 'STOCK', 'BALLY S CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16234, 'IPG', '460690100', NULL, 2, 'STOCK', 'INTERPUBLIC GROUP OF COS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16253, 'NHI', '63633D104', NULL, 2, 'STOCK', 'NATIONAL HEALTH INVESTORS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16256, 'AZRE', 'V0393H103', NULL, 2, 'STOCK', 'AZURE POWER GLOBAL LIMITED
      EQUITY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16269, 'QUAD', '747301109', NULL, 2, 'STOCK', 'QUAD/GRAPHICS INC
      COM CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16270, 'PRGO', 'G97822103', NULL, 2, 'STOCK', 'PERRIGO COMPANY PLC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16277, 'STT', '857477103', NULL, 2, 'STOCK', 'STATE STREET CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16279, 'CVEO', '17878Y207', NULL, 2, 'STOCK', 'CIVEO CORP CDA
      COM NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16284, 'WSM', '969904101', NULL, 2, 'STOCK', 'WILLIAMS SONOMA INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16289, 'ABT', '002824100', NULL, 2, 'STOCK', 'ABBOTT LABORATORIES

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16298, 'BWA', '099724106', NULL, 2, 'STOCK', 'BORG WARNER AUTOMOTIVE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16325, 'OXY', '674599105', NULL, 2, 'STOCK', 'OCCIDENTAL PETE CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16326, 'BTI', '110448107', NULL, 2, 'STOCK', 'BRITISH AMERICAN TOBACCO
      PLC SPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16334, 'CRM', '79466L302', NULL, 2, 'STOCK', 'SALESFORCE.COM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16337, 'DE', '244199105', NULL, 2, 'STOCK', 'DEERE & CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16341, 'PAY', '70439P108', NULL, 2, 'STOCK', 'PAYMENTUS HOLDINGS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16347, 'CMG', '169656105', NULL, 2, 'STOCK', 'CHIPOTLE MEXICAN GRILL INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16348, 'AC', '045528106', NULL, 2, 'STOCK', 'ASSOCIATED CAPITAL GROUP INC
      CLASS A COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16349, 'MGM', '552953101', NULL, 2, 'STOCK', 'MGM RESORTS INTERNATIONAL

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16351, 'AMC', '00165C104', NULL, 2, 'STOCK', 'AMC ENTERTAINMENT HOLDINGS INC
      CL A COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16366, 'VGR', '92240M108', NULL, 2, 'STOCK', 'VECTOR GROUP LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16382, 'VEEV', '922475108', NULL, 2, 'STOCK', 'VEEVA SYSTEMS INC
      CL A COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16387, 'MDP', '589433101', NULL, 2, 'STOCK', 'MEREDITH CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16402, 'CTLT', '148806102', NULL, 2, 'STOCK', 'CATALENT INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16406, 'PK', '700517105', NULL, 2, 'STOCK', 'PARK HOTELS & RESORTS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16410, 'HIG', '416515104', NULL, 2, 'STOCK', 'HARTFORD FINANCIAL SERVICES
      GROUP INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16416, 'ICL', 'M53213100', NULL, 2, 'STOCK', 'ICL GROUP LTD
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16422, 'ACM', '00766T100', NULL, 2, 'STOCK', 'AECOM

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16427, 'LNC', '534187109', NULL, 2, 'STOCK', 'LINCOLN NATIONAL CORP-IND

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16441, 'RKT', '77311W101', NULL, 2, 'STOCK', 'ROCKET COMPANIES INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16446, 'AGCO', '001084102', NULL, 2, 'STOCK', 'AGCO CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16453, 'DT', '268150109', NULL, 2, 'STOCK', 'DYNATRACE INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16474, 'DUK', '26441C204', NULL, 2, 'STOCK', 'DUKE ENERGY CORPORATION
      HOLDING COMPANY
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16492, 'HCC', '93627C101', NULL, 2, 'STOCK', 'WARRIOR MET COAL INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16495, 'COP', '20825C104', NULL, 2, 'STOCK', 'CONOCOPHILLIPS
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16496, 'EDR', '29260Y109', NULL, 2, 'STOCK', 'ENDEAVOR GROUP HOLDINGS INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16497, 'HAL', '406216101', NULL, 2, 'STOCK', 'HALLIBURTON COMPANY

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16513, 'U', '91332U101', NULL, 2, 'STOCK', 'UNITY SOFTWARE INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16549, 'BB', '09228F103', NULL, 2, 'STOCK', 'BLACKBERRY LTD
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16552, 'WK', '98139A105', NULL, 2, 'STOCK', 'WORKIVA INC
      COM CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16555, 'IMAX', '45245E109', NULL, 2, 'STOCK', 'IMAX CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16563, 'NOV', '62955J103', NULL, 2, 'STOCK', 'NOV INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16565, 'CLR', '212015101', NULL, 2, 'STOCK', 'CONTINENTAL RESOURCES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16572, 'SIX', '83001A102', NULL, 2, 'STOCK', 'SIX FLAGS ENTERTAINMENT
      CORPORATION NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16576, 'DRE', '264411505', NULL, 2, 'STOCK', 'DUKE REALTY CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16577, 'C', '172967424', NULL, 2, 'STOCK', 'CITIGROUP INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16581, 'XEC', '171798101', NULL, 2, 'STOCK', 'CIMAREX ENERGY CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16583, 'HPE', '42824C109', NULL, 2, 'STOCK', 'HEWLETT PACKARD ENTERPRISE
      COMPANY COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16594, 'ACC', '024835100', NULL, 2, 'STOCK', 'AMERICAN CAMPUS COMMUNITIES
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16597, 'CLF', '185899101', NULL, 2, 'STOCK', 'CLEVELAND CLIFFS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16606, 'BYD', '103304101', NULL, 2, 'STOCK', 'BOYD GAMING CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16617, 'KBR', '48242W106', NULL, 2, 'STOCK', 'KBR INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16618, 'SCHW', '808513105', NULL, 2, 'STOCK', 'CHARLES SCHWAB CORP NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16645, 'AMP', '03076C106', NULL, 2, 'STOCK', 'AMERIPRISE FINL INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16660, 'HASI', '41068X100', NULL, 2, 'STOCK', 'HANNON ARMSTRONG SUSTAINABLE
      INFRASTRUCTURE CAP INC COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16697, 'LSI', '53223X107', NULL, 2, 'STOCK', 'LIFE STORAGE INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16701, 'SEAS', '81282V100', NULL, 2, 'STOCK', 'SEAWORLD ENTERTAINMENT INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16720, 'STN', '85472N109', NULL, 2, 'STOCK', 'STANTEC INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16727, 'KSU', '485170302', NULL, 2, 'STOCK', 'KANSAS CITY SOUTHERN

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16733, 'SPG', '828806109', NULL, 2, 'STOCK', 'SIMON PROPERTY GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16739, 'AGL', '00857U107', NULL, 2, 'STOCK', 'AGILON HEALTH INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16746, 'WRB', '084423102', NULL, 2, 'STOCK', 'BERKLEY W R CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16754, 'OMC', '681919106', NULL, 2, 'STOCK', 'OMNICOM GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16779, 'AIZ', '04621X108', NULL, 2, 'STOCK', 'ASSURANT INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16794, 'PBH', '74112D101', NULL, 2, 'STOCK', 'PRESTIGE CONSUMER HEALTHCARE
      INC COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16800, 'MKL', '570535104', NULL, 2, 'STOCK', 'MARKEL CORP HOLDING CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16801, 'Y', '017175100', NULL, 2, 'STOCK', 'ALLEGHANY CORP-DEL

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16805, 'MED', '58470H101', NULL, 2, 'STOCK', 'MEDIFAST INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16818, 'WFC', '949746101', NULL, 2, 'STOCK', 'WELLS FARGO & CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16826, 'SNOW', '833445109', NULL, 2, 'STOCK', 'SNOWFLAKE INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16832, 'KMPR', '488401100', NULL, 2, 'STOCK', 'KEMPER CORP DEL

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16836, 'CIEN', '171779309', NULL, 2, 'STOCK', 'CIENA CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16840, 'IHG', '45857P806', NULL, 2, 'STOCK', 'INTERCONTINENTAL HOTELS
      GROUP PLC AMERICAN DEPOSITARY
      SHARE ECH RPRSNTNG ONE ORD SH');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16846, 'PLNT', '72703H101', NULL, 2, 'STOCK', 'PLANET FITNESS INC
      CLASS A COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16855, 'CLX', '189054109', NULL, 2, 'STOCK', 'CLOROX CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16864, 'JPM', '46625H100', NULL, 2, 'STOCK', 'JPMORGAN CHASE & CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16870, 'KO', '191216100', NULL, 2, 'STOCK', 'COCA COLA COMPANY
      (THE)
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16898, 'RELX', '759530108', NULL, 2, 'STOCK', 'RELX PLC
      AMERICAN DEPOSITARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16900, 'IGT', 'G4863A108', NULL, 2, 'STOCK', 'INTERNATIONAL GAME
      TECHNOLOGY PLC USD0.1
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16902, 'ARNC', '03966V107', NULL, 2, 'STOCK', 'ARCONIC CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16905, 'LAC', '53680Q207', NULL, 2, 'STOCK', 'LITHIUM AMERICAS CORP
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16907, 'STG', '86740P108', NULL, 2, 'STOCK', 'SUNLANDS TECHNOLOGY GROUP
      AMERICAN DEPOSITARY SHS ECH 25
      ADS REPRESENT ONE CL A ORD SHS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16911, 'LOW', '548661107', NULL, 2, 'STOCK', 'LOWES COMPANIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16924, 'DAR', '237266101', NULL, 2, 'STOCK', 'DARLING INGREDIENTS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16928, 'UDR', '902653104', NULL, 2, 'STOCK', 'UDR INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16929, 'ZTS', '98978V103', NULL, 2, 'STOCK', 'ZOETIS INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16937, 'PAC', '400506101', NULL, 2, 'STOCK', 'GRUPO AEROPORTUARIO DEL
      PACIFICO S A B DE CV SPONSORED
      ADR REPSTG 10 SER B SHS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16943, 'TRGP', '87612G101', NULL, 2, 'STOCK', 'TARGA RESOURCES CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16978, 'TWTR', '90184L102', NULL, 2, 'STOCK', 'TWITTER INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (16999, 'R', '783549108', NULL, 2, 'STOCK', 'RYDER SYSTEM INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17000, 'PFE', '717081103', NULL, 2, 'STOCK', 'PFIZER INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17002, 'ADM', '039483102', NULL, 2, 'STOCK', 'ARCHER-DANIELS-MIDLAND CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17009, 'EXR', '30225T102', NULL, 2, 'STOCK', 'EXTRA SPACE STORAGE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17016, 'STZ', '21036P108', NULL, 2, 'STOCK', 'CONSTELLATION BRANDS INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17017, 'TPB', '90041L105', NULL, 2, 'STOCK', 'TURNING POINT BRANDS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17026, 'ANET', '040413106', NULL, 2, 'STOCK', 'ARISTA NETWORKS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17034, 'PSTH', '71531R109', NULL, 2, 'STOCK', 'PERSHING SQUARE TONTINE
      HOLDINGS LTD CLASS A COMMON
      STOCK');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17036, 'UA', '904311206', NULL, 2, 'STOCK', 'UNDER ARMOUR INC
      CLASS C COMMON STOCK $0.0003
      1/3 PAR VALUE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17039, 'JNJ', '478160104', NULL, 2, 'STOCK', 'JOHNSON & JOHNSON

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17041, 'MCD', '580135101', NULL, 2, 'STOCK', 'MCDONALDS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17044, 'UBER', '90353T100', NULL, 2, 'STOCK', 'UBER TECHNOLOGIES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17045, 'O', '756109104', NULL, 2, 'STOCK', 'REALTY INCOME CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17053, 'KEX', '497266106', NULL, 2, 'STOCK', 'KIRBY CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17054, 'JKS', '47759T100', NULL, 2, 'STOCK', 'JINKOSOLAR HLDG CO LTD
      SPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17055, 'MP', '553368101', NULL, 2, 'STOCK', 'MP MATERIALS CORP
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17110, 'DG', '256677105', NULL, 2, 'STOCK', 'DOLLAR GENERAL CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17119, 'CIM', '16934Q208', NULL, 2, 'STOCK', 'CHIMERA INVESTMENT CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17122, 'MAA', '59522J103', NULL, 2, 'STOCK', 'MID AMERICA APARTMENT
      COMMUNITIES INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17151, 'BK', '064058100', NULL, 2, 'STOCK', 'BANK NEW YORK MELLON CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17160, 'LUV', '844741108', NULL, 2, 'STOCK', 'SOUTHWEST AIRLINES CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17162, 'NTR', '67077M108', NULL, 2, 'STOCK', 'NUTRIEN LTD
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17163, 'WWE', '98156Q108', NULL, 2, 'STOCK', 'WORLD WRESTLING ENTERTAINMENT
      INC CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17185, 'ESGC', 'G3788M114', NULL, 2, 'STOCK', 'EROS STX GLOBAL CORPORATION
      A ORDINARY SHARES GBP 0.30 PAR
      VALUE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17186, 'VICI', '925652109', NULL, 2, 'STOCK', 'VICI PROPERTIES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17188, 'ICE', '45866F104', NULL, 2, 'STOCK', 'INTERCONTINENTAL EXCHANGE
      INC
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17196, 'ATI', '01741R102', NULL, 2, 'STOCK', 'ALLEGHENY TECHNOLOGIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17203, 'AJG', '363576109', NULL, 2, 'STOCK', 'GALLAGHER ARTHUR J & CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17207, 'FLR', '343412102', NULL, 2, 'STOCK', 'FLUOR CORP NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17214, 'AMG', '008252108', NULL, 2, 'STOCK', 'AFFILIATED MANAGERS GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17218, 'LTHM', '53814L108', NULL, 2, 'STOCK', 'LIVENT CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17220, 'AGTI', '00848J104', NULL, 2, 'STOCK', 'AGILITI INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17222, 'FL', '344849104', NULL, 2, 'STOCK', 'FOOT LOCKER INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17373, 'AXS', 'G0692U109', NULL, 2, 'STOCK', 'AXIS CAPITAL HOLDINGS LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17236, 'KIM', '49446R109', NULL, 2, 'STOCK', 'KIMCO REALTY CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17238, 'SMAR', '83200N103', NULL, 2, 'STOCK', 'SMARTSHEET INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17240, 'THG', '410867105', NULL, 2, 'STOCK', 'HANOVER INSURANCE GROUP INC
      (THE)
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17244, 'ACIC', '049284102', NULL, 2, 'STOCK', 'ATLAS CREST INVESTMENT CORP
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17258, 'EME', '29084Q100', NULL, 2, 'STOCK', 'EMCOR GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17270, 'HGV', '43283X105', NULL, 2, 'STOCK', 'HILTON GRAND VACATIONS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17285, 'SE', '81141R100', NULL, 2, 'STOCK', 'SEA LIMITED
      AMERICAN DEPOSITARY SHS EACH
      RPRSNTNG ONE CL A ORD SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17298, 'PSA', '74460D109', NULL, 2, 'STOCK', 'PUBLIC STORAGE

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17299, 'IQV', '46266C105', NULL, 2, 'STOCK', 'IQVIA HOLDINGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17374, 'CB', 'H1467J104', NULL, 2, 'STOCK', 'CHUBB LTD
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17306, 'FRC', '33616C100', NULL, 2, 'STOCK', 'FIRST REPUBLIC BANK SAN
      FRANCISCO CALIF
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17316, 'EOG', '26875P101', NULL, 2, 'STOCK', 'EOG RES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17317, 'LVS', '517834107', NULL, 2, 'STOCK', 'LAS VEGAS SANDS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17323, 'QTWO', '74736L109', NULL, 2, 'STOCK', 'Q2 HOLDINGS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17324, 'UVV', '913456109', NULL, 2, 'STOCK', 'UNIVERSAL CORP-VA

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17326, 'FSK', '302635206', NULL, 2, 'STOCK', 'FS KKR CAPITAL CORP
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17357, 'DV', '25862V105', NULL, 2, 'STOCK', 'DOUBLEVERIFY HOLDINGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17358, 'STEM', '85859N102', NULL, 2, 'STOCK', 'STEM INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17361, 'SAVE', '848577102', NULL, 2, 'STOCK', 'SPIRIT AIRLINES INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17371, 'MO', '02209S103', NULL, 2, 'STOCK', 'ALTRIA GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17372, 'ZME', '98955H101', NULL, 2, 'STOCK', 'ZHANGMEN EDUCATION INC
      AMERICAN DEPOSITARY SHRS ECH
      RPRSNTNG NINE CL A ORD SHRS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17375, 'TJX', '872540109', NULL, 2, 'STOCK', 'TJX COMPANIES INC NEW

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17382, 'CF', '125269100', NULL, 2, 'STOCK', 'CF INDUSTRIES HOLDINGS INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17383, 'MOS', '61945C103', NULL, 2, 'STOCK', 'MOSAIC COMPANY

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17384, 'AVB', '053484101', NULL, 2, 'STOCK', 'AVALONBAY COMMUNITIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17390, 'CVNA', '146869102', NULL, 2, 'STOCK', 'CARVANA CO
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17409, 'ANTM', '036752103', NULL, 2, 'STOCK', 'ANTHEM INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17441, 'LLY', '532457108', NULL, 2, 'STOCK', 'ELI LILLY & CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17453, 'UPS', '911312106', NULL, 2, 'STOCK', 'UNITED PARCEL SVC INC
      CL B
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17457, 'LEN', '526057104', NULL, 2, 'STOCK', 'LENNAR CORP
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17462, 'BILL', '090043100', NULL, 2, 'STOCK', 'BILL.COM HOLDINGS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17463, 'WMT', '931142103', NULL, 2, 'STOCK', 'WALMART INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17471, 'AMH', '02665T306', NULL, 2, 'STOCK', 'AMERICAN HOMES 4 RENT
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17473, 'RRD', '257867200', NULL, 2, 'STOCK', 'DONNELLEY R R & SONS CO
      COM NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17476, 'GM', '37045V100', NULL, 2, 'STOCK', 'GENERAL MOTORS COMPANY

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17483, 'EDU', '647581107', NULL, 2, 'STOCK', 'NEW ORIENTAL EDUCATION AND
      TECHNOLOGY GROUP INC
      SPONSORED ADR');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17496, 'CRS', '144285103', NULL, 2, 'STOCK', 'CARPENTER TECHNOLOGY CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17509, 'WH', '98311A105', NULL, 2, 'STOCK', 'WYNDHAM HOTELS & RESORTS INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17518, 'GD', '369550108', NULL, 2, 'STOCK', 'GENERAL DYNAMICS CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17519, 'TRV', '89417E109', NULL, 2, 'STOCK', 'THE TRAVELERS COMPANIES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17525, 'T', '00206R102', NULL, 2, 'STOCK', 'AT&T INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17528, 'PGR', '743315103', NULL, 2, 'STOCK', 'PROGRESSIVE CORP-OHIO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17542, 'USB', '902973304', NULL, 2, 'STOCK', 'US BANCORP DEL
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17544, 'XOM', '30231G102', NULL, 2, 'STOCK', 'EXXON MOBIL CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17552, 'HD', '437076102', NULL, 2, 'STOCK', 'HOME DEPOT INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17556, 'PWR', '74762E102', NULL, 2, 'STOCK', 'QUANTA SERVICES INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17583, 'BLK', '09247X101', NULL, 2, 'STOCK', 'BLACKROCK INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17588, 'AFG', '025932104', NULL, 2, 'STOCK', 'AMERICAN FINANCIAL GROUP INC
      (HOLDING CO)
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17600, 'NIO', '62914V106', NULL, 2, 'STOCK', 'NIO INC
      AMERICAN DEPOSITARY SHARES ECH
      RPRSNTNG ONE CL A ORD SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17615, 'PRU', '744320102', NULL, 2, 'STOCK', 'PRUDENTIAL FINANCIAL INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17622, 'LRN', '86333M108', NULL, 2, 'STOCK', 'STRIDE INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17627, 'FSLY', '31188V100', NULL, 2, 'STOCK', 'FASTLY INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17636, 'OGN', '68622V106', NULL, 2, 'STOCK', 'ORGANON & CO
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17655, 'TGT', '87612E106', NULL, 2, 'STOCK', 'TARGET CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17666, 'SI', '82837P408', NULL, 2, 'STOCK', 'SILVERGATE CAPITAL CORPORATION
      CLASS A COMMON STOCK $0.01 PAR
      VALUE PER SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17677, 'ALL', '020002101', NULL, 2, 'STOCK', 'ALLSTATE CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17678, 'ESTC', 'N14506104', NULL, 2, 'STOCK', 'ELASTIC N V
      ORDINARY SHARES
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17679, 'BG', 'G16962105', NULL, 2, 'STOCK', 'BUNGE LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17685, 'ADS', '018581108', NULL, 2, 'STOCK', 'ALLIANCE DATA SYSTEM CORP

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17704, 'GOL', '38045R206', NULL, 2, 'STOCK', 'GOL LINHAS AEREAS
      INTELIGENTES SA ADS EACH
      REPRESENTING 2 PREFERRED SHS');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17736, 'DTE', '233331107', NULL, 2, 'STOCK', 'DTE ENERGY CO

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17762, 'RNG', '76680R206', NULL, 2, 'STOCK', 'RINGCENTRAL INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17771, 'AMRC', '02361E108', NULL, 2, 'STOCK', 'AMERESCO INC
      CL A
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17790, 'SM', '78454L100', NULL, 2, 'STOCK', 'SM ENERGY COMPANY

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17801, 'AZO', '053332102', NULL, 2, 'STOCK', 'AUTOZONE INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17804, 'ALK', '011659109', NULL, 2, 'STOCK', 'ALASKA AIR GROUP INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17805, 'DLR', '253868103', NULL, 2, 'STOCK', 'DIGITAL REALTY TRUST INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17816, 'MSCI', '55354G100', NULL, 2, 'STOCK', 'MSCI INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17817, 'RSI', '782011100', NULL, 2, 'STOCK', 'RUSH STREET INTERACTIVE INC
      CLASS A COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17828, 'DAL', '247361702', NULL, 2, 'STOCK', 'DELTA AIR LINES INC DEL
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17834, 'AFL', '001055102', NULL, 2, 'STOCK', 'AFLAC INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17838, 'HFC', '436106108', NULL, 2, 'STOCK', 'HOLLYFRONTIER CORPORATION

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17843, 'TRI', '884903709', NULL, 2, 'STOCK', 'THOMSON REUTERS CORP
      COM NEW
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17856, 'COUR', '22266M104', NULL, 2, 'STOCK', 'COURSERA INC
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17863, 'QD', '747798106', NULL, 2, 'STOCK', 'QUDIAN INC
      AMERICAN DEPOSITARY SHS EACH
      RPRSNTNG ONE CL A ORD SHARE');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17881, 'PSX', '718546104', NULL, 2, 'STOCK', 'PHILLIPS 66
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17884, 'RIO', '767204100', NULL, 2, 'STOCK', 'RIO TINTO PLC
      SPONSORED ADR
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17887, 'GTN', '389375106', NULL, 2, 'STOCK', 'GRAY TELEVISION INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17889, 'XHR', '984017103', NULL, 2, 'STOCK', 'XENIA HOTELS & RESORTS INC
      COM
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17910, 'OKE', '682680103', NULL, 2, 'STOCK', 'ONEOK INC

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17915, 'GVA', '387328107', NULL, 2, 'STOCK', 'GRANITE CONSTRUCTION INC');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17932, 'TEL', 'H84989104', NULL, 2, 'STOCK', 'TE CONNECTIVITY LTD

      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17939, 'TFC', '89832Q109', NULL, 2, 'STOCK', 'TRUIST FINANCIAL CORPORATION
      COMMON STOCK
      ');
      INSERT INTO instruments.inst (id, symbol, cusip, sedol, exchange_id, type, description) OVERRIDING SYSTEM VALUE VALUES (17941, 'MET', '59156R108', NULL, 2, 'STOCK', 'METLIFE INC

      ');
      --== ETFs FOR COMMUNITY STACKS===---

      insert into instruments.inst(id, symbol, type, description, cusip,exchange_id) OVERRIDING SYSTEM VALUE
      values (1, 'QQQ','ETF','INVESCO QQQ TR
      UNIT SER 1','46090E103',4),
             (2, 'VTI','ETF','VANGUARD INDEX FUNDS
      VANGUARD TOTAL STOCK MARKET
      ETF','922908769',3),
             (3, 'VOO','ETF','VANGUARD S&P 500 ETF','922908363',3),
             (4, 'SPY','ETF','SPDR S&P 500 ETF TRUST','78462F103',3),
             (30001,'V','STOCK','VISA INC
      CL A COMMON STOCK','92826C839',2),
             (30002,'BRKA','STOCK','BERKSHIRE HATHAWAY INC-DEL
      CL A','084670108',2);


      insert into instruments.inst_feed(inst_id, feed)
        select id as inst_id, 'APEX' from instruments.inst;

      update instruments.inst set description= split_part(description,chr(10),1);

      create temporary table beta(symbol varchar, shortdescription varchar);

      INSERT INTO beta VALUES ('MCY', 'MERCURY GENERAL');
      INSERT INTO beta VALUES ('VMW', 'VMWARE INC CL A');
      INSERT INTO beta VALUES ('BLMN', 'BLOOMIN BRANDS');
      INSERT INTO beta VALUES ('HEXO', 'HEXO CORP');
      INSERT INTO beta VALUES ('KNDI', 'KANDI TECHNOLGI');
      INSERT INTO beta VALUES ('LOUP', 'INNOVATOR ETFS');
      INSERT INTO beta VALUES ('PM', 'PHILIP MORRIS I');
      INSERT INTO beta VALUES ('TTC', 'TORO CO');
      INSERT INTO beta VALUES ('MAR', 'MARRIOTT INTERN');
      INSERT INTO beta VALUES ('AAL', 'AMERICAN AIRLIN');
      INSERT INTO beta VALUES ('BKR', 'BAKER HUGHES CO');
      INSERT INTO beta VALUES ('SIGI', 'SELECTIVE INSUR');
      INSERT INTO beta VALUES ('RLI', 'RLI CORP');
      INSERT INTO beta VALUES ('EXR', 'EXTRA SPACE STO');
      INSERT INTO beta VALUES ('FAT', 'FAT BRANDS INC');
      INSERT INTO beta VALUES ('BABA', 'ALIBABA GROUP H');
      INSERT INTO beta VALUES ('AIQ', 'GLOBAL X FUNDS');
      INSERT INTO beta VALUES ('ROBT', 'FIRST TR EXCHAN');
      INSERT INTO beta VALUES ('HYFM', 'HYDROFARM HOLDI');
      INSERT INTO beta VALUES ('KEX', 'KIRBY CORP');
      INSERT INTO beta VALUES ('FSK', 'FS KKR CAPITAL');
      INSERT INTO beta VALUES ('DVN', 'DEVON ENERGY CO');
      INSERT INTO beta VALUES ('SHOP', 'SHOPIFY INC');
      INSERT INTO beta VALUES ('STKS', 'ONE GROUP HOSPI');
      INSERT INTO beta VALUES ('AZPN', 'ASPEN TECHNOLOG');
      INSERT INTO beta VALUES ('K', 'KELLOGG CO');
      INSERT INTO beta VALUES ('SMPL', 'SIMPLY GOOD FOO');
      INSERT INTO beta VALUES ('AGS', 'PLAYAGS INC');
      INSERT INTO beta VALUES ('SCR', 'SCORE MEDIA & G');
      INSERT INTO beta VALUES ('IMAX', 'IMAX CORP');
      INSERT INTO beta VALUES ('PSB', 'PS BUSINESS PAR');
      INSERT INTO beta VALUES ('NPCE', 'NEUROPACE INC');
      INSERT INTO beta VALUES ('UAL', 'UNITED AIRLINES');
      INSERT INTO beta VALUES ('MATX', 'MATSON INC');
      INSERT INTO beta VALUES ('BILL', 'BILL.COM HOLDIN');
      INSERT INTO beta VALUES ('A', 'AGILENT TECHNOL');
      INSERT INTO beta VALUES ('PSTH', 'PERSHING SQUARE');
      INSERT INTO beta VALUES ('DKS', 'DICKS SPORTING');
      INSERT INTO beta VALUES ('GAN', 'GAN LIMITED');
      INSERT INTO beta VALUES ('CORT', 'CORCEPT THERAPE');
      INSERT INTO beta VALUES ('TROW', 'PRICE T ROWE GR');
      INSERT INTO beta VALUES ('OGN', 'ORGANON & CO');
      INSERT INTO beta VALUES ('STZ', 'CONSTELLATION B');
      INSERT INTO beta VALUES ('CLF', 'CLEVELAND CLIFF');
      INSERT INTO beta VALUES ('BGFV', 'BIG 5 SPORTING');
      INSERT INTO beta VALUES ('TTD', 'TRADE DESK INC');
      INSERT INTO beta VALUES ('CF', 'CF INDUSTRIES H');
      INSERT INTO beta VALUES ('TJX', 'TJX COMPANIES I');
      INSERT INTO beta VALUES ('ORA', 'ORMAT TECHNOLOG');
      INSERT INTO beta VALUES ('CRL', 'CHARLES RIVER L');
      INSERT INTO beta VALUES ('EXPE', 'EXPEDIA GROUP I');
      INSERT INTO beta VALUES ('AJG', 'GALLAGHER ARTHU');
      INSERT INTO beta VALUES ('LI', 'LI AUTO INC');
      INSERT INTO beta VALUES ('ZNGA', 'ZYNGA INC');
      INSERT INTO beta VALUES ('ALL', 'ALLSTATE CORP');
      INSERT INTO beta VALUES ('AMC', 'AMC ENTERTAINME');
      INSERT INTO beta VALUES ('MOS', 'MOSAIC COMPANY');
      INSERT INTO beta VALUES ('TDS', 'TELEPHONE & DAT');
      INSERT INTO beta VALUES ('DRIV', 'GLOBAL X FDS');
      INSERT INTO beta VALUES ('RIO', 'RIO TINTO PLC');
      INSERT INTO beta VALUES ('HUYA', 'HUYA INC');
      INSERT INTO beta VALUES ('ZS', 'ZSCALER INC');
      INSERT INTO beta VALUES ('HIG', 'HARTFORD FINANC');
      INSERT INTO beta VALUES ('NXPI', 'NXP SEMICONDUCT');
      INSERT INTO beta VALUES ('AZO', 'AUTOZONE INC');
      INSERT INTO beta VALUES ('CSCW', 'COLOR STAR TECH');
      INSERT INTO beta VALUES ('ORBC', 'ORBCOMM INC');
      INSERT INTO beta VALUES ('GT', 'GOODYEAR TIRE &');
      INSERT INTO beta VALUES ('ESGC', 'EROS STX GLOBAL');
      INSERT INTO beta VALUES ('ODFL', 'OLD DOMINION FR');
      INSERT INTO beta VALUES ('JAZZ', 'JAZZ PHARMACEUT');
      INSERT INTO beta VALUES ('NOW', 'SERVICENOW INC');
      INSERT INTO beta VALUES ('LSI', 'LIFE STORAGE IN');
      INSERT INTO beta VALUES ('NYT', 'NEW YORK TIMES');
      INSERT INTO beta VALUES ('TSCO', 'TRACTOR SUPPLY');
      INSERT INTO beta VALUES ('U', 'UNITY SOFTWARE');
      INSERT INTO beta VALUES ('FITB', 'FIFTH THIRD BAN');
      INSERT INTO beta VALUES ('TMUS', 'T MOBILE US INC');
      INSERT INTO beta VALUES ('AGTI', 'AGILITI INC');
      INSERT INTO beta VALUES ('CRSR', 'CORSAIR GAMING');
      INSERT INTO beta VALUES ('SAFM', 'SANDERSON FARMS');
      INSERT INTO beta VALUES ('HFC', 'HOLLYFRONTIER C');
      INSERT INTO beta VALUES ('ETSY', 'ETSY INC');
      INSERT INTO beta VALUES ('TA', 'TRAVELCENTERS O');
      INSERT INTO beta VALUES ('KNBE', 'KNOWBE4 INC');
      INSERT INTO beta VALUES ('HAPP', 'HAPPINESS BIOTE');
      INSERT INTO beta VALUES ('QUAD', 'QUAD/GRAPHICS I');
      INSERT INTO beta VALUES ('GSAT', 'GLOBALSTAR INC');
      INSERT INTO beta VALUES ('KBR', 'KBR INC');
      INSERT INTO beta VALUES ('GLBE', 'GLOBAL E ONLINE');
      INSERT INTO beta VALUES ('TPIC', 'TPI COMPOSITES');
      INSERT INTO beta VALUES ('JCI', 'JOHNSON CONTROL');
      INSERT INTO beta VALUES ('MSFT', 'MICROSOFT CORP');
      INSERT INTO beta VALUES ('OXY', 'OCCIDENTAL PETE');
      INSERT INTO beta VALUES ('LOW', 'LOWES COMPANIES');
      INSERT INTO beta VALUES ('GVA', 'GRANITE CONSTRU');
      INSERT INTO beta VALUES ('SIVB', 'SVB FINANCIAL G');
      INSERT INTO beta VALUES ('POLA', 'POLAR POWER INC');
      INSERT INTO beta VALUES ('LVS', 'LAS VEGAS SANDS');
      INSERT INTO beta VALUES ('JACK', 'JACK IN THE BOX');
      INSERT INTO beta VALUES ('BG', 'BUNGE LTD');
      INSERT INTO beta VALUES ('CVEO', 'CIVEO CORP CDA');
      INSERT INTO beta VALUES ('ARVL', 'ARRIVAL');
      INSERT INTO beta VALUES ('STN', 'STANTEC INC');
      INSERT INTO beta VALUES ('R', 'RYDER SYSTEM IN');
      INSERT INTO beta VALUES ('BB', 'BLACKBERRY LTD');
      INSERT INTO beta VALUES ('PAC', 'GRUPO AEROPORTU');
      INSERT INTO beta VALUES ('ADM', 'ARCHER-DANIELS-');
      INSERT INTO beta VALUES ('UTME', 'UTIME LIMITED');
      INSERT INTO beta VALUES ('DUK', 'DUKE ENERGY COR');
      INSERT INTO beta VALUES ('TEAM', 'ATLASSIAN CORPO');
      INSERT INTO beta VALUES ('TECB', 'ISHARES TRUST');
      INSERT INTO beta VALUES ('REGI', 'RENEWABLE ENERG');
      INSERT INTO beta VALUES ('ARNC', 'ARCONIC CORPORA');
      INSERT INTO beta VALUES ('UVV', 'UNIVERSAL CORP-');
      INSERT INTO beta VALUES ('H', 'HYATT HOTELS CO');
      INSERT INTO beta VALUES ('BWA', 'BORG WARNER AUT');
      INSERT INTO beta VALUES ('TWOU', '2U INC');
      INSERT INTO beta VALUES ('UBOT', 'DIREXION SHARES');
      INSERT INTO beta VALUES ('HD', 'HOME DEPOT INC');
      INSERT INTO beta VALUES ('VEEV', 'VEEVA SYSTEMS I');
      INSERT INTO beta VALUES ('PG', 'PROCTER & GAMBL');
      INSERT INTO beta VALUES ('DV', 'DOUBLEVERIFY HO');
      INSERT INTO beta VALUES ('VZ', 'VERIZON COMMUNI');
      INSERT INTO beta VALUES ('PWR', 'QUANTA SERVICES');
      INSERT INTO beta VALUES ('REDU', 'RISE EDUCATION');
      INSERT INTO beta VALUES ('PRU', 'PRUDENTIAL FINA');
      INSERT INTO beta VALUES ('JCOM', 'J2 GLOBAL INC');
      INSERT INTO beta VALUES ('TXRH', 'TEXAS ROADHOUSE');
      INSERT INTO beta VALUES ('COP', 'CONOCOPHILLIPS');
      INSERT INTO beta VALUES ('KIM', 'KIMCO REALTY CO');
      INSERT INTO beta VALUES ('TXN', 'TEXAS INSTRUMEN');
      INSERT INTO beta VALUES ('HASI', 'HANNON ARMSTRON');
      INSERT INTO beta VALUES ('NATH', 'NATHANS FAMOUS');
      INSERT INTO beta VALUES ('DVD', 'DOVER MOTORSPOR');
      INSERT INTO beta VALUES ('STLD', 'STEEL DYNAMICS');
      INSERT INTO beta VALUES ('STEM', 'STEM INC');
      INSERT INTO beta VALUES ('JBLU', 'JETBLUE AIRWAYS');
      INSERT INTO beta VALUES ('TTWO', 'TAKE TWO INTERA');
      INSERT INTO beta VALUES ('APTV', 'APTIV PLC');
      INSERT INTO beta VALUES ('PBH', 'PRESTIGE CONSUM');
      INSERT INTO beta VALUES ('RE', 'EVEREST RE GROU');
      INSERT INTO beta VALUES ('SGMS', 'SCIENTIFIC GAME');
      INSERT INTO beta VALUES ('CSX', 'CSX CORPORATION');
      INSERT INTO beta VALUES ('NHTC', 'NATURAL HEALTH');
      INSERT INTO beta VALUES ('DENN', 'DENNYS CORPORAT');
      INSERT INTO beta VALUES ('CTVA', 'CORTEVA INC');
      INSERT INTO beta VALUES ('EL', 'ESTEE LAUDER CO');
      INSERT INTO beta VALUES ('CRBP', 'CORBUS PHARMACE');
      INSERT INTO beta VALUES ('MSC', 'STUDIO CITY INT');
      INSERT INTO beta VALUES ('SM', 'SM ENERGY COMPA');
      INSERT INTO beta VALUES ('COUP', 'COUPA SOFTWARE');
      INSERT INTO beta VALUES ('ADSK', 'AUTODESK INC');
      INSERT INTO beta VALUES ('ESS', 'ESSEX PROPERTY');
      INSERT INTO beta VALUES ('FSR', 'FISKER INC');
      INSERT INTO beta VALUES ('CAKE', 'CHEESECAKE FACT');
      INSERT INTO beta VALUES ('PTON', 'PELOTON INTERAC');
      INSERT INTO beta VALUES ('XHR', 'XENIA HOTELS &');
      INSERT INTO beta VALUES ('ESTC', 'ELASTIC N V');
      INSERT INTO beta VALUES ('PRVA', 'PRIVIA HEALTH G');
      INSERT INTO beta VALUES ('WH', 'WYNDHAM HOTELS');
      INSERT INTO beta VALUES ('ARVN', 'ARVINAS INC');
      INSERT INTO beta VALUES ('CLOV', 'CLOVER HEALTH I');
      INSERT INTO beta VALUES ('LSTR', 'LANDSTAR SYSTEM');
      INSERT INTO beta VALUES ('CLX', 'CLOROX CO');
      INSERT INTO beta VALUES ('AA', 'ALCOA CORPORATI');
      INSERT INTO beta VALUES ('MNST', 'MONSTER BEVERAG');
      INSERT INTO beta VALUES ('NWSA', 'NEWS CORPORATIO');
      INSERT INTO beta VALUES ('PCOR', 'PROCORE TECHNOL');
      INSERT INTO beta VALUES ('CSGP', 'COSTAR GROUP IN');
      INSERT INTO beta VALUES ('SQM', 'SOCIEDAD QUIMIC');
      INSERT INTO beta VALUES ('CSIQ', 'CANADIAN SOLAR');
      INSERT INTO beta VALUES ('OVV', 'OVINTIV INC');
      INSERT INTO beta VALUES ('STG', 'SUNLANDS TECHNO');
      INSERT INTO beta VALUES ('SEDG', 'SOLAREDGE TECHN');
      INSERT INTO beta VALUES ('HEAR', 'TURTLE BEACH CO');
      INSERT INTO beta VALUES ('DISCK', 'DISCOVERY INC');
      INSERT INTO beta VALUES ('NVVE', 'NUVVE HOLDING C');
      INSERT INTO beta VALUES ('VGR', 'VECTOR GROUP LT');
      INSERT INTO beta VALUES ('FLYW', 'FLYWIRE CORPORA');
      INSERT INTO beta VALUES ('VICI', 'VICI PROPERTIES');
      INSERT INTO beta VALUES ('NVDA', 'NVIDIA CORP');
      INSERT INTO beta VALUES ('BK', 'BANK NEW YORK M');
      INSERT INTO beta VALUES ('AMG', 'AFFILIATED MANA');
      INSERT INTO beta VALUES ('RIOT', 'RIOT BLOCKCHAIN');
      INSERT INTO beta VALUES ('FUV', 'ARCIMOTO INC');
      INSERT INTO beta VALUES ('DT', 'DYNATRACE INC');
      INSERT INTO beta VALUES ('BKNG', 'BOOKING HOLDING');
      INSERT INTO beta VALUES ('MARA', 'MARATHON DIGITA');
      INSERT INTO beta VALUES ('TGNA', 'TEGNA INC');
      INSERT INTO beta VALUES ('AY', 'ATLANTICA SUSTA');
      INSERT INTO beta VALUES ('AGL', 'AGILON HEALTH I');
      INSERT INTO beta VALUES ('GME', 'GAMESTOP CORP');
      INSERT INTO beta VALUES ('BIIB', 'BIOGEN INC');
      INSERT INTO beta VALUES ('VLRS', 'CONTROLADORA VU');
      INSERT INTO beta VALUES ('THG', 'HANOVER INSURAN');
      INSERT INTO beta VALUES ('CHRW', 'C H ROBINSON WO');
      INSERT INTO beta VALUES ('FSLY', 'FASTLY INC');
      INSERT INTO beta VALUES ('EME', 'EMCOR GROUP INC');
      INSERT INTO beta VALUES ('LYFT', 'LYFT INC');
      INSERT INTO beta VALUES ('IGT', 'INTERNATIONAL G');
      INSERT INTO beta VALUES ('QLYS', 'QUALYS INC');
      INSERT INTO beta VALUES ('PT', 'PINTEC TECHNOLO');
      INSERT INTO beta VALUES ('QCOM', 'QUALCOMM INC');
      INSERT INTO beta VALUES ('VTR', 'VENTAS INC');
      INSERT INTO beta VALUES ('PETS', 'PETMED EXPRESS');
      INSERT INTO beta VALUES ('VTRS', 'VIATRIS INC');
      INSERT INTO beta VALUES ('AVB', 'AVALONBAY COMMU');
      INSERT INTO beta VALUES ('REGN', 'REGENERON PHARM');
      INSERT INTO beta VALUES ('DLR', 'DIGITAL REALTY');
      INSERT INTO beta VALUES ('TRV', 'THE TRAVELERS C');
      INSERT INTO beta VALUES ('MRK', 'MERCK & CO INC');
      INSERT INTO beta VALUES ('TAST', 'CARROLS RESTAUR');
      INSERT INTO beta VALUES ('UPS', 'UNITED PARCEL S');
      INSERT INTO beta VALUES ('BOWX', 'BOWX ACQUISITIO');
      INSERT INTO beta VALUES ('CL', 'COLGATE PALMOLI');
      INSERT INTO beta VALUES ('CINF', 'CINCINNATI FINA');
      INSERT INTO beta VALUES ('BLK', 'BLACKROCK INC');
      INSERT INTO beta VALUES ('MUDS', 'MUDRICK CAPITAL');
      INSERT INTO beta VALUES ('MCD', 'MCDONALDS CORP');
      INSERT INTO beta VALUES ('PENN', 'PENN NATIONAL G');
      INSERT INTO beta VALUES ('PSX', 'PHILLIPS 66');
      INSERT INTO beta VALUES ('AMH', 'AMERICAN HOMES');
      INSERT INTO beta VALUES ('EDU', 'NEW ORIENTAL ED');
      INSERT INTO beta VALUES ('ARE', 'ALEXANDRIA REAL');
      INSERT INTO beta VALUES ('ESCA', 'ESCALADE INC');
      INSERT INTO beta VALUES ('JPM', 'JPMORGAN CHASE');
      INSERT INTO beta VALUES ('STMP', 'STAMPS.COM INC');
      INSERT INTO beta VALUES ('PXD', 'PIONEER NATURAL');
      INSERT INTO beta VALUES ('PK', 'PARK HOTELS & R');
      INSERT INTO beta VALUES ('AFG', 'AMERICAN FINANC');
      INSERT INTO beta VALUES ('IRDM', 'IRIDIUM COMMUNI');
      INSERT INTO beta VALUES ('BLDP', 'BALLARD POWER S');
      INSERT INTO beta VALUES ('INCY', 'INCYTE CORPORAT');
      INSERT INTO beta VALUES ('RPRX', 'ROYALTY PHARMA');
      INSERT INTO beta VALUES ('CIDM', 'CINEDIGM CORP');
      INSERT INTO beta VALUES ('LFST', 'LIFESTANCE HEAL');
      INSERT INTO beta VALUES ('JAKK', 'JAKKS PACIFIC I');
      INSERT INTO beta VALUES ('BLX', 'BANCO LATINOAME');
      INSERT INTO beta VALUES ('IPW', 'IPOWER INC');
      INSERT INTO beta VALUES ('SWM', 'SCHWEITZER MAUD');
      INSERT INTO beta VALUES ('WK', 'WORKIVA INC');
      INSERT INTO beta VALUES ('EBAY', 'EBAY INC');
      INSERT INTO beta VALUES ('FATE', 'FATE THERAPEUTI');
      INSERT INTO beta VALUES ('OKE', 'ONEOK INC');
      INSERT INTO beta VALUES ('PFPT', 'PROOFPOINT INC');
      INSERT INTO beta VALUES ('AIG', 'AMERICAN INTERN');
      INSERT INTO beta VALUES ('RSI', 'RUSH STREET INT');
      INSERT INTO beta VALUES ('MGM', 'MGM RESORTS INT');
      INSERT INTO beta VALUES ('FOXA', 'FOX CORPORATION');
      INSERT INTO beta VALUES ('CRM', 'SALESFORCE.COM');
      INSERT INTO beta VALUES ('MCHP', 'MICROCHIP TECHN');
      INSERT INTO beta VALUES ('CLR', 'CONTINENTAL RES');
      INSERT INTO beta VALUES ('TMCI', 'TREACE MEDICAL');
      INSERT INTO beta VALUES ('CLNE', 'CLEAN ENERGY FU');
      INSERT INTO beta VALUES ('ELAN', 'ELANCO ANIMAL H');
      INSERT INTO beta VALUES ('SPWR', 'SUNPOWER CORPOR');
      INSERT INTO beta VALUES ('DQ', 'DAQO NEW ENERGY');
      INSERT INTO beta VALUES ('ALZN', 'ALZAMEND NEURO');
      INSERT INTO beta VALUES ('DAR', 'DARLING INGREDI');
      INSERT INTO beta VALUES ('UDR', 'UDR INC');
      INSERT INTO beta VALUES ('VLO', 'VALERO ENERGY C');
      INSERT INTO beta VALUES ('BUZZ', 'VANECK VECTORS');
      INSERT INTO beta VALUES ('LUV', 'SOUTHWEST AIRLI');
      INSERT INTO beta VALUES ('CUBE', 'CUBESMART');
      INSERT INTO beta VALUES ('MS', 'MORGAN STANLEY');
      INSERT INTO beta VALUES ('IQV', 'IQVIA HOLDINGS');
      INSERT INTO beta VALUES ('XLY', 'SELECT SECTOR S');
      INSERT INTO beta VALUES ('V', 'VISA INC');
      INSERT INTO beta VALUES ('PCTY', 'PAYLOCITY HOLDI');
      INSERT INTO beta VALUES ('JKS', 'JINKOSOLAR HLDG');
      INSERT INTO beta VALUES ('MCO', 'MOODYS CORP');
      INSERT INTO beta VALUES ('GOOGL', 'ALPHABET INC');
      INSERT INTO beta VALUES ('ACB', 'AURORA CANNABIS');
      INSERT INTO beta VALUES ('PLAY', 'DAVE & BUSTERS');
      INSERT INTO beta VALUES ('IONS', 'IONIS PHARMACEU');
      INSERT INTO beta VALUES ('ACM', 'AECOM');
      INSERT INTO beta VALUES ('HSY', 'HERSHEY COMPANY');
      INSERT INTO beta VALUES ('VFC', 'VF CORPORATION');
      INSERT INTO beta VALUES ('TFC', 'TRUIST FINANCIA');
      INSERT INTO beta VALUES ('AMP', 'AMERIPRISE FINL');
      INSERT INTO beta VALUES ('ITRI', 'ITRON INC');
      INSERT INTO beta VALUES ('GOL', 'GOL LINHAS AERE');
      INSERT INTO beta VALUES ('RNLX', 'RENALYTIX PLC');
      INSERT INTO beta VALUES ('MTZ', 'MASTEC INC');
      INSERT INTO beta VALUES ('ILPT', 'INDUSTRIAL LOGI');
      INSERT INTO beta VALUES ('CME', 'CME GROUP INC');
      INSERT INTO beta VALUES ('GSAH', 'GS ACQUISITION');
      INSERT INTO beta VALUES ('AZUL', 'AZUL S A');
      INSERT INTO beta VALUES ('WSM', 'WILLIAMS SONOMA');
      INSERT INTO beta VALUES ('FRGI', 'FIESTA RESTAURA');
      INSERT INTO beta VALUES ('DE', 'DEERE & CO');
      INSERT INTO beta VALUES ('CAR', 'AVIS BUDGET GRO');
      INSERT INTO beta VALUES ('XEC', 'CIMAREX ENERGY');
      INSERT INTO beta VALUES ('JNJ', 'JOHNSON & JOHNS');
      INSERT INTO beta VALUES ('LBTYK', 'LIBERTY GLOBAL');
      INSERT INTO beta VALUES ('PRPL', 'PURPLE INNOVATI');
      INSERT INTO beta VALUES ('ANTM', 'ANTHEM INC');
      INSERT INTO beta VALUES ('HCIC', 'HENNESSY CAPIT');
      INSERT INTO beta VALUES ('CMP', 'COMPASS MINERAL');
      INSERT INTO beta VALUES ('LYV', 'LIVE NATION ENT');
      INSERT INTO beta VALUES ('ZGNX', 'ZOGENIX INC');
      INSERT INTO beta VALUES ('ABT', 'ABBOTT LABORATO');
      INSERT INTO beta VALUES ('FRC', 'FIRST REPUBLIC');
      INSERT INTO beta VALUES ('AMAT', 'APPLIED MATERIA');
      INSERT INTO beta VALUES ('SA', 'SEABRIDGE GOLD');
      INSERT INTO beta VALUES ('PYPL', 'PAYPAL HOLDINGS');
      INSERT INTO beta VALUES ('SWKS', 'SKYWORKS SOLUTI');
      INSERT INTO beta VALUES ('CWEB', 'DIREXION SHARES');
      INSERT INTO beta VALUES ('ENPH', 'ENPHASE ENERGY');
      INSERT INTO beta VALUES ('DLO', 'DLOCAL LIMITED');
      INSERT INTO beta VALUES ('NKE', 'NIKE INC');
      INSERT INTO beta VALUES ('CPSH', 'CPS TECHNOLOGIE');
      INSERT INTO beta VALUES ('UA', 'UNDER ARMOUR IN');
      INSERT INTO beta VALUES ('PFE', 'PFIZER INC');
      INSERT INTO beta VALUES ('ENDP', 'ENDO INTERNATIO');
      INSERT INTO beta VALUES ('TLRY', 'TILRAY INC');
      INSERT INTO beta VALUES ('CNTY', 'CENTURY CASINOS');
      INSERT INTO beta VALUES ('JBHT', 'JB HUNT TRANSPO');
      INSERT INTO beta VALUES ('CTRE', 'CARETRUST REIT');
      INSERT INTO beta VALUES ('INTC', 'INTEL CORP');
      INSERT INTO beta VALUES ('LIVX', 'LIVEXLIVE MEDIA');
      INSERT INTO beta VALUES ('PLTR', 'PALANTIR TECHNO');
      INSERT INTO beta VALUES ('SBGI', 'SINCLAIR BROADC');
      INSERT INTO beta VALUES ('DISCA', 'DISCOVERY INC');
      INSERT INTO beta VALUES ('OGI', 'ORGANIGRAM HOLD');
      INSERT INTO beta VALUES ('VERV', 'VERVE THERAPEUT');
      INSERT INTO beta VALUES ('MO', 'ALTRIA GROUP IN');
      INSERT INTO beta VALUES ('CB', 'CHUBB LTD');
      INSERT INTO beta VALUES ('MDLZ', 'MONDELEZ INTERN');
      INSERT INTO beta VALUES ('CTLT', 'CATALENT INC');
      INSERT INTO beta VALUES ('RRD', 'DONNELLEY R R &');
      INSERT INTO beta VALUES ('SCPL', 'SCIPLAY CORPORA');
      INSERT INTO beta VALUES ('NTRS', 'NORTHERN TRUST');
      INSERT INTO beta VALUES ('C', 'CITIGROUP INC');
      INSERT INTO beta VALUES ('LRN', 'STRIDE INC');
      INSERT INTO beta VALUES ('ROKT', 'SPDR SERIES TRU');
      INSERT INTO beta VALUES ('ADBE', 'ADOBE INC');
      INSERT INTO beta VALUES ('ALK', 'ALASKA AIR GROU');
      INSERT INTO beta VALUES ('USB', 'US BANCORP DEL');
      INSERT INTO beta VALUES ('TRI', 'THOMSON REUTERS');
      INSERT INTO beta VALUES ('DG', 'DOLLAR GENERAL');
      INSERT INTO beta VALUES ('GTN', 'GRAY TELEVISION');
      INSERT INTO beta VALUES ('GD', 'GENERAL DYNAMIC');
      INSERT INTO beta VALUES ('SNOW', 'SNOWFLAKE INC');
      INSERT INTO beta VALUES ('LNC', 'LINCOLN NATIONA');
      INSERT INTO beta VALUES ('RS', 'RELIANCE STEEL');
      INSERT INTO beta VALUES ('MNDY', 'MONDAY.COM LTD');
      INSERT INTO beta VALUES ('SRNG', 'SOARING EAGLE A');
      INSERT INTO beta VALUES ('DDOG', 'DATADOG INC');
      INSERT INTO beta VALUES ('HST', 'HOST HOTELS & R');
      INSERT INTO beta VALUES ('WMT', 'WALMART INC');
      INSERT INTO beta VALUES ('KO', 'COCA COLA COMPA');
      INSERT INTO beta VALUES ('LAUR', 'LAUREATE EDUCAT');
      INSERT INTO beta VALUES ('BLOK', 'AMPLIFY ETF TRU');
      INSERT INTO beta VALUES ('EQT', 'EQT CORPORATION');
      INSERT INTO beta VALUES ('LNG', 'CHENIERE ENERGY');
      INSERT INTO beta VALUES ('WRB', 'BERKLEY W R COR');
      INSERT INTO beta VALUES ('CHTR', 'CHARTER COMMUNI');
      INSERT INTO beta VALUES ('CVNA', 'CARVANA CO');
      INSERT INTO beta VALUES ('LTHM', 'LIVENT CORPORAT');
      INSERT INTO beta VALUES ('MAXN', 'MAXEON SOLAR TE');
      INSERT INTO beta VALUES ('AMRN', 'AMARIN CORPORAT');
      INSERT INTO beta VALUES ('SSTK', 'SHUTTERSTOCK IN');
      INSERT INTO beta VALUES ('IBM', 'INTERNATIONAL B');
      INSERT INTO beta VALUES ('FCEL', 'FUELCELL ENERGY');
      INSERT INTO beta VALUES ('NOVA', 'SUNNOVA ENERGY');
      INSERT INTO beta VALUES ('RETA', 'REATA PHARMACEU');
      INSERT INTO beta VALUES ('CRNC', 'CERENCE INC');
      INSERT INTO beta VALUES ('EWTX', 'EDGEWISE THERAP');
      INSERT INTO beta VALUES ('IT', 'GARTNER INC');
      INSERT INTO beta VALUES ('OTLY', 'OATLY GROUP AB');
      INSERT INTO beta VALUES ('AIEQ', 'ETF MANAGERS TR');
      INSERT INTO beta VALUES ('CDXC', 'CHROMADEX CORPO');
      INSERT INTO beta VALUES ('ATSG', 'AIR TRANSPORT S');
      INSERT INTO beta VALUES ('ATH', 'ATHENE HOLDING');
      INSERT INTO beta VALUES ('GTIM', 'GOOD TIMES REST');
      INSERT INTO beta VALUES ('ZTS', 'ZOETIS INC');
      INSERT INTO beta VALUES ('ATVI', 'ACTIVISION BLIZ');
      INSERT INTO beta VALUES ('ACIC', 'ATLAS CREST INV');
      INSERT INTO beta VALUES ('THNQ', 'EXCHANGE TRADED');
      INSERT INTO beta VALUES ('MDP', 'MEREDITH CORP');
      INSERT INTO beta VALUES ('DOW', 'DOW INC');
      INSERT INTO beta VALUES ('AIO', 'VIRTUS ALLIANZG');
      INSERT INTO beta VALUES ('TACO', 'DEL TACO RESTAU');
      INSERT INTO beta VALUES ('GRIL', 'MUSCLE MAKER IN');
      INSERT INTO beta VALUES ('SAVE', 'SPIRIT AIRLINES');
      INSERT INTO beta VALUES ('SHO', 'SUNSTONE HOTEL');
      INSERT INTO beta VALUES ('ROST', 'ROSS STORES INC');
      INSERT INTO beta VALUES ('BCPC', 'BALCHEM CORP');
      INSERT INTO beta VALUES ('SE', 'SEA LIMITED');
      INSERT INTO beta VALUES ('GRWG', 'GROWGENERATION');
      INSERT INTO beta VALUES ('RDI', 'READING INTL IN');
      INSERT INTO beta VALUES ('DLX', 'DELUXE CORP');
      INSERT INTO beta VALUES ('KALU', 'KAISER ALUMINUM');
      INSERT INTO beta VALUES ('STT', 'STATE STREET CO');
      INSERT INTO beta VALUES ('DCRC', 'DECARBONIZATION');
      INSERT INTO beta VALUES ('VIAC', 'VIACOMCBS INC');
      INSERT INTO beta VALUES ('DY', 'DYCOM INDUSTRIE');
      INSERT INTO beta VALUES ('NFLX', 'NETFLIX INC');
      INSERT INTO beta VALUES ('FFIV', 'F5 NETWORKS INC');
      INSERT INTO beta VALUES ('LOCO', 'EL POLLO LOCO H');
      INSERT INTO beta VALUES ('OSTK', 'OVERSTOCK.COM I');
      INSERT INTO beta VALUES ('WOR', 'WORTHINGTON IND');
      INSERT INTO beta VALUES ('HPE', 'HEWLETT PACKARD');
      INSERT INTO beta VALUES ('KSU', 'KANSAS CITY SOU');
      INSERT INTO beta VALUES ('SPG', 'SIMON PROPERTY');
      INSERT INTO beta VALUES ('EA', 'ELECTRONIC ARTS');
      INSERT INTO beta VALUES ('CVX', 'CHEVRON CORPORA');
      INSERT INTO beta VALUES ('Y', 'ALLEGHANY CORP-');
      INSERT INTO beta VALUES ('MKL', 'MARKEL CORP HOL');
      INSERT INTO beta VALUES ('BFI', 'BURGERFI INTERN');
      INSERT INTO beta VALUES ('NTR', 'NUTRIEN LTD');
      INSERT INTO beta VALUES ('DKNG', 'DRAFTKINGS INC');
      INSERT INTO beta VALUES ('CARA', 'CARA THERAPEUTI');
      INSERT INTO beta VALUES ('WWE', 'WORLD WRESTLING');
      INSERT INTO beta VALUES ('MTEX', 'MANNATECH INC');
      INSERT INTO beta VALUES ('INGR', 'INGREDION INC');
      INSERT INTO beta VALUES ('CHGG', 'CHEGG INC');
      INSERT INTO beta VALUES ('CNHI', 'CNH INDUSTRIAL');
      INSERT INTO beta VALUES ('VTI', 'VANGUARD INDEX');
      INSERT INTO beta VALUES ('KMPR', 'KEMPER CORP DEL');
      INSERT INTO beta VALUES ('DBX', 'DROPBOX INC');
      INSERT INTO beta VALUES ('DAL', 'DELTA AIR LINES');
      INSERT INTO beta VALUES ('GDEN', 'GOLDEN ENTERTAI');
      INSERT INTO beta VALUES ('RUTH', 'RUTHS HOSPITALI');
      INSERT INTO beta VALUES ('PSA', 'PUBLIC STORAGE');
      INSERT INTO beta VALUES ('BLCN', 'SIREN ETF TRUST');
      INSERT INTO beta VALUES ('CHUY', 'CHUY S HOLDINGS');
      INSERT INTO beta VALUES ('HIBB', 'HIBBETT INC');
      INSERT INTO beta VALUES ('LILAK', 'LIBERTY LATIN A');
      INSERT INTO beta VALUES ('GS', 'GOLDMAN SACHS G');
      INSERT INTO beta VALUES ('DUOT', 'DUOS TECHNOLOGI');
      INSERT INTO beta VALUES ('DIS', 'WALT DISNEY CO');
      INSERT INTO beta VALUES ('FL', 'FOOT LOCKER INC');
      INSERT INTO beta VALUES ('EBET', 'ESPORTS TECHNOL');
      INSERT INTO beta VALUES ('SEAS', 'SEAWORLD ENTERT');
      INSERT INTO beta VALUES ('SBUX', 'STARBUCKS CORP');
      INSERT INTO beta VALUES ('IAC', 'IAC INTERACTIVE');
      INSERT INTO beta VALUES ('CMC', 'COMMERCIAL META');
      INSERT INTO beta VALUES ('SALM', 'SALEM MEDIA GRO');
      INSERT INTO beta VALUES ('SRPT', 'SAREPTA THERAPE');
      INSERT INTO beta VALUES ('FLWS', '1800 FLOWERS.CO');
      INSERT INTO beta VALUES ('APA', 'APA CORPORATION');
      INSERT INTO beta VALUES ('EDTK', 'SKILLFUL CRAFTS');
      INSERT INTO beta VALUES ('ADP', 'AUTOMATIC DATA');
      INSERT INTO beta VALUES ('CSCO', 'CISCO SYSTEMS I');
      INSERT INTO beta VALUES ('RELX', 'RELX PLC');
      INSERT INTO beta VALUES ('KMB', 'KIMBERLY CLARK');
      INSERT INTO beta VALUES ('XLNX', 'XILINX INC');
      INSERT INTO beta VALUES ('CZR', 'CAESARS ENTERTA');
      INSERT INTO beta VALUES ('WKHS', 'WORKHORSE GROUP');
      INSERT INTO beta VALUES ('XOM', 'EXXON MOBIL COR');
      INSERT INTO beta VALUES ('REG', 'REGENCY CENTERS');
      INSERT INTO beta VALUES ('LLY', 'ELI LILLY & CO');
      INSERT INTO beta VALUES ('NTES', 'NETEASE INC');
      INSERT INTO beta VALUES ('IVAN', 'IVANHOE CAP ACQ');
      INSERT INTO beta VALUES ('GH', 'GUARDANT HEALTH');
      INSERT INTO beta VALUES ('BGNE', 'BEIGENE LTD');
      INSERT INTO beta VALUES ('AZRE', 'AZURE POWER GLO');
      INSERT INTO beta VALUES ('MPC', 'MARATHON PETE C');
      INSERT INTO beta VALUES ('KHC', 'KRAFT HEINZ COM');
      INSERT INTO beta VALUES ('KRUS', 'KURA SUSHI USA');
      INSERT INTO beta VALUES ('JNPR', 'JUNIPER NETWORK');
      INSERT INTO beta VALUES ('WBA', 'WALGREEN BOOTS');
      INSERT INTO beta VALUES ('FLR', 'FLUOR CORP NEW');
      INSERT INTO beta VALUES ('SENS', 'SENSEONICS HOLD');
      INSERT INTO beta VALUES ('NUS', 'NU SKIN ENTERPR');
      INSERT INTO beta VALUES ('TRGP', 'TARGA RESOURCES');
      INSERT INTO beta VALUES ('RNR', 'RENAISSANCERE H');
      INSERT INTO beta VALUES ('MGPI', 'MGP INGREDIENTS');
      INSERT INTO beta VALUES ('PLUG', 'PLUG POWER INC');
      INSERT INTO beta VALUES ('SFIX', 'STITCH FIX INC');
      INSERT INTO beta VALUES ('NET', 'CLOUDFLARE INC');
      INSERT INTO beta VALUES ('RRGB', 'RED ROBIN GOURM');
      INSERT INTO beta VALUES ('MAPS', 'WM TECHNOLOGY I');
      INSERT INTO beta VALUES ('SIRI', 'SIRIUS XM HOLDI');
      INSERT INTO beta VALUES ('BJRI', 'BJS RESTAURANTS');
      INSERT INTO beta VALUES ('VFF', 'VILLAGE FARMS I');
      INSERT INTO beta VALUES ('FANG', 'DIAMONDBACK ENE');
      INSERT INTO beta VALUES ('EDR', 'ENDEAVOR GROUP');
      INSERT INTO beta VALUES ('RIDE', 'LORDSTOWN MOTOR');
      INSERT INTO beta VALUES ('RXRX', 'RECURSION PHARM');
      INSERT INTO beta VALUES ('CIEN', 'CIENA CORPORATI');
      INSERT INTO beta VALUES ('KR', 'KROGER CO (THE)');
      INSERT INTO beta VALUES ('PAYC', 'PAYCOM SOFTWARE');
      INSERT INTO beta VALUES ('PRGO', 'PERRIGO COMPANY');
      INSERT INTO beta VALUES ('CMG', 'CHIPOTLE MEXICA');
      INSERT INTO beta VALUES ('GRUB', 'JUST EAT TAKEAW');
      INSERT INTO beta VALUES ('CIM', 'CHIMERA INVESTM');
      INSERT INTO beta VALUES ('LRNZ', 'LISTED FUNDS TR');
      INSERT INTO beta VALUES ('ALHC', 'ALIGNMENT HEALT');
      INSERT INTO beta VALUES ('SLB', 'SCHLUMBERGER LT');
      INSERT INTO beta VALUES ('S', 'SENTINELONE INC');
      INSERT INTO beta VALUES ('UNP', 'UNION PACIFIC C');
      INSERT INTO beta VALUES ('ATNI', 'ATN INTL INC');
      INSERT INTO beta VALUES ('CRON', 'CRONOS GROUP IN');
      INSERT INTO beta VALUES ('MNR', 'MONMOUTH REAL E');
      INSERT INTO beta VALUES ('CHWY', 'CHEWY INC');
      INSERT INTO beta VALUES ('AXS', 'AXIS CAPITAL HO');
      INSERT INTO beta VALUES ('ANSS', 'ANSYS INC');
      INSERT INTO beta VALUES ('FMC', 'FMC CORP NEW');
      INSERT INTO beta VALUES ('EQR', 'EQUITY RESIDENT');
      INSERT INTO beta VALUES ('CBAT', 'CBAK ENERGY TEC');
      INSERT INTO beta VALUES ('AVGO', 'BROADCOM INC');
      INSERT INTO beta VALUES ('BZ', 'KANZHUN LIMITED');
      INSERT INTO beta VALUES ('INVA', 'INNOVIVA INC');
      INSERT INTO beta VALUES ('EOG', 'EOG RES INC');
      INSERT INTO beta VALUES ('LITE', 'LUMENTUM HOLDIN');
      INSERT INTO beta VALUES ('AGCO', 'AGCO CORP');
      INSERT INTO beta VALUES ('RKT', 'ROCKET COMPANIE');
      INSERT INTO beta VALUES ('PEP', 'PEPSICO INC');
      INSERT INTO beta VALUES ('AMZN', 'AMAZON.COM INC');
      INSERT INTO beta VALUES ('NIO', 'NIO INC');
      INSERT INTO beta VALUES ('IPWR', 'IDEAL POWER INC');
      INSERT INTO beta VALUES ('SPGI', 'S&P GLOBAL INC');
      INSERT INTO beta VALUES ('DOCU', 'DOCUSIGN INC');
      INSERT INTO beta VALUES ('IPOF', 'SOCIAL CAPITAL');
      INSERT INTO beta VALUES ('AKAM', 'AKAMAI TECHNOLO');
      INSERT INTO beta VALUES ('VOO', 'VANGUARD S&P 50');
      INSERT INTO beta VALUES ('DTE', 'DTE ENERGY CO');
      INSERT INTO beta VALUES ('KARS', 'KRANESHARES TRU');
      INSERT INTO beta VALUES ('BALY', 'BALLY S CORPORA');
      INSERT INTO beta VALUES ('TWLO', 'TWILIO INC');
      INSERT INTO beta VALUES ('VRTX', 'VERTEX PHARMACE');
      INSERT INTO beta VALUES ('BYD', 'BOYD GAMING COR');
      INSERT INTO beta VALUES ('ETWO', 'E2OPEN PARENT H');
      INSERT INTO beta VALUES ('CRWD', 'CROWDSTRIKE HOL');
      INSERT INTO beta VALUES ('MU', 'MICRON TECHNOLO');
      INSERT INTO beta VALUES ('NEPT', 'NEPTUNE WELLNES');
      INSERT INTO beta VALUES ('L', 'LOEWS CORPORATI');
      INSERT INTO beta VALUES ('ULTA', 'ULTA BEAUTY INC');
      INSERT INTO beta VALUES ('COE', 'CHINA ONLINE ED');
      INSERT INTO beta VALUES ('NEM', 'NEWMONT CORPORA');
      INSERT INTO beta VALUES ('BBY', 'BEST BUY COMPAN');
      INSERT INTO beta VALUES ('NXST', 'NEXSTAR MEDIA G');
      INSERT INTO beta VALUES ('CENX', 'CENTURY ALUMINU');
      INSERT INTO beta VALUES ('BOTZ', 'GLOBAL X FUNDS');
      INSERT INTO beta VALUES ('APPF', 'APPFOLIO INC');
      INSERT INTO beta VALUES ('SKYW', 'SKYWEST INC');
      INSERT INTO beta VALUES ('LUMN', 'LUMEN TECHNOLOG');
      INSERT INTO beta VALUES ('BRCN', 'BURCON NUTRASCI');
      INSERT INTO beta VALUES ('KKR', 'KKR & CO INC');
      INSERT INTO beta VALUES ('ARNA', 'ARENA PHARMACEU');
      INSERT INTO beta VALUES ('SWK', 'STANLEY BLACK &');
      INSERT INTO beta VALUES ('ROBO', 'ROBO GLOBAL ROB');
      INSERT INTO beta VALUES ('IHG', 'INTERCONTINENTA');
      INSERT INTO beta VALUES ('PAY', 'PAYMENTUS HOLDI');
      INSERT INTO beta VALUES ('AMD', 'ADVANCED MICRO');
      INSERT INTO beta VALUES ('AIZ', 'ASSURANT INC');
      INSERT INTO beta VALUES ('FLTR', 'VANECK VECTORS');
      INSERT INTO beta VALUES ('ANET', 'ARISTA NETWORKS');
      INSERT INTO beta VALUES ('GILD', 'GILEAD SCIENCES');
      INSERT INTO beta VALUES ('BE', 'BLOOM ENERGY CO');
      INSERT INTO beta VALUES ('COUR', 'COURSERA INC');
      INSERT INTO beta VALUES ('ZM', 'ZOOM VIDEO COMM');
      INSERT INTO beta VALUES ('ZUO', 'ZUORA INC');
      INSERT INTO beta VALUES ('HGV', 'HILTON GRAND VA');
      INSERT INTO beta VALUES ('TPC', 'TUTOR PERINI CO');
      INSERT INTO beta VALUES ('COST', 'COSTCO WHOLESAL');
      INSERT INTO beta VALUES ('MRO', 'MARATHON OIL CO');
      INSERT INTO beta VALUES ('MVIS', 'MICROVISION INC');
      INSERT INTO beta VALUES ('ZYNE', 'ZYNERBA PHARMAC');
      INSERT INTO beta VALUES ('COG', 'CABOT OIL AND G');
      INSERT INTO beta VALUES ('MTCH', 'MATCH GROUP INC');
      INSERT INTO beta VALUES ('GHG', 'GREENTREE HOSPI');
      INSERT INTO beta VALUES ('AAPL', 'APPLE INC');
      INSERT INTO beta VALUES ('X', 'UNITED STATES S');
      INSERT INTO beta VALUES ('VIH', 'VPC IMPACT ACQU');
      INSERT INTO beta VALUES ('ACC', 'AMERICAN CAMPUS');
      INSERT INTO beta VALUES ('SHEN', 'SHENANDOAH TELE');
      INSERT INTO beta VALUES ('SMAR', 'SMARTSHEET INC');
      INSERT INTO beta VALUES ('APPN', 'APPIAN CORPORAT');
      INSERT INTO beta VALUES ('SCHW', 'CHARLES SCHWAB');
      INSERT INTO beta VALUES ('CHH', 'CHOICE HOTELS I');
      INSERT INTO beta VALUES ('CLVR', 'CLEVER LEAVES H');
      INSERT INTO beta VALUES ('NRG', 'NRG ENERGY INC');
      INSERT INTO beta VALUES ('VIRT', 'VIRTU FINANCIAL');
      INSERT INTO beta VALUES ('NOV', 'NOV INC');
      INSERT INTO beta VALUES ('GOOG', 'ALPHABET INC');
      INSERT INTO beta VALUES ('J', 'JACOBS ENGINEER');
      INSERT INTO beta VALUES ('CBRL', 'CRACKER BARREL');
      INSERT INTO beta VALUES ('REAL', 'REALREAL INC (T');
      INSERT INTO beta VALUES ('IDRV', 'ISHARES TRUST');
      INSERT INTO beta VALUES ('ADS', 'ALLIANCE DATA S');
      INSERT INTO beta VALUES ('ALNY', 'ALNYLAM PHARMAC');
      INSERT INTO beta VALUES ('FCX', 'FREEPORT MCMORA');
      INSERT INTO beta VALUES ('WFC', 'WELLS FARGO & C');
      INSERT INTO beta VALUES ('GPS', 'GAP INC');
      INSERT INTO beta VALUES ('ELYS', 'ELYS GAME TECHN');
      INSERT INTO beta VALUES ('LRCX', 'LAM RESEARCH CO');
      INSERT INTO beta VALUES ('BAC', 'BANK OF AMERICA');
      INSERT INTO beta VALUES ('AMCX', 'AMC NETWORKS IN');
      INSERT INTO beta VALUES ('RIBT', 'RICEBRAN TECHNO');
      INSERT INTO beta VALUES ('SI', 'SILVERGATE CAPI');
      INSERT INTO beta VALUES ('GOEV', 'CANOO INC');
      INSERT INTO beta VALUES ('FIVN', 'FIVE9 INC');
      INSERT INTO beta VALUES ('ATEX', 'ANTERIX INC');
      INSERT INTO beta VALUES ('MED', 'MEDIFAST INC');
      INSERT INTO beta VALUES ('UBER', 'UBER TECHNOLOGI');
      INSERT INTO beta VALUES ('OKTA', 'OKTA INC');
      INSERT INTO beta VALUES ('SPY', 'SPDR S&P 500 ET');
      INSERT INTO beta VALUES ('QTWO', 'Q2 HOLDINGS INC');
      INSERT INTO beta VALUES ('PLD', 'PROLOGIS INC');
      INSERT INTO beta VALUES ('ORCL', 'ORACLE CORPORAT');
      INSERT INTO beta VALUES ('BL', 'BLACKLINE INC');
      INSERT INTO beta VALUES ('FSLR', 'FIRST SOLAR INC');
      INSERT INTO beta VALUES ('SOL', 'RENESOLA LTD');
      INSERT INTO beta VALUES ('NWS', 'NEWS CORPORATIO');
      INSERT INTO beta VALUES ('WMB', 'WILLIAMS COMPAN');
      INSERT INTO beta VALUES ('HCC', 'WARRIOR MET COA');
      INSERT INTO beta VALUES ('DLTR', 'DOLLAR TREE INC');
      INSERT INTO beta VALUES ('MRNA', 'MODERNA INC');
      INSERT INTO beta VALUES ('HLF', 'HERBALIFE NUTRI');
      INSERT INTO beta VALUES ('QRTEA', 'QURATE RETAIL I');
      INSERT INTO beta VALUES ('NUE', 'NUCOR CORP');
      INSERT INTO beta VALUES ('SCHN', 'SCHNITZER STEEL');
      INSERT INTO beta VALUES ('PNC', 'PNC FINANCIAL S');
      INSERT INTO beta VALUES ('PEAK', 'HEALTHPEAK PROP');
      INSERT INTO beta VALUES ('YUM', 'YUM BRANDS INC');
      INSERT INTO beta VALUES ('CCL', 'CARNIVAL CORP');
      INSERT INTO beta VALUES ('WELL', 'WELLTOWER INC');
      INSERT INTO beta VALUES ('EXPD', 'EXPEDITORS INTE');
      INSERT INTO beta VALUES ('TEL', 'TE CONNECTIVITY');
      INSERT INTO beta VALUES ('SF', 'STIFEL FINANCIA');
      INSERT INTO beta VALUES ('FIGS', 'FIGS INC');
      INSERT INTO beta VALUES ('BHP', 'BHP GROUP LIMIT');
      INSERT INTO beta VALUES ('BNED', 'BARNES & NOBLE');
      INSERT INTO beta VALUES ('SWIM', 'LATHAM GROUP IN');
      INSERT INTO beta VALUES ('LTC', 'LTC PROPERTIES');
      INSERT INTO beta VALUES ('BTI', 'BRITISH AMERICA');
      INSERT INTO beta VALUES ('NDLS', 'NOODLES & COMPA');
      INSERT INTO beta VALUES ('OMC', 'OMNICOM GROUP I');
      INSERT INTO beta VALUES ('FB', 'FACEBOOK INC');
      INSERT INTO beta VALUES ('ADI', 'ANALOG DEVICES');
      INSERT INTO beta VALUES ('ZY', 'ZYMERGEN INC');
      INSERT INTO beta VALUES ('PGR', 'PROGRESSIVE COR');
      INSERT INTO beta VALUES ('HZNP', 'HORIZON THERAPE');
      INSERT INTO beta VALUES ('MET', 'METLIFE INC');
      INSERT INTO beta VALUES ('AVAV', 'AEROVIRONMENT I');
      INSERT INTO beta VALUES ('BOX', 'BOX INC');
      INSERT INTO beta VALUES ('ILMN', 'ILLUMINA INC');
      INSERT INTO beta VALUES ('ELAT', 'UTS ELANCO ANIM');
      INSERT INTO beta VALUES ('PBPB', 'POTBELLY CORPOR');
      INSERT INTO beta VALUES ('BBQ', 'BBQ HOLDINGS IN');
      INSERT INTO beta VALUES ('ARKR', 'ARK RESTAURANTS');
      INSERT INTO beta VALUES ('SMG', 'SCOTTS MIRACLE');
      INSERT INTO beta VALUES ('AVLR', 'AVALARA INC');
      INSERT INTO beta VALUES ('XPEV', 'XPENG INC');
      INSERT INTO beta VALUES ('GRPN', 'GROUPON INC');
      INSERT INTO beta VALUES ('PFG', 'PRINCIPAL FINAN');
      INSERT INTO beta VALUES ('ATI', 'ALLEGHENY TECHN');
      INSERT INTO beta VALUES ('HLT', 'HILTON WORLDWID');
      INSERT INTO beta VALUES ('LAC', 'LITHIUM AMERICA');
      INSERT INTO beta VALUES ('KMI', 'KINDER MORGAN I');
      INSERT INTO beta VALUES ('OMAB', 'GRUPO AEROPORTU');
      INSERT INTO beta VALUES ('XXII', '22ND CENTURY GR');
      INSERT INTO beta VALUES ('TSN', 'TYSON FOODS INC');
      INSERT INTO beta VALUES ('ZLAB', 'ZAI LAB LIMITED');
      INSERT INTO beta VALUES ('F', 'FORD MOTOR CO');
      INSERT INTO beta VALUES ('DRE', 'DUKE REALTY COR');
      INSERT INTO beta VALUES ('OLED', 'UNIVERSAL DISPL');
      INSERT INTO beta VALUES ('MNTV', 'MOMENTIVE GLOBA');
      INSERT INTO beta VALUES ('TSLA', 'TESLA INC');
      INSERT INTO beta VALUES ('BEEM', 'BEAM GLOBAL');
      INSERT INTO beta VALUES ('LULU', 'LULULEMON ATHLE');
      INSERT INTO beta VALUES ('CHDN', 'CHURCHILL DOWNS');
      INSERT INTO beta VALUES ('USNA', 'USANA HEALTH SC');
      INSERT INTO beta VALUES ('W', 'WAYFAIR INC');
      INSERT INTO beta VALUES ('GIS', 'GENERAL MILLS I');
      INSERT INTO beta VALUES ('HAL', 'HALLIBURTON COM');
      INSERT INTO beta VALUES ('SIX', 'SIX FLAGS ENTER');
      INSERT INTO beta VALUES ('CNSL', 'CONSOLIDATED CO');
      INSERT INTO beta VALUES ('YQ', '17 EDUCATION &');
      INSERT INTO beta VALUES ('AC', 'ASSOCIATED CAPI');
      INSERT INTO beta VALUES ('QQQ', 'INVESCO QQQ TR');
      INSERT INTO beta VALUES ('BMRN', 'BIOMARIN PHARMA');
      INSERT INTO beta VALUES ('T', 'AT&T INC');
      INSERT INTO beta VALUES ('BILI', 'BILIBILI INC');
      INSERT INTO beta VALUES ('ACGL', 'ARCH CAPITAL GR');
      INSERT INTO beta VALUES ('RUN', 'SUNRUN INC');
      INSERT INTO beta VALUES ('PLNT', 'PLANET FITNESS');
      INSERT INTO beta VALUES ('PCRX', 'PACIRA BIOSCIEN');
      INSERT INTO beta VALUES ('BLNK', 'BLINK CHARGING');
      INSERT INTO beta VALUES ('MP', 'MP MATERIALS CO');
      INSERT INTO beta VALUES ('TPB', 'TURNING POINT B');
      INSERT INTO beta VALUES ('LEN', 'LENNAR CORP');
      INSERT INTO beta VALUES ('UTHR', 'UNITED THERAPEU');
      INSERT INTO beta VALUES ('AMGN', 'AMGEN INC');
      INSERT INTO beta VALUES ('DHI', 'D R HORTON INC');
      INSERT INTO beta VALUES ('IRBO', 'ISHARES TRUST');
      INSERT INTO beta VALUES ('CMCSA', 'COMCAST CORP');
      INSERT INTO beta VALUES ('NHI', 'NATIONAL HEALTH');
      INSERT INTO beta VALUES ('ICL', 'ICL GROUP LTD');
      INSERT INTO beta VALUES ('QD', 'QUDIAN INC');
      INSERT INTO beta VALUES ('BTWN', 'BRIDGETOWN HOLD');
      INSERT INTO beta VALUES ('RICK', 'RCI HOSPITALITY');
      INSERT INTO beta VALUES ('ICE', 'INTERCONTINENTA');
      INSERT INTO beta VALUES ('ZME', 'ZHANGMEN EDUCAT');
      INSERT INTO beta VALUES ('SKYT', 'SKYWATER TECHNO');
      INSERT INTO beta VALUES ('GM', 'GENERAL MOTORS');
      INSERT INTO beta VALUES ('CRS', 'CARPENTER TECHN');
      INSERT INTO beta VALUES ('RNG', 'RINGCENTRAL INC');
      INSERT INTO beta VALUES ('AMRC', 'AMERESCO INC');
      INSERT INTO beta VALUES ('AFL', 'AFLAC INC');
      INSERT INTO beta VALUES ('TDUP', 'THREDUP INC');
      INSERT INTO beta VALUES ('ISDR', 'ISSUER DIRECT C');
      INSERT INTO beta VALUES ('INSE', 'INSPIRED ENTERT');
      INSERT INTO beta VALUES ('BRO', 'BROWN & BROWN I');
      INSERT INTO beta VALUES ('HES', 'HESS CORPORATIO');
      INSERT INTO beta VALUES ('TGT', 'TARGET CORP');
      INSERT INTO beta VALUES ('BMY', 'BRISTOL MYERS S');
      INSERT INTO beta VALUES ('ORLY', 'O REILLY AUTOMO');
      INSERT INTO beta VALUES ('LX', 'LEXINFINTECH HO');
      INSERT INTO beta VALUES ('MAA', 'MID AMERICA APA');
      INSERT INTO beta VALUES ('TREE', 'LENDINGTREE INC');
      INSERT INTO beta VALUES ('AMSC', 'AMERICAN SUPERC');
      INSERT INTO beta VALUES ('NBDR', 'NO BORDERS INC');
      INSERT INTO beta VALUES ('PZZA', 'PAPA JOHNS INTE');
      INSERT INTO beta VALUES ('O', 'REALTY INCOME C');
      INSERT INTO beta VALUES ('GHACU', 'UTS GAMING & HO');
      INSERT INTO beta VALUES ('FDX', 'FEDEX CORP');
      INSERT INTO beta VALUES ('NSC', 'NORFOLK SOUTHER');
      INSERT INTO beta VALUES ('MSCI', 'MSCI INC');
      INSERT INTO beta VALUES ('MIME', 'MIMECAST LIMITE');
      INSERT INTO beta VALUES ('NUAN', 'NUANCE COMMUNIC');
      INSERT INTO beta VALUES ('BRKA', 'BERKSHIRE HATHA');
      INSERT INTO beta VALUES ('TWTR', 'TWITTER INC');
      INSERT INTO beta VALUES ('WDAY', 'WORKDAY INC');
      INSERT INTO beta VALUES ('ASO', 'ACADEMY SPORTS');
      INSERT INTO beta VALUES ('IPG', 'INTERPUBLIC GRO');
      INSERT INTO beta VALUES ('ABBV', 'ABBVIE INC');
      INSERT INTO beta VALUES ('DFS', 'DISCOVER FINANC');
      INSERT INTO beta VALUES ('LXP', 'LEXINGTON REALT');
      INSERT INTO beta VALUES ('ALGT', 'ALLEGIANT TRAVE');
      INSERT INTO beta VALUES ('DOYU', 'DOUYU INTERNATI');

      update instruments.inst i
      set shortdescription = beta.shortdescription
      from beta
      where beta.symbol = i.symbol;

      drop table if exists "beta";

      delete from instruments.inst_feed where inst_id in (select id from instruments.inst where shortdescription is null);
      delete from instruments.inst where shortdescription is null;
      alter table instruments.inst alter column shortdescription set not null;


      UPDATE instruments.inst set country = 'USA';

      ALTER TABLE ONLY instruments.inst
         ADD CONSTRAINT fkey_inst_symbol_country FOREIGN KEY (country) REFERENCES instruments.country (name);

      ALTER TABLE instruments.inst
        ADD CONSTRAINT key_inst_symbol_country
          UNIQUE (symbol, country);

      ALTER TABLE instruments.inst ALTER COLUMN country SET NOT NULL;

      call launchpad.update_inst_scalar_props_is_traded();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
