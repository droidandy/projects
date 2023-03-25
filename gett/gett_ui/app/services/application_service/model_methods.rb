module ApplicationService::ModelMethods
  SAVE_OPTS = %i[changed columns raise_on_failure server transaction validate].freeze

  private def transaction
    Sequel::Model.db.transaction(savepoint: true) do
      yield
      raise Sequel::Rollback unless success?
    end
  end

  private def save_model(model, *params, &block)
    save_opts = (params.last.present? && (params.last.keys - SAVE_OPTS).empty?) ? params.extract_options! : {}

    model.set(params.select(&:present?).reduce(&:merge).presence || {})
    model.save(save_opts, &block)
  end
  alias create_model save_model
  alias update_model save_model

  private def destroy_model(model)
    model.destroy
  end

  private def update_custom_attributes(model, params)
    update_model(model, custom_attributes: model.custom_attributes.merge(params))
  end

  private def assign_address(model, address_params, key: :address_id, join_model: false, &block)
    # address params may contain auxiliary data, such as `:airport_iata`, used in some
    # places, such as `Carey::Vehicles` service
    airport_iata = address_params&.dig(:airport_iata)
    address_params = address_params&.slice(:id, *Address::ATTRIBUTES)

    if address_params&.dig(:line).present?
      fail ArgumentError, "attempt to assign '#{HomePrivacy::HOME}' as address line" if address_params[:line] == HomePrivacy::HOME

      address =
        Address.lookup_valid!(address_params) do |addr|
          next if airport_iata.blank?

          addr.airport_id = Airport.first(iata: airport_iata)&.id
        end
      update_model(model, key => address.id, &block)
    elsif join_model
      destroy_model(model) if model.persisted?
      true
    else
      update_model(model, key => nil, &block)
    end
  end

  private def consolidate_errors(*errors)
    others = errors.extract_options!

    others.reduce(errors.reduce(&:merge)) do |acc, (key, nested_errors)|
      next acc if nested_errors.blank?

      errors_hash =
        if nested_errors.is_a?(Array)
          {key => nested_errors}
        else
          nested_errors.transform_keys{ |attr| "#{key}.#{attr}" }
        end

      acc.merge(errors_hash)
    end
  end

  private def humanized_full_messages(errors)
    # almost the same as #full_messages, but with humanized attributes
    errors.flat_map do |attr, messages|
      messages.map do |msg|
        label = Array(attr).map{ |a| a.to_s.humanize }.join(' and ')
        msg.is_a?(Sequel::LiteralString) ? msg : "#{label} #{msg}"
      end
    end
  end
end
