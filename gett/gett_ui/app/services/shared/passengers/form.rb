using Sequel::CoreRefinements

module Shared::Passengers
  class Form < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :member, to: :context
    attributes :passenger

    def execute!
      {
        passenger: passenger_data,
        last_logged_in_at: passenger&.last_logged_in_at,
        member_id: member&.id,
        bookers: bookers_data,
        work_roles: company.work_roles.as_json(only: [:id, :name]),
        departments: company.departments.as_json(only: [:id, :name]),
        member_roles: member_role_names,
        company_type: company.company_type,
        company_name: company.name,
        company_payment_types: company.payment_types,
        company_custom_attributes: company.custom_attributes,
        payment_cards: passenger&.payment_cards&.as_json(
          only: [
            :id,
            :holder_name,
            :last_4,
            :expiration_year,
            :expiration_month,
            :default
          ],
          include: [:kind, :expired]
        ),
        favorite_addresses: favorite_addresses_data,
        payroll_required: company.payroll_required,
        cost_centre_required: company.cost_centre_required,
        locations: locations_data,
        can: {
          # member IS passenger in BO
          edit_all: member.company.enterprise?,
          change_active: policy.change_active?,
          assign_bookers: policy.assign_bookers?,
          assign_self: policy.assign_self?,
          change_email: policy.change_email?,
          change_department: policy.change_department?,
          change_work_role: policy.change_work_role?,
          change_role: policy.change_role?,
          change_payroll: policy.change_payroll?,
          change_cost_centre: policy.change_cost_centre?,
          change_division: policy.change_division?,
          add_payment_cards: policy.add_payment_cards?,
          delete_payment_cards: policy.delete_payment_cards?,
          see_log: policy.see_log?,
          reinvite: passenger&.persisted? && passenger.last_logged_in_at.blank?,
          change_personal_card_usage: policy.change_personal_card_usage?,
          see_payment_cards: passenger_payment_cards_supported?,
          change_wheelchair: policy.change_wheelchair?,
          # bbc related abilities
          edit_bbc_attrs: policy.edit_bbc_attrs?,
          accept_pd: policy.accept_pd?,
          change_pd: policy.change_pd?
        }
      }
    end

    def passenger_data
      passenger.present? ? present_passenger_data : blank_passenger_data
    end

    private def present_passenger_data
      show_service.new(passenger: passenger).execute.result.tap do |data|
        if policy.change_personal_card_usage?
          data[:allow_personal_card_usage] = passenger.allow_personal_card_usage?
        end
      end
    end

    private def blank_passenger_data
      {
        active: true,
        notify_with_sms: true,
        notify_with_email: true,
        notify_with_push: true,
        wheelchair_user: false,
        vip: false,
        allow_preferred_vendor: false,
        booker_pks: default_booker_pks_data,
        work_address: (company.default_location&.address || company.address).as_json,
        role_type: :passenger
      }
    end

    private def default_booker_pks_data
      company.bookers_dataset.active.where(assigned_to_all_passengers: true).select_map(:users[:id])
    end

    private def favorite_addresses_data
      return [] if passenger.blank?

      passenger.favorite_addresses.as_json(
        only: [:id, :passenger_id, :name, :type, :pickup_message, :destination_message],
        include: :address
      )
    end

    private def locations_data
      company.locations_dataset.order(:name).eager(:address).all.map do |location|
        ::Locations::Show.new(location: location).execute.result
      end
    end

    private def member_role_names
      company.enterprise? ? Role::ENTERPRISE_ROLES : Role::AFFILIATE_ROLES
    end

    private def passenger_payment_cards_supported?
      !company.bbc? &&
        (company.payment_types & PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_TYPES).present?
    end
  end
end
