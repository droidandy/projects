module Bookers
  class AsJson < ApplicationService
    include ApplicationService::Context

    delegate :member, to: :context

    attributes :booker, :as

    def execute!
      case as
      when :row_item then as_row_item
      when :record then as_record
      else booker.as_json
      end
    end

    private def as_row_item
      booker.as_json(
        only: [
          :id,
          :email,
          :first_name,
          :last_name,
          :phone
        ], include: [
          :role_type
        ]
      ).merge(
        avatar_url: booker.avatar&.url,
        is_booker_for_current_member: booker.booker_of?(member),
        can: {
          be_expanded: Bookers::ShowPolicy.new(context.member, self).be_expanded?
        }
      )
    end

    private def as_record
      booker.as_json(
        only: [
          :id,
          :email,
          :first_name,
          :last_name,
          :phone,
          :mobile,
          :active,
          :work_role_id,
          :department_id,
          :onboarding,
          :notify_with_sms,
          :notify_with_email,
          :notify_with_push,
          :assigned_to_all_passengers
        ], include: [
          :role_name,
          :role_type,
          :passenger_pks
        ]
      ).merge(
        avatar_url: booker.avatar&.url
      )
    end
  end
end
