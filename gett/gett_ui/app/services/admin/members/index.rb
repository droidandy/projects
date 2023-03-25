using Sequel::CoreRefinements

module Admin::Members
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :query

    def self.policy_class
      Admin::Policy
    end

    def execute!
      {
        items: member_items,
        pagination: {
          current: members_dataset.current_page,
          total: members_dataset.pagination_record_count,
          page_size: members_dataset.page_size
        }
      }
    end

    private def member_items
      members_dataset.all.map do |member|
        member.values
          .slice(:id, :email, :first_name, :last_name, :login_count, :vip)
          .merge(
            company_name:      member[:company_name],
            company_type:      member[:company_type],
            member_role_name:  member[:member_role_name],
            comments_count:    member[:comments_count],
            last_logged_in_at: member.last_logged_in_at&.strftime('%Y.%m.%d %H:%M:%S'),
            avatar_url:        member.avatar&.url
          )
      end
    end

    private def members_dataset
      @members_dataset ||= Query.new(query).resolved_scope
    end

    class Query < ::Parascope::Query
      defaults per_page: 25, order: 'id'

      base_scope do
        Member.dataset
          .with(:comment_counts, MemberComment.dataset.group_and_count(:member_id))
          .inner_join(:roles, id: :users[:member_role_id])
          .inner_join(:companies, id: :users[:company_id])
          .inner_join(:company_infos, company_id: :id, active: true)
          .left_join(:comment_counts, member_id: :users[:id])
          .select(
            :users.*,
            :roles[:name].as(:member_role_name),
            :company_infos[:name].as(:company_name),
            :companies[:company_type].as(:company_type),
            Sequel.function(:coalesce, :comment_counts[:count], 0).as(:comments_count)
          )
      end

      query_by(:search) do |search|
        search = "%#{search.gsub(/\s+/, ' ')}%"
        name_parts = [:first_name, ' ', :last_name]

        scope.grep(
          [
            :first_name,
            :last_name,
            Sequel.join(name_parts),
            Sequel.join(name_parts.reverse),
            :email,
            :company_infos[:name]
          ],
          search,
          case_insensitive: true
        )
      end

      query_by(:order) do |column|
        guard do
          column.in? %w(
            id
            firstName
            lastName
            email
            companyName
            companyType
            lastLoggedInAt
            loginCount
          )
        end
        scope.order(column.underscore.to_sym)
      end
      query_by(:reverse) { scope.reverse }

      query_by(:company_type) do |company_type|
        scope.where(:companies[:company_type] => company_type)
      end

      query_by(:member_role_name) do |member_role_name|
        scope.where(
          { 'companyadmin' => 'admin' }.transform_keys{ |role_name| { :roles[:name] => role_name } }
            .case(:roles[:name]) => member_role_name
        )
      end

      query_by(:page, :per_page) { |page, per| scope.paginate(page.to_i, per.to_i) }
    end
    private_constant :Query
  end
end
