module Documents
  class CreditNote < ApplicationService
    include ApplicationService::DocumentRenderer
    include ApplicationService::Context
    include ApplicationService::Policy

    # if credit_note is passed directly, policy_scope is ignored
    attributes :credit_note, :credit_note_id

    delegate :company, to: :credit_note
    delegate :admin, to: :company

    def self.policy_class
      Documents::Invoice.policy_class
    end

    def template_assigns
      {
        company:           company,
        contact:           admin,
        credit_note:       credit_note,
        credit_note_date:  credit_note.created_at.strftime("#{credit_note.created_at.day.ordinalize} %B %Y"),
        credit_note_lines: credit_note_lines,
        support_phone:     company.ddi_phone
      }
    end

    private def credit_note
      @credit_note ||= attributes[:credit_note] || policy_scope.credit_notes.with_pk!(credit_note_id)
    end

    private def credit_note_lines
      @credit_note_lines ||= credit_note
        .credit_note_lines_dataset
        .eager(:booking)
        .all
    end

    def filename
      "credit_note#{credit_note_id}"
    end
  end
end
