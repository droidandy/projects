module Gett
  module Analytics
    class PostEvent < ::Gett::Base
      QA_EVENT_PREFIX = 'qa_ot_'.freeze
      EVENT_PREFIX = 'ot_'.freeze

      http_method :post

      attributes :event

      delegate :api_url, :mp_bo_api_key, :mp_fo_api_key, :execute_in_development, to: 'Settings.gt.analytics.events'

      def execute!
        if (Rails.env.development? || Rails.env.test_features?) && !execute_in_development
          success!
        else
          super
        end
      end

      private def url
        super("/relay/v1/ru/metrics")
      end

      private def access_token
        Gett::Analytics::Authenticate.token_data['access_token'] if Gett::Analytics::Authenticate.token_data.present?
      end

      private def params
        {
          token: mix_panel_token,
          event_name: "#{event_prefix}#{event_name}",
          event: "#{event_prefix}#{event_name}",
          **event_properties
        }
      end

      private def mix_panel_token
        if event_name.start_with?('backoffice')
          mp_bo_api_key
        else
          mp_fo_api_key
        end
      end

      private def event_prefix
        Rails.env.production? ? EVENT_PREFIX : QA_EVENT_PREFIX
      end

      private def event_name
        event[:name]
      end

      private def event_properties
        event[:properties].as_json.transform_keys(&:to_sym)
      end

      private def authenticate!
        @auth = ::Gett::Analytics::Authenticate.new.execute
      end
    end
  end
end
