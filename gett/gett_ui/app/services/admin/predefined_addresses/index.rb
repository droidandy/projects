module Admin::PredefinedAddresses
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :query

    def self.policy_class
      Admin::Settings::Policy
    end

    def execute!
      {
        items: predefined_addresses_dataset.as_json,
        pagination: {
          current: predefined_addresses_dataset.current_page,
          total: predefined_addresses_dataset.pagination_record_count
        }
      }
    end

    private def predefined_addresses_dataset
      @predefined_addresses_dataset ||= Query.new(query).resolved_scope
    end

    class Query < ::Parascope::Query
      base_scope { PredefinedAddress.dataset }

      defaults per_page: 10, order: 'id'

      query_by(:search) do |search|
        scope.grep(
          [:line],
          "%#{search}%",
          case_insensitive: true
        )
      end

      query_by(:order) do |column|
        column = column.underscore

        guard { column.in? %w(id line) }
        scope.order(column.to_sym)
      end
      query_by(:reverse) { scope.reverse }

      query_by(:page, :per_page) { |page, per| scope.paginate(page.to_i, per.to_i) }
    end
    private_constant :Query
  end
end
