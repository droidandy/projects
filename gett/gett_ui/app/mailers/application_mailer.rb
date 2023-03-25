class ApplicationMailer < ActionMailer::Base
  DO_NOT_REPLY = 'donotreply@gett.com'.freeze
  GETT_BUSINESS_SOLUTIONS = "Gett Business Solutions <#{DO_NOT_REPLY}>".freeze
  default from: DO_NOT_REPLY, content_type: 'text/html'
  layout 'mailer'
end
