class DirectDebitMailer < ApplicationMailer
  def direct_debit_set_up(company_id)
    find_company_and_user(company_id)
    mail(to: @user.email, subject: 'Direct Debit has been set up')
  end

  def direct_debit_cancelled(company_id)
    find_company_and_user(company_id)
    mail(to: @user.email, subject: 'Direct Debit has been cancelled')
  end

  def direct_debit_failed(company_id)
    find_company_and_user(company_id)
    mail(to: @user.email, subject: 'Direct Debit setup failed')
  end

  def payment_completed(direct_debit_payment_id)
    @payment = DirectDebitPayment.with_pk!(direct_debit_payment_id)
    find_company_and_user(@payment.direct_debit_mandate.company_id)
    mail(to: @user.email, subject: 'Direct Debit payment completed')
  end

  private def find_company_and_user(company_id)
    @company = Company.with_pk!(company_id)
    @user = @company.admin
  end
end
