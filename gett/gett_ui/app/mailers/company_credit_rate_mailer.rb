class CompanyCreditRateMailer < ApplicationMailer
  layout 'company_credit_rate'

  default to: %w(
    veronika.siskova@gett.com
    accountspayableuk@gett.com
    rommelle.roxas@gett.com
    maria.venkatess@gett.com
    selam.haile@gettaxi.com
  )

  def bad_credit_alert(company)
    @company_name = company.name
    @company_id = company.id

    mail(subject: 'One Transport Enterprise Credit Check Notification')
  end

  def liquidation_alert(company)
    @company_name = company.name
    @company_id = company.id
    @credit_rate_status = company.human_credit_rate_status

    mail(subject: "One Transport Enterprise #{@credit_rate_status} Notification")
  end
end
