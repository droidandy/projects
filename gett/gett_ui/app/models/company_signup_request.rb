class CompanySignupRequest < Sequel::Model
  plugin :application_model

  def validate
    super
    validates_presence :name
  end
end

# Table: company_signup_requests
# Columns:
#  id           | integer                     | PRIMARY KEY DEFAULT nextval('company_signup_requests_id_seq'::regclass)
#  name         | text                        | NOT NULL
#  phone_number | text                        |
#  email        | text                        |
#  country      | text                        |
#  created_at   | timestamp without time zone | NOT NULL
#  updated_at   | timestamp without time zone | NOT NULL
#  user_name    | text                        |
#  comment      | text                        |
# Indexes:
#  company_signup_requests_pkey | PRIMARY KEY btree (id)
