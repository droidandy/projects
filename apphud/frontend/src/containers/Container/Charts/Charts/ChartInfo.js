const ChartInfo = {
    mrr: InfoCreator(
        "MRR",
        "MRR is recurring proceeds revenue normalized in to a monthly amount. It's calculated as a sum of the monthly fee paid by each paying customer with a deduction of Apple comission.",
        "https://docs.apphud.com/analyze/charts#mrr"
    ),
    revenue: InfoCreator(
        "Gross revenue",
        "Gross revenue is a total amount billed to customers for purchasing subscriptions prior to refunds, taxes and Apple’s commission.",
        "https://docs.apphud.com/analyze/charts#gross-revenue"
    ),
    sales: InfoCreator(
        "Sales",
        "Total amount billed to customers for purchasing in-app purchases. Sales = Gross Revenue - Refunds.",
        "https://docs.apphud.com/analyze/charts#sales"
    ),
    proceeds: InfoCreator(
        "Proceeds",
        "Estimated amount you receive on sales of in-app purchases prior to VAT taxes. Proceeds = Sales - Apple’s Comission.",
        "https://docs.apphud.com/analyze/charts#proceeds"
    ),
    refunds: InfoCreator(
        "Refunds",
        "Amount of in-app purchases refunds within selected period.",
        "https://docs.apphud.com/analyze/charts#refunds"
    ),
    arpu: InfoCreator(
        "ARPU",
        "APRU is Average Revenue Per User. Calculated on a cohort basis. The cohort is users, that have installed the app within the selected period.",
        "https://docs.apphud.com/analyze/charts#arpu"
    ),
    arppu: InfoCreator(
        "ARPPU",
        "ARPPU is Average Revenue Per Paying User. It's pretty much the same as ARPU, except there are only paying users counted within the selected time period.",
        "https://docs.apphud.com/analyze/charts#arppu"
    ),
    churn_subscriptions: InfoCreator(
        "Subscriptions churn",
        "This metric shows how many subscriptions were lost during the selected period.",
        "https://docs.apphud.com/analyze/charts#subscriptions-churn"
    ),
    churn_revenue: InfoCreator(
        "Churned revenue",
        "This metric shows how much revenue was lost during the selected period.",
        "https://docs.apphud.com/analyze/charts#churned-revenue"
    ),

    new_users: InfoCreator(
        "New users",
        "This chart shows info about new users of the app.",
        "https://docs.apphud.com/analyze/charts#new-users"
    ),
    trial_conversions: InfoCreator(
        "Trial conversion",
        "New users, who started a trial and then converted to regular subscribers.",
        "https://docs.apphud.com/analyze/charts#trial-conversion"
    ),
    regular_conversions: InfoCreator(
        "Regular subs. conversion",
        "New users, who converted to regular subscribers (trials are not included).",
        "https://docs.apphud.com/analyze/charts#regular-subs-conversion"
    ),
    paid_intro_conversions: InfoCreator(
        "Paid intro conversion",
        "New users, who started a paid intro offer and then converted to regular subscribers.",
        "https://docs.apphud.com/analyze/charts#paid-intro-conversion"
    ),
    promo_conversions: InfoCreator(
        "Promo offer conversion",
        "New users, who started a promo offer and then converted to regular subscribers.",
        "https://docs.apphud.com/analyze/charts#promo-offer-conversion"
    ),
    trial_subs_events: InfoCreator(
        "Trial subscriptions",
        "Analyze events related to trials.",
        "https://docs.apphud.com/analyze/charts#trial-subscriptions"
    ),
    cancel_subs_events: InfoCreator(
        "Cancellations",
        "Analyze cancellations and refunds events.",
        "https://docs.apphud.com/analyze/charts#cancellations"
    ),
    non_renewing_purchases: InfoCreator(
        "Non renewing purchases",
        "Analyze Non renewing purchase events.",
        "https://docs.apphud.com/analyze/charts#non-renewing-purchases"
    ),
    regular_subs_events: InfoCreator(
        "Regular subscriptions",
        "Analyze regular subscriptions.",
        "https://docs.apphud.com/analyze/charts#regular-subscriptions-events"
    ),
    paid_intro_offers_events: InfoCreator(
        "Paid intro offers",
        "Analyze paid intro subscriptions.",
        "https://docs.apphud.com/analyze/charts#paid-intro-offers"
    ),
    promo_offers_events: InfoCreator(
        "Promo offers",
        "Analyze promo offer subscriptions.",
        "https://docs.apphud.com/analyze/charts#promo-offers"
    ),
    other_events: InfoCreator(
        "Other events",
        "Analyze other events.",
        "https://docs.apphud.com/analyze/charts#other-events"
    ),
    non_renewing_conversions: InfoCreator(
        "Non-renewing purchase conversion",
        "New users, who purchased a non-renewing in-app product.",
        "https://docs.apphud.com/analyze/charts#non-renewing-purchase-conversion"
    ),
    subscribers_retention: InfoCreator(
      "Subscribers retention",
        "Shows how app subscribers retain",
        "https://docs.apphud.com/analyze/cohorts#subscribers-retention"
    ),
    revenue_retention: InfoCreator(
        "Net Revenue retention",
        "Shows how app revenue retain",
        "https://docs.apphud.com/analyze/cohorts#net-revenue-retention"
    )
}

function InfoCreator(label, description, url) {
    return { label, description, url }
}

export default ChartInfo;
