import React from 'react';
import PropTypes from 'prop-types';

export default function SpecialFootwear() {
  const styleSpan = {
    marginRight: '10px',
  };
  const styleLine = {
    marginBottom: '5px',
  };
  return (
    <div className="ArkansasHearingAid">
      <p>
        Hearing Aid coverage is not mandated by California state law, but is sold only in conjunction with the mandated footwear benefit.
        Special Footwear — Coverage at 20% member coinsurance for medically necessary special footwear for foot disfigurement resulting from bone
        deformity, motor impairment, paralysis, or amputation. This includes disfigurement caused by cerebral palsy, arthritis, polio, spina bifida, injury or
        development disability. CIC § 10,123.141/H&S § 1,367.19
      </p>
      <p>
        <b>Hearing Aids</b> — Coverage at 20% member coinsurance for the following:
      </p>
      <ol>
        <li>Audiological evaluations to measure the extent of hearing loss and determine the most appropriate make and model of hearing aid. These evaluations will be covered under plan benefits for office visits to physicians</li>
        <li>Hearing aids (monaural or binaural) including ear mold(s), the hearing aid instrument, batteries, cords and other ancillary equipment.</li>
        <li>Visits for fitting, counseling, adjustments and repairs for a one-year period after receiving the covered hearing aid.</li>
      </ol>
      <p>
        Coverage is not provided for surgically implanted hearing devices (i.e., cochlear implants, audiant bone conduction devices). Medically necessary
        surgically implanted hearing devices may be covered under your plan’s benefits for prosthetic devices.
      </p>
      <div style={styleLine}>
        <div style={styleSpan}><b>3–Tier Cost:</b></div>
        <span style={styleSpan}>Single — $3.02</span>
        <span style={styleSpan}>Two-Party — $6.34</span>
        <span style={styleSpan}>Family — $9.06</span>
      </div>
      <div>
        <div style={styleSpan}><b>4–Tier Cost:</b></div>
        <span style={styleSpan}>Single — $3.02</span>
        <span style={styleSpan}>Sub/Spouse — $5.44</span>
        <span style={styleSpan}>Sub/Child — $5.44</span>
        <span style={styleSpan}>Family — $9.36</span>
      </div>
    </div>
  );
}
