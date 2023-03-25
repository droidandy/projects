import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { generateInstalmentPdf } from 'api/application/generateInstalmentPdf';

const DownloadInstalmentCertificate = () => {
  const { query } = useRouter();

  useEffect(() => {
    const handleDownloadPdf = async (params: ParsedUrlQuery) => {
      const { data: url } = await generateInstalmentPdf(params);
      const file = new Blob([url], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    };
    if (Object.keys(query).length) {
      handleDownloadPdf(query);
    }
  }, [query]);

  return null;
};

export default DownloadInstalmentCertificate;
