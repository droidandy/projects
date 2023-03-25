module Sequel
  module Plugins::CustomAttributes
    def self.apply(model, *)
      model.class_eval do
        class_attribute :custom_attribute_names, instance_writer: false
        self.custom_attribute_names = []
      end
    end

    def self.configure(model, opts = {})
      attributes = opts[:attributes]
      attributes_with_readers =
        attributes.extract_options!.merge(attributes.zip([nil]).to_h)

      model.class_eval do
        custom_attribute_names.concat(attributes_with_readers.keys)

        attributes_with_readers.each do |name, reader|
          attr = name.to_s

          define_method(attr) do
            value = custom_attributes && custom_attributes[attr]
            (reader.present? && value.present?) ? reader[value] : value
          end

          define_method("#{attr}=") do |value|
            attrs = custom_attributes || {}
            self.custom_attributes = attrs.merge(attr => value)
          end

          define_method("#{attr}?") do
            custom_attributes && !!custom_attributes[attr]
          end
        end
      end
    end

    module InstanceMethods
      def custom_attributes
        super&.with_indifferent_access
      end

      def custom_attributes=(value)
        super(value&.to_h)
      end
    end
  end
end
