module Passengers
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :query

    delegate :member, :company, to: :context

    def execute!
      {
        items: passenger_items,
        pagination: {
          current: passengers_dataset.current_page,
          total: passengers_dataset.pagination_record_count
        },
        can: {
          add_passenger: policy.add_passenger?,
          have_passenger: policy.have_passenger?,
          export_passengers: policy.export_passengers?,
          import_passengers: policy.import_passengers?,
          invite_all_passengers: policy.invite_all_passengers? && yet_to_invite_members_dataset.any?
        },
        statistics: {
          total: policy_scope.count,
          active: policy_scope.where(active: true).count,
          yet_to_invite: yet_to_invite_members_dataset.count
        }
      }
    end

    private def yet_to_invite_members_dataset
      company.members_dataset.yet_to_invite.exclude(id: member.id)
    end

    private def passenger_items
      passengers.map do |passenger|
        Passengers::Show.new(passenger: passenger).execute.result
      end
    end

    private def passengers
      @passengers ||= passengers_dataset.eager(:bookers, :passengers, :company).all
    end

    private def passengers_dataset
      @passengers_dataset ||= Passengers::Query.new(query, scope: policy_scope).resolved_scope
    end
  end
end
