module ApplicationService::NormalizedResponse
  extend ActiveSupport::Concern

  included do
    class_attribute :normalizer, instance_writer: false
  end

  def normalized_response
    return if response&.data.blank?

    normalizer.normalize(response.data, context: try(:context))
  end

  module ClassMethods
    def normalize_response(&block)
      self.normalizer = Class.new(Mapper, &block)
    end
  end

  class Mapper
    extend HashMapper

    def self.normalize(input, context: nil, &block)
      return super(input, context: context) unless block_given?

      Class.new(self, &block).normalize(input, context: context)
    end

    def self.normalize_array(array, &block)
      array.map do |array_item|
        normalize(array_item, &block)
      end
    end

    def self.time_text_to_seconds(time_text)
      waiting_time_arr = time_text.split(':').map(&:to_i)
      waiting_time_arr[0] * 3600 + waiting_time_arr[1] * 60 + waiting_time_arr[2]
    end
  end
end
