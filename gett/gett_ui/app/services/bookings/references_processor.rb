module Bookings
  class ReferencesProcessor < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :params, :booking_id, :validate_value

    delegate :company, to: :context

    alias validate_value? validate_value

    def self.policy_class
      Bookings::FormPolicy
    end

    def execute!
      if validate_value?
        booker_references
          .map{ |br| br.valid?(only_value: true) }
          .all?
      else
        success!
        booker_references.each{ |ref| assert { ref.save } }
      end
    end

    def errors
      booker_references.each_with_object({}) do |br, errs|
        errs.merge!(br.errors.transform_keys{ |k| "booker_references.#{br.index}.#{k}" })
      end
    end

    def booker_references
      # the following booker references are taken into account:
      # - ones that have `value` entered
      # - ones that refer to mandatory `booking_reference`
      # - ones that refer to `booking_reference` that require validation
      @booker_references ||=
        Array(params).each_with_index.reduce([]) do |refs, (params, i)|
          reference = company.booking_references.find{ |ref| ref.id == params[:booking_reference_id].to_i }
          fail 'invalid booking_reference_id' if reference.nil? # i.e. booking_reference_id is from other company

          next refs if params[:value].blank? && !reference.mandatory?

          refs << BookerReference.new(value: params[:value], booking_id: booking_id, index: i, booking_reference: reference)
        end
    end
  end
end
