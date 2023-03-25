package com.zoomerradio;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import co.mobiwise.library.radio.RadioManager;

public class AudioManager extends ReactContextBaseJavaModule {
    private RadioManager mediaPlayer;
    private ReactApplicationContext context;
    private String lastStatus;

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void sendStatus(String status) {
        WritableMap params = Arguments.createMap();
        params.putString("status", status);
        sendEvent(context, "AudioBridgeEvent", params);
        lastStatus = status;
    }

    public AudioManager(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        AudioListener listener = new AudioListener(new AudioListener.AudioListenerCallback() {
            @Override public void state(String s) {
                if (s.equals("PLAYING")) {
                    mediaPlayer.updateNotification("", "", 0, 0);
                }
                sendStatus(s);
            }
        });

        mediaPlayer = RadioManager.with(context);
        mediaPlayer.registerListener(listener);
        mediaPlayer.connect();
    }

    @Override public String getName() {
        return "AudioManager";
    }

    @ReactMethod public void play(String streamURL) {
        mediaPlayer.startRadio(streamURL);
    }

    @ReactMethod public void stop() {
        mediaPlayer.stopRadio();
    }

    @ReactMethod public void getStatus(Callback status) {
        status.invoke("none", lastStatus);
    }
}