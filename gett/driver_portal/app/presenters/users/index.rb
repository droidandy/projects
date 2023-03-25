require 'sync_manager'

module Users
  class Index < ApplicationPresenter
    attr_reader :users

    def initialize(users)
      @users = users
    end

    def as_json
      {
        users: @users.includes(:last_invite).map { |user| presenter_for(user).as_json },
        total: @users.total_count,
        page: @users.current_page,
        per_page: @users.current_per_page,
        last_sync_at: SyncManager.last_sync_at.try(:iso8601),
        sync_in_progress: SyncManager.sync_in_progress?
      }
    end
  end
end
