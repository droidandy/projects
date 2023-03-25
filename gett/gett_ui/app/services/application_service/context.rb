module ApplicationService::Context
  extend ActiveSupport::Concern

  def self.set_context!(ctx) # rubocop:disable Naming/AccessorMethodName
    RequestStore.store[:service_context] = Hashie::Mash.new(ctx)
  end

  def self.with_context(ctx)
    old = RequestStore.store[:service_context]
    RequestStore.store[:service_context] = Hashie::Mash.new(old&.merge(ctx) || ctx)
    yield
  ensure
    RequestStore.store[:service_context] = old
  end

  def self.context
    RequestStore.store[:service_context]
  end

  def with_context(ctx)
    if block_given?
      ApplicationService::Context.with_context(ctx){ yield }
    else
      @_context = Hashie::Mash.new(ctx)
      self
    end
  end

  def context
    @_context&.reverse_merge(self.class.context || {}) || self.class.context
  end

  module ClassMethods
    def context
      ApplicationService::Context.context
    end
  end
end
