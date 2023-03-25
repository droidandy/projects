class CompanyMailer < ApplicationMailer
  default from: GETT_BUSINESS_SOLUTIONS

  def signup_request(request_id)
    @request = CompanySignupRequest.with_pk!(request_id)

    mail(to: 'anton.macius@gett.com', subject: "We've received your sign up request")
  end
end
