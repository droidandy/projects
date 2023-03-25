class Comment < Sequel::Model
  plugin :application_model
  plugin :single_table_inheritance, :kind

  many_to_one :author, class: 'User'

  def validate
    super
    validates_presence :author
    validates_presence :text
  end
end

# Table: comments
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('comments_id_seq'::regclass)
#  kind       | comment_type                |
#  author_id  | integer                     | NOT NULL
#  member_id  | integer                     |
#  booking_id | integer                     |
#  company_id | integer                     |
#  text       | text                        |
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  comments_pkey             | PRIMARY KEY btree (id)
#  comments_author_id_index  | btree (author_id)
#  comments_booking_id_index | btree (booking_id)
#  comments_company_id_index | btree (company_id)
#  comments_member_id_index  | btree (member_id)
# Foreign key constraints:
#  comments_author_id_fkey  | (author_id) REFERENCES users(id)
#  comments_booking_id_fkey | (booking_id) REFERENCES bookings(id)
#  comments_company_id_fkey | (company_id) REFERENCES companies(id)
#  comments_member_id_fkey  | (member_id) REFERENCES users(id)
