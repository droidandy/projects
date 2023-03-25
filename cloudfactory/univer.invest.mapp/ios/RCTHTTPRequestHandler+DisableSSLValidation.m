#import <React/RCTBridgeModule.h>
#import <React/RCTHTTPRequestHandler.h>
#import "ReactNativeConfig.h"

@implementation RCTHTTPRequestHandler(DisableSSLValidation)

- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential *credential))completionHandler
{
  NSString *NETWORK_SSL_VALIDATION_DISABLE = [ReactNativeConfig envFor:@"NETWORK_SSL_VALIDATION_DISABLE"];

   if ([NETWORK_SSL_VALIDATION_DISABLE isEqualToString:@"true"])
   {
    // Trust all certificates
    completionHandler(NSURLSessionAuthChallengeUseCredential, [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust]);
   }
   else
   {
    // Perform default validation
    completionHandler(NSURLSessionAuthChallengePerformDefaultHandling, NULL);
   }
}
@end
