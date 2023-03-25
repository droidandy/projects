if Rails.env.dev? || Rails.env.staging?
  require 'dev_email_interceptor'

  ActionMailer::Base.register_interceptor(DevEmailInterceptor)
end
