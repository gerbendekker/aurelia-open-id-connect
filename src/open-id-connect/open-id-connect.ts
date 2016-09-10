import { autoinject } from "aurelia-framework";
import { RouterConfiguration } from "aurelia-router";
import { UserManager } from "oidc-client";
import { OpenIdConnectRouting } from "./open-id-connect-routing"; 
import { OpenIdConnectLogger } from "./open-id-connect-logger";

@autoinject
export class OpenIdConnect {

    constructor(
        private routerConfigurationService: OpenIdConnectRouting,
        private logger: OpenIdConnectLogger,
        public UserManager: UserManager) { }

    public Configure(routerConfiguration: RouterConfiguration) {

        // TODO throw if routerConfiguration is null
        // TODO throw is openIdConnectConfiguration is null (maybe - do we have defaults?)
        this.routerConfigurationService.ConfigureRouter(
            routerConfiguration,
            this.LoginRedirectHandler,
            this.PostLogoutRedirectHandler);
    }

    public Login() {
        this.logger.Debug("Login");

        // prevent Error: No matching state found in storage, 
        // possibly from duplicate state entries
        let stateStore: any = null;
        this.UserManager.clearStaleState(stateStore).then(() => {
            let args: any = {};
            this.UserManager.signinRedirect(args);
        });
    }

    public Logout() {
        this.logger.Debug("Logout");

        // signoutRedirect throws with empty/null data.
        this.UserManager.signoutRedirect({});
    }

    // This is public only to facilitate unit testing.
    // And is a lamda to capture the object in `this`.
    public LoginRedirectHandler = (): Promise<any> => {
        this.logger.Debug("LoginRedirectHandler");
        return this.UserManager.getUser().then((user) => {
            // avoid page refresh errors
            if (user === null || user === undefined) {
                this.logger.Debug(`user: ${user}`);
                this.logger.Debug(`window.location.href: ${window.location.href}`);
                return this.UserManager.signinRedirectCallback(null);
            }
        });
    }

    // This is public only to facilitate unit testing.
    // And is a lamda to capture the object in `this`.
    public PostLogoutRedirectHandler = (): Promise<any> => {
        this.logger.Debug("PostLogoutRedirectHandler");
        return this.UserManager.signoutRedirectCallback(null);
    }
}