module Booking::BBC
  extend ActiveSupport::Concern

  module JourneyType
    HW = 'home_to_work'.freeze
    WH = 'work_to_home'.freeze
    WW = 'work_to_work'.freeze

    ALL_TYPES = [HW, WH, WW].freeze
  end

  included do
    plugin :custom_attributes, attributes: [:journey_type]
  end

  def validate
    super
    return unless company&.bbc?

    validates_presence(:journey_type)
    validates_includes(JourneyType::ALL_TYPES, :journey_type)
  end
end
