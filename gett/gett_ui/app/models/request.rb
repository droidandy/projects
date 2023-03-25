class Request < Sequel::Model
  plugin :application_model

  def validate
    super
    validates_presence :url
  end
end

# Table: requests
# Columns:
#  id               | integer                     | PRIMARY KEY DEFAULT nextval('requests_id_seq'::regclass)
#  service_provider | service_provider            |
#  status           | request_status              | NOT NULL DEFAULT 'created'::request_status
#  url              | text                        | NOT NULL
#  subject_gid      | text                        |
#  request_payload  | jsonb                       |
#  response_payload | jsonb                       |
#  created_at       | timestamp without time zone | NOT NULL
#  updated_at       | timestamp without time zone | NOT NULL
# Indexes:
#  requests_pkey              | PRIMARY KEY btree (id)
#  requests_subject_gid_index | btree (subject_gid)
