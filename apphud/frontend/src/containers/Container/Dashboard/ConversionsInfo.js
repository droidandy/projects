function createItem(title, description, url) {
    return { title, description, url };
}

export default  {
    "new_users": createItem("New users", "Number of trials activated within selected period.", ""),
    "renewal_1": createItem("Renewal 1", "The first renewal of the regular subscription.", ""),
    "renewal_2": createItem("Renewal 2" ,"The second renewal of the regular subscription.", ""),
    "renewal_3": createItem("Renewal 3", "The third renewal of the regular subscription.", ""),
    "average_renewals_count": createItem("Average renewals count", "Average number of renewals in the cohort.", ""),
    "trial_started": createItem("Trials started", "Number of trials started.", ""),
    "trial_converted": createItem("Trials converted", "Number of trials converted to a regular subscription.", ""),
    "regular_started": createItem("Regular started", "Number of regular subscriptions started within selected period.", ""),
    "intro_started": createItem("Intro started", "Number of intro subscriptions started within selected period", ""),
    "promo_started": createItem("Promo started", "Number of promo subscriptions started within selected period.", ""),
    "non-renewing_purchases": createItem("Non-renewing purchases", "Number of non-renewing purchases within selected period.", ""),
    "intro_converted": createItem("Intro converted", "Number of intro subscriptions converted to a regular subscription.", ""),
    "promo_converted": createItem("Promo converted", "Number of promo subscriptions converted to a regular subscription.", "")
}
