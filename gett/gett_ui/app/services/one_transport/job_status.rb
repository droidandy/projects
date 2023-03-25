module OneTransport
  class JobStatus < Base
    attributes :external_references

    normalize_response do
      map from('/job_states/job_status_structure'), to('/job_statuses') do |jobs|
        jobs = jobs.is_a?(Hash) ? [jobs] : jobs
        normalize_array(jobs) do
          map from('/ot_confirmation_number'), to('/confirmation_number')
          map from('/external_reference'), to('/external_reference')
          map from('/job_state'), to('/job_state')
        end
      end
    end

    def options
      references_hash = external_references.map { |r| { 'string' => r } }
      { external_references: references_hash }
    end
  end
end
