class UserUnlocker < ApplicationWorker
  sidekiq_options queue: :default

  def perform(user_id)
    user = User.with_pk!(user_id)

    user&.update(locked: false, invalid_passwords_count: 0)
  end
end
