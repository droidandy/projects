class ApplicationService
  include ApplicationService::Execute
  include ApplicationService::FailSafe

  def self.inherited(klass)
    klass.send(:prepend, CachedExecute)
  end

  class_attribute :attributes_list
  self.attributes_list = []

  attr_reader :attributes, :errors

  def self.attributes(*attrs)
    attributes_list.concat(attrs).uniq!
    attrs.each do |name|
      define_method(name) { attributes[name] }
      define_method("#{name}?") { !!attributes[name] }
    end
  end

  def initialize(attrs = {})
    attrs = attrs.to_h.symbolize_keys
    assert_allowed_attributes!(attrs.keys)
    @attributes = attrs
  end

  private def set_errors(errors) # rubocop:disable Naming/AccessorMethodName
    @errors = errors
    @result = false
  end

  private def assert_allowed_attributes!(attrs)
    unexpected = attrs - attributes_list
    if unexpected.present?
      fail ArgumentError, "cannot initialize #{self.class} with attributes: #{unexpected.inspect}"
    end
  end
end
