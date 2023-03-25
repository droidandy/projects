module Users
  class BatchDeactivate < ApplicationService
    attr_reader :succeeded_ids, :failed_ids, :skipped_ids

    schema do
      required(:user_ids).filled(:array?)
    end

    def execute!
      @succeeded_ids = []
      @failed_ids = []
      @skipped_ids = []
      user_ids.each do |user_id|
        service = Users::Deactivate.new(current_user, user_id: user_id)
        service.execute!

        if service.success?
          @succeeded_ids << user_id
        elsif !service&.user&.active?
          @skipped_ids << user_id
        else
          @failed_ids << user_id
        end
      end
      success!
    end
  end
end
