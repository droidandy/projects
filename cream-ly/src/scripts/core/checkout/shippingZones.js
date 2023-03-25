// result of REST API https://creamly.myshopify.com/admin/api/2019-10/shipping_zones.json

module.exports = {
  shipping_zones: [
    {
      id: 427803275,
      name: "Domestic",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/50029822006",
      countries: [
        {
          id: 567132363,
          name: "Netherlands",
          tax: 0.21,
          code: "NL",
          tax_name: "NL btw",
          shipping_zone_id: 427803275,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 89524404278,
          name: "Бесплатная доставка Post NL",
          price: "0.00",
          shipping_zone_id: 427803275,
          min_order_subtotal: "130.0",
          max_order_subtotal: null
        },
        {
          id: 89524469814,
          name: "Post NL",
          price: "6.00",
          shipping_zone_id: 427803275,
          min_order_subtotal: "0.0",
          max_order_subtotal: "130.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 427803339,
      name: "Rest of world",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/50029920310",
      countries: [
        {
          id: 567132427,
          name: "Rest of World",
          tax: 0.0,
          code: "*",
          tax_name: "Tax",
          shipping_zone_id: 427803339,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 89524502582,
          name: "Бесплатная доставка PostNL с трекинг номером",
          price: "0.00",
          shipping_zone_id: 427803339,
          min_order_subtotal: "170.0",
          max_order_subtotal: null
        },
        {
          id: 89524535350,
          name: "POSTNL с трекинг номером",
          price: "25.00",
          shipping_zone_id: 427803339,
          min_order_subtotal: "0.0",
          max_order_subtotal: "170.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 14727675941,
      name: "8  euro_",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/50029953078",
      countries: [
        {
          id: 30214029349,
          name: "Belgium",
          tax: 0.21,
          code: "BE",
          tax_name: "BE TVA",
          shipping_zone_id: 14727675941,
          provinces: []
        },
        {
          id: 30214062117,
          name: "Germany",
          tax: 0.21,
          code: "DE",
          tax_name: "DE MwSt",
          shipping_zone_id: 14727675941,
          provinces: []
        },
        {
          id: 32095633445,
          name: "Luxembourg",
          tax: 0.21,
          code: "LU",
          tax_name: "LU VAT",
          shipping_zone_id: 14727675941,
          provinces: []
        },
        {
          id: 403253624886,
          name: "Georgia",
          tax: 0.0,
          code: "GE",
          tax_name: "VAT",
          shipping_zone_id: 14727675941,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 89524994102,
          name: "Бесплатная доставка PostNL с трекинг номером",
          price: "0.00",
          shipping_zone_id: 14727675941,
          min_order_subtotal: "140.0",
          max_order_subtotal: null
        },
        {
          id: 89525026870,
          name: "PostNL с трекинг номером",
          price: "8.00",
          shipping_zone_id: 14727675941,
          min_order_subtotal: "0.0",
          max_order_subtotal: "140.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 14727708709,
      name: "9 euro_",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/50030313526",
      countries: [
        {
          id: 175080898614,
          name: "France",
          tax: 0.21,
          code: "FR",
          tax_name: "FR TVA",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 166792691766,
          name: "Spain",
          tax: 0.21,
          code: "ES",
          tax_name: "ES IVA",
          shipping_zone_id: 14727708709,
          provinces: [
            {
              id: 1830137757750,
              country_id: 166792691766,
              name: "A Coruña",
              code: "C",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830137790518,
              country_id: 166792691766,
              name: "Álava",
              code: "VI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830137823286,
              country_id: 166792691766,
              name: "Albacete",
              code: "AB",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830137856054,
              country_id: 166792691766,
              name: "Alicante",
              code: "A",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830137888822,
              country_id: 166792691766,
              name: "Almería",
              code: "AL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830137921590,
              country_id: 166792691766,
              name: "Asturias",
              code: "O",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830137954358,
              country_id: 166792691766,
              name: "Ávila",
              code: "AV",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830137987126,
              country_id: 166792691766,
              name: "Badajoz",
              code: "BA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138019894,
              country_id: 166792691766,
              name: "Balears",
              code: "PM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138052662,
              country_id: 166792691766,
              name: "Barcelona",
              code: "B",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138085430,
              country_id: 166792691766,
              name: "Burgos",
              code: "BU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138118198,
              country_id: 166792691766,
              name: "Cáceres",
              code: "CC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138150966,
              country_id: 166792691766,
              name: "Cádiz",
              code: "CA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138183734,
              country_id: 166792691766,
              name: "Cantabria",
              code: "S",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138216502,
              country_id: 166792691766,
              name: "Castellón",
              code: "CS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138249270,
              country_id: 166792691766,
              name: "Ceuta",
              code: "CE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138282038,
              country_id: 166792691766,
              name: "Ciudad Real",
              code: "CR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138314806,
              country_id: 166792691766,
              name: "Córdoba",
              code: "CO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138347574,
              country_id: 166792691766,
              name: "Cuenca",
              code: "CU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138380342,
              country_id: 166792691766,
              name: "Girona",
              code: "GI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138413110,
              country_id: 166792691766,
              name: "Granada",
              code: "GR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138445878,
              country_id: 166792691766,
              name: "Guadalajara",
              code: "GU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138478646,
              country_id: 166792691766,
              name: "Guipúzcoa",
              code: "SS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138511414,
              country_id: 166792691766,
              name: "Huelva",
              code: "H",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138544182,
              country_id: 166792691766,
              name: "Huesca",
              code: "HU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138576950,
              country_id: 166792691766,
              name: "Jaén",
              code: "J",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138609718,
              country_id: 166792691766,
              name: "La Rioja",
              code: "LO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138642486,
              country_id: 166792691766,
              name: "Las Palmas",
              code: "GC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138675254,
              country_id: 166792691766,
              name: "León",
              code: "LE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138708022,
              country_id: 166792691766,
              name: "Lleida",
              code: "L",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138740790,
              country_id: 166792691766,
              name: "Lugo",
              code: "LU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138773558,
              country_id: 166792691766,
              name: "Madrid",
              code: "M",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138806326,
              country_id: 166792691766,
              name: "Málaga",
              code: "MA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138839094,
              country_id: 166792691766,
              name: "Melilla",
              code: "ML",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138871862,
              country_id: 166792691766,
              name: "Murcia",
              code: "MU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138904630,
              country_id: 166792691766,
              name: "Navarra",
              code: "NA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138937398,
              country_id: 166792691766,
              name: "Ourense",
              code: "OR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830138970166,
              country_id: 166792691766,
              name: "Palencia",
              code: "P",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139002934,
              country_id: 166792691766,
              name: "Pontevedra",
              code: "PO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139035702,
              country_id: 166792691766,
              name: "Salamanca",
              code: "SA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139068470,
              country_id: 166792691766,
              name: "Santa Cruz de Tenerife",
              code: "TF",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139101238,
              country_id: 166792691766,
              name: "Segovia",
              code: "SG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139134006,
              country_id: 166792691766,
              name: "Sevilla",
              code: "SE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139166774,
              country_id: 166792691766,
              name: "Soria",
              code: "SO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139199542,
              country_id: 166792691766,
              name: "Tarragona",
              code: "T",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139232310,
              country_id: 166792691766,
              name: "Teruel",
              code: "TE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139265078,
              country_id: 166792691766,
              name: "Toledo",
              code: "TO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139297846,
              country_id: 166792691766,
              name: "Valencia",
              code: "V",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139330614,
              country_id: 166792691766,
              name: "Valladolid",
              code: "VA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139363382,
              country_id: 166792691766,
              name: "Vizcaya",
              code: "BI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139396150,
              country_id: 166792691766,
              name: "Zamora",
              code: "ZA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1830139428918,
              country_id: 166792691766,
              name: "Zaragoza",
              code: "Z",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            }
          ]
        },
        {
          id: 179672612918,
          name: "Czech Republic",
          tax: 0.21,
          code: "CZ",
          tax_name: "CZ VAT",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 174655733814,
          name: "Austria",
          tax: 0.21,
          code: "AT",
          tax_name: "AT VAT",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 215061233718,
          name: "Greece",
          tax: 0.21,
          code: "GR",
          tax_name: "GR VAT",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 244483620918,
          name: "Lithuania",
          tax: 0.0,
          code: "LT",
          tax_name: "LT VAT",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 178820907062,
          name: "Portugal",
          tax: 0.21,
          code: "PT",
          tax_name: "PT VAT",
          shipping_zone_id: 14727708709,
          provinces: [
            {
              id: 1965263028278,
              country_id: 178820907062,
              name: "Açores",
              code: "PT-20",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263061046,
              country_id: 178820907062,
              name: "Aveiro",
              code: "PT-01",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263093814,
              country_id: 178820907062,
              name: "Beja",
              code: "PT-02",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263126582,
              country_id: 178820907062,
              name: "Braga",
              code: "PT-03",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263159350,
              country_id: 178820907062,
              name: "Bragança",
              code: "PT-04",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263192118,
              country_id: 178820907062,
              name: "Castelo Branco",
              code: "PT-05",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263224886,
              country_id: 178820907062,
              name: "Coimbra",
              code: "PT-06",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263257654,
              country_id: 178820907062,
              name: "Évora",
              code: "PT-07",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263290422,
              country_id: 178820907062,
              name: "Faro",
              code: "PT-08",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263323190,
              country_id: 178820907062,
              name: "Guarda",
              code: "PT-09",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263355958,
              country_id: 178820907062,
              name: "Leiria",
              code: "PT-10",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263388726,
              country_id: 178820907062,
              name: "Lisboa",
              code: "PT-11",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263421494,
              country_id: 178820907062,
              name: "Madeira",
              code: "PT-30",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263454262,
              country_id: 178820907062,
              name: "Portalegre",
              code: "PT-12",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263487030,
              country_id: 178820907062,
              name: "Porto",
              code: "PT-13",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263519798,
              country_id: 178820907062,
              name: "Santarém",
              code: "PT-14",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263552566,
              country_id: 178820907062,
              name: "Setúbal",
              code: "PT-15",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263585334,
              country_id: 178820907062,
              name: "Viana do Castelo",
              code: "PT-16",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263618102,
              country_id: 178820907062,
              name: "Vila Real",
              code: "PT-17",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 1965263650870,
              country_id: 178820907062,
              name: "Viseu",
              code: "PT-18",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            }
          ]
        },
        {
          id: 32095666213,
          name: "United Kingdom",
          tax: 0.21,
          code: "GB",
          tax_name: "GB VAT",
          shipping_zone_id: 14727708709,
          provinces: [
            {
              id: 4098667348022,
              country_id: 32095666213,
              name: "British Forces",
              code: "BFP",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 4098667380790,
              country_id: 32095666213,
              name: "England",
              code: "ENG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 4098667413558,
              country_id: 32095666213,
              name: "Northern Ireland",
              code: "NIR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 4098667446326,
              country_id: 32095666213,
              name: "Scotland",
              code: "SCT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            },
            {
              id: 4098667479094,
              country_id: 32095666213,
              name: "Wales",
              code: "WLS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 14727708709
            }
          ]
        },
        {
          id: 244483653686,
          name: "Sweden",
          tax: 0.0,
          code: "SE",
          tax_name: "SE Moms",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 403213058102,
          name: "Hungary",
          tax: 0.0,
          code: "HU",
          tax_name: "HU VAT",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 175080996918,
          name: "Denmark",
          tax: 0.0,
          code: "DK",
          tax_name: "DK Moms",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 403259850806,
          name: "Armenia",
          tax: 0.0,
          code: "AM",
          tax_name: "VAT",
          shipping_zone_id: 14727708709,
          provinces: []
        },
        {
          id: 403259883574,
          name: "Moldova, Republic of",
          tax: 0.0,
          code: "MD",
          tax_name: "VAT",
          shipping_zone_id: 14727708709,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 89525452854,
          name: "Бесплатная доставка Post NL с трекинг номером",
          price: "0.00",
          shipping_zone_id: 14727708709,
          min_order_subtotal: "140.0",
          max_order_subtotal: null
        },
        {
          id: 89525485622,
          name: "Post NL с трекинг номером",
          price: "9.00",
          shipping_zone_id: 14727708709,
          min_order_subtotal: "0.0",
          max_order_subtotal: "140.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 14792884261,
      name: "10 euro_",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/50030641206",
      countries: [
        {
          id: 193218707510,
          name: "Poland",
          tax: 0.21,
          code: "PL",
          tax_name: "PL VAT",
          shipping_zone_id: 14792884261,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 89525551158,
          name: "Бесплатная доставка PostNL с трекинг номером",
          price: "0.00",
          shipping_zone_id: 14792884261,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        },
        {
          id: 89525583926,
          name: "PostNL с трекинг номером",
          price: "10.00",
          shipping_zone_id: 14792884261,
          min_order_subtotal: "0.0",
          max_order_subtotal: "150.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 107302977590,
      name: "Russia_1",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/50030706742",
      countries: [
        {
          id: 189538009142,
          name: "Russia",
          tax: 0.0,
          code: "RU",
          tax_name: "VAT",
          shipping_zone_id: 107302977590,
          provinces: [
            {
              id: 2080025182262,
              country_id: 189538009142,
              name: "Astrakhan Oblast",
              code: "AST",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025247798,
              country_id: 189538009142,
              name: "Belgorod Oblast",
              code: "BEL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025280566,
              country_id: 189538009142,
              name: "Bryansk Oblast",
              code: "BRY",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025378870,
              country_id: 189538009142,
              name: "Chelyabinsk Oblast",
              code: "CHE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025444406,
              country_id: 189538009142,
              name: "Chuvash Republic",
              code: "CU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025575478,
              country_id: 189538009142,
              name: "Ivanovo Oblast",
              code: "IVA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025641014,
              country_id: 189538009142,
              name: "Kabardino-Balkarian Republic",
              code: "KB",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025673782,
              country_id: 189538009142,
              name: "Kaliningrad Oblast",
              code: "KGD",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025739318,
              country_id: 189538009142,
              name: "Kaluga Oblast",
              code: "KLU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025804854,
              country_id: 189538009142,
              name: "Karachay–Cherkess Republic",
              code: "KC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026001462,
              country_id: 189538009142,
              name: "Kirov Oblast",
              code: "KIR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026066998,
              country_id: 189538009142,
              name: "Kostroma Oblast",
              code: "KOS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026099766,
              country_id: 189538009142,
              name: "Krasnodar Krai",
              code: "KDA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026198070,
              country_id: 189538009142,
              name: "Kursk Oblast",
              code: "KRS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026230838,
              country_id: 189538009142,
              name: "Leningrad Oblast",
              code: "LEN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026263606,
              country_id: 189538009142,
              name: "Lipetsk Oblast",
              code: "LIP",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026329142,
              country_id: 189538009142,
              name: "Mari El Republic",
              code: "ME",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026394678,
              country_id: 189538009142,
              name: "Moscow",
              code: "MOW",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026427446,
              country_id: 189538009142,
              name: "Moscow Oblast",
              code: "MOS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026460214,
              country_id: 189538009142,
              name: "Murmansk Oblast",
              code: "MUR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026492982,
              country_id: 189538009142,
              name: "Nizhny Novgorod Oblast",
              code: "NIZ",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026525750,
              country_id: 189538009142,
              name: "Novgorod Oblast",
              code: "NGR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026624054,
              country_id: 189538009142,
              name: "Orenburg Oblast",
              code: "ORE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026656822,
              country_id: 189538009142,
              name: "Oryol Oblast",
              code: "ORL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026689590,
              country_id: 189538009142,
              name: "Penza Oblast",
              code: "PNZ",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026787894,
              country_id: 189538009142,
              name: "Pskov Oblast",
              code: "PSK",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025018422,
              country_id: 189538009142,
              name: "Republic of Adygeya",
              code: "AD",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025706550,
              country_id: 189538009142,
              name: "Republic of Kalmykia",
              code: "KL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080025837622,
              country_id: 189538009142,
              name: "Republic of Karelia",
              code: "KR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026361910,
              country_id: 189538009142,
              name: "Republic of Mordovia",
              code: "MO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027213878,
              country_id: 189538009142,
              name: "Republic of Tatarstan",
              code: "TA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026853430,
              country_id: 189538009142,
              name: "Ryazan Oblast",
              code: "RYA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026886198,
              country_id: 189538009142,
              name: "Saint Petersburg",
              code: "SPE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080026984502,
              country_id: 189538009142,
              name: "Samara Oblast",
              code: "SAM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027017270,
              country_id: 189538009142,
              name: "Saratov Oblast",
              code: "SAR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027082806,
              country_id: 189538009142,
              name: "Smolensk Oblast",
              code: "SMO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027115574,
              country_id: 189538009142,
              name: "Stavropol Krai",
              code: "STA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027148342,
              country_id: 189538009142,
              name: "Sverdlovsk Oblast",
              code: "SVE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027181110,
              country_id: 189538009142,
              name: "Tambov Oblast",
              code: "TAM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027279414,
              country_id: 189538009142,
              name: "Tula Oblast",
              code: "TUL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027312182,
              country_id: 189538009142,
              name: "Tver Oblast",
              code: "TVE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027344950,
              country_id: 189538009142,
              name: "Tyumen Oblast",
              code: "TYU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027410486,
              country_id: 189538009142,
              name: "Udmurtia",
              code: "UD",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027443254,
              country_id: 189538009142,
              name: "Ulyanovsk Oblast",
              code: "ULY",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027476022,
              country_id: 189538009142,
              name: "Vladimir Oblast",
              code: "VLA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027508790,
              country_id: 189538009142,
              name: "Volgograd Oblast",
              code: "VGG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027541558,
              country_id: 189538009142,
              name: "Vologda Oblast",
              code: "VLG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027574326,
              country_id: 189538009142,
              name: "Voronezh Oblast",
              code: "VOR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            },
            {
              id: 2080027639862,
              country_id: 189538009142,
              name: "Yaroslavl Oblast",
              code: "YAR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 107302977590
            }
          ]
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 89525878838,
          name:
            "доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)",
          price: "0.00",
          shipping_zone_id: 107302977590,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        },
        {
          id: 89525944374,
          name:
            "доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)",
          price: "6.00",
          shipping_zone_id: 107302977590,
          min_order_subtotal: "0.0",
          max_order_subtotal: "150.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 107510464566,
      name: "Belarus",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/50030936118",
      countries: [
        {
          id: 189969334326,
          name: "Belarus",
          tax: 0.0,
          code: "BY",
          tax_name: "VAT",
          shipping_zone_id: 107510464566,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 89526075446,
          name: "Бесплатная доставка курьером или почтовой службой",
          price: "0.00",
          shipping_zone_id: 107510464566,
          min_order_subtotal: "60.0",
          max_order_subtotal: null
        },
        {
          id: 89526108214,
          name: "Доставка курьером или почтовой службой",
          price: "3.00",
          shipping_zone_id: 107510464566,
          min_order_subtotal: "0.0",
          max_order_subtotal: "60.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 94957928502,
      name: "russia 13",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/94957928502",
      countries: [
        {
          id: 189538009142,
          name: "Russia",
          tax: 0.0,
          code: "RU",
          tax_name: "VAT",
          shipping_zone_id: 94957928502,
          provinces: [
            {
              id: 2080025608246,
              country_id: 189538009142,
              name: "Jewish Autonomous Oblast",
              code: "YEV",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025903158,
              country_id: 189538009142,
              name: "Khabarovsk Krai",
              code: "KHA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025968694,
              country_id: 189538009142,
              name: "Khanty-Mansi Autonomous Okrug",
              code: "KHM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080026132534,
              country_id: 189538009142,
              name: "Krasnoyarsk Krai",
              code: "KYA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025313334,
              country_id: 189538009142,
              name: "Republic of Buryatia",
              code: "BU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025477174,
              country_id: 189538009142,
              name: "Republic of Dagestan",
              code: "DA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025509942,
              country_id: 189538009142,
              name: "Republic of Ingushetia",
              code: "IN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025935926,
              country_id: 189538009142,
              name: "Republic of Khakassia",
              code: "KK",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080027050038,
              country_id: 189538009142,
              name: "Republic of North Ossetia–Alania",
              code: "SE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080026951734,
              country_id: 189538009142,
              name: "Sakhalin Oblast",
              code: "SAK",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080027377718,
              country_id: 189538009142,
              name: "Tyva Republic",
              code: "TY",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080027672630,
              country_id: 189538009142,
              name: "Zabaykalsky Krai",
              code: "ZAB",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025083958,
              country_id: 189538009142,
              name: "Altai Krai",
              code: "ALT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025149494,
              country_id: 189538009142,
              name: "Arkhangelsk Oblast",
              code: "ARK",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025346102,
              country_id: 189538009142,
              name: "Chechen Republic",
              code: "CE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025542710,
              country_id: 189538009142,
              name: "Irkutsk Oblast",
              code: "IRK",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            },
            {
              id: 2080025870390,
              country_id: 189538009142,
              name: "Kemerovo Oblast",
              code: "KEM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957928502
            }
          ]
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 170498392118,
          name:
            "доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)",
          price: "13.00",
          shipping_zone_id: 94957928502,
          min_order_subtotal: "0.0",
          max_order_subtotal: "150.0"
        },
        {
          id: 170498424886,
          name: "Бесплатная доставка курьером или почтовой службой",
          price: "0.00",
          shipping_zone_id: 94957928502,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 94957961270,
      name: "russia 20",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/94957961270",
      countries: [
        {
          id: 189538009142,
          name: "Russia",
          tax: 0.0,
          code: "RU",
          tax_name: "VAT",
          shipping_zone_id: 94957961270,
          provinces: [
            {
              id: 2080025116726,
              country_id: 189538009142,
              name: "Amur Oblast",
              code: "AMU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            },
            {
              id: 2080025411638,
              country_id: 189538009142,
              name: "Chukotka Autonomous Okrug",
              code: "CHU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            },
            {
              id: 2080025772086,
              country_id: 189538009142,
              name: "Kamchatka Krai",
              code: "KAM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            },
            {
              id: 2080026034230,
              country_id: 189538009142,
              name: "Komi Republic",
              code: "KO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            },
            {
              id: 2080026296374,
              country_id: 189538009142,
              name: "Magadan Oblast",
              code: "MAG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            },
            {
              id: 2080025215030,
              country_id: 189538009142,
              name: "Republic of Bashkortostan",
              code: "BA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            },
            {
              id: 2080026918966,
              country_id: 189538009142,
              name: "Sakha Republic (Yakutia)",
              code: "SA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            },
            {
              id: 2080027607094,
              country_id: 189538009142,
              name: "Yamalo-Nenets Autonomous Okrug",
              code: "YAN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957961270
            }
          ]
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 170498457654,
          name:
            "доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)",
          price: "20.00",
          shipping_zone_id: 94957961270,
          min_order_subtotal: "0.0",
          max_order_subtotal: "170.0"
        },
        {
          id: 170498490422,
          name: "Бесплатная доставка PostNL с трекинг номером",
          price: "0.00",
          shipping_zone_id: 94957961270,
          min_order_subtotal: "170.0",
          max_order_subtotal: null
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 94957994038,
      name: "russia 10",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/94957994038",
      countries: [
        {
          id: 189538009142,
          name: "Russia",
          tax: 0.0,
          code: "RU",
          tax_name: "VAT",
          shipping_zone_id: 94957994038,
          provinces: [
            {
              id: 2080025051190,
              country_id: 189538009142,
              name: "Altai Republic",
              code: "AL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            },
            {
              id: 2080026165302,
              country_id: 189538009142,
              name: "Kurgan Oblast",
              code: "KGN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            },
            {
              id: 2080026558518,
              country_id: 189538009142,
              name: "Novosibirsk Oblast",
              code: "NVS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            },
            {
              id: 2080026591286,
              country_id: 189538009142,
              name: "Omsk Oblast",
              code: "OMS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            },
            {
              id: 2080026722358,
              country_id: 189538009142,
              name: "Perm Krai",
              code: "PER",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            },
            {
              id: 2080026755126,
              country_id: 189538009142,
              name: "Primorsky Krai",
              code: "PRI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            },
            {
              id: 2080026820662,
              country_id: 189538009142,
              name: "Rostov Oblast",
              code: "ROS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            },
            {
              id: 2080027246646,
              country_id: 189538009142,
              name: "Tomsk Oblast",
              code: "TOM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 94957994038
            }
          ]
        },
        {
          id: 233537044534,
          name: "Kazakhstan",
          tax: 0.0,
          code: "KZ",
          tax_name: "VAT",
          shipping_zone_id: 94957994038,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 170498523190,
          name:
            "доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)",
          price: "10.00",
          shipping_zone_id: 94957994038,
          min_order_subtotal: null,
          max_order_subtotal: "150.0"
        },
        {
          id: 170498555958,
          name: "Бесплатная доставка PostNL с трекинг номером",
          price: "0.00",
          shipping_zone_id: 94957994038,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 95451578422,
      name: "Ukraine",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/95451578422",
      countries: [
        {
          id: 234738417718,
          name: "Ukraine",
          tax: 0.0,
          code: "UA",
          tax_name: "PDV",
          shipping_zone_id: 95451578422,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 171261427766,
          name: "адресная доставка курьером Нова Пошта (2-4 дня)",
          price: "3.00",
          shipping_zone_id: 95451578422,
          min_order_subtotal: null,
          max_order_subtotal: "150.0"
        },
        {
          id: 171261755446,
          name: "бесплатная доставка Нова Пошта (2-4 дня)",
          price: "0.00",
          shipping_zone_id: 95451578422,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        },
        {
          id: 363893194806,
          name:
            "доставка до отделения Нова Пошта (2-4 дня, укажите адрес отделения Новой Почты в строке «адрес»)",
          price: "2.00",
          shipping_zone_id: 95451578422,
          min_order_subtotal: null,
          max_order_subtotal: "150.0"
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 104008286262,
      name: "12 euro_",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/104008286262",
      countries: [
        {
          id: 166558629942,
          name: "Canada",
          tax: 0.0,
          code: "CA",
          tax_name: "GST",
          shipping_zone_id: 104008286262,
          provinces: [
            {
              id: 1828879302710,
              country_id: 166558629942,
              name: "Alberta",
              code: "AB",
              tax: 0.0,
              tax_name: "PST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879335478,
              country_id: 166558629942,
              name: "British Columbia",
              code: "BC",
              tax: 0.0,
              tax_name: "PST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879368246,
              country_id: 166558629942,
              name: "Manitoba",
              code: "MB",
              tax: 0.0,
              tax_name: "PST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879401014,
              country_id: 166558629942,
              name: "New Brunswick",
              code: "NB",
              tax: 0.0,
              tax_name: "HST",
              tax_type: "harmonized",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879433782,
              country_id: 166558629942,
              name: "Newfoundland",
              code: "NL",
              tax: 0.0,
              tax_name: "HST",
              tax_type: "harmonized",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879466550,
              country_id: 166558629942,
              name: "Northwest Territories",
              code: "NT",
              tax: 0.0,
              tax_name: "Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879499318,
              country_id: 166558629942,
              name: "Nova Scotia",
              code: "NS",
              tax: 0.0,
              tax_name: "HST",
              tax_type: "harmonized",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879532086,
              country_id: 166558629942,
              name: "Nunavut",
              code: "NU",
              tax: 0.0,
              tax_name: "Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879564854,
              country_id: 166558629942,
              name: "Ontario",
              code: "ON",
              tax: 0.0,
              tax_name: "HST",
              tax_type: "harmonized",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879597622,
              country_id: 166558629942,
              name: "Prince Edward Island",
              code: "PE",
              tax: 0.0,
              tax_name: "HST",
              tax_type: "harmonized",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879630390,
              country_id: 166558629942,
              name: "Quebec",
              code: "QC",
              tax: 0.0,
              tax_name: "QST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879663158,
              country_id: 166558629942,
              name: "Saskatchewan",
              code: "SK",
              tax: 0.0,
              tax_name: "PST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1828879695926,
              country_id: 166558629942,
              name: "Yukon",
              code: "YT",
              tax: 0.0,
              tax_name: "Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            }
          ]
        },
        {
          id: 244483719222,
          name: "Israel",
          tax: 0.0,
          code: "IL",
          tax_name: "VAT",
          shipping_zone_id: 104008286262,
          provinces: []
        },
        {
          id: 244483751990,
          name: "United States",
          tax: 0.0,
          code: "US",
          tax_name: "Federal Tax",
          shipping_zone_id: 104008286262,
          provinces: [
            {
              id: 2639326904374,
              country_id: 244483751990,
              name: "Alabama",
              code: "AL",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639326937142,
              country_id: 244483751990,
              name: "Alaska",
              code: "AK",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639326969910,
              country_id: 244483751990,
              name: "American Samoa",
              code: "AS",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327002678,
              country_id: 244483751990,
              name: "Arizona",
              code: "AZ",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327035446,
              country_id: 244483751990,
              name: "Arkansas",
              code: "AR",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327068214,
              country_id: 244483751990,
              name: "California",
              code: "CA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327100982,
              country_id: 244483751990,
              name: "Colorado",
              code: "CO",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327133750,
              country_id: 244483751990,
              name: "Connecticut",
              code: "CT",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327166518,
              country_id: 244483751990,
              name: "Delaware",
              code: "DE",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327199286,
              country_id: 244483751990,
              name: "District of Columbia",
              code: "DC",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327232054,
              country_id: 244483751990,
              name: "Federated States of Micronesia",
              code: "FM",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327264822,
              country_id: 244483751990,
              name: "Florida",
              code: "FL",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327297590,
              country_id: 244483751990,
              name: "Georgia",
              code: "GA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327330358,
              country_id: 244483751990,
              name: "Guam",
              code: "GU",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327363126,
              country_id: 244483751990,
              name: "Hawaii",
              code: "HI",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327395894,
              country_id: 244483751990,
              name: "Idaho",
              code: "ID",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327428662,
              country_id: 244483751990,
              name: "Illinois",
              code: "IL",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327461430,
              country_id: 244483751990,
              name: "Indiana",
              code: "IN",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327494198,
              country_id: 244483751990,
              name: "Iowa",
              code: "IA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327526966,
              country_id: 244483751990,
              name: "Kansas",
              code: "KS",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327559734,
              country_id: 244483751990,
              name: "Kentucky",
              code: "KY",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327592502,
              country_id: 244483751990,
              name: "Louisiana",
              code: "LA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327625270,
              country_id: 244483751990,
              name: "Maine",
              code: "ME",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327658038,
              country_id: 244483751990,
              name: "Marshall Islands",
              code: "MH",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327690806,
              country_id: 244483751990,
              name: "Maryland",
              code: "MD",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327723574,
              country_id: 244483751990,
              name: "Massachusetts",
              code: "MA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327756342,
              country_id: 244483751990,
              name: "Michigan",
              code: "MI",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327789110,
              country_id: 244483751990,
              name: "Minnesota",
              code: "MN",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327821878,
              country_id: 244483751990,
              name: "Mississippi",
              code: "MS",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327854646,
              country_id: 244483751990,
              name: "Missouri",
              code: "MO",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327887414,
              country_id: 244483751990,
              name: "Montana",
              code: "MT",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327920182,
              country_id: 244483751990,
              name: "Nebraska",
              code: "NE",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327952950,
              country_id: 244483751990,
              name: "Nevada",
              code: "NV",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639327985718,
              country_id: 244483751990,
              name: "New Hampshire",
              code: "NH",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328018486,
              country_id: 244483751990,
              name: "New Jersey",
              code: "NJ",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328051254,
              country_id: 244483751990,
              name: "New Mexico",
              code: "NM",
              tax: 0.0,
              tax_name: "GRT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328084022,
              country_id: 244483751990,
              name: "New York",
              code: "NY",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328116790,
              country_id: 244483751990,
              name: "North Carolina",
              code: "NC",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328149558,
              country_id: 244483751990,
              name: "North Dakota",
              code: "ND",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328182326,
              country_id: 244483751990,
              name: "Northern Mariana Islands",
              code: "MP",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328215094,
              country_id: 244483751990,
              name: "Ohio",
              code: "OH",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328247862,
              country_id: 244483751990,
              name: "Oklahoma",
              code: "OK",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328280630,
              country_id: 244483751990,
              name: "Oregon",
              code: "OR",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328313398,
              country_id: 244483751990,
              name: "Palau",
              code: "PW",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328346166,
              country_id: 244483751990,
              name: "Pennsylvania",
              code: "PA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328378934,
              country_id: 244483751990,
              name: "Puerto Rico",
              code: "PR",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328411702,
              country_id: 244483751990,
              name: "Rhode Island",
              code: "RI",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328444470,
              country_id: 244483751990,
              name: "South Carolina",
              code: "SC",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328477238,
              country_id: 244483751990,
              name: "South Dakota",
              code: "SD",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328510006,
              country_id: 244483751990,
              name: "Tennessee",
              code: "TN",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328542774,
              country_id: 244483751990,
              name: "Texas",
              code: "TX",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328575542,
              country_id: 244483751990,
              name: "Utah",
              code: "UT",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328608310,
              country_id: 244483751990,
              name: "Vermont",
              code: "VT",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328641078,
              country_id: 244483751990,
              name: "Virgin Islands",
              code: "VI",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328673846,
              country_id: 244483751990,
              name: "Virginia",
              code: "VA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328706614,
              country_id: 244483751990,
              name: "Washington",
              code: "WA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328739382,
              country_id: 244483751990,
              name: "West Virginia",
              code: "WV",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328772150,
              country_id: 244483751990,
              name: "Wisconsin",
              code: "WI",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328804918,
              country_id: 244483751990,
              name: "Wyoming",
              code: "WY",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328837686,
              country_id: 244483751990,
              name: "Armed Forces Americas",
              code: "AA",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328870454,
              country_id: 244483751990,
              name: "Armed Forces Europe",
              code: "AE",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 2639328903222,
              country_id: 244483751990,
              name: "Armed Forces Pacific",
              code: "AP",
              tax: 0.0,
              tax_name: "State Tax",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            }
          ]
        },
        {
          id: 215061168182,
          name: "Cyprus",
          tax: 0.21,
          code: "CY",
          tax_name: "CY VAT",
          shipping_zone_id: 104008286262,
          provinces: []
        },
        {
          id: 178605424694,
          name: "Italy",
          tax: 0.21,
          code: "IT",
          tax_name: "IT IVA",
          shipping_zone_id: 104008286262,
          provinces: [
            {
              id: 1962705780790,
              country_id: 178605424694,
              name: "Agrigento",
              code: "AG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962705813558,
              country_id: 178605424694,
              name: "Alessandria",
              code: "AL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962705846326,
              country_id: 178605424694,
              name: "Ancona",
              code: "AN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962705879094,
              country_id: 178605424694,
              name: "Aosta",
              code: "AO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962705911862,
              country_id: 178605424694,
              name: "Arezzo",
              code: "AR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962705944630,
              country_id: 178605424694,
              name: "Ascoli Piceno",
              code: "AP",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962705977398,
              country_id: 178605424694,
              name: "Asti",
              code: "AT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706010166,
              country_id: 178605424694,
              name: "Avellino",
              code: "AV",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706042934,
              country_id: 178605424694,
              name: "Bari",
              code: "BA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706075702,
              country_id: 178605424694,
              name: "Barletta-Andria-Trani",
              code: "BT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706108470,
              country_id: 178605424694,
              name: "Belluno",
              code: "BL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706141238,
              country_id: 178605424694,
              name: "Benevento",
              code: "BN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706174006,
              country_id: 178605424694,
              name: "Bergamo",
              code: "BG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706206774,
              country_id: 178605424694,
              name: "Biella",
              code: "BI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706239542,
              country_id: 178605424694,
              name: "Bologna",
              code: "BO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706272310,
              country_id: 178605424694,
              name: "Bolzano",
              code: "BZ",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706305078,
              country_id: 178605424694,
              name: "Brescia",
              code: "BS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706337846,
              country_id: 178605424694,
              name: "Brindisi",
              code: "BR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706370614,
              country_id: 178605424694,
              name: "Cagliari",
              code: "CA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706403382,
              country_id: 178605424694,
              name: "Caltanissetta",
              code: "CL",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706436150,
              country_id: 178605424694,
              name: "Campobasso",
              code: "CB",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706468918,
              country_id: 178605424694,
              name: "Carbonia-Iglesias",
              code: "CI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706501686,
              country_id: 178605424694,
              name: "Caserta",
              code: "CE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706534454,
              country_id: 178605424694,
              name: "Catania",
              code: "CT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706567222,
              country_id: 178605424694,
              name: "Catanzaro",
              code: "CZ",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706599990,
              country_id: 178605424694,
              name: "Chieti",
              code: "CH",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706632758,
              country_id: 178605424694,
              name: "Como",
              code: "CO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706665526,
              country_id: 178605424694,
              name: "Cosenza",
              code: "CS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706698294,
              country_id: 178605424694,
              name: "Cremona",
              code: "CR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706731062,
              country_id: 178605424694,
              name: "Crotone",
              code: "KR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706763830,
              country_id: 178605424694,
              name: "Cuneo",
              code: "CN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706796598,
              country_id: 178605424694,
              name: "Enna",
              code: "EN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706829366,
              country_id: 178605424694,
              name: "Fermo",
              code: "FM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706862134,
              country_id: 178605424694,
              name: "Ferrara",
              code: "FE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706894902,
              country_id: 178605424694,
              name: "Firenze",
              code: "FI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706927670,
              country_id: 178605424694,
              name: "Foggia",
              code: "FG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706960438,
              country_id: 178605424694,
              name: "Forlì-Cesena",
              code: "FC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962706993206,
              country_id: 178605424694,
              name: "Frosinone",
              code: "FR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707025974,
              country_id: 178605424694,
              name: "Genova",
              code: "GE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707058742,
              country_id: 178605424694,
              name: "Gorizia",
              code: "GO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707091510,
              country_id: 178605424694,
              name: "Grosseto",
              code: "GR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707124278,
              country_id: 178605424694,
              name: "Imperia",
              code: "IM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707157046,
              country_id: 178605424694,
              name: "Isernia",
              code: "IS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707189814,
              country_id: 178605424694,
              name: "L'Aquila",
              code: "AQ",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707222582,
              country_id: 178605424694,
              name: "La Spezia",
              code: "SP",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707255350,
              country_id: 178605424694,
              name: "Latina",
              code: "LT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707288118,
              country_id: 178605424694,
              name: "Lecce",
              code: "LE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707320886,
              country_id: 178605424694,
              name: "Lecco",
              code: "LC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707353654,
              country_id: 178605424694,
              name: "Livorno",
              code: "LI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707386422,
              country_id: 178605424694,
              name: "Lodi",
              code: "LO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707419190,
              country_id: 178605424694,
              name: "Lucca",
              code: "LU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707451958,
              country_id: 178605424694,
              name: "Macerata",
              code: "MC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707484726,
              country_id: 178605424694,
              name: "Mantova",
              code: "MN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707517494,
              country_id: 178605424694,
              name: "Massa-Carrara",
              code: "MS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707550262,
              country_id: 178605424694,
              name: "Matera",
              code: "MT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707583030,
              country_id: 178605424694,
              name: "Medio Campidano",
              code: "VS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707615798,
              country_id: 178605424694,
              name: "Messina",
              code: "ME",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707648566,
              country_id: 178605424694,
              name: "Milano",
              code: "MI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707681334,
              country_id: 178605424694,
              name: "Modena",
              code: "MO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707714102,
              country_id: 178605424694,
              name: "Monza e Brianza",
              code: "MB",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707746870,
              country_id: 178605424694,
              name: "Napoli",
              code: "NA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707779638,
              country_id: 178605424694,
              name: "Novara",
              code: "NO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707812406,
              country_id: 178605424694,
              name: "Nuoro",
              code: "NU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707845174,
              country_id: 178605424694,
              name: "Ogliastra",
              code: "OG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707877942,
              country_id: 178605424694,
              name: "Olbia-Tempio",
              code: "OT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707910710,
              country_id: 178605424694,
              name: "Oristano",
              code: "OR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707943478,
              country_id: 178605424694,
              name: "Padova",
              code: "PD",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962707976246,
              country_id: 178605424694,
              name: "Palermo",
              code: "PA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708009014,
              country_id: 178605424694,
              name: "Parma",
              code: "PR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708041782,
              country_id: 178605424694,
              name: "Pavia",
              code: "PV",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708074550,
              country_id: 178605424694,
              name: "Perugia",
              code: "PG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708107318,
              country_id: 178605424694,
              name: "Pesaro e Urbino",
              code: "PU",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708140086,
              country_id: 178605424694,
              name: "Pescara",
              code: "PE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708172854,
              country_id: 178605424694,
              name: "Piacenza",
              code: "PC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708205622,
              country_id: 178605424694,
              name: "Pisa",
              code: "PI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708238390,
              country_id: 178605424694,
              name: "Pistoia",
              code: "PT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708271158,
              country_id: 178605424694,
              name: "Pordenone",
              code: "PN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708303926,
              country_id: 178605424694,
              name: "Potenza",
              code: "PZ",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708336694,
              country_id: 178605424694,
              name: "Prato",
              code: "PO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708369462,
              country_id: 178605424694,
              name: "Ragusa",
              code: "RG",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708402230,
              country_id: 178605424694,
              name: "Ravenna",
              code: "RA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708434998,
              country_id: 178605424694,
              name: "Reggio Calabria",
              code: "RC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708467766,
              country_id: 178605424694,
              name: "Reggio Emilia",
              code: "RE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708500534,
              country_id: 178605424694,
              name: "Rieti",
              code: "RI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708533302,
              country_id: 178605424694,
              name: "Rimini",
              code: "RN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708566070,
              country_id: 178605424694,
              name: "Roma",
              code: "RM",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708598838,
              country_id: 178605424694,
              name: "Rovigo",
              code: "RO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708631606,
              country_id: 178605424694,
              name: "Salerno",
              code: "SA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708664374,
              country_id: 178605424694,
              name: "Sassari",
              code: "SS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708697142,
              country_id: 178605424694,
              name: "Savona",
              code: "SV",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708729910,
              country_id: 178605424694,
              name: "Siena",
              code: "SI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708762678,
              country_id: 178605424694,
              name: "Siracusa",
              code: "SR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708795446,
              country_id: 178605424694,
              name: "Sondrio",
              code: "SO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708828214,
              country_id: 178605424694,
              name: "Taranto",
              code: "TA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708860982,
              country_id: 178605424694,
              name: "Teramo",
              code: "TE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708893750,
              country_id: 178605424694,
              name: "Terni",
              code: "TR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708926518,
              country_id: 178605424694,
              name: "Torino",
              code: "TO",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708959286,
              country_id: 178605424694,
              name: "Trapani",
              code: "TP",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962708992054,
              country_id: 178605424694,
              name: "Trento",
              code: "TN",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709024822,
              country_id: 178605424694,
              name: "Treviso",
              code: "TV",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709057590,
              country_id: 178605424694,
              name: "Trieste",
              code: "TS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709090358,
              country_id: 178605424694,
              name: "Udine",
              code: "UD",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709123126,
              country_id: 178605424694,
              name: "Varese",
              code: "VA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709155894,
              country_id: 178605424694,
              name: "Venezia",
              code: "VE",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709188662,
              country_id: 178605424694,
              name: "Verbano-Cusio-Ossola",
              code: "VB",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709221430,
              country_id: 178605424694,
              name: "Vercelli",
              code: "VC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709254198,
              country_id: 178605424694,
              name: "Verona",
              code: "VR",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709286966,
              country_id: 178605424694,
              name: "Vibo Valentia",
              code: "VV",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709319734,
              country_id: 178605424694,
              name: "Vicenza",
              code: "VI",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 1962709352502,
              country_id: 178605424694,
              name: "Viterbo",
              code: "VT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: "normal",
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            }
          ]
        },
        {
          id: 244483686454,
          name: "Switzerland",
          tax: 0.0,
          code: "CH",
          tax_name: "MwSt",
          shipping_zone_id: 104008286262,
          provinces: []
        },
        {
          id: 215061332022,
          name: "Slovakia",
          tax: 0.0,
          code: "SK",
          tax_name: "SK VAT",
          shipping_zone_id: 104008286262,
          provinces: []
        },
        {
          id: 215061364790,
          name: "Slovenia",
          tax: 0.21,
          code: "SI",
          tax_name: "SI VAT",
          shipping_zone_id: 104008286262,
          provinces: []
        },
        {
          id: 397957005366,
          name: "Australia",
          tax: 0.0,
          code: "AU",
          tax_name: "GST",
          shipping_zone_id: 104008286262,
          provinces: [
            {
              id: 4097319075894,
              country_id: 397957005366,
              name: "Australian Capital Territory",
              code: "ACT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319108662,
              country_id: 397957005366,
              name: "New South Wales",
              code: "NSW",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319141430,
              country_id: 397957005366,
              name: "Northern Territory",
              code: "NT",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319174198,
              country_id: 397957005366,
              name: "Queensland",
              code: "QLD",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319206966,
              country_id: 397957005366,
              name: "South Australia",
              code: "SA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319239734,
              country_id: 397957005366,
              name: "Tasmania",
              code: "TAS",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319272502,
              country_id: 397957005366,
              name: "Victoria",
              code: "VIC",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319305270,
              country_id: 397957005366,
              name: "Western Australia",
              code: "WA",
              tax: 0.0,
              tax_name: "VAT",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            }
          ]
        },
        {
          id: 397957038134,
          name: "New Zealand",
          tax: 0.0,
          code: "NZ",
          tax_name: "GST",
          shipping_zone_id: 104008286262,
          provinces: [
            {
              id: 4097319338038,
              country_id: 397957038134,
              name: "Auckland",
              code: "AUK",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319370806,
              country_id: 397957038134,
              name: "Bay of Plenty",
              code: "BOP",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319403574,
              country_id: 397957038134,
              name: "Canterbury",
              code: "CAN",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319436342,
              country_id: 397957038134,
              name: "Gisborne",
              code: "GIS",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319469110,
              country_id: 397957038134,
              name: "Hawke's Bay",
              code: "HKB",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319501878,
              country_id: 397957038134,
              name: "Manawatu-Wanganui",
              code: "MWT",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319534646,
              country_id: 397957038134,
              name: "Marlborough",
              code: "MBH",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319567414,
              country_id: 397957038134,
              name: "Nelson",
              code: "NSN",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319600182,
              country_id: 397957038134,
              name: "Northland",
              code: "NTL",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319632950,
              country_id: 397957038134,
              name: "Otago",
              code: "OTA",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319665718,
              country_id: 397957038134,
              name: "Southland",
              code: "STL",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319698486,
              country_id: 397957038134,
              name: "Taranaki",
              code: "TKI",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319731254,
              country_id: 397957038134,
              name: "Tasman",
              code: "TAS",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319764022,
              country_id: 397957038134,
              name: "Waikato",
              code: "WKO",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319796790,
              country_id: 397957038134,
              name: "Wellington",
              code: "WGN",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            },
            {
              id: 4097319829558,
              country_id: 397957038134,
              name: "West Coast",
              code: "WTC",
              tax: 0.0,
              tax_name: "GST",
              tax_type: null,
              tax_percentage: 0.0,
              shipping_zone_id: 104008286262
            }
          ]
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 184328781878,
          name: "POSTNL с трекинг номером",
          price: "12.00",
          shipping_zone_id: 104008286262,
          min_order_subtotal: "0.0",
          max_order_subtotal: "150.0"
        },
        {
          id: 184328814646,
          name: "Бесплатная доставка PostNL с трекинг номером",
          price: "0.00",
          shipping_zone_id: 104008286262,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 104476901430,
      name: "Finland",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/104476901430",
      countries: [
        {
          id: 175081095222,
          name: "Finland",
          tax: 0.0,
          code: "FI",
          tax_name: "FI ALV",
          shipping_zone_id: 104476901430,
          provinces: []
        },
        {
          id: 215061200950,
          name: "Estonia",
          tax: 0.21,
          code: "EE",
          tax_name: "EE VAT",
          shipping_zone_id: 104476901430,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 185135235126,
          name: "PostNL with tracking number",
          price: "12.00",
          shipping_zone_id: 104476901430,
          min_order_subtotal: "0.0",
          max_order_subtotal: "150.0"
        },
        {
          id: 185135267894,
          name: "PostNL with tracking number",
          price: "0.00",
          shipping_zone_id: 104476901430,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        }
      ],
      carrier_shipping_rate_providers: []
    },
    {
      id: 212729233462,
      name: "Latvia",
      profile_id: "gid://shopify/DeliveryProfile/24979111990",
      location_group_id: "gid://shopify/DeliveryLocationGroup/25157795894",
      admin_graphql_api_id: "gid://shopify/DeliveryZone/212729233462",
      countries: [
        {
          id: 215061266486,
          name: "Latvia",
          tax: 0.21,
          code: "LV",
          tax_name: "LV VAT",
          shipping_zone_id: 212729233462,
          provinces: []
        }
      ],
      weight_based_shipping_rates: [],
      price_based_shipping_rates: [
        {
          id: 363001643062,
          name: "Бесплатная доставка DPD или Omniva (2-4 раб. дня)",
          price: "0.00",
          shipping_zone_id: 212729233462,
          min_order_subtotal: "150.0",
          max_order_subtotal: null
        },
        {
          id: 363001675830,
          name: "курьерская доставка DPD или Omniva (2-4 раб дней)",
          price: "4.50",
          shipping_zone_id: 212729233462,
          min_order_subtotal: null,
          max_order_subtotal: "150.0"
        }
      ],
      carrier_shipping_rate_providers: []
    }
  ]
};
