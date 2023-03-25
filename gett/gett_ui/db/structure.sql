--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.10
-- Dumped by pg_dump version 9.6.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: address_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.address_type AS ENUM (
    'home',
    'work',
    'favorite',
    'legal',
    'pickup',
    'destination',
    'stop'
);


--
-- Name: alert_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.alert_level AS ENUM (
    'critical',
    'medium',
    'normal'
);


--
-- Name: alert_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.alert_type AS ENUM (
    'api_failure',
    'driver_is_late',
    'order_changed',
    'has_no_driver',
    'has_no_supplier',
    'flight_cancelled',
    'flight_redirected',
    'flight_diverted',
    'flight_delayed'
);


--
-- Name: booking_source_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.booking_source_type AS ENUM (
    'api',
    'web',
    'web_mobile',
    'mobile_app'
);


--
-- Name: booking_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.booking_status AS ENUM (
    'order_received',
    'locating',
    'on_the_way',
    'arrived',
    'in_progress',
    'completed',
    'cancelled',
    'rejected',
    'processing',
    'creating',
    'customer_care'
);


--
-- Name: comment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.comment_type AS ENUM (
    'Comment',
    'BookingComment',
    'UserComment',
    'MemberComment',
    'CompanyComment'
);


--
-- Name: company_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.company_type AS ENUM (
    'enterprise',
    'affiliate',
    'bbc'
);


--
-- Name: csv_report_recurrence; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.csv_report_recurrence AS ENUM (
    'monthly',
    'weekly',
    'daily'
);


--
-- Name: currency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.currency AS ENUM (
    'EUR',
    'USD',
    'GBP'
);


--
-- Name: ddi_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ddi_type AS ENUM (
    'small',
    'standard',
    'mega',
    'custom',
    'key'
);


--
-- Name: direct_debit_mandate_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.direct_debit_mandate_status AS ENUM (
    'initiated',
    'pending',
    'active',
    'failed',
    'cancelled'
);


--
-- Name: direct_debit_payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.direct_debit_payment_status AS ENUM (
    'pending',
    'successful',
    'failed'
);


--
-- Name: invoice_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invoice_type AS ENUM (
    'invoice',
    'credit_note',
    'cc_invoice'
);


--
-- Name: invoicing_schedule; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invoicing_schedule AS ENUM (
    'weekly',
    'monthly'
);


--
-- Name: payment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_type AS ENUM (
    'account',
    'cash',
    'passenger_payment_card',
    'company_payment_card',
    'personal_payment_card',
    'business_payment_card',
    'passenger_payment_card_periodic'
);


--
-- Name: payments_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payments_status AS ENUM (
    'initialized',
    'pending',
    'authorized',
    'captured',
    'refunded',
    'voided',
    'failed',
    'credited'
);


--
-- Name: pr_booking_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.pr_booking_type AS ENUM (
    'both',
    'asap',
    'future'
);


--
-- Name: pr_price_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.pr_price_type AS ENUM (
    'fixed',
    'meter'
);


--
-- Name: pr_rule_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.pr_rule_type AS ENUM (
    'point_to_point',
    'area'
);


--
-- Name: pr_time_frame; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.pr_time_frame AS ENUM (
    'daily',
    'custom'
);


--
-- Name: recurrence_preset_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.recurrence_preset_type AS ENUM (
    'daily',
    'weekly',
    'monthly'
);


--
-- Name: request_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.request_status AS ENUM (
    'created',
    'sent',
    'received',
    'processed',
    'error'
);


--
-- Name: service_provider; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.service_provider AS ENUM (
    'ot',
    'gett',
    'flightstats',
    'carey',
    'get_e',
    'nexmo',
    'manual',
    'splyt'
);


--
-- Name: tr_location; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tr_location AS ENUM (
    'GreaterLondon',
    'CentralLondon',
    'Birmingham',
    'Leeds',
    'Glasgow',
    'Manchester',
    'Edinburgh',
    'Liverpool'
);


--
-- Name: user_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_type AS ENUM (
    'User',
    'Member'
);


--
-- Name: concat_space(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.concat_space(s1 text, s2 text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$      SELECT
        CASE
        WHEN s1 IS NULL THEN s2
        WHEN s2 IS NULL THEN s1
        ELSE s1 || ' ' || s2
        END
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    line text,
    lat numeric(10,7),
    lng numeric(10,7),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    postal_code text,
    references_count integer DEFAULT 0 NOT NULL,
    country_code text DEFAULT 'GB'::text NOT NULL,
    timezone text,
    city text,
    airport_id integer,
    region text,
    street_name text,
    street_number text,
    point_of_interest text
);


--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: airports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.airports (
    id integer NOT NULL,
    name text,
    iata text,
    lat double precision,
    lng double precision
);


--
-- Name: airports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.airports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: airports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.airports_id_seq OWNED BY public.airports.id;


--
-- Name: alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    type public.alert_type NOT NULL,
    level public.alert_level NOT NULL,
    message text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    resolved boolean DEFAULT false NOT NULL
);


--
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alerts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    user_id integer NOT NULL,
    key text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    model_type text,
    model_pk integer,
    model_ref text,
    event text,
    changed text,
    version integer DEFAULT 0,
    user_id integer,
    username text,
    original_user_id integer,
    original_username text,
    created_at timestamp without time zone
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: booker_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booker_references (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    value text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    booking_reference_name text NOT NULL
);


--
-- Name: booker_references_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booker_references_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booker_references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booker_references_id_seq OWNED BY public.booker_references.id;


--
-- Name: bookers_passengers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookers_passengers (
    booker_id integer NOT NULL,
    passenger_id integer NOT NULL
);


--
-- Name: booking_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_addresses (
    id integer NOT NULL,
    address_id integer NOT NULL,
    booking_id integer NOT NULL,
    address_type public.address_type NOT NULL,
    stop_info jsonb,
    passenger_address_type public.address_type
);


--
-- Name: booking_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_addresses_id_seq OWNED BY public.booking_addresses.id;


--
-- Name: booking_charges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_charges (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    fare_cost integer DEFAULT 0 NOT NULL,
    handling_fee integer DEFAULT 0 NOT NULL,
    booking_fee integer DEFAULT 0 NOT NULL,
    paid_waiting_time_fee integer DEFAULT 0 NOT NULL,
    stops_text text,
    stops_fee integer DEFAULT 0 NOT NULL,
    phone_booking_fee integer DEFAULT 0 NOT NULL,
    tips integer DEFAULT 0 NOT NULL,
    vat integer DEFAULT 0 NOT NULL,
    total_cost integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    cancellation_fee integer DEFAULT 0 NOT NULL,
    run_in_fee integer DEFAULT 0 NOT NULL,
    additional_fee integer DEFAULT 0 NOT NULL,
    extra1 integer DEFAULT 0 NOT NULL,
    extra2 integer DEFAULT 0 NOT NULL,
    extra3 integer DEFAULT 0 NOT NULL,
    free_waiting_time integer DEFAULT 0,
    paid_waiting_time integer DEFAULT 0,
    international_booking_fee integer DEFAULT 0 NOT NULL,
    vatable_ride_fees integer DEFAULT 0 NOT NULL,
    non_vatable_ride_fees integer DEFAULT 0 NOT NULL,
    service_fees integer DEFAULT 0 NOT NULL,
    vatable_extra_fees integer DEFAULT 0 NOT NULL,
    non_vatable_extra_fees integer DEFAULT 0 NOT NULL,
    manual boolean DEFAULT false NOT NULL
);


--
-- Name: booking_charges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_charges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_charges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_charges_id_seq OWNED BY public.booking_charges.id;


--
-- Name: booking_drivers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_drivers (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    name text,
    rating double precision,
    image_url text,
    phone_number text,
    lat double precision,
    lng double precision,
    eta integer,
    distance integer,
    will_arrive_at timestamp without time zone,
    pickup_lat double precision,
    pickup_lng double precision,
    vehicle public.hstore,
    path_points jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    pickup_distance double precision,
    trip_rating integer,
    location_updated_at timestamp without time zone,
    vendor_name text,
    bearing integer,
    rating_reasons text[] DEFAULT ARRAY[]::text[] NOT NULL,
    phv_license text
);


--
-- Name: booking_drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_drivers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_drivers_id_seq OWNED BY public.booking_drivers.id;


--
-- Name: booking_indexes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_indexes (
    booking_id integer,
    local_scheduled_at timestamp without time zone,
    order_id text,
    passenger_full_name text,
    vendor_name text,
    service_id text,
    supplier_service_id text,
    passenger_id integer,
    company_id integer
);


--
-- Name: booking_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_messages (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    user_id integer NOT NULL,
    text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: booking_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_messages_id_seq OWNED BY public.booking_messages.id;


--
-- Name: booking_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_references (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name text,
    active boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    mandatory boolean DEFAULT false NOT NULL,
    validation_required boolean DEFAULT false NOT NULL,
    priority integer NOT NULL,
    dropdown boolean DEFAULT false NOT NULL,
    sftp_server boolean DEFAULT false NOT NULL,
    cost_centre boolean DEFAULT false NOT NULL,
    conditional boolean DEFAULT false NOT NULL,
    attachment text
);


--
-- Name: booking_references_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_references_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_references_id_seq OWNED BY public.booking_references.id;


--
-- Name: booking_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_schedules (
    id integer NOT NULL,
    custom boolean DEFAULT false NOT NULL,
    preset_type public.recurrence_preset_type,
    recurrence_factor integer,
    starting_at timestamp without time zone,
    ending_at timestamp without time zone,
    workdays_only boolean,
    weekdays integer DEFAULT 0 NOT NULL,
    scheduled_ats timestamp without time zone[] DEFAULT '{}'::timestamp without time zone[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: booking_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_schedules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_schedules_id_seq OWNED BY public.booking_schedules.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    booker_id integer NOT NULL,
    passenger_id integer,
    passenger_first_name text,
    passenger_last_name text,
    passenger_phone text,
    message text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    status public.booking_status DEFAULT 'creating'::public.booking_status NOT NULL,
    vehicle_id integer,
    travel_reason_id integer,
    scheduled_at timestamp without time zone NOT NULL,
    company_info_id integer,
    arrived_at timestamp without time zone,
    started_at timestamp without time zone,
    ended_at timestamp without time zone,
    cancelled_at timestamp without time zone,
    flight text,
    fare_quote integer DEFAULT 0 NOT NULL,
    payment_method public.payment_type,
    service_id text,
    phone_booking boolean DEFAULT false NOT NULL,
    cancellation_requested_at timestamp without time zone,
    asap boolean DEFAULT true NOT NULL,
    lock_version integer DEFAULT 0 NOT NULL,
    allocated_at timestamp without time zone,
    quote_id text,
    ot_confirmation_number text,
    ot_job_status text,
    ot_vehicle_state text,
    booked_at timestamp without time zone,
    travel_distance double precision,
    cancelled_by_id integer,
    rejected_at timestamp without time zone,
    started_locating_at timestamp without time zone,
    carey_token text,
    payment_card_id integer,
    ot_waiting_time integer,
    customer_care_message text,
    status_before_cancellation public.booking_status,
    cancellation_fee boolean DEFAULT true,
    vip boolean DEFAULT false NOT NULL,
    ftr boolean DEFAULT false NOT NULL,
    cancelled_through_back_office boolean DEFAULT false NOT NULL,
    customer_care_at timestamp without time zone,
    cancellation_quote integer DEFAULT 0,
    ot_extra_cost integer DEFAULT 0 NOT NULL,
    schedule_id integer,
    recurring_next boolean DEFAULT false,
    room text,
    international_flag boolean DEFAULT false,
    special_requirements text[] DEFAULT '{}'::text[],
    vehicle_vendor_id integer,
    source_type public.booking_source_type,
    cancellation_reason text,
    custom_attributes jsonb,
    critical_flag boolean,
    supplier_service_id text,
    billed boolean DEFAULT false NOT NULL,
    pricing_rule_fare_quote integer
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: bookings_invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings_invoices (
    invoice_id integer NOT NULL,
    booking_id integer NOT NULL
);


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    kind public.comment_type,
    author_id integer NOT NULL,
    member_id integer,
    booking_id integer,
    company_id integer,
    text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    destination_required boolean DEFAULT false,
    booking_reference_required boolean DEFAULT false,
    booking_reference_validation boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    logo text,
    company_type public.company_type DEFAULT 'enterprise'::public.company_type NOT NULL,
    gett_business_id text NOT NULL,
    ot_username text,
    ot_client_number text,
    default_driver_message text,
    multiple_booking boolean DEFAULT true NOT NULL,
    fake boolean DEFAULT false NOT NULL,
    payroll_required boolean DEFAULT false,
    cost_centre_required boolean DEFAULT false,
    customer_care_password text,
    hr_feed_enabled boolean DEFAULT false NOT NULL,
    sftp_username text,
    sftp_password text,
    marketing_allowed boolean DEFAULT false NOT NULL,
    bookings_validation_enabled boolean DEFAULT false NOT NULL,
    api_enabled boolean DEFAULT false NOT NULL,
    sap_id text,
    credit_rate_registration_number text,
    credit_rate_incorporated_at date,
    credit_rate_status text DEFAULT 'na'::text NOT NULL,
    booker_notifications_emails text,
    booker_notifications boolean DEFAULT true NOT NULL,
    ddi_id integer NOT NULL,
    custom_attributes public.hstore,
    critical_flag_due_on date,
    allow_preferred_vendor boolean DEFAULT false,
    api_notifications_enabled boolean DEFAULT true
);


--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: companies_special_requirements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies_special_requirements (
    company_id integer NOT NULL,
    special_requirement_id integer NOT NULL
);


--
-- Name: company_credit_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_credit_rates (
    id integer NOT NULL,
    company_id integer NOT NULL,
    value integer,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: company_credit_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_credit_rates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_credit_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_credit_rates_id_seq OWNED BY public.company_credit_rates.id;


--
-- Name: company_infos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_infos (
    id integer NOT NULL,
    company_id integer,
    name text NOT NULL,
    legal_name text,
    vat_number text,
    cost_centre text,
    address_id integer,
    legal_address_id integer,
    salesman_id integer,
    contact_id integer,
    booking_fee double precision,
    run_in_fee double precision,
    handling_fee double precision,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_number text,
    sort_code text,
    phone_booking_fee double precision DEFAULT 1.0 NOT NULL,
    tips double precision,
    cancellation_before_arrival_fee integer DEFAULT 0 NOT NULL,
    cancellation_after_arrival_fee integer DEFAULT 0 NOT NULL,
    gett_cancellation_before_arrival_fee double precision DEFAULT 0 NOT NULL,
    gett_cancellation_after_arrival_fee double precision DEFAULT 0 NOT NULL,
    account_manager_id integer,
    get_e_cancellation_before_arrival_fee integer DEFAULT 0 NOT NULL,
    get_e_cancellation_after_arrival_fee integer DEFAULT 0 NOT NULL,
    international_booking_fee double precision DEFAULT 0 NOT NULL,
    quote_price_increase_percentage double precision DEFAULT 0 NOT NULL,
    quote_price_increase_pounds double precision DEFAULT 0 NOT NULL,
    splyt_cancellation_before_arrival_fee integer DEFAULT 0 NOT NULL,
    splyt_cancellation_after_arrival_fee integer DEFAULT 0 NOT NULL,
    country_code text,
    carey_cancellation_before_arrival_fee integer DEFAULT 0 NOT NULL,
    carey_cancellation_after_arrival_fee integer DEFAULT 0 NOT NULL,
    system_fx_rate_increase_percentage double precision DEFAULT 0 NOT NULL
);


--
-- Name: company_infos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_infos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_infos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_infos_id_seq OWNED BY public.company_infos.id;


--
-- Name: company_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_links (
    company_id integer NOT NULL,
    linked_company_id integer NOT NULL
);


--
-- Name: company_signup_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_signup_requests (
    id integer NOT NULL,
    name text NOT NULL,
    phone_number text,
    email text,
    country text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_name text,
    comment text
);


--
-- Name: company_signup_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_signup_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_signup_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_signup_requests_id_seq OWNED BY public.company_signup_requests.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    company_id integer NOT NULL,
    "primary" boolean DEFAULT true NOT NULL,
    phone text,
    mobile text,
    fax text,
    email text,
    first_name text,
    last_name text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    address_id integer,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: credit_note_lines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_note_lines (
    id integer NOT NULL,
    credit_note_id integer NOT NULL,
    booking_id integer NOT NULL,
    amount_cents integer NOT NULL,
    vat integer DEFAULT 0 NOT NULL
);


--
-- Name: credit_note_lines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.credit_note_lines_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: credit_note_lines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credit_note_lines_id_seq OWNED BY public.credit_note_lines.id;


--
-- Name: csv_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.csv_reports (
    id integer NOT NULL,
    company_id integer NOT NULL,
    recurrence public.csv_report_recurrence DEFAULT 'monthly'::public.csv_report_recurrence NOT NULL,
    recurrence_starts_at timestamp without time zone NOT NULL,
    name text NOT NULL,
    delimiter text DEFAULT ','::text,
    recipients text NOT NULL,
    headers public.hstore,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: csv_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.csv_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: csv_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.csv_reports_id_seq OWNED BY public.csv_reports.id;


--
-- Name: ddis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ddis (
    id integer NOT NULL,
    type public.ddi_type NOT NULL,
    phone text NOT NULL
);


--
-- Name: ddis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ddis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ddis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ddis_id_seq OWNED BY public.ddis.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: deployment_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deployment_notifications (
    id integer NOT NULL,
    text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: deployment_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deployment_notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deployment_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deployment_notifications_id_seq OWNED BY public.deployment_notifications.id;


--
-- Name: direct_debit_mandates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.direct_debit_mandates (
    id integer NOT NULL,
    company_id integer NOT NULL,
    created_by_id integer NOT NULL,
    go_cardless_redirect_flow_id text NOT NULL,
    go_cardless_mandate_id text,
    status public.direct_debit_mandate_status NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: direct_debit_mandates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.direct_debit_mandates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: direct_debit_mandates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.direct_debit_mandates_id_seq OWNED BY public.direct_debit_mandates.id;


--
-- Name: direct_debit_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.direct_debit_payments (
    id integer NOT NULL,
    invoice_id integer NOT NULL,
    direct_debit_mandate_id integer NOT NULL,
    go_cardless_payment_id text NOT NULL,
    amount_cents integer NOT NULL,
    currency text DEFAULT 'GBP'::text NOT NULL,
    status public.direct_debit_payment_status NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: direct_debit_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.direct_debit_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: direct_debit_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.direct_debit_payments_id_seq OWNED BY public.direct_debit_payments.id;


--
-- Name: drivers_channels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drivers_channels (
    id integer NOT NULL,
    channel text NOT NULL,
    location point NOT NULL,
    valid_until timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    country_code text
);


--
-- Name: drivers_channels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.drivers_channels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: drivers_channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.drivers_channels_id_seq OWNED BY public.drivers_channels.id;


--
-- Name: errors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.errors (
    id integer NOT NULL,
    subject_gid text,
    fingerprint text NOT NULL,
    error_class text NOT NULL,
    message text NOT NULL,
    backtrace text[] NOT NULL,
    raised_count integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: errors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.errors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: errors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.errors_id_seq OWNED BY public.errors.id;


--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedbacks (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer,
    message text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedbacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedbacks_id_seq OWNED BY public.feedbacks.id;


--
-- Name: incomings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incomings (
    id integer NOT NULL,
    booking_id integer,
    service_type public.service_provider NOT NULL,
    payload jsonb,
    api_errors jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: incomings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.incomings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: incomings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.incomings_id_seq OWNED BY public.incomings.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    company_id integer NOT NULL,
    invoicing_schedule public.invoicing_schedule NOT NULL,
    payment_terms integer NOT NULL,
    billing_period_start timestamp without time zone NOT NULL,
    billing_period_end timestamp without time zone NOT NULL,
    overdue_at timestamp without time zone NOT NULL,
    amount_cents integer NOT NULL,
    paid_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    paid_by_id integer,
    business_credit_cents integer,
    type public.invoice_type DEFAULT 'invoice'::public.invoice_type NOT NULL,
    credited_invoice_id integer,
    created_by_id integer,
    paid_amount_cents integer,
    applied_manually boolean DEFAULT false NOT NULL,
    member_id integer,
    under_review boolean DEFAULT false NOT NULL
);


--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: invoices_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices_payments (
    invoice_id integer NOT NULL,
    payment_id integer NOT NULL
);


--
-- Name: locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    company_id integer NOT NULL,
    address_id integer NOT NULL,
    name text NOT NULL,
    pickup_message text,
    destination_message text,
    "default" boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id integer,
    company_id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    phone text,
    mobile text,
    work_role_id integer,
    department_id integer,
    onboarding boolean,
    notify_with_sms boolean DEFAULT false,
    notify_with_email boolean DEFAULT false,
    payroll text,
    cost_centre text,
    division text,
    member_role_id integer NOT NULL,
    wheelchair_user boolean DEFAULT false,
    added_through_hr_feed boolean DEFAULT false NOT NULL,
    allow_personal_card_usage boolean DEFAULT false,
    notify_with_calendar_event boolean DEFAULT false NOT NULL,
    vip boolean DEFAULT false NOT NULL,
    default_vehicle text,
    notify_with_push boolean DEFAULT true NOT NULL,
    custom_attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    guide_passed boolean DEFAULT false,
    default_phone_type text DEFAULT 'phone'::text NOT NULL,
    allow_preferred_vendor boolean DEFAULT false,
    assigned_to_all_passengers boolean DEFAULT false
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer,
    company_id integer,
    body text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    title text,
    recipient_id integer,
    message_type text
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    booking_id integer,
    status public.payments_status DEFAULT 'initialized'::public.payments_status NOT NULL,
    amount_cents integer NOT NULL,
    currency public.currency DEFAULT 'GBP'::public.currency NOT NULL,
    description text,
    payments_os_id text,
    error_description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    zooz_request_id text,
    fingerprint text DEFAULT ''::text NOT NULL,
    retries integer DEFAULT 0 NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password_digest text,
    kind public.user_type,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    reset_password_token text,
    reset_password_sent_at timestamp without time zone,
    last_logged_in_at timestamp without time zone,
    notification_seen_at timestamp without time zone,
    first_name text NOT NULL,
    last_name text NOT NULL,
    avatar text,
    user_role_id integer,
    login_count integer DEFAULT 0,
    invalid_passwords_count integer DEFAULT 0 NOT NULL,
    locks_count integer DEFAULT 0 NOT NULL,
    locked boolean DEFAULT false NOT NULL
);


--
-- Name: orders; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.orders AS
 SELECT NULL::integer AS cost_settled,
    NULL::integer AS cost_to_be_paid,
    NULL::integer AS total_fees,
    NULL::integer AS total_fare,
    booking_charges.fare_cost AS final_cost_excl_vat,
    booking_charges.total_cost AS final_cost_incl_vat,
    company_infos.company_id,
    company_infos.name AS company_name,
    company_addresses.line AS company_address,
    contacts.email AS company_email,
    ((contacts.first_name || ' '::text) || contacts.last_name) AS company_contact_person,
    ((salesmen.first_name || ' '::text) || salesmen.last_name) AS company_account_manager,
    NULL::integer AS company_charge_fees_on_credit_card,
    NULL::integer AS company_charge_fees_from_client,
    NULL::text AS company_business_type,
    bookings.id AS order_id,
    NULL::text AS order_class,
    bookings.status AS order_status,
    bookings.created_at AS order_created_at,
    bookings.scheduled_at AS order_scheduled_at,
    bookings.arrived_at AS order_arrived_at,
    bookings.started_at AS order_started_at,
    bookings.ended_at AS order_ended_at,
    bookings.cancelled_at AS order_cancelled_at,
    pickup_addresses.line AS order_origin_address,
    destination_addresses.line AS order_destination_address,
    NULL::text AS order_dropoff_address,
    NULL::integer AS order_driving_distance,
    "references"."values" AS order_references,
    NULL::text AS order_reason_for_travel,
    NULL::integer AS order_fixed_price,
    NULL::integer AS order_taxi_meter,
    NULL::integer AS order_waiting_time,
    NULL::integer AS order_waiting_time_cost,
    NULL::integer AS order_additional_cost,
    NULL::integer AS order_extras_cost,
    5 AS order_cancellation_cost,
    NULL::integer AS order_stop_point_cost,
    NULL::integer AS order_gratuity_cost,
    NULL::integer AS order_vat_fee,
    NULL::integer AS order_has_credit_card_debt,
    NULL::integer AS order_credit_card_type,
    NULL::integer AS order_credit_card_ending,
    company_infos.run_in_fee AS order_run_in_fee,
    company_infos.booking_fee AS order_booking_fee,
    company_infos.handling_fee AS order_handling_fee,
        CASE
            WHEN (bookings.passenger_id IS NULL) THEN ((bookings.passenger_first_name || ' '::text) || bookings.passenger_last_name)
            ELSE ((passenger_accounts.first_name || ' '::text) || passenger_accounts.last_name)
        END AS riding_user_name,
    passenger_accounts.email AS riding_user_email,
    passengers.id AS riding_user_employee_id,
    departments.name AS riding_user_department,
    ((booker_accounts.first_name || ' '::text) || booker_accounts.last_name) AS ordering_user_name,
    payments.status AS order_payment_status,
    payments.error_description AS order_payment_errors,
    bookings.payment_method AS order_payment_type
   FROM ((((((((((((((((public.bookings
     JOIN public.company_infos ON ((company_infos.id = bookings.company_info_id)))
     LEFT JOIN public.users salesmen ON ((salesmen.id = company_infos.salesman_id)))
     LEFT JOIN public.addresses company_addresses ON ((company_addresses.id = company_infos.address_id)))
     LEFT JOIN public.contacts ON ((contacts.id = company_infos.contact_id)))
     LEFT JOIN ( SELECT booker_references.booking_id,
            public.hstore(array_agg(booker_references.booking_reference_name), array_agg(booker_references.value)) AS "values"
           FROM public.booker_references
          GROUP BY booker_references.booking_id) "references" ON (("references".booking_id = bookings.id)))
     LEFT JOIN public.booking_addresses pickup_bas ON (((pickup_bas.booking_id = bookings.id) AND (pickup_bas.address_type = 'pickup'::public.address_type))))
     LEFT JOIN public.booking_addresses dest_bas ON (((dest_bas.booking_id = bookings.id) AND (dest_bas.address_type = 'destination'::public.address_type))))
     LEFT JOIN public.addresses pickup_addresses ON ((pickup_addresses.id = pickup_bas.address_id)))
     LEFT JOIN public.addresses destination_addresses ON ((destination_addresses.id = dest_bas.address_id)))
     LEFT JOIN public.members passengers ON ((passengers.id = bookings.passenger_id)))
     LEFT JOIN public.members bookers ON ((bookers.id = bookings.booker_id)))
     LEFT JOIN public.users passenger_accounts ON ((passenger_accounts.id = passengers.id)))
     LEFT JOIN public.users booker_accounts ON ((booker_accounts.id = bookers.id)))
     LEFT JOIN public.departments ON ((departments.id = passengers.department_id)))
     LEFT JOIN public.payments ON ((payments.booking_id = bookings.id)))
     LEFT JOIN public.booking_charges ON ((booking_charges.booking_id = bookings.id)));


--
-- Name: passenger_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passenger_addresses (
    id integer NOT NULL,
    passenger_id integer NOT NULL,
    address_id integer NOT NULL,
    name text,
    type public.address_type NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    pickup_message text,
    destination_message text
);


--
-- Name: passenger_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.passenger_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: passenger_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.passenger_addresses_id_seq OWNED BY public.passenger_addresses.id;


--
-- Name: payment_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_cards (
    id integer NOT NULL,
    passenger_id integer,
    holder_name text NOT NULL,
    last_4 text NOT NULL,
    expiration_month integer NOT NULL,
    expiration_year integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    token text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    personal boolean DEFAULT true NOT NULL,
    company_id integer,
    "default" boolean DEFAULT false NOT NULL
);


--
-- Name: payment_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_cards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_cards_id_seq OWNED BY public.payment_cards.id;


--
-- Name: payment_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_options (
    id integer NOT NULL,
    company_id integer NOT NULL,
    business_credit double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    payment_terms integer NOT NULL,
    invoicing_schedule public.invoicing_schedule NOT NULL,
    split_invoice text,
    additional_billing_recipients text,
    payment_types public.payment_type[] DEFAULT ARRAY[]::public.payment_type[],
    default_payment_type public.payment_type NOT NULL,
    business_credit_expended boolean DEFAULT false
);


--
-- Name: payment_options_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_options_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_options_id_seq OWNED BY public.payment_options.id;


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: predefined_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.predefined_addresses (
    id integer NOT NULL,
    line text NOT NULL,
    additional_terms text,
    postal_code text,
    lat double precision,
    lng double precision,
    country_code text DEFAULT 'GB'::text NOT NULL,
    timezone text,
    city text,
    airport_id integer,
    region text,
    street_name text,
    street_number text,
    point_of_interest text
);


--
-- Name: predefined_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.predefined_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: predefined_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.predefined_addresses_id_seq OWNED BY public.predefined_addresses.id;


--
-- Name: pricing_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pricing_rules (
    id integer NOT NULL,
    company_id integer,
    name text NOT NULL,
    vehicle_types text[] DEFAULT '{}'::text[] NOT NULL,
    active boolean DEFAULT true NOT NULL,
    rule_type public.pr_rule_type NOT NULL,
    price_type public.pr_price_type NOT NULL,
    pickup_address_id integer,
    destination_address_id integer,
    pickup_polygon public.geography(Polygon,4326),
    destination_polygon public.geography(Polygon,4326),
    pickup_point public.geography(Point,4326),
    destination_point public.geography(Point,4326),
    base_fare double precision,
    initial_cost double precision,
    after_distance double precision,
    after_cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    booking_type public.pr_booking_type DEFAULT 'both'::public.pr_booking_type NOT NULL,
    min_time time without time zone DEFAULT '00:00:00'::time without time zone,
    max_time time without time zone DEFAULT '23:59:59'::time without time zone,
    time_frame public.pr_time_frame DEFAULT 'daily'::public.pr_time_frame NOT NULL,
    starting_at timestamp without time zone,
    ending_at timestamp without time zone
);


--
-- Name: pricing_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pricing_rules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pricing_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pricing_rules_id_seq OWNED BY public.pricing_rules.id;


--
-- Name: reference_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reference_entries (
    id bigint NOT NULL,
    booking_reference_id integer NOT NULL,
    value text NOT NULL
);


--
-- Name: reference_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reference_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reference_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reference_entries_id_seq OWNED BY public.reference_entries.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    service_provider public.service_provider,
    status public.request_status DEFAULT 'created'::public.request_status NOT NULL,
    url text NOT NULL,
    subject_gid text,
    request_payload jsonb,
    response_payload jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text DEFAULT 'booker'::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    filename text NOT NULL
);


--
-- Name: short_urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.short_urls (
    id integer NOT NULL,
    original_url text NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: short_urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.short_urls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: short_urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.short_urls_id_seq OWNED BY public.short_urls.id;


--
-- Name: special_requirements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.special_requirements (
    id integer NOT NULL,
    service_type text NOT NULL,
    key text NOT NULL,
    label text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: special_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.special_requirements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: special_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.special_requirements_id_seq OWNED BY public.special_requirements.id;


--
-- Name: travel_reasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_reasons (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: travel_reasons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_reasons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_reasons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_reasons_id_seq OWNED BY public.travel_reasons.id;


--
-- Name: travel_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_rules (
    id integer NOT NULL,
    name text NOT NULL,
    company_id integer NOT NULL,
    location public.tr_location,
    weekdays integer DEFAULT 0 NOT NULL,
    priority integer,
    min_distance double precision,
    max_distance double precision,
    min_time time without time zone DEFAULT '00:00:00'::time without time zone NOT NULL,
    max_time time without time zone DEFAULT '23:59:59'::time without time zone NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    allow_unregistered boolean DEFAULT false NOT NULL,
    cheapest boolean DEFAULT false NOT NULL
);


--
-- Name: travel_rules_departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_rules_departments (
    travel_rule_id integer NOT NULL,
    department_id integer NOT NULL
);


--
-- Name: travel_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_rules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_rules_id_seq OWNED BY public.travel_rules.id;


--
-- Name: travel_rules_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_rules_users (
    travel_rule_id integer NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: travel_rules_vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_rules_vehicles (
    travel_rule_id integer NOT NULL,
    vehicle_id integer NOT NULL
);


--
-- Name: travel_rules_work_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_rules_work_roles (
    travel_rule_id integer NOT NULL,
    work_role_id integer NOT NULL
);


--
-- Name: user_devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_devices (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    uuid text,
    device_type text,
    api_version text DEFAULT 'v1'::text,
    os_type text,
    client_os_version text,
    device_network_provider text,
    last_logged_in_at timestamp without time zone,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: user_devices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_devices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_devices_id_seq OWNED BY public.user_devices.id;


--
-- Name: user_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_locations (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: user_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_locations_id_seq OWNED BY public.user_locations.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    name text NOT NULL,
    value text NOT NULL,
    service_type public.service_provider NOT NULL,
    pre_eta integer DEFAULT 0 NOT NULL,
    earliest_available_in integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: vehicle_products; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vehicle_products AS
 SELECT vehicles.name,
    vehicles.service_type,
    vehicles.pre_eta,
    vehicles.earliest_available_in,
    array_agg(vehicles.value) AS "values",
    array_agg(vehicles.id) AS vehicle_ids
   FROM public.vehicles
  WHERE (vehicles.active IS TRUE)
  GROUP BY vehicles.name, vehicles.service_type, vehicles.pre_eta, vehicles.earliest_available_in;


--
-- Name: vehicle_vendors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_vendors (
    id integer NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    city text,
    specialized boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    phone text,
    postcode_prefixes text[] DEFAULT ARRAY[]::text[] NOT NULL
);


--
-- Name: vehicle_vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vehicle_vendors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vehicle_vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vehicle_vendors_id_seq OWNED BY public.vehicle_vendors.id;


--
-- Name: vehicle_vendors_vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_vendors_vehicles (
    vehicle_vendor_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vehicles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: work_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_roles (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: work_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.work_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: work_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.work_roles_id_seq OWNED BY public.work_roles.id;


--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: airports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.airports ALTER COLUMN id SET DEFAULT nextval('public.airports_id_seq'::regclass);


--
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: booker_references id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booker_references ALTER COLUMN id SET DEFAULT nextval('public.booker_references_id_seq'::regclass);


--
-- Name: booking_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_addresses ALTER COLUMN id SET DEFAULT nextval('public.booking_addresses_id_seq'::regclass);


--
-- Name: booking_charges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_charges ALTER COLUMN id SET DEFAULT nextval('public.booking_charges_id_seq'::regclass);


--
-- Name: booking_drivers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_drivers ALTER COLUMN id SET DEFAULT nextval('public.booking_drivers_id_seq'::regclass);


--
-- Name: booking_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_messages ALTER COLUMN id SET DEFAULT nextval('public.booking_messages_id_seq'::regclass);


--
-- Name: booking_references id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_references ALTER COLUMN id SET DEFAULT nextval('public.booking_references_id_seq'::regclass);


--
-- Name: booking_schedules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_schedules ALTER COLUMN id SET DEFAULT nextval('public.booking_schedules_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: company_credit_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_credit_rates ALTER COLUMN id SET DEFAULT nextval('public.company_credit_rates_id_seq'::regclass);


--
-- Name: company_infos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos ALTER COLUMN id SET DEFAULT nextval('public.company_infos_id_seq'::regclass);


--
-- Name: company_signup_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_signup_requests ALTER COLUMN id SET DEFAULT nextval('public.company_signup_requests_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: credit_note_lines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_note_lines ALTER COLUMN id SET DEFAULT nextval('public.credit_note_lines_id_seq'::regclass);


--
-- Name: csv_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_reports ALTER COLUMN id SET DEFAULT nextval('public.csv_reports_id_seq'::regclass);


--
-- Name: ddis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ddis ALTER COLUMN id SET DEFAULT nextval('public.ddis_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: deployment_notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deployment_notifications ALTER COLUMN id SET DEFAULT nextval('public.deployment_notifications_id_seq'::regclass);


--
-- Name: direct_debit_mandates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_mandates ALTER COLUMN id SET DEFAULT nextval('public.direct_debit_mandates_id_seq'::regclass);


--
-- Name: direct_debit_payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_payments ALTER COLUMN id SET DEFAULT nextval('public.direct_debit_payments_id_seq'::regclass);


--
-- Name: drivers_channels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers_channels ALTER COLUMN id SET DEFAULT nextval('public.drivers_channels_id_seq'::regclass);


--
-- Name: errors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.errors ALTER COLUMN id SET DEFAULT nextval('public.errors_id_seq'::regclass);


--
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks ALTER COLUMN id SET DEFAULT nextval('public.feedbacks_id_seq'::regclass);


--
-- Name: incomings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incomings ALTER COLUMN id SET DEFAULT nextval('public.incomings_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: passenger_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passenger_addresses ALTER COLUMN id SET DEFAULT nextval('public.passenger_addresses_id_seq'::regclass);


--
-- Name: payment_cards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_cards ALTER COLUMN id SET DEFAULT nextval('public.payment_cards_id_seq'::regclass);


--
-- Name: payment_options id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_options ALTER COLUMN id SET DEFAULT nextval('public.payment_options_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: predefined_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predefined_addresses ALTER COLUMN id SET DEFAULT nextval('public.predefined_addresses_id_seq'::regclass);


--
-- Name: pricing_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_rules ALTER COLUMN id SET DEFAULT nextval('public.pricing_rules_id_seq'::regclass);


--
-- Name: reference_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reference_entries ALTER COLUMN id SET DEFAULT nextval('public.reference_entries_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: short_urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.short_urls ALTER COLUMN id SET DEFAULT nextval('public.short_urls_id_seq'::regclass);


--
-- Name: special_requirements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.special_requirements ALTER COLUMN id SET DEFAULT nextval('public.special_requirements_id_seq'::regclass);


--
-- Name: travel_reasons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_reasons ALTER COLUMN id SET DEFAULT nextval('public.travel_reasons_id_seq'::regclass);


--
-- Name: travel_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules ALTER COLUMN id SET DEFAULT nextval('public.travel_rules_id_seq'::regclass);


--
-- Name: user_devices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_devices ALTER COLUMN id SET DEFAULT nextval('public.user_devices_id_seq'::regclass);


--
-- Name: user_locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_locations ALTER COLUMN id SET DEFAULT nextval('public.user_locations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vehicle_vendors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_vendors ALTER COLUMN id SET DEFAULT nextval('public.vehicle_vendors_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Name: work_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles ALTER COLUMN id SET DEFAULT nextval('public.work_roles_id_seq'::regclass);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: airports airports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_pkey PRIMARY KEY (id);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: booker_references booker_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booker_references
    ADD CONSTRAINT booker_references_pkey PRIMARY KEY (id);


--
-- Name: booking_addresses booking_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_addresses
    ADD CONSTRAINT booking_addresses_pkey PRIMARY KEY (id);


--
-- Name: booking_charges booking_charges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_charges
    ADD CONSTRAINT booking_charges_pkey PRIMARY KEY (id);


--
-- Name: booking_drivers booking_drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_drivers
    ADD CONSTRAINT booking_drivers_pkey PRIMARY KEY (id);


--
-- Name: booking_messages booking_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_messages
    ADD CONSTRAINT booking_messages_pkey PRIMARY KEY (id);


--
-- Name: booking_references booking_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_references
    ADD CONSTRAINT booking_references_pkey PRIMARY KEY (id);


--
-- Name: booking_schedules booking_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_schedules
    ADD CONSTRAINT booking_schedules_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: company_credit_rates company_credit_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_credit_rates
    ADD CONSTRAINT company_credit_rates_pkey PRIMARY KEY (id);


--
-- Name: company_infos company_infos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos
    ADD CONSTRAINT company_infos_pkey PRIMARY KEY (id);


--
-- Name: company_signup_requests company_signup_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_signup_requests
    ADD CONSTRAINT company_signup_requests_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: credit_note_lines credit_note_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_note_lines
    ADD CONSTRAINT credit_note_lines_pkey PRIMARY KEY (id);


--
-- Name: csv_reports csv_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_reports
    ADD CONSTRAINT csv_reports_pkey PRIMARY KEY (id);


--
-- Name: ddis ddis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ddis
    ADD CONSTRAINT ddis_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: deployment_notifications deployment_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deployment_notifications
    ADD CONSTRAINT deployment_notifications_pkey PRIMARY KEY (id);


--
-- Name: direct_debit_mandates direct_debit_mandates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_mandates
    ADD CONSTRAINT direct_debit_mandates_pkey PRIMARY KEY (id);


--
-- Name: direct_debit_payments direct_debit_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_payments
    ADD CONSTRAINT direct_debit_payments_pkey PRIMARY KEY (id);


--
-- Name: drivers_channels drivers_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers_channels
    ADD CONSTRAINT drivers_channels_pkey PRIMARY KEY (id);


--
-- Name: errors errors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.errors
    ADD CONSTRAINT errors_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: incomings incomings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incomings
    ADD CONSTRAINT incomings_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: passenger_addresses passenger_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passenger_addresses
    ADD CONSTRAINT passenger_addresses_pkey PRIMARY KEY (id);


--
-- Name: payment_cards payment_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_pkey PRIMARY KEY (id);


--
-- Name: payment_options payment_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_options
    ADD CONSTRAINT payment_options_pkey PRIMARY KEY (id);


--
-- Name: payments payments_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_key UNIQUE (booking_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: predefined_addresses predefined_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predefined_addresses
    ADD CONSTRAINT predefined_addresses_pkey PRIMARY KEY (id);


--
-- Name: pricing_rules pricing_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT pricing_rules_pkey PRIMARY KEY (id);


--
-- Name: reference_entries reference_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reference_entries
    ADD CONSTRAINT reference_entries_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (filename);


--
-- Name: short_urls short_urls_original_url_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.short_urls
    ADD CONSTRAINT short_urls_original_url_key UNIQUE (original_url);


--
-- Name: short_urls short_urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.short_urls
    ADD CONSTRAINT short_urls_pkey PRIMARY KEY (id);


--
-- Name: short_urls short_urls_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.short_urls
    ADD CONSTRAINT short_urls_token_key UNIQUE (token);


--
-- Name: special_requirements special_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.special_requirements
    ADD CONSTRAINT special_requirements_pkey PRIMARY KEY (id);


--
-- Name: travel_reasons travel_reasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_reasons
    ADD CONSTRAINT travel_reasons_pkey PRIMARY KEY (id);


--
-- Name: travel_rules travel_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules
    ADD CONSTRAINT travel_rules_pkey PRIMARY KEY (id);


--
-- Name: user_devices user_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT user_devices_pkey PRIMARY KEY (id);


--
-- Name: user_locations user_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_locations
    ADD CONSTRAINT user_locations_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_vendors vehicle_vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_vendors
    ADD CONSTRAINT vehicle_vendors_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: work_roles work_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_pkey PRIMARY KEY (id);


--
-- Name: airports_lat_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX airports_lat_index ON public.airports USING btree (lat);


--
-- Name: airports_lng_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX airports_lng_index ON public.airports USING btree (lng);


--
-- Name: api_keys_key_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX api_keys_key_index ON public.api_keys USING btree (key);


--
-- Name: audit_logs_event_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_event_index ON public.audit_logs USING btree (event);


--
-- Name: audit_logs_model_type_model_pk_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_model_type_model_pk_index ON public.audit_logs USING btree (model_type, model_pk);


--
-- Name: audit_logs_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_id_index ON public.audit_logs USING btree (user_id);


--
-- Name: booker_references_booking_reference_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booker_references_booking_reference_name_index ON public.booker_references USING btree (booking_reference_name);


--
-- Name: bookers_passengers_booker_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookers_passengers_booker_id_index ON public.bookers_passengers USING btree (booker_id);


--
-- Name: bookers_passengers_booker_id_passenger_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX bookers_passengers_booker_id_passenger_id_index ON public.bookers_passengers USING btree (booker_id, passenger_id);


--
-- Name: bookers_passengers_passenger_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookers_passengers_passenger_id_index ON public.bookers_passengers USING btree (passenger_id);


--
-- Name: booking_addresses_address_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_addresses_address_id_index ON public.booking_addresses USING btree (address_id);


--
-- Name: booking_addresses_address_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_addresses_address_type_index ON public.booking_addresses USING btree (address_type);


--
-- Name: booking_addresses_booking_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_addresses_booking_id_index ON public.booking_addresses USING btree (booking_id);


--
-- Name: booking_charges_booking_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_charges_booking_id_index ON public.booking_charges USING btree (booking_id);


--
-- Name: booking_drivers_booking_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX booking_drivers_booking_id_index ON public.booking_drivers USING btree (booking_id);


--
-- Name: booking_indexes_booking_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX booking_indexes_booking_id_index ON public.booking_indexes USING btree (booking_id);


--
-- Name: booking_indexes_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_company_id_index ON public.booking_indexes USING btree (company_id);


--
-- Name: booking_indexes_local_scheduled_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_local_scheduled_at_index ON public.booking_indexes USING btree (local_scheduled_at);


--
-- Name: booking_indexes_order_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_order_id_index ON public.booking_indexes USING gin (order_id public.gin_trgm_ops);


--
-- Name: booking_indexes_passenger_full_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_passenger_full_name_index ON public.booking_indexes USING gin (passenger_full_name public.gin_trgm_ops);


--
-- Name: booking_indexes_passenger_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_passenger_id_index ON public.booking_indexes USING btree (passenger_id);


--
-- Name: booking_indexes_service_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_service_id_index ON public.booking_indexes USING btree (service_id);


--
-- Name: booking_indexes_supplier_service_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_supplier_service_id_index ON public.booking_indexes USING gin (supplier_service_id public.gin_trgm_ops);


--
-- Name: booking_indexes_vendor_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX booking_indexes_vendor_name_index ON public.booking_indexes USING btree (vendor_name);


--
-- Name: bookings_booker_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_booker_id_index ON public.bookings USING btree (booker_id);


--
-- Name: bookings_company_info_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_company_info_id_index ON public.bookings USING btree (company_info_id);


--
-- Name: bookings_invoices_booking_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_invoices_booking_id_index ON public.bookings_invoices USING btree (booking_id);


--
-- Name: bookings_invoices_invoice_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_invoices_invoice_id_index ON public.bookings_invoices USING btree (invoice_id);


--
-- Name: bookings_passenger_full_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_passenger_full_name_index ON public.bookings USING gin (public.concat_space(passenger_first_name, passenger_last_name) public.gin_trgm_ops);


--
-- Name: bookings_passenger_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_passenger_id_index ON public.bookings USING btree (passenger_id);


--
-- Name: bookings_scheduled_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_scheduled_at_index ON public.bookings USING btree (scheduled_at);


--
-- Name: bookings_service_id_gin_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_service_id_gin_index ON public.bookings USING gin (service_id public.gin_trgm_ops);


--
-- Name: bookings_service_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_service_id_index ON public.bookings USING btree (service_id);


--
-- Name: bookings_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_status_index ON public.bookings USING btree (status);


--
-- Name: bookings_supplier_service_id_gin_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_supplier_service_id_gin_index ON public.bookings USING gin (supplier_service_id public.gin_trgm_ops);


--
-- Name: bookings_supplier_service_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_supplier_service_id_index ON public.bookings USING btree (supplier_service_id);


--
-- Name: bookings_vehicle_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_vehicle_id_index ON public.bookings USING btree (vehicle_id);


--
-- Name: comments_author_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_author_id_index ON public.comments USING btree (author_id);


--
-- Name: comments_booking_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_booking_id_index ON public.comments USING btree (booking_id);


--
-- Name: comments_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_company_id_index ON public.comments USING btree (company_id);


--
-- Name: comments_member_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_member_id_index ON public.comments USING btree (member_id);


--
-- Name: companies_special_requirements_company_id_special_requirement_i; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX companies_special_requirements_company_id_special_requirement_i ON public.companies_special_requirements USING btree (company_id, special_requirement_id);


--
-- Name: company_credit_rates_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_credit_rates_company_id_index ON public.company_credit_rates USING btree (company_id);


--
-- Name: company_infos_account_manager_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_account_manager_id_index ON public.company_infos USING btree (account_manager_id);


--
-- Name: company_infos_address_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_address_id_index ON public.company_infos USING btree (address_id);


--
-- Name: company_infos_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_company_id_index ON public.company_infos USING btree (company_id);


--
-- Name: company_infos_contact_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_contact_id_index ON public.company_infos USING btree (contact_id);


--
-- Name: company_infos_country_code_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_country_code_index ON public.company_infos USING btree (country_code);


--
-- Name: company_infos_legal_address_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_legal_address_id_index ON public.company_infos USING btree (legal_address_id);


--
-- Name: company_infos_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_name_index ON public.company_infos USING gin (name public.gin_trgm_ops);


--
-- Name: company_infos_salesman_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_infos_salesman_id_index ON public.company_infos USING btree (salesman_id);


--
-- Name: company_links_company_id_linked_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX company_links_company_id_linked_company_id_index ON public.company_links USING btree (company_id, linked_company_id);


--
-- Name: credit_note_lines_credit_note_id_booking_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX credit_note_lines_credit_note_id_booking_id_index ON public.credit_note_lines USING btree (credit_note_id, booking_id);


--
-- Name: csv_reports_company_id_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX csv_reports_company_id_name_index ON public.csv_reports USING btree (company_id, name);


--
-- Name: ddis_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ddis_type_index ON public.ddis USING btree (type);


--
-- Name: direct_debit_mandates_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX direct_debit_mandates_company_id_index ON public.direct_debit_mandates USING btree (company_id);


--
-- Name: direct_debit_mandates_created_by_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX direct_debit_mandates_created_by_id_index ON public.direct_debit_mandates USING btree (created_by_id);


--
-- Name: direct_debit_payments_direct_debit_mandate_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX direct_debit_payments_direct_debit_mandate_id_index ON public.direct_debit_payments USING btree (direct_debit_mandate_id);


--
-- Name: direct_debit_payments_invoice_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX direct_debit_payments_invoice_id_index ON public.direct_debit_payments USING btree (invoice_id);


--
-- Name: errors_fingerprint_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX errors_fingerprint_index ON public.errors USING btree (fingerprint);


--
-- Name: errors_subject_gid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX errors_subject_gid_index ON public.errors USING btree (subject_gid);


--
-- Name: invoices_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_company_id_index ON public.invoices USING btree (company_id);


--
-- Name: invoices_payments_invoice_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_payments_invoice_id_index ON public.invoices_payments USING btree (invoice_id);


--
-- Name: invoices_payments_payment_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_payments_payment_id_index ON public.invoices_payments USING btree (payment_id);


--
-- Name: locations_company_id_address_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX locations_company_id_address_id_index ON public.locations USING btree (company_id, address_id);


--
-- Name: locations_company_id_default_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX locations_company_id_default_index ON public.locations USING btree (company_id, "default") WHERE ("default" IS TRUE);


--
-- Name: locations_company_id_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX locations_company_id_name_index ON public.locations USING btree (company_id, name);


--
-- Name: members_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_id_index ON public.members USING btree (id);


--
-- Name: messages_company_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_company_id_index ON public.messages USING btree (company_id);


--
-- Name: messages_message_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_message_type_index ON public.messages USING btree (message_type);


--
-- Name: passenger_addresses_passenger_id_address_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX passenger_addresses_passenger_id_address_id_index ON public.passenger_addresses USING btree (passenger_id, address_id) WHERE (type = ANY (ARRAY['home'::public.address_type, 'work'::public.address_type]));


--
-- Name: passenger_addresses_passenger_id_address_id_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX passenger_addresses_passenger_id_address_id_type_index ON public.passenger_addresses USING btree (passenger_id, address_id, type) WHERE (type = 'favorite'::public.address_type);


--
-- Name: passenger_addresses_passenger_id_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX passenger_addresses_passenger_id_type_index ON public.passenger_addresses USING btree (passenger_id, type) WHERE (type = ANY (ARRAY['home'::public.address_type, 'work'::public.address_type]));


--
-- Name: reference_entries_value_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reference_entries_value_index ON public.reference_entries USING btree (value);


--
-- Name: requests_subject_gid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX requests_subject_gid_index ON public.requests USING btree (subject_gid);


--
-- Name: short_urls_original_url_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX short_urls_original_url_index ON public.short_urls USING btree (original_url);


--
-- Name: short_urls_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX short_urls_token_index ON public.short_urls USING btree (token);


--
-- Name: special_requirements_service_type_key_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX special_requirements_service_type_key_index ON public.special_requirements USING btree (service_type, key);


--
-- Name: travel_rules_departments_travel_rule_id_department_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX travel_rules_departments_travel_rule_id_department_id_index ON public.travel_rules_departments USING btree (travel_rule_id, department_id);


--
-- Name: travel_rules_users_travel_rule_id_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX travel_rules_users_travel_rule_id_user_id_index ON public.travel_rules_users USING btree (travel_rule_id, user_id);


--
-- Name: travel_rules_vehicles_travel_rule_id_vehicle_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX travel_rules_vehicles_travel_rule_id_vehicle_id_index ON public.travel_rules_vehicles USING btree (travel_rule_id, vehicle_id);


--
-- Name: travel_rules_work_roles_travel_rule_id_work_role_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX travel_rules_work_roles_travel_rule_id_work_role_id_index ON public.travel_rules_work_roles USING btree (travel_rule_id, work_role_id);


--
-- Name: user_devices_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_devices_token_index ON public.user_devices USING btree (token);


--
-- Name: user_devices_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_devices_user_id_index ON public.user_devices USING btree (user_id);


--
-- Name: user_locations_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_locations_user_id_index ON public.user_locations USING btree (user_id);


--
-- Name: users_full_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_full_name_index ON public.users USING gin (public.concat_space(first_name, last_name) public.gin_trgm_ops);


--
-- Name: vehicle_vendors_city_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX vehicle_vendors_city_index ON public.vehicle_vendors USING btree (city);


--
-- Name: vehicle_vendors_key_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX vehicle_vendors_key_index ON public.vehicle_vendors USING btree (key);


--
-- Name: vehicle_vendors_vehicles_vehicle_vendor_id_vehicle_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicle_vendors_vehicles_vehicle_vendor_id_vehicle_id_index ON public.vehicle_vendors_vehicles USING btree (vehicle_vendor_id, vehicle_id);


--
-- Name: addresses addresses_airport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_airport_id_fkey FOREIGN KEY (airport_id) REFERENCES public.airports(id);


--
-- Name: alerts alerts_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: api_keys api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: booker_references booker_references_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booker_references
    ADD CONSTRAINT booker_references_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: bookers_passengers bookers_passengers_booker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookers_passengers
    ADD CONSTRAINT bookers_passengers_booker_id_fkey FOREIGN KEY (booker_id) REFERENCES public.users(id);


--
-- Name: bookers_passengers bookers_passengers_passenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookers_passengers
    ADD CONSTRAINT bookers_passengers_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.users(id);


--
-- Name: booking_addresses booking_addresses_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_addresses
    ADD CONSTRAINT booking_addresses_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: booking_addresses booking_addresses_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_addresses
    ADD CONSTRAINT booking_addresses_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: booking_charges booking_charges_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_charges
    ADD CONSTRAINT booking_charges_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: booking_drivers booking_drivers_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_drivers
    ADD CONSTRAINT booking_drivers_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: booking_indexes booking_indexes_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_indexes
    ADD CONSTRAINT booking_indexes_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: booking_messages booking_messages_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_messages
    ADD CONSTRAINT booking_messages_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: booking_messages booking_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_messages
    ADD CONSTRAINT booking_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: booking_references booking_references_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_references
    ADD CONSTRAINT booking_references_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: bookings bookings_booker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booker_id_fkey FOREIGN KEY (booker_id) REFERENCES public.users(id);


--
-- Name: bookings bookings_cancelled_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_cancelled_by_id_fkey FOREIGN KEY (cancelled_by_id) REFERENCES public.users(id);


--
-- Name: bookings bookings_company_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_company_info_id_fkey FOREIGN KEY (company_info_id) REFERENCES public.company_infos(id);


--
-- Name: bookings bookings_passenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.users(id);


--
-- Name: bookings bookings_payment_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_payment_card_id_fkey FOREIGN KEY (payment_card_id) REFERENCES public.payment_cards(id);


--
-- Name: bookings bookings_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.booking_schedules(id);


--
-- Name: bookings bookings_travel_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_travel_reason_id_fkey FOREIGN KEY (travel_reason_id) REFERENCES public.travel_reasons(id);


--
-- Name: bookings bookings_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: bookings bookings_vehicle_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_vendor_id_fkey FOREIGN KEY (vehicle_vendor_id) REFERENCES public.vehicle_vendors(id);


--
-- Name: comments comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: comments comments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: comments comments_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: comments comments_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.users(id);


--
-- Name: companies companies_ddi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_ddi_id_fkey FOREIGN KEY (ddi_id) REFERENCES public.ddis(id);


--
-- Name: companies_special_requirements companies_special_requirements_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies_special_requirements
    ADD CONSTRAINT companies_special_requirements_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: companies_special_requirements companies_special_requirements_special_requirement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies_special_requirements
    ADD CONSTRAINT companies_special_requirements_special_requirement_id_fkey FOREIGN KEY (special_requirement_id) REFERENCES public.special_requirements(id);


--
-- Name: company_credit_rates company_credit_rates_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_credit_rates
    ADD CONSTRAINT company_credit_rates_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: company_infos company_infos_account_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos
    ADD CONSTRAINT company_infos_account_manager_id_fkey FOREIGN KEY (account_manager_id) REFERENCES public.users(id);


--
-- Name: company_infos company_infos_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos
    ADD CONSTRAINT company_infos_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: company_infos company_infos_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos
    ADD CONSTRAINT company_infos_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: company_infos company_infos_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos
    ADD CONSTRAINT company_infos_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id);


--
-- Name: company_infos company_infos_legal_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos
    ADD CONSTRAINT company_infos_legal_address_id_fkey FOREIGN KEY (legal_address_id) REFERENCES public.addresses(id);


--
-- Name: company_infos company_infos_salesman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_infos
    ADD CONSTRAINT company_infos_salesman_id_fkey FOREIGN KEY (salesman_id) REFERENCES public.users(id);


--
-- Name: company_links company_links_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_links
    ADD CONSTRAINT company_links_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: company_links company_links_linked_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_links
    ADD CONSTRAINT company_links_linked_company_id_fkey FOREIGN KEY (linked_company_id) REFERENCES public.companies(id);


--
-- Name: contacts contacts_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: contacts contacts_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: credit_note_lines credit_note_lines_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_note_lines
    ADD CONSTRAINT credit_note_lines_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: credit_note_lines credit_note_lines_credit_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_note_lines
    ADD CONSTRAINT credit_note_lines_credit_note_id_fkey FOREIGN KEY (credit_note_id) REFERENCES public.invoices(id);


--
-- Name: csv_reports csv_reports_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_reports
    ADD CONSTRAINT csv_reports_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: departments departments_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: direct_debit_mandates direct_debit_mandates_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_mandates
    ADD CONSTRAINT direct_debit_mandates_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: direct_debit_mandates direct_debit_mandates_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_mandates
    ADD CONSTRAINT direct_debit_mandates_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: direct_debit_payments direct_debit_payments_direct_debit_mandate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_payments
    ADD CONSTRAINT direct_debit_payments_direct_debit_mandate_id_fkey FOREIGN KEY (direct_debit_mandate_id) REFERENCES public.direct_debit_mandates(id);


--
-- Name: direct_debit_payments direct_debit_payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direct_debit_payments
    ADD CONSTRAINT direct_debit_payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: feedbacks feedbacks_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: incomings incomings_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incomings
    ADD CONSTRAINT incomings_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: invoices invoices_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: invoices invoices_credited_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_credited_invoice_id_fkey FOREIGN KEY (credited_invoice_id) REFERENCES public.invoices(id);


--
-- Name: invoices invoices_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.users(id);


--
-- Name: invoices invoices_paid_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_paid_by_id_fkey FOREIGN KEY (paid_by_id) REFERENCES public.users(id);


--
-- Name: locations locations_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: locations locations_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: members members_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: members members_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: members members_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_id_fkey FOREIGN KEY (id) REFERENCES public.users(id);


--
-- Name: members members_member_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_member_role_id_fkey FOREIGN KEY (member_role_id) REFERENCES public.roles(id);


--
-- Name: members members_work_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_work_role_id_fkey FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: messages messages_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: messages messages_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: passenger_addresses passenger_addresses_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passenger_addresses
    ADD CONSTRAINT passenger_addresses_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: passenger_addresses passenger_addresses_passenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passenger_addresses
    ADD CONSTRAINT passenger_addresses_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.users(id);


--
-- Name: payment_cards payment_cards_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: payment_cards payment_cards_passenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.users(id);


--
-- Name: payment_options payment_options_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_options
    ADD CONSTRAINT payment_options_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: predefined_addresses predefined_addresses_airport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predefined_addresses
    ADD CONSTRAINT predefined_addresses_airport_id_fkey FOREIGN KEY (airport_id) REFERENCES public.airports(id);


--
-- Name: pricing_rules pricing_rules_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT pricing_rules_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: pricing_rules pricing_rules_destination_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT pricing_rules_destination_address_id_fkey FOREIGN KEY (destination_address_id) REFERENCES public.addresses(id);


--
-- Name: pricing_rules pricing_rules_pickup_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT pricing_rules_pickup_address_id_fkey FOREIGN KEY (pickup_address_id) REFERENCES public.addresses(id);


--
-- Name: reference_entries reference_entries_booking_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reference_entries
    ADD CONSTRAINT reference_entries_booking_reference_id_fkey FOREIGN KEY (booking_reference_id) REFERENCES public.booking_references(id);


--
-- Name: travel_reasons travel_reasons_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_reasons
    ADD CONSTRAINT travel_reasons_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: travel_rules travel_rules_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules
    ADD CONSTRAINT travel_rules_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: travel_rules_departments travel_rules_departments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_departments
    ADD CONSTRAINT travel_rules_departments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: travel_rules_departments travel_rules_departments_travel_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_departments
    ADD CONSTRAINT travel_rules_departments_travel_rule_id_fkey FOREIGN KEY (travel_rule_id) REFERENCES public.travel_rules(id);


--
-- Name: travel_rules_users travel_rules_users_travel_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_users
    ADD CONSTRAINT travel_rules_users_travel_rule_id_fkey FOREIGN KEY (travel_rule_id) REFERENCES public.travel_rules(id);


--
-- Name: travel_rules_users travel_rules_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_users
    ADD CONSTRAINT travel_rules_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: travel_rules_vehicles travel_rules_vehicles_travel_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_vehicles
    ADD CONSTRAINT travel_rules_vehicles_travel_rule_id_fkey FOREIGN KEY (travel_rule_id) REFERENCES public.travel_rules(id);


--
-- Name: travel_rules_vehicles travel_rules_vehicles_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_vehicles
    ADD CONSTRAINT travel_rules_vehicles_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: travel_rules_work_roles travel_rules_work_roles_travel_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_work_roles
    ADD CONSTRAINT travel_rules_work_roles_travel_rule_id_fkey FOREIGN KEY (travel_rule_id) REFERENCES public.travel_rules(id);


--
-- Name: travel_rules_work_roles travel_rules_work_roles_work_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_rules_work_roles
    ADD CONSTRAINT travel_rules_work_roles_work_role_id_fkey FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: user_devices user_devices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT user_devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_locations user_locations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_locations
    ADD CONSTRAINT user_locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES public.roles(id);


--
-- Name: vehicle_vendors_vehicles vehicle_vendors_vehicles_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_vendors_vehicles
    ADD CONSTRAINT vehicle_vendors_vehicles_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: vehicle_vendors_vehicles vehicle_vendors_vehicles_vehicle_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_vendors_vehicles
    ADD CONSTRAINT vehicle_vendors_vehicles_vehicle_vendor_id_fkey FOREIGN KEY (vehicle_vendor_id) REFERENCES public.vehicle_vendors(id);


--
-- Name: work_roles work_roles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;
INSERT INTO "schema_migrations" ("filename") VALUES ('20170329104607_create_initial_models.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170405095105_create_address_tables.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170406074709_create_contact_tables.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170409092851_update_users_add_rest_password_columns.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170411084423_add_salesmen_table.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170412092607_add_column_avatar_and_logo_to_bookers_and_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170412094212_update_addresses_add_postal_code.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170412094659_add_fields_to_payment_options_table.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170414092706_create_bookers_passengers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170418080941_create_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170419090405_add_passenger_addresses_join_table.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170420125249_delete_fields_from_booker_and_add_work_role.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170423145857_rename_bookers_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170424062730_add_booking_attributes.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170424080126_add_booking_references_columns_mandatory_active_validate.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170425122445_create_requests.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170426081725_add_reason_for_travel_table.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170426083237_create_enum_user_type.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170426161345_create_enum_company_type.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170505083701_add_onboarding_to_member.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170508222710_add_stop_info_to_booking_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170511163541_update_booking_status_type.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170511171500_add_scheduled_at_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170512084910_add_api_settings_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170513134328_update_addresses_for_lookup_behavior.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170514104127_create_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170514104921_add_booker_references.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170531122414_create_errors.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170601093852_update_booking_references_add_priority.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170601162020_create_orders_view.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170607150000_create_travel_rules.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170608103547_create_payment_cards.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170608133919_update_booking_and_booker_references_for_orders_immutability.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170612100612_update_orders_view_for_booker_references.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170612152517_update_companies_remove_ot_constraints.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170613143121_update_ids_in_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170615044957_update_bookings_add_flight.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170615132839_create_payments.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170616111721_update_bookings_add_cost_without_fee.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170620124115_add_costs_from_bookings_for_order_view.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170620134840_add_notification_attrs_to_member.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170620165256_create_enum_payment_types.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170620165348_update_bookings_add_payment_method.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170623064431_add_new_fields_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170626073241_add_paid_column_from_booking_to_orders.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170626091601_update_bookings_add_service_id.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170630082220_add_path_points_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170703134329_update_company_info_banking_details.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170704103232_add_processing_to_booking_status_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170704172808_add_predefined_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170705121227_backpopulate_booking_payment_methods.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170705152353_update_company_infos_add_phone_booking_fee.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170706082755_add_creating_to_booking_status_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170706151232_update_companies_add_default_driver_message.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170711130337_add_asap_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170711145431_update_travel_reason_with_active.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170717092030_update_passenger_addresses_add_favorite.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170717144000_move_column_tips_from_payment_options_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170718135240_add_multiple_booking_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170718145353_update_bookings_add_lock_version.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170719123753_update_bookings_add_allocated_at.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170719151029_update_requests_add_index_on_subject_gid.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170723094117_create_drivers_and_update_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170724125753_create_messages.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170726155932_modify_passenger_address_index.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170726162021_update_bookings_add_booked_at.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170727072939_add_pickup_distance_to_drivers_and_travel_distance_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170728101459_add_booker_notifications_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170730163934_add_cancelled_by_id_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170731094832_add_last_logged_in_at_to_users.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170731095236_update_users_add_notification_seen_at.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170802071621_downcase_users_emails.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170803073457_add_rejected_at_to_booking.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170804082534_add_allow_unregistered_to_travel_rules.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170808083634_create_gett_drivers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170810074127_add_trip_rating_to_booking_drivers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170810081803_add_country_code_to_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170812144926_add_fake_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170812163643_move_columns_names_from_member_to_user.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170815074616_started_locating_at_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170815083806_create_feedbacks.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170816150509_remove_unique_index_from_booking_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170817083448_add_autocomplete_to_booking_references.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170817111640_add_time_and_pre_eta_to_vehicles.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170818103759_add_carey_service_provider.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170818140255_update_booking_drivers_alter_distance_to_feet.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170821085555_add_support_for_multiple_payment_cards.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170821133441_update_passenger_addresses_pickup_destination_messages.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170822095641_create_booking_messages.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170822113225_change_invoicing_schedule_and_payment_terms_types.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170823133109_create_booking_charges.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170825134814_create_deployment_notifications.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170829061724_create_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170830082005_add_title_to_message.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170830153743_update_travel_rules_price_setting.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170831124935_add_ot_waiting_time_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170831134810_change_account_number_and_sort_code_to_string.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170901113915_add_fields_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170904101017_rename_ot_fare_quote_to_fare_quote.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180403131156_add_key_to_ddi_type.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170905123008_add_customer_care_message_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170906094334_create_alerts.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170907151651_set_defaults_for_invoicing_schedule_and_payment_terms.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170910064500_create_audited_table.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170911080525_add_company_payment_card_to_payment_types.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170911100227_add_gete_to_vehicle_service_type_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170911164815_change_last_4_in_payment_cards.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170912072648_add_company_id_to_payment_cards.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170913102359_add_location_updated_at_to_drivers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170914123351_rename_booking_ot_quote_id_to_quote_id.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170918093308_create_short_urls.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170918140954_update_invoices_remider.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170918202241_add_paid_by_id_to_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170919160208_add_wheelchair_user_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20170928083535_add_customer_care_password_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171002082116_add_hr_import_fields.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171004104610_add_logging_count_to_users.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171004110520_update_company_infos_add_users_fk.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171004135044_add_column_members_book_with_private_card.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171010090922_add_cancellation_fees_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171011065230_add_cancellation_fee_to_booking_charges.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171011070701_add_status_before_cancellation_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171011194343_add_notify_with_calendar_event_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171012110132_update_members_vip.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171013121432_create_incomings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171016115300_add_cancellation_fee_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171017192513_add_flags_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171018191048_add_timezone_to_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171019145621_change_bookings_payment_types.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171025104242_add_default_payment_type_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171026104410_add_default_to_payment_cards.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171026182109_create_locations.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171030141329_create_booking_comments.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171102080412_add_account_manager_id_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171105140944_add_default_vehicle_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171106134512_add_run_in_fee_to_booking_charges.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171107192746_add_fields_to_booking_charges.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171114082353_create_api_keys.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171114095758_add_cancelled_through_back_office_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171115102839_add_business_credit_to_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171116091614_add_vendor_name_to_booking_driver.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171117112718_add_csv_reports.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171117143037_remove_sales_tax_from_booking_charges.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171117144427_create_linked_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171121081536_add_sftp_server_to_booking_references.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171121090058_rename_hr_feed_credentials_to_sftp.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171121115722_create_comments.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171123131010_add_marketing_allowed_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171123142402_update_feedbacks_to_new_max_rating.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171127073756_add_credit_note_attributes_to_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171201095829_add_city_to_address.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171206092013_add_nexmo_to_service_providers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171207110039_update_companies_add_bookings_validation.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171214090212_replace_vatable_with_vat_in_credit_note_lines.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171214150541_add_customer_care_to_booking_status_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171214160301_backport_production_indexes.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171215121012_booking_charges_changes.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171220160658_add_cancellation_quote_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171220211600_add_resolved_column_to_alerts_table.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171221135558_add_get_e_cancellation_fees_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20171225100157_add_timezone_to_predefined_address.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180102110339_update_predefined_addresses_add_city.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180110125413_update_booking_references_add_conditional_and_cost_centre.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180116120034_add_api_enabled_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180116141011_add_list_to_booking_references.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180122122401_add_sap_id_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180123092211_add_special_to_service_providers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180124082734_add_ot_extra_cost_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180125120000_create_booking_schedules.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180125132618_add_created_by_id_to_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180201141813_update_vehicles_add_active.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180201152802_add_credit_rate_fields_to_company.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180202121716_create_direct_debit_mandates.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180202121723_create_direct_debit_payments.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180205091240_create_company_credit_rates.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180210070911_add_paid_amount_to_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180210140720_add_booker_notifications_emails_to_company_info.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180212160148_remove_driver_tracking_not_available_from_alert_type_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180213175615_add_room_and_flight_number_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180216094924_add_zooz_request_id_to_payments.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180216155813_add_international_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180220120000_add_international_booking_fee_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180220120001_add_fingerprint_to_payments.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180222081326_add_passenger_payment_card_periodic_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180226072715_add_applied_manually_to_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180226091250_add_cc_invoice_to_invoice_type_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180227093130_add_member_to_invoice.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180304164512_add_invalid_login_count_to_user_model.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180307111707_add_missing_not_null_constraints.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180312150000_add_ddis_support.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180313081804_rename_predefined_addresses_columns.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180316105103_add_under_review_coulmn_to_invoices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180316140648_add_bbc_company_type.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180320070009_change_company_info_get_e_cancellation_fees_type.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180320092359_create_user_devices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180321161522_add_notify_with_push_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180323000301_add_special_requirements_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180323082932_add_custom_attributes_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180323133042_create_vehicle_vendors.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180412070637_add_retries_to_payments.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180426065453_add_indexes_to_comments_booking_addresses_booking_charges.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180426115640_add_bearing_to_driver.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180502120000_add_source_type_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180503212954_remove_token_uniqueness_from_user_devices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180506185742_create_airports.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180506202215_add_airport_id_to_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180508180000_create_drivers_channels.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180514153505_create_company_signup_request.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180515074058_add_cancellation_reason_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180517114333_add_driver_rating_reasons.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180517201557_update_bookings_add_custom_attributes.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180607134816_add_country_to_drivers_channels.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180608145416_add_passenger_address_type_to_booking_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180613001104_add_guide_passed_to_members.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180613134218_add_region_to_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180620114653_changes_to_company_signup_requests.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180625123435_add_price_increase_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180626083825_add_user_id_to_messages.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180627054712_add_phone_to_vehicle_vendor.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180706094506_bookings_query_optimization.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180709165402_add_splyt_to_vehicle_service_type_enum.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180716114135_add_default_contact_number_to_member.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180718115658_add_uuid_to_user_devices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180719083051_remove_jid_from_csv_reports.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180720084055_create_special_requirements.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180725091132_add_message_type_to_message.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180802101108_add_critical_flag_attributes.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180803085605_add_splyt_cancellation_columns_to_company_info.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180808171514_add_allow_preferred_vendor_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180827054950_add_available_at_postcodes_to_vehicle_vendors.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180905111820_update_addresses_lat_lng_precision.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180906141624_add_country_code_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180910105759_remove_address_triggers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180924081925_add_carey_cancellation_columns_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20180927080753_drop_gett_drivers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181008200451_add_device_info_to_user_devices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181009093927_add_fx_rate_increase_to_company_infos.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181009183030_create_user_locations.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181022064509_add_fees_totals_to_booking_charges.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181029093008_add_supplier_service_id_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181029110530_create_booking_indexes.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181030072504_create_extension_postgis.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181030072505_create_pricing_rules.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181031195853_add_more_booking_indexes.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181102131705_add_additioinal_info_to_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181103131758_add_billed_flag_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181107010358_add_additioinal_info_to_predefined_addresses.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181109091200_add_pricing_rule_fare_quote_to_bookings.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181115082553_add_time_and_booking_type_to_pricing_rules.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181205150353_add_assigned_to_all_passengers_to_bookers.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181210082337_add_time_frame_to_pricing_rules.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20181227092235_add_notifications_enabled_to_companies.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20190109091337_update_payment_terms_value.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20190109135528_change_reference_entries_id_type_to_bigint.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20190117135528_add_active_flag_to_user_devices.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20190121104201_add_phv_license_to_driver.rb');
INSERT INTO "schema_migrations" ("filename") VALUES ('20190122112523_add_manual_flag_to_booking_charges.rb');