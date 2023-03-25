package expo.invest.mapp;

import android.util.Log;

import com.datatheorem.android.trustkit.TrustKit;
import com.datatheorem.android.trustkit.config.DomainPinningPolicy;
import com.datatheorem.android.trustkit.config.PublicKeyPin;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;
import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;

public class HttpClientFactory implements OkHttpClientFactory {
  private final TrustKit mTrustKit;

  public HttpClientFactory(TrustKit trustKit) {
    this.mTrustKit = trustKit;
  }

  @Override
  public OkHttpClient createNewNetworkModuleClient() {
    Iterator<String> hosts = new ArrayList().iterator();

    try {
      JSONObject jsonConf = new JSONObject(BuildConfig.SSL_PINNING_CERTIFICATES);
      hosts = jsonConf.keys();
    } catch (JSONException jse) {
      Log.e("initTrustKit exception", jse.getMessage());
      throw new RuntimeException("Can not parse TrustKit config as a dictionary");
    }

    CertificatePinner.Builder certificatePinner = new CertificatePinner.Builder();
    while(hosts.hasNext()) {
      String serverHostname = hosts.next();
      for (PublicKeyPin key : this.mTrustKit.getConfiguration().getPolicyForHostname(serverHostname).getPublicKeyPins()) {
        certificatePinner.add(serverHostname, "sha256/" + key.toString());
      }
    }

    OkHttpClient.Builder client = new OkHttpClient.Builder()
      .connectTimeout(0, TimeUnit.MILLISECONDS)
      .readTimeout(0, TimeUnit.MILLISECONDS)
      .writeTimeout(0, TimeUnit.MILLISECONDS)
      .cookieJar(new ReactCookieJarContainer())
      .certificatePinner(certificatePinner.build());

    return OkHttpClientProvider.enableTls12OnPreLollipop(client).build();
  }
}
