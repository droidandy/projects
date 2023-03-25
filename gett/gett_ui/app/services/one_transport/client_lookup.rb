# Service which returns SpecialRequirements from OT-API
#
# Examples:
#
# service = OneTransport::ClientLookup.new(company: Company.first)
# service.execute
# service.normalized_response
# => {:requirements=>[{:key=>"001", :label=>"Wheelchair User (Ramps Required)"}]}
#
module OneTransport
  class ClientLookup < Base
    attributes :company

    normalize_response do
      map from('/general/requirements/requirements_structure'), to('/requirements') do |reqs|
        reqs = reqs.is_a?(Hash) ? [reqs] : reqs
        normalize_array(reqs) do
          map from('/ot_requirement_id'), to('/key')
          map from('/description'), to('/label')
        end
      end
    end

    def header_options
      { max_reply: 100 }
    end

    def options
      {
        client_number: company.ot_client_number,
        client_name:   company.ot_username
      }
    end
  end
end
