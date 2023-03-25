class Errors < ApplicationPresenter
  def initialize(errors, opts = {})
    @errors = errors
    @opts = opts
  end

  def as_json
    result = @errors.except(:base).map do |key, messages|
      [key, Array.wrap(messages).map { |message| format_message(key, message) }]
    end

    result << [:base, [@errors[:base]]] if @errors[:base]

    { errors: result.to_h }
  end

  def as_json_array
    result = @errors.map do |key, messages|
      attr_name = key.to_s.humanize
      Array.wrap(messages).map { |message| "#{attr_name} #{message}" }
    end

    { errors: result.flatten }
  end

  def format_message(field, message)
    return message.capitalize if @opts[:without_field]
    "#{field.to_s.humanize} #{message.downcase}"
  end
end
