declare type StitchAppClient = unknown;
export declare type PrivateStitchAppClient = StitchAppClient & {
    auth: {
        refreshCustomData?(): Promise<void>;
        refreshAccessToken?(): Promise<void>;
        authInfo?: {
            accessToken?: string;
        };
        isLoggedIn: boolean;
    };
};
/**
 * A helper utility to support using [Realm Authentication](https://docs.mongodb.com/stitch/) with MongoDB Charts
 *
 * ```js
 * const client = Stitch.initializeDefaultAppClient('<your-client-app-id>');
 * client.auth.loginWithCredential(...)
 *
 * const sdk = new ChartsEmbedSDK({
 *   getUserToken: () => getRealmUserToken(client)
 * })
 * ```
 */
export declare function getRealmUserToken(stitchAppClient: StitchAppClient): Promise<string>;
export {};
