module Bookers
  class Index < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :query

    def execute!
      {
        items: booker_items,
        pagination: {
          current: bookers_dataset.current_page,
          total: bookers_dataset.pagination_record_count
        },
        can: {
          add_booker: policy.add_booker?,
          export_bookers: policy.export_bookers?
        }
      }
    end

    private def booker_items
      bookers.map do |booker|
        Bookers::AsJson.new(booker: booker, as: :row_item).execute.result
      end
    end

    private def bookers
      @bookers ||= bookers_dataset.eager(:role, :passengers).all
    end

    private def bookers_dataset
      @bookers_dataset ||= Bookers::Query.new(query, scope: policy_scope).resolved_scope
    end
  end
end
