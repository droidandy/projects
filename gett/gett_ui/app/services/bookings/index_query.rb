using Sequel::CoreRefinements

module Bookings
  class IndexQuery < ApplicationService
    include ApplicationService::Query

    attributes :query, :common, :admin

    define_query do
      base_dataset { DB[:booking_indexes] }

      query_by(:vendor_name) do |name|
        dataset.where(vendor_name: name.presence)
      end

      query_by(:include_passenger_ids) do |ids|
        dataset.where(passenger_id: Array(ids))
      end

      query_by(:exclude_passenger_ids) do |ids|
        # when checking for not equality NULL values require explicit condition to be included in resulting dataset
        dataset.where{ (:booking_indexes[:passenger_id] !~ ids) | (:booking_indexes[:passenger_id] =~ nil) }
      end

      sifter(if: ->{ params[:from].present? || params[:to].present? }) do
        query_by(:from) do |from|
          dataset.where{ :booking_indexes[:local_scheduled_at] >= Date.parse(from).beginning_of_day }
        end

        query_by(:to) do |to|
          dataset.where{ :booking_indexes[:local_scheduled_at] <= Date.parse(to).end_of_day }
        end
      end

      sifter(if: :common) do
        query_by(:search) do |search|
          search = search.strip
          id_pattern = "%#{search.downcase.gsub(/\s+/, '')}%"
          text_pattern = "%#{search.downcase.gsub(/\s+/, '%')}%"

          dataset.where do
            (service_id =~ search) |
            order_id.like(id_pattern) |
            supplier_service_id.like(id_pattern) |
            passenger_full_name.like(text_pattern)
          end
        end
      end

      sifter(if: :admin) do
        query_by(:search) do |search|
          search = search.strip
          id_pattern = "%#{search.downcase.gsub(/\s+/, '')}%"
          text_pattern = "%#{search.downcase.gsub(/\s+/, '%')}%"

          company_ids = DB[:company_infos].where{ active & name.ilike(text_pattern) }.select_map(:company_id)

          dataset.where do
            (service_id =~ search) |
            (company_id =~ company_ids) |
            order_id.like(id_pattern) |
            supplier_service_id.like(id_pattern) |
            passenger_full_name.like(text_pattern)
          end
        end

        query_by(:company_id) do |company_id|
          dataset.where(company_id: company_id)
        end
      end
    end

    def execute!
      query_with(query, common: common, admin: admin).resolved_dataset
    end
  end
end
