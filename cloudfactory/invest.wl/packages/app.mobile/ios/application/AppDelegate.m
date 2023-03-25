#import <React/RCTBridge.h>
#import "AppDelegate.h"
#import <React/RCTBridge+Private.h>
#import "ReactNativeConfig.h"
#import <TrustKit/TrustKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

#import "RNSplashScreen.h"
#import <React/RCTLinkingManager.h>
#import "Firebase.h"
#import "Orientation.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@interface AppDelegate () <RCTBridgeDelegate>;
@property (nonatomic) RCTBridge *rctBridge;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (void)applicationWillTerminate:(UIApplication *)application {
  RCTBridge *batchedBridge = self.rctBridge.batchedBridge;
  [self.rctBridge invalidate];

  NSRunLoop *runLoop = [NSRunLoop currentRunLoop];
  NSArray<NSRunLoopMode> *allModes = CFBridgingRelease(CFRunLoopCopyAllModes(runLoop.getCFRunLoop));
  while (batchedBridge.moduleClasses) {
    for (NSRunLoopMode mode in allModes) {
      [runLoop runMode:mode beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];
    }
  }
}

// Only if your app is using [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  [FIRApp configure];
  [self configSSLPinning];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                               moduleName:@"Application"
                                               initialProperties:nil];

  #if DEBUG
    NSLog(@"ReactNativeConfig env: %@", [ReactNativeConfig env]);

    for (NSString *fontFamilyName in [UIFont familyNames]) {
      for (NSString *fontName in [UIFont fontNamesForFamilyName:fontFamilyName]) {
        NSLog(@"Family: %@    Font: %@", fontFamilyName, fontName);
      }
    }
  #endif

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [Orientation setOrientation:UIInterfaceOrientationMaskPortrait];
  [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger: UIInterfaceOrientationPortrait] forKey:@"orientation"];

  #if !DEBUG
    [RNSplashScreen showSplash:@"LaunchScreen" inRootView:rootView];
  #endif
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
}
-(void)configSSLPinning {
  //Конфигурация SSL Pinning
  NSString  *sslPinningEnforcePolicy = [ReactNativeConfig envFor:@"SSL_PINNING_ENFORCE_POLICY"];
  if ([sslPinningEnforcePolicy isEqualToString:@"true"]) {
    NSLog(@"SSL_PINNING_ENFORCE_POLICY is set to true. Configuring TrustKit...");
    NSString  *strSSLPinningConf = [ReactNativeConfig envFor:@"SSL_PINNING_CERTIFICATES"];
    if ([strSSLPinningConf length] != 0) {
      NSData* bSSLPinningConf = [strSSLPinningConf dataUsingEncoding:NSUTF8StringEncoding];
      NSError *error = nil;
      id sslPinningConf = [NSJSONSerialization JSONObjectWithData:bSSLPinningConf options:0 error:&error];
      if (error || ![sslPinningConf isKindOfClass:[NSDictionary class]]) {
        [NSException raise:@"Invalid SSL Pinning configuration" format:@"Can not deserialize SSL_PINNING_CERTIFICATES as a dictionary. Check if it's correct JSON."];
      }
      NSDictionary *dict = sslPinningConf;
      NSMutableDictionary *domainsConf = [[NSMutableDictionary alloc] init];;
      for (NSString *domain in dict) {
        NSDictionary* pins = [dict objectForKey:domain];
        NSMutableDictionary *hostConf = [[NSMutableDictionary alloc] init];
        NSMutableArray *pinConf = [[NSMutableArray alloc] init];;
        for (NSString *key in pins) {
          NSString* pin = [pins objectForKey:key];
          [pinConf addObject:pin];
        }
        hostConf[@"TSKIncludeSubdomains"] = @YES;
        hostConf[@"TSKEnforcePinning"] = @YES;
        //hostConf[@"TSKReportUris"] = @[@"https://some-reporting-server.com/log_report"];
        hostConf[@"TSKPublicKeyAlgorithms"] = @[kTSKAlgorithmRsa2048];
        hostConf[@"TSKPublicKeyHashes"] = pinConf;
        domainsConf[domain] = hostConf;
      }
      NSMutableDictionary *trustKitConf = [[NSMutableDictionary alloc] init];
      trustKitConf[@"TSKSwizzleNetworkDelegates"] = @YES;
      trustKitConf[@"TSKPinnedDomains"] = domainsConf;
      NSLog(@"Prepared conf for TrustKit: %@", trustKitConf);
      [TrustKit initSharedInstanceWithConfiguration:trustKitConf];
    } else {
      [NSException raise:@"Invalid SSL Pinning configuration" format:@"SSL_PINNING_ENFORCE_POLICY is set to true but SSL_PINNING_CERTIFICATES is empty"];
    }
  } else {
    NSLog(@"SSL_PINNING_ENFORCE_POLICY is set to false. Skipping TrustKit configuration.");
  }
}
/////// Push notification
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}
//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// react-native-orientation
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

#if RCT_DEV
- (BOOL)bridge:(RCTBridge *)bridge didNotFindModule:(NSString *)moduleName {
  return YES;
}
#endif
@end
