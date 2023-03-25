import { Section, Validity, SectionName, P, SubSection } from 'components/terms-of-use/TermsOfUse/styled';

export default () =>
  <Section>
    <SectionName>
      <a name="data-security">Data security</a>
    </SectionName>
    <Validity>Validity: 01, August 2017</Validity>
    <P>Tradekoo.com protects customer's data security as a key business imperative.</P>
    <SubSection>1. Approach to Security</SubSection>
    <P>
      Tradekoo has implemented a robust software and hardware architecture to maximize the chances to protect
      User's data and Private Information.
    </P>
    <SubSection>2. Access control</SubSection>
    <P>
      User sign in the Site by providing an email and a password. Users shall protect their passwords with due
      care to prevent the risk unauthorized accesses. The service is automatically logged off after a
      predefined inactivity period for security reasons.
    </P>
    <SubSection>3. Access security</SubSection>
    <P>
      Tradekoo keeps Users' access logs to track and prevent possible anomalies. Users shall cooperate with
      Tradekoo to make sure access credentials are not intercepted by Third Parties.
    </P>
    <SubSection>4. Vulnerability management</SubSection>
    <P>
      Tradekoo uses industry-recognized, enterprise-class security solutions to identify, analyze, and swiftly
      mitigate potential vulnerabilities. Firewalls and antivirus software protect our servers from malicious
      attacks.
    </P>
    <SubSection>5. Servers security</SubSection>
    <P>
      Tradekoo.com servers are hosted on Tier III, SSAE-16, or ISO 27001 compliant facilities. Such facilities
      feature 24-hour security, biometric access control, video surveillance and physical locks. The
      facilities are powered by redundant power, each with UPS and backup generators. All systems, networked
      devices, and circuits are constantly monitored by the provider of the hosting service.
    </P>
    <SubSection>6. Network security</SubSection>
    <P>
      Our network is protected by redundant layer 7 firewalls, best-of-class router technology, regular
      audits, and network intrusion detection that monitors for malicious traffic and network attacks. Network
      security scanning gives us deep insight to identify of out-of-compliance systems. A security incident
      event management (SIEM) system gathers logs from all network systems and creates triggers based on
      correlated events.
    </P>
    <SubSection>7. Transmission security</SubSection>
    <P>
      All communications with Tradekoo.com servers are encrypted using industry standard SSL. For email, our
      product supports Transport Layer Security (TLS), a protocol that encrypts and delivers email securely,
      mitigating eavesdropping and spoofing between mail servers.
    </P>
  </Section>;
