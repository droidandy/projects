module Documents
  class CompanyStatistics < ApplicationService
    include ApplicationService::DocumentRenderer
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :html

    def pdf_options
      {
        orientation: 'Landscape',
        margin: { bottom: 0, top: 0 }
      }
    end

    def self.policy_class
      if context&.back_office?
        Admin::Documents::CompanyStatisticsPolicy
      else
        ::Documents::CompanyStatisticsPolicy
      end
    end

    def template_assigns
      { html: html }
    end
  end
end
