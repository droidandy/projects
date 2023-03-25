module ApplicationService::Query
  extend ActiveSupport::Concern

  included do
    class_attribute :query_class, instance_writer: false
  end

  def query_with(*args)
    query_class.new(*args)
  end

  module ClassMethods
    def define_query(&block)
      self.query_class = Class.new(Parascope::Query, &block)
    end
  end
end
