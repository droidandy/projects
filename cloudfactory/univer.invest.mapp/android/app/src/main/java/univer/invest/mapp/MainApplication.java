package univer.invest.mapp;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.datatheorem.android.trustkit.TrustKit;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.soloader.SoLoader;

import org.wonday.orientation.OrientationActivityLifecycle;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import com.wix.interactable.Interactable;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new Interactable());

      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance());
    if (BuildConfig.NETWORK_SSL_VALIDATION_DISABLE == "true" && BuildConfig.FLAVOR != "production") {
      OkHttpClientProvider.setOkHttpClientFactory(new HttpClientFactoryDisableSSLValidation());
    }

    if (BuildConfig.SSL_PINNING_ENFORCE_POLICY == "true") {
      this.initTrustKit();
    }

  }

    private void initTrustKit() {
      TrustKit.initializeWithNetworkSecurityConfiguration(this);
      OkHttpClientProvider.setOkHttpClientFactory(new HttpClientFactory(TrustKit.getInstance()));
    }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
      if (BuildConfig.DEBUG) {
        try {
          /*
           We use reflection here to pick up the class that initializes Flipper,
          since Flipper library is not available in release mode
          */
          Class<?> aClass = Class.forName("univer.invest.mapp.ReactNativeFlipper");
          aClass.getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
        } catch (ClassNotFoundException e) {
          e.printStackTrace();
        } catch (NoSuchMethodException e) {
          e.printStackTrace();
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        } catch (InvocationTargetException e) {
          e.printStackTrace();
        }
      }
    }
}
