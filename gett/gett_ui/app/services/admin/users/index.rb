using Sequel::CoreRefinements

module Admin::Users
  class Index < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :query

    def execute!
      result = {
        items: user_items,
        can: {
          edit_gett_users: policy.edit_gett_users?,
          create_user: policy.create_user?
        }
      }

      if query&.key?(:page)
        result.merge!(pagination: {
          current: users_dataset.current_page,
          total: users_dataset.pagination_record_count
        })
      end

      result
    end

    private def user_items
      users_dataset.all
    end

    private def users_dataset
      @users_dataset ||= Query.new(query).resolved_scope
    end

    class Query < ::Parascope::Query
      defaults per_page: 10, order: 'id'

      base_scope do
        DB[:users].inner_join(:roles, id: :user_role_id)
          .select(
            :users[:id].as(:id),
            :users[:email].as(:email),
            :users[:first_name].as(:first_name),
            :users[:last_name].as(:last_name),
            :roles[:name].as(:user_role_name)
          )
      end

      query_by(:search) do |search|
        scope.grep(
          [:first_name, :last_name, :email],
          search.split(/\s+/).map{ |part| "%#{part}%" },
          case_insensitive: true
        )
      end

      query_by(:order) do |column|
        column = column.underscore

        guard { column.in? %w(id user_role_name first_name last_name email) }

        scope.order(column.to_sym)
      end
      query_by(:reverse) { scope.reverse }

      query_by(:page, :per_page) { |page, per| scope.paginate(page.to_i, per.to_i) }
    end
    private_constant :Query
  end
end
