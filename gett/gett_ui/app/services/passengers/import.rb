require 'csv'

module Passengers
  class Import < ApplicationService
    include ApplicationService::Context

    ROLE_NAME_MAPPING = {
      'Admin' => 'admin',
      'Booker' => 'booker',
      'Passenger' => 'passenger',
      'Finance' => 'finance',
      'Travel Manager' => 'travelmanager'
    }.freeze

    private_constant :ROLE_NAME_MAPPING

    def execute!
      with_context(company: company, import: true) do
        begin
          process_with_encoding('utf-8')
        rescue ArgumentError
          process_with_encoding('windows-1252')
        end
      end

      errors.empty?
    rescue ArgumentError => err
      if err.message.include?('invalid byte sequence')
        handle_encoding_error
      else
        raise err
      end
    end

    def errors
      @errors ||= {}
    end

    private def process_with_encoding(encoding)
      passengers_in_csv = []

      CSV.foreach(csv_file_path, headers: true, encoding: encoding).with_index do |row, i|
        next if row.values_at.all?(&:blank?)

        values = row.to_h.values
        passengers_in_csv << values.first.strip.downcase if values.first.present?

        service = RowService.new(
          values: values,
          onboarding: onboarding,
          passengers: passengers,
          departments: departments,
          work_roles: work_roles
        )

        line = i + 2
        errors[line] = service.errors unless service.execute.success?

        handle_line_error(line: line, status: service.status, errors: service.errors)
      end

      disable_missing_passengers(passengers_in_csv)
    end

    private def company
      fail "#{self.class.name} doesn't implement '#{__method__}'"
    end

    private def handle_line_error(*)
      fail "#{self.class.name} doesn't implement '#{__method__}'"
    end

    private def handle_encoding_error
      fail "#{self.class.name} doesn't implement '#{__method__}'"
    end

    private def csv_file_path
      fail "#{self.class.name} doesn't implement '#{__method__}'"
    end

    private def total_lines
      @total_lines ||= CSV.foreach(csv_file_path, headers: true).count{ |row| row.values_at.any?(&:present?) }
    end

    private def passengers
      @passengers ||= company.passengers_dataset.to_hash(:email, :id)
    end

    private def departments
      @departments ||= company.departments_dataset.to_hash(:name, :id)
    end

    private def work_roles
      @work_roles ||= company.work_roles_dataset.to_hash(:name, :id)
    end

    private def onboarding
      return @onboarding if defined?(@onboarding)

      @onboarding = (params[:onboarding].to_s == 'true').presence
    end

    private def disable_missing_passengers(passengers_in_csv)
      missing_passengers = passengers.keys - passengers_in_csv
      member_ids = company.passengers_dataset
        .where(added_through_hr_feed: true, email: missing_passengers)
        .pluck(:id)
      DB[:members].where(id: member_ids).update(active: false)
    end

    class RowService < ApplicationService
      include ApplicationService::Context
      include ApplicationService::ModelMethods

      delegate :company, to: :context

      attributes :values, :onboarding, :passengers, :departments, :work_roles

      def execute!
        transaction do
          create_model(department, department_params) unless params[:department_name].blank? || department_id.present?
          create_model(work_role, work_role_params) unless params[:work_role_name].blank? || work_role_id.present?
          result { passenger_service.execute.result }

          if success? && company_address.present? && passenger_service.passenger.work_address.blank?
            assert { create_model(passenger_work_address) }
          end

          update_collections if success?
        end
      end

      def passenger_service
        @passenger_service ||=
          if passenger.present?
            Passengers::Update.new(passenger: passenger, params: passenger_params)
          else
            Passengers::Create.new(
              params: passenger_params.merge(added_through_hr_feed: true, notify_with_email: true, notify_with_sms: true)
            )
          end
      end

      def status
        return 'failed' unless success?

        passenger_service.is_a?(Passengers::Create) ? 'created' : 'updated'
      end

      def errors
        humanized_full_messages(passenger_service.errors)
      end

      private def update_collections
        passengers[passenger_service.passenger.email] ||= passenger_service.passenger.id
        departments[params[:department_name]] ||= department.id if params[:department_name].present?
        work_roles[params[:work_role_name]] ||= work_role.id if params[:work_role_name].present?
      end

      private def passenger_work_address
        @passenger_work_address ||= PassengerAddress.new(
          type:         "work".freeze,
          passenger_id: passenger_service.passenger.id,
          address_id:   company_address.id
        )
      end

      private def company_address
        company.address
      end

      private def phone
        ::PhoneNumbers::Internationalizer.new(phone_number: params[:phone]).execute.result
      end

      private def mobile
        ::PhoneNumbers::Internationalizer.new(phone_number: params[:mobile]).execute.result
      end

      private def department_id
        departments[params[:department_name]] || department.id
      end

      private def department
        @department ||= Department.new(company: company)
      end

      private def work_role_id
        work_roles[params[:work_role_name]] || work_role.id
      end

      private def work_role
        @work_role ||= WorkRole.new(company: company)
      end

      private def passenger_params
        params.slice(
          :email,
          :first_name,
          :last_name,
          :payroll,
          :cost_centre,
          :division
        ).merge(
          phone: phone,
          mobile: mobile,
          onboarding: onboarding,
          department_id: department_id,
          work_role_id: work_role_id,
          role_type: role_type,
          active: active
        )
      end

      private def department_params
        {name: params[:department_name]}
      end

      private def work_role_params
        {name: params[:work_role_name]}
      end

      private def passenger
        @passenger ||= company.passengers_dataset.first(email: params[:email])
      end

      private def role_type
        ROLE_NAME_MAPPING[params[:user_role_name]] || passenger&.role_name || 'passenger'.freeze
      end

      private def active
        role_type == 'companyadmin' || params[:status]&.downcase == 'active'
      end

      private def params
        @params ||=
          %i(
            email
            status
            first_name
            last_name
            phone
            mobile
            department_name
            user_role_name
            work_role_name
            payroll
            cost_centre
            division
          ).zip(sanitized_values(values)).to_h.tap do |p|
            p[:email]&.downcase!
          end
      end

      private def sanitized_values(values)
        values.map{ |v| v.try(:strip) || v }
      end
    end
  end
end
