module BatchService
  class Show < ApplicationPresenter
    def initialize(service)
      @service = service
    end

    def as_json
      {
        succeeded: render_users(@service.try(:succeeded_ids)),
        failed: render_users(@service.try(:failed_ids)),
        skipped: render_users(@service.try(:skipped_ids))
      }
    end

    private def render_users(user_ids)
      User.where(id: user_ids).includes(:last_invite).map { |user| presenter_for(user).as_json }
    end
  end
end
