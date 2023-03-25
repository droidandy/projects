module Sequel
  module SQL
    class AtTimeZone < GenericExpression
      attr_reader :expr, :zone

      def initialize(expr, zone)
        @expr = expr
        @zone = zone
        freeze
      end

      to_s_method :at_time_zone_sql, '@expr, @zone'
    end

    module AtTimeZoneMethods
      def at_time_zone(zone)
        AtTimeZone.new(self, zone)
      end
    end

    GenericExpression.send(:include, AtTimeZoneMethods)
  end

  class Dataset
    def at_time_zone_sql_append(sql, expr, zone)
      literal_append(sql, expr)
      sql << ' AT TIME ZONE '
      literal_append(sql, zone)
    end
  end
end
