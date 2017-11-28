import OpenIdConnect from "./open-id-connect";
import OpenIdConnectConfiguration from "./open-id-connect-configuration";
import OpenIdConnectRoles from "./open-id-connect-roles";
import OpenIdConnectUserObserver from "./open-id-connect-user-observer";
// by convention, the plugin is named `configure`
import configure from "./plugin";

export {
    configure,
    OpenIdConnect,
    OpenIdConnectRoles,
    OpenIdConnectConfiguration,
    OpenIdConnectUserObserver,
};
