class ApplicationJob < ActiveJob::Base
  protected def system_user
    User.find_by(email: Rails.application.secrets.system_user_email)
  end
end
