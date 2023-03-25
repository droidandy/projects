using Sequel::CoreRefinements

module Admin::Companies
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :query

    def execute!
      {
        items: companies_data,
        country_code_filter_options: country_code_filter_options,
        pagination: {
          current: companies_dataset.current_page,
          total: companies_dataset.pagination_record_count
        },
        can: {
          create_company: policy.manage_company?,
          edit_company: policy.manage_company?,
          disable_company: policy.toggle_company_status?,
          activate_all_members: policy.activate_all_members?,
          toggle_notifications: policy.toggle_notifications?
        }
      }
    end

    private def companies_data
      companies_dataset.all.map do |company|
        Admin::Companies::Show.new(company: company).execute.result
      end
    end

    private def companies_dataset
      @companies_dataset ||=
        Query.new(query).resolved_scope
          .with(:comment_counts, CompanyComment.dataset.group_and_count(:company_id))
          .with(:booking_counts, Booking.dataset
            .join(:company_infos, id: :bookings[:company_info_id])
            .group_and_count(:company_id)
          )
          .left_join(:comment_counts, company_id: :companies[:id])
          .left_join(:booking_counts, company_id: :companies[:id])
          .eager(:company_info, :ddi)
          .select do
            [
              :companies.*,
              coalesce(:comment_counts[:count], 0).as(:comments_count),
              coalesce(:booking_counts[:count], 0).as(:bookings_count)
            ]
          end
    end

    private def country_code_filter_options
      Company
        .dataset
        .association_join(:company_info)
        .exclude(country_code: nil)
        .distinct(:country_code)
        .select_map(:country_code)
    end

    class Query < ::Parascope::Query
      defaults page: 1, per_page: 10, order: 'createdAt', reverse: true

      base_scope { Company.association_join(:company_info.as(:company_infos)) }

      query_by(:search) do |search|
        scope.grep(:company_infos[:name], "%#{search}%", case_insensitive: true)
      end

      sift_by(:order) do |column|
        guard { column.in? %w(id companyType name createdAt active) }
        query { scope.order(:companies[column.underscore.to_sym]) }

        query_by(order: 'name') { scope.order(:company_infos[:name]) }
        query { scope.reverse if reverse? }
      end

      query_by(:credit_rate_status) do |credit_rate_status|
        scope.where(:companies[:credit_rate_status] => credit_rate_status)
      end

      query_by(:ddi_type) do |ddi_type|
        scope.association_join(:ddi).where(:ddi[:type] => ddi_type)
      end

      query_by(:country_code) do |country_code|
        scope.where(:company_infos[:country_code] => country_code)
      end

      query_by(:page, :per_page) { |page, per| scope.paginate(page.to_i, per.to_i) }

      def reverse?
        params[:reverse].present? && params[:reverse] != 'false'
      end
    end
    private_constant :Query
  end
end
