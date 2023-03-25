package com.onetransport.enterprise;

import android.app.Application;

import com.facebook.react.ReactApplication;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.cardio.RNCardIOPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.horcrux.svg.SvgPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.RNTextInputMask.RNTextInputMaskPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.smixx.fabric.FabricPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.oblador.keychain.KeychainPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.react.rnspinkit.RNSpinkitPackage;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ExtraDimensionsPackage(),
          new RNSpinkitPackage(),
          new RNFirebasePackage(),
          new RNCardIOPackage(),
          new LottiePackage(),
          new FabricPackage(),
          new RNTextInputMaskPackage(),
          new PickerPackage(),
          new SplashScreenReactPackage(),
          new LinearGradientPackage(),
          new SvgPackage(),
          new RNI18nPackage(),
          new MapsPackage(),
          new RNFetchBlobPackage(),
          new RCTPdfView(),
          new RNDeviceInfo(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage(),
          new RNGestureHandlerPackage(),
          new FingerprintAuthPackage(),
          new KeychainPackage(),
          new LocationServicesDialogBoxPackage(),
          new ReactNativeConfigPackage()
      );
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
    Fabric.with(this, new Crashlytics());
  }
}
