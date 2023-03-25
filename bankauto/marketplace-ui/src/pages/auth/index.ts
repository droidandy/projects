import { useRouter } from 'next/router';
import { NextPageContext } from 'next';

const REDIRECT_URL = '/auth/login';

function RedirectPage(): null {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    router.push('/auth/[type]', REDIRECT_URL);
  }
  return null;
}

export async function getServerSideProps(ctx: NextPageContext): Promise<null> {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: REDIRECT_URL });
    ctx.res.end();
  }
  return null;
}

export default RedirectPage;
