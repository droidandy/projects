import React from 'react';
export default function InfertilityTreatment() {
  const styleSpan = {
    marginRight: '10px',
  };
  const styleLine = {
    marginBottom: '5px',
  };
  return (
    <div className="ArkansasHearingAid">
      <p>
        Coverage for diagnosis and treatment of infertility at 50% payment rate, benefit payments to $2,000 during a calendar year. The calendar year
        deductible is waived.
      </p>
      <p>
        CIC § 10,119.6/H&S § 1,374.55
      </p>
      <div style={styleLine}>
        <div style={styleSpan}><b>3–Tier Cost:</b></div>
        <span style={styleSpan}>Single — $10.40</span>
        <span style={styleSpan}>Two-Party — $21.84</span>
        <span style={styleSpan}>Family — $31.20</span>
      </div>
      <div>
        <div style={styleSpan}><b>4–Tier Cost:</b></div>
        <span style={styleSpan}>Single — $10.40</span>
        <span style={styleSpan}>Sub/Spouse — $22.88</span>
        <span style={styleSpan}>Sub/Child — $18.72</span>
        <span style={styleSpan}>Family — $32.24</span>
      </div>
    </div>
  );
}
