module Invoices
  class ExportBunch < Shared::Invoices::ExportBunch
    attributes :periods, :user, :company
    background_attributes :periods, :user, :company

    def self.policy_class
      Invoices::Policy
    end

    private def download_path
      Rails.application.routes.url_helpers.download_bunch_invoices_path(filename: zip_basename)
    end

    private def execute_args
      { periods: periods, user: fetch_user, company: company }
    end

    private def fetch_user
      context.member
    end

    private def invoices_dataset
      company.invoices_dataset
    end
  end
end
