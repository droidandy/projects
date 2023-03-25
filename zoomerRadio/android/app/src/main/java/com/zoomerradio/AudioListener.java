package com.zoomerradio;

import android.util.Log;

import co.mobiwise.library.radio.RadioListener;


public class AudioListener implements RadioListener {
    private final String TAG = "AudioListener";
    private AudioListenerCallback cb;

    public AudioListener(AudioListenerCallback cb) {
        this.cb = cb;
    }

    @Override public void onRadioLoading() {
        Log.d(TAG, "onRadioLoading");
    }

    @Override public void onRadioConnected() {
        Log.d(TAG, "onRadioConnected");
    }

    @Override public void onRadioStarted() {
        cb.state("PLAYING");
        Log.d(TAG, "onRadioStarted");
    }

    @Override public void onRadioStopped() {
        cb.state("STOPPED");
        Log.d(TAG, "onRadioStopped");
    }

    @Override public void onMetaDataReceived(String s, String s1) {
        Log.d(TAG, "onMetaDataReceived: " + s + ", " + s1);
    }

    @Override public void onError() {
        cb.state("ERROR");
        Log.d(TAG, "onError");
    }

    interface AudioListenerCallback {
        void state(String s);
    }
}