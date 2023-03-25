using Sequel::CoreRefinements

module Bookings
  class Query < ApplicationService
    include ApplicationService::Query

    attributes :dataset, :query, :common, :admin

    define_query do
      defaults order: 'scheduledAt', per_page: 10

      query do
        dataset
          .select_all(:bookings)
          .join(:vehicles, id: :bookings[:vehicle_id])
          .left_join(:members.as(:passengers), id: :bookings[:passenger_id])
          .left_join(:users.as(:passengers_data), id: :passengers[:id])
      end

      query_by(:ids) do |ids|
        dataset.where(:bookings[:id] => ids)
      end

      query_by(:vehicle_types) do |vehicle_types|
        fallbacks = ::Vehicle::FALLBACKS.invert
        all_types = vehicle_types.map{ |type| [type, fallbacks[type]] }.flatten.compact

        dataset.where(:vehicles[:name] => all_types)
      end

      sift_by(:order) do |column|
        guard do
          column.in? %w(
            id serviceId orderId scheduledAt passenger totalCost vehicleType
            status paymentMethod fareQuote
          )
        end
        query { dataset.order(:bookings[column.underscore.to_sym]) }

        query_by(order: 'totalCost') do
          nulls = (params[:reverse] == 'true') ? :first : :last

          dataset
            .left_join(:booking_charges, booking_id: :bookings[:id])
            .order(Sequel.asc(
              Sequel.case({ { :bookings[:status] => Booking::BILLABLE_STATUSES } => :booking_charges[:total_cost] }, nil),
              nulls: nulls
            ))
        end

        query_by(order: 'vehicleType') do
          dataset.order(:vehicles[:name])
        end

        query_by(order: 'passenger') do
          dataset.order do
            lower(Sequel.case(
              {{:bookings[:passenger_id] => nil} => Sequel.function(:concat, :passenger_first_name, :passenger_last_name)},
              Sequel.join([:passengers_data[:first_name], :passengers_data[:last_name]])
            ))
          end
        end

        query_by(order: 'orderId') do
          dataset.left_join(:booking_indexes, booking_id: :bookings[:id])
            .order(:booking_indexes[:order_id])
            .select(:bookings.*)
        end

        query_by(:reverse) { dataset.reverse }
      end

      query_by(:final) { dataset.final }
      query_by(:not_final) { dataset.not_final }
      query_by(critical: 'true') { dataset.critical }

      # NOTE: sifter bellow is slight optimization to join `:companies` table only once.
      # this table is used for both :admin sifter bellow and filtering by :critical criterion
      query(if: -> { params.critical == 'true' || admin }) do
        dataset.association_join(:company)
      end

      query_by(critical: 'true') do
        # NOTE: this is somewhat duplication of Booking.critical scope, the diff is that
        # `:company` is pre-joined by sifter above
        dataset.where do
          :bookings[:critical_flag] |
          :bookings[:international_flag] |
          :bookings[:vip] |
          (:company[:critical_flag_due_on] > Date.current)
        end
      end

      query_by(:payment_method) do |payment_method|
        dataset.where(payment_method: payment_method)
      end

      query_by(:status) do |query_status|
        statuses = Array(query_status)
        if statuses.present?
          billed_status = statuses.delete('billed')

          # if 'billed' bookings should not be present in result, have to distinguish them from
          # 'completed' (`&` operator part). if 'billed' should also be present, relying on `billed` flag
          # check rather than on status check (`|` operator part).
          dataset.where do
            ((status =~ statuses) & (billed_status.present? || ~billed)) | (billed_status.present? && billed)
          end
        end
      end

      query_by(with_alerts: 'true') do
        dataset.where do
          (status =~ Booking::ALERT_STATUSES) |
          (DB[:alerts].where{ (booking_id =~ :bookings[:id]) & (resolved =~ false) }.select(1).exists)
        end
      end

      sift_by(:booking_id, :per_page, page: 'auto') do |id|
        # queries in this sifter block do not generate modified dataset, but instead
        # rewrite params[:page] with proper value to fetch a page that will contain
        # item specified by params[:booking_id].
        #
        # at this point, when redirecting to bookings listing, the default order is
        # by "scheduledAt" in one of the directions.
        query_by(order: 'scheduledAt', index: 1) do
          op = params[:reverse] ? :> : :<
          booking_scheduled_at = DB[:bookings].where(id: id).get(:scheduled_at)
          count = dataset.where{ scheduled_at.send(op, booking_scheduled_at) }.count

          params[:page] = count / params[:per_page] + 1

          dataset
        end
      end

      query_by(:page, :per_page, index: :last) do |page, per|
        page = page.to_i
        per = per.to_i

        paginated = dataset.paginate(page, per)

        (page > paginated.page_count) ? dataset.paginate(paginated.page_count, per) : paginated
      end

      sifter(if: :admin) do
        defaults page: 1, per_page: 25

        # NOTE: `:companies` table is joined as `:company` association in query above to cover
        # both filtering by :admin sifter and :critical criterion
        query_by(:company_type) do |company_type|
          dataset.where(:company[:company_type] => company_type)
        end

        query_by(:labels) do |labels|
          segments =
            labels.map do |label|
              case label
              when 'asap', 'ftr', 'vip', 'critical_flag', 'international_flag' then :bookings[label.to_sym]
              when 'future' then ~:bookings[:asap]
              when 'critical_company' then :company[:critical_flag_due_on] > Date.current
              end
            end

          dataset.where(segments.compact.reduce(&:|))
        end
      end

      query(if: :apply_index_query?) do
        dataset.where(:bookings[:id] => index_query_service.execute.result.select(:booking_id))
      end

      private def apply_index_query?
        # some values may have value of one-space strings, which are `blank?`
        # we're using `empty?` to allow them to pass
        index_query_params.values.any? { |val| !val.to_s.empty? }
      end

      private def index_query_service
        @index_query_service ||= ::Bookings::IndexQuery.new(query: index_query_params, common: common, admin: admin)
      end

      private def index_query_params
        params.slice(
          :include_passenger_ids,
          :exclude_passenger_ids,
          :vendor_name,
          :from,
          :to,
          :search,
          :company_id
        )
      end
    end

    def execute!
      query_with(query, dataset: dataset, common: common, admin: admin).resolved_dataset
    end

    def paginated?
      query&.key?(:page)
    end

    def pagination_data
      return unless paginated?

      execute unless executed?

      {
        current: result.current_page,
        total: result.pagination_record_count,
        page_size: result.page_size
      }
    end
  end
end
