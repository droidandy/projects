module.exports={
  "PostNL": "Delivery of goods is carried out <b>by postal service PostNL</b> from Holland with a tracking number.\n</br>Then PostNL hands over the orders to local delivery services, you can follow them by the tracking link that we will send to the email you used during the checkout.\n</br>Delivery time - <b>1-25 working days</b>.",
  "SDEK": "Delivery of goods is carried out by <b>courier service CDEK</b> with a tracking number.\n</br>Within one working day from the moment of ordering, you will receive an email with an order tracking code.\n</br>After the goods are delivered to your city, the CDEK courier will contact you to discuss the delivery time.\n</br>If CDEK cannot deliver the parcel to your home or office (for example, there is no CDEK in some small towns), the parcel will be sent by mail from the nearest CDEK office.\n</br>Delivery time - <b>up to 5 working days</b>.",
  "changeRegionLabel": "Change the region",
  "chooseCountryItemLabel": "-choose the country-",
  "chooseRegionItemLabel": "-choose the region-",
  "countryLabel": "SELECT THE COUNTRY OF DELIVERY:",
  "deliveryCostDescription": "depends on the country / area of delivery",
  "deliveryCostRange": "from {{deliveryMin}} to {{deliveryMax}}",
  "deliveryInfo": "<header class='section-header'><h2>COST OF SHIPPING</h2></header><p>{{regionDeliveryCost}}</p><header class='section-header'><h2>DELIVERY METHODS AND TERMS</h2></header><p>{{regionDeliveryMethodAndTerms}}</p><p>To see delivery terms for another region, please change the region in your settings.</p><header class='section-header'><h2>RESPONSIBILITY OF THE PARTIES</h2></header><p>The Seller will make every effort to comply with the delivery terms indicated on the Site or agreed with the Buyer after placing the order. However, not excluding the reasons that may arise and affect the delivery time in the form of unforeseen events and circumstances that occurred through no fault of the Seller.\n</br>The risk of accidental damage to the Goods passes to the Buyer or the Recipient at the time of transfer of the Goods or affixing by the Buyer or the Recipient of the Goods personal signature in the documents confirming the delivery of the Goods.\n</br>The Buyer or the Recipient at the time of receipt of the Goods receives a package of necessary documents for the Goods.\n</br>After receiving the Goods by the Buyer or the Recipient, the Seller does not accept claims for the quality and completeness of the Goods, with the exception of claims, with legal justification.\n</br>Checking the Goods must be carried out with the preservation of the initial presentation.</p>",
  "header": "Delivery Terms",
  "provinceLabel": "SELECT THE AREA OF DELIVERY:",
  "rangeCost": "от {{cost1}} до {{cost2}}",
  "regionDeliveryCost": {
    "BY": "$t(PageDelivery:regionDeliveryCost.default)",
    "EU": "$t(PageDelivery:regionDeliveryCost.default)",
    "KZ": "$t(PageDelivery:regionDeliveryCost.default)",
    "LV": "$t(PageDelivery:regionDeliveryCost.default)",
    "REST": "$t(PageDelivery:regionDeliveryCost.default)",
    "RU": "$t(PageDelivery:regionDeliveryCost.default)",
    "UA": "Orders over <b>from {{freeAmount}}</b> are delivered <b>free of charge</b> anywhere in Ukraine by the Nova Poshta service.\n</br>Delivery of the orders less than <b>to {{freeAmount}}</ b> are paid by the client at the Nova Poshta branch.\n</br>The calculation of the cost of delivery can be found at <a target='_blank'href='https://novaposhta.ua/ru/delivery'>on the Nova Poshta website</ a >. When calculating, indicate Kiev as the Sending City.\n</br>Orders are sent from the representative office of CREAM.LY in Kiev and do not require customs payments.",
    "UK": "$t(PageDelivery:regionDeliveryCost.default)",
    "US": "$t(PageDelivery:regionDeliveryCost.default)",
    "default": "Shipping cost is <b>{{deliveryCost}}</b> {{deliveryCostDescription}}.\n</br>Orders <b>from {{freeAmount}}</b> are delivered <b>free of charge</b>."
  },
  "regionDeliveryMethodAndTerms": {
    "BY": "$t(PageDelivery:SDEK)",
    "EU": "$t(PageDelivery:PostNL)",
    "KZ": "$t(PageDelivery:SDEK)",
    "REST": "$t(PageDelivery:PostNL)",
    "RU": "$t(PageDelivery:SDEK)",
    "UA": "To deliver the orders to Ukraine we use the courier service <b>Nova Poshta</b> with a delivery time of <b>2-4 days</b> and <b>payment for delivery upon receipt</b>.",
    "UK": "$t(PageDelivery:PostNL)",
    "US": "$t(PageDelivery:PostNL)"
  },
  "yourChosenDeliveryRegionLabel": "Your delivery region "
}