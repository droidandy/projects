Sequel.migration do
  up do
    create_enum :comment_type, %w(Comment BookingComment UserComment MemberComment CompanyComment)

    create_table :comments do
      primary_key :id
      comment_type :kind
      foreign_key :author_id, :users, null: false
      foreign_key :member_id, :users
      foreign_key :booking_id, :bookings
      foreign_key :company_id, :companies
      String :text

      timestamps
    end

    from(:comments).insert(
      [:kind, :author_id, :booking_id, :text, :created_at, :updated_at],
      from(:booking_comments).select('BookingComment', :user_id, :booking_id, :text, :created_at, :updated_at)
    )

    drop_table :booking_comments
  end

  down do
    create_table :booking_comments do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false
      foreign_key :user_id, :users, null: false
      String :text

      timestamps
    end

    from(:booking_comments).insert(
      [:user_id, :booking_id, :text, :created_at, :updated_at],
      from(:comments)
        .select(:author_id, :booking_id, :text, :created_at, :updated_at)
        .exclude(booking_id: nil)
    )

    drop_table :comments
    drop_enum :comment_type
  end
end
