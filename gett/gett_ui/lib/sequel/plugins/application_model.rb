module Sequel
  module Plugins::ApplicationModel
    EMAIL_FORMAT = %r{^[a-z0-9\u007F-\uffff!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$}i
    USER_NAME_FORMAT = %r{^[^/\|\{\}\[\]\%\^]+$}m
    FULL_NAME_MAX_LENGTH = 60

    def self.apply(model, opts = {})
      model.instance_eval do
        include GlobalID::Identification
        self.raise_on_save_failure = false

        plugin :validation_helpers
        plugin :timestamps, update_on_create: true unless opts[:timestamps] == false
        plugin :json_serializer
      end
    end

    module InstanceMethods
      def save!(*args, &block)
        save(*args, raise_on_failure: true, &block)
      end

      def save(*, &block)
        @before_validation_block = block
        super
      ensure
        @before_validation_block = nil
      end

      def persisted?
        !new?
      end

      def to_h
        values
      end

      def has_attribute?(attr) # rubocop:disable Naming/PredicateName
        values.key?(attr)
      end

      def requests_dataset
        Request.where(subject_gid: to_gid.to_s)
      end

      def errors_dataset
        ::Error.where(subject_gid: to_gid.to_s)
      end

      private def validates_phone_number(*attrs, message: nil)
        message ||= I18n.t('validation_errors.phone_number')

        attrs.each do |attr|
          value = public_send(attr).to_s

          # Note: some countries has less then 10 symbols in a full phone number
          if value =~ /[^+0-9\s\(\)]/ || value.delete('^+0-9') !~ /^\+\d{10,15}$/
            errors.add(attr, message)
          end
        end
      end

      private def validates_email(*args)
        validates_format EMAIL_FORMAT, *args
      end

      private def validates_name(attr, max_length: FULL_NAME_MAX_LENGTH, **opts)
        name_parts = Array(attr)
        name_parts.each do |part|
          validates_format(USER_NAME_FORMAT, part, **opts, allow_blank: true)
          validates_max_length(max_length / name_parts.length, part, **opts, allow_blank: true)
        end
      end

      private def validates_comma_separated_emails(*attrs, message: nil)
        attrs.each do |attr|
          value = public_send(attr)
          next if value.blank?

          invalid_entries = value.strip.split(',').select{ |entry| entry.strip !~ EMAIL_FORMAT }

          if invalid_entries.present?
            message ||= "#{I18n.t('csv_report.errors.invalid_recipients')}: #{invalid_entries.join(', ')}"
            errors.add(attr, message)
          end
        end
      end

      private def before_validation
        super
        @before_validation_block&.call(self)
      end
    end
  end
end
