import React from "react";
import axios from "axios";
import moment from "moment";
import InputSelect from "../../../Common/InputSelect";
import {track} from "../../../../libs/helpers";

const promotionsAPI = {
  get: (uid) => axios.get(`/apps/customers/${uid}/promotions`),
  post: (uid, data) => axios.post(`/apps/customers/${uid}/promotions`, data),
  delete: (uid, productId) => axios.delete(`/apps/customers/${uid}/promotions/${productId}`)
}

export const Badge = ({onClick, title}) => {
  return (
    <div className="badge">
      <div className="icon" onClick={onClick}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0)">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.9498 3.05025C15.6835 5.78392 15.6835 10.2161 12.9498 12.9497C10.2162 15.6834 5.784 15.6834 3.05033 12.9497C0.316663 10.2161 0.316663 5.78392 3.05033 3.05025C5.784 0.316582 10.2162 0.316583 12.9498 3.05025ZM8.00008 6.58579L10.1214 4.46447L11.5356 5.87868L9.41429 8L11.5356 10.1213L10.1214 11.5355L8.00008 9.41421L5.87876 11.5355L4.46455 10.1213L6.58587 8L4.46455 5.87868L5.87876 4.46447L8.00008 6.58579Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
      <span>{title}</span>
    </div>
  );
};

export const Promotionals = ({appId, userId}) => {
  const [promotions, setPromotions] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [group, setGroup] = React.useState(null);

  const notActive = (promotions?.results || []).filter(v => !v.active);
  const active = (promotions?.results || []).filter(v => v.active);
  const durationOptions = Object.entries(promotions?.meta?.durations || {}).map(([label, value]) => ({ label, value }));

  React.useEffect(() => {
    getPromotions(userId);
  }, [userId]);

  const getPromotions = React.useCallback(
    async(userId) => {
      try {
        const response = await promotionsAPI.get(userId);
        const data = response?.data?.data;
        setPromotions(data);
      } catch (e) {}
    },
    [setPromotions]
  );

  const addPromotion = React.useCallback(
    async() => {
      try {
        const data = { product_group_id: group?.id, duration: duration.value };
        await promotionsAPI.post(userId, data);
        track("users_promotional_added", { group, duration, userId })
        await getPromotions(userId);
        setGroup(null);
        setDuration(null);
      } catch (e) {}
    },
    [userId, duration, group, setGroup, setDuration]
  );

  const removePromotion = React.useCallback(
    async(productId) => {
      try {
        await promotionsAPI.delete(userId, productId);
        track("users_promotional_revoked", { userId, productId, duration, group })
        await getPromotions(userId);
      } catch (e) {}
    },
    [userId, duration, group]
  );

  return (
    <div className="row-promotions">
      <div className="c-c__b-c__box">
        <div className="c-c__b-c__box-header">
          <svg className="c-c__b-c__box-header__icon" width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L10.163 5.02282L15.6085 5.52786L11.4999 9.13718L12.7023 14.4721L8 11.68L3.29772 14.4721L4.50011 9.13718L0.391548 5.52786L5.83695 5.02282L8 0Z" fill="#97ADC6"/>
          </svg>
        <span className="c-c__b-c__box-header-title">
          Promotionals
        </span>
        </div>
        <div className="c-c__b-c__box-content-promotion">
          <div className="label">
            Grant Permission Groups
          </div>
          <div className="selects">
            <InputSelect
              name="group"
              value={group}
              onChange={v => setGroup(v)}
              isSearchable={false}
              autoFocus={false}
              clearable={false}
              classNamePrefix="input-select"
              className='input-select_blue input-select_255 divider'
              maxMenuHeight={140}
              placeholder="Group"
              getOptionLabel={({ name }) => name}
              getOptionValue={({ id }) => id}
              options={notActive}
            />
            <InputSelect
              name="duration"
              value={duration}
              onChange={v => setDuration(v)}
              isSearchable={false}
              autoFocus={false}
              clearable={false}
              classNamePrefix="input-select"
              className='input-select_blue input-select_255'
              maxMenuHeight={140}
              placeholder="Duration"
              options={durationOptions}
            />
          </div>
          <button
            onClick={addPromotion}
            disabled={!duration || !group}
            className="button button_blue button_icon button_160"
          >
            <span>Grant</span>
          </button>
          {active?.length > 0 && (
            <>
              <div className="label">
                Granted Permission Groups
              </div>
              <div className="badges">
                {active.map((v, i) => {
                  const isLifetime = v.duration === "Lifetime";
                  const until = v.active_till && !isLifetime ? `, until ${moment(v.active_till).format("DD.MM.YYYY")}` : "";
                  const duration = v.duration ? `, ${v.duration}` : "";
                  const title= `${v.name}${duration}${until}`
                  return (
                    <Badge
                      key={i}
                      onClick={() => removePromotion(v.id)}
                      title={title}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
