class Admin::Members::FormPolicy < Admin::Policy
  # Policy for shared functionality, needs to be explicitly redefined
  allow :assign_bookers,
    :assign_passengers,
    :add_payment_cards,
    :edit_all,
    :see_log,
    :delete_payment_cards,
    :change_active,
    :change_payroll,
    :change_cost_centre,
    :change_division,
    :change_role,
    :change_active,
    :change_department,
    :change_email,
    :change_work_role,
    :change_wheelchair,
    # bbc_related features
    :change_pd,
    :edit_bbc_attrs

  disallow :assign_self,
    :change_personal_card_usage,
    :accept_pd
end
