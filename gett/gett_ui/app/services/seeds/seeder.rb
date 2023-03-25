class Seeds::Seeder < ApplicationService
  attributes :model, :keys, :values_list, :transform, :once

  def execute!
    seeded_model = (model.is_a?(Class) && model < Sequel::Model) ? model : Sequel::Model(model)

    values_list.map do |attributes|
      attributes = transform.call(attributes) if transform.present?
      key_attributes = attributes.slice(*keys)

      record = seeded_model.find_or_new(key_attributes)

      next record if once && !record.new?

      record.set(attributes)
      record.save || fail("Failed to seed #{seeded_model.name}(#{key_attributes.inspect}): #{record.errors}")
    end
  end
end
