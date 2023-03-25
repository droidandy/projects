using Sequel::CoreRefinements

module Mobile::V1
  module Addresses
    class QuickSearch < ApplicationService
      attributes :lat, :lng, :criterion, :next_page_token

      module Criterion
        AIRPORT = 'airport'.freeze
        TRAIN_STATION = 'train_station'.freeze
        LODGING = 'lodging'.freeze
        RESTAURANT = 'restaurant'.freeze
        POINT_OF_INTEREST = 'point_of_interest'.freeze
        RECENT = 'recent'.freeze

        SPECIAL_CRITERIONS = [RECENT].freeze
        LOCAL_CRITERIONS = [LODGING, RESTAURANT, POINT_OF_INTEREST].freeze
        ALL_CRITERIONS = [AIRPORT, TRAIN_STATION, LODGING, RESTAURANT, POINT_OF_INTEREST, RECENT].freeze
      end

      # lodging - is name for all houses (hotels, hostels, etc.)
      METERS_IN_MILE = 1610
      CITY_SIZE = 6000

      def execute!
        return if next_page_token.blank? &&
          (lat.blank? || lng.blank? || criterion.blank? || Criterion::ALL_CRITERIONS.exclude?(criterion)) &&
          Criterion::SPECIAL_CRITERIONS.exclude?(criterion)

        result { search_service.execute.result }

        if success? && criterion == Criterion::AIRPORT
          point = Postgis.point_to_sql(lat: lat, lng: lng)

          result[:list].concat(
            DB[:predefined_addresses]
              .exclude(airport_id: nil)
              .order{ ST_Distance(point, ST_SetSRID(ST_MakePoint(:lng, :lat), Postgis::SRID)) }
              .select(:line.as(:text), :lat, :lng)
              .first(10)
              .each{ |address| address[:types] = ['airport'] }
          )
        end
      end

      private def search_service
        return @search_service if defined?(@search_service)

        if criterion.in?(Criterion::SPECIAL_CRITERIONS)
          @search_service = "Mobile::V1::Addresses::#{criterion.capitalize}".constantize.new
        else
          @search_service = ::GoogleApi::NearbySearch.new(params)
        end
      end

      private def params
        return { pagetoken: next_page_token} if next_page_token.present?

        {
          location: "#{lat},#{lng}",
          type: criterion
        }.tap do |h|
          h[:radius] = radius if radius.present?
          h[:rankby] = rankby if rankby.present?
          h[:name]   = name if name.present?
        end
      end

      private def radius
        @radius ||=
          case criterion
          when Criterion::TRAIN_STATION
            CITY_SIZE
          when *Criterion::LOCAL_CRITERIONS
            METERS_IN_MILE * 3
          end
      end

      private def rankby
        'distance' if criterion == Criterion::AIRPORT
      end

      private def name
        'airport' if criterion == Criterion::AIRPORT
      end
    end
  end
end
